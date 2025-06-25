import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  basePath: '/projects/fitrosa',   /* for vercel deployment with base path so we can access the app from the root domain and using the other projects in the same domain  */

  images: {
    domains: ['i.imgur.com'],
  },
}

export default nextConfig;
