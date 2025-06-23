"use client";

import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
// import FormTextarea from "@/components/FormTextarea";
import FormUpload from "@/components/FormUpload";
import Tiptap from "@/components/tiptap/Tiptap";
import { Button } from "@/components/ui/button";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { IProductcat } from "@/lib/types";
import { axiosInstance, errMsg } from "@/lib/utils";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);

  const [categories, setCategories] = useState<IProductcat[] | null>([]);

  const router = useRouter();

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onResetFile = () => {
    setImage(null);
    setPreview(null);
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/public/postcat");
      setCategories(res.data);
    } catch (error) {
      errMsg(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const categoryOptions = categories?.map((cat) => ({ value: cat._id, label: cat.name }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post("/editor/post", formData);
      toast.success(res.data.message);
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setErrors(null);
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
    <ProtectedRouteRoles authorizedRoles={["admin", "editor"]}>
      <section className="min-h-y py-4 bg-secondary">
        <div className="container">
          <div className="bg-card p-3 md:p-6 rounded-md max-w-2xl">
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
              <Tiptap label="Content" value={content} onChange={setContent} error={errors?.content} />
              {/* <FormTextarea
                id="content"
                label="Content"
                value={content}
                placeholder="Enter post content"
                handleChange={(e) => setContent(e.target.value)}
                error={errors?.content}
              /> */}
              {categoryOptions && (
                <FormSelect
                  label="Category"
                  options={categoryOptions}
                  value={category}
                  onChange={setCategory}
                  error={errors?.category}
                />
              )}
              <FormUpload
                label="Image"
                id="image"
                preview={preview}
                setImage={setImage}
                error={errors?.image}
                onChangeFile={onChangeFile}
                onResetFile={onResetFile}
              />
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create Post"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
