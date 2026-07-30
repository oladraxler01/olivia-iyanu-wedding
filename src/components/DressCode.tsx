"use client";

import { Download } from "lucide-react";

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
            <div className="w-[300px] bg-white border border-[#E3D3DA] shadow-md relative overflow-hidden group rounded-sm">
              <img
                src="/images/image.png"
                alt="Lookbook Cover"
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors z-10 pointer-events-none" />
            </div>

            <div className="flex items-center gap-6">
              <a
                href="/OLIVIA & IYANU'S WEDDING LOOKBOOK_20260729_195054_0000.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E5C52] hover:text-[#B23A6B] transition-colors pb-1 border-b border-[#0E5C52] hover:border-[#B23A6B]"
              >
                View Lookbook
              </a>
              <span className="text-[#E3D3DA]">|</span>
              <a
                href="/OLIVIA & IYANU'S WEDDING LOOKBOOK_20260729_195054_0000.pdf"
                download="Olivia_Iyanu_Lookbook.pdf"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E5C52] hover:text-[#B23A6B] transition-colors pb-1 border-b border-[#0E5C52] hover:border-[#B23A6B]"
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
              className="flex-none w-[280px] sm:w-[320px] bg-white border border-[#E3D3DA] p-6 snap-start flex flex-col"
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
