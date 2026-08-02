import type { Dispatch, SetStateAction } from "react";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { deleteProviderGear } from "@/src/services/provider/provider.service";
import type { ProviderGear } from "@/src/types/admin";

type ActionErrorSetter = Dispatch<SetStateAction<string | null>>;

type PageSetter = Dispatch<SetStateAction<number>>;

export async function removeGear(
  id: string,
  gear: ProviderGear[],
  page: number,
  setPage: PageSetter,
  loadGear: () => Promise<void>,
  refreshProvider: () => Promise<void>,
  setActionError: ActionErrorSetter,
) {
  try {
    await deleteProviderGear(id);

    if (gear.length === 1 && page > 1) {
      setPage((currentPage) => currentPage - 1);
    } else {
      await loadGear();
    }

    await refreshProvider();
  } catch (requestError) {
    setActionError(
      getApiErrorMessage(requestError, "Unable to delete equipment"),
    );
  }
}
