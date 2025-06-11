"use client";

import { useDataStore } from "@/lib/store";
import { TRoles } from "@/lib/types";
import React from "react";

interface ProtectedRolesProps {
  children: React.ReactNode;
  roles: TRoles[];
}

export default function ProtectedRoles({ children, roles }: ProtectedRolesProps) {
  const { user } = useDataStore();
  if (user && roles.includes(user?.role as TRoles)) return <>{children}</>;
  return null;
}
