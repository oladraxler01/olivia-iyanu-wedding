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
      setTimeout(() => {
        setStep("done");
      }, 4500); // Wait for typing animation + short pause
    } else if (step === "done") {
      const main = document.querySelector("#main-content") as HTMLElement;
      if (main) {
        main.style.transform = "scale(1)";
        main.style.opacity = "1";
      }
      setTimeout(() => {
        setIsRemoved(true);
        document.body.style.overflow = "auto";
      }, 1500); 
    }
  }, [step]);

  if (isRemoved) return null;

  const text = "NOW AND ALWAYS";
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
    <div className="fixed inset-0 z-[9999] bg-[#F4F1EA] flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_100%)] pointer-events-none"></div>

      <AnimatePresence>
        {step === "text" && (
          <motion.div
            key="text-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 flex items-center justify-center z-[9999] px-4"
          >
            <motion.h1 
              variants={sentence}
              initial="hidden"
              animate="visible"
              className="text-[#B23A6B] font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.3em] font-light text-center"
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
              <div className="absolute inset-0 bg-[#FCFAF8] shadow-2xl z-10"></div>

              {/* SVG Flaps (Left, Right, Bottom) - Deep overlap exactly like reference */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <filter id="shadow-left" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="0" stdDeviation="2" floodOpacity="0.08" />
                  </filter>
                  <filter id="shadow-right" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-2" dy="0" stdDeviation="2" floodOpacity="0.08" />
                  </filter>
                  <filter id="shadow-bottom" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="-3" stdDeviation="3" floodOpacity="0.1" />
                  </filter>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FFF2CD" />
                    <stop offset="100%" stopColor="#AA7C11" />
                  </linearGradient>
                </defs>
                
                {/* Left Flap (Goes deep to 55%) */}
                <polygon points="0,0 50,55 0,100" fill="#FBF9F6" filter="url(#shadow-left)" />
                {/* Gold Edge Left */}
                <polyline points="0,0 49.8,55 0,100" fill="none" stroke="url(#goldGradient)" strokeWidth="0.15" />

                {/* Right Flap (Goes deep to 55%) */}
                <polygon points="100,0 50,55 100,100" fill="#FBF9F6" filter="url(#shadow-right)" />
                {/* Gold Edge Right */}
                <polyline points="100,0 50.2,55 100,100" fill="none" stroke="url(#goldGradient)" strokeWidth="0.15" />

                {/* Bottom Flap (Goes up to 40%) */}
                <polygon points="0,100 50,40 100,100" fill="#FFFFFF" filter="url(#shadow-bottom)" />
                {/* Gold Edge Bottom */}
                <polyline points="0,100 50,40.2 100,100" fill="none" stroke="url(#goldGradient)" strokeWidth="0.15" />
              </svg>

              {/* Corner Filigree Ornaments - Enhanced & Enlarged */}
              <div className="absolute top-4 left-4 w-32 h-32 pointer-events-none z-20 opacity-80">
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#D4AF37" stroke="none" />
                </svg>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 pointer-events-none z-20 opacity-80" style={{ transform: "scaleX(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#D4AF37" stroke="none" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 w-32 h-32 pointer-events-none z-20 opacity-80" style={{ transform: "scaleY(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#D4AF37" stroke="none" />
                </svg>
              </div>
              <div className="absolute bottom-4 right-4 w-32 h-32 pointer-events-none z-20 opacity-80" style={{ transform: "scale(-1, -1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                  <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                  <circle cx="25" cy="25" r="2" fill="#D4AF37" stroke="none" />
                  <circle cx="45" cy="15" r="1.5" fill="#D4AF37" stroke="none" />
                  <circle cx="15" cy="45" r="1.5" fill="#D4AF37" stroke="none" />
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
                        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.12" />
                      </filter>
                    </defs>
                    {/* Deep V-shaped Top Flap goes down to 65% height exactly like reference */}
                    <polygon points="0,0 100,0 50,65" fill="#FDFCFB" filter="url(#shadow-top)" />
                    {/* Golden Edge Main */}
                    <polyline points="0,0 50,64.8 100,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.25" />
                    {/* Inner Golden Double Lines */}
                    <polyline points="2,0 50,62 98,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.1" opacity="0.8" />
                    <polyline points="4,0 50,59 96,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.05" opacity="0.5" />
                  </svg>
                  
                  {/* Typography on the Flap */}
                  <div className="absolute top-[12%] md:top-[12%] left-0 w-full text-center flex flex-col items-center justify-start pointer-events-none px-4">
                      
                      {/* Top Ornament */}
                      <div className="flex items-center justify-center gap-4 mb-4 w-full max-w-[240px] opacity-80">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                        <div className="w-2 h-2 rotate-45 border border-[#D4AF37]"></div>
                        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                      </div>

                      <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#5C5056] text-xl sm:text-3xl md:text-4xl italic font-light mb-4 sm:mb-5">
                        You are lovingly invited to the wedding of
                      </p>
                      
                      <h1 className="text-[#1A1618] font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase mb-4 leading-normal">
                        OLIVIA <br/> <span className="text-xl sm:text-2xl font-light text-[#D4AF37]">AND</span> <br/> IYANU
                      </h1>

                      {/* Bottom Ornament */}
                      <div className="flex items-center justify-center gap-3 mt-1 mb-3 w-full max-w-[120px] opacity-70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                        <div className="h-[1px] flex-grow bg-[#D4AF37]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                      </div>

                      <p className="text-[#8B8086] text-sm sm:text-lg tracking-[0.4em] font-medium font-mono mt-1">
                        30.10.2026
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
                      
                      {/* Organic Melted Wax Outer Blob */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-[#E3C37A] via-[#D4AF37] to-[#AA7C11] shadow-[0_15px_35px_rgba(0,0,0,0.25),inset_0_-8px_20px_rgba(0,0,0,0.15),inset_0_8px_20px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform duration-500"
                        style={{ borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%" }}
                      ></div>
                      
                      {/* Inner Stamped Depression */}
                      <div 
                        className="absolute inset-4 bg-gradient-to-br from-[#B58514] to-[#E3C37A] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3),0_2px_5px_rgba(255,255,255,0.3)]"
                        style={{ borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%" }}
                      ></div>

                      {/* Floral Wreath Icon */}
                      <Flower2 className="relative z-10 w-12 h-12 md:w-16 md:h-16 text-[#FBE3A1] drop-shadow-[0_2px_1px_rgba(0,0,0,0.4)]" strokeWidth={1.5} />
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
