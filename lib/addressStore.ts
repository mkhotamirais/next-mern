import { create } from "zustand";

export type TOption = { value: string; label: string };

interface AddressStoreType {
  provinces: TOption[];
  setProvinces: (data: TOption[]) => void;
  pendingProvince: boolean;
  setPendingProvince: (data: boolean) => void;
  regencies: TOption[];
  setRegencies: (data: TOption[]) => void;
  districts: TOption[];
  setDistricts: (data: TOption[]) => void;
  villages: TOption[];
  setVillages: (data: TOption[]) => void;
}

export const useAddressStore = create<AddressStoreType>((set) => ({
  provinces: [],
  setProvinces: (data) => set({ provinces: data }),
  pendingProvince: false,
  setPendingProvince: (data) => set({ pendingProvince: data }),
  regencies: [],
  setRegencies: (data) => set({ regencies: data }),
  districts: [],
  setDistricts: (data) => set({ districts: data }),
  villages: [],
  setVillages: (data) => set({ villages: data }),
}));
