/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // 纯静态导出，适配 Cloudflare Pages（不支持 SSR/API routes）
  output: 'export',
  // 静态导出时，构建产物默认输出到 out/ 目录
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config: any, { isServer, dev }: { isServer: boolean, dev: boolean }) => {
    if (!dev) {
      config.cache = false;
    }
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
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
