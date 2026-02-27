import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    const inputClasses = cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-matrix/20 selection:text-matrix bg-transparent border-input border-2 h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-matrix-80 focus-visible:ring-matrix-80 transition-all duration-300 ease-in",
      "aria-invalid:ring-destructive aria-invalid:border-destructive",
      label && "peer",
      className
    );

    if (!label) {
      return (
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={props.id}
          className={cn(
            // Base Label styles from label.tsx
            "text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            // Floating styles from floating-label.tsx
            "peer-focus:secondary rounded-4xl absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-90 transform px-2 text-sm text-muted-foreground/60 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:px-2 peer-focus:text-matrix bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

Input.displayName = "Input";
