import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tobi & Amanda — The Wedding Experience | December 18, 2026",
  description:
    "Join us in celebrating the union of Tobi & Amanda. Explore our love story, curved gallery, Asoebi attire shop, fun zone, and submit your RSVP.",
  openGraph: {
    title: "Tobi & Amanda — The Wedding Experience",
    description: "Celebrate the marriage of Tobi & Amanda on December 18, 2026.",
    images: [{ url: "/images/hero.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FDFBF7] text-[#241B22] font-sans antialiased selection:bg-[#D4A5A5] selection:text-white">
        {children}
      </body>
    </html>
  );
}
