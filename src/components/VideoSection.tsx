"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (videoRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.muted = false;
              setIsMuted(false);
              videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
              window.dispatchEvent(new Event("fade-music-out"));
            }
          } else {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.pause();
              window.dispatchEvent(new Event("fade-music-in"));
            }
          }
        });
      }, { threshold: 0.6 });
      
      observer.observe(videoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      // If we are unmuting, dispatch event to fade out background music
      window.dispatchEvent(new Event("fade-music-out"));
    } else {
      // If we are muting, dispatch event to fade in background music
      window.dispatchEvent(new Event("fade-music-in"));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FDFBF7] overflow-hidden flex flex-col items-center">
      {/* Section Heading */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-8"
      >
        Save The Date
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full px-1 sm:px-4 flex justify-center"
      >
        {/* Massive Visually Curved Video Container */}
        <div
          className="relative w-full max-w-[1800px] aspect-[4/5] sm:aspect-[18/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-[4px] sm:border-[12px] border-[#FFFDFB] group"
          style={{
            borderRadius: "40px / 80px",
          }}
        >
          {/* HTML5 Video */}
          <video
            ref={videoRef}
            src="/images/IMG_1797.MP4"
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>

          {/* Custom Controls Overlay - Shows on Hover */}
          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-8 sm:px-12 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-black/40 hover:bg-[#B23A6B]/80 backdrop-blur-md text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full transition-all shadow-lg"
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>

            <button
              onClick={toggleMute}
              className="flex items-center gap-2 bg-black/40 hover:bg-[#B23A6B]/80 backdrop-blur-md text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full transition-all shadow-lg"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </button>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
