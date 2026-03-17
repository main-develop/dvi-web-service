"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
  PasswordResetSchema,
  passwordResetSchema,
} from "@/src/lib/auth-schemas";
import AuthForm from "./AuthForm";
import { useState } from "react";
import OTPVerification from "../ui/otp-verification";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import AuthSection from "./AuthSection";
import { sendForgotPasswordRequest, sendResetPasswordRequest } from "@/src/api/user-requests";
import { VerificationPurpose } from "@/src/api/auth-requests";

interface PasswordResetProps {
  name: "newPassword" | "confirmPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const passwordResetFields: PasswordResetProps[] = [
  { name: "newPassword", type: "password", label: "Password" },
  { name: "confirmPassword", type: "password", label: "Confirm password" },
];

export default function ResetPassword() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    shouldFocusError: false,
  });
  const passwordResetForm = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { uid: "", token: "", newPassword: "", confirmPassword: "" },
    shouldFocusError: false,
  });

  const onForgotPasswordSubmit = async (data: ForgotPasswordSchema) => {
    const response = await sendForgotPasswordRequest(data);

    if (response.ok) {
      setCurrentStep(1);
    } else {
      const responseType = response.data.type;

      if (responseType === "server_error") {
        forgotPasswordForm.setError("root.serverError", {
          type: responseType,
          message: response.data.errors[0].detail,
        });
      }
    }
  };

  const onOtpVerificationSuccess = (data?: Record<string, unknown>) => {
    if (data) {
      passwordResetForm.setValue("uid", data.uid as string);
      passwordResetForm.setValue("token", data.token as string);

      setCurrentStep(2);
    }
  };

  const onPasswordResetSubmit = async (data: PasswordResetSchema) => {
    const response = await sendResetPasswordRequest(data);

    if (response.ok) {
      setCurrentStep(3);
    } else {
      const responseType = response.data.type;

      if (responseType === "server_error") {
        passwordResetForm.setError("root.serverError", {
          type: responseType,
          message: response.data.errors[0].detail,
        });
      }
    }
  };

  return (
    <AuthSection sectionHeader="Reset password">
      {currentStep === 0 && (
        <AuthForm
          form={forgotPasswordForm}
          fields={[{ name: "email", type: "email", label: "Email" }]}
          onSubmit={onForgotPasswordSubmit}
          submitButtonText="Continue"
          formDescription={`Enter the email address associated with your account. 
            We will send you a password reset code.`}
        />
      )}

      {currentStep === 1 && (
        <OTPVerification
          email={forgotPasswordForm.getValues("email")}
          purpose={VerificationPurpose.RESET_PASSWORD}
          onSuccess={onOtpVerificationSuccess}
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
          showHints
        />
      )}

      {currentStep === 3 && (
        <motion.div
          variants={getItemVariants(0, 0, 0.7)}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <p className="mt-6 text-center text-sm">Your password has been changed successfully.</p>

          <Button
            onClick={() => router.push("/sign-in")}
            className="w-full tracking-tight transition-all duration-400"
          >
            Sign in
          </Button>
        </motion.div>
      )}
    </AuthSection>
  );
}
