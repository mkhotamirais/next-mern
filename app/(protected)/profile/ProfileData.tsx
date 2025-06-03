"use client";

import FormInput from "@/components/FormInput";
import { useDataStore } from "@/lib/store";
import React, { useEffect, useState } from "react";

export default function ProfileData() {
  const [form, setForm] = useState({ name: "", email: "" });
  const { user } = useDataStore();

  useEffect(() => {
    if (user) {
      setForm({ name: user?.name, email: user?.email });
    }
  }, [user]);
  return (
    <div className="bg-card p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2">Profile Data</h2>
      </div>
      <form>
        <FormInput
          id="name"
          label="Name"
          placeholder="Enter your name"
          value={form.name}
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormInput
          id="email"
          label="Email"
          placeholder="example@email.com"
          value={form.email}
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </form>
    </div>
  );
}
