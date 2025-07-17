import type {NextConfig} from 'next';

// Set this to true when deploying to GitHub Pages at username.github.io/portfolio
// Set to false for local development or root domain deployment
const isGitHubPages = false;

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'portfolio',
  assetPrefix: isGitHubPages ? '/portfolio' : '',
  basePath: isGitHubPages ? '/portfolio' : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Expose asset prefix for public assets (e.g., in public folder)
  env: {
    NEXT_PUBLIC_ASSET_PREFIX: isGitHubPages ? '/portfolio' : '',
  },
};

export default nextConfig;