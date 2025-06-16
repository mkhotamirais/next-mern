"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/utils";
import { useDataStore } from "@/lib/store";
import ProtectedRouteAuth from "@/layouts/ProtectedRouteAuth";
import { useCartStore } from "@/lib/cartStore";
import { ICart } from "@/lib/types";

export default function Login() {
  const { setUser } = useDataStore();
  const { setCartCount } = useCartStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string | string[];
    password?: string | string[];
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
      const res = await axiosInstance.post("/public/signin", form);
      setUser(res.data.user);

      const resCart = await axiosInstance.get("/user/cart");
      const totalQty = resCart.data.items.reduce((sum: number, item: ICart) => sum + item.qty, 0);
      setCartCount(totalQty);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors(error?.response?.data?.errors);
        setForm({ email: form.email, password: "" });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <ProtectedRouteAuth>
      <section className="min-h-y bg-secondary py-12">
        <div className="container">
          <div className="bg-card p-6 rounded-md max-w-md mx-auto">
            <div className="mb-4 space-y-1">
              <h1 className="h1">Login</h1>
              <p className="text-muted-foreground">
                Do not have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
            <form onSubmit={onSubmit}>
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
              <Button type="submit" disabled={pending}>
                {pending ? "Loading..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </ProtectedRouteAuth>
  );
}
