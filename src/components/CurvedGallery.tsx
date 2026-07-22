"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CardItem {
  id: number;
  label: string;
  sub: string;
}

const cards: CardItem[] = [
  { id: 1, label: "PHOTO 1", sub: "Pre-Wedding Shoot" },
  { id: 2, label: "PHOTO 2", sub: "Proposal Moment" },
  { id: 3, label: "PHOTO 3", sub: "Sunset Adventure" },
  { id: 4, label: "PHOTO 4", sub: "Engagement Party" },
  { id: 5, label: "PHOTO 5", sub: "Asoebi Cultural Look" },
  { id: 6, label: "PHOTO 6", sub: "Romantic Walk" },
  { id: 7, label: "PHOTO 7", sub: "Traditional Ceremony" },
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
    translateZ = 60;
    scale = 1.05;
    opacity = 1;
  } else if (absOffset === 1) {
    rotateY = -offset * 30;
    translateZ = -80;
    scale = 0.9;
    opacity = 1;
  } else if (absOffset === 2) {
    rotateY = -offset * 35;
    translateZ = -200;
    scale = 0.75;
    opacity = 0.7;
  } else {
    rotateY = -offset * 40;
    translateZ = -320;
    scale = 0.6;
    opacity = 0.4;
  }

  const translateX = offset * 160;
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

  return (
    <section id="gallery" className="py-20 px-4 bg-[#FDFBF7] overflow-hidden select-none">
      {/* 3D container */}
      <div
        style={{ perspective: "1200px" }}
        className="relative w-full max-w-7xl mx-auto h-[420px] sm:h-[500px] flex items-center justify-center"
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
                layoutId={`card-${card.id}`}
                onClick={() => handleCardTap(card, idx)}
                animate={{
                  transform: `translateX(${t.translateX}px) translateZ(${t.translateZ}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                  opacity: t.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                }}
                style={{
                  position: "absolute",
                  zIndex: t.zIndex,
                  transformStyle: "preserve-3d",
                }}
                className={`w-56 sm:w-64 rounded-2xl p-4 cursor-pointer border-2 ${
                  isCenter
                    ? "bg-[#FFFDFB] border-[#B23A6B] shadow-2xl ring-4 ring-[#B23A6B]/15"
                    : "bg-[#F3E7EB] border-[#E3D3DA] shadow-xl hover:border-[#B23A6B]/40"
                }`}
              >
                <div className="w-full aspect-[3/4] rounded-xl bg-[#FDFBF7] border border-dashed border-[#E3D3DA] flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-full flex-1 rounded-lg bg-[#F3E7EB]/70 flex items-center justify-center border border-[#E3D3DA] mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCenter ? "text-[#B23A6B]" : "text-[#6B5A63]"
                      }`}
                    >
                      {card.label}
                    </span>
                  </div>
                  <p className="font-serif text-sm font-bold text-[#241B22]">
                    Olivia &amp; Iyanu
                  </p>
                  <p className="text-[10px] uppercase font-semibold text-[#6B5A63] tracking-wider mt-0.5">
                    {card.sub}
                  </p>
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
              layoutId={`card-${expandedCard.id}`}
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

              {/* Expanded Photo Placeholder */}
              <div className="w-full aspect-[3/4] rounded-2xl bg-[#F3E7EB] border border-dashed border-[#E3D3DA] flex items-center justify-center mb-6">
                <span className="text-lg font-bold uppercase tracking-wider text-[#B23A6B]">
                  {expandedCard.label}
                </span>
              </div>

              {/* Info */}
              <div className="text-center space-y-2">
                <h3 className="font-serif text-3xl font-bold text-[#241B22]">
                  Olivia &amp; Iyanu
                </h3>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#0E5C52]">
                  {expandedCard.sub}
                </p>
                <div className="w-10 h-[2px] bg-[#B23A6B]/40 mx-auto my-3"></div>
                <p className="text-xs text-[#6B5A63] leading-relaxed">
                  A beautiful moment captured during their journey together.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
