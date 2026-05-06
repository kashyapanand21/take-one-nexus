/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we can use the project as a full-stack app if needed
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
