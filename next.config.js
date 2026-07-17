/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["10.34.159.218"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "rwqolvjfhxklnttkfuzk.supabase.co",
      },
    ],
    
  },
};

module.exports = nextConfig;
