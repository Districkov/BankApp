/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/v1/:path*',
        destination: 'https://bank.korzik.space/api/auth/v1/:path*',
      },
      {
        source: '/api/accounts/v1/:path*',
        destination: 'https://bank.korzik.space/api/accounts/v1/:path*',
      },
      {
        source: '/api/transfers/v1/:path*',
        destination: 'https://bank.korzik.space/api/transfers/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
