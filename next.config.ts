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
  // 导出时跳过的路由（API routes 在纯静态模式下不可用）
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/onboarding/': { page: '/onboarding' },
      '/assessment/': { page: '/assessment' },
      '/campus/': { page: '/campus' },
      '/campus/academic/major-analysis/': { page: '/campus/academic/major-analysis' },
      '/campus/navigator/radar/': { page: '/campus/navigator/radar' },
      '/career-path/': { page: '/career-path' },
      '/chat-history/': { page: '/chat-history' },
      '/graduation/': { page: '/graduation' },
      '/graduation/career/jd-analyzer/': { page: '/graduation/career/jd-analyzer' },
      '/graduation/compass/city-match/': { page: '/graduation/compass/city-match' },
      '/graduation/family-bridge/': { page: '/graduation/family-bridge' },
      '/internships/': { page: '/internships' },
      '/profile/': { page: '/profile' },
    };
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
