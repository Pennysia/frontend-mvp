/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove local SDK configuration for deployment
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig
