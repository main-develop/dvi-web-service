"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormField, FormItem } from "../ui/form";
import * as z from "zod";
import { signupSchema } from "@/src/lib/auth-schemas";
import { getTextLink } from "@/src/utils/get-text-link";
import OTPVerification from "../ui/otp-verification";
import { useState } from "react";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { AuthForm } from "./AuthForm";

interface SignupFieldProps {
  name: "email" | "username" | "password" | "confirmPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const signupFields: SignupFieldProps[] = [
  { name: "email", type: "email", label: "Email" },
  { name: "username", type: "text", label: "Username" },
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
    <>
      {currentStep === 0 && (
        <AuthForm
          form={form}
          fields={signupFields}
          onSubmit={onSubmit}
          submitButtonText="Sign up"
          headerText="Create an account"
          paragraphText={["Already have an account?", "/sign-in", "Sign in"]}
        >
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
        </AuthForm>
      )}
      {currentStep === 1 && (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <OTPVerification
            email={form.getValues("email")}
            onSuccess={() => router.push("/sign-in")}
            onBack={() => setCurrentStep(0)}
          />
        </motion.div>
      )}
    </>
  );
}
