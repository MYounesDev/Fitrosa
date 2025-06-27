import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/projects/fitrosa';

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  basePath: basePath,   /* for vercel deployment with base path so we can access the app from the root domain and using the other projects in the same domain  */
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    domains: ['i.imgur.com'],
  },
}

export default nextConfig;
