/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
