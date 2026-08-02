"use client";

import { AlertTriangle, WifiOff, ServerCrash, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const errorMap = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes("network") || normalized.includes("fetch") || normalized.includes("failed to fetch")) {
    return {
      icon: WifiOff,
      title: "Connection Problem",
      description: "Unable to connect with the server. Please check your internet connection and try again.",
    };
  }

  if (normalized.includes("401") || normalized.includes("unauthorized") || normalized.includes("forbidden")) {
    return {
      icon: ShieldAlert,
      title: "Access Denied",
      description: "You don't have permission to perform this action.",
    };
  }

  if (normalized.includes("500") || normalized.includes("server")) {
    return {
      icon: ServerCrash,
      title: "Server Error",
      description: "Our server is having trouble processing your request. Please try again later.",
    };
  }

  return {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "We couldn't complete your request. Please try again.",
  };
};

type DynamicErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  backHref?: string;
  showBackButton?: boolean;
};

export default function DynamicError({
  error,
  reset,
  backHref = "/",
  showBackButton = true,
}: DynamicErrorProps) {
  const { icon: Icon, title, description } = errorMap(error.message || "");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Icon className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        {error.digest ? (
          <p className="mt-4 text-xs text-muted-foreground font-mono wrap-break-word">
            Error ID: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>Try Again</Button>
          {showBackButton ? (
            <Button variant="outline" onClick={() => window.location.assign(backHref)}>
              Back Home
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
