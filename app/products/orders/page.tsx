"use client";

import { IOrder } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Orders() {
  const [data, setData] = useState<IOrder[]>([]);
  const getData = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      console.log(res);
      setData(res.data);
    } catch (error) {
      errMsg(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="min-h-y py-4">
      <div className="container">
        <h1 className="h1">Orders</h1>
        <div>
          {data.map((order) => (
            <div key={order._id} className="bg-card rounded-md shadow-md p-4 mb-4">
              <p className="mb-2">Order ID: {order._id}</p>
              <p className="mb-2">Order Date: {new Date(order.createdAt).toDateString()}</p>
              <p className="mb-2">Order Status: {order.status}</p>
              <div>
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center mb-2">
                    <div className="w-1/3">{item.productId.name}</div>
                    <div className="w-1/3">{item.price}</div>
                    <div className="w-1/3">{item.qty}</div>
                  </div>
                ))}
              </div>
              <p className="mb-2">Total: {order.total}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
