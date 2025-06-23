"use client";

import React, { useEffect, useState } from "react";
import { axiosInstance, errMsg, formatRupiah } from "@/lib/utils";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

const resultLink = "block mb-0.5 text-sm font-medium py-2 px-3 bg-black/10 hover:bg-black/15 rounded-md";
const resultTitle = "mb-1 sticky top-0 text-sm italic pb-1 bg-background/80 text-primary px-3 rounded";

export default function Search() {
  const [data, setData] = useState<{ posts: IPost[]; products: IProduct[] } | null>(null);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const onSearch = useDebouncedCallback((e: string) => {
    if (e) {
      params.set("search", e);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, 500);

  const getData = async (par: { search?: string }) => {
    try {
      setPending(true);
      const res = await axiosInstance.get("/search/search", { params: par });
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPending(false);
    }
  };

  const search = searchParams.get("search");
  useEffect(() => {
    const params: { search?: string } = {};
    if (search) params.search = search;
    getData(params);
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white bg-black/20 border-none pt-2 pb-4 px-4 shadow-none [&>button]:hidden max-h-[70vh]">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="cari"
              name="search"
              className="pl-10"
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          {search && (
            <>
              {pending ? (
                <p className="text-sm mt-2">Loading...</p>
              ) : (
                <>
                  <p className="py-1 text-sm">
                    Results for <i>{search}</i>
                  </p>
                  {data?.posts.length || data?.products.length ? (
                    <div className="border-t rounded relative mt-4 max-h-[50vh] space-y-2 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
                      {data?.products.length ? (
                        <div className="flex flex-col">
                          <h3 className={resultTitle}>Results From Products</h3>
                          <div>
                            {data?.products.map((item, i) => (
                              <DialogClose key={i} asChild>
                                <Link
                                  href={`/products/show/${item._id}`}
                                  key={i}
                                  className={`${resultLink} flex justify-between gap-2 items-center`}
                                >
                                  <div className="flex gap-1 items-center">
                                    <Image
                                      src={item?.imageUrl || "/logo-warungota.png"}
                                      alt={item.name}
                                      width={20}
                                      height={20}
                                      className={`${item?.imageUrl ? "" : "dark:invert"} rounded-xs size-6`}
                                    />
                                    <h4>{item.name}</h4>
                                  </div>
                                  <div>{formatRupiah(item.price)}</div>
                                </Link>
                              </DialogClose>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {data?.posts.length ? (
                        <div>
                          <h3 className={resultTitle}>Results From Posts</h3>
                          <div>
                            {data?.posts.map((item, i) => (
                              <DialogClose key={i} asChild>
                                <Link
                                  href={`/posts/show/${item._id}`}
                                  key={i}
                                  className={`${resultLink} flex items-center gap-1`}
                                >
                                  <Image
                                    src={item?.imageUrl || "/logo-warungota.png"}
                                    alt={item.title}
                                    width={20}
                                    height={20}
                                    className={`${item?.imageUrl ? "" : "dark:invert"} rounded-xs size-6`}
                                  />
                                  <span>{item.title}</span>
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
