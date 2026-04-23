/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // 输出模式：独立部署
  output: 'standalone',
  
  // 优化 webpack 打包，减小输出文件体积
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // 排除不必要的文件
    if (!isServer) {
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
  
  // 压缩静态资源
  compress: true,
  
  // 生产环境禁用 source map
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
