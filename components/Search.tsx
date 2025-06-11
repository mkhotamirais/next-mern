"use client";

import React, { useState } from "react";
import { axiosInstance, errMsg } from "@/lib/utils";
import { IPost, IProduct } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";

const resultLink = "block mb-0.5 text-sm font-medium py-2 px-3 bg-black/10 hover:bg-black/15 rounded-md";

export default function Search() {
  const [data, setData] = useState<{ posts: IPost[]; products: IProduct[] } | null>(null);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setData(null);
    setKeyword("");
    // if (isOpen) {
    //   setData(null);
    // } else {
    //   setData(null);
    // }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    setKeyword(searchQuery);
    try {
      setPending(true);
      const res = await axiosInstance.get("/search", { params: { q: searchQuery } });
      if (searchQuery) {
        setData(res.data);
      } else {
        setData(null);
      }
    } catch (error) {
      errMsg(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white bg-black/20 border-none pt-2 pb-4 px-4 shadow-none [&>button]:hidden">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <form onSubmit={onSubmit} className="flex gap-1">
            <Input type="text" placeholder="cari" name="search" />
            <Button type="submit">
              <SearchIcon />
            </Button>
          </form>
          {keyword && (
            <>
              {pending ? (
                <p className="text-sm mt-2">Loading...</p>
              ) : (
                <>
                  <p className="py-1 text-sm">
                    Results for <i>{keyword}</i>
                  </p>
                  {data?.posts.length || data?.products.length ? (
                    <div className="mt-4 space-y-2 max-h-y overflow-y-scroll [&::-webkit-scrollbar]:hidden">
                      {data?.posts.length ? (
                        <div>
                          <h3 className="text-sm italic mb-1">Results From Posts</h3>
                          <div>
                            {data?.posts.map((item, i) => (
                              <DialogClose key={i} asChild>
                                <Link href={`/posts/show/${item._id}`} key={i} className={resultLink}>
                                  {item.title}
                                </Link>
                              </DialogClose>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {data?.products.length ? (
                        <div>
                          <h3 className="text-sm italic mb-1">Results From Products</h3>
                          <div>
                            {data?.products.map((item, i) => (
                              <DialogClose key={i} asChild>
                                <Link href={`/posts/show/${item._id}`} key={i} className={resultLink}>
                                  {item.name}
                                </Link>
                              </DialogClose>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div>No result found</div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
