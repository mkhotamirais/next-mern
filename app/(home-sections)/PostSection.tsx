"use client";

import CardPost from "@/components/CardPost";
import Pending from "@/components/Pending";
import { IPost } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function PostSection() {
  const [data, setData] = useState<IPost[]>([]);
  const [pendingData, setPendingData] = useState(false);

  const getData = async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/public/post?limit=4");
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
    <section className="py-12 bg-secondary">
      <div className="container">
        <h2 className="h2 mb-4">Posts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {data.map((post) => (
            <CardPost key={post._id} post={post} showDesc={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
