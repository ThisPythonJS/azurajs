import { createMDX } from 'fumadocs-mdx/next';
import { NextConfig } from 'next';

const withMDX = createMDX();

const config: NextConfig = {
  distDir: "dist",
  reactStrictMode: true,
};

export default withMDX(config);
