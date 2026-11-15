/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: { serverComponentsExternalPackages: ['pdf-parse', '@prisma/client', 'bcryptjs'] },
};
