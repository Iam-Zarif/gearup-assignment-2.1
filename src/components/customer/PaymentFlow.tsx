"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { completeStripePayment, createPaymentSession } from "@/src/services/customer/customer.service";

export function PaymentPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = searchParams.get("orderId");

  const startPayment = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);
    try {
      const payment = await createPaymentSession(orderId);
      if (!payment.checkoutUrl) throw new Error("Checkout session URL was not returned");
      window.location.assign(payment.checkoutUrl);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to start payment"));
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId && user?.role === "CUSTOMER") {
      void Promise.resolve().then(startPayment);
    }
  }, [orderId, startPayment, user?.role]);

  if (!orderId) return <PaymentState description="Choose a confirmed rental order before starting payment." title="No order selected" />;
  if (!user || user.role !== "CUSTOMER") return <PaymentState description="Sign in with a customer account to pay for a rental order." title="Customer account required" />;
  if (error) return <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4"><section className="w-full rounded-2xl border p-8 text-center"><h1 className="text-3xl font-bold">Unable to open checkout</h1><p className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p><Button className="mt-6" onClick={() => void startPayment()}>Try again</Button><Link className="ml-4 text-sm text-primary underline" href="/orders">Back to orders</Link></section></main>;
  return <PaymentState description={isLoading ? "Opening Stripe Checkout..." : "Preparing checkout..."} title="Redirecting to payment" />;
}

export function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const verifyPayment = async (attempt: number) => {
      if (!sessionId) {
        setState("error");
        setMessage("Stripe session ID is missing.");
        return;
      }

      try {
        const payment = await completeStripePayment(sessionId);
        if (payment.status === "COMPLETED") {
          if (!cancelled) {
            setState("success");
            setMessage("Payment confirmed. Your rental is ready for provider pickup processing.");
          }
          return;
        }

        if (attempt < 20) {
          if (!cancelled) setMessage("Verifying payment with Stripe...");
          timeoutId = setTimeout(() => void verifyPayment(attempt + 1), 1500);
          return;
        }

        if (!cancelled) {
          setState("error");
          setMessage("Payment is still pending. Refresh your orders in a moment.");
        }
      } catch (requestError) {
        if (!cancelled) {
          setState("error");
          setMessage(getApiErrorMessage(requestError, "Unable to confirm payment"));
        }
      }
    };

    void Promise.resolve().then(() => verifyPayment(0));
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionId]);

  return <PaymentState description={message} status={state} title={state === "loading" ? "Confirming payment" : state === "success" ? "Payment successful" : "Payment confirmation failed"} />;
}

export function PaymentCancelPage() {
  return <PaymentState status="error" description="No payment was completed. You can return to your order and try again when ready." title="Payment cancelled" />;
}

function PaymentState({
  description,
  title,
  status,
}: {
  description: string;
  title: string;
  status?: "loading" | "success" | "error";
}) {
  const icon =
    status === "success" ? (
      <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
    ) : status === "error" ? (
      <XCircle className="mx-auto h-16 w-16 text-destructive" />
    ) : (
      <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
    );

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4">
      <section className="w-full rounded-2xl border p-8 text-center">
        <div className="mb-6">{icon}</div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <Link className="mt-6 inline-block" href="/orders">
          <Button>View my orders</Button>
        </Link>
      </section>
    </main>
  );
}
