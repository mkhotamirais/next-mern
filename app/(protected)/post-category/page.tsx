"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { IPostcat } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DelPostcat from "./DelPostcat";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import Pending from "@/components/Pending";

export default function PostCategory() {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string | string[] } | undefined>(undefined);
  const [errors2, setErrors2] = useState<{ name?: string | string[] } | undefined>(undefined);
  const [postCategories, setPostCategories] = useState<IPostcat[] | null>(null);
  const [pendingData, setPendingData] = useState(false);

  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [pendingUpdate, setPendingUpdate] = useState(false);

  const onEditMode = (postCategory: IPostcat) => {
    setIsEdit(postCategory._id);
    setNewName(postCategory.name);
  };

  const closeEditMode = () => {
    setIsEdit(null);
    setErrors(undefined);
    setErrors2(undefined);
    setNewName("");
  };

  const getPostCategories = async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/public/postcat");
      setPostCategories(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setPendingData(false);
    }
  };

  useEffect(() => {
    getPostCategories();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/editor/postcat", { name });
      toast.success(res?.data?.message);
      setName("");
      await getPostCategories();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors(error?.response?.data?.errors);
      }
    } finally {
      setPending(false);
    }
  };

  const updatePostCategory = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    try {
      setPendingUpdate(true);
      const res = await axiosInstance.patch(`/editor/postcat/${id}`, { name: newName });
      toast.success(res?.data?.message);
      await getPostCategories();
      closeEditMode();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors2(error?.response?.data?.errors);
      }
    } finally {
      setPendingUpdate(false);
    }
  };

  let content;
  if (pendingData) content = <Pending />;
  if (postCategories?.length === 0) content = <p>No post category found</p>;
  if (postCategories) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {postCategories.map((postCategory: IPostcat) => (
          <div key={postCategory._id} className="py-2 px-3 rounded-md bg-secondary">
            {isEdit === postCategory._id ? (
              <form onSubmit={(e) => updatePostCategory(e, postCategory._id)}>
                <FormInput
                  id="name"
                  // label="Name"
                  placeholder="Post category name.."
                  value={newName}
                  handleChange={(e) => setNewName(e.target.value)}
                  error={errors2?.name}
                />
                <button type="submit" className="btn-edit" disabled={pendingUpdate}>
                  {pendingUpdate ? "Updating..." : "Update"}
                </button>
                <button type="button" onClick={closeEditMode} className="btn-del">
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 className="px-2 py-1">{postCategory.name}</h3>
                {postCategory.name !== "lainnya" ? (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => onEditMode(postCategory)} className="btn-edit">
                      Edit
                    </button>
                    <DelPostcat postCategory={postCategory} getPostCategories={getPostCategories} />
                  </div>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ProtectedRouteRoles authorizedRoles={["editor", "admin"]}>
      <section className="min-h-y bg-secondary py-4">
        <div className="container">
          <div className="bg-card p-6 rounded-md max-w-2xl">
            <div className="mb-4">
              <h1 className="h1">Post Category</h1>
            </div>
            {/* Create */}
            <div className="mb-4">
              <div className="mb-3">
                <h2 className="h2">Create Post Category</h2>
              </div>
              <form onSubmit={onSubmit}>
                <FormInput
                  id="name"
                  label="Name"
                  placeholder="Post category name.."
                  value={name}
                  handleChange={(e) => setName(e.target.value)}
                  error={errors?.name}
                />
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving..." : "Save"}
                </Button>
              </form>
            </div>
            {/* List */}
            <div className="mb-4">
              <div className="mb-3">
                <h2 className="h2">Post Category List</h2>
              </div>
              {content}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
