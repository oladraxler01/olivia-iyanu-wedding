"use client";

import { Heart, Camera, Utensils, Users, Image as ImageIcon, Crown, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const milestones = [
  {
    icon: <Utensils className="w-5 h-5 text-[#B23A6B]/50" />,
    title: "Lunch/Dinner dates",
    desc: "From first dates to forever — the dinner diaries are here.",
    media: "image",
    imageSrc: "/images/IMG-20260722-WA0011.jpg"
  },
  {
    icon: <Camera className="w-5 h-5 text-[#B23A6B]/50" />,
    title: "Creating Memories",
    desc: "A glimpse of the magic before the big day.",
    media: "vimeo"
  },
  {
    icon: <Camera className="w-5 h-5 text-[#B23A6B]/50" />,
    title: "Proposal pictures",
    desc: "Every crown has a beginning. Ours started with one question & deserves a proper reveal.",
    showCountdown: true,
    countdownDays: 60,
    media: "loading"
  },
  {
    icon: <Users className="w-5 h-5 text-[#B23A6B]/50" />,
    title: "The Couple Squad",
    desc: "The crown doesn't stand alone — get ready to meet the ones who hold it up.",
    media: "image",
    imageSrc: "/images/image copy 4.png"
  },
  {
    icon: <ImageIcon className="w-5 h-5 text-[#B23A6B]/50" />,
    title: " Traditional Engagement Experience",
    desc: "Two heritages, one love story — the traditional photos are almost here.",
    showCountdown: true,
    countdownDays: 75,
    media: "image",
    imageSrc: "/images/image copy 2.png"
  },
  {
    icon: <Crown className="w-5 h-5 text-[#B23A6B]/50" />,
    title: "White wedding ceremony",
    desc: "Be Present to capture the moments.",
    media: "image",
    imageSrc: "/images/image copy 3.png"
  },
];


export default function LoveStory() {
  const [fullscreenMedia, setFullscreenMedia] = useState<React.ReactNode | null>(null);

  const targetDate = new Date("2026-10-30T14:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let observer: IntersectionObserver;
    import("@vimeo/player").then((PlayerModule) => {
      const Player = PlayerModule.default;
      const iframe = document.getElementById("story-vimeo-player") as HTMLIFrameElement;
      if (iframe) {
        const player = new Player(iframe);
        player.on("play", () => {
          window.dispatchEvent(new Event("fade-music-out"));
        });
        player.on("pause", () => {
          window.dispatchEvent(new Event("fade-music-in"));
        });

        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              player.setVolume(0.5).catch(() => {});
              player.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
              player.pause().catch(() => {});
              window.dispatchEvent(new Event("fade-music-in"));
            }
          });
        }, { threshold: 0.3 });
        
        observer.observe(iframe);
      }
    }).catch(err => console.log("Failed to load Vimeo player", err));

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="timeline" className="py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {fullscreenMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
            onClick={() => setFullscreenMedia(null)}
          >
            <div className="absolute top-6 right-6 text-white cursor-pointer hover:bg-white/10 p-2 rounded-full">
              <X className="w-8 h-8" />
            </div>
            <div className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none" onClick={e => e.stopPropagation()}>
              <div className="w-full h-full flex items-center justify-center cursor-default bg-white rounded-2xl overflow-hidden">
                {fullscreenMedia}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-3">
            Our Story
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#241B22] mb-3">
            How we got here
          </h2>
          <p
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
            className="text-base sm:text-lg text-[#6B5A63]"
          >
            The short version — before the trivia game gives away the rest.
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative space-y-16 md:space-y-24 mb-20">
          {/* Center Line (Left on mobile, center on desktop) */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#E3D3DA]" />

          {milestones.map((m, idx) => {
            const isEven = idx % 2 === 0;



            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative flex flex-col md:flex-row items-start md:items-center"
              >
                {/* Timeline Heart Node */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 md:top-6 w-7 h-7 rounded-full bg-[#FFFDFB] border-2 border-[#B23A6B] flex items-center justify-center shadow-sm z-10">
                  <Heart className="w-3 h-3 text-[#B23A6B] fill-[#B23A6B]" />
                </div>

                {/* Desktop: Opposite Side Title & Countdown */}
                <div className={`hidden md:flex absolute top-6 w-[40%] flex-col ${isEven ? 'left-1/2 ml-8 items-start text-left' : 'right-1/2 mr-8 items-end text-right'}`}>
                  <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }} className="text-2xl sm:text-3xl text-[#0E5C52] font-medium leading-tight">
                    {m.title}
                  </p>

                  {m.showCountdown && (
                    <div className={`mt-6 grid grid-cols-4 gap-2 w-full max-w-[280px] ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                      {[
                        { label: "Days", val: m.countdownDays },
                        { label: "Hours", val: timeLeft.hours },
                        { label: "Minutes", val: timeLeft.minutes },
                        { label: "Seconds", val: timeLeft.seconds },
                      ].map((unit) => (
                        <div key={unit.label} className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-xl py-2 px-1 text-center shadow-xs">
                          <span className="font-serif text-xl sm:text-2xl font-bold text-[#0E5C52]">
                            {String(unit.val).padStart(2, "0")}
                          </span>
                          <span className="block text-[7px] sm:text-[8px] font-semibold uppercase tracking-wider text-[#6B5A63] mt-1">
                            {unit.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`w-full pl-16 pr-2 pt-1 md:pt-0 md:w-[50%] md:px-0 ${isEven ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8 md:text-left"
                    }`}
                >
                  {/* Mobile: Title above the card */}
                  <div className="md:hidden mb-3 text-left">
                    <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }} className="text-2xl text-[#0E5C52] font-medium leading-tight">
                      {m.title}
                    </p>
                  </div>

                  <div className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow text-left">

                    {m.media === "image" ? (
                      <div
                        onClick={() => setFullscreenMedia(
                          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F3E7EB]/20 p-4">
                            <img src={m.imageSrc} alt={m.title} className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl" />
                          </div>
                        )}
                        className="w-full rounded-2xl flex flex-col items-center justify-center mb-4 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img src={m.imageSrc} alt={m.title} className="w-full h-auto object-contain" />
                      </div>
                    ) : m.media === "loading" ? (
                      <div className="aspect-[16/9] w-full rounded-2xl border border-dashed border-[#E3D3DA] flex flex-col items-center justify-center gap-2 mb-4 relative overflow-hidden bg-[#EAE1E1]">
                        {/* Blurred background image to look like a placeholder */}
                        <img src="/images/IMG_2588.JPG" alt="Loading" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-60 scale-110" />
                        <div className="absolute inset-0 bg-black/10 z-10"></div>
                        <div className="z-20 flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
                          <span className="text-white text-xs font-semibold tracking-widest uppercase drop-shadow-md">Loading Image...</span>
                        </div>
                      </div>
                    ) : m.media === "vimeo" ? (
                      <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black mb-4 shadow-sm">
                        <iframe
                          id="story-vimeo-player"
                          src="https://player.vimeo.com/video/1213738960?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          className="w-full h-full"
                          title="Pre-wedding shoot"
                        ></iframe>
                      </div>
                    ) : (
                      <div
                        onClick={() => setFullscreenMedia(
                          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F3E7EB]/20">
                            {m.icon && <div className="scale-[4]">{m.icon}</div>}
                          </div>
                        )}
                        className="aspect-[16/9] w-full rounded-2xl bg-[#F3E7EB]/60 border border-dashed border-[#E3D3DA] flex flex-col items-center justify-center gap-2 mb-4 cursor-pointer hover:bg-[#F3E7EB]/80 transition-colors"
                      >
                        {m.icon}
                        <span className="text-[10px] text-[#B23A6B] uppercase tracking-widest mt-2 opacity-50">Click to view</span>
                      </div>
                    )}

                    <p className="text-sm sm:text-base text-[#6B5A63]">
                      {m.desc}
                    </p>

                    {/* Mobile: Countdown underneath the description text */}
                    {m.showCountdown && (
                      <div className="md:hidden mt-6 flex flex-col items-start w-full">
                        <div className="grid grid-cols-4 gap-2 w-full max-w-[280px]">
                          {[
                            { label: "Days", val: m.countdownDays },
                            { label: "Hours", val: timeLeft.hours },
                            { label: "Minutes", val: timeLeft.minutes },
                            { label: "Seconds", val: timeLeft.seconds },
                          ].map((unit) => (
                            <div key={unit.label} className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-xl py-2 px-1 text-center shadow-xs">
                              <span className="font-serif text-xl sm:text-2xl font-bold text-[#0E5C52]">
                                {String(unit.val).padStart(2, "0")}
                              </span>
                              <span className="block text-[7px] sm:text-[8px] font-semibold uppercase tracking-wider text-[#6B5A63] mt-1">
                                {unit.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
