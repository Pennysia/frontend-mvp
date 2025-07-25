import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  swcMinify: true,
  // Enable React strict mode
  reactStrictMode: true
};

export default nextConfig;
