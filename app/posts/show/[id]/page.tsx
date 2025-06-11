"use client";

import { IPost } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ShowPost() {
  const [data, setData] = useState<IPost | null>(null);
  const [pending, setPending] = useState(false);
  const params = useParams();
  const { id } = params;

  const getData = useCallback(async () => {
    try {
      setPending(true);
      const res = await axiosInstance.get(`/post/${id}`);
      setData(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setPending(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (pending) return <h1>Loading...</h1>;

  return (
    <section>
      <div className="container">
        <h1 className="h1">{data?.title}</h1>
        <p>{data?.content}</p>
        <p>{data?.category?.name}</p>
      </div>
    </section>
  );
}
