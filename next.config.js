/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    if (!config.externals) config.externals = [];
    config.externals.push('googleapis'); // prevent Next.js from bundling it
    return config;
  },
};

module.exports = nextConfig;
