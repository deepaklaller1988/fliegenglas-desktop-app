/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  // assetPrefix: './',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },

    ],
  },
};

export default nextConfig;
