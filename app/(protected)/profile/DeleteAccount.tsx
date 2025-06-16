"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/lib/store";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);

  const { setUser } = useDataStore();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const res = await axiosInstance.delete("/common/account", { data: { password } });
      toast.success(res.data.message);
      setShowDelete(false);
      setErrors(null);
      setPassword("");
      await axiosInstance.patch("/signout");
      setUser(null);
      router.replace("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors(error?.response?.data?.errors);
      }
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="bg-card p-3 md:p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2">Danger Zone</h2>
      </div>
      {!showDelete && (
        <Button variant={"destructive"} onClick={() => setShowDelete(true)}>
          Delete Account
        </Button>
      )}
      {showDelete && (
        <form onSubmit={onSubmit}>
          <FormInput
            type="password"
            id="password"
            label="Password"
            placeholder="Password"
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
          />
          <div className="flex gap-1">
            <Button type="submit" variant={"destructive"} disabled={pending}>
              {pending ? "Deleting..." : "Delete Account"}
            </Button>
            <Button type="button" variant={"outline"} onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
