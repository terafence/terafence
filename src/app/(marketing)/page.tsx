import Analysis from "@/components/marketing/analysis";
import PremiumCompanies from "@/components/marketing/companies";
import CTA from "@/components/marketing/cta";
import Features from "@/components/marketing/features";
import Hero from "@/components/marketing/hero";
import Security from "@/components/marketing/sec";
import NewsPreview from "@/components/marketing/newspreview";
import TerafencePlatform from "@/components/marketing/platform";
const HomePage = () => {
  return (
    <>
      <Hero />
      <PremiumCompanies />
      <NewsPreview />
      <Features />
      <Analysis />
      <TerafencePlatform />
      <Security />
      <CTA />
    </>
  );
};

export default HomePage;
