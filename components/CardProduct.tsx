import { IProduct } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IProductCard {
  children?: React.ReactNode;
  product: IProduct;
  className?: string;
}

export default function CardProduct({ product, children, className }: IProductCard) {
  return (
    <div key={product._id} className={`${className} bg-card rounded-md shadow-md overflow-hidden`}>
      <Link href={`/products/show/${product._id}`}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          // fill
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-36 lg:h-48 object-cover object-center"
          priority
        />
      </Link>
      <div className="p-3 space-y-2">
        <Link href={`/products/show/${product._id}`} className="hover:underline">
          <h3 className="h3">{product.name}</h3>
        </Link>
        <p className="text-lg font-semibold">Rp{product.price}</p>
        <div className="flex flex-wrap items-center gap-1">
          <div className="badge">{product?.category?.name || "category"}</div>
          <div>•</div>
          <div className="flex gap-1">
            {product.tags.map((tag) => (
              <div key={tag._id} className="badge">
                {tag.name}
              </div>
            ))}
          </div>
        </div>
        {/* <p className="text-sm text-muted-foreground">{product.description}</p> */}
        {children}
      </div>
    </div>
  );
}
