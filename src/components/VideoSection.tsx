"use client";

import { motion } from "framer-motion";

export default function VideoSection() {
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
            // Creating a deep, beautiful visual curve
            borderRadius: "70px / 140px",
          }}
        >
          {/* Real Pre-Wedding Video */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/images/OLIVIA%20&%20IYANUOLUWA%20PRE%20WEDDING%20VIDEO.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
      </motion.div>
    </section>
  );
}
