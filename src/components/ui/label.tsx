"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/src/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "items-center text-sm leading-none font-medium select-none peer-disabled:opacity-50",
        "group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed",
        "group-data-[disabled=true]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
