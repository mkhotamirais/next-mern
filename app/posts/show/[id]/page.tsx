"use client";

import Pending from "@/components/Pending";
import { IPost } from "@/lib/types";
import { axiosInstance, errMsg, smartTrim } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";

export default function ShowPost() {
  const [data, setData] = useState<IPost | null>(null);
  const [otherData, setOtherData] = useState<IPost[] | null>(null);
  const [pending, setPending] = useState(false);
  const params = useParams();
  const { id } = params;

  const getData = useCallback(async () => {
    try {
      setPending(true);
      const res = await axiosInstance.get(`/public/post/${id}`);
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPending(false);
    }
  }, [id]);

  const getOtherData = useCallback(async () => {
    try {
      setPending(true);
      const res = await axiosInstance.get(`/public/post`);
      const resultExceptCurrent = res.data.filter((post: IPost) => post._id !== id);
      setOtherData(resultExceptCurrent);
    } catch (error) {
      errMsg(error);
    } finally {
      setPending(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
    getOtherData();
  }, [getData, getOtherData]);

  if (pending) return <Pending />;

  return (
    <section className="py-4">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="h1">{data?.title}</h1>
            <Image
              src={data?.imageUrl || "/logo-mkhotami.png"}
              alt={data?.title ?? "image"}
              width={600}
              height={600}
              className="w-full rounded-md"
              priority
            />
            <p className="text-muted-foreground first-letter:capitalize leading-relaxed">{data?.content}</p>
            <p>{data?.category?.name}</p>
          </div>
          <div className=" w-full md:w-1/3">
            <h2 className="h2 mb-2">Other posts</h2>
            <div className="flex flex-col">
              {otherData?.map((post: IPost) => (
                <Link href={`/posts/show/${post._id}`} key={post._id} className="group flex mb-2 gap-2">
                  <Image
                    src={post.imageUrl || "/logo-mkhotami.png"}
                    alt={post.title ?? "image"}
                    width={100}
                    height={100}
                    className="h-full w-1/3 object-cover object-center rounded-l"
                  />
                  <div className="w-2/3 flex flex-col">
                    <h3 className="h3 !text-base group-hover:underline">{smartTrim(post.title, 50)}</h3>
                    <p className="text-sm text-muted-foreground mt-auto">{moment(data?.createdAt).fromNow()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
