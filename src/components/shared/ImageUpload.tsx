"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { uploadToCloudinary } from "@/src/services/cloudinary.service";

interface Props {
  value?: string;
  onChange?: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or smaller");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setError(null);
    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setPreview(imageUrl);
      onChange?.(imageUrl);
    } catch (uploadError) {
      setPreview(value ?? null);
      setError(getApiErrorMessage(uploadError, "Unable to upload image"));
    } finally {
      URL.revokeObjectURL(localPreview);
      setIsUploading(false);
    }
  }

  function removeImage() {
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setError(null);
    onChange?.(null);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
        disabled={disabled || isUploading}
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="
          flex
          h-48
          w-full
          flex-col
          items-center
          justify-center
          gap-3
          rounded-xl
          border-2
          border-dashed
          border-muted-foreground/30
          bg-muted/20
          transition
          hover:bg-muted/40
          "
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground" />

          <div className="text-center">
            <p className="font-medium">
              {isUploading ? "Uploading image..." : "Upload equipment image"}
            </p>

            <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border">
          <Image
            src={preview}
            alt="Preview"
            width={600}
            height={400}
            className="
            h-64
            w-full
            object-cover
            "
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeImage}
            disabled={disabled || isUploading}
            className="
            absolute
            right-3
            top-3
            rounded-full
            "
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
