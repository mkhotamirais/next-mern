"use client";

import { Button } from "@/components/ui/button";
import { IPost } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import DelPost from "./DelPost";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import Pending from "@/components/Pending";
import CardPost from "@/components/CardPost";
import { usePostStore } from "@/lib/postStore";
import { SearchPosts } from "./FilterPosts";
import { useSearchParams } from "next/navigation";

export default function Posts() {
  const { posts, pendingPosts, getPosts } = usePostStore();

  const searchParams = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

  useEffect(() => {
    getPosts(params);
  }, [getPosts, params]);

  let content;
  if (posts?.length === 0) content = <h1>No posts found</h1>;
  if (posts && posts.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post: IPost) => (
          <CardPost key={post._id} post={post}>
            <ProtectedRoles roles={["admin", "editor"]}>
              <div className="flex gap-2">
                <Link href={`/posts/edit/${post._id}`} className="text-green-500">
                  Edit
                </Link>
                <DelPost post={post} getPosts={getPosts} />
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
            <SearchPosts />
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
      <div className="container py-4">{pendingPosts ? <Pending /> : content}</div>
    </section>
  );
}
