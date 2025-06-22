"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProductctStore } from "@/lib/productStore";
import { axiosInstance, errMsg } from "@/lib/utils";
import { IProductcat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterProductSide() {
  const { open, setOpen, categories, setCategories, tags, setTags } = useProductctStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParams = new URLSearchParams(searchParams.toString());
  const params = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

  const getCategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/public/productcat");
      setCategories(res.data);
    } catch (error) {
      errMsg(error);
    }
  }, [setCategories]);

  const getTags = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/public/producttag");
      setTags(res.data);
    } catch (error) {
      errMsg(error);
    }
  }, [setTags]);

  useEffect(() => {
    getCategories();
    getTags();
  }, [getCategories, getTags]);

  const onProductCategory = (cat: IProductcat) => {
    urlParams.set("productcategory", cat._id);
    router.push(`?${urlParams.toString()}`);
  };

  const onRemoveProductCategory = () => {
    urlParams.delete("productcategory");
    router.push(`?${urlParams.toString()}`);
  };

  const onProductTags = (tag: IProductcat) => {
    const currentTags = urlParams.get("producttags")?.split(",") ?? [];

    const isSelected = currentTags.includes(tag._id);
    const updatedTags = isSelected ? currentTags.filter((id) => id !== tag._id) : [...currentTags, tag._id];

    if (updatedTags.length > 0) {
      urlParams.set("producttags", updatedTags.join(","));
    } else {
      urlParams.delete("producttags");
    }

    router.push(`?${urlParams.toString()}`);
  };

  const onResetProductTags = () => {
    urlParams.delete("producttags");
    router.push(`?${urlParams.toString()}`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription className="hidden"></SheetDescription>
        </SheetHeader>
        <div className="px-3">
          <div className="mb-4">
            <h3 className="h3 mb-2">Category</h3>
            <div className="flex flex-wrap gap-1">
              <Button variant={"outline"} size={"sm"} onClick={onRemoveProductCategory}>
                Reset
              </Button>
              {categories?.map((cat: IProductcat) => (
                <Button
                  variant={params?.productcategory === cat._id ? "default" : "outline"}
                  size={"sm"}
                  key={cat._id}
                  className="btn btn-outline btn-xs"
                  onClick={() => onProductCategory(cat)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="h3 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              <Button variant={"outline"} size={"sm"} onClick={onResetProductTags}>
                Reset
              </Button>
              {tags?.map((tag: IProductcat) => (
                <Button
                  variant={params?.producttags?.includes(tag._id) ? "default" : "outline"}
                  size={"sm"}
                  key={tag._id}
                  className="btn btn-outline btn-xs"
                  onClick={() => onProductTags(tag)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
