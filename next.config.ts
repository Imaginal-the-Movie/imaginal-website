import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the local testing badge from covering embedded-player controls.
  devIndicators: false,
};

export default nextConfig;
