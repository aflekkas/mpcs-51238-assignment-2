import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        // Allow user-provided image URLs from any HTTPS source
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
