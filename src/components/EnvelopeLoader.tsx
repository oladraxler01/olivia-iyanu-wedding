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
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-[1500ms] ${step === "envelope" ? "bg-[#1A0307]" : "bg-transparent pointer-events-none"}`}>

      {/* Ambient Radial Glow behind the envelope */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,20,58,0.15)_0%,transparent_100%)] pointer-events-none"></div>

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
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
            onClick={handleOpen}
          >
            {/* The Landscape Sleeve & Card Container (Full Screen) */}
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-end z-10">
              {/* Back Red Sleeve (The solid backing of the pocket) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#A80B23] to-[#6A0413] shadow-inner z-0"></div>

              {/* Inner Cream Card - Slides UP and OUT */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 right-0 md:top-2 md:bottom-2 md:left-2 md:right-2 bg-[#FDFBF7] shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center p-6 sm:p-10 z-10 overflow-hidden"
                initial={{ y: 0 }}
                animate={{ y: isOpen ? "-100%" : "0%" }}
                transition={{ duration: 1.5, ease: [0.32, 0, 0.67, 0] }}
              >
                {/* Subtle inner border on the cream card */}
                <div className="absolute inset-2 border border-[#E8DFD5] opacity-50 pointer-events-none"></div>

                {/* Elegant Couple Silhouette */}
                <div className="mb-4 sm:mb-6 opacity-90 flex items-center justify-center">
                  <svg width="45" height="65" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                    {/* Groom Silhouette */}
                    <path d="M30 40 C 20 40, 20 60, 25 70 L 35 140 L 45 140 L 40 70 C 45 60, 40 40, 30 40 Z" fill="#9B1B30" />
                    <circle cx="30" cy="22" r="10" fill="#9B1B30" />
                    
                    {/* Bride Silhouette with flared dress */}
                    <path d="M60 42 C 50 42, 45 52, 45 70 C 30 110, 15 140, 10 150 L 95 150 C 90 140, 75 110, 65 70 C 65 52, 70 42, 60 42 Z" fill="#C8102E" />
                    <circle cx="60" cy="26" r="9" fill="#C8102E" />
                  </svg>
                </div>
                
                <h2 style={{ fontFamily: "var(--font-cormorant), cursive, serif" }} className="text-[#8A0A1F] text-lg sm:text-2xl md:text-3xl italic font-light mb-2 sm:mb-3">
                  Wedding Invitation
                </h2>
                
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-4 sm:mb-6 opacity-60"></div>

                <h1 className="text-[#1A1618] font-serif text-2xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase mb-4 text-center leading-normal">
                  OLIVIA <br /> <span className="text-xl sm:text-2xl font-light text-[#D4AF37]">AND</span> <br /> IYANU
                </h1>
                
                <p className="text-[#8B8086] text-xs sm:text-sm md:text-lg tracking-[0.4em] font-medium font-mono mt-2 sm:mt-4">
                  30.10.2026
                </p>
              </motion.div>

              {/* Front Laser-Cut Red Filigree Pocket */}
              <div className="absolute bottom-0 left-0 right-0 h-[65%] sm:h-[70%] z-20 pointer-events-none drop-shadow-[0_-8px_15px_rgba(0,0,0,0.4)]">
                <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D2143A" />
                      <stop offset="100%" stopColor="#8A0A1F" />
                    </linearGradient>

                    {/* Highly ornate single swirl motif to be layered and repeated */}
                    <g id="ornate-swirl" stroke="url(#pocketGradient)" strokeLinecap="round" fill="none">
                      <path d="M0,0 C 50,-50 100,-10 120,40 C 140,90 90,130 50,100 C 10,70 30,10 80,20" strokeWidth="12" />
                      <path d="M120,40 C 160,-10 220,10 200,70 C 180,130 130,100 150,60" strokeWidth="10" />
                      <path d="M50,100 C 20,150 80,200 120,160 C 160,120 120,80 90,110" strokeWidth="8" />
                      <path d="M 80,20 Q 60,-20 90,-40 Q 110,-10 80,20" fill="url(#pocketGradient)" strokeWidth="2" />
                      <path d="M 200,70 Q 250,50 270,80 Q 230,110 200,70" fill="url(#pocketGradient)" strokeWidth="2" />
                      <circle cx="90" cy="110" r="12" fill="url(#pocketGradient)" />
                      <circle cx="150" cy="60" r="8" fill="url(#pocketGradient)" />
                    </g>
                  </defs>

                  {/* Solid Bottom Base forming the structural pocket */}
                  <path d="M 0,600 L 1000,600 L 1000,500 Q 750,380 500,550 Q 250,380 0,500 Z" fill="url(#pocketGradient)" />

                  {/* Dense layered swirls clustering up the left corner */}
                  <use href="#ornate-swirl" x="0" y="200" transform="scale(1.5) rotate(-30 0 200)" />
                  <use href="#ornate-swirl" x="-50" y="380" transform="scale(1.8) rotate(-10 -50 380)" />
                  <use href="#ornate-swirl" x="150" y="450" transform="scale(1.2) rotate(45 150 450)" />
                  <use href="#ornate-swirl" x="300" y="500" transform="scale(0.8) rotate(70 300 500)" />
                  <use href="#ornate-swirl" x="220" y="280" transform="scale(0.9) rotate(15 220 280)" />
                  <use href="#ornate-swirl" x="80" y="100" transform="scale(1) rotate(-45 80 100)" />

                  {/* Dense layered swirls clustering up the right corner (mirrored) */}
                  <g transform="translate(1000, 0) scale(-1, 1)">
                    <use href="#ornate-swirl" x="0" y="200" transform="scale(1.5) rotate(-30 0 200)" />
                    <use href="#ornate-swirl" x="-50" y="380" transform="scale(1.8) rotate(-10 -50 380)" />
                    <use href="#ornate-swirl" x="150" y="450" transform="scale(1.2) rotate(45 150 450)" />
                    <use href="#ornate-swirl" x="300" y="500" transform="scale(0.8) rotate(70 300 500)" />
                    <use href="#ornate-swirl" x="220" y="280" transform="scale(0.9) rotate(15 220 280)" />
                    <use href="#ornate-swirl" x="80" y="100" transform="scale(1) rotate(-45 80 100)" />
                  </g>

                  {/* Sweeping connection lines forming the classic laser-cut framework */}
                  <path d="M 0,350 C 150,450 300,500 500,550 C 700,500 850,450 1000,350" fill="none" stroke="url(#pocketGradient)" strokeWidth="18" strokeLinecap="round" />
                  <path d="M 0,200 C 200,320 350,480 500,550 C 650,480 800,320 1000,200" fill="none" stroke="url(#pocketGradient)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 0,50 C 250,250 400,450 500,550 C 600,450 750,250 1000,50" fill="none" stroke="url(#pocketGradient)" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 0,280 C 180,380 320,460 500,550 C 680,460 820,380 1000,280" fill="none" stroke="url(#pocketGradient)" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
