import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
