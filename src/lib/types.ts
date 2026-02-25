export interface GenerateVideoRequest {
  image: string; // base64 encoded
  imageAttributes: string;
  videoIdea: string;
}

export interface GenerateVideoResponse {
  // RunwayML response — typically returns a video URL
  [key: string]: unknown;
}

export type AppStatus = "idle" | "uploading" | "analyzing" | "generating" | "done" | "error";
