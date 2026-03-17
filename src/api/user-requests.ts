import { ForgotPasswordSchema, PasswordResetSchema } from "@/src/lib/zod-schemas/user";
import { makeApiRequest } from "./make-api-request";

export async function sendForgotPasswordRequest(data: ForgotPasswordSchema) {
  return makeApiRequest("users/password/reset/", "POST", data);
}

export async function sendResetPasswordRequest(data: PasswordResetSchema) {
  const payload = {
    uid: data.uid,
    token: data.token,
    new_password: data.newPassword,
    confirm_password: data.confirmPassword,
  };
  return makeApiRequest("users/password/reset/confirm/", "POST", payload);
}
