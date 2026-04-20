/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://bank.korzik.space/api/auth/v1/:path*',
      },
      {
        source: '/api/accounts/:path*',
        destination: 'https://bank.korzik.space/api/accounts/v1/:path*',
      },
      {
        source: '/api/transfers/:path*',
        destination: 'https://bank.korzik.space/api/transfers/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
