"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IPagination {
  totalData: number;
  perPage?: number;
}

export default function Pagination({ totalData, perPage = 4 }: IPagination) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalData / perPage);
  const currentPageFromURL = parseInt(searchParams.get("productpage") || "1");
  const [page, setPage] = useState(currentPageFromURL);

  useEffect(() => {
    setPage(currentPageFromURL);
  }, [currentPageFromURL]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("productpage", newPage.toString());
    // params.set("productlimit", perPage.toString());
    // Jangan set productskip di frontend
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goToPage(page);
  };

  const onPrev = () => {
    if (page > 1) goToPage(page - 1);
  };

  const onNext = () => {
    if (page < totalPages) goToPage(page + 1);
  };

  return (
    <div className="flex items-center gap-2 py-4">
      <Button size={"icon"} onClick={onPrev} disabled={page === 1} aria-label="Previous">
        <ChevronLeft />
      </Button>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="productpage" className="sr-only">
          Current Page
        </Label>
        <Input
          type="number"
          id="productpage"
          name="productpage"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="w-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
          min={1}
          max={totalPages}
        />
      </form>
      <span>/ {totalPages}</span>
      <Button size={"icon"} onClick={onNext} disabled={page === totalPages} aria-label="Next">
        <ChevronRight />
      </Button>
    </div>
  );
}
