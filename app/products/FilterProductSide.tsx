"use client";

import React, { useCallback, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProductctStore } from "@/lib/productStore";
import { axiosInstance, errMsg } from "@/lib/utils";
import { IProductcat } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function FilterProductSide() {
  const { open, setOpen, params, setParams, categories, setCategories, tags, setTags, selectedTags, setSelectedTags } =
    useProductctStore();

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

  const onCategory = (cat: IProductcat) => {
    setParams({ ...params, category: cat._id });
  };

  const onTag = (tag: IProductcat) => {
    const isSelected = selectedTags?.includes(tag._id);
    const updatedTags = isSelected ? selectedTags?.filter((id) => id !== tag._id) : [...selectedTags, tag._id];

    setSelectedTags(updatedTags);
    setParams({ ...params, tags: updatedTags.length ? updatedTags.join(",") : undefined });
  };

  const onResetTags = () => {
    setSelectedTags([]);
    setParams({ ...params, tags: undefined });
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
              <Button variant={"outline"} size={"sm"} onClick={() => setParams({ ...params, category: "" })}>
                Reset
              </Button>
              {categories?.map((cat: IProductcat) => (
                <Button
                  variant={params?.category === cat._id ? "default" : "outline"}
                  size={"sm"}
                  key={cat._id}
                  className="btn btn-outline btn-xs"
                  onClick={() => onCategory(cat)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="h3 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              <Button variant={"outline"} size={"sm"} onClick={onResetTags}>
                Reset
              </Button>
              {tags?.map((tag: IProductcat) => (
                <Button
                  variant={params?.tags?.includes(tag._id) ? "default" : "outline"}
                  size={"sm"}
                  key={tag._id}
                  className="btn btn-outline btn-xs"
                  onClick={() => onTag(tag)}
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
