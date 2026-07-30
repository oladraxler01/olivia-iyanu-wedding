"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const priceList = [
  { id: "ladies_3", name: "Aso-ebi fabric — Ladies (3 yards)", price: 24000 },
  { id: "ladies_4", name: "Aso-ebi fabric — Ladies (4 yards)", price: 32000 },
  { id: "men", name: "Aso-ebi fabric — Men (native wear length)", price: 28000 },
  { id: "gele", name: "Sego Gele (head wrap)", price: 16000 },
  { id: "fila", name: "Men's cap (fila)", price: 10000 },
];

export default function AsoebiPaymentForm() {
  const [quantities, setQuantities] = useState<{ [key: string]: number | "" }>({
    ladies_3: 0,
    ladies_4: 0,
    men: 0,
    gele: 0,
    fila: 0,
  });

  const [filaMeasurement, setFilaMeasurement] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = priceList.reduce(
    (sum, item) => {
      const q = quantities[item.id];
      const val = typeof q === 'number' ? q : 0;
      return sum + item.price * val;
    },
    0
  );

  const handleQuantityChange = (id: string, val: string) => {
    if (val === "") {
      setQuantities((prev) => ({ ...prev, [id]: "" }));
      return;
    }
    const parsed = parseInt(val, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !deliveryLocation.trim() || !file) {
      setError("Please fill out all fields and attach proof of payment.");
      return;
    }

    if (totalAmount <= 0) {
      setError("Please select at least one item before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error("Failed to upload image: " + uploadError.message);

      // 2. Retrieve Public URL
      const { data: publicUrlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      const proofUrl = publicUrlData.publicUrl;

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from("asoebi_orders")
        .insert([
          {
            full_name: fullName.trim(),
            phone: phone.trim(),
            delivery_location: deliveryLocation.trim(),
            items: { ...quantities, fila_measurement: filaMeasurement.trim() },
            total_amount: totalAmount,
            proof_of_payment_url: proofUrl,
          }
        ]);

      if (dbError) throw new Error("Failed to save order: " + dbError.message);

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="asoebi" className="py-24 px-4 bg-[#F5EFEF]">
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
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs text-[#6B5A63] mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs text-[#6B5A63] mb-2">
                  Phone / WhatsApp number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 080X XXX XXXX"
                  className="w-full px-4 py-3 border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
                  disabled={isSubmitting}
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
                        {item.id === "fila" && (
                          <div className="mt-3">
                            <label className="block text-[10px] text-[#6B5A63] mb-1 italic">
                              We're getting your fila made! Please measure around your head in inches:
                            </label>
                            <input
                              type="text"
                              value={filaMeasurement}
                              onChange={(e) => setFilaMeasurement(e.target.value)}
                              placeholder="e.g. 22 inches"
                              className="w-full sm:w-48 px-3 py-1.5 border border-[#E3D3DA] rounded-sm text-xs focus:outline-none focus:border-[#0E5C52]"
                              disabled={isSubmitting}
                            />
                          </div>
                        )}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={quantities[item.id]}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-full sm:w-24 px-4 py-2 text-center border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
                        disabled={isSubmitting}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#6B5A63] mb-2">
                  Delivery location <span className="italic text-[#B23A6B]">(Note: You are responsible for your asoebi delivery fee which will be communicated upon dispatch.)</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Full delivery address, including city and state"
                  className="w-full px-4 py-3 border border-[#E3D3DA] rounded-sm text-sm focus:outline-none focus:border-[#0E5C52]"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* Payment Details */}
              <div className="bg-[#EFE0E5]/60 p-6 rounded-sm text-sm text-[#241B22]">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6B5A63] mb-4">
                  Payment details
                </p>
                <p className="mb-2">Bank: Providus Bank</p>
                <p className="mb-2">Account name: Olutunmbi Iyanuoluwa</p>
                <p className="mb-4">Account number: 6506784864</p>
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
                  required
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="text-sm text-[#6B5A63] file:mr-4 file:py-1 file:px-3 file:border file:border-[#E3D3DA] file:bg-[#FDFBF7] file:text-sm hover:file:bg-[#F3E7EB]"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-[#6B5A63] mt-3 leading-relaxed">
                  If your upload doesn't go through, please also send your proof of
                  payment directly to +234 9075708080 on WhatsApp.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-[#0E5C52] text-white text-sm font-medium rounded-sm hover:bg-[#0A4A42] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  "Submit my order"
                )}
              </button>

              <p className="text-[10px] text-[#6B5A63] leading-relaxed mt-2 text-center">
                This form is convenient, not a secure payment gateway — please treat
                your account details as confidential and only pay into the account
                listed above.
              </p>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#0E5C52] mx-auto" />
              <h3 className="text-2xl font-light text-[#0E5C52]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                Order Successfully Received!
              </h3>
              <p className="text-sm text-[#6B5A63] leading-relaxed">
                Thank you, <strong>{fullName}</strong>. We have received your order details and payment proof safely. We'll be in touch shortly regarding your delivery!
              </p>
              <button
                onClick={() => {
                  setFullName("");
                  setPhone("");
                  setDeliveryLocation("");
                  setFile(null);
                  setQuantities({ ladies_3: 0, ladies_4: 0, men: 0, gele: 0, fila: 0 });
                  setFilaMeasurement("");
                  setSubmitted(false);
                }}
                className="mt-6 px-6 py-2 rounded-sm border border-[#E3D3DA] text-sm font-semibold text-[#0E5C52] hover:bg-[#F5EFEF] transition-colors"
              >
                Submit another order
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
