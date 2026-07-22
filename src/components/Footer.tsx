"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#241B22] text-[#FDFBF7] py-12 px-4 text-center border-t border-[#B23A6B]/30">
      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="font-serif text-3xl font-light text-white">
          Olivia <span className="font-serif italic text-[#E091B4]">&amp;</span> Iyanu
        </h3>

        <div className="inline-block px-4 py-1 rounded-full bg-[#B23A6B]/20 border border-[#B23A6B]/40 text-[#E091B4] text-xs font-mono font-bold tracking-widest">
          #OliviaAndIyanu2026
        </div>

        <p className="text-xs text-[#E3D3DA]/70 font-light flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-[#E091B4] fill-[#E091B4]" /> for Olivia &amp; Iyanu’s Wedding
        </p>

        <p className="text-[10px] text-[#E3D3DA]/40">
          &copy; 2026 Olivia &amp; Iyanu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
