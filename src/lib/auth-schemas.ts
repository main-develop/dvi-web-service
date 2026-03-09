import { z } from "zod";

export const passwordRequirements = [
  { regex: /^.{8,20}$/, message: "Between 8 and 20 characters" },
  { regex: /(?=.*[a-z])/, message: "At least 1 lowercase letter" },
  { regex: /(?=.*[A-Z])/, message: "At least 1 uppercase letter" },
  { regex: /(?=.*\d)/, message: "At least 1 number" },
  { regex: /(?=.*[!@#$%^&*])/, message: "At least 1 special character: @!#$%^&*" },
];

let passwordSchema = z.string();
for (const { regex, message } of passwordRequirements) {
  passwordSchema = passwordSchema.regex(regex, message);
}

export const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "I agree to the Terms of Service and Privacy Policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  emailOrUsername: z.string().min(1, "This field is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
