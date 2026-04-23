/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // 优化 webpack 打包
  webpack: (config: any, { isServer, dev }: { isServer: boolean, dev: boolean }) => {
    // 生产环境禁用持久化缓存
    if (!dev) {
      config.cache = false;
    }

    // 客户端代码拆分优化
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 50,
        minSize: 10000,
        maxSize: 20000000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context?.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              if (packageName) {
                const name = packageName[1];
                if (name.startsWith('@')) {
                  const [scope, pkg] = name.split('/');
                  return `npm.${scope}.${pkg}`;
                }
                return `npm.${name}`;
              }
              return 'vendor';
            },
            reuseExistingChunk: true,
            enforce: true,
          },
          default: {
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }
    config.optimization.minimize = true;
    return config;
  },

  // 生产环境禁用 source map
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
