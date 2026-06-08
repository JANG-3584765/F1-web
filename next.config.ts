import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shphrkjoatkjbbxxdfih.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.bbc.co.uk',
      },
      {
        protocol: 'https',
        hostname: '**.autosport.com',
      },
      {
        protocol: 'https',
        hostname: '**.motorsport.com',
      },
      {
        protocol: 'https',
        hostname: '**.racefans.net',
      },
      {
        protocol: 'https',
        hostname: '**.the-race.com',
      },
      {
        protocol: 'https',
        hostname: '**.crash.net',
      },
      {
        protocol: 'https',
        hostname: '**.gpfans.com',
      },
      {
        protocol: 'https',
        hostname: '**.motorsportweek.com',
      },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
