/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Add CSS and PostCSS loaders
    config.module.rules.push({
      test: /.*\.css$/,
      use: [
        isServer ? 'thread-loader' : 'style-loader',
        'css-loader',
        'postcss-loader',
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
