"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface CardItem {
  id: number;
  label: string;
  sub: string;
  image: string;
}

const cards: CardItem[] = [
  { id: 1, image: "/images/IMG_0355.jpg", label: "The Genesis", sub: "Where our forever began" },
  { id: 2, image: "/images/IMG_0515.jpg", label: "Soul Connection", sub: "Lost in the magic of us" },
  { id: 3, image: "/images/IMG_0909.jpg", label: "Eternal Bond", sub: "Two souls intertwined" },
  { id: 4, image: "/images/IMG_0919.jpg", label: "Radiant Love", sub: "The purest kind of happiness" },
  { id: 5, image: "/images/IMG_3312.jpg", label: "Timeless Romance", sub: "A love written in the stars" },
  { id: 6, image: "/images/IMG-20260722-WA0006.jpg", label: "Perfect Harmony", sub: "Together is our favorite place" },
  { id: 7, image: "/images/IMG-20260722-WA0009.jpg", label: "Boundless Devotion", sub: "My heart belongs to you" },
  { id: 8, image: "/images/IMG-20260722-WA0024.jpg", label: "The Promise", sub: "Walking into our beautiful future" },
];

// Wraps offset so it loops: after 7 comes 1, before 1 comes 7
function wrapOffset(offset: number, total: number): number {
  let wrapped = ((offset % total) + total) % total;
  if (wrapped > total / 2) wrapped -= total;
  return wrapped;
}

function getCardTransform(offset: number) {
  const absOffset = Math.abs(offset);
  if (absOffset > 3) return null;

  let rotateY: number;
  let translateZ: number;
  let scale: number;
  let opacity: number;

  if (offset === 0) {
    rotateY = 0;
    translateZ = 80;
    scale = 1.05;
    opacity = 1;
  } else if (absOffset === 1) {
    rotateY = -offset * 25;
    translateZ = -100;
    scale = 0.9;
    opacity = 1;
  } else if (absOffset === 2) {
    rotateY = -offset * 30;
    translateZ = -250;
    scale = 0.75;
    opacity = 0.7;
  } else {
    rotateY = -offset * 35;
    translateZ = -400;
    scale = 0.6;
    opacity = 0.4;
  }

  const translateX = offset * 210;
  return { rotateY, translateZ, translateX, scale, opacity, zIndex: 30 - absOffset };
}

export default function CurvedGallery() {
  const [activeIndex, setActiveIndex] = useState(3);
  const [expandedCard, setExpandedCard] = useState<CardItem | null>(null);

  // Infinite loop navigation
  const nextCard = () => setActiveIndex((p) => (p + 1) % cards.length);
  const prevCard = () => setActiveIndex((p) => (p - 1 + cards.length) % cards.length);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) nextCard();
    else if (info.offset.x > 50) prevCard();
  };

  const handleCardTap = (card: CardItem, idx: number) => {
    if (idx === activeIndex) {
      // Center card tapped — expand it
      setExpandedCard(card);
    } else {
      // Side card tapped — bring to center
      setActiveIndex(idx);
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (expandedCard) return; // Pause auto-play if a card is expanded
    const timer = setInterval(() => {
      setActiveIndex((p) => (p + 1) % cards.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [expandedCard]);

  return (
    <section id="gallery" className="py-20 px-4 bg-[#FDFBF7] overflow-hidden select-none">
      {/* 3D container */}
      <div
        style={{ perspective: "1200px" }}
        className="relative w-full max-w-7xl mx-auto h-[500px] sm:h-[600px] flex items-center justify-center mt-10"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {cards.map((card, idx) => {
            const rawOffset = idx - activeIndex;
            const offset = wrapOffset(rawOffset, cards.length);
            const t = getCardTransform(offset);
            if (!t) return null;

            const isCenter = offset === 0;

            return (
              <motion.div
                key={card.id}
                onClick={() => handleCardTap(card, idx)}
                animate={{
                  x: t.translateX,
                  z: t.translateZ,
                  rotateY: t.rotateY,
                  scale: isCenter ? [1.05, 1.25, 1.05] : t.scale,
                  opacity: t.opacity,
                }}
                transition={{
                  scale: isCenter ? { duration: 3.5, times: [0, 0.4, 0.8], ease: "easeInOut" } : { type: "spring", stiffness: 180, damping: 22 },
                  default: { type: "spring", stiffness: 180, damping: 22 },
                }}
                style={{
                  position: "absolute",
                  zIndex: t.zIndex,
                  transformStyle: "preserve-3d",
                }}
                className={`w-64 sm:w-[340px] rounded-[1.5rem] p-2 cursor-pointer transition-colors duration-500 ${
                  isCenter
                    ? "bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-4 ring-white/50"
                    : "bg-white/60 shadow-xl hover:bg-white"
                }`}
              >
                <div className="w-full aspect-[3/4] rounded-xl relative overflow-hidden shadow-inner group">
                  <Image 
                    src={card.image} 
                    alt={card.label} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  {/* Subtle dark gradient at the bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                  
                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-serif text-xl sm:text-2xl leading-tight font-light text-white drop-shadow-md mb-1.5">
                      {card.label}
                    </h3>
                    <p className="text-[10px] sm:text-xs uppercase font-bold text-[#E8C3D3] tracking-[0.2em] drop-shadow-md">
                      {card.sub}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={prevCard}
          className="px-5 py-2.5 rounded-full border border-[#E3D3DA] bg-[#FFFDFB] text-xs font-bold text-[#241B22] hover:bg-[#F3E7EB] hover:border-[#B23A6B] transition-all shadow-xs cursor-pointer"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                activeIndex === i ? "w-8 bg-[#B23A6B]" : "w-2.5 bg-[#E3D3DA] hover:bg-[#E091B4]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="px-5 py-2.5 rounded-full border border-[#E3D3DA] bg-[#FFFDFB] text-xs font-bold text-[#241B22] hover:bg-[#F3E7EB] hover:border-[#B23A6B] transition-all shadow-xs cursor-pointer"
        >
          Next →
        </button>
      </div>

      {/* Expanded Lightbox Overlay */}
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpandedCard(null)}
            className="fixed inset-0 z-[100] bg-[#241B22]/70 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="relative w-full max-w-lg bg-[#FFFDFB] rounded-3xl border-2 border-[#B23A6B] shadow-2xl p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setExpandedCard(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F3E7EB] border border-[#E3D3DA] flex items-center justify-center hover:bg-[#B23A6B] hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Expanded Photo */}
              <div className="w-full aspect-[3/4] rounded-2xl bg-[#F3E7EB] border border-[#E3D3DA] overflow-hidden mb-6 relative shadow-inner">
                <Image 
                  src={expandedCard.image} 
                  alt={expandedCard.label} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>

              {/* Info */}
              <div className="text-center space-y-2">
                <h3 className="font-serif text-3xl font-bold text-[#241B22]">
                  {expandedCard.label}
                </h3>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#B23A6B]">
                  {expandedCard.sub}
                </p>
                <div className="w-10 h-[2px] bg-[#B23A6B]/40 mx-auto my-3"></div>
                <p className="text-xs text-[#6B5A63] leading-relaxed italic">
                  "Olivia and Iyanu — A match beautifully made in heaven."
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
