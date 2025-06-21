"use client";

import { Button } from "@/components/ui/button";
import { IParams, IPost } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DelPost from "./DelPost";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import Pending from "@/components/Pending";
import { useSearchParams } from "next/navigation";
import { FilterPosts } from "./FilterPosts";
import CardPost from "@/components/CardPost";

export default function Posts() {
  const [data, setdata] = useState([]);
  const [pending, setPending] = useState(false);

  const searchParams = useSearchParams();

  const getData = useCallback(async (par?: IParams) => {
    try {
      setPending(true);
      const res = await axiosInstance.get("/public/post", { params: par });
      setdata(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPending(false);
    }
  }, []);

  const q = searchParams.get("q");

  useEffect(() => {
    const params: IParams = {};
    if (q) params.q = q;
    getData(params);
  }, [getData, q]);

  let content;
  if (data.length === 0) content = <h1>No posts found</h1>;
  if (data.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((post: IPost) => (
          <CardPost key={post._id} post={post}>
            <ProtectedRoles roles={["admin", "editor"]}>
              <div className="flex gap-2">
                <Link href={`/posts/edit/${post._id}`} className="text-green-500">
                  Edit
                </Link>
                <DelPost post={post} getPosts={getData} />
              </div>
            </ProtectedRoles>
          </CardPost>
        ))}
      </div>
    );
  }

  return (
    <section className="min-h-y bg-secondary">
      <div className="py-8 bg-zinc-200 dark:bg-zinc-900">
        <div className="container">
          <h1 className="h1 mb-2">Posts</h1>
          <div className="max-w-sm">
            <FilterPosts />
          </div>
        </div>
      </div>
      <div className="container py-4">
        <ProtectedRoles roles={["admin", "editor"]}>
          <Link href="/posts/create">
            <Button>Create Post</Button>
          </Link>
        </ProtectedRoles>
      </div>
      <div className="container py-4">{pending ? <Pending /> : content}</div>
    </section>
  );
}
