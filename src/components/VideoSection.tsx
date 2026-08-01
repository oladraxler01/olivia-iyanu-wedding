"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isIntersectingRef = useRef(false);

  const startVideoPlayback = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setIsMuted(false);
    videoRef.current.play().then(() => {
      setIsPlaying(true);
      window.dispatchEvent(new Event("fade-music-out"));
    }).catch(() => {
      // If unmuted autoplay blocked by browser policy, try playing muted first
      if (videoRef.current) {
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    });
  };

  const stopVideoPlayback = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    window.dispatchEvent(new Event("fade-music-in"));
  };

  useEffect(() => {
    let observer: IntersectionObserver;

    if (videoRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isIntersectingRef.current = true;
            startVideoPlayback();
          } else {
            isIntersectingRef.current = false;
            stopVideoPlayback();
          }
        });
      }, { threshold: 0.25 });
      
      observer.observe(videoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    startVideoPlayback();
  };

  const handleMouseLeave = () => {
    if (!isIntersectingRef.current) {
      stopVideoPlayback();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      stopVideoPlayback();
    } else {
      startVideoPlayback();
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-[1800px] aspect-[4/5] sm:aspect-[18/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-[4px] sm:border-[12px] border-[#FFFDFB] group cursor-pointer"
          style={{
            borderRadius: "40px / 80px",
          }}
        >
          {/* HTML5 Video */}
          <video
            ref={videoRef}
            src="/images/IMG_1797.MP4"
            className="absolute top-0 left-0 w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>

          {/* Custom Controls Overlay - Shows on Hover */}
          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-8 sm:px-12 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="flex items-center gap-2 bg-black/40 hover:bg-[#B23A6B]/80 backdrop-blur-md text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full transition-all shadow-lg cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
