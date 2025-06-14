"use client";

import Pending from "@/components/Pending";
import { IProduct } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import AddToCart from "./AddToCart";

export default function ShowProduct() {
  const [data, setData] = useState<IProduct | null>(null);
  const [pendingData, setPendingData] = useState(false);
  const params = useParams();
  const { id } = params;

  const getData = useCallback(async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get(`/product/${id}`);
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (pendingData) return <Pending />;

  return (
    <section className="bg-secondary min-h-y py-8">
      <div className="container">
        <div className="flex gap-6">
          <div className="w-1/2">
            <Image
              src={data?.imageUrl || "/logo-mkhotami.png"}
              alt={data?.name || "product"}
              width={800}
              height={800}
              className="border object-cover object-center rounded-md"
            />
          </div>
          <div className="w-1/2 bg-card p-6 rounded-md shadow-md space-y-4">
            <h1 className="h1">{data?.name}</h1>
            <p className="text-2xl font-bold">Rp{data?.price}</p>
            <div className="flex flex-wrap items-center gap-1">
              <div className="badge">{data?.category?.name || "category"}</div>
              <div>•</div>
              <div className="flex gap-1">
                {data?.tags.map((tag) => (
                  <div key={tag._id} className="badge">
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{data?.description}</p>
            <AddToCart productId={data?._id || ""} />
          </div>
        </div>
      </div>
    </section>
  );
}
