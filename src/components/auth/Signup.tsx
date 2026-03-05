"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import * as z from "zod";
import { signupSchema } from "@/src/lib/auth-schemas";
import { cn } from "@/src/lib/utils";
import { getTextLink } from "@/src/utils/get-text-link";
import OTPVerification from "../ui/otp-verification";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";

interface FieldProps {
  name: "email" | "username" | "password" | "confirmPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const fields: FieldProps[] = [
  { name: "email", type: "email", label: "Email" },
  { name: "username", type: "string", label: "Username" },
  { name: "password", type: "password", label: "Password" },
  { name: "confirmPassword", type: "password", label: "Confirm Password" },
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const itemVariants = getItemVariants(0, 0, 0.7);
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    shouldFocusError: false,
  });
  const isAgreed = useWatch({
    control: form.control,
    name: "agreeTerms",
  });

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    console.log("Signup data:", data);
    setCurrentStep(1);
    // router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <div className="relative flex flex-1 flex-row items-center justify-center">
      {currentStep === 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className={cn("text-foreground relative w-full max-w-sm space-y-8 p-8")}
          >
            <h2 className="matrix-text text-center text-3xl font-bold uppercase">
              Create an account
            </h2>
            <Form {...form}>
              <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map(({ name, type, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type={type} label={label} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox
                          id="agreeTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          {...form.register("agreeTerms")}
                        />
                      </FormControl>
                      <Label
                        htmlFor="agreeTerms"
                        className="text-muted-foreground text-center select-auto"
                      >
                        I agree to the {getTextLink("/terms-of-service", "Terms of Service")} and{" "}
                        {getTextLink("/privacy-policy", "Privacy Policy")}
                      </Label>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={!isAgreed}
                  className="w-full tracking-tight transition-all duration-300"
                >
                  Sign Up
                </Button>
              </form>
            </Form>
            <p className="text-muted-foreground text-center text-sm">
              Already have an account? {getTextLink("/sign-in", "Sign in")}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
      {currentStep === 1 && (
        <AnimatePresence mode="wait">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <OTPVerification
              email={form.getValues("email")}
              onSuccess={() => router.push("/sign-in")}
              onBack={() => setCurrentStep(0)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
