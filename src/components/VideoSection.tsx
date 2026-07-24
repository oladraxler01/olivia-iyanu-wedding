"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Player from "@vimeo/player";

export default function VideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);

    player.on("volumechange", (data: any) => {
      if (data.volume > 0) {
        window.dispatchEvent(new Event("stop-music"));
      }
    });

    player.on("play", () => {
      player.getVolume().then((volume: number) => {
        if (volume > 0) {
          window.dispatchEvent(new Event("stop-music"));
        }
      });
    });

    return () => {
      player.destroy();
    };
  }, []);

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
          className="relative w-full max-w-[1800px] aspect-video sm:aspect-[18/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-[6px] sm:border-[12px] border-[#FFFDFB]"
          style={{
            borderRadius: "70px / 140px",
          }}
        >
          {/* Vimeo Embed */}
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1212676451?autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0"
            className="absolute inset-0 w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
    </section>
  );
}
