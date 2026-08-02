"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/src/components/shared/ImageUpload";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getCategories } from "@/src/services/category/category.service";
import { createProviderGear } from "@/src/services/provider/provider.service";
import type { Category } from "@/src/types/admin";

const schema = z.object({
  categoryId: z.string().min(1, "Select a category"),
  name: z.string().min(1, "Equipment name is required"),
  brand: z.string().optional(),
  description: z.string().optional(),
  pricePerDay: z.number().positive("Price per day must be greater than zero"),
  stockQuantity: z.number().int().positive("Stock quantity must be greater than zero"),
  availableQuantity: z.number().int().min(0, "Available quantity cannot be negative"),
  imageUrl: z.string().url("Upload a valid image").optional(),
  specifications: z.object({
    material: z.string().optional(),
    adjustableLength: z.string().optional(),
    condition: z.string().optional(),
  }),
}).refine((data) => data.availableQuantity <= data.stockQuantity, {
  message: "Available quantity cannot exceed stock quantity",
  path: ["availableQuantity"],
});

type FormValues = z.infer<typeof schema>;

export default function CreateEquipmentForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageUploadKey, setImageUploadKey] = useState(0);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      availableQuantity: 1,
      stockQuantity: 1,
      specifications: { material: "", adjustableLength: "", condition: "" },
    },
  });

  useEffect(() => {
    let isMounted = true;

    void getCategories().then(
      (nextCategories) => {
        if (isMounted) setCategories(nextCategories);
      },
      (error: unknown) => {
        if (isMounted) setCategoryError(getApiErrorMessage(error, "Unable to load categories"));
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setIsSubmitted(false);

    try {
      await createProviderGear({
        ...values,
        specifications: Object.fromEntries(
          Object.entries(values.specifications).filter(([, value]) => value.trim()),
        ),
      });
      form.reset({
        availableQuantity: 1,
        stockQuantity: 1,
        specifications: { material: "", adjustableLength: "", condition: "" },
      });
      setImageUploadKey((key) => key + 1);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Unable to create equipment"));
    }
  }

  const imageUrl = useWatch({
    control: form.control,
    name: "imageUrl",
  });

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Equipment details</CardTitle>
        <CardDescription>Fill in the details before publishing your equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select className="h-9 w-full rounded-md border bg-background px-3 text-sm" id="categoryId" {...form.register("categoryId")}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            {categoryError ? <p className="text-sm text-destructive">{categoryError}</p> : null}
            {form.formState.errors.categoryId ? <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p> : null}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Equipment name" error={form.formState.errors.name?.message}><Input id="name" {...form.register("name")} /></Field>
            <Field label="Brand" error={form.formState.errors.brand?.message}><Input id="brand" {...form.register("brand")} /></Field>
          </div>
          <Field label="Description" error={form.formState.errors.description?.message}><Input id="description" {...form.register("description")} /></Field>
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Price per day" error={form.formState.errors.pricePerDay?.message}><Input id="pricePerDay" type="number" min="1" {...form.register("pricePerDay", { valueAsNumber: true })} /></Field>
            <Field label="Stock quantity" error={form.formState.errors.stockQuantity?.message}><Input id="stockQuantity" type="number" min="1" {...form.register("stockQuantity", { valueAsNumber: true })} /></Field>
            <Field label="Available quantity" error={form.formState.errors.availableQuantity?.message}><Input id="availableQuantity" type="number" min="0" {...form.register("availableQuantity", { valueAsNumber: true })} /></Field>
          </div>
          <div className="space-y-2">
            <Label>Equipment image</Label>
            <ImageUpload key={imageUploadKey} value={imageUrl} onChange={(nextImageUrl) => form.setValue("imageUrl", nextImageUrl ?? undefined, { shouldValidate: true })} disabled={form.formState.isSubmitting} />
            {form.formState.errors.imageUrl ? <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p> : null}
          </div>
          <fieldset className="space-y-4 rounded-xl border p-5">
            <legend className="px-1 font-semibold">Specifications</legend>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Material" error={form.formState.errors.specifications?.material?.message}><Input id="material" placeholder="Aluminum" {...form.register("specifications.material")} /></Field>
              <Field label="Adjustable length" error={form.formState.errors.specifications?.adjustableLength?.message}><Input id="adjustableLength" placeholder="65cm-135cm" {...form.register("specifications.adjustableLength")} /></Field>
              <Field label="Condition" error={form.formState.errors.specifications?.condition?.message}><Input id="condition" placeholder="Good" {...form.register("specifications.condition")} /></Field>
            </div>
          </fieldset>
          {submitError ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{submitError}</p> : null}
          {isSubmitted ? <p className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700">Equipment created successfully.</p> : null}
          <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? "Creating equipment..." : "Create equipment"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error ? <p className="text-sm text-destructive">{error}</p> : null}</div>;
}
