"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DelProduct from "./DelProduct";
import Pending from "@/components/Pending";
import ProtectedRoles from "@/layouts/ProtectedRoles";

export default function Products() {
  const [data, setData] = useState([]);
  const [pendingData, setPendingData] = useState(false);

  const getProducts = async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/product");
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  let content;
  if (data.length === 0) content = <h1>No products found</h1>;
  if (data.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((product: IProduct) => (
          <div key={product._id} className="bg-card p-6 rounded-md shadow-md">
            <Link href={"/products/show/" + product._id} className="hover:underline">
              <h3 className="h3">{product.name}</h3>
            </Link>
            <h4>{product.price}</h4>
            <p>{product.description}</p>
            <p>{product.category.name}</p>
            <p>{product.tags.map((tag) => tag.name).join(", ")}</p>
            <ProtectedRoles roles={["admin", "editor"]}>
              <div className="flex gap-2">
                <Link href={`/products/edit/${product._id}`} className="text-green-500">
                  Edit
                </Link>
                <DelProduct product={product} getProducts={getProducts} />
              </div>
            </ProtectedRoles>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="min-h-y bg-secondary">
      <div className="py-8 bg-gray-200">
        <div className="container">
          <h1 className="h1 mb-2">Products</h1>
        </div>
      </div>
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
