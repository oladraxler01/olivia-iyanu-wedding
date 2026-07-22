"use client";

import { User } from "lucide-react";

export default function BridalParty() {
  const party = [
    { name: "Bolaji Adebayo", role: "Best Man" },
    { name: "Kemi Ogunlesi", role: "Maid of Honor" },
    { name: "Daniel & Sarah", role: "Groomsman & Bridesmaid" },
  ];

  return (
    <section className="py-20 px-4 bg-[#FDFBF7]">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-2">
            Standing Beside Us
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#241B22]">
            Party / Bridal Party
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {party.map((p, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Circular Avatar Placeholder Frame */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#F3E7EB]/60 border-2 border-dashed border-[#E3D3DA] flex items-center justify-center mb-4 shadow-sm">
                <User className="w-12 h-12 text-[#B23A6B]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#241B22]">{p.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0E5C52] mt-1">
                {p.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
