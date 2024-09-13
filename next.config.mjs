/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
