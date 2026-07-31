"use client";

import { AuthContext, User } from "@/src/context/AuthContext";
import { getCookie, removeCookie, setCookie } from "@/src/lib/cookies";
import { loginUser } from "@/src/services/auth/auth.service";
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
        } else {
          await removeCookie("accessToken");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(
    email: string,
    password: string
  ) {

    const response = await loginUser({
      email,
      password,
    });


    const { accessToken, user } = response.data;


    await setCookie(
      "accessToken",
      accessToken
    );


    setAccessToken(accessToken);

    setUser(user);


    return user;
  }


  async function register(payload: any) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  }

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    await removeCookie("accessToken");

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
