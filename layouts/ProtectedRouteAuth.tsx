"use client";

import Pending from "@/components/Pending";
import { useDataStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRouteAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isMounted } = useDataStore();

  useEffect(() => {
    if (isMounted && user) router.replace("/");
  }, [isMounted, user, router]);

  if (!isMounted || user) return <Pending />;

  return <>{children}</>;
}
