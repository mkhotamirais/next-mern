"use client";

import Pending from "@/components/Pending";
import { useDataStore } from "@/lib/store";
import { TRoles } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteRolesProps {
  children: React.ReactNode;
  authorizedRoles: TRoles[];
}

export default function ProtectedRouteRoles({ children, authorizedRoles }: ProtectedRouteRolesProps) {
  const router = useRouter();
  const { user, isMounted } = useDataStore();

  const isAuthorized = user && authorizedRoles.includes(user.role as TRoles);

  useEffect(() => {
    if (isMounted && !isAuthorized) {
      router.replace("/");
    }
  }, [isMounted, isAuthorized, router]);

  if (!isMounted || !isAuthorized) return <Pending />;

  return <>{children}</>;
}
