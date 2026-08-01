"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { confirmPayment, createPaymentSession } from "@/src/services/customer/customer.service";

export function PaymentPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const orderId = searchParams.get("orderId");

  async function startPayment() {
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
  }

  if (!orderId) return <PaymentState description="Choose a confirmed rental order before starting payment." title="No order selected" />;
  if (!user || user.role !== "CUSTOMER") return <PaymentState description="Sign in with a customer account to pay for a rental order." title="Customer account required" />;
  return <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4"><section className="w-full rounded-2xl border p-8 text-center"><h1 className="text-3xl font-bold">Complete payment</h1><p className="mt-3 text-muted-foreground">You will be securely redirected to Stripe Checkout.</p>{error ? <p className="mt-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}<Button className="mt-6 w-full" disabled={isLoading} onClick={() => void startPayment()}>{isLoading ? "Opening Stripe..." : "Continue to Stripe"}</Button><Link className="mt-4 inline-block text-sm text-primary underline" href="/orders">Back to orders</Link></section></main>;
}

export function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    if (!sessionId) { setState("error"); setMessage("Stripe session ID is missing."); return; }
    void confirmPayment(sessionId).then(() => { setState("success"); setMessage("Payment confirmed. Your rental is ready for provider pickup processing."); }, (requestError: unknown) => { setState("error"); setMessage(getApiErrorMessage(requestError, "Unable to confirm payment")); });
  }, [sessionId]);

  return <PaymentState description={message} title={state === "loading" ? "Confirming payment" : state === "success" ? "Payment successful" : "Payment confirmation failed"} />;
}

export function PaymentCancelPage() { return <PaymentState description="No payment was completed. You can return to your order and try again when ready." title="Payment cancelled" />; }

function PaymentState({ description, title }: { description: string; title: string }) { return <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4"><section className="w-full rounded-2xl border p-8 text-center"><h1 className="text-3xl font-bold">{title}</h1><p className="mt-3 text-muted-foreground">{description}</p><Link className="mt-6 inline-block" href="/orders"><Button>View my orders</Button></Link></section></main>; }
