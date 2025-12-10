import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all https hosts
      },
      {
        protocol: 'http',
        hostname: '**', // (optional) allow http too
      },
    ],
  },
}

export default nextConfig
