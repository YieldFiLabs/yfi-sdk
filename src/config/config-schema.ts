/**
 * Configuration schema for the YieldFi SDK
 */

import { z } from "zod";

/**
 * SDK configuration schema
 */
export const SDKConfigSchema = z.object({
  /**
   * Gateway URL
   */
  gatewayUrl: z.string().url().default("https://gw.yield.fi"),

  /**
   * Service prefixes for routing
   */
  servicePrefixes: z
    .object({
      auth: z.string().default("auth"),
      glassbook: z.string().default("gb"),
      keystone: z.string().default("ks"),
    })
    .default({
      auth: "auth",
      glassbook: "gb",
      keystone: "ks",
    }),

  /**
   * Request timeout in milliseconds
   */
  timeout: z.number().min(1000).max(60000).default(30000),

  /**
   * Number of retry attempts for failed requests
   */
  retryAttempts: z.number().min(0).max(5).default(3),

  /**
   * Delay between retry attempts in milliseconds
   */
  retryDelay: z.number().min(100).max(10000).default(1000),

  /**
   * Environment
   */
  environment: z
    .enum(["development", "production", "test"])
    .default("development"),

  /**
   * Enable debug logging
   */
  debug: z.boolean().default(false),

  /**
   * Partner ID for tracking and analytics
   */
  partnerId: z.string().optional(),
});

/**
 * SDK configuration type
 */
export type SDKConfig = z.infer<typeof SDKConfigSchema>;
