import { GenerateVideoRequest, GenerateVideoResponse } from "./types";

export async function generateVideo(
  data: GenerateVideoRequest
): Promise<GenerateVideoResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Generation failed (${res.status}): ${text}`);
  }

  return res.json();
}

const MAX_IMAGE_DIMENSION = 1024;
const IMAGE_QUALITY = 0.8;

/**
 * Compress and resize an image to keep the base64 payload small.
 * VEO 3.1 doesn't need a 4K image — 1024px max dimension is plenty.
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if either dimension exceeds the max
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG for smaller size
      const dataUrl = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = url;
  });
}

export async function fileToBase64(file: File): Promise<string> {
  // Compress images to reduce payload size
  if (file.type.startsWith("image/")) {
    return compressImage(file);
  }

  // Fallback for non-image files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
