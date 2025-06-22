import { create } from "zustand";
import { IPost, IPostQuery } from "./types";
import { axiosInstance, errMsg } from "./utils";

interface IPostStore {
  posts: IPost[] | null;
  pendingPosts: boolean;
  getPosts: (params?: IPostQuery) => Promise<void>;
}

export const usePostStore = create<IPostStore>((set) => ({
  posts: null,
  pendingPosts: false,
  getPosts: async (params) => {
    try {
      set({ pendingPosts: true });
      const res = await axiosInstance.get("/public/post", { params });
      set({ posts: res.data.posts });
    } catch (error) {
      errMsg(error);
    } finally {
      set({ pendingPosts: false });
    }
  },
}));
