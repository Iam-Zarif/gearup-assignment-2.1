"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";

type CarouselContextValue = { carouselRef: ReturnType<typeof useEmblaCarousel>[0] };
const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function Carousel({ autoPlay = false, children, className }: { autoPlay?: boolean; children: React.ReactNode; className?: string }) {
  const [carouselRef, api] = useEmblaCarousel({ align: "start", loop: true });

  React.useEffect(() => {
    if (!autoPlay || !api) return;
    const intervalId = window.setInterval(() => api.scrollNext(), 4000);
    return () => window.clearInterval(intervalId);
  }, [api, autoPlay]);

  return <CarouselContext.Provider value={{ carouselRef }}><div className={cn("relative", className)}>{children}</div></CarouselContext.Provider>;
}

function CarouselContent({ children, className }: React.ComponentProps<"div">) {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("CarouselContent must be used within Carousel");
  return <div className="overflow-hidden" ref={context.carouselRef}><div className={cn("flex -ml-5", className)}>{children}</div></div>;
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4", className)} {...props} />;
}

export { Carousel, CarouselContent, CarouselItem };
