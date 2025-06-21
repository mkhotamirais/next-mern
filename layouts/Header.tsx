import Logo from "@/components/Logo";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import NavUser from "./NavUser";
import { ThemeToggle } from "./ThemeToggle";
import Search from "@/components/Search";
import NavCart from "./NavCart";

export default function Header() {
  return (
    <header className="h-16 bg-background z-50 sticky top-0">
      <div className="container flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <NavMobile />
          <Logo />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <NavDesktop />
          <Search />
          <NavCart />
          <NavUser />
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
