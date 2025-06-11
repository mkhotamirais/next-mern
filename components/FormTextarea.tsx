import React from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder: string;
  value?: string | number;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string | string[];
}

export default function FormTextarea({ id, label, placeholder, value, handleChange, error }: FormTextareaProps) {
  return (
    <div className="mb-3 space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={id} placeholder={placeholder} value={value} onChange={handleChange} />
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
