/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // Every page exports as <route>/index.html so a plain Apache host (cPanel) serves
  // /blog, /services and /industries without rewrite rules.
  trailingSlash: true,
  // Static export has no image server: lib/imagekit-loader.ts sends next/image
  // requests to ImageKit, which resizes the deployed files to the width each device needs.
  images: {
    loader: "custom",
    loaderFile: "./lib/imagekit-loader.ts",
  },
};

export default nextConfig;
