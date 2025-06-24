"use cient";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import c from "@/lib/content.json";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function NavMobile() {
  return (
    <div className="flex md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"} size={"icon"} aria-label="mobile-menu-trigger">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
          </SheetHeader>
          <div className="px-3">
            <div className="flex justify-start mb-2">
              <ThemeToggle />
            </div>
            <nav className="flex flex-col gap-1">
              {c.main_menu.map((item, i) => (
                <SheetClose key={i} asChild>
                  <Link href={item.url}>
                    <Button variant="outline" className="w-full justify-start">
                      {item.label}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
