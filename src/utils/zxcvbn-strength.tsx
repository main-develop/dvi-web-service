import { zxcvbn, type ZxcvbnResult } from "@zxcvbn-ts/core";
import { useMemo } from "react";
import { cn } from "../lib/utils";
import { Check, X } from "lucide-react";

export const passwordResult = (password: string) => {
  return zxcvbn(password);
};

export function ZxcvbnStrength({ password }: { password: string }) {
  const result: ZxcvbnResult = useMemo(() => passwordResult(password), [password]);

  const getLabel = (score: number) => {
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    return labels[score] ?? "Unknown";
  };

  const getColor = (score: number) => {
    if (score <= 1) return "text-destructive";
    if (score === 2) return "text-orange-500";
    return "text-matrix/70";
  };

  return (
    <div className={cn("flex justify-between text-sm font-medium", getColor(result.score))}>
      <span className="flex items-center gap-2 transition-colors duration-400">
        {["Very weak", "Weak"].includes(getLabel(result.score)) ? (
          <X size={15} />
        ) : (
          <Check size={15} />
        )}
        Password strength
      </span>
      <span className="transition-colors duration-400">{getLabel(result.score)}</span>
    </div>
  );
}
