"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

type Props = {
  onFile: (file: File | null) => void;
  previewUrl?: string | null;
};

export function SingleFileDropzone({ onFile, previewUrl }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] ?? null;
      onFile(file);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxSize: 5 * 1024 * 1024,
    });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`group border-2 border-dashed border-foreground/20 rounded-xl p-6 text-center cursor-pointer bg-background/40 hover:bg-foreground/[0.03] transition-colors h-72 flex items-center justify-center relative overflow-hidden ${
          isDragActive ? "bg-foreground/5" : ""
        }`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg shadow-sm object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-sm">
            <div className="rounded-full bg-foreground/10 text-foreground p-3">
              <Upload size={24} />
            </div>
            <div className="font-medium">Upload poster</div>
            <div className="opacity-70">Drag & drop, or click to browse</div>
            <div className="text-xs opacity-60">JPG, PNG, WEBP up to 5MB</div>
          </div>
        )}
      </div>
      {fileRejections.length > 0 && (
        <p className="text-sm text-red-600 mt-2">Invalid file type or size.</p>
      )}
    </div>
  );
}
