"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, CheckCircle, Sparkles, X, Heart, ShieldCheck } from "lucide-react";

interface AsoebiItem {
  id: string;
  name: string;
  target: "Ladies / Bridesmaids" | "Groomsmen / Men" | "VIP Guests";
  price: string;
  image: string;
  fabric: string;
  includes: string[];
  swatchColor: string;
}

export default function AsoebiShop() {
  const [selectedPackage, setSelectedPackage] = useState<AsoebiItem | null>(null);
  const [isReserved, setIsReserved] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [size, setSize] = useState("Medium (UK 12 / M)");
  const [notes, setNotes] = useState("");

  const packages: AsoebiItem[] = [
    {
      id: "ladies-lace",
      name: "Blush & Gold French Lace Ensemble",
      target: "Ladies / Bridesmaids",
      price: "₦85,000 / $110",
      image: "/images/asoebi-lace.png",
      fabric: "Premium French Net Lace with Hand Embroidery",
      includes: [
        "5 Yards French Embroidery Lace",
        "Matching Metallic Gold Gele (Headwrap)",
        "Coordinating Soft Silk Lining",
        "Complimentary Custom Hand Fan",
      ],
      swatchColor: "#D4A5A5",
    },
    {
      id: "groomsmen-senator",
      name: "Charcoal & Gold Senator Attire",
      target: "Groomsmen / Men",
      price: "₦75,000 / $100",
      image: "/images/asoebi-senator.png",
      fabric: "Italian Wool Crepe & Gold Embroidered Trims",
      includes: [
        "4 Yards Charcoal Wool Crepe Fabric",
        "Gold Embroidered Collar & Sleeve Trims",
        "Structured Velvet Fila Cap",
        "Matching Pocket Square",
      ],
      swatchColor: "#241B22",
    },
    {
      id: "vip-couple",
      name: "Royal Celebration VIP Duo Package",
      target: "VIP Guests",
      price: "₦150,000 / $195",
      image: "/images/hero.png",
      fabric: "Luxury Combined French Lace + Cashmere Senator Set",
      includes: [
        "Full 5 Yards French Lace + Gele",
        "Full 4 Yards Charcoal Cashmere + Fila",
        "Custom Monogrammed Storage Bag",
        "VIP Priority Seating Ticket",
      ],
      swatchColor: "#D4AF37",
    },
  ];

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) return;
    setIsReserved(true);
  };

  return (
    <section id="asoebi" className="py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <ShoppingBag className="w-3.5 h-3.5" /> Cultural Elegance
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#241B22] font-light">
            The Official Asoebi Shop
          </h2>
          <p className="text-base text-[#241B22]/70 font-light mt-3">
            Celebrate in style with our curated wedding color palette: Soft Blush Pink &amp; Champagne Gold.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-card-gold rounded-3xl overflow-hidden border border-[#D4AF37]/30 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                {/* Image Header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#241B22]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                    {pkg.target}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#FDFBF7] border border-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF37] shadow-sm">
                    {pkg.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold text-[#241B22] mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs font-medium text-[#D4A5A5] mb-4">{pkg.fabric}</p>

                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs uppercase font-semibold text-[#241B22]/60 tracking-wider">
                      Package Includes:
                    </p>
                    {pkg.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#241B22]/80">
                        <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setIsReserved(false);
                  }}
                  className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#C29B27] text-white shadow-md hover:shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Reserve Fabric Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Culture & Tailoring Notice */}
        <div className="mt-12 p-6 rounded-2xl glass-panel border border-[#D4A5A5]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[#241B22]/80">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <span>
              <strong>Tailoring Assistance Available:</strong> We provide complimentary custom fitting contacts in Lagos &amp; London for all guests who reserve their Asoebi package before Nov 15, 2026.
            </span>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B22]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FDFBF7] border border-[#D4AF37]/40 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#D4A5A5]/20 hover:bg-[#D4A5A5]/40 text-[#241B22] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isReserved ? (
              <form onSubmit={handleReserveSubmit} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Order Reservation
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#241B22]">
                    Reserve {selectedPackage.name}
                  </h3>
                  <p className="text-xs text-[#D4A5A5] font-semibold mt-1">
                    Price: {selectedPackage.price}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Chief & Mrs. Adebayo"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. guest@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1.5">
                    Select Size / Measurement Profile
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option>Small (UK 8-10 / S)</option>
                    <option>Medium (UK 12-14 / M)</option>
                    <option>Large (UK 16-18 / L)</option>
                    <option>X-Large (UK 20+ / XL)</option>
                    <option>Unstitched Raw Fabric Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#241B22] uppercase tracking-wider mb-1.5">
                    Special Delivery Instructions or Customization Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide tailoring notes or preferred delivery location (Lagos, London, Houston)..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4A5A5]/40 bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D4AF37] text-white hover:bg-[#B89326] transition-colors shadow-md cursor-pointer"
                >
                  Confirm Asoebi Reservation
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#241B22]">
                  Reservation Confirmed!
                </h3>
                <p className="text-sm text-[#241B22]/80 font-light">
                  Thank you, <strong>{guestName}</strong>! Your Asoebi package (
                  <span className="text-[#D4AF37] font-medium">{selectedPackage.name}</span>) has been reserved. Details have been emailed to <strong>{guestEmail}</strong>.
                </p>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="mt-4 px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#241B22] text-white hover:bg-[#3D303A] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
