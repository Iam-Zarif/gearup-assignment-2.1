"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import { useProviderData } from "@/src/components/providers/ProviderProvider";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { deleteProviderGear, updateProviderGear, updateProviderOrderStatus } from "@/src/services/provider/provider.service";
import type { ProviderGear, ProviderOrder } from "@/src/types/admin";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";

export function ProviderEquipmentPage() {
  return <ProviderShell><EquipmentContent /></ProviderShell>;
}

function EquipmentContent() {
  const { gear, isLoading, error, refresh } = useProviderData();
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingGear, setEditingGear] = useState<ProviderGear | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [gearToDelete, setGearToDelete] = useState<ProviderGear | null>(null);

  async function removeGear(id: string) {
    try { await deleteProviderGear(id); await refresh(); } catch (requestError) { setActionError(getApiErrorMessage(requestError, "Unable to delete equipment")); }
  }

  async function toggleAvailability(item: ProviderGear) {
    try { await updateProviderGear(item.id, { status: item.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE" }); await refresh(); } catch (requestError) { setActionError(getApiErrorMessage(requestError, "Unable to update availability")); }
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
      await refresh();
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, "Unable to update equipment"));
    } finally {
      setIsSaving(false);
    }
  }

  return <section className="space-y-6"><div className="flex justify-between gap-4"><div><h1 className="text-3xl font-bold">My equipment ({gear.length})</h1><p className="mt-1 text-muted-foreground">Manage your listed rental equipment.</p></div><Link href="/provider/create-equipment"><Button>Add equipment</Button></Link></div><RequestError error={actionError ?? error} />{isLoading ? <Loader /> : <div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Image</th><th className="p-3">Equipment</th><th className="p-3">Category</th><th className="p-3">Price/day</th><th className="p-3">Available</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{gear.map((item) => <tr className="border-t" key={item.id}><td className="p-3">{item.imageUrl ? <img alt={item.name} className="h-12 w-16 rounded object-cover" src={item.imageUrl} /> : <span className="text-muted-foreground">No image</span>}</td><td className="p-3">{item.name}</td><td className="p-3">{item.category.name}</td><td className="p-3">৳{item.pricePerDay}</td><td className="p-3">{item.availableQuantity}/{item.stockQuantity}</td><td className="p-3">{item.status}</td><td className="p-3"><div className="flex flex-wrap gap-2"><Button onClick={() => setEditingGear(item)} size="sm" variant="outline">Edit</Button><Button onClick={() => void toggleAvailability(item)} size="sm" variant="outline">{item.status === "AVAILABLE" ? "Disable" : "Enable"}</Button><Button onClick={() => setGearToDelete(item)} size="sm" variant="destructive">Delete</Button></div></td></tr>)}{!gear.length ? <EmptyTable columns={7} message="No equipment found." /> : null}</tbody></table></div>}<Dialog open={Boolean(editingGear)} onOpenChange={(open) => !open && setEditingGear(null)}><DialogContent><DialogHeader><DialogTitle>Edit equipment</DialogTitle><DialogDescription>Update inventory and availability values.</DialogDescription></DialogHeader>{editingGear ? <form className="space-y-4" onSubmit={saveGear}><FormInput defaultValue={editingGear.name} label="Name" name="name" /><FormInput defaultValue={editingGear.pricePerDay} label="Price per day" min="1" name="pricePerDay" type="number" /><FormInput defaultValue={editingGear.stockQuantity} label="Stock quantity" min="1" name="stockQuantity" type="number" /><FormInput defaultValue={editingGear.availableQuantity} label="Available quantity" min="0" name="availableQuantity" type="number" /><Button className="w-full" disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save changes"}</Button></form> : null}</DialogContent></Dialog><ConfirmDialog description={`This permanently deletes ${gearToDelete?.name ?? "this equipment"}. Equipment used by rental orders cannot be deleted.`} onConfirm={() => gearToDelete ? removeGear(gearToDelete.id) : Promise.resolve()} onOpenChange={(open) => !open && setGearToDelete(null)} open={Boolean(gearToDelete)} title="Delete equipment?" /></section>;
}

export function ProviderOrdersPage() {
  return <ProviderShell><OrdersContent /></ProviderShell>;
}

function OrdersContent() {
  const { orders, isLoading, error, refresh } = useProviderData();
  const [actionError, setActionError] = useState<string | null>(null);
  async function changeStatus(id: string, status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED") { try { await updateProviderOrderStatus(id, status); await refresh(); } catch (requestError) { setActionError(getApiErrorMessage(requestError, "Unable to update order")); } }
  return <section className="space-y-6"><div><h1 className="text-3xl font-bold">Orders ({orders.length})</h1><p className="mt-1 text-muted-foreground">Manage rental orders for your equipment.</p></div><RequestError error={actionError ?? error} />{isLoading ? <Loader /> : <div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Customer</th><th className="p-3">Equipment</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{orders.map((order) => <tr className="border-t" key={order.id}><td className="p-3"><p>{order.customer.name}</p><p className="text-muted-foreground">{order.customer.email}</p></td><td className="p-3">{order.items.map((item) => item.gearItem.name).join(", ")}</td><td className="p-3">৳{order.totalAmount}</td><td className="p-3">{order.status}</td><td className="p-3"><OrderActions order={order} onUpdate={changeStatus} /></td></tr>)}{!orders.length ? <EmptyTable columns={5} message="No orders found." /> : null}</tbody></table></div>}</section>;
}

function OrderActions({ order, onUpdate }: { order: ProviderOrder; onUpdate: (id: string, status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED") => Promise<void> }) {
  if (order.status === "PLACED") return <div className="flex gap-2"><Button onClick={() => void onUpdate(order.id, "CONFIRMED")} size="sm">Confirm</Button><Button onClick={() => void onUpdate(order.id, "CANCELLED")} size="sm" variant="destructive">Cancel</Button></div>;
  if (order.status === "CONFIRMED") return <Button onClick={() => void onUpdate(order.id, "CANCELLED")} size="sm" variant="destructive">Cancel</Button>;
  if (order.status === "PAID") return <Button onClick={() => void onUpdate(order.id, "PICKED_UP")} size="sm">Mark picked up</Button>;
  if (order.status === "PICKED_UP") return <Button onClick={() => void onUpdate(order.id, "RETURNED")} size="sm">Mark returned</Button>;
  return <span className="text-muted-foreground">No action</span>;
}

export function ProviderEarningsPage() {
  return <ProviderShell><EarningsContent /></ProviderShell>;
}

function EarningsContent() {
  const { orders, isLoading, error } = useProviderData();
  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
  const earnings = activeOrders.reduce((total, order) => total + Number(order.totalAmount), 0);
  return <section className="space-y-6"><div className="flex justify-between gap-4"><div><h1 className="text-3xl font-bold">Earnings</h1><p className="mt-1 text-muted-foreground">Rental revenue from active orders.</p></div><div className="rounded-xl border px-5 py-3"><p className="text-sm text-muted-foreground">Total revenue</p><p className="text-xl font-bold">{isLoading ? "—" : `৳${earnings.toLocaleString()}`}</p></div></div><RequestError error={error} /><div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead><tbody>{activeOrders.map((order) => <tr className="border-t" key={order.id}><td className="p-3">{order.id.slice(0, 8)}</td><td className="p-3">{order.customer.name}</td><td className="p-3">৳{order.totalAmount}</td><td className="p-3">{order.status}</td></tr>)}{!isLoading && !activeOrders.length ? <EmptyTable columns={4} message="No earnings yet." /> : null}</tbody></table></div></section>;
}

function FormInput({ defaultValue, label, min, name, type = "text" }: { defaultValue: string | number; label: string; min?: string; name: string; type?: string }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input defaultValue={defaultValue} id={name} min={min} name={name} required type={type} /></div>; }
function Loader() { return <div className="h-64 animate-pulse rounded-xl bg-muted" />; }
function RequestError({ error }: { error: string | null }) { return error ? <p className="rounded-lg bg-destructive/10 p-4 text-destructive">{error}</p> : null; }
function EmptyTable({ columns, message }: { columns: number; message: string }) { return <tr><td className="p-8 text-center text-muted-foreground" colSpan={columns}>{message}</td></tr>; }
