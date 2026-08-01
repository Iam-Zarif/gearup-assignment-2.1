"use client";

import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;

  isLoading: boolean;

  accessToken: string | null;

  login: (email: string, password: string) => Promise<User>;

  register: (data: unknown) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
