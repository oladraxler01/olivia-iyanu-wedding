"use client";

import { useState, useEffect, useRef } from "react";

export default function AudioPlayer() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef<boolean>(false);

  useEffect(() => {
    setMounted(true);
    let fadeInterval: NodeJS.Timeout;

    const playAudio = () => {
      if (!audioRef.current) return;
      shouldPlayRef.current = true;
      audioRef.current.volume = 1;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            window.dispatchEvent(
              new CustomEvent("music-state-change", { detail: { isPlaying: true } })
            );
          })
          .catch((err) => {
            console.log("Autoplay prevented by mobile browser policy:", err);
            // On mobile iOS/Android, if autoplay was blocked before user gesture,
            // unlock audio on the very first touch/scroll interaction anywhere on the screen
            const unlockAudio = () => {
              if (audioRef.current && shouldPlayRef.current) {
                audioRef.current.play().then(() => {
                  setIsPlaying(true);
                  window.dispatchEvent(
                    new CustomEvent("music-state-change", { detail: { isPlaying: true } })
                  );
                }).catch(() => {});
              }
              document.removeEventListener("touchstart", unlockAudio);
              document.removeEventListener("touchend", unlockAudio);
              document.removeEventListener("click", unlockAudio);
              document.removeEventListener("scroll", unlockAudio);
            };

            document.addEventListener("touchstart", unlockAudio, { passive: true });
            document.addEventListener("touchend", unlockAudio, { passive: true });
            document.addEventListener("click", unlockAudio, { passive: true });
            document.addEventListener("scroll", unlockAudio, { passive: true });
          });
      }
    };

    const handleStartMusic = () => {
      playAudio();
    };

    const handleStopMusic = () => {
      shouldPlayRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        window.dispatchEvent(
          new CustomEvent("music-state-change", { detail: { isPlaying: false } })
        );
      }
    };

    const handleToggleMusic = () => {
      if (!audioRef.current) return;
      if (audioRef.current.paused) {
        handleStartMusic();
      } else {
        handleStopMusic();
      }
    };

    const fadeOutMusic = () => {
      if (!audioRef.current) return;
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume = Math.max(
            0,
            Number((audioRef.current.volume - 0.2).toFixed(2))
          );
        } else {
          if (audioRef.current) {
            audioRef.current.volume = 0;
            audioRef.current.pause();
          }
          clearInterval(fadeInterval);
        }
      }, 30);
    };

    const fadeInMusic = () => {
      if (!audioRef.current) return;
      if (!shouldPlayRef.current) return; // Don't play if user never opened envelope or explicitly stopped

      clearInterval(fadeInterval);
      audioRef.current.volume = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeInterval = setInterval(() => {
            if (audioRef.current && audioRef.current.volume < 1) {
              audioRef.current.volume = Math.min(
                1,
                Number((audioRef.current.volume + 0.1).toFixed(2))
              );
            } else {
              clearInterval(fadeInterval);
            }
          }, 40);
        })
        .catch(() => {});
    };

    window.addEventListener("start-music", handleStartMusic);
    window.addEventListener("stop-music", handleStopMusic);
    window.addEventListener("toggle-music", handleToggleMusic);
    window.addEventListener("fade-music-out", fadeOutMusic);
    window.addEventListener("fade-music-in", fadeInMusic);

    return () => {
      window.removeEventListener("start-music", handleStartMusic);
      window.removeEventListener("stop-music", handleStopMusic);
      window.removeEventListener("toggle-music", handleToggleMusic);
      window.removeEventListener("fade-music-out", fadeOutMusic);
      window.removeEventListener("fade-music-in", fadeInMusic);
      clearInterval(fadeInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      playsInline
      className="hidden"
    >
      <source src="/images/envelope_music.mp3" type="audio/mpeg" />
      <source src="/images/envelope_music.m4a" type="audio/mp4" />
      <source src="/images/envelope_music.webm" type="audio/webm" />
    </audio>
  );
}
