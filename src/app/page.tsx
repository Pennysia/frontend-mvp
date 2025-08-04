"use client";

import HomeFooter from "@/components/HomeFooter";
import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import ZigzagDecorator from "@/components/home/ZigzagDecorator";
import TechnologySection from "@/components/home/TechnologySection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import LearnMoreSection from "@/components/home/LearnMoreSection";

export default function Home() {
  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-[var(--background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Technology Section */}
        <TechnologySection />

        {/* Decorative Zigzag */}
        <ZigzagDecorator />

        {/* Feature Cards */}
        <FeatureCards />

        {/* Another Decorative Zigzag */}
        <ZigzagDecorator />

        {/* FAQ Section */}
        <FAQSection />

        {/* Learn More Section */}
        <LearnMoreSection />

      </main>

      <HomeFooter />
    </div>
  );
}
