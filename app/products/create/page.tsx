"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import FormSelect from "@/components/FormSelect";
import { IProductcat, IProducttag } from "@/lib/types";
import FormMultiSelect from "@/components/FormMultiSelect";
import FormTextarea from "@/components/FormTextarea";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name?: string | string[];
    price?: string | string[];
    tags?: string | string[];
    category?: string | string[];
    description?: string | string[];
  } | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const [categories, setCategories] = useState<IProductcat[] | null>(null);
  const [tags, setTags] = useState<IProducttag[] | null>(null);

  const getTags = async () => {
    try {
      const res = await axiosInstance.get("/producttag");
      setTags(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
      }
    }
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/productcat");
      setCategories(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
      }
    }
  };

  useEffect(() => {
    getTags();
    getCategories();
  }, []);

  const categoryOptions = categories?.map((cat) => ({ value: cat._id, label: cat.name }));
  const tagOptions = tags?.map((tag) => ({ value: tag._id, label: tag.name }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = { name, price, description, category, tags: selectedTags };
    try {
      setPending(true);
      const res = await axiosInstance.post("/product", form);
      console.log(res);
      router.push("/products");
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
          <div className="bg-card max-w-2xl p-6 rounded-md">
            <div className="mb-4">
              <h1 className="h1">Create Product</h1>
            </div>
            <form onSubmit={onSubmit}>
              <FormInput
                id="name"
                label="Name"
                placeholder="Product name"
                value={name}
                handleChange={(e) => setName(e.target.value)}
                error={errors?.name}
              />
              <FormInput
                id="price"
                label="Product Price"
                placeholder="0"
                value={price}
                handleChange={(e) => {
                  if (isNaN(Number(e.target.value))) {
                    setErrors({ price: "Price must be a number" });
                    setPrice("");
                  } else {
                    setPrice(e.target.value);
                  }
                }}
                error={errors?.price}
              />
              <FormTextarea
                id="description"
                label="Description"
                placeholder="description"
                value={description}
                handleChange={(e) => setDescription(e.target.value)}
                error={errors?.description}
              />
              {categoryOptions && (
                <FormSelect
                  label="Category"
                  options={categoryOptions || []}
                  value={category}
                  onChange={setCategory}
                  error={errors?.category}
                />
              )}
              {tagOptions && (
                <FormMultiSelect
                  id="tags"
                  label="Tags"
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  options={tagOptions}
                  error={errors?.tags}
                />
              )}
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
