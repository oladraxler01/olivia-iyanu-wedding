"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoSection() {
  return (
    <section className="py-20 px-4 bg-[#FDFBF7]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Section Heading */}
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-6">
          Save The Date
        </p>

        {/* Curved Plasma TV Video Container */}
        <div
          style={{
            borderRadius: "24px / 60px",
          }}
          className="relative w-full aspect-[16/9] bg-gradient-to-b from-[#F3E7EB]/80 to-[#FDFBF7] border border-[#E3D3DA] shadow-lg overflow-hidden flex items-center justify-center"
        >
          {/* Video element placeholder — swap src later */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
            playsInline
            muted
          />

          {/* Centered Play Button + Prompt */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <button className="w-16 h-16 rounded-full border-2 border-[#B23A6B]/40 bg-[#FFFDFB] flex items-center justify-center shadow-md hover:bg-[#B23A6B] hover:border-[#B23A6B] group transition-all cursor-pointer">
              <Play className="w-6 h-6 text-[#B23A6B] group-hover:text-white transition-colors ml-0.5" />
            </button>
            <p className="text-sm text-[#6B5A63] font-medium">
              Add your save-the-date video here
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
