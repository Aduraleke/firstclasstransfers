// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "92.113.29.160",
      port: "1805",
      pathname: "/**",
    },
  ],
},

};

export default nextConfig;
