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
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context?.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              if (packageName) {
                return `npm.${packageName[1].replace('@', '')}`;
              }
              return 'vendor';
            },
          },
        },
      };
    }
    return config;
  },
  
  // 压缩静态资源
  compress: true,
  
  // 生产环境禁用 source map
  productionBrowserSourceMaps: false,
};

export default nextConfig;
