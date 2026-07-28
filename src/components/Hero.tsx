"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen w-full flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/perfect%20harmony.PNG" 
          alt="Olivia and Iyanu Pre-wedding"
          fill
          className="object-cover object-[center_top] md:object-center"
          priority
        />
        {/* Dark elegant overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient overlay to soften the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center mt-12 w-full px-4">
        
        {/* Elegant Text Overlay */}
        <div className="relative flex flex-col items-center min-w-[320px] sm:min-w-[400px]">
          {/* Eyebrow Badge */}
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8C3D3] mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            WE'RE GETTING MARRIED
          </p>

          {/* Stacked Names */}
          <div className="flex flex-col items-center justify-center my-4">
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-white tracking-widest leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              OLIVIA
            </h1>
            <span className="font-serif italic text-3xl sm:text-4xl text-[#D4AF37] my-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              &amp;
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-white tracking-widest leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              IYANU
            </h1>
          </div>

          {/* Horizontal Divider Line */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-8 opacity-90 drop-shadow-md"></div>

          {/* Date & Location text */}
          <div className="space-y-3 text-xs sm:text-sm text-white/90 font-medium tracking-widest text-center">
            <p className="font-serif text-lg tracking-[0.2em] text-[#FDFCFB] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">30 OCTOBER 2026</p>
            <p className="text-white/80 text-[10px] uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">LAGOS, NIGERIA</p>
          </div>
        </div>
        
        <p className="text-[#D4AF37] font-bold text-xs mt-12 italic tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] relative z-10">#LetsDoLifeTogether</p>
      </div>
    </section>
  );
}
