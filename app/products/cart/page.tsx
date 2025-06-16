"use client";

import Pending from "@/components/Pending";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import { axiosInstance, errMsg } from "@/lib/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CartForm from "./CartForm";
import Link from "next/link";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { ICart } from "@/lib/types";

export default function Cart() {
  const { data, setData, selectedItemIds, setSelectedItemIds, setCartCount } = useCartStore();
  const [pendingData, setPendingData] = useState(false);

  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("selectedItemIds", JSON.stringify(selectedItemIds));
  }, [selectedItemIds]);

  const getData = useCallback(async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/user/cart");
      setData(res.data.items);
      const totalQty = res.data.items.reduce((sum: number, item: ICart) => sum + item.qty, 0);

      setCartCount(totalQty);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  }, [setData, setCartCount]);

  const onDeleteCartItem = async (itemId: string) => {
    try {
      const res = await axiosInstance.delete(`/user/cart/${itemId}`);
      setData(data.filter((item) => item._id !== itemId));
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
      const totalQty = res.data.items.reduce((sum: number, item: ICart) => sum + item.qty, 0);
      setCartCount(totalQty);
    } catch (error) {
      errMsg(error);
    }
  };

  const onDeleteSelectedCart = async () => {
    try {
      await axiosInstance.post("/user/cart/delete-selected", { itemIds: selectedItemIds });
      setData(data.filter((item) => !selectedItemIds.includes(item._id)));
      setSelectedItemIds([]);
    } catch (error) {
      errMsg(error);
    }
  };

  const totalPrice = useMemo(() => {
    return data.reduce((sum, item) => {
      if (selectedItemIds.includes(item._id)) {
        return sum + item.productId.price * item.qty;
      }
      return sum;
    }, 0);
  }, [data, selectedItemIds]);

  const handleCheckout = () => {
    if (selectedItemIds.length === 0) {
      alert("Pilih setidaknya satu produk untuk checkout.");
      return;
    }

    const params = new URLSearchParams();
    selectedItemIds.forEach((id) => params.append("itemIds", id));
    router.push(`/products/checkout?${params.toString()}`);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  if (pendingData) return <Pending />;

  return (
    <ProtectedRouteRoles authorizedRoles={["user"]}>
      <section className="bg-secondary min-h-y py-4">
        <div className="container">
          <div className="max-w-xl">
            <h1 className="h1 mb-4">Cart</h1>
            {data.length === 0 ? (
              <div className="space-y-2">
                <p className="text-muted-foreground">Keranjang belanja kosong.</p>
                <Link href="/products">
                  <Button>Belanja Sekarang</Button>
                </Link>
              </div>
            ) : (
              <div>
                {data.map((item) => (
                  <div key={item._id} className="flex mb-2 bg-card rounded-md overflow-hidden">
                    <div className="flex flex-col m-3 justify-between">
                      <input
                        aria-label="Select Cart Item"
                        type="checkbox"
                        checked={selectedItemIds.includes(item._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedItemIds(
                            checked ? [...selectedItemIds, item._id] : selectedItemIds.filter((id) => id !== item._id)
                          );
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onDeleteCartItem(item._id)}
                        aria-label="Delete Cart Item"
                      >
                        <Trash />
                      </Button>
                    </div>
                    <div className="flex w-full">
                      <Link href={`/products/show/${item.productId._id}`} className="block w-36 h-full">
                        <Image
                          src={item.productId?.imageUrl}
                          alt={item.productId.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover object-center"
                        />
                      </Link>
                      <div className="flex flex-col p-3 w-full">
                        <Link href={`/products/show/${item.productId._id}`} className="hover:underline">
                          <h3 className="grow h3">{item.productId.name}</h3>
                        </Link>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                          <p>Rp{item.productId.price}</p>
                          <CartForm item={item} onDeleteCartItem={onDeleteCartItem} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-secondary py-2 sticky bottom-0">
                  <div className="bg-card p-3 rounded-md grid grid-cols-2">
                    <div className="flex flex-col justify-between items-start">
                      <div className="flex items-center gap-2">
                        <input
                          id="select-all"
                          type="checkbox"
                          checked={selectedItemIds.length === data.length && data.length > 0}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              const allIds = data.map((item) => item._id);
                              setSelectedItemIds(allIds);
                            } else {
                              setSelectedItemIds([]);
                            }
                          }}
                        />
                        <label htmlFor="select-all" className="text-sm">
                          Select All
                        </label>
                      </div>
                      <Button
                        onClick={onDeleteSelectedCart}
                        disabled={selectedItemIds.length === 0}
                        size="sm"
                        variant="destructive"
                        className="text-xs"
                      >
                        Delete Selected
                      </Button>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm">Total Rp{totalPrice.toLocaleString("id-ID")}</p>
                      <Button onClick={handleCheckout} className="w-full mt-4" disabled={selectedItemIds.length === 0}>
                        Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
