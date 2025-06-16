import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const res = await axiosInstance.patch("/common/account/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(res.data.message);
      setErrors(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors(error?.response?.data?.errors);
      }
    } finally {
      setPending(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="bg-card p-3 md:p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2">Change Password</h2>
      </div>
      <form onSubmit={onSubmit}>
        <FormInput
          type="password"
          id="password"
          label="Password"
          placeholder="Password"
          value={currentPassword}
          handleChange={(e) => setCurrentPassword(e.target.value)}
          error={errors?.currentPassword}
        />
        <FormInput
          type="password"
          id="newPassword"
          label="New Password"
          placeholder="New Password"
          value={newPassword}
          handleChange={(e) => setNewPassword(e.target.value)}
          error={errors?.newPassword}
        />
        <FormInput
          type="password"
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          handleChange={(e) => setConfirmPassword(e.target.value)}
          error={errors?.confirmPassword}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Loading..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
