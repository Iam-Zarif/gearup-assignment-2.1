import Image from "next/image";

import RegisterForm from "@/src/components/forms/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main
      className=" grid min-h-screen bg-background lg:grid-cols-2"
    >

      <section
        className="
        flex
        items-center
        justify-center
        px-6
        py-10
        lg:px-16
        "
      >
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </section>

      {/* Right */}

      <section
        className="
        relative
        hidden
        overflow-hidden
        lg:block
        "
      >
        <Image
          src="/register.png"
          alt="Register"
          fill
          priority
          className="object-cover"
        />

        <div
          className="
          absolute
          inset-0
          bg-linear-to-br
          from-black/70
          via-black/40
          to-primary/20
          "
        />

       
      </section>
    </main>
  );
}