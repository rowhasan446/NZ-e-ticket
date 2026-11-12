import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import Watermark from "@/components/Watermark";
import AboutSection from "@/components/AboutSection";
// import ScheduleSection from "@/components/ScheduleSection"; // Commented out per user request
import InstructionsList from "@/components/InstructionsList";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* 0. Initial Loading Animation with Logo */}
      <PageLoader />

      {/* 1. Kazi Nazrul Islam Watermark Background */}
      <Watermark />

      {/* 2. Header with Topbar, Cream Logo Area, and Sticky Rust Navbar */}
      <Header />

      {/* 3. Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section with new banner */}
        <HeroBanner />

        {/* উৎসব সম্পর্কে (About Section) */}
        <AboutSection />

        {/* 
          // -------------------------------------------------------------
          // অনুষ্ঠান সূচী (Schedule Section - Commented out per user request)
          // -------------------------------------------------------------
          // <ScheduleSection /> 
        */}

        {/* দর্শনার্থীদের জন্য নির্দেশনা ও নিয়মাবলি (Rules Section) */}
        <InstructionsList />

        {/* অনলাইন নিবন্ধন ফর্ম (Registration Section) */}
        <RegistrationForm />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
