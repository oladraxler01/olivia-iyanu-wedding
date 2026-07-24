"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function RSVP() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B23A6B", "#E091B4", "#0E5C52", "#241B22"],
      });
    } catch (err) {
      console.log("Confetti trigger", err);
    }
  };

  return (
    <section id="rsvp" className="relative py-24 bg-[#FDFBF7] overflow-hidden">
      
      {/* Decorative Left Botanical Element */}
      <div className="absolute -left-16 -top-10 md:left-[-15%] lg:left-0 md:top-1/2 md:-translate-y-1/2 opacity-30 md:opacity-60 pointer-events-none z-0 mix-blend-multiply w-[250px] h-[250px] md:w-[400px] md:h-[400px]">
        <Image 
          src="/images/rose.png" 
          alt="Decorative Rose" 
          fill 
          className="object-contain"
        />
      </div>

      {/* Decorative Right Botanical Element */}
      <div className="absolute -right-16 bottom-0 md:right-[-15%] lg:right-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 opacity-30 md:opacity-60 pointer-events-none z-0 mix-blend-multiply w-[250px] h-[250px] md:w-[400px] md:h-[400px]" style={{ transform: "scaleX(-1)" }}>
        <Image 
          src="/images/rose.png" 
          alt="Decorative Rose" 
          fill 
          className="object-contain"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-2">
            Join The Celebration
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#241B22]">
            RSVP Section
          </h2>
        </div>

        <div className="max-w-2xl mx-auto bg-[#FFFDFB] border border-[#E3D3DA] rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E3D3DA]/50 text-left relative z-20">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#241B22] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Babatunde Ogunlesi"
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#241B22] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#241B22] mb-3">
                  Attendance *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`py-3 rounded-2xl border text-sm font-semibold transition-colors ${
                      attending === "yes"
                        ? "bg-[#0E5C52] text-white border-[#0E5C52]"
                        : "bg-white text-[#241B22] border-[#E3D3DA]"
                    }`}
                  >
                    Joyfully Accept
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`py-3 rounded-2xl border text-sm font-semibold transition-colors ${
                      attending === "no"
                        ? "bg-[#241B22] text-white border-[#241B22]"
                        : "bg-white text-[#241B22] border-[#E3D3DA]"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {attending === "yes" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#241B22] mb-2">
                    Total Guest Count Attending
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#241B22] mb-2">
                  Song Request or Personal Message
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share a message or song request for the DJ..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-[#B23A6B] text-white hover:bg-[#8A2B52] transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" /> Submit RSVP
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#0E5C52] mx-auto" />
              <h3 className="font-serif text-3xl font-bold text-[#241B22]">
                RSVP Confirmed!
              </h3>
              <p className="text-sm text-[#6B5A63]">
                Thank you, <strong>{fullName}</strong>! We look forward to celebrating together.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
