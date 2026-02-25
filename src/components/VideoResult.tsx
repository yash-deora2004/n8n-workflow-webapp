"use client";

import { GenerateVideoResponse } from "@/lib/types";

interface VideoResultProps {
  result: GenerateVideoResponse;
}

export default function VideoResult({ result }: VideoResultProps) {
  // RunwayML returns video as a URL. We detect and handle common response shapes.
  const videoUrl =
    (result as Record<string, string>).videoUrl ??
    (result as Record<string, string>).url ??
    (result as Record<string, string>).video ??
    (result as Record<string, string>).output ??
    null;

  const base64Video =
    (result as Record<string, string>).data ??
    (result as Record<string, string>).videoData ??
    null;

  if (videoUrl) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-green-400">Video Generated</h2>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full rounded-xl border border-gray-700"
        />
        <a
          href={videoUrl}
          download="generated-video.mp4"
          className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
        >
          Download Video
        </a>
      </div>
    );
  }

  if (base64Video) {
    const src = `data:video/mp4;base64,${base64Video}`;
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-green-400">Video Generated</h2>
        <video
          src={src}
          controls
          autoPlay
          className="w-full rounded-xl border border-gray-700"
        />
      </div>
    );
  }

  // Fallback: show raw response
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-green-400">Response Received</h2>
      <pre className="bg-gray-800 p-4 rounded-xl text-xs overflow-auto max-h-64">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
