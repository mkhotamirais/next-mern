"use client";

import { useDataStore } from "@/lib/store";
import React from "react";

export default function Dashboard() {
  const { user } = useDataStore();
  return (
    <section className="min-h-y py-4 bg-sedondary">
      <div className="container">
        <h1 className="h1">Dashboard</h1>
        <p>Hi, {user?.name}</p>
      </div>
    </section>
  );
}
