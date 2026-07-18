import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vinext sert les ressources publiques directement. Cela évite que le
  // chargeur Next/Image tente d'utiliser un binding d'assets inexistant.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
