"use client";

import { useDataStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isMounted } = useDataStore();

  useEffect(() => {
    if (isMounted && !user) {
      router.replace("/");
    }
  }, [isMounted, user, router]);

  if (!isMounted) return null;

  if (user) return <>{children}</>;

  return <div className="container">loading..</div>;
}
