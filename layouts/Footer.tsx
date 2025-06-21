import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import c from "@/lib/content.json";
import Link from "next/link";
import { FaInstagram, FaFacebook } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-4 pt-8 pb-8">
          <div className="space-y-4 px-3">
            <Logo />
            <p className="text-muted-foreground text-sm">Warung ota menyediakan sembako dan atk</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="h3 mx-3 mb-3">Links</h3>
              <nav>
                {c.footer_menu_links.map((link) => (
                  <Link href={link.url} key={link.label} className="block">
                    <Button variant={"link"} size={"sm"} className="text-muted-foreground">
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h3 className="h3 mx-3 mb-3">Other Links</h3>
              <nav>
                {c.footer_menu_other_links.map((link) => (
                  <a href={link.url} key={link.label} className="block">
                    <Button variant={"link"} size={"sm"} className="text-muted-foreground">
                      {link.label}
                    </Button>
                  </a>
                ))}
              </nav>
            </div>
          </div>
          <div>
            <h3 className="h3 px-3 mb-3">Socials</h3>
            <div className="py-3 px-3 flex gap-4 items-center">
              <FaFacebook />
              <FaInstagram />
            </div>
          </div>
        </div>
        <Separator />
        <p className="pt-4 text-center">
          <small>
            Copyright &copy; {new Date().getFullYear()} |{" "}
            <a href="https://mkhotami.com" className="text-blue-400">
              mkhotami
            </a>
          </small>
        </p>
      </div>
    </footer>
  );
}
