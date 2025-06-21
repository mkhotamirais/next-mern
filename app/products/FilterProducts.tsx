"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductctStore } from "@/lib/productStore";
import { IProductcat } from "@/lib/types";
import { Filter, Search } from "lucide-react";
import React, { FormEvent } from "react";

export default function FilterProducts() {
  const { open, setOpen, params, setParams, categories, tags, selectedTags, setSelectedTags } = useProductctStore();

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = (e.target as HTMLFormElement).search.value;
    setParams({ ...params, q: searchQuery });
  };

  let paramCategoryName;
  if (params?.category) {
    paramCategoryName = categories?.find((cat) => cat._id === params?.category)?.name;
  }

  let paramTagNames;
  if (selectedTags?.length) {
    paramTagNames = tags
      ?.filter((tag) => selectedTags?.includes(tag._id))
      ?.map((tag) => {
        return tag;
      });
  }

  const onTag = (tag: IProductcat) => {
    const isSelected = selectedTags?.includes(tag._id);
    const updatedTags = isSelected ? selectedTags?.filter((id) => id !== tag._id) : [...selectedTags, tag._id];

    setSelectedTags(updatedTags);
    setParams({ ...params, tags: updatedTags.length ? updatedTags.join(",") : undefined });
  };

  return (
    <div>
      <div className="flex mb-3 max-w-sm">
        <div className="flex gap-2 w-full">
          <Button size={"icon"} variant={"outline"} onClick={() => setOpen(!open)}>
            <Filter />
          </Button>
          <form onSubmit={onSearch} className="flex items-center relative grow">
            <div className="text-muted-foreground absolute left-0 h-full flex items-center pl-2">
              <Search size={18} />
            </div>
            <Input type="text" id="search" name="search" placeholder="Cari" className="bg-accent pl-8" />
          </form>
        </div>
      </div>
      {(paramCategoryName || params?.q || paramTagNames) && (
        <div className="flex items-center gap-1">
          Result for :
          {paramCategoryName && (
            <button type="button" onClick={() => setParams({ ...params, category: "" })} className="badge">
              {paramCategoryName}
              <span className="ml-1 text-red-500">x</span>
            </button>
          )}
          {params?.q && (
            <button type="button" onClick={() => setParams({ ...params, q: "" })} className="badge">
              {params?.q}
              <span className="ml-1 text-red-500">x</span>
            </button>
          )}
          {paramTagNames?.map((tag) => (
            <button type="button" key={tag._id} onClick={() => onTag(tag)} className="badge">
              {tag.name}
              <span className="ml-1 text-red-500">x</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
