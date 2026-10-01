"use client";

import React, { useState } from "react";
import { Monitor, Camera, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ScreenCaptureProps {
  onCaptureComplete: (base64Image: string) => void;
  onError: (errorMsg: string) => void;
  isCapturing: boolean;
}

/**
 * ScreenCapture utility component using navigator.mediaDevices.getDisplayMedia
 * Captures screen frame ephemerally in memory without saving to disk.
 */
export const captureScreenFrame = async (): Promise<string> => {
  if (typeof window === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen sharing is not supported by your browser environment.");
  }

  // 1. Request Display Media stream
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "monitor",
    },
    audio: false,
  });

  const video = document.createElement("video");
  video.srcObject = stream;
  await video.play();

  // 2. Draw current video frame to canvas
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 1920;
  canvas.height = video.videoHeight || 1080;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    stream.getTracks().forEach((track) => track.stop());
    throw new Error("Failed to initialize canvas render context.");
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert frame to base64 jpeg
  const base64Data = canvas.toDataURL("image/jpeg", 0.75);

  // 3. Immediately stop all screen tracks to maintain privacy & memory efficiency
  stream.getTracks().forEach((track) => track.stop());

  return base64Data;
};

export const ScreenCapture: React.FC<ScreenCaptureProps> = ({
  onCaptureComplete,
  onError,
  isCapturing,
}) => {
  const handleStartCapture = async () => {
    try {
      const base64Img = await captureScreenFrame();
      onCaptureComplete(base64Img);
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        onError("Screen capture permission was denied by the user.");
      } else {
        onError(err.message || "Failed to capture desktop screen state.");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleStartCapture}
      disabled={isCapturing}
      className={`p-2.5 rounded-lg border transition-all ${
        isCapturing
          ? "bg-cyan-950/80 border-cyan-500 text-cyan-400 animate-pulse"
          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-cyan-500/40"
      }`}
      title="Capture Live Desktop Perception (Screen Vision)"
    >
      <Monitor className="w-4 h-4" />
    </button>
  );
};
