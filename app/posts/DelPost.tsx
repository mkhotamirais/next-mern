"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPost } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  post: IPost;
  getPosts: () => void;
}

export default function DelPost({ post, getPosts }: Props) {
  const [pending, setPending] = useState(false);
  const onDelete = async () => {
    try {
      setPending(true);
      const res = await axiosInstance.delete(`/editor/post/${post._id}`);
      getPosts();
      toast.success(res?.data?.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setPending(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-destructive">
          Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col text-left items-start">
          <DialogTitle>Delete {post.title}</DialogTitle>
          <DialogDescription>This action cannot be undone. Are you absolutely sure?</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={onDelete} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
