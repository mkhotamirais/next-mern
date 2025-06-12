import { create } from "zustand";
import { IParams, IProductcat, IProducttag } from "./types";

interface ProductStoreType {
  params: IParams | null;
  setParams: (params: IParams | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: IProductcat[] | null;
  setCategories: (categories: IProductcat[] | null) => void;
  tags: IProducttag[] | null;
  setTags: (tags: IProducttag[] | null) => void;
  selectedTags: string[];
  setSelectedTags: (selectedTags: string[]) => void;
}

export const useProductctStore = create<ProductStoreType>((set) => ({
  params: null,
  setParams: (params) => set({ params }),
  open: false,
  setOpen: (open) => set({ open }),
  categories: null,
  setCategories: (categories) => set({ categories }),
  tags: null,
  setTags: (tags) => set({ tags }),
  selectedTags: [],
  setSelectedTags: (selectedTags) => set({ selectedTags }),
}));
