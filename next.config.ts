/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora os erros de código chato durante o deploy
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipagem durante o deploy
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
