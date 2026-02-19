import { cn } from "@/src/lib/utils";
import React from "react";

type BackgroundGridPatternProps = React.ComponentProps<"div"> & {
  size?: number;
  fill?: string;
};

const BackgroundGridPattern = ({
  size = 24,
  fill = "#00ff002a",
  className,
  style,
  ...props
}: BackgroundGridPatternProps) => {
  return (
    <div
      className={cn("radial-mask absolute inset-0 z-[-10] size-full", className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${fill} 1px, transparent 1px), 
        linear-gradient(to bottom, ${fill} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        ...style,
      }}
      {...props}
    />
  );
};

BackgroundGridPattern.displayName = "BackgroundGridPattern";
export { BackgroundGridPattern };
