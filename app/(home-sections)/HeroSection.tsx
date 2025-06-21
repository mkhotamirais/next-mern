import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  FaMobileScreenButton,
  FaArrowsRotate,
  FaMoneyBillWave,
  FaBasketShopping,
  FaPenNib,
  FaCopy,
  FaLayerGroup,
  FaCameraRetro,
  FaPrint,
  FaBolt,
  FaWhatsapp,
} from "react-icons/fa6";
import c from "@/lib/content.json";

const services = [
  { name: "Belanja", icon: <FaBasketShopping /> },
  { name: "ATK", icon: <FaPenNib /> },
  { name: "Fotokopi", icon: <FaCopy /> },
  { name: "Pulsa", icon: <FaMobileScreenButton /> },
  { name: "Token Listrik", icon: <FaBolt /> },
  { name: "Transfer", icon: <FaArrowsRotate /> },
  { name: "Tarik Tunai", icon: <FaMoneyBillWave /> },
  { name: "Print Document", icon: <FaPrint /> },
  { name: "Print Foto / Sertifikat", icon: <FaCameraRetro /> },
  { name: "Laminating", icon: <FaLayerGroup /> },
];

export default function HeroSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container grid lg:grid-cols-2 gap-8 place-items-center">
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-semibold">Belanja dan Fotokopi dalam Satu Tempat</h1>
          <p className="text-muted-foreground">
            WarungOta menyediakan sembako, ATK, serta layanan fotokopi, cetak dokumen dan foto, laminating, transfer,
            tarik tunai, isi saldo, pulsa, dan token listrik.
          </p>
          <div className="flex gap-2">
            <Link href={"/products"}>
              <Button variant={"default"} size={"lg"}>
                Belanja
              </Button>
            </Link>
            <a href={c.contact.url}>
              <Button variant={"outline"} size="lg">
                <FaWhatsapp /> Kontak
              </Button>
            </a>
          </div>
        </div>
        <div className="max-h-56 overflow-y-scroll">
          <div className="grid grid-cols-3 gap-1 py-2">
            {services.map((service) => (
              <div
                key={service.name}
                className="h-24 flex flex-col justify-center gap-2 items-center shadow-md p-2 rounded bg-accent"
              >
                <span className="text-lg">{service.icon}</span>
                <span className="text-xs sm:text-sm text-center text-muted-foreground">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
