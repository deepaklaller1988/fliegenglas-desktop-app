/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  // assetPrefix: './',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
