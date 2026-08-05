"use client";

import { Download, X, ChevronLeft, ChevronRight, LayoutGrid, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const lookbookPages = [
  "/lookbook/page_01.jpg",
  "/lookbook/page_02.jpg",
  "/lookbook/page_03.jpg",
  "/lookbook/page_04.jpg",
  "/lookbook/page_05.jpg",
  "/lookbook/page_06.jpg",
  "/lookbook/page_07.jpg",
  "/lookbook/page_08.jpg",
  "/lookbook/page_09.jpg",
  "/lookbook/page_10.jpg",
];

const lookbook = [
  {
    id: "palette",
    title: "Our Palette",
    desc: "Aqua green, emerald green and white with a touch of silver for the perfect shine.",
    colors: ["#30D5C8", "#0E5C52", "#C0C0C0", "#FFFFFF"],
    showImageSpace: false,
  },
  {
    id: "ladies",
    title: "Aso-Ebi Ladies",
    desc: "Aso-ebi fabric styled as you like — buba & wrapper, a gown, or a fitted kaftan. Gele optional but encouraged.",
    colors: ["#30D5C8", "#0E5C52", "#C0C0C0"],
    showImageSpace: true,
    imageLabel: "Ladies Fabric Material",
    image: "/images/WhatsApp Image 2026-07-27 at 14.23.12.jpeg",
  },
  {
    id: "gentlemen",
    title: "Aso-Ebi Gentlemen",
    desc: "White Agbada or a native two-piece with the provided emerald green fila cap in velvet.",
    colors: ["#FFFFFF", "#0E5C52", "#C0C0C0"],
    showImageSpace: true,
    imageLabel: "Men's Fabric Material",
    image: "/images/WhatsApp Image 2026-07-27 at 14.55.31.jpeg",
  },
  {
    id: "guests",
    title: "General Guests",
    desc: "Not wearing aso-ebi? Stick to the palette —  Aqua green, emerald green,silver and white in any fabric you love.",
    colors: ["#30D5C8", "#0E5C52", "#C0C0C0", "#FFFFFF"],
    showImageSpace: false,
  },
  {
    id: "avoid",
    title: "Kindly Avoid",
    desc: "All-white (reserved for the bride) and all-black. Everything else is fair game.",
    colors: ["#FFFFFF", "#241B22"],
    showImageSpace: false,
  },
];

export default function DressCode() {
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"slider" | "scroll">("slider");
  const [mounted, setMounted] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Preload initial lookbook images on mount for instant rendering
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Preload cover and first few pages
    lookbookPages.slice(0, 4).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Proactively preload adjacent pages as user flips
  useEffect(() => {
    if (!isLookbookOpen) return;
    const preload = (idx: number) => {
      if (idx >= 0 && idx < lookbookPages.length) {
        const img = new window.Image();
        img.src = lookbookPages[idx];
      }
    };
    preload(currentPage + 1);
    preload(currentPage + 2);
    preload(currentPage - 1);
  }, [isLookbookOpen, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLookbookOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLookbookOpen(false);
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(lookbookPages.length - 1, p + 1));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLookbookOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentPage < lookbookPages.length - 1) {
        // Swipe left -> Next page
        setCurrentPage((p) => p + 1);
      } else if (diffX < 0 && currentPage > 0) {
        // Swipe right -> Prev page
        setCurrentPage((p) => p - 1);
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section id="dress-code" className="py-24 px-4 bg-[#FDFBF7] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-3">
            What to Wear
          </p>
          <h2
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-4xl sm:text-5xl font-light text-[#0E5C52] mb-4"
          >
            Dress Code Lookbook
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A63] mb-6">
            Scroll through for color inspiration and what we'd love to see on the day.
          </p>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div 
              onClick={() => setIsLookbookOpen(true)}
              className="w-[280px] sm:w-[320px] bg-white border border-[#E3D3DA] shadow-lg relative overflow-hidden group rounded-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src="/lookbook/page_01.jpg"
                alt="Lookbook Cover"
                className="w-full h-auto block object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-widest bg-[#0E5C52]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4AF37]/50 shadow-md">
                  📖 Tap To Open Lookbook
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 mt-2">
              <button
                onClick={() => setIsLookbookOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E5C52] hover:text-[#B23A6B] transition-colors pb-1 border-b-2 border-[#0E5C52] hover:border-[#B23A6B] cursor-pointer"
              >
                View Full Lookbook (10 Pages)
              </button>
              <span className="text-[#E3D3DA]">|</span>
              <a
                href="/OLIVIA & IYANU'S WEDDING LOOKBOOK.pdf"
                download="OLIVIA & IYANU'S WEDDING LOOKBOOK.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E5C52] hover:text-[#B23A6B] transition-colors pb-1 border-b-2 border-[#0E5C52] hover:border-[#B23A6B]"
              >
                Save PDF <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          {lookbook.map((item) => (
            <div
              key={item.id}
              className="flex-none w-[280px] sm:w-[320px] bg-white border border-[#E3D3DA] p-6 snap-start flex flex-col rounded-xl shadow-xs"
            >
              {/* Image Space for Materials */}
              {item.showImageSpace && (
                <div className="w-full aspect-[4/5] bg-[#F3E7EB]/50 border-2 border-dashed border-[#E3D3DA] flex items-center justify-center mb-6 relative overflow-hidden rounded-md">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-[#B23A6B]/50 uppercase tracking-widest text-center px-4">
                      {item.imageLabel}<br />(Image goes here)
                    </span>
                  )}
                </div>
              )}

              {/* Color Palette */}
              <div className="flex items-center gap-2 mb-6">
                {item.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-5 h-5 rounded-full ${color === "#FFFFFF" ? "border-2 border-[#241B22]" : "border border-black/10"}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Text Content */}
              <h3 className="font-bold text-[#0E5C52] text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-[#6B5A63] leading-relaxed flex-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lookbook Modal */}
      {mounted && isLookbookOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-5xl h-[94vh] sm:h-[90vh] bg-[#1A1618] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-white/10 bg-[#241B22] text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <h3 className="font-serif text-base sm:text-xl text-[#FDFBF7]">Fashion Lookbook</h3>
                <span className="text-xs bg-[#0E5C52] text-white px-2.5 py-0.5 rounded-full font-mono">
                  {viewMode === "slider" ? `${currentPage + 1} / ${lookbookPages.length}` : "All Pages"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3">
                {/* View Mode Switcher */}
                <div className="hidden xs:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => setViewMode("slider")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "slider" ? "bg-[#0E5C52] text-white shadow-xs" : "text-white/70 hover:text-white"}`}
                  >
                    <FileText className="w-3.5 h-3.5 inline mr-1" /> Flip
                  </button>
                  <button
                    onClick={() => setViewMode("scroll")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "scroll" ? "bg-[#0E5C52] text-white shadow-xs" : "text-white/70 hover:text-white"}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 inline mr-1" /> Scroll
                  </button>
                </div>

                {/* Direct PDF Link */}
                <a
                  href="/OLIVIA & IYANU'S WEDDING LOOKBOOK.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="OLIVIA & IYANU'S WEDDING LOOKBOOK.pdf"
                  className="inline-flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                  title="Download Original PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>

                {/* Close Button */}
                <button 
                  onClick={() => setIsLookbookOpen(false)}
                  className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Lookbook"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Content */}
            {viewMode === "slider" ? (
              <div 
                className="flex-1 w-full h-full relative flex items-center justify-center p-2 sm:p-4 select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Page Image */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <img
                    src={lookbookPages[currentPage]}
                    alt={`Lookbook Page ${currentPage + 1}`}
                    className="max-h-[68vh] sm:max-h-[74vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
                  />
                </div>

                {/* Nav Arrows */}
                {currentPage > 0 && (
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}

                {currentPage < lookbookPages.length - 1 && (
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
              </div>
            ) : (
              // Continuous Vertical Scroll Mode
              <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-8 space-y-6 bg-black/40">
                {lookbookPages.map((pageSrc, index) => (
                  <div key={index} className="max-w-3xl mx-auto flex flex-col items-center">
                    <span className="text-white/60 text-xs font-mono mb-2 self-start">Page {index + 1} of {lookbookPages.length}</span>
                    <img
                      src={pageSrc}
                      alt={`Lookbook Page ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-xl"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Thumbnail Strip (Slider Mode Only) */}
            {viewMode === "slider" && (
              <div className="px-3 py-2 bg-[#241B22]/90 border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-2.5 py-1 text-xs text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {lookbookPages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`h-2 transition-all rounded-full ${currentPage === idx ? "w-6 bg-[#0E5C52]" : "w-2 bg-white/30 hover:bg-white/60"}`}
                      aria-label={`Jump to page ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentPage === lookbookPages.length - 1}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1 text-xs text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shrink-0"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
