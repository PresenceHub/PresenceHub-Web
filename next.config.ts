import type { NextConfig } from "next";

const useDockerFriendlyWatching =
  process.env.WATCHPACK_POLLING === "true" ||
  process.env.CHOKIDAR_USEPOLLING === "true";

const nextConfig: NextConfig = {
  output: "standalone",
  // Next 16 defaults to Turbopack; an empty object acknowledges that when a
  // `webpack` key also exists (e.g. Docker polling below). See:
  // https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
  turbopack: {},
  // Turbopack (`next dev`): polling for Docker bind mounts.
  ...(useDockerFriendlyWatching
    ? { watchOptions: { pollIntervalMs: 1000 } }
    : {}),
  // Webpack (`next dev --webpack`): env alone isn’t always enough; set poll explicitly.
  ...(useDockerFriendlyWatching
    ? {
        webpack: (config, { dev }) => {
          if (dev) {
            config.watchOptions = {
              poll: 1000,
              aggregateTimeout: 300,
            };
          }
          return config;
        },
      }
    : {}),
};

export default nextConfig;
