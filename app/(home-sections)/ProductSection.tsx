"use client";

import CardProduct from "@/components/CardProduct";
import Pending from "@/components/Pending";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductSection() {
  const [data, setData] = useState<IProduct[]>([]);
  const [pendingData, setPendingData] = useState(false);

  const getData = async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/public/product?limit=10");
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (pendingData) return <Pending />;

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="h2 mb-4">Products</h2>
        <div className="flex py-1 overflow-scroll gap-2 [&::-webkit-scrollbar]:hidden">
          {data.map((product: IProduct) => (
            <CardProduct key={product._id} product={product} className="min-w-48" />
          ))}
          <Link href="/products" className="self-center">
            <Button className="rounded-full mx-4" variant={"outline"} size={"icon"}>
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
