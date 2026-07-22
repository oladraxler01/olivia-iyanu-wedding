"use client";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen w-full bg-[#F9F1F4] flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center relative">
      {/* Eyebrow Badge */}
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-4">
        WE'RE GETTING MARRIED
      </p>

      {/* Stacked Names as shown in 2nd Image */}
      <div className="flex flex-col items-center justify-center my-2">
        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-light text-[#0E5C52] tracking-tight leading-none">
          Olivia
        </h1>
        <span className="font-serif italic text-4xl sm:text-6xl text-[#B23A6B] my-1 sm:my-2">
          &amp;
        </span>
        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-light text-[#0E5C52] tracking-tight leading-none">
          Iyanu
        </h1>
      </div>

      {/* Horizontal Divider Line */}
      <div className="w-12 sm:w-16 h-[2px] bg-[#B23A6B]/50 my-6"></div>

      {/* Date & Location text */}
      <div className="space-y-1 text-xs sm:text-sm text-[#241B22]/80 font-medium tracking-wide">
        <p className="font-sans">30 October 2026</p>
        <p className="text-[#6B5A63] text-[11px]">Lagos, Nigeria</p>
      </div>
    </section>
  );
}
