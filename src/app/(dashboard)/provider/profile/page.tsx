"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProviderShell from "@/src/components/dashboard/provider/ProviderShell";
import PageHeader from "@/src/components/shared/PageHeader";
import { useAuth } from "@/src/context/AuthContext";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { updateProviderProfile } from "@/src/services/provider/provider.service";

export default function ProfilePage() {
  return (
    <ProviderShell enableProviderData={false}>
      <ProfileContent />
    </ProviderShell>
  );
}

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!user) return null;

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setIsSaving(true);
    setError(null);
    try {
      const profile = await updateProviderProfile({ name: String(values.get("name") ?? "").trim(), phone: String(values.get("phone") ?? "").trim(), address: String(values.get("address") ?? "").trim() });
      updateUser({ ...user, ...profile });
      setIsEditing(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to update profile"));
    } finally { setIsSaving(false); }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        action={<Button onClick={() => setIsEditing(true)}>Edit profile</Button>}
        description="Your provider account information."
        title="Provider profile"
      />
      <article className="rounded-xl border p-6">
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              {user.phone ?? "No phone added"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.address ?? "No address added"}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {user.role}
          </span>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <ProfileStat label="Equipment" value="—" />
          <ProfileStat label="Orders" value="—" />
          <ProfileStat label="Account status" value="Active" />
        </dl>
      </article>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update the public provider contact information.
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
    </section>
  );
}

function ProfileInput({ defaultValue, label, name }: { defaultValue: string; label: string; name: string }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input defaultValue={defaultValue} id={name} name={name} required={name === "name"} /></div>; }
function ProfileStat({ label, value }: { label: string; value: string | number }) { return <div className="rounded-lg border p-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 text-2xl font-semibold">{value}</dd></div>; }
