import { OtpSchema, SigninSchema, SignupSchema } from "../lib/zod-schemas/auth";
import { makeApiRequest } from "./make-api-request";

export async function sendSignupRequest(data: SignupSchema) {
  const payload = {
    email: data.email,
    username: data.username,
    password: data.password,
    confirm_password: data.confirmPassword,
  };
  return makeApiRequest("auth/register/", "POST", payload);
}

export async function sendSigninRequest(data: SigninSchema) {
  const payload = {
    username_or_email: data.usernameOrEmail,
    password: data.password,
    remember_me: data.rememberMe,
  };
  return makeApiRequest("auth/login/", "POST", payload);
}

export const VerificationPurpose = {
  ACCOUNT_ACTIVATION: "account_activation",
  RESET_PASSWORD: "reset_password",
} as const;

export type VerificationPurposeType =
  (typeof VerificationPurpose)[keyof typeof VerificationPurpose];

export async function resendVerificationEmailRequest(data: {
  email: string;
  purpose: VerificationPurposeType;
}) {
  return makeApiRequest("auth/resend-verification/", "POST", data);
}

export async function sendVerifyRequest(data: OtpSchema) {
  return makeApiRequest<{ uid: string; token: string } | null>("auth/verify/", "POST", data);
}
