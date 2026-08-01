"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomerShell from "@/src/components/customer/CustomerShell";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { createReview, getMyPayments, getMyRentals } from "@/src/services/customer/customer.service";
import type { CustomerPayment, CustomerRental } from "@/src/types/customer";

export default function Orders() { return <CustomerShell><OrdersContent /></CustomerShell>; }

function OrdersContent() {
  const [orders, setOrders] = useState<CustomerRental[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{ gearId: string; rentalId: string; gearName: string } | null>(null);

  const loadOrders = useCallback(async () => { setIsLoading(true); setError(null); try { const [nextOrders, nextPayments] = await Promise.all([getMyRentals(), getMyPayments()]); setOrders(nextOrders); setPayments(nextPayments); } catch (requestError) { setError(getApiErrorMessage(requestError, "Unable to load your orders")); } finally { setIsLoading(false); } }, []);
  useEffect(() => { void Promise.resolve().then(loadOrders); }, [loadOrders]);

  return <main className="mx-auto max-w-7xl px-4 py-10"><div><h1 className="text-3xl font-bold">My orders</h1><p className="mt-2 text-muted-foreground">Track rental progress, payment, and reviews.</p></div>{isLoading ? <div className="mt-8 h-64 animate-pulse rounded-xl bg-muted" /> : null}{error ? <div className="mt-8 rounded-xl bg-destructive/10 p-4 text-destructive"><p>{error}</p><Button className="mt-3" onClick={() => void loadOrders()} size="sm" variant="outline">Try again</Button></div> : null}{!isLoading && !error ? <><section className="mt-8 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Equipment</th><th className="p-3">Rental dates</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{orders.map((order) => <tr className="border-t" key={order.id}><td className="p-3">{order.items.map((item) => <div className="mb-2 flex items-center gap-3" key={item.id}>{item.gearItem.imageUrl ? <Image alt={item.gearItem.name} className="rounded object-cover" height={44} src={item.gearItem.imageUrl} unoptimized width={56} /> : null}<div><p className="font-medium">{item.gearItem.name}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p></div></div>)}</td><td className="p-3">{new Date(order.startDate).toLocaleDateString()}<br />to {new Date(order.endDate).toLocaleDateString()}</td><td className="p-3">৳{order.totalAmount}</td><td className="p-3"><StatusBadge status={order.status} /></td><td className="p-3"><div className="flex flex-wrap gap-2">{order.status === "CONFIRMED" ? <Link href={`/payment?orderId=${order.id}`}><Button size="sm">Pay now</Button></Link> : null}{order.status === "RETURNED" ? order.items.map((item) => <Button key={item.id} onClick={() => setReviewTarget({ gearId: item.gearItem.id, rentalId: order.id, gearName: item.gearItem.name })} size="sm" variant="outline">Review {item.gearItem.name}</Button>) : null}{order.status !== "CONFIRMED" && order.status !== "RETURNED" ? <span className="text-muted-foreground">No action</span> : null}</div></td></tr>)}{!orders.length ? <tr><td className="p-10 text-center text-muted-foreground" colSpan={5}>You have no rental orders yet.</td></tr> : null}</tbody></table></section><section className="mt-10"><h2 className="text-2xl font-bold">Payment history</h2><div className="mt-4 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Payment</th><th className="p-3">Order</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Status</th></tr></thead><tbody>{payments.map((payment) => <tr className="border-t" key={payment.id}><td className="p-3">{payment.id.slice(0, 8)}</td><td className="p-3">{payment.rentalOrderId.slice(0, 8)}</td><td className="p-3">৳{payment.amount}</td><td className="p-3">{payment.method ?? "Stripe"}</td><td className="p-3"><StatusBadge status={payment.status} /></td></tr>)}{!payments.length ? <tr><td className="p-10 text-center text-muted-foreground" colSpan={5}>No payments found.</td></tr> : null}</tbody></table></div></section></> : null}<ReviewDialog onCreated={() => { setReviewTarget(null); void loadOrders(); }} onOpenChange={(open) => !open && setReviewTarget(null)} target={reviewTarget} /></main>;
}

function ReviewDialog({ onCreated, onOpenChange, target }: { onCreated: () => void; onOpenChange: (open: boolean) => void; target: { gearId: string; rentalId: string; gearName: string } | null }) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  async function submitReview(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!target) return; const values = new FormData(event.currentTarget); setIsSaving(true); setError(null); try { await createReview({ gearItemId: target.gearId, rentalOrderId: target.rentalId, rating: Number(values.get("rating")), comment: String(values.get("comment") ?? "").trim() || undefined }); onCreated(); } catch (requestError) { setError(getApiErrorMessage(requestError, "Unable to submit review")); } finally { setIsSaving(false); } }
  return <Dialog open={Boolean(target)} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Review {target?.gearName}</DialogTitle><DialogDescription>Share your experience after this completed rental.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={submitReview}><div className="space-y-2"><Label htmlFor="rating">Rating</Label><select className="h-9 w-full rounded-md border bg-background px-3" defaultValue="5" id="rating" name="rating"><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Bad</option></select></div><div className="space-y-2"><Label htmlFor="comment">Comment</Label><Input id="comment" name="comment" placeholder="Tell others about the equipment..." /></div>{error ? <p className="text-sm text-destructive">{error}</p> : null}<Button className="w-full" disabled={isSaving} type="submit">{isSaving ? "Submitting..." : "Submit review"}</Button></form></DialogContent></Dialog>;
}

function StatusBadge({ status }: { status: string }) { const color = status === "CANCELLED" || status === "FAILED" ? "bg-destructive/10 text-destructive" : status === "RETURNED" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"; return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{status.replaceAll("_", " ")}</span>; }
