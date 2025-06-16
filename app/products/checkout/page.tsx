"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import { ICart } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddressCheckout from "./AddressCheckout";
import { useCheckoutStore } from "@/lib/checkoutStore";
import { toast } from "sonner";

export default function Checkout() {
  const { data, setData, selectedItemIds, setSelectedItemIds, setCartCount } = useCartStore();
  const { address } = useCheckoutStore();
  const [items, setItems] = useState<ICart[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getSelectedItems = async () => {
      const selectedIds = searchParams.getAll("itemIds");

      try {
        const res = await axiosInstance.get("/user/cart");
        const filtered = res.data.items.filter((item: ICart) => selectedIds.includes(item._id));
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
      const selectedItemIdsToCheckout = items.map((item) => item._id); // karena itemIds adalah cart item _id

      const res = await axiosInstance.post("/user/orders", {
        selectedProductIds: items.map((item) => item.productId._id),
        address,
      });

      const updatedCart = data.filter((item) => !selectedItemIdsToCheckout.includes(item._id));
      setData(updatedCart);

      const updatedSelectedIds = selectedItemIds.filter((id) => !selectedItemIdsToCheckout.includes(id));
      setSelectedItemIds(updatedSelectedIds);
      localStorage.setItem("selectedItemIds", JSON.stringify(updatedSelectedIds));

      const newTotalQty = updatedCart.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(newTotalQty);

      toast.success("Checkout berhasil");
      router.push(`/products/invoice/${res.data.order._id}`);
    } catch (error) {
      errMsg(error);
    }
  };

  return (
    <section className="container py-6">
      <div className="max-w-xl">
        <h1 className="h1 mb-4">Checkout</h1>
        <AddressCheckout />
        <div>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <div>
                {item.productId.name} x {item.qty}
              </div>
              <div>Rp{item.productId.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
        {/* untuk payment method nanti */}
        <div>
          <div className="font-bold mt-4 mb-2">Total: Rp{total.toLocaleString()}</div>
          <Button onClick={handleBayarSekarang}>Bayar Sekarang</Button>
        </div>
      </div>
    </section>
  );
}
