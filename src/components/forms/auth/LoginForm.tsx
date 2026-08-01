"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";

import Image from "next/image";


import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/src/context/AuthContext";
import { getApiErrorMessage } from "@/src/lib/api-error";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    await login(
      form.email,
      form.password
    );


    router.replace("/");


  } catch (error) {
    setError(getApiErrorMessage(error, "Invalid email or password"));

  } finally {
    setLoading(false);
  }
};

  return (
    <section className="w-full max-w-sm mx-auto">
      <Image
        src="/brand.svg"
        alt="GearUp"
        width={180}
        height={180}
        priority
        className="mx-auto mb-6 h-auto"
      />

      <div className="w-full">
        <CardHeader className="space-y-4 px-0 text-center">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>

            <CardDescription>Login to your GearUp account</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl pl-10 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(value) => setRememberMe(Boolean(value))}
                />

                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </div>

              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Don't have an account?</span>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="font-semibold text-primary underline-offset-4 transition hover:underline"
        >
          Create account
        </button>
      </div>
    </section>
  );
}
