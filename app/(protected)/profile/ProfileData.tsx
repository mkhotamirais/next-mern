"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/lib/store";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileData() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string | string[];
    email?: string | string[];
    phone?: string | string[];
  } | null>(null);
  const { user } = useDataStore();

  useEffect(() => {
    if (user) {
      setForm({ name: user?.name, email: user?.email, phone: user?.phone || "" });
    }
  }, [user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const res = await axiosInstance.patch("/account", form);
      toast.success(res.data.message);
      setErrors(null);
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
        <h2 className="h2">Profile Data</h2>
      </div>
      <form onSubmit={onSubmit}>
        <FormInput
          id="name"
          label="Name"
          placeholder="Enter your name"
          value={form.name}
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors?.name}
        />
        <FormInput
          id="email"
          label="Email"
          placeholder="example@email.com"
          value={form.email}
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors?.email}
        />
        <FormInput
          id="phone"
          label="Phone"
          placeholder="Enter your phone number"
          value={form.phone}
          handleChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors?.phone}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
}
