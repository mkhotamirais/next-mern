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
      const res = await axiosInstance.get("/public/product?productlimit=10&productsort=-imageUrl");
      setData(res.data.products);
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
        <div className="mb-4 flex justify-between items-center">
          <h2 className="h2">Products</h2>
          <Link href="/products">
            <Button variant={"outline"} size={"sm"}>
              See All
            </Button>
          </Link>
        </div>
        <div className="flex py-1 overflow-scroll gap-1 sm:gap-2 [&::-webkit-scrollbar]:hidden">
          {data.map((product: IProduct) => (
            <CardProduct key={product._id} product={product} className="min-w-30 md:min-w-48" />
          ))}
          <Link href="/products" className="self-center">
            <Button className="rounded-full mx-6 p-5" variant={"outline"} size={"icon"} aria-label="all-products">
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
