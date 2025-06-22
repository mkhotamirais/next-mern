"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import DelProduct from "./DelProduct";
import Pending from "@/components/Pending";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import FilterProductSide from "./FilterProductSide";
import { useProductctStore } from "@/lib/productStore";
import CardProduct from "@/components/CardProduct";
import { useSearchParams } from "next/navigation";
import FilterProductsSearch from "./FilterProductsSearch";
import FilterProductsKeys from "./FilterProductsKeys";
import Pagination from "@/components/Pagination";

export default function Products() {
  const { products, getProducts, pendingProducts, total } = useProductctStore();

  const searchParams = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
  const productLimit = 10;

  useEffect(() => {
    if (!params.productlimit) {
      params.productlimit = productLimit.toString();
    }
    getProducts(params);
  }, [getProducts, params]);

  let content;
  if (products?.length === 0) content = <h1>No products found</h1>;
  if (products && products.length > 0) {
    content = (
      <>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 lg:gap-2">
          {products.map((product: IProduct) => (
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
        <Pagination totalData={total} perPage={productLimit} />
      </>
    );
  }

  return (
    <section className="min-h-y bg-secondary">
      <div className="py-8 bg-zinc-200 dark:bg-zinc-900">
        <div className="container">
          <h1 className="h1 mb-2">Products</h1>
          <FilterProductsSearch />
          <FilterProductsKeys />
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

      <div className="container pb-4">{pendingProducts ? <Pending /> : content}</div>
    </section>
  );
}
