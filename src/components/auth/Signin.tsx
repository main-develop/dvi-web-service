"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FormControl, FormField, FormItem } from "../ui/form";
import * as z from "zod";
import { signinSchema } from "@/src/lib/auth-schemas";
import { getTextLink } from "@/src/utils/get-text-link";
import { AuthForm } from "./AuthForm";
import { useRouter } from "next/navigation";

interface SigninFieldProps {
  name: "emailOrUsername" | "password";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const signinFields: SigninFieldProps[] = [
  { name: "emailOrUsername", type: "text", label: "Email or username" },
  { name: "password", type: "password", label: "Password" },
];

export default function Signin() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { emailOrUsername: "", password: "", rememberMe: false },
    shouldFocusError: false,
  });

  const onSubmit = (data: z.infer<typeof signinSchema>) => {
    console.log("Signin data:", data);
    router.push("/dashboard");
  };

  return (
    <AuthForm
      form={form}
      fields={signinFields}
      onSubmit={onSubmit}
      submitButtonText="Sign in"
      headerText="Sign in"
      paragraphText={["Don't have an account?", "/sign-up", "Sign up"]}
    >
      <div className="flex items-center justify-between">
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
              <Label htmlFor="rememberMe" className="text-muted-foreground text-center select-auto">
                Remember me
              </Label>
            </FormItem>
          )}
        />
        <p className="text-center text-sm">{getTextLink("/forgot-password", "Forgot password?")}</p>
      </div>
    </AuthForm>
  );
}
