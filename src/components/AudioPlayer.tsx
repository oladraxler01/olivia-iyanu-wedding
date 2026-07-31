"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let fadeInterval: NodeJS.Timeout;

    const handleStartMusic = () => {
      if (audioRef.current) {
        audioRef.current.volume = 1;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          window.dispatchEvent(new CustomEvent("music-state-change", { detail: { isPlaying: true } }));
        }).catch((e) => console.log("Audio play failed:", e));
      }
    };

    const handleStopMusic = () => {
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
        if (audioRef.current && audioRef.current.volume > 0.1) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
    };

    const fadeInMusic = () => {
      if (!audioRef.current) return;
      if (audioRef.current.paused) return; // Don't fade in if it's paused manually
      
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 1) {
          audioRef.current.volume = Math.min(1, audioRef.current.volume + 0.05);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
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
