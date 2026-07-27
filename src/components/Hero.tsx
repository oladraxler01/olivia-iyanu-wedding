"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen w-full flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/IMG-20260722-WA0011.jpg" 
          alt="Olivia and Iyanu Pre-wedding"
          fill
          className="object-cover object-[center_25%]"
          priority
        />
        {/* Dark elegant overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient overlay to soften the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center mt-12">
        
        {/* Elegant Invitation Box */}
        <div className="relative border border-white/20 p-10 sm:p-16 md:p-20 bg-black/20 backdrop-blur-sm shadow-2xl flex flex-col items-center min-w-[320px] sm:min-w-[400px]">
          {/* Golden Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37] -translate-x-2 -translate-y-2 opacity-80"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37] translate-x-2 -translate-y-2 opacity-80"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37] -translate-x-2 translate-y-2 opacity-80"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37] translate-x-2 translate-y-2 opacity-80"></div>

          {/* Eyebrow Badge */}
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8C3D3] mb-6 drop-shadow-md">
            WE'RE GETTING MARRIED
          </p>

          {/* Stacked Names */}
          <div className="flex flex-col items-center justify-center my-4 drop-shadow-xl">
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-white tracking-widest leading-none">
              OLIVIA
            </h1>
            <span className="font-serif italic text-3xl sm:text-4xl text-[#D4AF37] my-3">
              &amp;
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-white tracking-widest leading-none">
              IYANU
            </h1>
          </div>

          {/* Horizontal Divider Line */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-8 opacity-70"></div>

          {/* Date & Location text */}
          <div className="space-y-3 text-xs sm:text-sm text-white/90 font-medium tracking-widest drop-shadow-md text-center">
            <p className="font-serif text-lg tracking-[0.2em] text-[#FDFCFB]">30 OCTOBER 2026</p>
            <p className="text-white/60 text-[10px] uppercase tracking-[0.3em]">LAGOS, NIGERIA</p>
          </div>
        </div>
        
        <p className="text-[#D4AF37] font-bold text-xs mt-8 italic tracking-[0.15em] drop-shadow-md relative z-10">#LetsDoLifeTogether</p>
      </div>
    </section>
  );
}
