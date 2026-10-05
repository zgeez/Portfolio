import type { NextConfig } from 'next';

// Deployed to GitHub Pages at https://zgeez.github.io/portfolio/.
// Set to false for local development or root-domain deployment.
const isGitHubPages = true;
const basePath = isGitHubPages ? '/portfolio' : '';

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
