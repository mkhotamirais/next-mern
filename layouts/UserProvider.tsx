"use client";

import Pending from "@/components/Pending";
import { useDataStore } from "@/lib/store";
import { axiosInstance } from "@/lib/utils";
import React, { useEffect } from "react";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { setUser, isMounted, setIsMounted } = useDataStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/common/account");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsMounted(true);
      }
    };
    fetchUser();
  }, [setUser, setIsMounted]);

  if (!isMounted) return <Pending />;
  return <>{children}</>;
}
