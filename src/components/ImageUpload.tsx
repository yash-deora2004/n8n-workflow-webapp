"use client";

import { useCallback, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
}

export default function ImageUpload({ onImageSelect, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
        ${isDragging ? "border-purple-400 bg-purple-400/10" : "border-gray-600 hover:border-gray-400"}
        ${preview ? "p-2" : "p-12"}`}
    >
      {preview ? (
        <img
          src={preview}
          alt="Upload preview"
          className="w-full h-64 object-contain rounded-lg"
        />
      ) : (
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16l4-4m0 0l4 4m-4-4v12M21 12V4a2 2 0 00-2-2h-4m-5 0H6a2 2 0 00-2 2v4" />
          </svg>
          <p className="mt-3 text-sm text-gray-400">
            Drag & drop an image, or{" "}
            <span className="text-purple-400 font-medium">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
