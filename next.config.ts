import type { NextConfig } from 'next';

// The custom domain serves the GitHub Pages export at https://ziadg.com/.
const basePath = '';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'portfolio',
  assetPrefix: basePath,
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Exposed for public-folder assets, which next/image does not prefix with basePath.
  env: {
    NEXT_PUBLIC_ASSET_PREFIX: basePath,
  },
};

export default nextConfig;
