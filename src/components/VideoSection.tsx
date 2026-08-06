"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const isIntersectingRef = useRef(false);
  const userInteractedRef = useRef(false);

  const startVideoPlayback = (unmute = false) => {
    if (!videoRef.current) return;
    
    if (unmute) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = isMuted;
    }

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          // Instantly duck background music when video plays
          window.dispatchEvent(new Event("fade-music-out"));
        })
        .catch(() => {
          // If browser blocked unmuted autoplay (e.g. mobile/Safari), fallback to muted play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                window.dispatchEvent(new Event("fade-music-out"));
              })
              .catch(() => {});
          }
        });
    }
  };

  const stopVideoPlayback = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    // Smoothly restore background music volume
    window.dispatchEvent(new Event("fade-music-in"));
  };

  // IntersectionObserver for mobile auto-play on scroll
  useEffect(() => {
    let observer: IntersectionObserver;

    if (videoRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isIntersectingRef.current = true;
              startVideoPlayback();
            } else {
              isIntersectingRef.current = false;
              stopVideoPlayback();
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(videoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Hover triggers for Desktop / Laptop
  const handleMouseEnter = () => {
    startVideoPlayback();
  };

  const handleMouseLeave = () => {
    if (!isIntersectingRef.current || !userInteractedRef.current) {
      stopVideoPlayback();
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    userInteractedRef.current = true;
    if (!videoRef.current) return;
    if (isPlaying) {
      stopVideoPlayback();
    } else {
      startVideoPlayback();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuteState = !isMuted;
    videoRef.current.muted = nextMuteState;
    setIsMuted(nextMuteState);

    if (!nextMuteState) {
      // If unmuting, make sure video is playing and background music is ducked
      if (videoRef.current.paused) {
        startVideoPlayback(true);
      } else {
        window.dispatchEvent(new Event("fade-music-out"));
      }
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
          onClick={togglePlay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-[1800px] aspect-[4/5] sm:aspect-[18/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-[4px] sm:border-[12px] border-[#FFFDFB] group cursor-pointer"
          style={{
            borderRadius: "40px / 80px",
          }}
        >
          {/* High-Speed Streaming HTML5 Video */}
          <video
            ref={videoRef}
            poster="/images/video_poster.jpg"
            preload="auto"
            loop
            muted={isMuted}
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/images/wedding_highlight.mp4" type="video/mp4" />
            <source src="/images/wedding_highlight.webm" type="video/webm" />
            <source src="/images/IMG_1797.MP4" type="video/mp4" />
          </video>

          {/* Custom Controls Overlay - Visible on Hover & Tap */}
          <div className="absolute bottom-5 sm:bottom-8 left-0 right-0 px-4 sm:px-12 flex items-center justify-between z-20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
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

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="flex items-center gap-2 bg-black/50 hover:bg-[#0E5C52] backdrop-blur-md text-white px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all shadow-lg cursor-pointer border border-white/20"
              title={isMuted ? "Unmute Video Audio" : "Mute Video Audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                  <span className="text-xs sm:text-sm font-medium tracking-wide">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  <span className="text-xs sm:text-sm font-medium tracking-wide">Mute</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
