"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "./button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import * as z from "zod";
import { otpSchema } from "@/src/lib/auth-schemas";
import { useState, useEffect } from "react";
import NumberFlow, { continuous, NumberFlowGroup } from "@number-flow/react";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      inputMode="text"
      containerClassName={cn(
        "flex items-center justify-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "border-input relative flex h-11 w-11 items-center justify-center rounded-md border-2",
        "text-base uppercase transition-[color,box-shadow] data-[active=true]:z-10 md:text-sm",
        "data-[active=true]:border-matrix-80 data-[active=true]:ring-matrix-80 transition-all",
        "bg-transparent shadow-xs duration-250 ease-in outline-none data-[active=true]:ring-[0.5px]",
        "aria-invalid:data-[active=true]:border-destructive aria-invalid:border-red-700",
        "aria-invalid:data-[active=true]:ring-destructive",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export default function OTPVerification({ email, onSuccess, onBack }: OTPVerificationProps) {
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = useWatch({
    control: form.control,
    name: "otp",
  });

  const onSubmit = (data: z.infer<typeof otpSchema>) => {
    console.log("OTP:", data.otp);
    onSuccess();
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <p className="text-center text-sm">
        A 6-digit code has been sent to <span className="font-bold break-all">{email}</span>.<br />
        Enter it below.
      </p>

      <Form {...form}>
        <form spellCheck={false} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (_, i) => (
                        <InputOTPSlot key={i} index={i} aria-invalid={!!fieldState.error} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full transition-all duration-300"
            disabled={otpValue.length < 6}
          >
            Verify
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => onBack?.()}>
          <ChevronLeft />
          <span className="translate-y-px leading-none">Back</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => setResendCooldown(60)}
          disabled={resendCooldown > 0}
          className="transition-all duration-300"
        >
          Resend Code
          {resendCooldown > 0 ? (
            <NumberFlowGroup>
              <span>
                (
                <NumberFlow
                  trend={-1}
                  value={Math.floor(resendCooldown / 60)}
                  digits={{ 1: { max: 5 } }}
                  format={{ minimumIntegerDigits: 2 }}
                ></NumberFlow>
                <NumberFlow
                  plugins={[continuous]}
                  prefix=":"
                  trend={-1}
                  value={resendCooldown % 60}
                  digits={{ 1: { max: 5 } }}
                  format={{ minimumIntegerDigits: 2 }}
                ></NumberFlow>
                )
              </span>
            </NumberFlowGroup>
          ) : (
            ""
          )}
        </Button>
      </div>
    </motion.div>
  );
}
