import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  allowedDevOrigins: ['terminal.local'],
};

export default nextConfig;
