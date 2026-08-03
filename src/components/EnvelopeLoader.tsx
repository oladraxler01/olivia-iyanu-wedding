"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Sparkles } from "lucide-react";

export default function EnvelopeLoader() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"envelope" | "text" | "done">("envelope");
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    // Setup main content initial state
    const main = document.querySelector("#main-content") as HTMLElement;
    if (main) {
      main.style.transform = "scale(0.96)";
      main.style.opacity = "0";
      main.style.transition =
        "transform 2.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 2.8s ease-in-out";
      main.style.transformOrigin = "center top";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Autoplay background music the exact second they open the envelope
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("start-music"));
    }

    setTimeout(() => {
      setStep("text");
    }, 1100);
  };

  useEffect(() => {
    if (step === "text") {
      const main = document.querySelector("#main-content") as HTMLElement;
      if (main) {
        main.style.transform = "scale(1)";
        main.style.opacity = "1";
      }
      setTimeout(() => {
        setStep("done");
      }, 4200);
    } else if (step === "done") {
      setTimeout(() => {
        setIsRemoved(true);
        document.body.style.overflow = "auto";
      }, 1200);
    }
  }, [step]);

  if (isRemoved) return null;

  const text = "#LetsDoLifeTogether";
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.12,
      },
    },
  };
  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden transition-colors duration-[1200ms] select-none ${
        step === "envelope"
          ? "bg-[#1E191D]/90 backdrop-blur-md"
          : "bg-transparent pointer-events-none"
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,rgba(14,92,82,0.1)_50%,transparent_100%)] pointer-events-none" />

      {/* Step 2: Hashtag typing screen */}
      <AnimatePresence>
        {step === "text" && (
          <motion.div
            key="text-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="absolute inset-0 flex items-center justify-center z-[9999] px-4 bg-[#FDFBF7]/85 backdrop-blur-md pointer-events-auto"
          >
            <motion.h1
              variants={sentence}
              initial="hidden"
              animate="visible"
              style={{ fontFamily: "var(--font-cormorant), cursive, serif" }}
              className="text-[#0E5C52] text-3xl sm:text-5xl md:text-6xl tracking-[0.08em] italic font-light text-center drop-shadow-xs"
            >
              {text.split("").map((char, index) => (
                <motion.span key={char + "-" + index} variants={letter} className="inline-block">
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Luxury Centered Invitation Envelope */}
      <AnimatePresence>
        {step === "envelope" && (
          <motion.div
            key="envelope-outer"
            exit={{ y: "100vh", opacity: 0, scale: 0.92 }}
            transition={{ duration: 1.1, ease: [0.32, 0, 0.67, 0] }}
            className="relative flex flex-col items-center justify-center w-full max-w-[560px] cursor-pointer"
            onClick={handleOpen}
          >
            {/* Ambient Floating Motion */}
            <motion.div
              animate={isOpen ? { y: 0 } : { y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
              className="relative w-full aspect-[1/1.12] sm:aspect-[1.25/1] max-h-[78vh] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),0_0_30px_rgba(212,175,55,0.2)] overflow-visible"
            >
              {/* Envelope Body Frame & Base */}
              <div className="absolute inset-0 bg-[#F4EFE6] rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 overflow-hidden shadow-inner">
                {/* Subtle paper grain overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F0] via-[#F3EDE2] to-[#EBE3D3] opacity-95" />

                {/* SVG Flaps (Left, Right, Bottom) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <defs>
                    <filter id="flap-shadow-left" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="0" stdDeviation="3" floodColor="#2a1f18" floodOpacity="0.18" />
                    </filter>
                    <filter id="flap-shadow-right" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="-2" dy="0" stdDeviation="3" floodColor="#2a1f18" floodOpacity="0.18" />
                    </filter>
                    <filter id="flap-shadow-bottom" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#2a1f18" floodOpacity="0.22" />
                    </filter>

                    <linearGradient id="envLeft" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#F9F6F0" />
                      <stop offset="100%" stopColor="#EDE6D8" />
                    </linearGradient>
                    <linearGradient id="envRight" x1="100%" y1="50%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor="#F9F6F0" />
                      <stop offset="100%" stopColor="#EDE6D8" />
                    </linearGradient>
                    <linearGradient id="envBottom" x1="50%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#EDE4D4" />
                      <stop offset="100%" stopColor="#FAF7F2" />
                    </linearGradient>

                    <linearGradient id="envGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C49B38" />
                      <stop offset="25%" stopColor="#FFEAA5" />
                      <stop offset="50%" stopColor="#9C7726" />
                      <stop offset="75%" stopColor="#FFF2C6" />
                      <stop offset="100%" stopColor="#B88A2E" />
                    </linearGradient>
                  </defs>

                  {/* Left Flap */}
                  <polygon points="0,0 48,50 0,100" fill="url(#envLeft)" filter="url(#flap-shadow-left)" />
                  <polyline points="0,0 48,50 0,100" fill="none" stroke="url(#envGoldFoil)" strokeWidth="0.8" />

                  {/* Right Flap */}
                  <polygon points="100,0 52,50 100,100" fill="url(#envRight)" filter="url(#flap-shadow-right)" />
                  <polyline points="100,0 52,50 100,100" fill="none" stroke="url(#envGoldFoil)" strokeWidth="0.8" />

                  {/* Bottom Flap */}
                  <polygon points="0,100 50,42 100,100" fill="url(#envBottom)" filter="url(#flap-shadow-bottom)" />
                  <polyline points="0,100 50,42 100,100" fill="none" stroke="url(#envGoldFoil)" strokeWidth="0.8" />
                </svg>

                {/* Corner Golden Accents */}
                <div className="absolute top-2.5 left-2.5 w-10 h-10 pointer-events-none z-10 opacity-70">
                  <svg viewBox="0 0 40 40" fill="none" stroke="url(#envGoldFoil)" strokeWidth="1.5">
                    <path d="M0,0 L20,0 M0,0 L0,20" />
                    <circle cx="8" cy="8" r="1.5" fill="#D4AF37" />
                  </svg>
                </div>
                <div className="absolute top-2.5 right-2.5 w-10 h-10 pointer-events-none z-10 opacity-70 rotate-90">
                  <svg viewBox="0 0 40 40" fill="none" stroke="url(#envGoldFoil)" strokeWidth="1.5">
                    <path d="M0,0 L20,0 M0,0 L0,20" />
                    <circle cx="8" cy="8" r="1.5" fill="#D4AF37" />
                  </svg>
                </div>
                <div className="absolute bottom-2.5 left-2.5 w-10 h-10 pointer-events-none z-10 opacity-70 -rotate-90">
                  <svg viewBox="0 0 40 40" fill="none" stroke="url(#envGoldFoil)" strokeWidth="1.5">
                    <path d="M0,0 L20,0 M0,0 L0,20" />
                    <circle cx="8" cy="8" r="1.5" fill="#D4AF37" />
                  </svg>
                </div>
                <div className="absolute bottom-2.5 right-2.5 w-10 h-10 pointer-events-none z-10 opacity-70 rotate-180">
                  <svg viewBox="0 0 40 40" fill="none" stroke="url(#envGoldFoil)" strokeWidth="1.5">
                    <path d="M0,0 L20,0 M0,0 L0,20" />
                    <circle cx="8" cy="8" r="1.5" fill="#D4AF37" />
                  </svg>
                </div>

                {/* Top Flap Container (Rotates 180° upon opening) */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isOpen ? 180 : 0 }}
                  transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                  className="absolute inset-0 z-20"
                >
                  {/* Front Face of Top Flap */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <defs>
                        <filter id="top-flap-drop" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#2a1f18" floodOpacity="0.25" />
                          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#2a1f18" floodOpacity="0.15" />
                        </filter>
                        <linearGradient id="envTop" x1="50%" y1="0%" x2="50%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#EDE6D9" />
                        </linearGradient>
                      </defs>

                      {/* Top Flap V-shape apex at 60% */}
                      <polygon points="0,0 100,0 50,60" fill="url(#envTop)" filter="url(#top-flap-drop)" />
                      <polyline points="0,0 50,59.5 100,0" fill="none" stroke="url(#envGoldFoil)" strokeWidth="1.2" strokeLinejoin="round" />
                      <polyline points="2,0 50,57.5 98,0" fill="none" stroke="url(#envGoldFoil)" strokeWidth="0.5" opacity="0.8" />
                    </svg>

                    {/* Typography on the Flap (Perfect vertical centering in upper 48% height) */}
                    <div className="absolute top-0 left-0 right-0 h-[48%] flex flex-col items-center justify-center text-center px-4 pointer-events-none z-10">
                      {/* Top Gold Divider */}
                      <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2 w-full max-w-[160px] opacity-80">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]" />
                        <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37]" />
                        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]" />
                      </div>

                      <p
                        style={{ fontFamily: "var(--font-cormorant), cursive, serif" }}
                        className="text-[#5A4D53] text-[13px] sm:text-[17px] md:text-[19px] italic font-light leading-tight mb-1"
                      >
                        You are lovingly invited to the wedding of
                      </p>

                      <h1 className="text-[#241B22] font-serif text-[22px] sm:text-[28px] md:text-[32px] tracking-[0.18em] uppercase font-normal leading-tight my-0.5 sm:my-1">
                        OLIVIA <span className="text-xs sm:text-sm font-light text-[#D4AF37] tracking-[0.2em] italic font-serif">&amp;</span> IYANU
                      </h1>

                      <p className="text-[#8C7A84] text-[10px] sm:text-[12px] tracking-[0.35em] font-medium font-mono mt-0.5 sm:mt-1">
                        30.10.2026
                      </p>
                    </div>
                  </div>

                  {/* Back Face of Top Flap (visible when flipped open) */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
                  >
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <polygon points="0,0 100,0 50,60" fill="#E8E1D5" />
                    </svg>
                  </div>
                </motion.div>

                {/* Wax Seal - Centered directly over the V-point (60% down) */}
                <AnimatePresence>
                  {!isOpen && (
                    <motion.div
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: 0.35, ease: "easeIn" }}
                      className="absolute z-40 pointer-events-auto cursor-pointer flex items-center justify-center"
                      style={{ top: "60%", left: "50%", transform: "translate(-50%, -50%)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen();
                      }}
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center group">
                        {/* Cast Shadow */}
                        <div className="absolute inset-1.5 bg-black/45 blur-md rounded-full translate-y-2 scale-95 group-hover:scale-105 transition-transform duration-300" />

                        {/* Wax Blob Base */}
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-[#ECC870] via-[#BA8A24] to-[#78530B] group-hover:scale-105 transition-transform duration-300"
                          style={{
                            borderRadius: "52% 48% 54% 46% / 46% 54% 44% 56%",
                            boxShadow:
                              "inset 3px 3px 8px rgba(255, 245, 200, 0.8), inset -4px -4px 10px rgba(50, 30, 0, 0.9), 0 6px 14px rgba(0,0,0,0.45)",
                          }}
                        >
                          <div className="absolute inset-[1px] rounded-full border border-white/40 blur-[0.5px] mix-blend-overlay" />
                        </div>

                        {/* Outer Stamped Rim */}
                        <div
                          className="absolute inset-[13%] bg-gradient-to-tl from-[#D4AF37] to-[#996D12]"
                          style={{
                            borderRadius: "48% 52% 46% 54% / 54% 46% 52% 48%",
                            boxShadow:
                              "inset -2px -2px 5px rgba(255,245,210,0.7), inset 3px 3px 7px rgba(40,20,0,0.85), 1px 1px 4px rgba(0,0,0,0.4)",
                          }}
                        />

                        {/* Inner Debossed Center */}
                        <div
                          className="absolute inset-[22%] bg-gradient-to-br from-[#734A06] to-[#C99C2B]"
                          style={{
                            borderRadius: "50%",
                            boxShadow:
                              "inset 3px 3px 8px rgba(25,12,0,0.95), inset -2px -2px 5px rgba(255,240,180,0.5)",
                          }}
                        >
                          <Flower2
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#F8E3A8]"
                            style={{
                              filter:
                                "drop-shadow(1px 1px 1px rgba(255,255,255,0.4)) drop-shadow(-1.5px -1.5px 2px rgba(25,12,0,0.95))",
                            }}
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Click to Open Helper Pill */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-[#D4AF37]/40 text-[#FAF7F2] text-xs sm:text-sm font-medium tracking-wide shadow-lg hover:bg-white/25 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE082] animate-pulse" />
                <span>Tap seal to open invitation</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
