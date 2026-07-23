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
      <div className="relative z-10 flex flex-col items-center">
        {/* Eyebrow Badge */}
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F9F1F4] mb-4 drop-shadow-md">
          WE'RE GETTING MARRIED
        </p>

        {/* Stacked Names as shown in 2nd Image */}
        <div className="flex flex-col items-center justify-center my-2 drop-shadow-xl">
          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-light text-white tracking-tight leading-none">
            Olivia
          </h1>
          <span className="font-serif italic text-4xl sm:text-6xl text-[#E8C3D3] my-1 sm:my-2">
            &amp;
          </span>
          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-light text-white tracking-tight leading-none">
            Iyanu
          </h1>
        </div>

        {/* Horizontal Divider Line */}
        <div className="w-12 sm:w-16 h-[2px] bg-white/50 my-6"></div>

        {/* Date & Location text */}
        <div className="space-y-1 text-xs sm:text-sm text-white/90 font-medium tracking-wide drop-shadow-md">
          <p className="font-sans">30 October 2026</p>
          <p className="text-white/70 text-[11px] uppercase tracking-[0.1em]">Lagos, Nigeria</p>
        </div>
      </div>
    </section>
  );
}
