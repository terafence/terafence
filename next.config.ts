/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/webmail',
        destination: 'https://mail.terafence.in/webmail',
        permanent: true,
      },
    ];
  },
  webpack: (config: {
    resolve: {
      alias?: Record<string, string | false>;
      fallback?: Record<string, string | false>;
    }
  }, { isServer }: { isServer: boolean }) => {
    // Handle node: protocol imports
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:events': require.resolve('events/'),
      'node:fs': false,
      'node:path': false,
      'node:util': require.resolve('util/'),
      'node:stream': require.resolve('stream-browserify')
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: require.resolve('stream-browserify'),
        net: false,
        tls: false,
        http: false,
        https: false,
        child_process: false,
        os: false,
        http2: false,
        zlib: false,
        events: require.resolve('events/'),
        util: require.resolve('util/'),
      };
    }
    return config;
  },
};

export default nextConfig;