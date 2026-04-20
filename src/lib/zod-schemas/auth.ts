import { z } from "zod";
import { VerificationPurpose } from "../../api/auth-requests";

export const passwordRequirements = [
  {
    regex: /^.{8,64}$/,
    message: "Between 8 and 64 characters",
  },
];

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");

export const signupSchema = z
  .object({
    email: z.email("Invalid email address").max(254, "Email must be at most 254 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(25, "Username must be at most 25 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
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
  usernameOrEmail: z
    .string()
    .min(1, "This field is required")
    .max(254, "This field can be at most 254 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),
  rememberMe: z.boolean().optional(),
});

export const otpSchema = z.object({
  email: z.email().readonly(),
  purpose: z.enum(Object.values(VerificationPurpose)).readonly(),
  otp: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
