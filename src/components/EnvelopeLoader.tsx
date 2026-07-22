"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnvelopeLoader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);
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

    setTimeout(() => {
      setIsUnmounting(true);
      const main = document.querySelector("#main-content") as HTMLElement;
      if (main) {
        main.style.transform = "scale(1)";
        main.style.opacity = "1";
      }
    }, 1200);

    setTimeout(() => {
      setIsRemoved(true);
      document.body.style.overflow = "auto";
    }, 2400); 
  };

  if (isRemoved) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F4F1EA] flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_100%)] pointer-events-none"></div>

      <AnimatePresence>
        {!isUnmounting && (
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

              {/* Corner Filigree Ornaments */}
              <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none z-20 opacity-60">
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2">
                  <path d="M0 0 Q 50 0 50 50 Q 50 0 100 0" />
                  <path d="M0 0 Q 0 50 50 50 Q 0 50 0 100" />
                </svg>
              </div>
              <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none z-20 opacity-60" style={{ transform: "scaleX(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2">
                  <path d="M0 0 Q 50 0 50 50 Q 50 0 100 0" />
                  <path d="M0 0 Q 0 50 50 50 Q 0 50 0 100" />
                </svg>
              </div>
              <div className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none z-20 opacity-60" style={{ transform: "scaleY(-1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2">
                  <path d="M0 0 Q 50 0 50 50 Q 50 0 100 0" />
                  <path d="M0 0 Q 0 50 50 50 Q 0 50 0 100" />
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none z-20 opacity-60" style={{ transform: "scale(-1, -1)" }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="url(#goldGradient)" strokeWidth="2">
                  <path d="M0 0 Q 50 0 50 50 Q 50 0 100 0" />
                  <path d="M0 0 Q 0 50 50 50 Q 0 50 0 100" />
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
                    {/* Golden Edge */}
                    <polyline points="0,0 50,64.8 100,0" fill="none" stroke="url(#goldGradient)" strokeWidth="0.2" />
                  </svg>
                  
                  {/* Typography on the Flap */}
                  <div className="absolute top-[18%] md:top-[15%] left-0 w-full text-center flex flex-col items-center justify-start pointer-events-none px-4">
                      <p style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#5C5056] text-xl sm:text-3xl md:text-4xl italic font-light mb-4 sm:mb-6">
                        You are lovingly invited to the wedding of
                      </p>
                      <h1 className="text-[#1A1618] font-serif text-3xl sm:text-5xl md:text-6xl tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-4">
                        Olivia and Iyanu
                      </h1>
                      <p className="text-[#8B8086] text-sm sm:text-lg tracking-[0.4em] font-medium font-mono mt-2">
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
                        className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#FCFAF8] to-[#EAE4D8] shadow-[0_15px_35px_rgba(0,0,0,0.15),inset_0_-8px_20px_rgba(0,0,0,0.06),inset_0_8px_20px_rgba(255,255,255,1)] group-hover:scale-105 transition-transform duration-500"
                        style={{ borderRadius: "52% 48% 55% 45% / 45% 55% 42% 58%" }}
                      ></div>
                      
                      {/* Inner Stamped Depression */}
                      <div 
                        className="absolute inset-4 bg-gradient-to-br from-[#F5EFE6] to-[#FFFFFF] shadow-[inset_0_4px_10px_rgba(0,0,0,0.12),0_2px_5px_rgba(255,255,255,0.9)]"
                        style={{ borderRadius: "48% 52% 45% 55% / 55% 45% 50% 50%" }}
                      ></div>

                      {/* Floral Wreath Icon */}
                      <svg className="relative z-10 w-20 h-20 md:w-24 md:h-24 text-[#D4CBB8] drop-shadow-[0_2px_1px_rgba(255,255,255,0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.15" fill="currentColor"/>
                        <path d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12" strokeWidth="1.5"/>
                        <path d="M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12" strokeWidth="1.5"/>
                        
                        {/* Botanical leaves details */}
                        <path d="M9 10C9.5 9.5 10 9.5 10.5 10C10.5 10.5 10 11 9.5 11C9 11 8.5 10.5 9 10Z" fill="currentColor"/>
                        <path d="M15 10C14.5 9.5 14 9.5 13.5 10C13.5 10.5 14 11 14.5 11C15 11 15.5 10.5 15 10Z" fill="currentColor"/>
                        <path d="M8.5 13.5C9 14 9.5 14 10 13.5C10 13 9.5 12.5 9 12.5C8.5 12.5 8 13 8.5 13.5Z" fill="currentColor"/>
                        <path d="M15.5 13.5C15 14 14.5 14 14 13.5C14 13 14.5 12.5 15 12.5C15.5 12.5 16 13 15.5 13.5Z" fill="currentColor"/>
                        <path d="M11 8.5C11.5 8 12 8 12.5 8.5C12.5 9 12 9.5 11.5 9.5C11 9.5 10.5 9 11 8.5Z" fill="currentColor"/>
                      </svg>
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
