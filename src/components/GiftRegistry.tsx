"use client";

import { useState } from "react";
import { Gift, Copy, Check, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GiftRegistry() {
  const [copied, setCopied] = useState(false);
  const accountNumber = "6506784864";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="registry" className="py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-3">
            A Gift of Love
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#241B22] mb-6">
            Wedding Registry
          </h2>
          <p className="text-[#6B5A63] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a monetary contribution towards our future together would be deeply appreciated.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E3D3DA] shadow-2xl shadow-[#E3D3DA]/40 relative overflow-hidden text-center"
        >
          {/* Subtle gold accent line at the top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF2CD] to-[#AA7C11]"></div>
          
          <div className="w-16 h-16 mx-auto bg-[#FDFBF7] rounded-full border border-[#E3D3DA] flex items-center justify-center mb-6 shadow-sm">
            <Gift className="w-7 h-7 text-[#B23A6B]" />
          </div>

          <h3 className="font-serif text-2xl text-[#241B22] mb-8">
            Bank Transfer Details
          </h3>

          <div className="bg-[#FDFBF7] border border-[#E3D3DA] rounded-2xl p-6 sm:p-8 max-w-md mx-auto relative group transition-all hover:border-[#B23A6B]/50 hover:shadow-md">
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#B23A6B] font-bold mb-1">Bank Name</p>
                <p className="font-serif text-xl text-[#241B22]">Providus Bank</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#B23A6B] font-bold mb-1">Account Name</p>
                <p className="font-serif text-xl text-[#241B22]">Olutunmbi Iyanuoluwa</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#B23A6B] font-bold mb-1">Account Number</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="font-mono text-2xl font-bold tracking-widest text-[#241B22]">
                    {accountNumber}
                  </p>
                  <button 
                    onClick={handleCopy}
                    className="p-2 rounded-full bg-[#E3D3DA]/50 hover:bg-[#B23A6B] hover:text-white transition-colors text-[#6B5A63]"
                    title="Copy Account Number"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Success message popup */}
            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0E5C52] text-white text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  Number Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#6B5A63] font-medium">
            <CreditCard className="w-4 h-4 text-[#B23A6B]" />
            <span>Secure & Direct Transfer</span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
