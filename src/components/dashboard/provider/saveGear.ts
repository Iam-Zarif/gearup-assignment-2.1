import type { Dispatch, FormEvent, SetStateAction } from "react";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { updateProviderGear } from "@/src/services/provider/provider.service";
import type { ProviderGear } from "@/src/types/admin";

type ActionErrorSetter = Dispatch<SetStateAction<string | null>>;

type GearSetter = Dispatch<SetStateAction<ProviderGear | null>>;

type SavingSetter = Dispatch<SetStateAction<boolean>>;

export async function saveGear(
  event: FormEvent<HTMLFormElement>,
  editingGear: ProviderGear | null,
  setEditingGear: GearSetter,
  setIsSaving: SavingSetter,
  setActionError: ActionErrorSetter,
  loadGear: () => Promise<void>,
  refreshProvider: () => Promise<void>,
) {
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
    setActionError(
      getApiErrorMessage(requestError, "Unable to update equipment"),
    );
  } finally {
    setIsSaving(false);
  }
}
