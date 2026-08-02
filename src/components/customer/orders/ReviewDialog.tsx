"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { createReview } from "@/src/services/customer/customer.service";
import type { ReviewTarget } from "./types";

export default function ReviewDialog({ onCreated, onOpenChange, target }: { onCreated: () => void; onOpenChange: (open: boolean) => void; target: ReviewTarget | null }) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [rating, setRating] = useState("5");
  async function submitReview(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!target) return; const values = new FormData(event.currentTarget); setIsSaving(true); setError(null); try { await createReview({ gearItemId: target.gearId, rentalOrderId: target.rentalId, rating: Number(rating), comment: String(values.get("comment") ?? "").trim() || undefined }); onCreated(); } catch (requestError) { setError(getApiErrorMessage(requestError, "Unable to submit review")); } finally { setIsSaving(false); } }
  return <Dialog open={Boolean(target)} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Review {target?.gearName}</DialogTitle><DialogDescription>Share your experience after this completed rental.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={submitReview}><div className="space-y-2"><Label>Rating</Label><Select onValueChange={(value) => setRating(value ?? "5")} value={rating}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5 - Excellent</SelectItem><SelectItem value="4">4 - Good</SelectItem><SelectItem value="3">3 - Average</SelectItem><SelectItem value="2">2 - Poor</SelectItem><SelectItem value="1">1 - Bad</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="comment">Comment</Label><Input id="comment" name="comment" placeholder="Tell others about the equipment..." /></div>{error ? <p className="text-sm text-destructive">{error}</p> : null}<Button className="w-full" disabled={isSaving} type="submit">{isSaving ? "Submitting..." : "Submit review"}</Button></form></DialogContent></Dialog>;
}
