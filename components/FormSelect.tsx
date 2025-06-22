"use client";

import { Label } from "./ui/label";
import { Dispatch, SetStateAction } from "react";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FormSelectProps {
  label: string;
  options: { label: string; value: string }[] | null;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void | Dispatch<SetStateAction<string>>;
  error?: string | string[];
}

export default function FormSelect({
  label,
  options,
  placeholder = "category",
  value,
  onChange,
  error,
}: FormSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mb-3 space-y-1">
      <Label className="flex flex-col gap-1 items-start">
        {label}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="min-w-full">
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
              {value ? options?.find((option) => option.value === value)?.label : placeholder}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 !traslate-x-0">
            <Command className="min-w-full ">
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={(selectedLabel) => {
                        const selectedOption = options?.find((opt) => opt.label === selectedLabel);
                        if (selectedOption) {
                          onChange(selectedOption.value); // tetap kirim value (id) ke form
                          setOpen(false);
                        }
                        // onChange(currentValue === value ? "" : currentValue);
                        // setOpen(false);
                      }}
                    >
                      {option.label}
                      <Check className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Label>
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
