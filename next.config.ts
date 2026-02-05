import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['placehold.co', 'cdn.shopify.com'],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
