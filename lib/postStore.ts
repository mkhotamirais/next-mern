import { create } from "zustand";
import { IParams } from "./types";

interface IPostStore {
  params: IParams | null;
  setParams: (params: IParams | null) => void;
}

export const usePostStore = create<IPostStore>((set) => ({
  params: null,
  setParams: (params) => set({ params }),
}));
