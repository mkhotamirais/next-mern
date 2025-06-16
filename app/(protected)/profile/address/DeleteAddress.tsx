"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IAddress } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { toast } from "sonner";

interface DeleteAddressProps {
  address: IAddress;
  getData: () => void;
}

export default function DeleteAddress({ address, getData }: DeleteAddressProps) {
  const [pending, setPending] = React.useState(false);

  const onDelete = async () => {
    try {
      setPending(true);
      const res = await axiosInstance.delete(`/user/account/address/${address._id}`);
      toast.success(res.data.message);
      getData();
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-red-500">
          Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col justify-start text-left items-start">
          <DialogTitle>Delete {address.fullAddress}..</DialogTitle>
          <DialogDescription>This action cannot be undone. Are you absolutely sure?</DialogDescription>
        </DialogHeader>
        <div className="flex gap-1 mt-2">
          <DialogClose asChild>
            <Button variant={"destructive"} onClick={onDelete} disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
