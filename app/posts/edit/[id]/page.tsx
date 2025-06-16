"use client";

import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import FormUpload from "@/components/FormUpload";
import Pending from "@/components/Pending";
import { Button } from "@/components/ui/button";
import ProtectedRoles from "@/layouts/ProtectedRoles";
import { IProductcat } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [pendingData, setPendingData] = useState(false);
  const [pending, setPending] = useState(false);

  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);

  const [categories, setCategories] = useState<IProductcat[] | null>([]);

  const router = useRouter();
  const params = useParams();
  const { id } = params;

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
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
      }
    }
  };

  const getData = useCallback(async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get(`/public/post/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setCategory(res.data.category);
      setCurrentImage(res.data.imageUrl);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setPendingData(false);
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axiosInstance.patch(`/editor/post/${id}`, formData);
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

  const formContent = (
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
      {/* recent image */}
      {currentImage && (
        <div className="mb-3">
          <p className="leading-none text-sm">Curent Image</p>
          <Image
            src={currentImage}
            width={400}
            height={400}
            alt="Preview"
            className="w-56 h-36 object-cover object-center mt-2 rounded-md"
            priority
          />
        </div>
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
        {pending ? "Loading.." : "Update Post"}
      </Button>
    </form>
  );

  return (
    <ProtectedRoles roles={["admin", "editor"]}>
      <section className="min-h-y py-4 bg-secondary">
        <div className="container">
          <div className="bg-card p-6 rounded-md max-w-2xl">
            <h1 className="h1 mb-4">Update Posts</h1>
            <div>{pendingData ? <Pending /> : formContent}</div>
          </div>
        </div>
      </section>
    </ProtectedRoles>
  );
}
