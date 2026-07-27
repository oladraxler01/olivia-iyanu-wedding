"use client";

import { Heart, Camera, Utensils, Users, Image as ImageIcon, Crown } from "lucide-react";
import { motion } from "framer-motion";

const milestones = [
  { 
    icon: <Utensils className="w-5 h-5 text-[#B23A6B]/50" />, 
    title: "Lunch/Dinner dates", 
    desc: "From first dates to forever — the dinner diaries are here.",
    media: "icon"
  },
  { 
    icon: <Camera className="w-5 h-5 text-[#B23A6B]/50" />, 
    title: "Pre-wedding shoot experience", 
    desc: "A glimpse of the magic before the big day.",
    media: "vimeo"
  },
  { 
    icon: <Camera className="w-5 h-5 text-[#B23A6B]/50" />, 
    title: "Proposal pictures", 
    desc: "Every crown has a beginning. Ours started with one question & deserves a proper reveal.",
    countdownNum: "60",
    countdownText: "DAYS",
    media: "loading"
  },
  { 
    icon: <Users className="w-5 h-5 text-[#B23A6B]/50" />, 
    title: "The Bridal party Squad", 
    desc: "The crown doesn't stand alone — get ready to meet the ones who hold it up.",
    media: "icon"
  },
  { 
    icon: <ImageIcon className="w-5 h-5 text-[#B23A6B]/50" />, 
    title: "Traditional engagement pictures", 
    desc: "Two heritages, one love story — the traditional photos are almost here.",
    countdownNum: "40",
    countdownText: "DAYS",
    media: "loading"
  },
  { 
    icon: <Crown className="w-5 h-5 text-[#B23A6B]/50" />, 
    title: "White wedding ceremony", 
    desc: "Be Present to capture the moments.",
    media: "icon"
  },
];

const storyParagraphs = [
  "It started at a friend's rooftop party — the kind of night neither of us planned to stay long at, and then didn't want to leave.",
  "What followed was a lot of long phone calls, a very rainy camping trip, and the slow, easy realisation that we didn't want to do life without each other.",
  "Iyanu asked Olivia to marry him on a quiet overlook, mid-sentence, before he'd even finished the speech he'd rehearsed. She said yes before he could get to the end of it.",
  "Now we're bringing our two families and all our favourite people together in Lagos — and we couldn't be happier that you're one of them.",
];

export default function LoveStory() {
  return (
    <section id="story" className="py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
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

        {/* Vertical Timeline — centered line */}
        <div className="relative space-y-16 mb-20">
          {/* Center Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#E3D3DA]" />

          {milestones.map((m, idx) => {
            const isEven = idx % 2 === 0;

            // Full-width special render for the Vimeo video
            if (m.media === "vimeo") {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative flex flex-col items-center w-full my-24 z-20"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-7 h-7 rounded-full bg-[#FFFDFB] border-2 border-[#B23A6B] flex items-center justify-center shadow-sm z-30">
                    <Heart className="w-3 h-3 text-[#B23A6B] fill-[#B23A6B]" />
                  </div>
                  
                  <div className="text-center mb-8 bg-[#FDFBF7] px-8 py-2 z-10">
                    <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-3xl sm:text-4xl text-[#0E5C52] font-medium mb-3">
                      {m.title}
                    </h3>
                    <p className="text-base text-[#6B5A63] max-w-xl mx-auto">{m.desc}</p>
                  </div>

                  <div 
                    className="w-full max-w-[1800px] aspect-[16/9] sm:aspect-[21/9] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden border-[8px] border-[#FFFDFB]"
                    style={{ borderRadius: "30px" }}
                  >
                    <iframe 
                      src="https://player.vimeo.com/video/1212676451?badge=0&autopause=0&player_id=0&app_id=58479" 
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture" 
                      className="w-full h-full"
                      title="Pre-wedding shoot"
                    ></iframe>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative flex items-start"
              >
                {/* Timeline Heart Node — centered on the line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-6 w-7 h-7 rounded-full bg-[#FFFDFB] border-2 border-[#B23A6B] flex items-center justify-center shadow-sm z-10">
                  <Heart className="w-3 h-3 text-[#B23A6B] fill-[#B23A6B]" />
                </div>

                {/* Opposite Side Title & Countdown */}
                <div className={`absolute top-6 w-[40%] flex flex-col ${isEven ? 'left-1/2 ml-8 items-start text-left' : 'right-1/2 mr-8 items-end text-right'}`}>
                  <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }} className="text-2xl sm:text-3xl text-[#0E5C52] font-medium leading-tight">
                    {m.title}
                  </p>
                  
                  {m.countdownNum && (
                    <div className="mt-4">
                      <div className="flex flex-col items-center justify-center border border-[#E3D3DA] rounded-[18px] w-[80px] h-[85px] bg-[#FFFDFB] shadow-sm">
                        <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-4xl text-[#0E5C52] leading-none mb-1">
                          {m.countdownNum}
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.15em] text-[#6B5A63] uppercase">
                          {m.countdownText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`w-[50%] ${
                    isEven ? "mr-auto pr-8 text-right" : "ml-auto pl-8 text-left"
                  }`}
                >
                  <div className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Media Render */}
                    {m.media === "loading" ? (
                      <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-[#F5EFEF] via-[#EAE1E1] to-[#F5EFEF] border border-dashed border-[#E3D3DA] flex flex-col items-center justify-center gap-2 mb-4 relative overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                        <ImageIcon className="w-8 h-8 text-[#B23A6B]/30 animate-pulse" />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full rounded-2xl bg-[#F3E7EB]/60 border border-dashed border-[#E3D3DA] flex flex-col items-center justify-center gap-2 mb-4">
                        {m.icon}
                      </div>
                    )}

                    <p className="text-sm sm:text-base text-[#6B5A63]">
                      {m.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Story Text in Cursive below the timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-6 text-center"
        >
          <h3 
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-3xl sm:text-4xl font-light text-[#0E5C52] mb-6"
          >
            Two houses, one crown.
          </h3>
          {storyParagraphs.map((p, idx) => (
            <p
              key={idx}
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              className="text-base sm:text-lg leading-relaxed text-[#241B22]/85"
            >
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
