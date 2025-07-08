import type {NextConfig} from 'next';

// Set this to true when deploying to GitHub Pages at username.github.io/portfolio
// Set to false for local development or root domain deployment
const isGitHubPages = true;

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: isGitHubPages ? '/portfolio/' : '',
  basePath: isGitHubPages ? '/portfolio' : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Add this line for static HTML export compatibility with next/image
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;