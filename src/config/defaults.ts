/**
 * Default configuration values
 */

import { SDKConfig } from "./config-schema";

/**
 * Default SDK configuration
 */
export const DEFAULT_CONFIG: Partial<SDKConfig> = {
  gatewayUrl: "http://localhost:9501",
  servicePrefixes: {
    auth: "auth",
    glassbook: "gb",
    keystone: "ks",
    vault: "vault",
  },
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  environment: "development",
  debug: false,
  partnerId: undefined,
};

/**
 * Production configuration
 */
export const PRODUCTION_CONFIG: Partial<SDKConfig> = {
  gatewayUrl: "https://gw.yield.fi",
  environment: "production",
  debug: false,
};

/**
 * Test configuration
 */
export const TEST_CONFIG: Partial<SDKConfig> = {
  gatewayUrl: "http://localhost:9501",
  environment: "test",
  debug: true,
  timeout: 5000,
  retryAttempts: 1,
};
