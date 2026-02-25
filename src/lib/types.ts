export interface GenerateVideoRequest {
  image: string; // base64 encoded
  imageAttributes: string;
  videoIdea: string;
}

export interface GenerateVideoResponse {
  // VEO 3.1 response — shape may vary, video URL or binary
  [key: string]: unknown;
}

export type AppStatus = "idle" | "uploading" | "analyzing" | "generating" | "done" | "error";
