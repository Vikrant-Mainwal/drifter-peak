/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "oyyqjuvdfptzjeamfikq.supabase.co",
      },
    ],
    
  },
};

module.exports = nextConfig;
