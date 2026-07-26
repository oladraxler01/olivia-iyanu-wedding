"use client";

import { motion } from "framer-motion";
import { Star, PlusCircle, Music, Camera, CreditCard, Disc } from "lucide-react";

const previews = [
  {
    icon: Star,
    title: "Best Dressed Fashion Show",
    description: "A mini runway moment for the guests who really brought it — with a real prize on the line."
  },
  {
    icon: PlusCircle,
    title: "Lucky Dip",
    description: "Some gifts you choose. This one chooses you."
  },
  {
    icon: Music,
    title: "Live Band into DJ Set",
    description: "The band says hello. The DJ says let's go. Buckle up"
  },
  {
    icon: Camera,
    title: "Photo Booth Corner",
    description: "A little corner for big smiles — snap something to take home."
  },
  {
    icon: CreditCard,
    title: "Raffle Draw",
    description: "Every RSVP'd guest is automatically entered — one lucky winner takes it all."
  },
  {
    icon: Disc,
    title: "Tambourine Praise Session",
    description: "Grab a tambourine and join the aunties on the floor — this one gets loud, and everyone's invited."
  }
];

export default function PreviewSection() {
  return (
    <section className="py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-3">
            A Little Preview
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#0E5C52] mb-6">
            What to Look Forward To
          </h2>
          <p className="text-[#6B5A63] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            A few things we're planning for the reception — with plenty more still under wraps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {previews.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 sm:p-10 rounded-sm border border-[#E3D3DA] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-16 h-16 bg-[#0E5C52] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-[#FDFBF7]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-[#0E5C52] mb-4">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B5A63] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#B23A6B] italic font-serif text-lg">
            ...and a few surprises we're not ready to reveal just yet. 👀
          </p>
        </motion.div>

      </div>
    </section>
  );
}
