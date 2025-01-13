import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {hostname: "notable-jellyfish-523.convex.cloud"},
      {hostname: "oaidalleapiprodscus.blob.core.windows.net"}
    ]
  }
};

export default nextConfig;
