import { create } from "zustand";
import { ICart } from "./types";

let initialItemIds: string[] = [];

if (typeof window !== "undefined") {
  const stored = localStorage.getItem("selectedItemIds");
  initialItemIds = stored ? JSON.parse(stored) : [];
}

interface CartStoreType {
  data: ICart[];
  setData: (data: ICart[]) => void;
  selectedItemIds: string[];
  setSelectedItemIds: (selectedItemIds: string[]) => void;
}

export const useCartStore = create<CartStoreType>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  selectedItemIds: initialItemIds || [],
  setSelectedItemIds: (selectedItemIds) => set({ selectedItemIds }),
}));
