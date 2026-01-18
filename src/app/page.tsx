import { CharParticlesBackground } from "../components/CharParticlesBackground";

export default function Home() {
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
      <div className="h-[200vh]"></div>
    </>
  );
}
