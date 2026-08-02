"use client";
import { useEffect } from "react";
import DynamicError from "@/src/components/shared/DynamicError";

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

  return <DynamicError error={error} reset={reset} />;
}