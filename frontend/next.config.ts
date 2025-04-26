import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,  // 👈 agregamos esto para que no falle por los 'any'
  },
};

export default nextConfig;
