/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cms-builder/core"],
  experimental: {
    allowedDevOrigins: ["202.179.6.77"],
  },
};

export default nextConfig;
