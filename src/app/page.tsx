"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import VideoResult from "@/components/VideoResult";
import StatusIndicator from "@/components/StatusIndicator";
import { generateVideo, pollForVideo, fileToBase64 } from "@/lib/api";
import { AppStatus, GenerateVideoResponse } from "@/lib/types";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAttributes, setImageAttributes] = useState("");
  const [videoIdea, setVideoIdea] = useState("");
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [result, setResult] = useState<GenerateVideoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    imageFile && videoIdea.trim() && status !== "uploading" && status !== "analyzing" && status !== "generating";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile || !videoIdea.trim()) return;

    setResult(null);
    setError(null);

    try {
      setStatus("uploading");
      const base64 = await fileToBase64(imageFile);

      setStatus("analyzing");
      const { taskId } = await generateVideo({
        image: base64,
        imageAttributes: imageAttributes.trim(),
        videoIdea: videoIdea.trim(),
        duration,
      });

      setStatus("generating");
      const videoResult = await pollForVideo(taskId);

      setResult({ videoUrl: videoResult.videoUrl });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function handleReset() {
    setImageFile(null);
    setImagePreview(null);
    setImageAttributes("");
    setVideoIdea("");
    setDuration(10);
    setStatus("idle");
    setResult(null);
    setError(null);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Image to Video Generator
        </h1>
        <p className="mt-2 text-gray-400 text-sm">
          Upload an image, describe what you want, and RunwayML will generate a video.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reference Image
          </label>
          <ImageUpload
            onImageSelect={(file, preview) => {
              setImageFile(file);
              setImagePreview(preview);
            }}
            preview={imagePreview}
          />
        </div>

        {/* Image Attributes */}
        <div>
          <label
            htmlFor="attributes"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Image Attributes{" "}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="attributes"
            type="text"
            value={imageAttributes}
            onChange={(e) => setImageAttributes(e.target.value)}
            placeholder="e.g. sunset, beach, golden hour, wide angle"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Video Idea */}
        <div>
          <label
            htmlFor="idea"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Video Idea
          </label>
          <textarea
            id="idea"
            value={videoIdea}
            onChange={(e) => setVideoIdea(e.target.value)}
            placeholder="Describe the video you want to create from this image..."
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Duration */}
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Video Duration
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={5}>5 seconds</option>
            <option value={10}>10 seconds</option>
          </select>
        </div>

        {/* Status */}
        <StatusIndicator status={status} />

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
          >
            Generate Video
          </button>
          {(result || error) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-10">
          <VideoResult result={result} />
        </div>
      )}
    </main>
  );
}
