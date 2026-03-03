import { CharParticlesBackground } from "@/src/components/home/CharParticlesBackground";
import HeroSection from "@/src/components/home/HeroSection";
import { OverviewSection } from "@/src/components/home/OverviewSection";
import { PricingSection } from "@/src/components/home/PricingSection";
import { generateRandomPattern } from "@/src/components/ui/background-grid-pattern";

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
