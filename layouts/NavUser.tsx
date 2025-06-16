"use client";

import { Button } from "@/components/ui/button";
import { useDataStore } from "@/lib/store";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "lucide-react";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import c from "@/lib/content.json";

export default function NavUser() {
  const { user, setUser, isMounted } = useDataStore();
  const router = useRouter();

  let menu: { label: string; url: string }[] = [];
  if (user?.role === "user") menu = c.user_menu;
  if (user?.role === "editor") menu = c.editor_menu;
  if (user?.role === "admin") menu = c.admin_menu;

  const logout = async () => {
    try {
      await axiosInstance.patch("/common/signout");
      setUser(null);
      router.replace("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  if (!isMounted) return null;
  return (
    <div>
      {user ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <User />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64">
            <SheetHeader>
              <SheetTitle>Hi, {user.name}</SheetTitle>
              <SheetDescription className="hidden"></SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col px-3 gap-1">
              {menu.map((item, i) => (
                <SheetClose key={i} asChild>
                  <Link href={item.url}>
                    <Button variant="outline" className="w-full justify-start">
                      {item.label}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button type="button" variant="outline" onClick={logout} className="w-full justify-start">
                  Logout
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      )}
    </div>
  );
}
