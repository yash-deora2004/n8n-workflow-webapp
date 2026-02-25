import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image to Video Generator",
  description: "Upload an image and generate a cinematic video with RunwayML",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
