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
    <section id="save-the-date" className="py-16 px-4 bg-[#FDFBF7] text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        {/* Address Block */}
        <div className="mb-8 text-center space-y-5 max-w-2xl mx-auto px-4">
          {/* Church Venue */}
          <div className="space-y-1.5">
            <p className="text-[11px] sm:text-xs font-bold text-[#6B5A63] tracking-[0.2em] uppercase">
              VENUE:
            </p>
            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#0E5C52] leading-tight">
              REDEEMED CHRISTIAN CHURCH OF GOD, DOMINION SANCTUARY
            </h3>
            <p className="text-xs sm:text-sm text-[#241B22]/80 uppercase tracking-widest font-medium">
              ACME ROAD, OGBA IKEJA, LAGOS.
            </p>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-[#B23A6B]/30 mx-auto"></div>

          {/* Reception Venue */}
          <div className="space-y-1.5">
            <p className="text-[11px] sm:text-xs font-bold text-[#6B5A63] tracking-[0.2em] uppercase">
              RECEPTION FOLLOWS IMMEDIATELY @
            </p>
            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#0E5C52] leading-tight">
              PLEASANT EVENT CENTER
            </h3>
            <p className="text-xs sm:text-sm text-[#241B22]/80 uppercase tracking-widest font-medium">
              1 OBANTA AVENUE, OFF AJAO ROAD, IKEJA, LAGOS.
            </p>
          </div>
        </div>

        {/* Date Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#241B22]/80 font-medium mb-10 bg-[#FFFDFB] border border-[#E3D3DA] px-5 py-2.5 rounded-full shadow-sm max-w-full">
          <span className="flex items-center gap-2 text-[#0E5C52] font-semibold whitespace-nowrap">
            <Calendar className="w-4 h-4 text-[#B23A6B] shrink-0" />
            FRIDAY 30TH OCT, 2026
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
