"use client";

import { useEffect, useMemo } from "react";
import {
  AlertTriangle,
  RefreshCcw,
  WifiOff,
  ServerCrash,
  ShieldAlert,
} from "lucide-react";

interface ErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  const errorState = useMemo(() => {
    const message = error.message?.toLowerCase() || "";

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed to fetch")
    ) {
      return {
        icon: WifiOff,

        title: "Connection Problem",

        description:
          "Unable to connect with the server. Please check your internet connection and try again.",
      };
    }

    if (
      message.includes("401") ||
      message.includes("unauthorized") ||
      message.includes("forbidden")
    ) {
      return {
        icon: ShieldAlert,

        title: "Access Denied",

        description: "You don't have permission to perform this action.",
      };
    }

    if (message.includes("500") || message.includes("server")) {
      return {
        icon: ServerCrash,

        title: "Server Error",

        description:
          "Our server is having trouble processing your request. Please try again later.",
      };
    }

    return {
      icon: AlertTriangle,

      title: "Something went wrong",

      description: "We couldn't complete your request. Please try again.",
    };
  }, [error]);

  const Icon = errorState.icon;

  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-background
      px-6
      "
    >
      <section
        className="
        w-full
        max-w-md
        rounded-2xl
        border
        bg-card
        p-8
        text-center
        shadow-sm
        "
      >
        <div
          className="
          mx-auto
          mb-5
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-destructive/10
          "
        >
          <Icon
            className="
            h-7
            w-7
            text-destructive
            "
          />
        </div>

        <h1
          className="
          text-2xl
          font-semibold
          tracking-tight
          "
        >
          {errorState.title}
        </h1>

        <p
          className="
          mt-3
          text-sm
          text-muted-foreground
          "
        >
          {errorState.description}
        </p>

        {error.digest && (
          <p
            className="
              mt-4
              rounded-lg
              bg-muted
              px-3
              py-2
              text-xs
              text-muted-foreground
              "
          >
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-primary
          px-5
          py-3
          text-sm
          font-medium
          text-primary-foreground
          transition
          hover:opacity-90
          "
        >
          <RefreshCcw size={17} />
          Try Again
        </button>
      </section>
    </main>
  );
}
