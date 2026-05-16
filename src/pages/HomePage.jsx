import HeroSection from "../components/sections/HeroSection";
import StatsBar from "../components/sections/StatsBar";
import BotsSection from "../components/sections/BotsSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import PlansSection from "../components/sections/PlansSection";
import CTASection from "../components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <BotsSection />
      <FeaturesSection />
      <PlansSection />
      <CTASection />
    </>
  );
}
