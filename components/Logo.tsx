import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image src="/logo-warungota.png" alt="logo mkhotami" width={20} height={20} className="size-8 dark:invert" />
      <span className="tracking-tighter font-semibold text-base md:text-lg">WarungOta</span>
    </Link>
  );
}
