import { create } from "zustand";
import { IUser } from "./types";

interface DataState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isMounted: boolean;
  setIsMounted: (isMounted: boolean) => void;
  isUser?: boolean;
  setIsUser?: (isUser: boolean) => void;
  isEditor?: boolean;
  setIsEditor?: (isEditor: boolean) => void;
  isAdmin?: boolean;
  setIsAdmin?: (isAdmin: boolean) => void;
}

export const useDataStore = create<DataState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isMounted: false,
  setIsMounted: (isMounted) => set({ isMounted }),
  isUser: false,
  setIsUser: (isUser) => set({ isUser }),
  isEditor: false,
  setIsEditor: (isEditor) => set({ isEditor }),
  isAdmin: false,
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));
