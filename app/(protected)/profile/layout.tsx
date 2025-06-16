"use client";

import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRouteRoles authorizedRoles={["user", "editor", "admin"]}>
      <section className="min-h-y py-4 bg-secondary">
        <div className="container">
          <div className="max-w-xl">
            <div className="mb-4">
              <h1 className="h1">Profile</h1>
            </div>
            <div className="flex gap-1 mb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <Link href={"/profile"}>
                <Button variant={pathname === "/profile" ? "default" : "link"}>User Profile</Button>
              </Link>
              <Link href={"/profile/address"}>
                <Button variant={pathname.startsWith("/profile/address") ? "default" : "link"}>User Address</Button>
              </Link>
              <Link href={"/profile/orders"}>
                <Button variant={pathname.startsWith("/profile/orders") ? "default" : "link"}>Orders</Button>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
