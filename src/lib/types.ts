export interface GenerateVideoRequest {
  image: string; // base64 encoded
  imageAttributes: string;
  videoIdea: string;
  duration: number; // seconds
}

export interface TaskCreatedResponse {
  taskId: string;
  status: string;
}

export interface TaskStatusResponse {
  taskId: string;
  status: string;
  videoUrl?: string;
  error?: string;
}

export interface GenerateVideoResponse {
  videoUrl?: string;
  [key: string]: unknown;
}

export type AppStatus = "idle" | "uploading" | "analyzing" | "generating" | "done" | "error";
