"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchPosts() {
  const router = useRouter();
  const searchParam = useSearchParams();

  const onSearch = useDebouncedCallback((e) => {
    const urlParams = new URLSearchParams(searchParam.toString());
    if (e) {
      urlParams.set("postq", e);
    } else {
      urlParams.delete("postq");
    }
    router.push(`?${urlParams.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2" />
      <Input
        type="search"
        placeholder="Search post.."
        className="pl-8 bg-background"
        defaultValue={searchParam.get("q") || ""}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
