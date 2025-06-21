"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import DelProduct from "./DelProduct";
import Pending from "@/components/Pending";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import FilterProducts from "./FilterProducts";
import FilterProductSide from "./FilterProductSide";
import { useProductctStore } from "@/lib/productStore";
import CardProduct from "@/components/CardProduct";

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 lg:gap-2">
        {data.map((product: IProduct) => (
          <CardProduct key={product._id} product={product}>
            <ProtectedRoles roles={["admin", "editor"]}>
              <div className="flex gap-2">
                <Link href={`/products/edit/${product._id}`} className="text-green-500">
                  Edit
                </Link>
                <DelProduct product={product} getProducts={getProducts} />
              </div>
            </ProtectedRoles>
          </CardProduct>
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
      <div className="container pb-4">{pendingData ? <Pending /> : content}</div>
    </section>
  );
}
