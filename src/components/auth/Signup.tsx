"use client";

import { useForm } from "react-hook-form";
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
import AuthForm from "./AuthForm";
import AuthSection from "./AuthSection";

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

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    console.log("Signup data:", data);
    setCurrentStep(1);
  };

  return (
    <AuthSection
      sectionHeader="Create an account"
      sectionFooter={
        currentStep === 0
          ? { text: "Already have an account?", href: "/sign-in", linkText: "Sign in" }
          : undefined
      }
    >
      {currentStep === 0 && (
        <AuthForm
          form={form}
          fields={signupFields}
          onSubmit={onSubmit}
          submitButtonText="Sign up"
          showHints
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
        <OTPVerification
          email={form.getValues("email")}
          onSuccess={() => router.push("/sign-in")}
          onBack={() => setCurrentStep(0)}
        />
      )}
    </AuthSection>
  );
}
