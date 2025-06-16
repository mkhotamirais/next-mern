"use client";

import Pending from "@/components/Pending";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/lib/types";
import { axiosInstance, capitalize, errMsg } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function Invoice() {
  const [data, setData] = useState<IOrder | null>(null);
  const [pendingData, setPendingData] = useState(false);

  const params = useParams();
  const { id } = params;

  const getData = useCallback(async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get(`/user/orders/${id}`);
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
    <section className="min-h-y py-4 bg-secondary">
      <div className="container">
        <h1 className="h1 mb-2">Invoice</h1>
        <article className="bg-card p-3 rounded-md *:leading-relaxed max-w-xl">
          <div className="mb-3">
            <p>OrderID: {data?._id}</p>
            <p>Order Date: {data?.createdAt ? new Date(data.createdAt).toDateString() : "Tanggal tidak tersedia"}</p>
            <p>Order Status: {data?.status}</p>
          </div>
          <div className="mb-3">
            <h2 className="h2">Shipping Address</h2>
            <div>
              {data?.address.fullAddress}, {capitalize(data?.address.village as string)}, Kec.{" "}
              {capitalize(data?.address?.district as string)}, {capitalize(data?.address?.regency as string)}, Prov.{" "}
              {capitalize(data?.address?.province as string)}, {data?.address?.postalCode}
            </div>
          </div>
          <div className="mb-3">
            <h2 className="h2">Order Items</h2>
            {data?.items.map((item) => (
              <div key={item._id}>
                {item.productId.name} x {item.qty} = Rp {item.productId.price * item.qty}
              </div>
            ))}
          </div>
          <div>
            <h2 className="h2">Total: Rp {data?.total}</h2>
          </div>
          {/* later download invoice pdf */}
        </article>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button>Download Invoice</Button>
          <Link href="/products">
            <Button variant={"outline"}>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
