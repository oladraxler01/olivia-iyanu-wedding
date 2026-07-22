"use client";

import { Download } from "lucide-react";

const lookbook = [
  {
    id: "palette",
    title: "Our Palette",
    desc: "Teal, magenta, and blush — wear any shade in this family, mixed or matched.",
    colors: ["#0E5C52", "#B23A6B", "#D4A5A5", "#F3E7EB"],
    showImageSpace: false,
  },
  {
    id: "ladies",
    title: "Aso-Ebi Ladies",
    desc: "Aso-ebi fabric styled as you like — buba & wrapper, a gown, or a fitted kaftan. Gele optional but encouraged.",
    colors: ["#0E5C52", "#B23A6B"],
    showImageSpace: true,
    imageLabel: "Ladies Fabric Material",
  },
  {
    id: "gentlemen",
    title: "Aso-Ebi Gentlemen",
    desc: "Agbada or a native two-piece in aso-ebi fabric, with or without a fila cap.",
    colors: ["#0E5C52", "#B23A6B"],
    showImageSpace: true,
    imageLabel: "Men's Fabric Material",
  },
  {
    id: "guests",
    title: "General Guests",
    desc: "Not wearing aso-ebi? Stick to the palette — jewel tones, soft blush, or teal in any fabric you love.",
    colors: ["#D4A5A5", "#F3E7EB", "#0E5C52"],
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
          
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E5C52] hover:text-[#B23A6B] transition-colors pb-1 border-b border-[#0E5C52] hover:border-[#B23A6B]">
            Save as PDF <Download className="w-4 h-4" />
          </button>
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
                <div className="w-full aspect-square bg-[#F3E7EB]/50 border-2 border-dashed border-[#E3D3DA] flex items-center justify-center mb-6">
                  <span className="text-xs font-semibold text-[#B23A6B]/50 uppercase tracking-widest text-center px-4">
                    {item.imageLabel}<br />(Image goes here)
                  </span>
                </div>
              )}

              {/* Color Palette */}
              <div className="flex items-center gap-2 mb-6">
                {item.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full border border-black/10"
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
      
      <style dangerouslySetInnerHTML={{__html: `
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
