"use client";

import { useProductctStore } from "@/lib/productStore";
import { IProducttag } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function FilterProductsKeys() {
  const { setSearch, categories, tags } = useProductctStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
  const urlParams = new URLSearchParams(searchParams.toString());

  const onDeleteProductq = () => {
    urlParams.delete("productq");
    setSearch("");
    router.push(`?${urlParams.toString()}`);
  };

  const onDeleteProductCategory = () => {
    urlParams.delete("productcategory");
    setSearch("");
    router.push(`?${urlParams.toString()}`);
  };

  const onDeleteProductTag = (tag: IProducttag) => {
    const currentTags = urlParams.get("producttags")?.split(",") ?? [];

    const updatedTags = currentTags.filter((id) => id !== tag._id);

    if (updatedTags.length > 0) {
      urlParams.set("producttags", updatedTags.join(","));
    } else {
      urlParams.delete("producttags");
    }

    router.push(`?${urlParams.toString()}`);
  };

  const productq = params?.productq;

  let paramCategoryName;
  if (params.productcategory) {
    paramCategoryName = categories?.find((cat) => cat._id === params?.productcategory)?.name;
  }

  let paramTagNames;
  if (params.producttags) {
    paramTagNames = tags
      ?.filter((tag) => params?.producttags?.includes(tag._id))
      ?.map((tag) => {
        return tag;
      });
  }

  return (
    <div>
      {Object.keys(params).length ? (
        <div className="flex items-center gap-1">
          <span className="text-sm">Result for :</span>
          {productq && (
            <button type="button" onClick={onDeleteProductq} className="badge">
              {productq}
              <span className="ml-1 text-red-500">x</span>
            </button>
          )}

          {paramCategoryName && (
            <button type="button" onClick={onDeleteProductCategory} className="badge">
              {paramCategoryName}
              <span className="ml-1 text-red-500">x</span>
            </button>
          )}

          {paramTagNames?.map((tag) => (
            <button type="button" key={tag._id} onClick={() => onDeleteProductTag(tag)} className="badge">
              {tag.name}
              <span className="ml-1 text-red-500">x</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
