"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/utils";
import { useDataStore } from "@/lib/store";

export default function Register() {
  const { setUser } = useDataStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{
    name?: string | string[];
    email?: string | string[];
    password?: string | string[];
    confirmPassword?: string | string[];
  } | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const res = await axiosInstance.post("/signup", form);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors(error?.response?.data?.errors);
        setForm({ name: form.name, email: form.email, password: "", confirmPassword: "" });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="min-h-y bg-secondary py-12">
      <div className="container">
        <div className="bg-card p-6 rounded-md max-w-md mx-auto">
          <div className="mb-4 space-y-1">
            <h1 className="h1">Register</h1>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <FormInput
              id="name"
              label="Name"
              placeholder="John Doe"
              value={form.name}
              handleChange={handleChange}
              error={errors?.name}
            />
            <FormInput
              id="email"
              label="Email"
              placeholder="example@email.com"
              value={form.email}
              handleChange={handleChange}
              error={errors?.email}
            />
            <FormInput
              type="password"
              id="password"
              label="Password"
              placeholder="********"
              value={form.password}
              handleChange={handleChange}
              error={errors?.password}
            />
            <FormInput
              type="password"
              id="confirmPassword"
              label="Confirm Password"
              placeholder="********"
              value={form.confirmPassword}
              handleChange={handleChange}
              error={errors?.confirmPassword}
            />
            <Button type="submit" disabled={pending}>
              {pending ? "Loading..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
