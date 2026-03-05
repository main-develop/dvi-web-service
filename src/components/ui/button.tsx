import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-[0.813rem]",
    "font-medium transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none uppercase [&_svg:not([class*='size-'])]:size-4 shrink-0",
    "[&_svg]:shrink-0 aria-invalid:border-destructive select-none cursor-pointer leading-none",
  ),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-secondary-foreground hover:bg-primary/90 disabled:hover:bg-primary",
        destructive: cn(
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "bg-destructive hover:bg-destructive/90 dark:bg-destructive/60 text-white",
        ),
        outline: cn(
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
          "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ),
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:text-accent-foreground hover:bg-accent/50 disabled:hover:bg-background",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8.5 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      effect: {
        none: "",
        scale:
          "active:scale-[0.93] disabled:active:scale-100 transition-transform duration-150 ease-in-out",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "scale",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  effect = "scale",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, effect, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
