"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProviderData } from "@/src/components/providers/ProviderProvider";
import DataTable from "@/src/components/shared/DataTable";
import PageHeader from "@/src/components/shared/PageHeader";
import StatusBadge from "@/src/components/shared/StatusBadge";
import { getApiErrorMessage } from "@/src/lib/api-error";
import {
  getProviderGear,
  updateProviderGear,
} from "@/src/services/provider/provider.service";
import type { ProviderGear } from "@/src/types/admin";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import { ProviderImage } from "./ProviderImage";
import { removeGear as removeGearAction } from "./removeGear";
import { saveGear as saveGearAction } from "./saveGear";
import { FormInput, Loader, RequestError } from "./ProviderContentHelpers";
import Pagination from "@/src/components/shared/Pagination";

export function EquipmentContent() {
  const { refresh: refreshProvider } = useProviderData();
  const [gear, setGear] = useState<ProviderGear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingGear, setEditingGear] = useState<ProviderGear | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [gearToDelete, setGearToDelete] = useState<ProviderGear | null>(null);

  const loadGear = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProviderGear({ page, limit: meta.limit });
      setGear(result.gear);
      setMeta(
        result.meta ?? {
          page,
          limit: meta.limit,
          total: result.gear.length,
          totalPage: 1,
        },
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load equipment"));
    } finally {
      setIsLoading(false);
    }
  }, [meta.limit, page]);

  const toggleAvailability = useCallback(
    async (item: ProviderGear) => {
      try {
        await updateProviderGear(item.id, {
          status: item.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE",
        });
        await Promise.all([loadGear(), refreshProvider()]);
      } catch (requestError) {
        setActionError(
          getApiErrorMessage(requestError, "Unable to update availability"),
        );
      }
    },
    [loadGear, refreshProvider],
  );

  const columns = useMemo(
    () => [
      {
        header: "Image",
        cell: (item: ProviderGear) => (
          <ProviderImage
            alt={item.name}
            src={item.imageUrl}
            wrapperClassName="relative h-12 w-16 overflow-hidden rounded-lg bg-muted"
            sizes="64px"
          />
        ),
      },
      {
        header: "Equipment",
        cell: (item: ProviderGear) => item.name,
      },
      {
        header: "Category",
        cell: (item: ProviderGear) => item.category.name,
      },
      {
        header: "Price/day",
        cell: (item: ProviderGear) => `৳${item.pricePerDay}`,
      },
      {
        header: "Available",
        cell: (item: ProviderGear) => (
          <span>
            {item.availableQuantity}/{item.stockQuantity}
          </span>
        ),
      },
      {
        header: "Status",
        cell: (item: ProviderGear) => <StatusBadge status={item.status} />,
      },
      {
        header: "Actions",
        cell: (item: ProviderGear) => (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setEditingGear(item)}
              size="sm"
              variant="outline"
            >
              Edit
            </Button>
            <Button
              onClick={() => void toggleAvailability(item)}
              size="sm"
              variant="outline"
            >
              {item.status === "AVAILABLE" ? "Disable" : "Enable"}
            </Button>
            <Button
              onClick={() => setGearToDelete(item)}
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [toggleAvailability],
  );

  useEffect(() => {
    void Promise.resolve().then(loadGear);
  }, [loadGear]);

  return (
    <section className="space-y-6">
      <PageHeader
        action={
          <Link href="/provider/create-equipment">
            <Button>Add equipment</Button>
          </Link>
        }
        description="Manage your listed rental equipment."
        title={`My equipment (${meta.total})`}
      />
      <RequestError error={actionError ?? error} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={gear} />
          {meta.totalPage > 1 ? (
            <Pagination
              page={page}
              total={meta.total}
              totalPage={meta.totalPage}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}
      <Dialog
        open={Boolean(editingGear)}
        onOpenChange={(open) => !open && setEditingGear(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit equipment</DialogTitle>
            <DialogDescription>
              Update inventory and availability values.
            </DialogDescription>
          </DialogHeader>
          {editingGear ? (
            <form
              className="space-y-4"
              key={editingGear.id}
              onSubmit={(event) =>
                void saveGearAction(
                  event,
                  editingGear,
                  setEditingGear,
                  setIsSaving,
                  setActionError,
                  loadGear,
                  refreshProvider,
                )
              }
            >
              <FormInput
                defaultValue={editingGear.name}
                label="Name"
                name="name"
              />
              <FormInput
                defaultValue={editingGear.pricePerDay}
                label="Price per day"
                min="1"
                name="pricePerDay"
                type="number"
              />
              <FormInput
                defaultValue={editingGear.stockQuantity}
                label="Stock quantity"
                min="1"
                name="stockQuantity"
                type="number"
              />
              <FormInput
                defaultValue={editingGear.availableQuantity}
                label="Available quantity"
                min="0"
                name="availableQuantity"
                type="number"
              />
              <Button className="w-full" disabled={isSaving} type="submit">
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        description={`This permanently deletes ${gearToDelete?.name ?? "this equipment"}. Equipment used by rental orders cannot be deleted.`}
        onConfirm={() =>
          gearToDelete
            ? removeGearAction(
                gearToDelete.id,
                gear,
                page,
                setPage,
                loadGear,
                refreshProvider,
                setActionError,
              )
            : Promise.resolve()
        }
        onOpenChange={(open) => !open && setGearToDelete(null)}
        open={Boolean(gearToDelete)}
        title="Delete equipment?"
      />
    </section>
  );
}
