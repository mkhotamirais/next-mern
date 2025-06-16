"use client";

import { Button } from "@/components/ui/button";
import { IOrder } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Orders() {
  const [data, setData] = useState<IOrder[]>([]);
  const [isShowDetail, setIsShowDetail] = useState<string | null>(null);

  const toggleDetail = (id: string) => {
    if (isShowDetail === id) {
      setIsShowDetail(null);
    } else {
      setIsShowDetail(id);
    }
  };

  const getData = async () => {
    try {
      const res = await axiosInstance.get("/user/orders");
      setData(res.data);
    } catch (error) {
      errMsg(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-card p-3 md:p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2 mb-4">Orders</h2>
        <div className="flex gap-2 flex-col">
          {data
            .sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString()))
            .map((order) => (
              <div key={order._id} className="bg-secondary rounded-md shadow-md p-2 text-sm">
                <p>Order ID: {order._id}</p>
                <p>Order Date: {new Date(order.createdAt).toDateString()}</p>
                <p>Order Status: {order.status}</p>
                <p className="mb-2 text-base font-bold">Total: {order.total}</p>
                {isShowDetail === order._id && (
                  <div>
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center mb-2">
                        <div className="w-1/3">{item.productId.name}</div>
                        <div className="w-1/3">{item.price}</div>
                        <div className="w-1/3">{item.qty}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant={"outline"} size={"sm"} onClick={() => toggleDetail(order._id)}>
                    {isShowDetail === order._id ? "Hide Details" : "Show Details"}
                  </Button>
                  <Link href={`/products/invoice/${order._id}`}>
                    <Button variant={"default"} size={"sm"}>
                      Invoice
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
