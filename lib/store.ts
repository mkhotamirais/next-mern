import { create } from "zustand";
import { IUser } from "./types";

interface DataState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isMounted: boolean;
  setIsMounted: (isMounted: boolean) => void;
}

export const useDataStore = create<DataState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isMounted: false,
  setIsMounted: (isMounted) => set({ isMounted }),
}));
