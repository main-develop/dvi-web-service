"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormField, FormItem } from "../ui/form";
import { SignupSchema, signupSchema } from "@/src/lib/zod-schemas/auth";
import { getTextLink } from "@/src/utils/get-text-link";
import OTPVerification from "../ui/otp-verification";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import AuthSection from "./AuthSection";
import { sendSignupRequest, VerificationPurpose } from "@/src/api/auth-requests";
import { toast } from "sonner";

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

  const form = useForm<SignupSchema>({
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

  const watchedEmail = useWatch({
    control: form.control,
    name: "email",
  });
  const watchedUsername = useWatch({
    control: form.control,
    name: "username",
  });

  useEffect(() => {
    form.clearErrors("email");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEmail, form.clearErrors]);

  useEffect(() => {
    form.clearErrors("username");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedUsername, form.clearErrors]);

  const onSubmit = async (data: SignupSchema) => {
    const response = await sendSignupRequest(data);

    if (response.ok) {
      setCurrentStep(1);
    } else {
      const responseType = response.data.type;

      response.data.errors.forEach((error) => {
        if (error.attr === "email") {
          form.setError("email", { type: responseType, message: error.detail });
        } else if (error.attr === "username") {
          form.setError("username", { type: responseType, message: error.detail });
        } else if (responseType === "rate_limit_exceeded") {
          form.setError("root.rateLimit", { type: responseType, message: error.detail });
        } else {
          toast.warning(error.detail, { id: "server-error" });
        }
      });
    }
  };

  const router = useRouter();

  const onSuccess = () => {
    toast.success("Your account has been successfully created.", { id: "account-created" });

    router.push("/sign-in");
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
              <FormItem className="mb-0 flex items-center">
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
          purpose={VerificationPurpose.ACCOUNT_ACTIVATION}
          onSuccess={onSuccess}
          onBack={() => setCurrentStep(0)}
        />
      )}
    </AuthSection>
  );
}
