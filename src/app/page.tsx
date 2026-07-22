import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CurvedGallery from "@/components/CurvedGallery";
import VideoSection from "@/components/VideoSection";
import CountdownSection from "@/components/CountdownSection";
import LoveStory from "@/components/LoveStory";
import GameZone from "@/components/GameZone";
import MasonryGallery from "@/components/MasonryGallery";
import DressCode from "@/components/DressCode";
import AsoebiPaymentForm from "@/components/AsoebiPaymentForm";
import Accommodations from "@/components/Accommodations";
import VenueMap from "@/components/VenueMap";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#241B22]">
      <Navbar />
      <Hero />
      <CurvedGallery />
      <VideoSection />
      <CountdownSection />
      <LoveStory />
      <MasonryGallery />
      <GameZone />
      <DressCode />
      <AsoebiPaymentForm />
      <Accommodations />
      <VenueMap />
      <RSVP />
      <Footer />
    </main>
  );
}
