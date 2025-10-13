/**
 * Service names for DI container
 */

export const SERVICE_NAMES = {
  // Configuration
  CONFIG: "config",

  // Core services
  HTTP_CLIENT: "httpClient",

  // API clients
  AUTH_API: "authAPI",
  GLASSBOOK_API: "glassbookAPI",
} as const;

export type ServiceName = (typeof SERVICE_NAMES)[keyof typeof SERVICE_NAMES];
