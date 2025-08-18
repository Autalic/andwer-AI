/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    if (!config.externals) config.externals = [];
    config.externals.push('googleapis'); 
    return config;
  },
};

module.exports = nextConfig;
