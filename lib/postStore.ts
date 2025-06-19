import { create } from "zustand";
import { IParams } from "./types";

interface IPostStore {
  params: IParams;
  setParams: (params: IParams) => void;
}

export const usePostStore = create<IPostStore>((set) => ({
  params: {},
  setParams: (params) => set({ params }),
}));
