"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Player from "@vimeo/player";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);
    playerRef.current = player;

    player.on("volumechange", (data: any) => {
      if (data.volume > 0) {
        setIsMuted(false);
        window.dispatchEvent(new Event("stop-music"));
      } else {
        setIsMuted(true);
      }
    });

    player.on("play", () => setIsPlaying(true));
    player.on("pause", () => setIsPlaying(false));

    return () => {
      player.destroy();
    };
  }, []);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.setVolume(1);
      window.dispatchEvent(new Event("stop-music"));
    } else {
      playerRef.current.setVolume(0);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
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
        className="w-full px-2 sm:px-4 flex justify-center"
      >
        {/* Massive Visually Curved Video Container */}
        <div
          className="relative w-full max-w-[1800px] aspect-video sm:aspect-[18/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-[6px] sm:border-[12px] border-[#FFFDFB] group"
          style={{
            borderRadius: "70px / 140px",
          }}
        >
          {/* Vimeo Embed - intrinsic ratio trick to force a perfect 9:16 portrait aspect ratio */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none"
            style={{ paddingBottom: "177.77%" }}
          >
            <iframe
              ref={iframeRef}
              src="https://player.vimeo.com/video/1212676451?background=1"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

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
