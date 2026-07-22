"use client";

import { useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";

export default function VenueMap() {
  const [origin, setOrigin] = useState("");
  const destination = "Lagos, Nigeria"; // Default wedding venue

  const handleGetDirections = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim()) return;
    
    // Open Google Maps directions in a new tab (since embedding dynamic directions requires a paid API key)
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-24 px-4 bg-[#FDFBF7] border-y border-[#E3D3DA]/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-3">
            Navigation
          </p>
          <h2
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-3xl sm:text-5xl font-light text-[#0E5C52] mb-4 uppercase tracking-wide"
          >
            Finding it hard to locate the venue?
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A63] max-w-2xl mx-auto">
            Enter your starting point below to get the best route to our wedding venue.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-3xl border border-[#E3D3DA] shadow-sm flex flex-col lg:flex-row gap-8">
          {/* Controls / Inputs */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center space-y-6">
            <form onSubmit={handleGetDirections} className="space-y-5">
              <div className="space-y-4 relative">
                {/* Connecting Line between dots */}
                <div className="absolute left-[15px] top-[30px] bottom-[40px] w-0.5 bg-[#E3D3DA] z-0"></div>
                
                {/* Origin Input */}
                <div className="relative z-10 flex items-start gap-3">
                  <div className="mt-3 w-8 h-8 rounded-full bg-[#F3E7EB] border-2 border-[#B23A6B] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B23A6B]"></div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A63] mb-1">
                      Your Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Where are you coming from?"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E3D3DA] bg-white text-sm focus:outline-none focus:border-[#0E5C52] focus:ring-1 focus:ring-[#0E5C52] transition-colors"
                        required
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5A63]/60" />
                    </div>
                  </div>
                </div>

                {/* Destination Input (Read-only) */}
                <div className="relative z-10 flex items-start gap-3">
                  <div className="mt-3 w-8 h-8 rounded-full bg-[#0E5C52]/10 border-2 border-[#0E5C52] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#0E5C52]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A63] mb-1">
                      Wedding Venue
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm text-[#241B22] font-medium opacity-80 cursor-not-allowed">
                      {destination}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#0E5C52] text-white hover:bg-[#0A4A42] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>
            </form>
          </div>

          {/* Wide Map Iframe */}
          <div className="w-full lg:w-2/3 h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-[#E3D3DA] relative bg-[#FDFBF7]">
            {/* Overlay to give it a slight color tint to match website, pointer-events-none lets you still interact with map */}
            <div className="absolute inset-0 bg-[#D4A5A5]/5 pointer-events-none mix-blend-multiply z-10"></div>
            
            <iframe
              title="Wedding Venue Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Lagos,+Nigeria&t=&z=12&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
