"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function RSVP() {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [song, setSong] = useState("");
  const [comments, setComments] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const combinedNotes = song.trim() + (comments.trim() ? `\n\nNotes: ${comments.trim()}` : "");
      
      const { error: supabaseError } = await supabase
        .from('rsvps')
        .insert([
          {
            full_name: fullName.trim(),
            attending: attending === "yes",
            guest_count: 1,
            song_request: combinedNotes,
          }
        ]);

      if (supabaseError) throw supabaseError;

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
    } catch (err: any) {
      console.error("Error submitting RSVP:", err);
      setError(err.message || "Failed to submit RSVP. Please try again or contact the couple.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-24 bg-[#FBF6F7] overflow-hidden">
      
      {/* Decorative Left Botanical Element */}
      <div className="absolute -left-16 -top-10 md:left-[-15%] lg:left-0 md:top-1/2 md:-translate-y-1/2 opacity-30 md:opacity-60 pointer-events-none z-0 mix-blend-multiply w-[250px] h-[250px] md:w-[400px] md:h-[400px]">
        <Image 
          src="/images/rose.png" 
          alt="Decorative Rose" 
          fill 
          sizes="(max-width: 768px) 250px, 400px"
          className="object-contain"
        />
      </div>

      {/* Decorative Right Botanical Element */}
      <div className="absolute -right-16 bottom-0 md:right-[-15%] lg:right-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 opacity-30 md:opacity-60 pointer-events-none z-0 mix-blend-multiply w-[250px] h-[250px] md:w-[400px] md:h-[400px]" style={{ transform: "scaleX(-1)" }}>
        <Image 
          src="/images/rose.png" 
          alt="Decorative Rose" 
          fill 
          sizes="(max-width: 768px) 250px, 400px"
          className="object-contain"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-2">
            Join The Celebration
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#093F38]">
            RSVP Section
          </h2>
        </div>

        <div className="max-w-2xl mx-auto bg-[#FFFDFB] border border-[#E3D3DA] rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E3D3DA]/50 text-left relative z-20">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#093F38] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Babatunde Ogunlesi"
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#093F38] mb-3">
                  Attendance *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    disabled={isSubmitting}
                    className={`py-3 rounded-2xl border text-sm font-semibold transition-colors ${
                      attending === "yes"
                        ? "bg-[#093F38] text-white border-[#093F38]"
                        : "bg-white text-[#093F38] border-[#E3D3DA]"
                    }`}
                  >
                    Joyfully Accept
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    disabled={isSubmitting}
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#093F38] mb-2">
                  Song Request
                </label>
                <input
                  type="text"
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  placeholder="What song will get you on the dance floor?"
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#093F38] mb-2">
                  Comments / Notes
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Any dietary requirements or notes for us?"
                  className="w-full px-4 py-3 rounded-xl border border-[#E3D3DA] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B23A6B]"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-[#B23A6B] text-white hover:bg-[#8A2B52] transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" /> Submit RSVP
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#093F38] mx-auto" />
              <h3 className="font-serif text-3xl font-bold text-[#093F38]">
                RSVP Confirmed!
              </h3>
              <p className="text-sm text-[#6B5A63]">
                Thank you, <strong>{fullName}</strong>! We look forward to celebrating together.
              </p>
              <button 
                onClick={() => {
                  setFullName("");
                  setGuestCount(1);
                  setNotes("");
                  setAttending("yes");
                  setSubmitted(false);
                }}
                className="mt-6 px-6 py-2 rounded-full border border-[#E3D3DA] text-sm font-semibold text-[#093F38] hover:bg-[#FDFBF7] transition-colors"
              >
                Submit another RSVP
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
