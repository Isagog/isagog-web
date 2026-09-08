/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export has no image optimizer; emit plain <img> tags.
  images: { unoptimized: true },
  // Fully static HTML/JS export into ./out — no server runtime required.
  output: "export",
  // Emit each route as <route>/index.html for maximum static-host portability.
  trailingSlash: true,
};

export default nextConfig;
