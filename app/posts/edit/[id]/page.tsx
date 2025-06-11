"use client";

import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import { Button } from "@/components/ui/button";
import { IProductcat } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string | string[];
    content?: string | string[];
    category?: string | string[];
  } | null>(null);

  const [categories, setCategories] = useState<IProductcat[] | null>([]);

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/postcat");
      setCategories(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
      }
    }
  };

  const getData = useCallback(async () => {
    try {
      setPending(true);
      const res = await axiosInstance.get(`/post/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setCategory(res.data.category);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setPending(false);
    }
  }, [id]);

  useEffect(() => {
    getCategories();
    getData();
  }, [getData]);

  const categoryOptions = categories?.map((cat) => ({ value: cat._id, label: cat.name }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const res = await axiosInstance.post("/post", { title, content, category });
      toast.success(res.data.message);
      router.push("/posts");
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
    <section className="min-h-y py-4 bg-secondary">
      <div className="container">
        <div className="bg-card p-6 rounded-md max-w-2xl">
          <h1 className="h1 mb-4">Create Posts</h1>
          <form onSubmit={onSubmit}>
            <FormInput
              id="title"
              label="Tite"
              value={title}
              placeholder="Enter post title"
              handleChange={(e) => setTitle(e.target.value)}
              error={errors?.title}
            />
            <FormTextarea
              id="content"
              label="Content"
              value={content}
              placeholder="Enter post content"
              handleChange={(e) => setContent(e.target.value)}
              error={errors?.content}
            />
            {categoryOptions && (
              <FormSelect
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                error={errors?.category}
              />
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
