"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface ITiptap {
  label?: string;
  value?: string;
  onChange: (value: string) => void | React.Dispatch<React.SetStateAction<string>>;
  error?: string | string[];
}

export default function Tiptap({ label = "label", value, onChange, error }: ITiptap) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-4" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-4" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-32 border rounded-md py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div className="mb-3">
      <div>{label}</div>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
      {error && <p className="text-red-500 leading-none text-xs font-medium">{error}</p>}
    </div>
  );
}
