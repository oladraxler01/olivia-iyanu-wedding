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
      transition: { duration: 0.5, ease: "easeOut" as const }
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
              <div className="absolute inset-0 bg-[#F2EDE4] shadow-[inset_0_0_50px_rgba(0,0,0,0.05)] z-10"></div>

              {/* SVG Flaps (Left, Right, Bottom) - Deep overlap exactly like reference */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  {/* Highly realistic multi-layered shadow for paper depth (Ambient Occlusion) */}
                  <filter id="shadow-left" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="3" dy="0" stdDeviation="4" floodColor="#3a2a22" floodOpacity="0.15" />
                    <feDropShadow dx="1" dy="0" stdDeviation="1" floodColor="#3a2a22" floodOpacity="0.1" />
                  </filter>
                  <filter id="shadow-right" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-3" dy="0" stdDeviation="4" floodColor="#3a2a22" floodOpacity="0.15" />
                    <feDropShadow dx="-1" dy="0" stdDeviation="1" floodColor="#3a2a22" floodOpacity="0.1" />
                  </filter>
                  <filter id="shadow-bottom" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="-4" stdDeviation="5" floodColor="#3a2a22" floodOpacity="0.2" />
                    <feDropShadow dx="0" dy="-1" stdDeviation="1.5" floodColor="#3a2a22" floodOpacity="0.1" />
                  </filter>

                  {/* Paper Lighting Gradients to simulate curved physical paper catching light */}
                  <linearGradient id="paperLeft" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#F8F6F0" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                  <linearGradient id="paperRight" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#F8F6F0" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                  <linearGradient id="paperBottom" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#F0EBE1" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>

                  {/* Metallic Gold Foil Gradient (Shimmering) */}
                  <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B38B36" />
                    <stop offset="25%" stopColor="#FFDF73" />
                    <stop offset="50%" stopColor="#9C7726" />
                    <stop offset="75%" stopColor="#FFECA8" />
                    <stop offset="100%" stopColor="#B38B36" />
                  </linearGradient>
                </defs>

                {/* Left Flap (Goes deep to 55%) */}
                <polygon points="0,0 50,55 0,100" fill="url(#paperLeft)" filter="url(#shadow-left)" />
                {/* Thick Gold Foil Edge Left */}
                <polyline points="0,0 49.5,55 0,100" fill="none" stroke="url(#goldFoil)" strokeWidth="1.2" strokeLinejoin="round" />

                {/* Right Flap (Goes deep to 55%) */}
                <polygon points="100,0 50,55 100,100" fill="url(#paperRight)" filter="url(#shadow-right)" />
                {/* Thick Gold Foil Edge Right */}
                <polyline points="100,0 50.5,55 100,100" fill="none" stroke="url(#goldFoil)" strokeWidth="1.2" strokeLinejoin="round" />

                {/* Bottom Flap (Goes up to 40%) */}
                <polygon points="0,100 50,40 100,100" fill="url(#paperBottom)" filter="url(#shadow-bottom)" />
                {/* Thick Gold Foil Edge Bottom */}
                <polyline points="0,100 50,40.5 100,100" fill="none" stroke="url(#goldFoil)" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>

              {/* Corner Filigree Ornaments - Styled as physical gold foil */}
              <div className="absolute top-4 left-4 w-32 h-32 pointer-events-none z-20 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.3)]">
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldFoil)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2.5" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                </svg>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 pointer-events-none z-20 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.3)]" style={{ transform: "scaleX(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldFoil)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2.5" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 w-32 h-32 pointer-events-none z-20 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.3)]" style={{ transform: "scaleY(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldFoil)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2.5" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                </svg>
              </div>
              <div className="absolute bottom-4 right-4 w-32 h-32 pointer-events-none z-20 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.3)]" style={{ transform: "scale(-1, -1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldFoil)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2.5" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
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
                    <defs>
                      <filter id="shadow-top" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#3a2a22" floodOpacity="0.25" />
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3a2a22" floodOpacity="0.15" />
                      </filter>
                      <linearGradient id="paperTop" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#F0EBE1" />
                      </linearGradient>
                    </defs>
                    {/* Deep V-shaped Top Flap goes down to 65% height exactly like reference */}
                    <polygon points="0,0 100,0 50,65" fill="url(#paperTop)" filter="url(#shadow-top)" />
                    {/* Thick Golden Foil Edge Main */}
                    <polyline points="0,0 50,64.5 100,0" fill="none" stroke="url(#goldFoil)" strokeWidth="1.5" strokeLinejoin="round" />
                    {/* Inner Golden Double Lines */}
                    <polyline points="2,0 50,62 98,0" fill="none" stroke="url(#goldFoil)" strokeWidth="0.5" opacity="0.9" />
                    <polyline points="4,0 50,59 96,0" fill="none" stroke="url(#goldFoil)" strokeWidth="0.25" opacity="0.6" />
                  </svg>

                  {/* Typography on the Flap */}
                  <div className="absolute top-[5%] sm:top-[7%] md:top-[9%] left-1/2 -translate-x-1/2 w-[86%] sm:w-[75%] md:w-full max-w-sm sm:max-w-md md:max-w-lg text-center flex flex-col items-center justify-start pointer-events-none px-2 sm:px-4">

                    {/* Top Ornament */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3 w-full max-w-[200px] sm:max-w-[260px] opacity-85">
                      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 border border-[#D4AF37]"></div>
                      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                    </div>

                    <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#4A4045] text-lg sm:text-2xl md:text-3xl italic font-light mb-2.5 sm:mb-4 max-w-[300px] sm:max-w-none leading-snug sm:leading-normal">
                      You are lovingly invited to the wedding of
                    </p>

                    <h1 className="text-[#1A1618] font-serif text-[30px] sm:text-4xl md:text-5xl tracking-[0.16em] sm:tracking-[0.2em] uppercase mb-2.5 sm:mb-4 leading-tight sm:leading-normal">
                      OLIVIA <br /> <span className="text-lg sm:text-xl font-light text-[#D4AF37] tracking-[0.2em]">AND</span> <br /> IYANU
                    </h1>

                    {/* Bottom Ornament */}
                    <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-1.5 sm:my-2 w-full max-w-[110px] sm:max-w-[140px] opacity-75">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#D4AF37]"></div>
                      <div className="h-[1px] flex-grow bg-[#D4AF37]"></div>
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#D4AF37]"></div>
                    </div>

                    <p className="text-[#6E646A] text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.35em] font-medium font-mono uppercase">
                      FRIDAY • 30.10.2026
                    </p>
                  </div>
                </div>

                {/* Back Face of Top Flap (visible when open) */}
                <div className="absolute inset-0" style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon points="0,0 100,0 50,65" fill="#EFECE6" />
                  </svg>
                </div>
              </motion.div>

              {/* Ultra-Realistic Botanical Pearl-White Wax Stamp */}
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
                      
                      {/* Deep cast shadow for the entire heavy wax seal */}
                      <div className="absolute inset-2 bg-black/40 blur-md rounded-full translate-y-3 scale-95 group-hover:scale-100 transition-transform duration-500"></div>

                      {/* Main Wax Blob Base */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#E8CD82] to-[#996D12] group-hover:scale-105 transition-transform duration-500"
                        style={{ 
                          borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%",
                          boxShadow: "inset 4px 4px 10px rgba(255, 245, 190, 0.8), inset -6px -6px 15px rgba(60, 40, 0, 0.9), 0 6px 15px rgba(0,0,0,0.4)"
                        }}
                      >
                         {/* Specular highlight rim */}
                         <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white/50 blur-[1px] mix-blend-overlay"></div>
                      </div>

                      {/* Raised Rim of the Stamp */}
                      <div
                        className="absolute inset-[12%] bg-gradient-to-tl from-[#D4AF37] to-[#A37315]"
                        style={{ 
                          borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%",
                          boxShadow: "inset -2px -2px 6px rgba(255,245,200,0.7), inset 3px 3px 8px rgba(40,20,0,0.8), 2px 2px 6px rgba(0,0,0,0.5)"
                        }}
                      ></div>

                      {/* Inner Stamped Depression */}
                      <div
                        className="absolute inset-[20%] bg-gradient-to-br from-[#80550B] to-[#D1A635]"
                        style={{ 
                          borderRadius: "50%",
                          boxShadow: "inset 4px 4px 10px rgba(30,15,0,0.95), inset -2px -2px 6px rgba(255,240,170,0.5)"
                        }}
                      >
                        {/* Floral Wreath Icon with deep debossed shadow effect */}
                        <Flower2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 text-[#EDD085]" style={{ filter: "drop-shadow(1px 1px 1px rgba(255,255,255,0.4)) drop-shadow(-1.5px -1.5px 2px rgba(30,15,0,0.9))" }} strokeWidth={1.5} />
                      </div>

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
