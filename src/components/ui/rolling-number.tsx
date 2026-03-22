"use client";

import { useMemo } from "react";

interface RollingNumberProps {
  value: number;
  className?: string;
  format?: Intl.NumberFormatOptions;
  locales?: string;
  suffix?: string;
}

function Digit({ digit, delay = 0 }: { digit: string; delay?: number }) {
  const isNumber = /\d/.test(digit);

  if (!isNumber) {
    return <span className="inline-block">{digit}</span>;
  }

  const num = parseInt(digit, 10);

  return (
    <span className="inline-block overflow-hidden" style={{ height: "1em" }}>
      <span
        className="inline-flex flex-col"
        style={{
          transform: `translateY(${-num * 10}%)`,
          transitionProperty: "transform",
          transitionDuration: "1000ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span
            key={n}
            className="inline-block text-center tabular-nums"
            style={{ height: "1em", lineHeight: "1em" }}
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function RollingNumber({
  value,
  className = "",
  format = { style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" },
  locales = "en-US",
  suffix = "",
}: RollingNumberProps) {
  const formatted = useMemo(
    () => new Intl.NumberFormat(locales, format).format(value),
    [value, locales, format],
  );

  const chars = formatted.split("");

  return (
    <span className={`inline-flex items-baseline tabular-nums ${className}`}>
      {chars.map((char, i) => (
        <Digit key={`${i}-${chars.length}`} digit={char} delay={i * 30} />
      ))}

      {suffix && <span className="text-muted-foreground ml-1 text-base">{suffix}</span>}
    </span>
  );
}
