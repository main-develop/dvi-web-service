"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUser, User } from "../api/user-requests";
import { SigninSchema } from "../lib/zod-schemas/auth";
import { sendSigninRequest, sendSignoutRequest } from "../api/auth-requests";
import { ErrorData } from "../api/make-api-request";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signin: (
    data: SigninSchema,
  ) => Promise<{ ok: true; data: null } | { ok: false; data: ErrorData }>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await getUser();

      if (response.ok) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load once on mount
    refreshUser();
  }, []);

  const signin = async (data: SigninSchema) => {
    const response = await sendSigninRequest(data);
    if (response.ok) {
      await refreshUser();
    }

    return response;
  };

  const signout = async () => {
    await sendSignoutRequest();
    router.push("/sign-in");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signin, signout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
