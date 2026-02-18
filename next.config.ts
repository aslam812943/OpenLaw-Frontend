import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'react-globe.gl', 'three-globe'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
