import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EnvelopeLoader from "@/components/EnvelopeLoader";
import CurvedGallery from "@/components/CurvedGallery";
import VideoSection from "@/components/VideoSection";
import CountdownSection from "@/components/CountdownSection";
import LoveStory from "@/components/LoveStory";
import GameZone from "@/components/GameZone";
import MasonryGallery from "@/components/MasonryGallery";
import DressCode from "@/components/DressCode";
import AsoebiPaymentForm from "@/components/AsoebiPaymentForm";
import VenueMap from "@/components/VenueMap";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <EnvelopeLoader />
      <main id="main-content" className="min-h-screen bg-[#FDFBF7] text-[#241B22] overflow-x-hidden">
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
      <VenueMap />
      <RSVP />
        <Footer />
      </main>
    </>
  );
}
