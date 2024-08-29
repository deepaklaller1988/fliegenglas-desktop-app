/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: "export",
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
