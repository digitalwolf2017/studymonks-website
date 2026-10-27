import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Explicitly type config as 'any'
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
