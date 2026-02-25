"use client";

import { AppStatus } from "@/lib/types";

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string }> = {
  idle: { label: "", color: "" },
  uploading: { label: "Preparing image...", color: "text-blue-400" },
  analyzing: { label: "AI is analyzing your image...", color: "text-yellow-400" },
  generating: { label: "RunwayML is generating your video — this may take a few minutes...", color: "text-purple-400" },
  done: { label: "Video ready!", color: "text-green-400" },
  error: { label: "Something went wrong", color: "text-red-400" },
};

export default function StatusIndicator({ status }: { status: AppStatus }) {
  if (status === "idle") return null;

  const { label, color } = STATUS_CONFIG[status];
  const isLoading = ["uploading", "analyzing", "generating"].includes(status);

  return (
    <div className={`flex items-center gap-3 ${color}`}>
      {isLoading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
