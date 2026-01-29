/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "fct-backend.techtenets.com",
        pathname: "/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
