"use client";

import { IProduct } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

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
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setPendingData(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (pendingData) return <h1>Loading...</h1>;

  return (
    <section className="bg-secondary min-h-y py-4">
      <div className="container">
        <div className="bg-card p-6 rounded-md shadow-md">
          <h1 className="h1">{data?.name}</h1>
          <p className="p">{data?.description}</p>
          <p className="p">{data?.price}</p>
          <p>{data?.category?.name}</p>
          <div>
            {data?.tags.map((tag) => (
              <p className="p" key={tag._id}>
                {tag.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
