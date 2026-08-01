"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onChange?: (file: File | null) => void;
}

export default function ImageUpload({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);

    onChange?.(file);
  }

  function removeImage() {
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

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
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
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
            <p className="font-medium">Upload equipment image</p>

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
    </div>
  );
}
