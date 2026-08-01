"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef<boolean>(false);

  useEffect(() => {
    let fadeInterval: NodeJS.Timeout;

    const handleStartMusic = () => {
      if (audioRef.current) {
        shouldPlayRef.current = true;
        audioRef.current.volume = 1;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          window.dispatchEvent(new CustomEvent("music-state-change", { detail: { isPlaying: true } }));
        }).catch((e) => console.log("Audio play failed:", e));
      }
    };

    const handleStopMusic = () => {
      shouldPlayRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        window.dispatchEvent(new CustomEvent("music-state-change", { detail: { isPlaying: false } }));
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
        if (audioRef.current && audioRef.current.volume > 0.15) {
          audioRef.current.volume = Math.max(0.05, Number((audioRef.current.volume - 0.1).toFixed(2)));
        } else {
          if (audioRef.current) audioRef.current.volume = 0.05;
          clearInterval(fadeInterval);
        }
      }, 80);
    };

    const fadeInMusic = () => {
      if (!audioRef.current) return;
      if (!shouldPlayRef.current) return; // Don't play if user never opened envelope or explicitly stopped
      
      // On mobile or if paused by other media, resume play
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});

      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 1) {
          audioRef.current.volume = Math.min(1, Number((audioRef.current.volume + 0.1).toFixed(2)));
        } else {
          clearInterval(fadeInterval);
        }
      }, 80);
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

  return (
    <audio 
      ref={audioRef} 
      src="/images/envelope_music.webm" 
      loop 
      preload="auto"
    />
  );
}
