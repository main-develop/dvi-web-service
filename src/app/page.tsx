import { CharParticlesBackground } from "../components/CharParticlesBackground";
import HeroSection from "../components/HeroSection";
import { OverviewSection } from "../components/OverviewSection";
import { PricingSection } from "../components/PricingSection";
import { generateRandomPattern } from "../components/ui/background-grid-pattern";

export default function Home() {
  const backgroundGridSquares = generateRandomPattern();

  return (
    <>
      <CharParticlesBackground
        className="absolute inset-0"
        quantity={130}
        staticity={40}
        ease={40}
        size={0.4}
        color="#08CB00"
      />
      <HeroSection />
      <OverviewSection backgroundGridSquares={backgroundGridSquares} />
      <PricingSection backgroundGridSquares={backgroundGridSquares} />
    </>
  );
}
