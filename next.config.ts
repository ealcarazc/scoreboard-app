import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  allowedDevOrigins: ['192.168.0.9', 'localhost'],
};

export default nextConfig;
