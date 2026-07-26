"use client";

import { Heart, Camera, Utensils, Users, Image as ImageIcon, Crown } from "lucide-react";
import { motion } from "framer-motion";

const milestones = [
  { icon: <Utensils className="w-5 h-5 text-[#B23A6B]/50" />, title: "Lunch/Dinner dates", desc: "From first dates to forever — the dinner diaries are here." },
  { icon: <Camera className="w-5 h-5 text-[#B23A6B]/50" />, title: "Proposal pictures", desc: "Every crown has a beginning. Ours started with one question & deserves a proper reveal, [X days] to reveal." },
  { icon: <Users className="w-5 h-5 text-[#B23A6B]/50" />, title: "The Bridal party Squad", desc: "The crown doesn't stand alone — get ready to meet the ones who hold it up. [X days] to go." },
  { icon: <ImageIcon className="w-5 h-5 text-[#B23A6B]/50" />, title: "Traditional engagement pictures", desc: "Two heritages, one love story — the traditional photos are almost here." },
  { icon: <Crown className="w-5 h-5 text-[#B23A6B]/50" />, title: "White wedding ceremony", desc: "Be Present to capture the moments." },
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
      <div className="max-w-5xl mx-auto">
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

                {/* Content Card */}
                <div
                  className={`w-[45%] ${
                    isEven ? "mr-auto pr-8 text-right" : "ml-auto pl-8 text-left"
                  }`}
                >
                  <div className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    {/* Image Placeholder */}
                    <div className="aspect-[16/9] w-full rounded-2xl bg-[#F3E7EB]/60 border border-dashed border-[#E3D3DA] flex flex-col items-center justify-center gap-2 mb-4">
                      {m.icon}
                    </div>

                    <p
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic" }}
                      className="text-lg text-[#0E5C52] font-medium mb-2"
                    >
                      {m.title}
                    </p>
                    <p className="text-sm text-[#6B5A63]">
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
