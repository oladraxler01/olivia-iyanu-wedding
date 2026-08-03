import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EnvelopeLoader from "@/components/EnvelopeLoader";
import CurvedGallery from "@/components/CurvedGallery";
import VideoSection from "@/components/VideoSection";
import CountdownSection from "@/components/CountdownSection";
import OurStory from "@/components/OurStory";
import LoveStory from "@/components/LoveStory";
import GameZone from "@/components/GameZone";
import MasonryGallery from "@/components/MasonryGallery";
import DressCode from "@/components/DressCode";
import AsoebiPaymentForm from "@/components/AsoebiPaymentForm";
import VenueMap from "@/components/VenueMap";
import PreviewSection from "@/components/PreviewSection";
import RSVP from "@/components/RSVP";
import GiftRegistry from "@/components/GiftRegistry";
import GuestUploads from "@/components/GuestUploads";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";

export default function Home() {
  return (
    <>
      <AudioPlayer />
      <EnvelopeLoader />
      <main id="main-content" className="min-h-screen bg-[#FDFBF7] text-[#241B22] overflow-x-hidden">
        <Navbar />
        <Hero />
        <CountdownSection />
        <CurvedGallery />
        <OurStory />
        <VideoSection />
        <LoveStory />
        <GameZone />
        <PreviewSection />
        <GuestUploads />
        <RSVP />
        <DressCode />
        <AsoebiPaymentForm />
        <GiftRegistry />
        <VenueMap />
        <MasonryGallery />
        <Footer />
      </main>
    </>
  );
}
