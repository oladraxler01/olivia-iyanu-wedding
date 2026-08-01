"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2 } from "lucide-react";

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
      main.style.transform = "scale(0.95)";
      main.style.opacity = "0";
      main.style.transition = "transform 3.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 3.5s ease-in-out";
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
    window.dispatchEvent(new Event("start-music"));

    setTimeout(() => {
      setStep("text");
    }, 1200);
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
      }, 4500); // Wait for typing animation + short pause
    } else if (step === "done") {
      setTimeout(() => {
        setIsRemoved(true);
        document.body.style.overflow = "auto";
      }, 1500);
    }
  }, [step]);

  if (isRemoved) return null;

  const text = "#LetsDoLifeTogether";
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.15,
      },
    },
  };
  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-[1500ms] ${step === "envelope" ? "bg-[#F4F1EA]" : "bg-transparent pointer-events-none"}`}>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_100%)] pointer-events-none"></div>

      <AnimatePresence>
        {step === "text" && (
          <motion.div
            key="text-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 flex items-center justify-center z-[9999] px-4 bg-[#F4F1EA]/70 backdrop-blur-sm pointer-events-auto"
          >
            <motion.h1
              variants={sentence}
              initial="hidden"
              animate="visible"
              style={{ fontFamily: "var(--font-cormorant), cursive, serif" }}
              className="text-[#3A4A2C] text-3xl md:text-5xl lg:text-6xl tracking-[0.1em] italic font-light text-center drop-shadow-sm"
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

      <AnimatePresence>
        {step === "envelope" && (
          <motion.div
            key="envelope-wrapper"
            exit={{ y: "100vh", opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.32, 0, 0.67, 0] }}
            // Literally covers the ENTIRE SCREEN edge to edge
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={handleOpen}
          >

            {/* Ambient Floating Animation */}
            <motion.div
              animate={isOpen ? { y: 0 } : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
              className="relative w-full h-full z-10"
            >

              {/* Back of Envelope */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EBB8BF] to-[#C9888D] shadow-2xl z-10"></div>

              {/* SVG Flaps (Left, Right, Bottom) - Deep overlap exactly like reference */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <filter id="velvet-shadow-left" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
                    <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" result="textured" />
                    <feDropShadow dx="2" dy="0" stdDeviation="2" floodOpacity="0.12" in="textured" />
                  </filter>
                  <filter id="velvet-shadow-right" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
                    <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" result="textured" />
                    <feDropShadow dx="-2" dy="0" stdDeviation="2" floodOpacity="0.12" in="textured" />
                  </filter>
                  <filter id="velvet-shadow-bottom" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
                    <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" result="textured" />
                    <feDropShadow dx="0" dy="-3" stdDeviation="3" floodOpacity="0.15" in="textured" />
                  </filter>
                  <filter id="velvet-shadow-top" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
                    <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" result="textured" />
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.15" in="textured" />
                  </filter>

                  <linearGradient id="velvetPink" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D0D6" />
                    <stop offset="50%" stopColor="#EBB8BF" />
                    <stop offset="100%" stopColor="#D99A9F" />
                  </linearGradient>

                  <linearGradient id="velvetPinkDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EBB8BF" />
                    <stop offset="100%" stopColor="#C9888D" />
                  </linearGradient>
                </defs>

                {/* Left Flap */}
                <polygon points="0,0 50,55 0,100" fill="url(#velvetPink)" filter="url(#velvet-shadow-left)" />
                {/* Thick Black Edge Left */}
                <polyline points="0,0 49.8,55 0,100" fill="none" stroke="#1A1618" strokeWidth="0.4" />
                <polyline points="0,2 47.8,55 0,98" fill="none" stroke="#1A1618" strokeWidth="0.1" opacity="0.6" />

                {/* Right Flap */}
                <polygon points="100,0 50,55 100,100" fill="url(#velvetPink)" filter="url(#velvet-shadow-right)" />
                {/* Thick Black Edge Right */}
                <polyline points="100,0 50.2,55 100,100" fill="none" stroke="#1A1618" strokeWidth="0.4" />
                <polyline points="100,2 52.2,55 100,98" fill="none" stroke="#1A1618" strokeWidth="0.1" opacity="0.6" />

                {/* Bottom Flap */}
                <polygon points="0,100 50,40 100,100" fill="url(#velvetPinkDark)" filter="url(#velvet-shadow-bottom)" />
                {/* Thick Black Edge Bottom */}
                <polyline points="0,100 50,40.2 100,100" fill="none" stroke="#1A1618" strokeWidth="0.4" />
                <polyline points="2,100 50,42.2 98,100" fill="none" stroke="#1A1618" strokeWidth="0.1" opacity="0.6" />
              </svg>

              {/* Corner Filigree Ornaments - Enhanced & Enlarged with Black */}
              <div className="absolute top-4 left-4 w-32 h-32 pointer-events-none z-20 opacity-90">
                <svg viewBox="0 0 100 100" fill="none" stroke="#1A1618" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#1A1618" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#1A1618" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#1A1618" stroke="none" />
                </svg>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 pointer-events-none z-20 opacity-90" style={{ transform: "scaleX(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="#1A1618" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#1A1618" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#1A1618" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#1A1618" stroke="none" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 w-32 h-32 pointer-events-none z-20 opacity-90" style={{ transform: "scaleY(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="#1A1618" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#1A1618" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#1A1618" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#1A1618" stroke="none" />
                </svg>
              </div>
              <div className="absolute bottom-4 right-4 w-32 h-32 pointer-events-none z-20 opacity-90" style={{ transform: "scale(-1, -1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="#1A1618" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#1A1618" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#1A1618" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#1A1618" stroke="none" />
                </svg>
              </div>

              {/* Top Flap (Rotates 180deg) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpen ? 180 : 0 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                className="absolute inset-0 z-30"
              >
                {/* Front Face of Top Flap */}
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Deep V-shaped Top Flap goes down to 65% height exactly like reference */}
                    <polygon points="0,0 100,0 50,65" fill="url(#velvetPink)" filter="url(#velvet-shadow-top)" />
                    {/* Thick Black Edge Main */}
                    <polyline points="0,0 50,64.8 100,0" fill="none" stroke="#1A1618" strokeWidth="0.6" />
                    {/* Inner Black Double Lines */}
                    <polyline points="2,0 50,62 98,0" fill="none" stroke="#1A1618" strokeWidth="0.2" opacity="0.8" />
                    <polyline points="4,0 50,59 96,0" fill="none" stroke="#1A1618" strokeWidth="0.1" opacity="0.5" />
                  </svg>

                  {/* Typography on the Flap */}
                  <div className="absolute top-[12%] md:top-[12%] left-0 w-full text-center flex flex-col items-center justify-start pointer-events-none px-4">

                    {/* Top Ornament */}
                    <div className="flex items-center justify-center gap-4 mb-4 w-full max-w-[240px] opacity-80">
                      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#1A1618]"></div>
                      <div className="w-2 h-2 rotate-45 border border-[#1A1618]"></div>
                      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#1A1618]"></div>
                    </div>

                    <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#3A3336] text-xl sm:text-3xl md:text-4xl italic font-light mb-4 sm:mb-5">
                      You are lovingly invited to the wedding of
                    </p>

                    <h1 className="text-[#1A1618] font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase mb-4 leading-normal">
                      OLIVIA <br /> <span className="text-xl sm:text-2xl font-light text-[#1A1618]">AND</span> <br /> IYANU
                    </h1>

                    {/* Bottom Ornament */}
                    <div className="flex items-center justify-center gap-3 mt-1 mb-3 w-full max-w-[120px] opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1A1618]"></div>
                      <div className="h-[1px] flex-grow bg-[#1A1618]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1A1618]"></div>
                    </div>

                    <p className="text-[#3A3336] text-sm sm:text-lg tracking-[0.4em] font-medium font-mono mt-1">
                      30.10.2026
                    </p>
                  </div>
                </div>

                {/* Back Face of Top Flap (visible when open) */}
                <div className="absolute inset-0" style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon points="0,0 100,0 50,65" fill="url(#velvetPinkDark)" />
                  </svg>
                </div>
              </motion.div>

              {/* Ultra-Realistic Botanical Black Wax Stamp */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, ease: "easeIn" }}
                    className="absolute z-50 pointer-events-auto cursor-pointer flex items-center justify-center"
                    // Placed EXACTLY over the tip of the top flap (65% down)
                    style={{ top: "65%", left: "50%", transform: "translate(-50%, -50%)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                    }}
                  >
                    <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center group">

                      {/* Organic Melted Wax Outer Blob */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#4A4547] via-[#1A1618] to-[#0A0809] shadow-[0_15px_35px_rgba(0,0,0,0.4),inset_0_-8px_20px_rgba(0,0,0,0.3),inset_0_8px_20px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500"
                        style={{ borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%" }}
                      ></div>

                      {/* Inner Stamped Depression */}
                      <div
                        className="absolute inset-4 bg-gradient-to-br from-[#0A0809] to-[#2B2628] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_2px_5px_rgba(255,255,255,0.1)]"
                        style={{ borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%" }}
                      ></div>

                      {/* Floral Wreath Icon */}
                      <Flower2 className="relative z-10 w-12 h-12 md:w-16 md:h-16 text-[#F5D0D6] drop-shadow-[0_2px_1px_rgba(0,0,0,0.6)]" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
