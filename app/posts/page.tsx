"use client";

import { Button } from "@/components/ui/button";
import { IPost } from "@/lib/types";
import { axiosInstance, errMsg, smartTrim } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DelPost from "./DelPost";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import Pending from "@/components/Pending";
import Image from "next/image";
import moment from "moment";
import { usePostStore } from "@/lib/postStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

export default function Posts() {
  const [data, setdata] = useState([]);
  const [pending, setPending] = useState(false);
  const { params, setParams } = usePostStore();

  const router = useRouter();
  const searchParam = useSearchParams();

  const onSearch = useDebouncedCallback((e) => {
    const newParams = new URLSearchParams(searchParam);
    if (e) {
      newParams.set("q", e);
      setParams({ ...params, q: e });
    } else {
      newParams.delete("q");
      setParams({ ...params, q: undefined });
    }
    router.push(`?${newParams.toString()}`);
  }, 300);

  const getData = useCallback(async () => {
    try {
      setPending(true);
      const res = await axiosInstance.get("/public/post", { params });
      setdata(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPending(false);
    }
  }, [params]);

  useEffect(() => {
    getData();
  }, [getData]);

  let content;
  if (data.length === 0) content = <h1>No posts found</h1>;
  if (data.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((post: IPost) => (
          <div key={post._id} className="bg-card rounded-md overflow-hidden cursor-pointer">
            <Link href={`/posts/show/${post._id}`}>
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={400}
                height={400}
                className="w-full h-56 object-cover object-center"
                priority
              />
            </Link>

            <div className="p-4 space-y-2">
              <Link href={`/posts/show/${post._id}`} className="hover:underline">
                <h3 className="h3">{smartTrim(post.title, 60)}</h3>
              </Link>
              <p className="text-xs text-muted-foreground">{moment(post.createdAt).fromNow()}</p>
              <div className="badge">{post?.category?.name || "category"}</div>
              <p className="text-sm text-muted-foreground first-letter:uppercase">{smartTrim(post.content, 120)}</p>

              <ProtectedRoles roles={["admin", "editor"]}>
                <div className="flex gap-2">
                  <Link href={`/posts/edit/${post._id}`} className="text-green-500">
                    Edit
                  </Link>
                  <DelPost post={post} getPosts={getData} />
                </div>
              </ProtectedRoles>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="min-h-y bg-secondary">
      <div className="py-8 bg-zinc-200 dark:bg-zinc-900">
        <div className="container">
          <h1 className="h1">Posts</h1>
          <div className="relative">
            <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search post.."
              className="pl-8"
              onChange={(e) => onSearch(e.target.value)}
            />
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
