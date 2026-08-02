"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import { useProviderData } from "@/src/components/providers/ProviderProvider";
import PageHeader from "@/src/components/shared/PageHeader";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { deleteProviderGear, getProviderGear, updateProviderGear, updateProviderOrderStatus } from "@/src/services/provider/provider.service";
import type { ProviderGear, ProviderOrder } from "@/src/types/admin";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";

export function ProviderEquipmentPage() {
  return <ProviderShell><EquipmentContent /></ProviderShell>;
}

function EquipmentContent() {
  const { refresh: refreshProvider } = useProviderData();
  const [gear, setGear] = useState<ProviderGear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingGear, setEditingGear] = useState<ProviderGear | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [gearToDelete, setGearToDelete] = useState<ProviderGear | null>(null);

  const loadGear = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProviderGear({ page, limit: 10 });
      setGear(result.gear);
      setMeta(result.meta ?? { page, limit: 10, total: result.gear.length, totalPage: 1 });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load equipment"));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { void loadGear(); }, [loadGear]);

  async function removeGear(id: string) {
    try { await deleteProviderGear(id); if (gear.length === 1 && page > 1) setPage((currentPage) => currentPage - 1); else await loadGear(); await refreshProvider(); } catch (requestError) { setActionError(getApiErrorMessage(requestError, "Unable to delete equipment")); }
  }

  async function toggleAvailability(item: ProviderGear) {
    try { await updateProviderGear(item.id, { status: item.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE" }); await Promise.all([loadGear(), refreshProvider()]); } catch (requestError) { setActionError(getApiErrorMessage(requestError, "Unable to update availability")); }
  }

  async function saveGear(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingGear) return;
    const values = new FormData(event.currentTarget);
    setIsSaving(true);
    setActionError(null);
    try {
      await updateProviderGear(editingGear.id, {
        name: String(values.get("name") ?? "").trim(),
        pricePerDay: Number(values.get("pricePerDay")),
        stockQuantity: Number(values.get("stockQuantity")),
        availableQuantity: Number(values.get("availableQuantity")),
      });
      setEditingGear(null);
      await Promise.all([loadGear(), refreshProvider()]);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, "Unable to update equipment"));
    } finally {
      setIsSaving(false);
    }
  }

  return <section className="space-y-6"><PageHeader action={<Link href="/provider/create-equipment"><Button>Add equipment</Button></Link>} description="Manage your listed rental equipment." title={`My equipment (${meta.total})`} /><RequestError error={actionError ?? error} />{isLoading ? <Loader /> : <><div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Image</th><th className="p-3">Equipment</th><th className="p-3">Category</th><th className="p-3">Price/day</th><th className="p-3">Available</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{gear.map((item) => <tr className="border-t" key={item.id}><td className="p-3">{item.imageUrl ? <img alt={item.name} className="h-12 w-16 rounded object-cover" src={item.imageUrl} /> : <span className="text-muted-foreground">No image</span>}</td><td className="p-3">{item.name}</td><td className="p-3">{item.category.name}</td><td className="p-3">৳{item.pricePerDay}</td><td className="p-3">{item.availableQuantity}/{item.stockQuantity}</td><td className="p-3">{item.status}</td><td className="p-3"><div className="flex flex-wrap gap-2"><Button onClick={() => setEditingGear(item)} size="sm" variant="outline">Edit</Button><Button onClick={() => void toggleAvailability(item)} size="sm" variant="outline">{item.status === "AVAILABLE" ? "Disable" : "Enable"}</Button><Button onClick={() => setGearToDelete(item)} size="sm" variant="destructive">Delete</Button></div></td></tr>)}{!gear.length ? <EmptyTable columns={7} message="No equipment found." /> : null}</tbody></table></div>{meta.totalPage > 1 ? <div className="flex items-center justify-end gap-3"><Button disabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)} size="icon" variant="outline"><ChevronLeft /></Button><span className="text-sm text-muted-foreground">{meta.page} / {meta.totalPage}</span><Button disabled={page === meta.totalPage} onClick={() => setPage((currentPage) => currentPage + 1)} size="icon" variant="outline"><ChevronRight /></Button></div> : null}</>}<Dialog open={Boolean(editingGear)} onOpenChange={(open) => !open && setEditingGear(null)}><DialogContent><DialogHeader><DialogTitle>Edit equipment</DialogTitle><DialogDescription>Update inventory and availability values.</DialogDescription></DialogHeader>{editingGear ? <form className="space-y-4" key={editingGear.id} onSubmit={saveGear}><FormInput defaultValue={editingGear.name} label="Name" name="name" /><FormInput defaultValue={editingGear.pricePerDay} label="Price per day" min="1" name="pricePerDay" type="number" /><FormInput defaultValue={editingGear.stockQuantity} label="Stock quantity" min="1" name="stockQuantity" type="number" /><FormInput defaultValue={editingGear.availableQuantity} label="Available quantity" min="0" name="availableQuantity" type="number" /><Button className="w-full" disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save changes"}</Button></form> : null}</DialogContent></Dialog><ConfirmDialog description={`This permanently deletes ${gearToDelete?.name ?? "this equipment"}. Equipment used by rental orders cannot be deleted.`} onConfirm={() => gearToDelete ? removeGear(gearToDelete.id) : Promise.resolve()} onOpenChange={(open) => !open && setGearToDelete(null)} open={Boolean(gearToDelete)} title="Delete equipment?" /></section>;
}

export function ProviderOrdersPage() {
  return <ProviderShell><OrdersContent /></ProviderShell>;
}

function OrdersContent() {
  const { orders, isLoading, error, refresh } = useProviderData();
  const [actionError, setActionError] = useState<string | null>(null);
  async function changeStatus(id: string, status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED") { try { await updateProviderOrderStatus(id, status); await refresh(); } catch (requestError) { setActionError(getApiErrorMessage(requestError, "Unable to update order")); } }
  return <section className="space-y-6"><PageHeader description="Manage rental orders for your equipment." title={`Orders (${orders.length})`} /><RequestError error={actionError ?? error} />{isLoading ? <Loader /> : <div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Customer</th><th className="p-3">Equipment</th><th className="p-3">Rental dates</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{orders.map((order) => <tr className="border-t" key={order.id}><td className="p-3"><p>{order.customer.name}</p><p className="text-muted-foreground">{order.customer.email}</p></td><td className="p-3">{order.items.map((item) => item.gearItem.name).join(", ")}</td><td className="p-3">{new Date(order.startDate).toLocaleDateString()}<br />to {new Date(order.endDate).toLocaleDateString()}</td><td className="p-3"><ProviderStatusBadge status={order.payment?.status ?? "PENDING"} /></td><td className="p-3"><ProviderStatusBadge status={order.status} /></td><td className="p-3"><OrderActions order={order} onUpdate={changeStatus} /></td></tr>)}{!orders.length ? <EmptyTable columns={6} message="No orders found." /> : null}</tbody></table></div>}</section>;
}

function OrderActions({ order, onUpdate }: { order: ProviderOrder; onUpdate: (id: string, status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED") => Promise<void> }) {
  const canReturn = new Date(order.endDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);
  const action = order.status === "PLACED" ? { label: "Confirm", status: "CONFIRMED" as const } : order.status === "PAID" ? { label: "Mark picked up", status: "PICKED_UP" as const } : order.status === "PICKED_UP" && canReturn ? { label: "Mark returned", status: "RETURNED" as const } : null;
  if (action || order.status === "PLACED" || order.status === "CONFIRMED") return <DropdownMenu><DropdownMenuTrigger render={<Button size="icon" variant="outline" />}><MoreHorizontal /><span className="sr-only">Order actions</span></DropdownMenuTrigger><DropdownMenuContent align="end">{action ? <DropdownMenuItem onClick={() => void onUpdate(order.id, action.status)}>{action.label}</DropdownMenuItem> : null}{order.status === "PICKED_UP" && !canReturn ? <DropdownMenuItem disabled>Return available on end date</DropdownMenuItem> : null}{order.status === "PLACED" || order.status === "CONFIRMED" ? <DropdownMenuItem onClick={() => void onUpdate(order.id, "CANCELLED")}>Cancel order</DropdownMenuItem> : null}</DropdownMenuContent></DropdownMenu>;
  return <span className="text-muted-foreground">No action</span>;
}

function ProviderStatusBadge({ status }: { status: string }) { const colors: Record<string, string> = { PLACED: "bg-amber-100 text-amber-800", PENDING: "bg-amber-100 text-amber-800", CONFIRMED: "bg-blue-100 text-blue-800", PAID: "bg-violet-100 text-violet-800", PICKED_UP: "bg-emerald-100 text-emerald-800", COMPLETED: "bg-emerald-100 text-emerald-800", RETURNED: "bg-slate-100 text-slate-700", CANCELLED: "bg-destructive/10 text-destructive", FAILED: "bg-destructive/10 text-destructive" }; return <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] ?? "bg-muted text-muted-foreground"}`}>{status.replaceAll("_", " ")}</span>; }

export function ProviderEarningsPage() {
  return <ProviderShell><EarningsContent /></ProviderShell>;
}

function EarningsContent() {
  const { orders, isLoading, error } = useProviderData();
  const activeOrders = orders.filter((order) => order.payment?.status === "COMPLETED");
  const earnings = activeOrders.reduce((total, order) => total + Number(order.totalAmount), 0);
  return <section className="space-y-6"><PageHeader action={<div className="rounded-xl border px-5 py-3"><p className="text-sm text-muted-foreground">Total revenue</p><p className="text-xl font-bold">{isLoading ? "—" : `৳${earnings.toLocaleString()}`}</p></div>} description="Revenue from completed Stripe payments." title="Earnings" /><RequestError error={error} /><div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead><tbody>{activeOrders.map((order) => <tr className="border-t" key={order.id}><td className="p-3">{order.id.slice(0, 8)}</td><td className="p-3">{order.customer.name}</td><td className="p-3">৳{order.totalAmount}</td><td className="p-3">{order.status}</td></tr>)}{!isLoading && !activeOrders.length ? <EmptyTable columns={4} message="No earnings yet." /> : null}</tbody></table></div></section>;
}

function FormInput({ defaultValue, label, min, name, type = "text" }: { defaultValue: string | number; label: string; min?: string; name: string; type?: string }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input defaultValue={defaultValue} id={name} min={min} name={name} required type={type} /></div>; }
function Loader() { return <div className="h-64 animate-pulse rounded-xl bg-muted" />; }
function RequestError({ error }: { error: string | null }) { return error ? <p className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</p> : null; }
function EmptyTable({ columns, message }: { columns: number; message: string }) { return <tr><td className="p-8 text-center text-muted-foreground" colSpan={columns}>{message}</td></tr>; }
