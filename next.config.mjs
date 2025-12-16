/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // static export mode (replaces legacy next export)
  output: "export",
  // for project pages (https://user.github.io/repo) set basePath & assetPrefix
  // basePath: repoName ? `/${repoName}` : "",
  // assetPrefix: repoName ? `/${repoName}/` : "",
  // export to folder/index.html (works well on GH Pages)
  trailingSlash: true,
  // disable built-in image optimizer (not available on static hosts)
  images: {
    domains: ['raw.githubusercontent.com'],
    unoptimized: true, // Disable Image Optimization
  },
};

export default nextConfig;