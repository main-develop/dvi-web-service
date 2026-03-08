import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    const inputClasses = cn(
      "file:text-foreground placeholder:text-muted-foreground bg-transparent border-input",
      "border-2 h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs outline-none",
      "transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:text-sm",
      "file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed",
      "disabled:opacity-50 md:text-sm transition-all duration-300 ease-in",
      "focus-visible:border-matrix-80 focus-visible:ring-matrix-80",
      "aria-invalid:ring-destructive aria-invalid:border-destructive",
      label && "peer",
      className,
    );

    if (!label) {
      return <input type={type} className={inputClasses} ref={ref} {...props} />;
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          placeholder=" "
          id={props.id || props.name}
          {...props}
        />
        <label
          htmlFor={props.id || props.name}
          className={cn(
            "absolute start-2 top-2 z-10 origin-[0] rounded-4xl px-2 duration-300 select-none",
            "text-foreground -translate-y-4 scale-90 transform text-sm leading-4 font-medium",
            "text-muted-foreground/60 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            "bg-background peer-focus:secondary cursor-text peer-focus:scale-90 peer-focus:px-2",
            "peer-focus:text-matrix peer-focus:top-2 peer-focus:-translate-y-4",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
            "peer-placeholder-shown:scale-100 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
            "peer-aria-invalid:peer-placeholder-shown:text-muted-foreground/60",
            "peer-aria-invalid:text-destructive peer-focus:peer-aria-invalid:text-destructive",
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);

Input.displayName = "Input";
