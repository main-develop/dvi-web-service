import {
  DeleteAccountSchema,
  ForgotPasswordSchema,
  PasswordResetSchema,
} from "@/src/lib/zod-schemas/user";
import { makeApiRequest } from "./make-api-request";

export interface User {
  id: string;
  username: string;
  email: string;
}

export async function getUser() {
  return makeApiRequest<User>("users/me/", "GET", null);
}

export async function sendDeleteAccountRequest(data: DeleteAccountSchema) {
  return makeApiRequest("users/me/", "DELETE", { current_password: data.password });
}

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
