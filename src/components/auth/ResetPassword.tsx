"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { forgotPasswordSchema, passwordResetSchema } from "@/src/lib/auth-schemas";
import AuthForm from "./AuthForm";
import { useState } from "react";
import OTPVerification from "../ui/otp-verification";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import AuthSection from "./AuthSection";

interface PasswordResetProps {
  name: "password" | "confirmPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const passwordResetFields: PasswordResetProps[] = [
  { name: "password", type: "password", label: "Password" },
  { name: "confirmPassword", type: "password", label: "Confirm password" },
];

export default function ResetPassword() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    shouldFocusError: false,
  });
  const passwordResetForm = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
    shouldFocusError: false,
  });

  const onPasswordResetSubmit = () => {
    setCurrentStep(3);
  };

  return (
    <AuthSection sectionHeader="Reset password">
      {currentStep === 0 && (
        <AuthForm
          form={forgotPasswordForm}
          fields={[{ name: "email", type: "email", label: "Email" }]}
          onSubmit={() => setCurrentStep(1)}
          submitButtonText="Continue"
          formDescription={`Enter the email address associated with your account. 
            We will send you a password reset code.`}
        />
      )}

      {currentStep === 1 && (
        <OTPVerification
          email={forgotPasswordForm.getValues("email")}
          onSuccess={() => setCurrentStep(2)}
          onBack={() => setCurrentStep(0)}
        />
      )}

      {currentStep === 2 && (
        <AuthForm
          form={passwordResetForm}
          fields={passwordResetFields}
          onSubmit={onPasswordResetSubmit}
          submitButtonText="Reset password"
          formDescription="Choose a new strong password for your account."
        />
      )}

      {currentStep === 3 && (
        <motion.div
          variants={getItemVariants(0, 0, 0.7)}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <p className="text-center text-sm">Your password has been changed successfully.</p>

          <Button onClick={() => router.push("/sign-in")} className="w-full tracking-tight">
            Sign in
          </Button>
        </motion.div>
      )}
    </AuthSection>
  );
}
