"use client";
import dynamic from "next/dynamic";

const DynamicVideoUI = dynamic(() => import("./video-ui-kit"), { ssr: false });

export default function VideoCall() {
  try {
    return <DynamicVideoUI />;
  } catch (error) {
    console.error("Error rendering VideoUI:", error);
    return <div>Error loading the video call. Please try again.</div>;
  }
}
