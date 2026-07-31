"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2 } from "lucide-react";

export default function EnvelopeLoader() {
  const [stage, setStage] = useState<"resting" | "seal_lift" | "card_draw" | "done" | "removed">("resting");

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
    if (stage !== "resting") return;
    setStage("seal_lift");

    // Autoplay background music
    window.dispatchEvent(new Event("start-music"));

    setTimeout(() => {
      setStage("card_draw");
      
      // After card is drawn (long smooth transition), move to done
      setTimeout(() => {
        const main = document.querySelector("#main-content") as HTMLElement;
        if (main) {
          main.style.transform = "scale(1)";
          main.style.opacity = "1";
        }
        
        setStage("done");
        
        // Finally remove from DOM
        setTimeout(() => {
          setStage("removed");
          document.body.style.overflow = "auto";
        }, 1500);
      }, 3500);
    }, 800);
  };

  if (stage === "removed") return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-[1500ms] ${stage === "done" ? "bg-transparent pointer-events-none" : "bg-[#F4F1EA]"}`}>
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_100%)] pointer-events-none"></div>

      <AnimatePresence>
        {stage !== "done" && (
          <motion.div
            key="envelope-wrapper"
            exit={{ y: "100vh", opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.32, 0, 0.67, 0] }}
            className="relative w-full h-full flex items-center justify-center cursor-pointer"
            onClick={handleOpen}
          >
            {/* The Envelope Container */}
            <div className="relative w-full max-w-[800px] aspect-[3/4] sm:aspect-[4/3] md:aspect-[3/2] flex flex-col items-center justify-end">
              
              {/* Top Flap (Starts Open, pointing UP) */}
              <div className="absolute bottom-[70%] w-[90%] md:w-[80%] h-[35%] sm:h-[45%] z-0 pointer-events-none flex items-end">
                <svg className="w-full h-full drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <filter id="velvet-top">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                      <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0" in="noise" result="coloredNoise" />
                      <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
                    </filter>
                    <linearGradient id="gold-top" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="50%" stopColor="#FFF2CD" />
                      <stop offset="100%" stopColor="#AA7C11" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,100 50,0 100,100" fill="#FCFAF8" filter="url(#velvet-top)" />
                  <polyline points="0,100 50,0 100,100" fill="none" stroke="url(#gold-top)" strokeWidth="0.3" />
                  <polyline points="3,100 50,6 97,100" fill="none" stroke="url(#gold-top)" strokeWidth="0.15" opacity="0.6" />
                </svg>
              </div>

              {/* Back of Envelope Pouch */}
              <div className="absolute bottom-0 w-[90%] md:w-[80%] h-[70%] bg-[#FCFAF8] shadow-xl z-10 rounded-b-lg border-x border-b border-[#EAE5DE]">
                {/* Velvet texture inside pouch */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none rounded-b-lg" preserveAspectRatio="none">
                  <filter id="velvet-pouch">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#velvet-pouch)" />
                </svg>
              </div>

              {/* The Inner Card (Draws out upwards) */}
              <motion.div
                initial={{ y: "10%", scale: 1 }} // Hidden inside the pouch
                animate={{ 
                  y: stage === "card_draw" ? "-60%" : "10%",
                  scale: stage === "card_draw" ? 1.05 : 1,
                  boxShadow: stage === "card_draw" ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 0 0 rgba(0,0,0,0)"
                }}
                transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }} // Long smooth draw out
                className="absolute bottom-0 w-[85%] md:w-[75%] h-[85%] bg-[#FFFDFB] rounded-md z-20 flex flex-col items-center justify-start pt-8 sm:pt-12 md:pt-16 px-4 sm:px-6 border border-[#EAE5DE]"
              >
                {/* Fine linen texture for the card */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none rounded-md" preserveAspectRatio="none">
                  <filter id="linen">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.2" numOctaves="2" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#linen)" />
                </svg>

                {/* Typography on the Card */}
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                  <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6 w-full max-w-[180px] sm:max-w-[240px] opacity-80">
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 border border-[#D4AF37]"></div>
                    <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                  </div>

                  <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#5C5056] text-lg sm:text-2xl md:text-3xl italic font-light mb-4 sm:mb-8">
                    You are lovingly invited to the wedding of
                  </p>

                  <h1 className="text-[#1A1618] font-serif text-2xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase mb-4 sm:mb-6 leading-normal">
                    OLIVIA <br /> <span className="text-sm sm:text-xl md:text-2xl font-light text-[#D4AF37] my-3 sm:my-4 block">AND</span> IYANU
                  </h1>

                  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-4 mb-4 sm:mb-6 w-full max-w-[100px] sm:max-w-[120px] opacity-70">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#D4AF37]"></div>
                    <div className="h-[1px] flex-grow bg-[#D4AF37]"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#D4AF37]"></div>
                  </div>

                  <p className="text-[#8B8086] text-xs sm:text-sm md:text-lg tracking-[0.4em] font-medium font-mono">
                    30.10.2026
                  </p>
                </div>
              </motion.div>

              {/* Front Flaps (Left, Right, Bottom) covering the card */}
              <div className="absolute bottom-0 w-[90%] md:w-[80%] h-[70%] z-30 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <filter id="velvet">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                      <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0" in="noise" result="coloredNoise" />
                      <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
                    </filter>
                    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="50%" stopColor="#FFF2CD" />
                      <stop offset="100%" stopColor="#AA7C11" />
                    </linearGradient>
                    <filter id="drop-left"><feDropShadow dx="2" dy="0" stdDeviation="3" floodOpacity="0.15" /></filter>
                    <filter id="drop-right"><feDropShadow dx="-2" dy="0" stdDeviation="3" floodOpacity="0.15" /></filter>
                    <filter id="drop-bottom"><feDropShadow dx="0" dy="-3" stdDeviation="3" floodOpacity="0.1" /></filter>
                  </defs>

                  {/* Left Flap */}
                  <polygon points="0,0 48,55 0,100" fill="#FDFCFB" filter="url(#velvet) url(#drop-left)" />
                  <polyline points="0,0 48,55 0,100" fill="none" stroke="url(#gold)" strokeWidth="0.3" />
                  <polyline points="0,3 44,55 0,97" fill="none" stroke="url(#gold)" strokeWidth="0.1" opacity="0.6" />

                  {/* Right Flap */}
                  <polygon points="100,0 52,55 100,100" fill="#FDFCFB" filter="url(#velvet) url(#drop-right)" />
                  <polyline points="100,0 52,55 100,100" fill="none" stroke="url(#gold)" strokeWidth="0.3" />
                  <polyline points="100,3 56,55 100,97" fill="none" stroke="url(#gold)" strokeWidth="0.1" opacity="0.6" />

                  {/* Bottom Flap */}
                  <polygon points="0,100 50,45 100,100" fill="#FFFFFF" filter="url(#velvet) url(#drop-bottom)" />
                  <polyline points="0,100 50,45 100,100" fill="none" stroke="url(#gold)" strokeWidth="0.2" />
                </svg>

                {/* Left Rose Element (Color Reveal Animation) */}
                <motion.div 
                  className="absolute top-1/2 left-0 w-[45%] h-[80%] transform -translate-y-1/2 overflow-hidden flex items-center justify-start pointer-events-none mix-blend-multiply"
                  initial={{ filter: "grayscale(100%) opacity(0.5) sepia(20%)" }}
                  animate={{ filter: stage === "card_draw" ? "grayscale(0%) opacity(0.9) sepia(0%)" : "grayscale(100%) opacity(0.5) sepia(20%)" }}
                  transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                >
                  {/* Using the user's existing rose.png asset, blended elegantly into the velvet */}
                  <img src="/images/rose.png" alt="" className="w-[120%] h-[120%] object-contain object-left-center drop-shadow-md -translate-x-[10%]" />
                </motion.div>

                {/* Right Rose Element (Color Reveal Animation) */}
                <motion.div 
                  className="absolute top-1/2 right-0 w-[45%] h-[80%] transform -translate-y-1/2 overflow-hidden flex items-center justify-end pointer-events-none mix-blend-multiply"
                  initial={{ filter: "grayscale(100%) opacity(0.5) sepia(20%)" }}
                  animate={{ filter: stage === "card_draw" ? "grayscale(0%) opacity(0.9) sepia(0%)" : "grayscale(100%) opacity(0.5) sepia(20%)" }}
                  transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                >
                  <img src="/images/rose.png" alt="" className="w-[120%] h-[120%] object-contain object-right-center scale-x-[-1] drop-shadow-md translate-x-[10%]" />
                </motion.div>
              </div>

              {/* Wax Seal - Lifts and pulses before card draws */}
              <motion.div
                initial={{ scale: 1, y: 0, opacity: 1 }}
                animate={
                  stage === "resting" ? { scale: 1, y: 0, opacity: 1 } :
                  stage === "seal_lift" ? { scale: 1.15, y: -15, filter: "drop-shadow(0 25px 20px rgba(0,0,0,0.4))", opacity: 1 } :
                  { scale: 0.8, y: -5, opacity: 0 } // Fades away during card draw
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute z-50 pointer-events-none flex items-center justify-center"
                style={{ bottom: "35%", left: "50%", transform: "translate(-50%, 50%)" }}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center group cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); handleOpen(); }}>
                  {/* Organic Melted Wax */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#E3C37A] via-[#D4AF37] to-[#AA7C11] shadow-[0_15px_35px_rgba(0,0,0,0.25),inset_0_-8px_20px_rgba(0,0,0,0.15),inset_0_8px_20px_rgba(255,255,255,0.4)]"
                    style={{ borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%" }}
                  ></div>
                  {/* Inner Stamped Depression */}
                  <div
                    className="absolute inset-3 sm:inset-4 bg-gradient-to-br from-[#B58514] to-[#E3C37A] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3),0_2px_5px_rgba(255,255,255,0.3)]"
                    style={{ borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%" }}
                  ></div>
                  <Flower2 className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 text-[#FBE3A1] drop-shadow-[0_2px_1px_rgba(0,0,0,0.4)]" strokeWidth={1.5} />
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

