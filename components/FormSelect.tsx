import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "./ui/label";
import { Dispatch, SetStateAction } from "react";

interface FormSelectProps {
  label: string;
  options: { label: string; value: string }[] | null;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  error?: string | string[];
}

export default function FormSelect({ label, options, value, onChange, error }: FormSelectProps) {
  return (
    <div className="mb-3 space-y-1">
      <Label className="flex flex-col gap-1 items-start">
        {label}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}{" "}
          </SelectContent>
        </Select>
      </Label>
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
