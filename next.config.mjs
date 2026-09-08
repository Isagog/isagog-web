const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empty at the domain root; "/isagog-web" for the staging deploy.
  basePath,
  // Static export has no image optimizer; emit plain <img> tags.
  images: { unoptimized: true },
  // Fully static HTML/JS export into ./out — no server runtime required.
  output: "export",
  // Emit each route as <route>/index.html for maximum static-host portability.
  trailingSlash: true,
};

export default nextConfig;
