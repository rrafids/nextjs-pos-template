/** @type {import('next').NextConfig} */
const repoName = "nextjs-pos-template";

const nextConfig = {
  reactStrictMode: true,
  // Produce a fully static site
  output: "export",
  // Required for GitHub project pages: prefix URLs with the repo name
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;