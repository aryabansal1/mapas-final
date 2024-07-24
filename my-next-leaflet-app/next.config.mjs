/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://crm.emergente.com.co/:path*' // Proxy to Backend
        }
      ]
    }
  };
  
  export default nextConfig;
  