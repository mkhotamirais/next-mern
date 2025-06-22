"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductctStore } from "@/lib/productStore";
import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

export default function FilterProductsSearch() {
  const { open, setOpen, search, setSearch } = useProductctStore();

  const router = useRouter();
  const searchParam = useSearchParams();
  const urlParams = new URLSearchParams(searchParam.toString());

  const onSearch = useDebouncedCallback((e: string) => {
    if (e) {
      urlParams.set("productq", e);
    } else {
      urlParams.delete("productq");
    }
    router.push(`?${urlParams.toString()}`);
  }, 300);

  return (
    <div>
      <div className="flex mb-3 max-w-sm">
        <div className="flex gap-2 w-full">
          <Button size={"icon"} variant={"outline"} onClick={() => setOpen(!open)}>
            <Filter />
          </Button>
          <div className="relative">
            <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              id="search-products"
              name="search-products"
              placeholder="Cari"
              className="bg-accent pl-8"
              value={search}
              onChange={(e) => {
                onSearch(e.target.value);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
