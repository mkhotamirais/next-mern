"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import { ICart } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import ProtectedRoles from "./ProtectedRoles";

export default function NavCart() {
  const { cartCount, setCartCount } = useCartStore();

  const getData = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/user/cart");

      const totalQty = res.data.items.reduce((sum: number, item: ICart) => sum + item.qty, 0);
      setCartCount(totalQty);
    } catch (error) {
      errMsg(error);
    }
  }, [setCartCount]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <ProtectedRoles roles={["user"]}>
      <Link href="/products/cart" className="relative">
        <span className="inline-block absolute -top-1 -right-1 rounded px-0.5 bg-foreground text-primary-foreground border text-xs">
          {cartCount}
        </span>
        <Button variant="outline" size="icon">
          <ShoppingCart />
        </Button>
      </Link>
    </ProtectedRoles>
  );
}
