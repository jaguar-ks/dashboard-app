import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for WSL file watching issues on Windows mounts (/mnt/c/...)
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every 1000ms (1 second)
      aggregateTimeout: 300, // Delay before rebuilding
    };
    return config;
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
