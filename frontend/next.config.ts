import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // @ts-ignore - Next 15/16 specific typing
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.0.105',
    '192.168.0.105:3000',
    '192.168.0.101',
    '192.168.0.101:3000',
  ],
};

export default nextConfig;
