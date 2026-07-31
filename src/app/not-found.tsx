import Link from "next/link";
import { SearchX } from "lucide-react";


export default function NotFound() {

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">

      <section className="max-w-md text-center">

        <div className="
          mx-auto 
          mb-6 
          flex 
          h-16 
          w-16 
          items-center 
          justify-center 
          rounded-full 
          bg-muted
        ">
          <SearchX 
            className="h-8 w-8 text-muted-foreground"
          />
        </div>


        <h1 className="
          text-5xl 
          font-bold 
          tracking-tight
        ">
          404
        </h1>


        <h2 className="
          mt-3
          text-xl
          font-semibold
        ">
          Page not found
        </h2>


        <p className="
          mt-3
          text-sm
          text-muted-foreground
        ">
          Sorry, the page you are looking for does not exist.
        </p>


        <Link
          href="/"
          className="
          mt-6
          inline-flex
          rounded-xl
          bg-primary
          px-6
          py-3
          text-sm
          font-medium
          text-primary-foreground
          hover:opacity-90
          "
        >
          Back Home
        </Link>

      </section>

    </main>
  );
}