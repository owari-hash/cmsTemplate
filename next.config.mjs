/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cms-builder/core"],
  allowedDevOrigins: ["202.179.6.77"],
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /**
   * Allow embedding the public site in clientAdmin (or other tools) via iframe.
   * Set CMS_FRAME_ANCESTORS to a space-separated list of origins, e.g.
   * "http://localhost:3001 http://127.0.0.1:3001"
   */
  async headers() {
    const fa = process.env.CMS_FRAME_ANCESTORS?.trim()
    if (!fa) return []
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${fa}`,
          },
        ],
      },
    ]
  },
}

export default nextConfig
