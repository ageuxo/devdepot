import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['localhost', process.env.REMOTE_DEV_ADDR!]
};

export default nextConfig;
