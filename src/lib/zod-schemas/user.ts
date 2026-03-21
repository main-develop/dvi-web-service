import { z } from "zod";
import { passwordSchema } from "./auth";

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address").max(254, "Email can be at most 254 characters"),
});

export const passwordResetSchema = z
  .object({
    uid: z.string().min(1),
    token: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;
