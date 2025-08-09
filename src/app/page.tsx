"use client";

import dynamic from "next/dynamic";
import HomeFooter from "@/components/HomeFooter";
import HeroSection from "@/components/home/HeroSection";
import ZigzagDecorator from "@/components/home/ZigzagDecorator";

// Dynamic imports for heavy components with loading states
const FeatureCards = dynamic(() => import("@/components/home/FeatureCards"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto max-w-6xl" />
});

const TechnologySection = dynamic(() => import("@/components/home/TechnologySection"), {
  loading: () => <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto max-w-6xl" />
});

const FAQSection = dynamic(() => import("@/components/home/FAQSection"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto max-w-4xl" />
});


const LearnMoreSection = dynamic(() => import("@/components/home/LearnMoreSection"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto max-w-6xl" />
});

export default function Home() {
  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-[var(--background)]">
      <main className="w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Technology Section */}
        <TechnologySection />

        {/* Decorative Zigzag */}
        <ZigzagDecorator />

        {/* Feature Cards */}
        <FeatureCards />

        {/* FAQ Section */}
        <FAQSection />

        {/* Learn More Section */}
        <LearnMoreSection />

      </main>

      <HomeFooter />
    </div>
  );
}
