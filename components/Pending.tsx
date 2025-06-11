"use client";

import { Loader } from "lucide-react";

export default function Pending() {
  return (
    <div className="container flex items-center justify-center py-8">
      <Loader className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
