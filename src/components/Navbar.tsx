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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/20 py-3"
        : "bg-black/10 backdrop-blur-md border-b border-white/10 py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a href="#" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300 ${scrolled ? 'border-[#D4AF37] bg-[#FDFBF7]' : 'border-white/50 bg-white/10 backdrop-blur-sm'}`}>
            <span className={`font-serif text-lg font-bold ${scrolled ? 'text-[#D4AF37]' : 'text-white'}`}>O&I</span>
          </div>
          <span className={`font-serif text-xl sm:text-2xl font-light tracking-wide hidden sm:inline-block transition-colors duration-300 ${scrolled ? 'text-[#241B22]' : 'text-white'}`}>
            Olivia <span className={`font-serif font-normal ${scrolled ? 'text-[#D4A5A5]' : 'text-[#D4AF37]'}`}>&amp;</span> Iyanu
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-300 hover:after:w-full ${scrolled ? 'text-[#241B22]/80 hover:text-[#D4AF37] after:bg-[#D4AF37]' : 'text-white/90 hover:text-white after:bg-white'}`}
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
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${scrolled ? 'bg-[#D4A5A5]/15 border-[#D4A5A5]/40 text-[#241B22] hover:bg-[#D4A5A5]/30' : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'}`}
          >
            {isPlayingAudio ? (
              <>
                <Music className={`w-3.5 h-3.5 animate-pulse ${scrolled ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`} />
                <span className="hidden sm:inline text-xs">Music Playing</span>
                <span className="flex items-center gap-0.5 ml-1">
                  <span className={`w-1 h-3 animate-bounce ${scrolled ? 'bg-[#D4AF37]' : 'bg-white'}`}></span>
                  <span className={`w-1 h-4 animate-bounce delay-75 ${scrolled ? 'bg-[#D4A5A5]' : 'bg-white/70'}`}></span>
                  <span className={`w-1 h-2 animate-bounce delay-150 ${scrolled ? 'bg-[#D4AF37]' : 'bg-white'}`}></span>
                </span>
              </>
            ) : (
              <>
                <VolumeX className={`w-3.5 h-3.5 ${scrolled ? 'text-[#241B22]/60' : 'text-white/80'}`} />
                <span className={`hidden sm:inline text-xs ${scrolled ? 'text-[#241B22]/70' : 'text-white/90'}`}>Play Music</span>
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
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-[#241B22] hover:bg-[#D4A5A5]/20' : 'text-white hover:bg-white/20'}`}
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
