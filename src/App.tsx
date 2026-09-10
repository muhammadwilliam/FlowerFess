import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhySection } from './components/WhySection';
import { ServicesSection } from './components/ServicesSection';
import { FlowersSection } from './components/FlowersSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { OrderSection } from './components/OrderSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<string>('Sweet Bloom');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackage = (packageName: string) => {
    setSelectedPackage(packageName);
    scrollToSection('order');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFD] text-stone-800 antialiased">
      {/* Navigation */}
      <Navbar onOrderClick={() => scrollToSection('order')} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOrderClick={() => scrollToSection('order')}
          onExploreFlowersClick={() => scrollToSection('flowers')}
        />

        {/* Why Flowerfess Section */}
        <WhySection />

        {/* Services Section */}
        <ServicesSection onSelectServiceOrder={() => scrollToSection('order')} />

        {/* Flower Collection / Packages */}
        <FlowersSection
          onSelectPackage={handleSelectPackage}
          selectedPackageName={selectedPackage}
        />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Order Form & Payment (QRIS) */}
        <OrderSection
          selectedPackage={selectedPackage}
          onPackageChange={(pkg) => setSelectedPackage(pkg)}
        />

        {/* About Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
