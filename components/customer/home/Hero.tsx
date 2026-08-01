import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CustomerHeroSection = () => {
      const router = useRouter();
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src="/home.jpg"
          alt="GearUp hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

  
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-3xl space-y-6 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Rent Quality Equipment
              <br />
              Anytime, Anywhere
            </h1>

            <p className="mx-auto max-w-xl text-base text-white/80 sm:text-lg">
              Find reliable agricultural and industrial equipment from trusted
              providers and get your work done faster with GearUp.
            </p>

            <Button
              size="lg"
              className="rounded-xl px-8 text-base font-semibold"
              onClick={() => router.push("/gear")}
            >
              Explore Equipment
            </Button>
          </div>
        </div>
      </section>
  )
}

export default CustomerHeroSection