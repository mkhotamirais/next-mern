"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import DelProduct from "./DelProduct";
import Pending from "@/components/Pending";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import Image from "next/image";
import FilterProducts from "./FilterProducts";
import FilterProductSide from "./FilterProductSide";
import { useProductctStore } from "@/lib/productStore";

export default function Products() {
  const [data, setData] = useState([]);
  const [pendingData, setPendingData] = useState(false);
  const { params } = useProductctStore();

  const getProducts = useCallback(async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/public/product", {
        params,
      });
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  }, [params]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  let content;
  if (data.length === 0) content = <h1>No products found</h1>;
  if (data.length > 0) {
    content = (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-2">
        {data.map((product: IProduct) => (
          <div key={product._id} className="bg-card rounded-md shadow-md overflow-hidden">
            <Link href={`/products/show/${product._id}`}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={400}
                // fill
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-36 sm:h-72 lg:h-56 object-cover object-center"
                priority
              />
            </Link>
            <div className="p-3 space-y-2">
              <Link href={`/products/show/${product._id}`} className="hover:underline">
                <h3 className="h3">{product.name}</h3>
              </Link>
              <p className="text-2xl font-bold">Rp{product.price}</p>
              <div className="flex flex-wrap items-center gap-1">
                <div className="badge">{product?.category?.name || "category"}</div>
                <div>•</div>
                <div className="flex gap-1">
                  {product.tags.map((tag) => (
                    <div key={tag._id} className="badge">
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
              {/* <p className="text-sm text-muted-foreground">{product.description}</p> */}

              <ProtectedRoles roles={["admin", "editor"]}>
                <div className="flex gap-2">
                  <Link href={`/products/edit/${product._id}`} className="text-green-500">
                    Edit
                  </Link>
                  <DelProduct product={product} getProducts={getProducts} />
                </div>
              </ProtectedRoles>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="min-h-y bg-secondary">
      <div className="py-8 bg-zinc-200 dark:bg-zinc-900">
        <div className="container">
          <h1 className="h1 mb-2">Products</h1>
          <FilterProducts />
        </div>
      </div>
      <FilterProductSide />
      <div className="container py-4">
        <ProtectedRoles roles={["admin", "editor"]}>
          <Link href="/products/create">
            <Button>Create Product</Button>
          </Link>
        </ProtectedRoles>
      </div>
      <div className="container py-4">{pendingData ? <Pending /> : content}</div>
    </section>
  );
}
