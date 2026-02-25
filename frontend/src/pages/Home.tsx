import React from "react";
import NavigationHeader from "../components/NavigationHeader";
import HeroSection from "../components/home/HeroSection";
import ProcessSection from "../components/home/ProcessSection";
import SpecialtiesSection from "../components/home/SpecialtiesSection";
import BenefitsSection from "../components/home/BenefitsSection"; // ← Importar
import CTASection from "../components/home/CTASection";
import Footer from "../components/home/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <HeroSection />
      <ProcessSection />
      <SpecialtiesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
