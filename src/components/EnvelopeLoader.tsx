"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2 } from "lucide-react";

export default function EnvelopeLoader() {
  const [stage, setStage] = useState<"resting" | "seal_lift" | "card_draw" | "show_text" | "done" | "removed">("resting");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

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

    window.dispatchEvent(new Event("start-music"));

    // Stage 2 to 3: Card draw begins after seal lift
    setTimeout(() => {
      setStage("card_draw");
      
      // Stage 3 to 4: Envelope fades, show central #LetsDoLifeTogether text
      setTimeout(() => {
        setStage("show_text");
        
        const main = document.querySelector("#main-content") as HTMLElement;
        if (main) {
          main.style.transform = "scale(1)";
          main.style.opacity = "1";
        }
        
        // Stage 4 to done: Text fades, main site fully visible
        setTimeout(() => {
          setStage("done");
          
          setTimeout(() => {
            setStage("removed");
            document.body.style.overflow = "auto";
          }, 1500);
        }, 4000);
      }, 4000);
    }, 800);
  };

  if (stage === "removed") return null;

  const text = "#LetsDoLifeTogether";
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { delay: 0.5, staggerChildren: 0.15 },
    },
  };
  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-[1500ms] ${(stage === "show_text" || stage === "done") ? "bg-transparent pointer-events-none" : "bg-[#F4F1EA]"}`}>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_100%)] pointer-events-none"></div>

      {/* The pristine #LetsDoLifeTogether sequence */}
      <AnimatePresence>
        {stage === "show_text" && (
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
        {(stage === "resting" || stage === "seal_lift" || stage === "card_draw") && (
          <motion.div
            key="envelope-wrapper"
            exit={{ y: "100vh", opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={handleOpen}
          >
            <motion.div
              animate={stage === "resting" ? { y: [0, -10, 0] } : { y: 0 }}
              transition={{ duration: 4, repeat: stage === "resting" ? Infinity : 0, ease: "easeInOut" }}
              className="relative w-full h-full z-10"
            >
              {/* Layer 1 (Bottom): Back Base */}
              <div className="absolute inset-0 bg-[#FCFAF8] shadow-2xl z-10"></div>

              {/* Top Flap: Opens and falls behind the card (Layer 4 closed -> Layer 1 open) */}
              <motion.div
                initial={{ rotateX: 0, zIndex: 40 }}
                animate={{ 
                  rotateX: stage === "card_draw" ? 180 : 0,
                  zIndex: stage === "card_draw" ? 15 : 40 
                }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                className="absolute inset-0"
              >
                {/* Front Face of Top Flap */}
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <filter id="shadow-top" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.12" />
                      </filter>
                    </defs>
                    <polygon points="0,0 100,0 50,65" fill="#FDFCFB" filter="url(#shadow-top)" />
                    <polyline points="0,0 50,64.8 100,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.25" />
                    <polyline points="2,0 50,62 98,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.1" opacity="0.8" />
                    <polyline points="4,0 50,59 96,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.05" opacity="0.5" />
                  </svg>
                </div>
                {/* Back Face of Top Flap (visible when open) */}
                <div className="absolute inset-0" style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon points="0,0 100,0 50,65" fill="#EFECE6" />
                  </svg>
                </div>
              </motion.div>

              {/* Layer 2 (Middle): Inner Card */}
              {/* Dynamic size: centered, completely hidden in pouch when resting, slides up to reveal full text */}
              {/* Layer 2 (Middle): Inner Card */}
              {/* Dynamic size: centered, completely hidden in pouch when resting, slides up to reveal full text */}
              {/* Layer 2 (Middle): Inner Card */}
              {/* Dynamic size: centered, completely hidden in pouch when resting, slides up to reveal full text */}
              <motion.div 
                className="absolute left-1/2 w-[90%] sm:w-[80%] md:w-[65%] max-w-[700px] bg-[radial-gradient(ellipse_at_center,_#931A24_0%,_#7A171E_50%,_#5A0F13_100%)] shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-20 flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-10 rounded-lg border border-[#8C1E26] overflow-hidden"
                style={{ x: "-50%" }}
                initial={{ top: "60%" }}
                animate={{ top: stage === "card_draw" ? "3%" : "60%" }}
                transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Gold Corner Filigrees for the Inner Card */}
                <div className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none opacity-80">
                  <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round">
                    <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                    <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                    <circle cx="25" cy="25" r="3" fill="#D4AF37" stroke="none" />
                    <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                    <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                  </svg>
                </div>
                <div className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none opacity-80" style={{ transform: "scaleX(-1)" }}>
                  <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round">
                    <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                    <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                    <circle cx="25" cy="25" r="3" fill="#D4AF37" stroke="none" />
                    <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                    <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none opacity-80" style={{ transform: "scaleY(-1)" }}>
                  <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round">
                    <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                    <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                    <circle cx="25" cy="25" r="3" fill="#D4AF37" stroke="none" />
                    <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                    <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                  </svg>
                </div>
                <div className="absolute bottom-3 right-3 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none opacity-80" style={{ transform: "scale(-1, -1)" }}>
                  <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round">
                    <path d="M0 0 Q 60 0 60 60 Q 60 0 100 0" />
                    <path d="M0 0 Q 0 60 60 60 Q 0 60 0 100" />
                    <circle cx="25" cy="25" r="3" fill="#D4AF37" stroke="none" />
                    <circle cx="45" cy="15" r="2" fill="#D4AF37" stroke="none" />
                    <circle cx="15" cy="45" r="2" fill="#D4AF37" stroke="none" />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="flex items-center justify-center gap-4 mb-3 sm:mb-5 w-full max-w-[200px] opacity-90 z-10">
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                  <div className="w-2 h-2 rotate-45 border border-[#D4AF37]"></div>
                  <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                </div>

                <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#F4F1EA] text-lg sm:text-2xl md:text-3xl italic font-light mb-3 sm:mb-4 text-center z-10 drop-shadow-md">
                  You are lovingly invited to the wedding of
                </p>

                <h1 className="text-[#FFFFFF] font-serif text-2xl sm:text-3xl md:text-5xl tracking-[0.2em] uppercase mb-3 sm:mb-4 leading-normal text-center z-10 drop-shadow-lg">
                  OLIVIA <br /> <span className="text-lg sm:text-xl font-light text-[#D4AF37]">AND</span> <br /> IYANU
                </h1>

                <div className="flex items-center justify-center gap-3 mt-1 mb-3 sm:mb-5 w-full max-w-[100px] opacity-90 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                  <div className="h-[1px] flex-grow bg-[#D4AF37]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                </div>

                <p className="text-[#EAE5DE] text-xs sm:text-base tracking-[0.4em] font-medium font-mono text-center z-10 drop-shadow-md">
                  30.10.2026
                </p>
              </motion.div>

              {/* Layer 3 (Front): Left, Right, Bottom Flaps */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                {/* SVG Base for Flaps */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
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

                  <polygon points="0,0 50,55 0,100" fill="#FBF9F6" filter="url(#shadow-left)" />
                  <polyline points="0,0 49.8,55 0,100" fill="none" stroke="url(#goldGradient)" strokeWidth="0.15" />

                  <polygon points="100,0 50,55 100,100" fill="#FBF9F6" filter="url(#shadow-right)" />
                  <polyline points="100,0 50.2,55 100,100" fill="none" stroke="url(#goldGradient)" strokeWidth="0.15" />

                  <polygon points="0,100 50,40 100,100" fill="#FFFFFF" filter="url(#shadow-bottom)" />
                  <polyline points="0,100 50,40.2 100,100" fill="none" stroke="url(#goldGradient)" strokeWidth="0.15" />
                </svg>

                {/* Rose Asset Clippers - Using clipPath to strictly contain them within flap bounds */}
                {/* Note: Animating opacity from 0.3 (subtle texture) to 1 (full vibrant color) per user constraints */}
                <div className="absolute inset-0 overflow-hidden mix-blend-multiply" style={{ clipPath: "polygon(0% 0%, 50% 55%, 0% 100%)" }}>
                  <motion.img 
                    src="/images/rose.png" 
                    className="absolute top-1/2 left-0 w-[50%] h-[75%] transform -translate-y-1/2 object-contain object-left scale-110"
                    initial={{ filter: "grayscale(100%)", opacity: 0.3 }}
                    animate={{ 
                      filter: stage === "card_draw" ? "grayscale(0%)" : "grayscale(100%)",
                      opacity: stage === "card_draw" ? 1 : 0.3 
                    }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="absolute inset-0 overflow-hidden mix-blend-multiply" style={{ clipPath: "polygon(100% 0%, 50% 55%, 100% 100%)" }}>
                  <motion.img 
                    src="/images/rose.png" 
                    className="absolute top-1/2 right-0 w-[50%] h-[75%] transform -translate-y-1/2 object-contain object-right scale-110 scale-x-[-1]"
                    initial={{ filter: "grayscale(100%)", opacity: 0.3 }}
                    animate={{ 
                      filter: stage === "card_draw" ? "grayscale(0%)" : "grayscale(100%)",
                      opacity: stage === "card_draw" ? 1 : 0.3 
                    }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Layer 4 (Absolute Front): Gold Wax Seal */}
              <AnimatePresence>
                {stage !== "card_draw" && (
                  <motion.div
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, ease: "easeIn" }}
                    className="absolute z-50 pointer-events-auto cursor-pointer flex items-center justify-center"
                    style={{ top: "65%", left: "50%", transform: "translate(-50%, -50%)" }}
                    onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                  >
                    <motion.div 
                      className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center group"
                      animate={stage === "seal_lift" ? { scale: 1.15, y: -10, filter: "drop-shadow(0 20px 15px rgba(0,0,0,0.3))" } : { scale: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E3C37A] via-[#D4AF37] to-[#AA7C11] shadow-[0_15px_35px_rgba(0,0,0,0.25),inset_0_-8px_20px_rgba(0,0,0,0.15),inset_0_8px_20px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform duration-500" style={{ borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%" }}></div>
                      <div className="absolute inset-4 bg-gradient-to-br from-[#B58514] to-[#E3C37A] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3),0_2px_5px_rgba(255,255,255,0.3)]" style={{ borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%" }}></div>
                      <Flower2 className="relative z-10 w-12 h-12 md:w-16 md:h-16 text-[#FBE3A1] drop-shadow-[0_2px_1px_rgba(0,0,0,0.4)]" strokeWidth={1.5} />
                    </motion.div>
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
