import { useId } from "react";

export function generateRandomPattern(length: number = 150): number[][] {
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 80) - 20, // random x between -20 and 59
    Math.floor(Math.random() * 50) - 5, // random y between -5 and 44
  ]);
}

interface BackgroundGridPatternProps {
  width?: number;
  height?: number;
  x?: string;
  y?: string;
  squares?: number[][];
}

export function BackgroundGridPattern({
  width = 24,
  height = 24,
  x = "0",
  y = "0",
  squares,
  ...props
}: React.ComponentProps<"svg"> & BackgroundGridPatternProps) {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      {...props}
      className="fill-matrix/10 stroke-matrix/25 absolute inset-0 h-full w-full mix-blend-overlay"
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect
              strokeWidth="0"
              key={index}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
