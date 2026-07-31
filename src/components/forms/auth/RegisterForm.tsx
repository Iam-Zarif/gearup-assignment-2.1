"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  User,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";

import { registerUser } from "@/src/services/auth/auth.service";

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
import Image from "next/image";

type UserRole = "CUSTOMER" | "PROVIDER" ;

const roles = [
  {
    value: "CUSTOMER",
    label: "Customer",
    description: "Rent equipment",
    icon: UserRound,
  },
  {
    value: "PROVIDER",
    label: "Provider",
    description: "List equipment",
    icon: BriefcaseBusiness,
  },
];

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER" as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors([]);

      await registerUser(form);

      router.push("/login");
    } catch (err: any) {
      const response = err?.response?.data;

      if (response?.errorDetails?.length) {
        setErrors(response.errorDetails.map((item: any) => item.message));
      } else {
        setErrors([response?.message || err.message || "Registration failed"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Image
        src="/brand.svg"
        alt="GearUp register"
        width={250}
        height={250}
        className="object-cover mx-auto"
      />
      <div className="w-full max-w-md mx-auto ">
        <CardHeader className="space-y-5 text-center">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create Account
            </CardTitle>

            <CardDescription>
              Join GearUp and start renting equipment easily
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div className="space-y-2">
              <Label>Full Name</Label>

              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl pl-10"
                />
              </div>
            </div>

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
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Account Type</Label>

              <div className="grid grid-cols-2 gap-3">
                {roles.map((item) => {
                  const Icon = item.icon;

                  const active = form.role === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          role: item.value as UserRole,
                        })
                      }
                      className={`
                      flex flex-col items-center gap-2 rounded-2xl border p-3 transition
                      ${
                        active
                          ? "border-neutral-300 bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }
                      `}
                    >
                      <Icon className="h-5 w-5" />

                      <span className="text-xs font-semibold">
                        {item.label}
                      </span>

                      <span className="text-[10px] text-muted-foreground">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                checked={acceptedTerms}
                onCheckedChange={(value) => setAcceptedTerms(Boolean(value))}
                className="mt-1"
              />

              <p className="text-sm leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <span className="cursor-pointer text-primary hover:underline">
                  Terms
                </span>{" "}
                and{" "}
                <span className="cursor-pointer text-primary hover:underline">
                  Privacy Policy
                </span>
              </p>
            </div>

            {errors.length > 0 && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
      </div>
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Already have an account?</span>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-primary underline-offset-4 transition hover:underline"
        >
          Sign in
        </button>
      </div>
    </section>
  );
}
