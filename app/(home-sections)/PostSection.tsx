"use client";

import CardPost from "@/components/CardPost";
import Pending from "@/components/Pending";
import { Button } from "@/components/ui/button";
import { IPost } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function PostSection() {
  const [data, setData] = useState<IPost[]>([]);
  const [pendingData, setPendingData] = useState(false);

  const getData = async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/public/post?limit=4");
      setData(res.data.posts);
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
    <section className="py-12 bg-secondary">
      <div className="container">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="h2">Posts</h2>
          <Link href="/posts">
            <Button variant={"outline"} size={"sm"}>
              See All
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {data.map((post) => (
            <CardPost key={post._id} post={post} showDesc={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
