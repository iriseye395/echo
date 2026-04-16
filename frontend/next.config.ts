import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Avoid noisy server-side fetch failures in development when local asset hosts are offline.
    unoptimized: process.env.NODE_ENV !== "production",
    // Required for local MCP/design asset hosts that resolve to 127.0.0.1/::1 in development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3845",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
