import { GenerateVideoRequest, TaskCreatedResponse, TaskStatusResponse } from "./types";

export async function generateVideo(
  data: GenerateVideoRequest
): Promise<TaskCreatedResponse> {
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

export async function checkTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  const res = await fetch("/api/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Status check failed (${res.status}): ${text}`);
  }

  return res.json();
}

const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 30;

export async function pollForVideo(
  taskId: string,
  onStatusUpdate?: (status: string) => void
): Promise<TaskStatusResponse> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const status = await checkTaskStatus(taskId);

    if (onStatusUpdate) {
      onStatusUpdate(status.status);
    }

    if (status.status === "SUCCEEDED") {
      return status;
    }

    if (status.status === "FAILED") {
      throw new Error(status.error || "Video generation failed");
    }
  }

  throw new Error("Timed out waiting for video generation (5 minutes)");
}

const MAX_IMAGE_DIMENSION = 1024;
const IMAGE_QUALITY = 0.8;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

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
  if (file.type.startsWith("image/")) {
    return compressImage(file);
  }

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
