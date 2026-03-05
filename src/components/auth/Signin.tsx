"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import * as z from "zod";
import { signinSchema } from "@/src/lib/auth-schemas";
import { getTextLink } from "@/src/utils/get-text-link";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
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
    shouldFocusError: false
  });

  const onSubmit = (data: z.infer<typeof signinSchema>) => {
    console.log("Signin data:", data);
    router.push("/dashboard")
  };

  return (
    <div className="relative flex flex-1 flex-row items-center justify-center">
      <motion.div variants={getItemVariants(0, 0, 0.7)}
            initial="hidden"
            animate="visible"
            className="text-foreground relative w-full max-w-sm space-y-8 p-8">
        <h2 className="matrix-text text-center text-3xl font-bold uppercase">Sign in</h2>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {signinFields.map(({name, type, label}) => (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type={type} label={label} {...field} />
                    </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
            ))}
            <div className="flex items-center justify-between">
                <FormField control={form.control} name="rememberMe" render={({field}) => (
                    <FormItem className="flex items-center">
                        <FormControl>
                        <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} {...form.register("rememberMe")} />
                        </FormControl>
                        <Label htmlFor="rememberMe" className="text-muted-foreground text-center select-auto">Remember me</Label>
                    </FormItem>
                )} />
                <p className="text-center text-sm">
                    {getTextLink("/forgot-password", "Forgot password?")}
                </p>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account? {getTextLink("/sign-up", "Sign up")}
        </p>
      </motion.div>
    </div>
  );
}
