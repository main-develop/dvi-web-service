import {
  BackgroundGridPattern,
  generateRandomPattern,
} from "../components/ui/background-grid-pattern";

export default function NotFound() {
  const backgroundGridSquares = generateRandomPattern();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <div className="fade-all-mask absolute inset-0">
        <BackgroundGridPattern squares={backgroundGridSquares} />
      </div>
      <h1 className="matrix-text text-6xl font-bold tracking-[0.04rem] select-none sm:text-9xl">
        404
      </h1>
      <p className="relative mt-2 text-base">Hmm... Seems like there&apos;s nothing here.</p>
    </div>
  );
}
