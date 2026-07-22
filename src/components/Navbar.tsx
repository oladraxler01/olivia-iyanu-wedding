"use me";
"use client";

import { useState, useEffect } from "react";
import { Menu, X, Music, VolumeX, Heart } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Our Story", href: "#story" },
    { name: "Curved Gallery", href: "#gallery" },
    { name: "Asoebi Shop", href: "#asoebi" },
    { name: "Fun Zone", href: "#funzone" },
    { name: "RSVP", href: "#rsvp" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/20 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#FDFBF7] shadow-sm group-hover:scale-105 transition-transform duration-300">
            <span className="font-serif text-lg font-bold text-[#D4AF37]">O&I</span>
          </div>
          <span className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#241B22] hidden sm:inline-block">
            Olivia <span className="text-[#D4A5A5] font-serif font-normal">&amp;</span> Iyanu
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium tracking-wide text-[#241B22]/80 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Ambient Music Toggle */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            title={isPlayingAudio ? "Mute Music" : "Play Ambient Wedding Music"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4A5A5]/15 border border-[#D4A5A5]/40 text-[#241B22] hover:bg-[#D4A5A5]/30 transition-all cursor-pointer"
          >
            {isPlayingAudio ? (
              <>
                <Music className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span className="hidden sm:inline text-xs text-[#241B22]">Music Playing</span>
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-[#D4AF37] animate-bounce"></span>
                  <span className="w-1 h-4 bg-[#D4A5A5] animate-bounce delay-75"></span>
                  <span className="w-1 h-2 bg-[#D4AF37] animate-bounce delay-150"></span>
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#241B22]/60" />
                <span className="hidden sm:inline text-xs text-[#241B22]/70">Play Music</span>
              </>
            )}
          </button>

          {/* Quick RSVP CTA */}
          <a
            href="#rsvp"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#C29B27] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            RSVP
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#241B22] hover:bg-[#D4A5A5]/20 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7]/98 backdrop-blur-xl border-b border-[#D4AF37]/20 px-6 py-6 transition-all duration-300 shadow-xl">
          <nav className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider text-[#241B22] hover:text-[#D4AF37] py-2 border-b border-[#D4A5A5]/15 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#rsvp"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-3 rounded-full text-center text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#C29B27] text-white shadow-md"
            >
              RSVP Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
