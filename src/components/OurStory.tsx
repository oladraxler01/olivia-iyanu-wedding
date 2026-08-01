"use client";

import { motion } from "framer-motion";

const storyParagraphs = [
  "If someone had told us that a workplace would become the setting for our greatest love story, we probably would have smiled politely and dismissed the thought. After all, we met not at a wedding, not through friends, and not by some dramatic twist of fate, but in the middle of everyday responsibilities, deadlines, and monthly reports.",
  "We were colleagues in the same organisation, working in different functions, yet our roles were closely connected. Every month, our work required us to exchange information, align on deliverables, and support each other to keep things moving. In those early days, our conversations were purposeful and professional, with brief discussions focused on numbers, timelines, and updates.",
  "But love has a way of entering quietly.",
  "What began as routine communication gradually became something we both looked forward to. Meetings became easier. Conversations became longer. The smiles became warmer. We began to notice not just the work each of us did, but the person behind it: the kindness, the intelligence, the dedication, the humour, and the calm presence that made even the busiest days feel lighter.",
  "Without planning it, we started becoming part of each other's daily lives. A quick work question would turn into a conversation about life. A shared challenge at work became an opportunity to encourage one another. The professional respect we had for each other slowly blossomed into a friendship that felt effortless and genuine.",
  "And then, somewhere between the ordinary moments, something extraordinary happened.",
  "We realised that our hearts had quietly grown closer.",
  "There was no single dramatic moment when everything changed. Instead, it felt like watching a sunrise, gradual, beautiful, and impossible to ignore once the light appeared. The more we talked, the more we discovered how much we shared: our values, our faith, our dreams for the future, and our desire to build a life centred on love, purpose, and God.",
  "What made our relationship special was not the speed at which it began, but the depth with which it grew. We became each other's safe place, the person to celebrate with in moments of joy and the person to lean on in moments of uncertainty. Through busy seasons, personal milestones, and countless conversations, our connection became stronger, steadier, and more intentional.",
  "Looking back now, we can see that God was writing our story long before we recognised it. He used ordinary circumstances to bring two people together, teaching us that true love is often found not in spectacular events, but in consistent kindness, patient friendship, and the quiet decision to choose one another every day.",
  "What started as colleagues became friends.",
  "Friendship became love.",
  "Love became a promise.",
  "And that promise has led us here, standing hand in hand, grateful for every conversation, every shared moment, and every step that brought us to this beautiful beginning.",
  "As we prepare to say \"I do,\" we know that this is not the end of our story. It is the first page of a new chapter, one we will continue to write together with faith, laughter, grace, and a love that began in the most unexpected place and grew into the greatest gift of our lives.",
  "And so, our forever begins."
];

export default function OurStory() {
  return (
    <section id="story" className="py-16 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Story Text in Cursive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h3
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-3xl sm:text-4xl font-light text-[#0E5C52] mb-6"
          >
            Our Love Story
          </h3>

          <div className="relative border-y border-[#E3D3DA]/50 py-2">
            {/* Top gradient mask for smooth scrolling feel */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>

            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto space-y-6 px-4 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0E5C52]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#0E5C52]/40 transition-colors text-left sm:text-center">
              {storyParagraphs.map((p, idx) => (
                <p
                  key={idx}
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  className="text-base sm:text-lg leading-relaxed text-[#241B22]/85"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Bottom gradient mask */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
