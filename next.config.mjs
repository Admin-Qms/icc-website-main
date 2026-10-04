/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // Every page exports as <route>/index.html so a plain Apache host (cPanel) serves
  // /blog, /services and /industries without rewrite rules.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
