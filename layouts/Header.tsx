import Logo from "@/components/Logo";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import NavUser from "./NavUser";
import { ThemeToggle } from "./ThemeToggle";
import Search from "@/components/Search";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="h-16 bg-background z-50 sticky top-0">
      <div className="container flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <NavMobile />
          <Logo />
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <NavDesktop />
          <Search />
          <Link href="/products/cart">
            <Button variant="outline" size="icon" className="">
              <ShoppingCart />
            </Button>
          </Link>
          <NavUser />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
