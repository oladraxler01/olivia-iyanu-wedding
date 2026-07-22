"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function CountdownSection() {
  const targetDate = new Date("2026-10-30T14:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
    <section className="py-16 px-4 bg-[#FDFBF7] text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        {/* Date Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#241B22]/80 font-medium mb-8 bg-[#FFFDFB] border border-[#E3D3DA] px-6 py-2.5 rounded-full shadow-2xs">
          <span className="flex items-center gap-1.5 text-[#0E5C52] font-semibold">
            <Calendar className="w-4 h-4 text-[#B23A6B]" />
            30 October 2026
          </span>
          <span className="text-[#E3D3DA]">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#D4A5A5]" />
            Lagos, Nigeria
          </span>
        </div>

        {/* Countdown Grid */}
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B5A63] mb-4">
          Countdown To Our Special Day
        </p>

        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
          {[
            { label: "Days", val: timeLeft.days },
            { label: "Hours", val: timeLeft.hours },
            { label: "Minutes", val: timeLeft.minutes },
            { label: "Seconds", val: timeLeft.seconds },
          ].map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#FFFDFB] border border-[#E3D3DA] rounded-2xl py-4 px-2 text-center shadow-xs hover:border-[#B23A6B] transition-colors"
            >
              <span className="font-serif text-3xl sm:text-5xl font-bold text-[#0E5C52]">
                {String(unit.val).padStart(2, "0")}
              </span>
              <span className="block text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#6B5A63] mt-1.5">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
