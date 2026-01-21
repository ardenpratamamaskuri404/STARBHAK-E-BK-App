// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // INI SOLUSI RESMI NEXT.JS BUAT GAMBAR LOKAL!
  },
};

export default nextConfig;