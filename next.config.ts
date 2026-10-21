import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The floating dev badge covers the sidebar and exam "Назад" button during design reviews.
  devIndicators: false,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
