"use client";

import { AuthContext, User } from "@/src/context/AuthContext";
import { getCookie, removeCookie, setCookie } from "@/src/lib/cookies";
import { loginUser } from "@/src/services/auth/auth.service";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = await getCookie("accessToken");

        if (!token) {
          setIsLoading(false);
          return;
        }

        setAccessToken(token);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          },
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.data);
          await setCookie("role", data.data.role);
        } else {
          await removeCookie("accessToken");
          await removeCookie("role");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(email: string, password: string): Promise<User> {

    const response = await loginUser({
      email,
      password,
    });


    const { accessToken, user } = response.data as { accessToken: string; user: User };


    await setCookie(
      "accessToken",
      accessToken
    );

    await setCookie("role", user.role);


    setAccessToken(accessToken);

    setUser(user);


    return user;
  }


  async function register(payload: unknown): Promise<void> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error((await response.json()).message || "Registration failed");
        }
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Registration failed"));
    }
  }

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    await removeCookie("accessToken");
    await removeCookie("role");

    setUser(null);

    setAccessToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
