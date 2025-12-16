/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    domains: ['raw.githubusercontent.com'],
    unoptimized: true, // Disable Image Optimization
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     // Ignore 'self' references for the server-side build
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       self: false, // Avoid 'self' reference in server-side code
  //     };
  //   }
  //   return config;
  // },
}

module.exports = nextConfig