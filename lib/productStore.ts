import { create } from "zustand";
import { IProduct, IProductcat, IProductQuery, IProducttag } from "./types";
import { axiosInstance, errMsg } from "./utils";

interface ProductStoreType {
  products: IProduct[] | null;
  total: number;
  pendingProducts: boolean;
  getProducts: (params?: IProductQuery) => Promise<void>;
  search: string;
  setSearch: (search: string) => void;
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
  products: [],
  total: 0,
  pendingProducts: false,
  getProducts: async (params) => {
    try {
      set({ pendingProducts: true });
      const res = await axiosInstance.get("/public/product", { params });
      set({ products: res.data.products, total: res.data.total });
    } catch (error) {
      errMsg(error);
    } finally {
      set({ pendingProducts: false });
    }
  },
  search: "",
  setSearch: (search) => set({ search }),
  open: false,
  setOpen: (open) => set({ open }),
  categories: null,
  setCategories: (categories) => set({ categories }),
  tags: null,
  setTags: (tags) => set({ tags }),
  selectedTags: [],
  setSelectedTags: (selectedTags) => set({ selectedTags }),
}));
