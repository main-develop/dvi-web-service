import { z } from "zod";
import { passwordSchema } from "./auth";

export const changeUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(25, "Username must be at most 25 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export const changeEmailSchema = z.object({
  newEmail: z.email("Invalid email address").max(254, "Email must be at most 254 characters"),
  currentPassword: z.string().min(1, "Current password is required"),
});

export const changePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
    currentPassword: z.string().min(1, "Current password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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

export type ChangeUsernameSchema = z.infer<typeof changeUsernameSchema>;
export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;
