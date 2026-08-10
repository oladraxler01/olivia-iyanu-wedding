"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  CreditCard,
  FileCheck,
  Copy,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface PriceItem {
  id: string;
  name: string;
  shortName: string;
  price: number;
  category: "fabric" | "accessory";
  description?: string;
}

export const priceList: PriceItem[] = [
  {
    id: "ladies_3",
    name: "Aso-ebi fabric — Ladies (3 yards)",
    shortName: "Ladies (3 yards)",
    price: 24000,
    category: "fabric",
    description: "Ideal for wrapper & blouse or simple dress cuts",
  },
  {
    id: "ladies_4",
    name: "Aso-ebi fabric — Ladies (4 yards)",
    shortName: "Ladies (4 yards)",
    price: 32000,
    category: "fabric",
    description: "Perfect for full gowns with flare & sleeves",
  },
  {
    id: "ladies_5",
    name: "Aso-ebi fabric — Ladies (5 yards)",
    shortName: "Ladies (5 yards)",
    price: 40000,
    category: "fabric",
    description: "Complete luxury length for elaborate styles",
  },
  {
    id: "gele",
    name: "Sego Gele (head wrap)",
    shortName: "Sego Gele",
    price: 11500,
    category: "accessory",
    description: "Premium metallic luster headwrap to complete the look",
  },
  {
    id: "fila",
    name: "Men's cap (fila)",
    shortName: "Men's Fila Cap",
    price: 10000,
    category: "accessory",
    description: "Custom tailored cap made to your specific head size",
  },
];

export default function AsoebiPaymentForm() {
  // Submission Mode: "pay_now" (Ready to pay with receipt) | "interest" (Reservation to pay by Aug 31)
  const [mode, setMode] = useState<"pay_now" | "interest">("pay_now");

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    ladies_3: 0,
    ladies_4: 0,
    ladies_5: 0,
    gele: 0,
    fila: 0,
  });

  const [filaMeasurement, setFilaMeasurement] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMode, setSubmittedMode] = useState<"interest" | "pay_now" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  // Auto-switch tab based on URL parameters or hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkParams = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash;
        const modeParam = searchParams.get("mode") || searchParams.get("tab");

        if (
          modeParam === "pay" ||
          modeParam === "pay_now" ||
          hash === "#asoebi-pay" ||
          searchParams.get("pay") === "true"
        ) {
          setMode("pay_now");
        } else if (
          modeParam === "interest" ||
          modeParam === "reserve" ||
          hash === "#asoebi-reserve"
        ) {
          setMode("interest");
        }
      };

      checkParams();
      window.addEventListener("hashchange", checkParams);
      return () => window.removeEventListener("hashchange", checkParams);
    }
  }, []);

  const totalAmount = priceList.reduce((sum, item) => {
    const q = quantities[item.id] || 0;
    return sum + item.price * q;
  }, 0);

  const totalItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleManualQuantity = (id: string, val: string) => {
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

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBankField(field);
      setTimeout(() => setCopiedBankField(null), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide your phone / WhatsApp number.");
      return;
    }
    if (!deliveryLocation.trim()) {
      setError("Please provide your delivery location (city and state).");
      return;
    }

    if (totalAmount <= 0 || totalItemsCount === 0) {
      setError("Please select at least 1 Aso-Ebi item or fabric length.");
      return;
    }

    if ((quantities.fila || 0) > 0 && !filaMeasurement.trim()) {
      setError("Cap size / head measurement is compulsory when ordering Men's cap (fila). Please provide the measurement (e.g. 22.5 inches, 57cm, or Size 7¼).");
      const capInput = document.getElementById("fila-measurement-input");
      if (capInput) {
        capInput.scrollIntoView({ behavior: "smooth", block: "center" });
        capInput.focus();
      }
      return;
    }

    if (mode === "pay_now" && !file) {
      setError("Please upload your transfer receipt / proof of payment.");
      return;
    }

    setIsSubmitting(true);

    try {
      let proofUrl = "INTEREST_RESERVATION";

      // If paying now, upload proof to Supabase Storage
      if (mode === "pay_now" && file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw new Error("Receipt upload failed: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(fileName);

        proofUrl = publicUrlData.publicUrl;
      }

      // Payload matching Supabase table schema
      const orderPayload = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        delivery_location: deliveryLocation.trim(),
        items: {
          ...quantities,
          email: email.trim() || undefined,
          fila_measurement: filaMeasurement.trim() || undefined,
          order_type: mode, // "pay_now" | "interest"
          notes: notes.trim(),
          payment_deadline: "August 31, 2026",
          submitted_at: new Date().toISOString(),
        },
        total_amount: totalAmount,
        proof_of_payment_url: proofUrl,
      };

      const { error: dbError } = await supabase
        .from("asoebi_orders")
        .insert([orderPayload]);

      if (dbError) {
        throw new Error("Failed to record order: " + dbError.message);
      }

      // Trigger automated confirmation email if email provided
      if (email.trim() && email.includes("@")) {
        const lineItems = priceList
          .filter((item) => (quantities[item.id] || 0) > 0)
          .map((item) => ({
            id: item.id,
            name: item.name,
            shortName: item.shortName,
            price: item.price,
            qty: quantities[item.id] || 0,
          }));

        try {
          await fetch("/api/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim(),
              fullName: fullName.trim(),
              phone: phone.trim(),
              mode,
              lineItems,
              totalAmount,
              deliveryLocation: deliveryLocation.trim(),
              filaMeasurement: filaMeasurement.trim(),
              notes: notes.trim(),
            }),
          });
        } catch (emailErr) {
          console.warn("Automated email dispatch error:", emailErr);
        }
      }

      setSubmittedMode(mode);
    } catch (err: any) {
      console.error("Asoebi submission error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setDeliveryLocation("");
    setFilaMeasurement("");
    setNotes("");
    setFile(null);
    setQuantities({ ladies_3: 0, ladies_4: 0, ladies_5: 0, gele: 0, fila: 0 });
    setSubmittedMode(null);
    setError(null);
  };

  return (
    <section id="asoebi" className="py-20 px-4 bg-[#F7F3EE] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#B23A6B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E5C52]/10 text-[#0E5C52] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-[#B23A6B]" />
            Asoebi Shop
          </div>
          <h2
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-[#0E5C52] mb-3 tracking-tight"
          >
            Celebrate In Style With Us
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A63] font-light leading-relaxed">
            Order your official fabric &amp; accessories or reserve your allocation for the wedding celebration.
          </p>
        </div>

        {/* 🚨 PAYMENT & ORDER DEADLINE BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF3E7] to-[#FFF8EE] border-2 border-[#D4AF37]/50 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 text-[#B88A2E] shadow-xs">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B23A6B] text-white">
                Important Deadline
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-[#0E5C52]">
                Payment &amp; Order Cut-off: August 31st, 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C4D55] leading-relaxed">
              To guarantee fabric and Aso-Ebi availability, and to give our custom tailors ample time for preparation, please note that <strong>all reservations must be paid for on or before August 31, 2026</strong>.
            </p>
          </div>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-[#E3D3DA] shadow-xl overflow-hidden">
          {/* Top Mode Selector Tabs */}
          {!submittedMode && (
            <div className="grid grid-cols-2 p-2 bg-[#F3ECE6] border-b border-[#E3D3DA] gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("pay_now");
                  setError(null);
                }}
                className={`py-3.5 px-3 sm:px-6 rounded-2xl font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${mode === "pay_now"
                  ? "bg-[#0E5C52] text-white font-bold shadow-md"
                  : "text-[#6B5A63] hover:text-[#0E5C52]"
                  }`}
              >
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-center">
                  <strong className="block text-xs sm:text-sm">1. Ready To Pay</strong>
                  <span className="hidden sm:inline text-[11px] font-normal opacity-85">
                    Transfer &amp; upload receipt
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("interest");
                  setError(null);
                }}
                className={`py-3.5 px-3 sm:px-6 rounded-2xl font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${mode === "interest"
                  ? "bg-white text-[#0E5C52] font-bold shadow-sm border border-[#D4AF37]/40"
                  : "text-[#6B5A63] hover:text-[#0E5C52]"
                  }`}
              >
                <FileCheck className="w-4 h-4 text-[#0E5C52]" />
                <span className="text-center">
                  <strong className="block text-xs sm:text-sm">2. Reservation</strong>
                  <span className="hidden sm:inline text-[11px] font-normal text-[#6B5A63]">
                    Reserve now (Pay by Aug 31)
                  </span>
                </span>
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 sm:p-10">
            {!submittedMode ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Mode description header */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]/60 flex items-start gap-3 text-xs sm:text-sm text-[#5C4D55]">
                  <Info className="w-5 h-5 text-[#B88A2E] flex-shrink-0 mt-0.5" />
                  <div>
                    {mode === "interest" ? (
                      <p>
                        <strong>Reserving without immediate payment:</strong> Select the items and quantities you plan to buy. We will record your reservation and reach out before <strong>August 31st</strong> to finalize payment.
                      </p>
                    ) : (
                      <p>
                        <strong>Immediate payment:</strong> Review our official bank account below, make your transfer, and attach your receipt/screenshot for instant order confirmation.
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Step 1: Customer Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#B23A6B] mb-4 flex items-center gap-2">
                    <span>1. Contact Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A3E45] mb-1.5">
                        Full Name <span className="text-[#B23A6B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Adeola Johnson"
                        className="w-full px-4 py-3 bg-[#FDFBF9] border border-[#E3D3DA] rounded-xl text-sm text-[#241B22] focus:outline-none focus:border-[#0E5C52] focus:ring-1 focus:ring-[#0E5C52]"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A3E45] mb-1.5">
                        Phone / WhatsApp Number <span className="text-[#B23A6B]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0803 123 4567"
                        className="w-full px-4 py-3 bg-[#FDFBF9] border border-[#E3D3DA] rounded-xl text-sm text-[#241B22] focus:outline-none focus:border-[#0E5C52] focus:ring-1 focus:ring-[#0E5C52]"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-[#4A3E45] mb-1.5 flex flex-wrap items-center justify-between gap-1">
                      <span>
                        Email Address <span className="text-[#8C7A84] font-normal">(Optional)</span>
                      </span>
                      <span className="text-[11px] text-[#0E5C52] font-normal">
                        Receive confirmation &amp; direct payment link
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. yourname@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF9] border border-[#E3D3DA] rounded-xl text-xs sm:text-sm text-[#241B22] focus:outline-none focus:border-[#0E5C52] focus:ring-1 focus:ring-[#0E5C52]"
                        disabled={isSubmitting}
                      />
                      <Mail className="w-4 h-4 text-[#8C7A84] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Step 2: Item Selection & Quantities */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#B23A6B] flex items-center gap-2">
                      <span>2. Select Your Aso-Ebi &amp; Items</span>
                    </h3>
                    <span className="text-xs text-[#6B5A63]">
                      {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""} selected
                    </span>
                  </div>

                  <div className="space-y-3">
                    {priceList.map((item) => {
                      const qty = quantities[item.id] || 0;
                      const isSelected = qty > 0;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 ${isSelected
                            ? "bg-[#FFFDF9] border-[#0E5C52]/50 shadow-sm"
                            : "bg-[#FAF7F2] border-[#E3D3DA]/70 hover:border-[#E3D3DA]"
                            }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Item Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm sm:text-base text-[#241B22]">
                                  {item.name}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs text-[#6B5A63] mt-0.5">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-xs font-bold text-[#0E5C52] font-mono mt-1">
                                ₦{item.price.toLocaleString()} per piece
                              </p>
                            </div>

                            {/* Counter Stepper */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={qty === 0 || isSubmitting}
                                className="w-8 h-8 rounded-xl bg-white border border-[#E3D3DA] text-[#6B5A63] hover:text-[#241B22] hover:bg-[#F3E7EB] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) => handleManualQuantity(item.id, e.target.value)}
                                className="w-14 text-center py-1.5 bg-white border border-[#E3D3DA] rounded-xl font-bold text-sm text-[#0E5C52] focus:outline-none focus:border-[#0E5C52]"
                                disabled={isSubmitting}
                              />

                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={isSubmitting}
                                className="w-8 h-8 rounded-xl bg-white border border-[#E3D3DA] text-[#6B5A63] hover:text-[#241B22] hover:bg-[#F3E7EB] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Men's Fila Cap Head Measurement Box */}
                          {item.id === "fila" && (
                            <div className={`mt-3 pt-3 border-t transition-all ${
                              qty > 0 
                                ? "border-[#B23A6B]/30 bg-[#FFF9FB] -mx-4 -mb-4 p-4 rounded-b-2xl" 
                                : "border-[#E3D3DA]/70"
                            }`}>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <label htmlFor="fila-measurement-input" className="block text-xs font-bold text-[#241B22]">
                                  Cap Size / Head Measurement{" "}
                                  {qty > 0 ? (
                                    <span className="text-[#B23A6B] font-bold">* (Compulsory)</span>
                                  ) : (
                                    <span className="text-[#8C7A84] font-normal">(Required if cap selected)</span>
                                  )}
                                </label>
                                {qty > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#B23A6B] text-white shadow-xs">
                                    Compulsory
                                  </span>
                                )}
                              </div>
                              <input
                                id="fila-measurement-input"
                                type="text"
                                required={qty > 0}
                                value={filaMeasurement}
                                onChange={(e) => setFilaMeasurement(e.target.value)}
                                placeholder={
                                  qty > 1
                                    ? "e.g. Cap 1: 22.5 inches, Cap 2: 23 inches (Compulsory for tailoring)"
                                    : "e.g. 22.5 inches, 57cm, or Size 7¼ (Compulsory for tailoring)"
                                }
                                className={`w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-[#241B22] focus:outline-none transition-all ${
                                  qty > 0 && !filaMeasurement.trim()
                                    ? "border-2 border-[#B23A6B] focus:border-[#B23A6B] focus:ring-1 focus:ring-[#B23A6B]"
                                    : "border border-[#E3D3DA] focus:border-[#0E5C52] focus:ring-1 focus:ring-[#0E5C52]"
                                }`}
                                disabled={isSubmitting}
                              />
                              <p className="text-[10.5px] text-[#8C7A84] italic mt-1.5 flex items-center gap-1">
                                <Info className="w-3 h-3 text-[#B23A6B] shrink-0" />
                                {qty > 0 ? (
                                  <span className="text-[#B23A6B] font-medium">
                                    Each cap will be custom tailored to this head measurement. Measure around the head just above the ears.
                                  </span>
                                ) : (
                                  <span>Your cap will be tailored specifically to this head measurement.</span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Delivery Location & Notes */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#B23A6B] mb-4 flex items-center gap-2">
                    <span>3. Delivery Information</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E45] mb-1.5">
                      Delivery Address / City &amp; State <span className="text-[#B23A6B]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g. 15 Lekki Phase 1, Lagos State (or Pickup in Lagos)"
                      className="w-full px-4 py-3 bg-[#FDFBF9] border border-[#E3D3DA] rounded-xl text-sm text-[#241B22] focus:outline-none focus:border-[#0E5C52] focus:ring-1 focus:ring-[#0E5C52]"
                      disabled={isSubmitting}
                    />
                    <p className="text-[11px] text-[#8C7A84] italic mt-1">
                      Note: Delivery fees will be communicated individually upon parcel dispatch.
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-[#4A3E45] mb-1.5">
                      Additional Notes / Requests (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for the couple"
                      className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-[#E3D3DA] rounded-xl text-xs text-[#241B22] focus:outline-none focus:border-[#0E5C52]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Step 4: Summary & Payment Info */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF3EA] border border-[#E5D7C5]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0D0BC]">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#6B5A63]">
                      Estimated Sum Total
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0E5C52]">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Mode 2 Specific: Bank Transfer Details */}
                  {mode === "pay_now" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-2 space-y-4"
                    >
                      <p className="text-xs font-semibold text-[#6B5A63] uppercase tracking-wider">
                        Official Payment Account
                      </p>

                      <div className="p-4 bg-white rounded-xl border border-[#D4AF37]/50 shadow-xs space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[#6B5A63]">Bank Name:</span>
                          <strong className="text-[#241B22]">Providus Bank</strong>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#6B5A63]">Account Name:</span>
                          <strong className="text-[#241B22]">Olutunmbi Iyanuoluwa</strong>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F3E7EB]">
                          <span className="text-[#6B5A63]">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <strong className="font-mono text-sm sm:text-base text-[#0E5C52] tracking-wider">
                              6506784864
                            </strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("6506784864", "account_no")}
                              className="p-1 text-[#0E5C52] hover:bg-[#0E5C52]/10 rounded-md transition-colors cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedBankField === "account_no" ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F3E7EB]">
                          <span className="text-[#6B5A63]">Transfer Narration / Remark:</span>
                          <div className="flex items-center gap-2">
                            <strong className="font-medium text-xs sm:text-sm text-[#B23A6B] bg-[#FFF2F6] px-2.5 py-0.5 rounded-md border border-[#B23A6B]/20">
                              Wedding asoebi
                            </strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("Wedding asoebi", "narration")}
                              className="p-1 text-[#B23A6B] hover:bg-[#B23A6B]/10 rounded-md transition-colors cursor-pointer"
                              title="Copy Transfer Narration"
                            >
                              {copiedBankField === "narration" ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Proof of payment upload */}
                      <div>
                        <label className="block text-xs font-semibold text-[#4A3E45] mb-1.5">
                          Upload Proof of Payment / Receipt <span className="text-[#B23A6B]">*</span>
                        </label>
                        <input
                          type="file"
                          required={mode === "pay_now"}
                          accept="image/png, image/jpeg, image/jpg, application/pdf"
                          onChange={handleFileChange}
                          className="w-full text-xs text-[#6B5A63] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#D4AF37] file:bg-[#FFFDF9] file:text-xs file:font-semibold file:text-[#0E5C52] hover:file:bg-[#F3E7EB] cursor-pointer"
                          disabled={isSubmitting}
                        />
                        <p className="text-[11px] text-[#8C7A84] mt-1.5 leading-relaxed">
                          Accepted formats: JPG, PNG, PDF. You can also message proof to +234 9075708080 on WhatsApp.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || totalAmount <= 0}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${mode === "interest"
                    ? "bg-[#0E5C52] text-white hover:bg-[#0A4A42]"
                    : "bg-[#B23A6B] text-white hover:bg-[#962F59]"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Recording details...</span>
                    </>
                  ) : mode === "interest" ? (
                    <>
                      <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit Interest &amp; Reserve Items</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#FFE082]" />
                      <span>Submit Confirmed Payment (₦{totalAmount.toLocaleString()})</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#8C7A84]">
                  All fabrics and accessory orders must be finalized by <strong>August 31st, 2026</strong>.
                </p>
              </form>
            ) : (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-4 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-[#0E5C52]/10 border-2 border-[#0E5C52] flex items-center justify-center mx-auto text-[#0E5C52]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    className="text-3xl sm:text-4xl font-light text-[#0E5C52]"
                  >
                    {submittedMode === "interest"
                      ? "Interest Successfully Recorded!"
                      : "Payment & Order Confirmed!"}
                  </h3>
                  <p className="text-sm text-[#5C4D55] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{fullName}</strong>! We have recorded your requested items and delivery location.
                  </p>
                </div>

                {/* Submission Details Card */}
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#FAF7F2] border border-[#E3D3DA] text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6B5A63]">Submission Type:</span>
                    <strong className="text-[#0E5C52] uppercase font-bold">
                      {submittedMode === "interest" ? "Reservation (Interest Only)" : "Paid Order (Proof Uploaded)"}
                    </strong>
                  </div>
                  {phone && (
                    <div className="flex justify-between">
                      <span className="text-[#6B5A63]">Phone / WhatsApp:</span>
                      <strong className="text-[#241B22]">{phone}</strong>
                    </div>
                  )}
                  {email && (
                    <div className="flex justify-between">
                      <span className="text-[#6B5A63]">Email Address:</span>
                      <strong className="text-[#241B22]">{email}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6B5A63]">Delivery Location:</span>
                    <strong className="text-[#241B22]">{deliveryLocation}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E3D3DA]">
                    <span className="text-[#6B5A63]">Estimated Sum Total:</span>
                    <strong className="font-bold text-sm text-[#0E5C52]">
                      ₦{totalAmount.toLocaleString()}
                    </strong>
                  </div>
                  {email && (
                    <div className="p-3 bg-[#0E5C52]/5 rounded-xl border border-[#0E5C52]/20 text-[#0E5C52] mt-2 flex items-start gap-2">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <div className="text-[11.5px] leading-relaxed">
                        An automated summary {submittedMode === "interest" ? "and direct payment link has" : "has"} been sent to <strong>{email}</strong>.
                      </div>
                    </div>
                  )}
                  {submittedMode === "interest" && (
                    <div className="p-3 bg-[#FAF3E7] rounded-xl border border-[#D4AF37]/40 text-[#8C6D1F] mt-2">
                      <p className="font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Reminder:
                      </p>
                      <p className="text-[11px] mt-0.5">
                        Kindly complete your payment by <strong>August 31st, 2026</strong> into Providus Bank (6506784864) with transfer narration <strong>&quot;Wedding asoebi&quot;</strong> to finalize fabric cut and delivery.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {submittedMode === "interest" && (
                    <button
                      onClick={() => {
                        setMode("pay_now");
                        setSubmittedMode(null);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#0E5C52] text-white text-xs font-semibold hover:bg-[#0A4A42] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Ready to Pay Now?</span>
                    </button>
                  )}

                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl border border-[#E3D3DA] text-xs font-semibold text-[#6B5A63] hover:text-[#0E5C52] hover:bg-[#F5EFEF] transition-colors cursor-pointer"
                  >
                    Submit another response
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
