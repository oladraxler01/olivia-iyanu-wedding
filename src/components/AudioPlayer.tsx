"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleStartMusic = () => {
      if (audioRef.current) {
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

    window.addEventListener("start-music", handleStartMusic);
    window.addEventListener("stop-music", handleStopMusic);
    window.addEventListener("toggle-music", handleToggleMusic);
    
    return () => {
      window.removeEventListener("start-music", handleStartMusic);
      window.removeEventListener("stop-music", handleStopMusic);
      window.removeEventListener("toggle-music", handleToggleMusic);
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
