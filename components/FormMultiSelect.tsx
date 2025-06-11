// src/app/page.tsx

"use client";

import React, { Dispatch, SetStateAction } from "react";
import { MultiSelect } from "./ui/multi-select";
import { Label } from "./ui/label";

interface Props {
  id: string;
  label: string;
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  options: { label: string; value: string }[];
  error?: string | string[];
}

export default function FormMultiSelect({ id, label, selectedTags, setSelectedTags, options, error }: Props) {
  return (
    <div className="mb-3 space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <MultiSelect
        id={id}
        name={id}
        options={options}
        onValueChange={setSelectedTags}
        defaultValue={selectedTags}
        placeholder="Select Tags"
        variant="inverted"
        animation={2}
        maxCount={3}
      />
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
