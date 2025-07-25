import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Vercel deployment
  experimental: {
    esmExternals: 'loose'
  },
  // Optimize for production
  swcMinify: true,
  // Enable React strict mode
  reactStrictMode: true
};

export default nextConfig;
