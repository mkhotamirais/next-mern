"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface FormUploadProps {
  id: string;
  label: string;
  preview?: string | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  error?: string | string[];
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFile: () => void;
}

export default function FormUpload({ id, label, preview, error, onChangeFile, onResetFile }: FormUploadProps) {
  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-3 space-y-1">
      <Label htmlFor={id} className="mb-1">
        {label}
      </Label>
      <Input ref={imageRef} id={id} name={id} type="file" accept="image/*" onChange={onChangeFile} />
      {preview && (
        <div className="relative w-fit">
          <Image
            src={preview}
            width={200}
            height={200}
            alt="Preview"
            className="w-56 h-36 object-cover object-center mt-2 rounded-md"
          />
          <Button
            variant={"destructive"}
            aria-label="reset image"
            type="button"
            size="icon"
            className="absolute right-1 top-1"
            onClick={() => {
              onResetFile();
              if (imageRef.current) {
                imageRef.current.value = "";
              }
            }}
          >
            <Trash />
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
