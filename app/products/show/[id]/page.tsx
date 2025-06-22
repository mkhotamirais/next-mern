"use client";

import Pending from "@/components/Pending";
import { IProduct } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import AddToCart from "./AddToCart";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import Link from "next/link";
import DelProduct from "../../DelProduct";
import { useProductctStore } from "@/lib/productStore";

export default function ShowProduct() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [pendingProduct, setPendingProduct] = useState(false);
  const { getProducts } = useProductctStore();
  const params = useParams();
  const { id } = params;

  const getProduct = useCallback(async () => {
    try {
      setPendingProduct(true);
      const res = await axiosInstance.get(`/public/product/${id}`);
      setProduct(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingProduct(false);
    }
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  if (pendingProduct) return <Pending />;
  if (!product) return <h1>Product not found</h1>;

  return (
    <section className="bg-secondary min-h-y py-8">
      <div className="container">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Image
              src={product?.imageUrl || "/logo-mkhotami.png"}
              alt={product?.name || "product"}
              width={800}
              height={800}
              className="object-cover object-center rounded-md"
            />
          </div>
          <div className="w-full sm:w-1/2 bg-card p-6 rounded-md shadow-md space-y-4">
            <h1 className="h1">{product?.name}</h1>
            <p className="text-2xl font-bold">Rp{product?.price}</p>
            <div className="flex flex-wrap items-center gap-1">
              <div className="badge">{product?.category?.name || "category"}</div>
              <div>•</div>
              <div className="flex gap-1">
                {product?.tags.map((tag) => (
                  <div key={tag._id} className="badge">
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{product?.description}</p>
            <ProtectedRoles roles={["user"]}>
              <AddToCart productId={product?._id || ""} />
            </ProtectedRoles>
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
      </div>
    </section>
  );
}
