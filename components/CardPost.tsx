import { IPost } from "@/lib/types";
import { smartTrim } from "@/lib/utils";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ICardPost {
  post: IPost;
  children?: React.ReactNode;
  showDesc?: boolean;
}

export default function CardPost({ post, children, showDesc = true }: ICardPost) {
  return (
    <div key={post._id} className="bg-card rounded-md overflow-hidden cursor-pointer">
      <Link href={`/posts/show/${post._id}`}>
        <Image
          src={post?.imageUrl || "/logo-warungota.png"}
          alt={post.title}
          width={400}
          height={400}
          className={`w-full h-56 object-cover object-center ${post?.imageUrl ? "" : "dark:invert"}`}
          // priority
        />
      </Link>

      <div className="p-4 space-y-2">
        <Link href={`/posts/show/${post._id}`} className="hover:underline">
          <h3 className="first-letter:uppercase h3">{smartTrim(post.title, 60)}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{moment(post.createdAt).fromNow()}</p>
        <div className="badge">{post?.category?.name || "category"}</div>
        {showDesc && (
          <article className="tiptap" dangerouslySetInnerHTML={{ __html: smartTrim(post.content, 120) }}></article>
        )}
        {children}
      </div>
    </div>
  );
}
