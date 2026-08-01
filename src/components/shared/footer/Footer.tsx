"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  const { user } = useAuth();

  // Hide footer for dashboard roles
  if (user?.role === "ADMIN" || user?.role === "PROVIDER") {
    return null;
  }

  return (
    <footer className="border-t mt-12 bg-background">
      <div
        className="
        mx-auto
        max-w-7xl
        px-4
        py-6
        "
      >
        <div
          className="
          grid
          gap-8
          md:grid-cols-4
          "
        >
          {/* Brand */}

          <div className="space-y-3">
            <h2 className="text-xl font-bold">GearUp</h2>

            <p className="text-sm text-muted-foreground">
              Rent agricultural equipment easily from trusted providers.
            </p>
          </div>

          {/* Navigation */}

          <div>
            <h3 className="mb-3 font-semibold">Explore</h3>

            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/" className="block hover:text-primary">
                Home
              </Link>

              <Link href="/gear" className="block hover:text-primary">
                Equipment
              </Link>

              <Link href="/category" className="block hover:text-primary">
                Categories
              </Link>
            </div>
          </div>

          {/* Support */}

          <div>
            <h3 className="mb-3 font-semibold">Support</h3>

            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="#" className="block hover:text-primary">
                Contact
              </Link>

              <Link href="#" className="block hover:text-primary">
                Privacy Policy
              </Link>

              <Link href="#" className="block hover:text-primary">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Social */}

          <div>
            <h3 className="mb-3 font-semibold">Follow Us</h3>

            <div className="flex gap-3">
              <Link
                href="#"
                className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                hover:bg-muted
                "
              >
                <FaFacebookF className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                hover:bg-muted
                "
              >
                <FaInstagram className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                hover:bg-muted
                "
              >
                <FaXTwitter className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="
          mt-8
          border-t
          pt-6
          text-center
          text-sm
          text-muted-foreground
          "
        >
          © {new Date().getFullYear()} GearUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
