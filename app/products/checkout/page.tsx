"use client";

import { Button } from "@/components/ui/button";
import { ICart } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Checkout() {
  const [items, setItems] = useState<ICart[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getSelectedItems = async () => {
      const selectedIds = searchParams.getAll("productIds");

      try {
        const res = await axiosInstance.get("/cart");
        const filtered = res.data.items.filter((item: ICart) => selectedIds.includes(item.productId._id));
        setItems(filtered);
      } catch (error) {
        errMsg(error);
      }
    };

    getSelectedItems();
  }, [searchParams]);

  const total = items.reduce((sum, item) => sum + item.productId.price * item.qty, 0);

  const handleBayarSekarang = async () => {
    try {
      const selectedProductIds = items.map((item) => item.productId._id);

      await axiosInstance.post("/orders", {
        selectedProductIds,
        // sementara tanpa address dan paymentMethod
        // address: "Alamat pengiriman",
        // paymentMethod: "cod",
      });

      alert("Berhasil checkout!");
      router.push("/products/orders");
    } catch (error) {
      errMsg(error);
    }
  };
  return (
    <section className="container py-6">
      <h1 className="h1 mb-4">Checkout</h1>
      {items.map((item) => (
        <div key={item._id} className="flex justify-between items-center border-b py-2">
          <div>
            {item.productId.name} x {item.qty}
          </div>
          <div>Rp{item.productId.price.toLocaleString()}</div>
        </div>
      ))}
      <div className="font-bold mt-4">Total: Rp{total.toLocaleString()}</div>
      <Button onClick={handleBayarSekarang}>Bayar Sekarang</Button>
    </section>
  );
}
