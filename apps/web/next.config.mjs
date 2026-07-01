/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@purebook/db'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}
export default nextConfig
