"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted & playsInline for guaranteed mobile & desktop autoplay
    video.muted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Once the video section enters view, automatically play and lower background music
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                  window.dispatchEvent(new Event("fade-music-out"));
                })
                .catch(() => {});
            }
          } else {
            // Once user scrolls away from the video, pause and restore background music
            video.pause();
            setIsPlaying(false);
            window.dispatchEvent(new Event("fade-music-in"));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        window.dispatchEvent(new Event("fade-music-out"));
      }).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      window.dispatchEvent(new Event("fade-music-in"));
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
        className="w-full px-2 sm:px-6 flex justify-center"
      >
        {/* Massive Visually Curved Video Container */}
        <div
          ref={containerRef}
          onClick={togglePlay}
          className="relative w-full max-w-[1800px] aspect-[4/5] sm:aspect-[18/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-[4px] sm:border-[12px] border-[#FFFDFB] group cursor-pointer"
          style={{
            borderRadius: "40px / 80px",
          }}
        >
          {/* Full High-Definition Original Video with Guaranteed Autoplay */}
          <video
            ref={videoRef}
            src="/images/IMG_1797.MP4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover"
            onPlay={() => {
              setIsPlaying(true);
              window.dispatchEvent(new Event("fade-music-out"));
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
          />

          {/* Custom Controls Overlay - Shows on Hover & Mobile Tap */}
          <div className="absolute bottom-5 sm:bottom-8 left-0 right-0 px-4 sm:px-12 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 bg-black/50 hover:bg-[#B23A6B] backdrop-blur-md text-white px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all shadow-lg cursor-pointer border border-white/20"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              )}
              <span className="text-xs sm:text-sm font-medium tracking-wide">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
