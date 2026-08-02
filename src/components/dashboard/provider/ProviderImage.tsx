import Image from "next/image";
import { Package } from "lucide-react";

interface ProviderImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  sizes?: string;
}

export function ProviderImage({
  src,
  alt,
  className = "object-cover",
  wrapperClassName = "h-12 w-16 overflow-hidden rounded-lg bg-muted",
  sizes = "64px",
}: ProviderImageProps) {
  if (!src) {
    return (
      <div className={wrapperClassName}>
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Package className="size-5" />
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Image
        alt={alt}
        src={src}
        fill
        sizes={sizes}
        className={className}
      />
    </div>
  );
}
