import { Button } from "@/components/ui/button";
import c from "@/lib/content.json";
import Link from "next/link";

export default function NavDesktop() {
  return (
    <nav className="hidden md:flex">
      {c.main_menu.map((item, i) => (
        <Link href={item.url} key={i}>
          <Button variant="ghost" className="w-full justify-start">
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
