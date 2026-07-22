"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const priceList = [
  { id: "ladies", name: "Aso-ebi fabric — Ladies (2 yards)", price: 25000 },
  { id: "men", name: "Aso-ebi fabric — Men (native wear length)", price: 28000 },
  { id: "gele", name: "Gele (head wrap)", price: 12000 },
  { id: "fila", name: "Men's cap (fila)", price: 8000 },
];

export default function AsoebiPaymentForm() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    ladies: 0,
    men: 0,
    gele: 0,
    fila: 0,
  });

  const totalAmount = priceList.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );

  const handleQuantityChange = (id: string, val: string) => {
    const parsed = parseInt(val, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }));
  };

  return (
    <section className="py-24 px-4 bg-[#F5EFEF]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B23A6B] mb-3">
            Dress With Us
          </p>
          <h2
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-4xl sm:text-5xl font-light text-[#0E5C52] mb-4"
          >
            Aso-Ebi Interest & Payment
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A63]">
            Let us know what you'd like, where to send it, and share your proof of payment below.
          </p>
        </div>

        {/* Price List Box */}
        <div className="bg-white p-8 mb-8 border border-[#E3D3DA]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B23A6B]/70 mb-6">
            Price List
          </p>
          <div className="space-y-4">
            {priceList.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm border-b border-[#F3E7EB] pb-3 last:border-0 last:pb-0"
              >
                <span className="text-[#241B22]">{item.name}</span>
                <span className="text-[#6B5A63]">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Box */}
        <div className="bg-white p-8 border border-[#E3D3DA]">
          <form className="space-y-6">
            <div>
              <label className="block text-xs text-[#6B5A63] mb-2">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6B5A63] mb-2">
                Phone / WhatsApp number
              </label>
              <input
                type="text"
                placeholder="e.g. 080X XXX XXXX"
                className="w-full px-4 py-3 border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6B5A63] mb-4">
                What would you like?
              </label>
              <div className="space-y-4">
                {priceList.map((item) => (
                  <div
                    key={item.id}
                    className="flex sm:items-center flex-col sm:flex-row justify-between gap-2 border-b border-[#F3E7EB] pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-[#241B22] flex-1">
                      {item.name} <br className="hidden sm:block" />
                      <span className="text-[#6B5A63] text-xs">
                        (₦{item.price.toLocaleString()})
                      </span>
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={quantities[item.id] || 0}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-full sm:w-24 px-4 py-2 text-center border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#6B5A63] mb-2">
                Delivery location
              </label>
              <textarea
                rows={3}
                placeholder="Full delivery address, including city and state"
                className="w-full px-4 py-3 border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
              ></textarea>
            </div>

            {/* Payment Details */}
            <div className="bg-[#EFE0E5]/60 p-6 rounded-sm text-sm text-[#241B22]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B5A63] mb-4">
                Payment details
              </p>
              <p className="mb-2">Bank: Guaranty Trust Bank (GTBank)</p>
              <p className="mb-2">Account name: Olivia & Iyanu Wedding Account</p>
              <p className="mb-4">Account number: 0123456789</p>
              <p className="font-bold text-[#B23A6B]">
                Amount due: ₦{totalAmount.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-xs text-[#6B5A63] mb-2">
                Upload proof of payment
              </label>
              <input
                type="file"
                className="text-sm text-[#6B5A63] file:mr-4 file:py-1 file:px-3 file:border file:border-[#E3D3DA] file:bg-[#FDFBF7] file:text-sm hover:file:bg-[#F3E7EB]"
              />
              <p className="text-xs text-[#6B5A63] mt-3 leading-relaxed">
                If your upload doesn't go through, please also send your proof of
                payment directly to +234 800 000 0000 on WhatsApp.
              </p>
            </div>

            <button
              type="button"
              className="px-6 py-3 bg-[#0E5C52] text-white text-sm font-medium rounded-sm hover:bg-[#0A4A42] transition-colors"
            >
              Submit my order
            </button>

            <p className="text-[10px] text-[#6B5A63] leading-relaxed mt-2">
              This form is convenient, not a secure payment gateway — please treat
              your account details as confidential and only pay into the account
              listed above.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
