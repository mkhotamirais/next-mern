import Logo from "@/components/Logo";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import NavUser from "./NavUser";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="h-16 bg-background z-50 sticky top-0">
      <div className="container flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <NavMobile />
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          <NavDesktop />
          <NavUser />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
