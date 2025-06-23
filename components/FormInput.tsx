import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface FormInputProps {
  type?: string;
  id: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  error?: string | string[];
}

export default function FormInput({
  type = "text",
  id,
  label,
  placeholder,
  value,
  handleChange,
  autoFocus = false,
  error,
}: FormInputProps) {
  return (
    <div className="mb-3 space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
      />
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
