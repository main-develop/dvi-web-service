"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FormControl, FormField, FormItem } from "../ui/form";
import { SigninSchema, signinSchema } from "@/src/lib/zod-schemas/auth";
import { getTextLink } from "@/src/utils/get-text-link";
import AuthForm from "./AuthForm";
import { useRouter } from "next/navigation";
import AuthSection from "./AuthSection";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

interface SigninFieldProps {
  name: "usernameOrEmail" | "password";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const signinFields: SigninFieldProps[] = [
  { name: "usernameOrEmail", type: "text", label: "Username or email" },
  { name: "password", type: "password", label: "Password" },
];

export default function Signin() {
  const { signin } = useAuth();

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: { usernameOrEmail: "", password: "", rememberMe: false },
    shouldFocusError: false,
  });

  const router = useRouter();

  const onSubmit = async (data: SigninSchema) => {
    const response = await signin(data);

    if (response.ok) {
      router.push("/dashboard/home");
    } else {
      const responseType = response.data.type;
      const message = response.data.errors[0].detail;

      if (responseType === "rate_limit_exceeded") {
        form.setError("root.rateLimit", { type: responseType, message: message });
      } else if (responseType === "client_error") {
        form.setError("root.clientError", { type: responseType, message: message });
      } else {
        toast.warning(message, { id: "server-error" });
      }
    }
  };

  return (
    <AuthSection
      sectionHeader="Sign in"
      sectionFooter={{ text: "Don't have an account?", href: "/sign-up", linkText: "Sign up" }}
    >
      <AuthForm form={form} fields={signinFields} onSubmit={onSubmit} submitButtonText="Sign in">
        <div className="mb-0 flex items-center justify-between">
          <FormField
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    {...form.register("rememberMe")}
                  />
                </FormControl>

                <Label
                  htmlFor="rememberMe"
                  className="text-muted-foreground text-center select-auto"
                >
                  Remember me
                </Label>
              </FormItem>
            )}
          />

          <p className="text-center text-sm">
            {getTextLink("/reset-password", "Forgot password?")}
          </p>
        </div>
      </AuthForm>
    </AuthSection>
  );
}
