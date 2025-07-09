// app/solutions/page.tsx
"use client";

import React from "react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import * as content from "./content";

// Import modular components
import BackgroundBlobs from "./components/BackgroundBlobs";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturesSection from "./components/FeaturesSection";
import ComparisonSection from "./components/ComparisonSection";
import ApplicationsSection from "./components/ApplicationsSection";
import UseCasesSection from "./components/UseCasesSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";

export default function DataDiodePage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-white font-sans">
        {/* Background blobs */}
        <BackgroundBlobs />
        
        {/* Hero Section */}
        <HeroSection 
          title={content.heroSection.title}
          subtitle={content.heroSection.subtitle}
          description={content.heroSection.description}
          ctaText={content.heroSection.ctaText}
        />
        
        {/* How It Works Section */}
        <HowItWorksSection 
          title={content.howItWorksSection.title}
          description={content.howItWorksSection.description}
        />
        
        {/* Key Features Section */}
        <FeaturesSection 
          title={content.featuresSection.title}
          features={content.featuresSection.features}
        />
        
        {/* Comparison Section */}
        <ComparisonSection 
          title={content.comparisonSection.title}
          description={content.comparisonSection.description}
          comparison={content.comparisonSection.comparison}
        />
        
        {/* Applications Section */}
        <ApplicationsSection 
          title={content.applicationsSection.title}
          applications={content.applicationsSection.applications}
        />
        
        {/* Use Cases Section */}
        <UseCasesSection 
          title={content.useCasesSection.title}
          cases={content.useCasesSection.cases}
        />
        
        {/* FAQ Section */}
        <FaqSection 
          title={content.faqSection.title}
          faqs={content.faqSection.faqs}
        />
        
        {/* Final CTA Section */}
        <CtaSection 
          title={content.ctaSection.title}
          buttonText={content.ctaSection.buttonText}
        />
      </main>
      <Footer />
    </>
  );
}