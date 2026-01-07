import type { ConfigTypes } from "../package/src/shared/config/ConfigModule";

const config: ConfigTypes = {
  environment: "development",
  server: {
    port: 3000,
    cluster: false,
    ipHost: false,
    https: false,
  },
  plugins: {
    rateLimit: {
      enabled: false,
      limit: 100,
      timeframe: 60000, // 1 minuto em ms
    },
    cors: {
      enabled: true,
      origins: ["*"],
    },
  },
  logging: {
    enabled: true,
    showDetails: true,
  },
};

export default config;
