import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
        if (isServer) {
            config.ignoreWarnings = [
                { module: /opentelemetry/, },
            ]
        }
        return config
    },
};

export default nextConfig;
