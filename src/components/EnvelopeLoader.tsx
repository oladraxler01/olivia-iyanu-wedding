"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnvelopeLoader() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"envelope" | "text" | "done">("envelope");
  const [isRemoved, setIsRemoved] = useState(false);

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
    if (isOpen) return;
    setIsOpen(true);
    
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
      }, 4500); 
    } else if (step === "done") {
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
      transition: { delay: 0.5, staggerChildren: 0.15 },
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
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-[1500ms] ${step === "envelope" ? "bg-[#CBD4C2]" : "bg-transparent pointer-events-none"}`}>
      
      {/* Ambient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,transparent_100%)] pointer-events-none"></div>

      <AnimatePresence>
        {step === "text" && (
          <motion.div
            key="text-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 flex items-center justify-center z-[9999] px-4 bg-[#CBD4C2]/70 backdrop-blur-sm pointer-events-auto"
          >
            <motion.h1 
              variants={sentence}
              initial="hidden"
              animate="visible"
              style={{ fontFamily: "var(--font-cormorant), cursive, serif" }}
              className="text-[#3A4A2C] text-4xl md:text-6xl lg:text-7xl tracking-[0.2em] italic font-light text-center drop-shadow-sm"
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
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={handleOpen}
          >
            <motion.div
              animate={isOpen ? { y: 0 } : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
              className="relative w-full h-full z-10"
            >
              
              {/* Pattern Definitions */}
              <svg className="hidden">
                <defs>
                  {/* Organic botanical leaf pattern for the luxury paper look */}
                  <pattern id="floralPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path fill="#92A680" fillOpacity="0.25" d="M30 30c0-16.568-13.432-30-30-30v60c16.568 0 30-13.432 30-30zM0 30c16.568 0 30 16.568 30 30h30C60 43.432 46.568 30 30 30z"/>
                    <path fill="#92A680" fillOpacity="0.15" d="M60 0C43.431 0 30 13.431 30 30h-30V0h60zM30 60c16.569 0 30-13.431 30-30h-30v30z"/>
                  </pattern>
                  <filter id="shadow-left" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="3" dy="0" stdDeviation="5" floodOpacity="0.15" /></filter>
                  <filter id="shadow-right" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="-3" dy="0" stdDeviation="5" floodOpacity="0.15" /></filter>
                  <filter id="shadow-bottom" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="-4" stdDeviation="6" floodOpacity="0.25" /></filter>
                  <filter id="shadow-top" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.4" /></filter>
                </defs>
              </svg>

              {/* Envelope Base (Back) */}
              <div className="absolute inset-0 bg-[#A6BA93] z-10">
                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%23708a59' fill-opacity='0.2' d='M30 30c0-16.568-13.432-30-30-30v60c16.568 0 30-13.432 30-30zM0 30c16.568 0 30 16.568 30 30h30C60 43.432 46.568 30 30 30z'/%3E%3C/svg%3E\")" }}></div>
              </div>

              {/* Left Flap */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="0,0 55,50 0,100" fill="#B3C4A2" filter="url(#shadow-left)" />
                <polygon points="0,0 55,50 0,100" fill="url(#floralPattern)" />
              </svg>

              {/* Right Flap */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="100,0 45,50 100,100" fill="#B3C4A2" filter="url(#shadow-right)" />
                <polygon points="100,0 45,50 100,100" fill="url(#floralPattern)" />
              </svg>

              {/* Bottom Flap */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="0,100 50,45 100,100" fill="#BDCDAC" filter="url(#shadow-bottom)" />
                <polygon points="0,100 50,45 100,100" fill="url(#floralPattern)" />
              </svg>

              {/* "You are invited" Cursive Text on the Bottom Flap */}
              <div className="absolute bottom-[20%] md:bottom-[25%] left-0 w-full text-center z-20 pointer-events-none px-4">
                <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#3A4A2C] text-5xl md:text-6xl lg:text-7xl italic font-medium tracking-wide drop-shadow-md opacity-90">
                  You are invited
                </p>
              </div>

              {/* Top Flap (Rotates on Open) */}
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
                    {/* Deep V-shaped Top Flap pointing down to 55% */}
                    <polygon points="0,0 100,0 50,55" fill="#C5D3B5" filter="url(#shadow-top)" />
                    <polygon points="0,0 100,0 50,55" fill="url(#floralPattern)" />
                  </svg>
                </div>

                {/* Back Face of Top Flap (visible when open) */}
                <div className="absolute inset-0" style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Reverse V-shape */}
                    <polygon points="0,0 100,0 50,55" fill="#DCE5D1" />
                    <polygon points="0,0 100,0 50,55" fill="url(#floralPattern)" opacity="0.3" />
                  </svg>
                </div>
              </motion.div>

              {/* Ultra-Realistic RED Wax Stamp */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div 
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, ease: "easeIn" }}
                    className="absolute z-50 pointer-events-auto cursor-pointer flex items-center justify-center"
                    // Placed EXACTLY over the tip of the top flap
                    style={{ top: "55%", left: "50%", transform: "translate(-50%, -50%)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                    }}
                  >
                    <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center group hover:scale-105 transition-transform duration-500">
                      
                      {/* Organic Melted Wax Outer Blob - Rich Ruby Red */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-[#E85D5D] via-[#CC3333] to-[#8F1A1A] shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_-4px_10px_rgba(0,0,0,0.4),inset_0_6px_15px_rgba(255,255,255,0.4)]"
                        style={{ borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%" }}
                      ></div>
                      
                      {/* Inner Stamped Depression */}
                      <div 
                        className="absolute inset-[6px] md:inset-[8px] bg-gradient-to-br from-[#A82222] to-[#D94545] shadow-[inset_0_4px_10px_rgba(0,0,0,0.6),0_1px_3px_rgba(255,255,255,0.4)]"
                        style={{ borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%" }}
                      ></div>

                      {/* Engraved Monogram O&I inside the Wax */}
                      <div className="relative z-10 flex items-center justify-center w-full h-full text-[#FCD3D3] drop-shadow-[0_2px_1px_rgba(0,0,0,0.6)] opacity-95">
                        <span style={{ fontFamily: "var(--font-cormorant), serif" }} className="text-4xl md:text-5xl italic font-medium leading-none mt-2">
                          O<span className="text-2xl md:text-3xl mx-1">&amp;</span>I
                        </span>
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
