import { create } from "zustand";
import { IAddress } from "./types";

interface CheckoutStoreType {
  address: IAddress;
  setAddress: (address: IAddress) => void;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
}

export const useCheckoutStore = create<CheckoutStoreType>((set) => ({
  address: {} as IAddress,
  setAddress: (address: IAddress) => set({ address }),
  selectedAddressId: "",
  setSelectedAddressId: (id: string) => set({ selectedAddressId: id }),
}));
