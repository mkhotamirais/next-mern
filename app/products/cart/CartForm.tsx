import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { ICart } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { Trash } from "lucide-react";
import React, { useState } from "react";

interface CartFormProps {
  item: ICart;
  onDeleteCartItem: (id: string) => void;
}

export default function CartForm({ item, onDeleteCartItem }: CartFormProps) {
  const { data, setData } = useCartStore();
  const [editedQty, setEditedQty] = useState<{ [key: string]: number }>({});

  const onEditQty = async (productId: string, qtyChange: number) => {
    try {
      await axiosInstance.post("/cart", { productId, qty: qtyChange });

      setData(data.map((item) => (item.productId._id === productId ? { ...item, qty: item.qty + qtyChange } : item)));
    } catch (error) {
      errMsg(error);
    }
  };

  const onSubmitQty = async (e: React.FormEvent<HTMLFormElement>, productId: string, itemId: string) => {
    e.preventDefault();
    const qty = Number((e.target as HTMLFormElement).qty.value);

    try {
      await axiosInstance.post("/cart", { productId, qty });

      setData(data.map((item) => (item._id === itemId ? { ...item, qty } : item)));
      setEditedQty((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    } catch (error) {
      errMsg(error);
    }
  };

  return (
    <form onSubmit={(e) => onSubmitQty(e, item.productId._id, item._id)} className="flex gap-1 mt-2 sm:mt-0">
      <Button
        variant={item.qty === 1 ? "destructive" : "default"}
        type="button"
        size={"icon"}
        onClick={() => {
          if (item.qty === 1) {
            onDeleteCartItem(item._id);
          } else {
            onEditQty(item.productId._id, -1);
          }
        }}
        aria-label={item.qty === 1 ? "Delete Cart Item" : "Reduce Cart Item"}
      >
        {item.qty === 1 ? <Trash /> : "-"}
      </Button>
      <Input
        name="qty"
        value={editedQty[item._id] ?? item.qty}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value)) {
            setEditedQty((prev) => ({
              ...prev,
              [item._id]: value,
            }));
          }
        }}
        type="number"
        className="w-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button type="button" size={"icon"} onClick={() => onEditQty(item.productId._id, 1)}>
        +
      </Button>
    </form>
  );
}
