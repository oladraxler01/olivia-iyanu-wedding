"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
  "/images/IMG-20260722-WA0004.jpg",
  "/images/IMG-20260722-WA0005.jpg",
  "/images/IMG-20260722-WA0006.jpg",
  "/images/IMG-20260722-WA0007.jpg",
  "/images/IMG-20260722-WA0008.jpg",
  "/images/IMG-20260722-WA0009.jpg",
  "/images/IMG-20260722-WA0010.jpg",
  "/images/IMG-20260722-WA0011.jpg",
  "/images/IMG-20260722-WA0012.jpg",
  "/images/IMG-20260722-WA0013.jpg",
  "/images/IMG-20260722-WA0014.jpg",
  "/images/IMG-20260722-WA0015.jpg",
  "/images/IMG-20260722-WA0017.jpg",
  "/images/IMG-20260722-WA0018.jpg",
  "/images/IMG-20260722-WA0019.jpg",
  "/images/IMG-20260722-WA0020.jpg",
  "/images/IMG-20260722-WA0021.jpg",
  "/images/IMG-20260722-WA0022.jpg",
  "/images/IMG-20260722-WA0023.jpg",
  "/images/IMG-20260722-WA0024.jpg",
  "/images/IMG_0355.jpg",
  "/images/IMG_0514.jpg",
  "/images/IMG_0515.jpg",
  "/images/IMG_0682.jpg",
  "/images/IMG_0909.jpg",
  "/images/IMG_0919.jpg",
  "/images/IMG_3123.jpg",
  "/images/IMG_3209.jpg",
  "/images/IMG_3216.jpg",
  "/images/IMG_3312.jpg",
  "/images/IMG_3993.JPG",
  "/images/IMG_3994.JPG"
];

// Distribute images sequentially across 3 columns
const col1 = images.filter((_, i) => i % 3 === 0);
const col2 = images.filter((_, i) => i % 3 === 1);
const col3 = images.filter((_, i) => i % 3 === 2);

export default function MasonryGallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="masonry" className="py-24 px-2 sm:px-6 bg-[#FDFBF7] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-4">
            Captured Moments
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#241B22]">
            A Love In Motion
          </h2>
        </div>

        {/* Scrolling Grid Container */}
        <div className="relative h-[600px] sm:h-[800px] overflow-hidden bg-[#FDFBF7]">
          {/* Fade gradients at top and bottom to mask the entering/exiting cards */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 h-full">
            
            {/* Column 1 (Scrolls Up) */}
            <div className="relative h-full overflow-hidden">
              <div className="flex flex-col gap-3 sm:gap-6 animate-scroll-up w-full hover:[animation-play-state:paused]">
                {/* Render two identical sets so it loops seamlessly */}
                {[...col1, ...col1].map((src, idx) => (
                  <div
                    key={`col1-${idx}`}
                    onClick={() => setSelectedImg(src)}
                    className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden cursor-pointer group shadow-md"
                  >
                    <Image src={src} alt="Gallery image" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-[#B23A6B]/0 group-hover:bg-[#B23A6B]/20 transition-colors duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 (Scrolls Down) */}
            <div className="relative h-full overflow-hidden">
              <div className="flex flex-col gap-3 sm:gap-6 animate-scroll-down w-full hover:[animation-play-state:paused]">
                {[...col2, ...col2].map((src, idx) => (
                  <div
                    key={`col2-${idx}`}
                    onClick={() => setSelectedImg(src)}
                    className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[1.5rem] overflow-hidden cursor-pointer group shadow-md"
                  >
                    <Image src={src} alt="Gallery image" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-[#B23A6B]/0 group-hover:bg-[#B23A6B]/20 transition-colors duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3 (Scrolls Up) - Hidden on mobile, visible on md+ */}
            <div className="relative h-full overflow-hidden hidden md:block">
              <div className="flex flex-col gap-3 sm:gap-6 animate-scroll-up-slow w-full hover:[animation-play-state:paused]">
                {[...col3, ...col3].map((src, idx) => (
                  <div
                    key={`col3-${idx}`}
                    onClick={() => setSelectedImg(src)}
                    className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden cursor-pointer group shadow-md"
                  >
                    <Image src={src} alt="Gallery image" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-[#B23A6B]/0 group-hover:bg-[#B23A6B]/20 transition-colors duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded CSS for infinite marquee animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 0.75rem)); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(calc(-50% - 0.75rem)); }
          100% { transform: translateY(0); }
        }
        /* 
          Col 1 & 2 have 11 images per set. 
          Col 3 has 10 images per set. 
          To make them move at the exact same pixel speed, we adjust the time based on height.
          Let's target ~4 seconds per image height.
          Col 1 & 2: 11 * 4 = 44s
          Col 3: 10 * 4 = 40s
        */
        .animate-scroll-up {
          animation: scrollUp 44s linear infinite;
        }
        .animate-scroll-down {
          animation: scrollDown 44s linear infinite;
        }
        .animate-scroll-up-slow {
          animation: scrollUp 40s linear infinite;
        }
      `}} />

      {/* Lightbox for viewing individual picture */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[95vw] h-[95vh] flex items-center justify-center pointer-events-none"
            >
              <Image 
                src={selectedImg} 
                alt="Expanded view" 
                fill 
                className="object-contain pointer-events-auto" 
                sizes="100vw"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
