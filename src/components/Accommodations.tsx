"use client";

import { Building2, MapPin } from "lucide-react";

export default function Accommodations() {
  const hotels = [
    {
      name: "Eko Hotels & Suites",
      type: "5-Star Main Venue Hotel",
      location: "Victoria Island, Lagos",
      code: "OLAERIC26",
      desc: "Discounted room blocks reserved for wedding guests. Includes complimentary breakfast and shuttle.",
    },
    {
      name: "The Wheatbaker Ikoyi",
      type: "Boutique Luxury Hotel",
      location: "Ikoyi, Lagos (10 mins from venue)",
      code: "OLAERIC26",
      desc: "Serene boutique experience with spa amenities and private dining options.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#FDFBF7]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-2">
            Where To Stay
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#241B22]">
            Accommodations &amp; Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotels.map((h, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 text-[#B23A6B] mb-3">
                <Building2 className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E5C52]">
                  {h.type}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#241B22] mb-2">
                {h.name}
              </h3>

              <p className="flex items-center gap-1 text-xs font-medium text-[#6B5A63] mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#D4A5A5]" />
                {h.location}
              </p>

              <p className="text-xs text-[#241B22]/80 leading-relaxed font-light mb-6">
                {h.desc}
              </p>

              <div className="p-3 rounded-2xl bg-[#F3E7EB]/50 border border-[#E3D3DA] text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5A63]">
                  Discount Promo Code:
                </span>
                <p className="font-mono text-sm font-bold text-[#B23A6B] mt-0.5">{h.code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
