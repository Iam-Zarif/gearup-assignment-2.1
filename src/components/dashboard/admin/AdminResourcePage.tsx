"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import AdminShell from "@/src/components/dashboard/admin/AdminShell";
import AdminCategoryDialog from "./AdminCategoryDialog";
import AdminResourceTable from "./AdminResourceTable";
import { ResourceDetails } from "./AdminResourceDetails";
import {
  configuration,
  headers,
  requests,
  type Resource,
  type ResourceData,
} from "./AdminResourceConfig";
import DetailsDialog from "@/src/components/shared/DetailsDialog";
import PageHeader from "@/src/components/shared/PageHeader";
import { useAdmin } from "@/src/components/providers/AdminProvider";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { adminService } from "@/src/services/admin/admin.service";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import type {
  AdminReview,
  AdminUser,
  Category,
} from "@/src/types/admin";

export default function AdminResourcePage({
  resource,
}: {
  resource: Resource;
}) {
  return (
    <AdminShell>
      <AdminResourceContent resource={resource} />
    </AdminShell>
  );
}

function AdminResourceContent({ resource }: { resource: Resource }) {
  const { refreshStats } = useAdmin();
  const [data, setData] = useState<ResourceData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ResourceData[number] | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState<string | null>(null);
  const [categoryImageKey, setCategoryImageKey] = useState(0);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const { title, description } = configuration[resource];
  const pageSize = 10;
  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const loadResource = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await requests[resource]());
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          `Unable to load ${title.toLowerCase()}`,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [resource, title]);

  useEffect(() => {
    void Promise.resolve().then(loadResource);
  }, [loadResource]);

  useEffect(() => {
    void Promise.resolve().then(() => setPage(1));
  }, [resource, search]);

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const descriptionValue = String(formData.get("description") ?? "").trim();

    if (!name) {
      setCreateError("Category name is required");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const category = await adminService.createCategory({
        name,
        description: descriptionValue || null,
        imageUrl: categoryImageUrl,
      });
      setData((current) => [category, ...current] as ResourceData);
      await refreshStats();
      setCategoryImageUrl(null);
      setCategoryImageKey((key) => key + 1);
      setIsCreateOpen(false);
    } catch (requestError) {
      setCreateError(
        getApiErrorMessage(requestError, "Unable to create category"),
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function updateUserStatus(user: AdminUser) {
    setActionError(null);
    try {
      const status = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      const updatedUser = await adminService.updateUserStatus(user.id, status);
      setData(
        (current) =>
          current.map((item) =>
            (item as AdminUser).id === updatedUser.id ? updatedUser : item,
          ) as ResourceData,
      );
    } catch (requestError) {
      setActionError(
        getApiErrorMessage(requestError, "Unable to update user status"),
      );
    }
  }

  async function removeReview(review: AdminReview) {
    setActionError(null);
    try {
      await adminService.deleteReview(review.id);
      setData(
        (current) =>
          current.filter(
            (item) => (item as AdminReview).id !== review.id,
          ) as ResourceData,
      );
    } catch (requestError) {
      setActionError(
        getApiErrorMessage(requestError, "Unable to delete review"),
      );
    }
  }

  async function removeCategory(category: Category) {
    setActionError(null);
    try {
      await adminService.deleteCategory(category.id);
      setData(
        (current) =>
          current.filter(
            (item) => (item as Category).id !== category.id,
          ) as ResourceData,
      );
      await refreshStats();
    } catch (requestError) {
      setActionError(
        getApiErrorMessage(requestError, "Unable to delete category"),
      );
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        description={description}
        title={`${title} (${data.length})`}
        action={
          resource === "categories" ? (
            <AdminCategoryDialog
              error={createError}
              imageKey={categoryImageKey}
              isCreating={isCreating}
              open={isCreateOpen}
              onImageChange={setCategoryImageUrl}
              onOpenChange={setIsCreateOpen}
              onSubmit={createCategory}
            />
          ) : undefined
        }
      />
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : null}
      {error || actionError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <p>{actionError ?? error}</p>
          {error ? (
            <Button
              className="mt-3"
              onClick={() => void loadResource()}
              size="sm"
              variant="outline"
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : null}
      {!isLoading && !error ? (
        <AdminResourceTable
          resource={resource}
          title={title}
          headers={headers[resource]}
          filteredData={filteredData}
          pageData={pageData}
          page={page}
          totalPages={totalPages}
          search={search}
          onSearchChange={setSearch}
          onPageChange={setPage}
          onSelect={setSelected}
          onUpdateUserStatus={(user) => void updateUserStatus(user)}
          onReviewDelete={setReviewToDelete}
          onCategoryDelete={setCategoryToDelete}
        />
      ) : null}
      <DetailsDialog
        description="Live data returned by the API."
        onOpenChange={(open) => !open && setSelected(null)}
        open={Boolean(selected)}
        title={`${title} details`}
      >
        {selected ? (
          <ResourceDetails item={selected} resource={resource} />
        ) : null}
      </DetailsDialog>
      <ConfirmDialog
        description="This permanently removes the review from the platform."
        onConfirm={() =>
          reviewToDelete ? removeReview(reviewToDelete) : Promise.resolve()
        }
        onOpenChange={(open) => !open && setReviewToDelete(null)}
        open={Boolean(reviewToDelete)}
        title="Delete review?"
      />
      <ConfirmDialog
        description={`This deletes ${categoryToDelete?.name ?? "this category"}. Categories with gear cannot be deleted.`}
        onConfirm={() =>
          categoryToDelete
            ? removeCategory(categoryToDelete)
            : Promise.resolve()
        }
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        open={Boolean(categoryToDelete)}
        title="Delete category?"
      />
    </section>
  );
}
