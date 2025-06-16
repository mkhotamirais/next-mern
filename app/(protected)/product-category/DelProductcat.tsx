import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IProductcat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { axiosInstance } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  productCategory: IProductcat;
  getProductCategories: () => Promise<void>;
}

export default function DelProductcat({ productCategory, getProductCategories }: Props) {
  const [pending, setPending] = useState(false);

  const onDelete = async () => {
    try {
      setPending(true);
      const res = await axiosInstance.delete(`/editor/productcat/${productCategory._id}`);
      toast.success(res?.data?.message);
      getProductCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="btn-del">
          Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Delete {productCategory.name}</DialogTitle>
          <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="destructive" onClick={onDelete} disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
