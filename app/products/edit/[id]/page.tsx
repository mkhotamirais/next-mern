"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import FormSelect from "@/components/FormSelect";
import { IProductcat, IProducttag } from "@/lib/types";
import FormMultiSelect from "@/components/FormMultiSelect";
import Pending from "@/components/Pending";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { toast } from "sonner";
import FormUpload from "@/components/FormUpload";
import Image from "next/image";
import Tiptap from "@/components/tiptap/Tiptap";

export default function EditProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [pendingData, setPendingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);
  const [pending, setPending] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [categories, setCategories] = useState<IProductcat[] | null>(null);
  const [tags, setTags] = useState<IProducttag[] | null>(null);

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

  const getTags = async () => {
    try {
      const res = await axiosInstance.get("/public/producttag");
      const result = res.data?.sort((a: IProducttag, b: IProducttag) => a.name.localeCompare(b.name));
      setTags(result);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
      }
    }
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/public/productcat");
      const result = res.data?.sort((a: IProductcat, b: IProductcat) => a.name.localeCompare(b.name));
      setCategories(result);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
      }
    }
  };

  const getData = useCallback(async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get(`/public/product/${id}`);
      setName(res.data.name);
      setPrice(res.data.price);
      setDescription(res.data.description);
      setCategory(res.data.category._id);
      setSelectedTags(res.data.tags.map((tag: IProducttag) => tag._id));
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
    getData();
    getTags();
    getCategories();
  }, [getData]);

  const categoryOptions = categories?.map((cat) => ({ value: cat._id, label: cat.name }));
  const tagOptions = tags?.map((tag) => ({ value: tag._id, label: tag.name }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      selectedTags.forEach((tag) => formData.append("tags", tag));
      if (image) formData.append("image", image);

      const res = await axiosInstance.patch(`/editor/product/${id}`, formData);
      toast.success(res.data.message);

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

  if (pendingData) return <Pending />;
  if (!id) return <h1>Product not found</h1>;
  return (
    <ProtectedRouteRoles authorizedRoles={["admin", "editor"]}>
      <section className="min-h-y py-4 bg-secondary">
        <div className="container">
          <div className="bg-card max-w-2xl p-6 rounded-md">
            <div className="mb-4">
              <h1 className="h1">Update Product</h1>
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
              <Tiptap label="Content" value={description} onChange={setDescription} error={errors?.description} />

              {/* <FormTextarea
                id="description"
                label="Description"
                placeholder="description"
                value={description}
                handleChange={(e) => setDescription(e.target.value)}
                error={errors?.description}
              /> */}
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
                {pending ? "Updating..." : "Update"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
