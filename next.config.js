/** @type {import('next').NextConfig} */

const { config } = require('dotenv-safe');

config({
  allowEmptyValues: false,
  example: '.env.example',
});


const nextConfig = {};


module.exports = nextConfig;

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },
};
