"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { ICart } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  productId: string;
}

export default function AddToCart({ productId }: Props) {
  const { selectedItemIds, setSelectedItemIds, setCartCount } = useCartStore();
  const [qty, setQty] = useState(0);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const res = await axiosInstance.post("/user/cart", { productId, qty });
      toast.success("Product added to cart");
      setQty(0);
      let id;
      res.data.items.forEach((item: ICart) => {
        if (item.productId._id === productId) {
          id = item._id;
        }
      });

      if (id) {
        setSelectedItemIds([...selectedItemIds, id]);
      }
      const totalQty = res.data.items.reduce((sum: number, item: ICart) => sum + item.qty, 0);
      setCartCount(totalQty);

      router.push("/products/cart");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-1 max-w-36 mb-2">
          <Button type="button" onClick={() => setQty(qty > 0 ? qty - 1 : 0)}>
            -
          </Button>
          <Input
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value))}
            type="number"
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button type="button" onClick={() => setQty(qty + 1)}>
            +
          </Button>
        </div>
        <Button type="submit" disabled={!qty || pending}>
          {pending ? <Loader2 /> : <ShoppingCart />}
          Add to cart
        </Button>
      </form>
    </div>
  );
}
