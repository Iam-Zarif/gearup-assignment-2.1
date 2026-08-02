"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomerShell from "@/src/components/customer/CustomerShell";
import { useAuth } from "@/src/context/AuthContext";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getMyRentals } from "@/src/services/customer/customer.service";
import { updateProfile } from "@/src/services/auth/auth.service";

export default function ProfilePage() {
  return (
    <CustomerShell>
      <ProfileContent />
    </CustomerShell>
  );
}

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    void getMyRentals({ page: 1, limit: 1 })
      .then((result) =>
        setOrderCount(result.meta?.total ?? result.rentals.length),
      )
      .catch(() => setOrderCount(0));
  }, []);
  if (!user) return null;

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setIsSaving(true);
    setError(null);
    try {
      const profile = await updateProfile({
        name: String(values.get("name") ?? "").trim(),
        phone: String(values.get("phone") ?? "").trim(),
        address: String(values.get("address") ?? "").trim(),
      });
      updateUser({ ...user, ...profile });
      setIsEditing(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to update profile"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account information.
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)}>Edit profile</Button>
      </div>
      <section className="mt-8 rounded-2xl border p-6">
        <div className="border-b pb-5">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
          <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            Customer
          </span>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <ProfileItem label="Phone" value={user.phone ?? "Not provided"} />
          <ProfileItem label="Address" value={user.address ?? "Not provided"} />
          <ProfileItem
            label="Rental orders"
            value={orderCount === null ? "—" : String(orderCount)}
          />
        </dl>
      </section>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Keep your rental contact information current.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveProfile}>
            <ProfileInput defaultValue={user.name} label="Name" name="name" />
            <ProfileInput
              defaultValue={user.phone ?? ""}
              label="Phone"
              name="phone"
            />
            <ProfileInput
              defaultValue={user.address ?? ""}
              label="Address"
              name="address"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
function ProfileInput({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string;
  label: string;
  name: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        name={name}
        required={name === "name"}
      />
    </div>
  );
}
