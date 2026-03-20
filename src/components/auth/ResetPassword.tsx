"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
  PasswordResetSchema,
  passwordResetSchema,
} from "@/src/lib/zod-schemas/user";
import AuthForm from "./AuthForm";
import { useState } from "react";
import OTPVerification from "../ui/otp-verification";
import { useRouter } from "next/navigation";
import AuthSection from "./AuthSection";
import { sendForgotPasswordRequest, sendResetPasswordRequest } from "@/src/api/user-requests";
import { VerificationPurpose } from "@/src/api/auth-requests";
import { toast } from "sonner";

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
      if (response.data.type === "server_error") {
        toast.warning(response.data.errors[0].detail, { id: "server-error" });
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

  const router = useRouter();

  const onPasswordResetSubmit = async (data: PasswordResetSchema) => {
    const response = await sendResetPasswordRequest(data);

    if (response.ok) {
      toast.success("Your password has been successfully reset.", { id: "password-reset" });

      router.push("/sign-in");
    } else {
      const responseType = response.data.type;
      const message = response.data.errors[0].detail;

      if (responseType === "rate_limit_exceeded") {
        passwordResetForm.setError("root.rateLimit", { type: responseType, message: message });
      } else if (responseType === "server_error") {
        toast.warning(message, { id: "server-error" });
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
    </AuthSection>
  );
}
