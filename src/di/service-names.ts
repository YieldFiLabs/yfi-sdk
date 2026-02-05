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
  VAULT_API: "vaultAPI",
  ONBOARDING_API: "onboardingAPI",
  CURATOR_HANDOFF_API: "curatorHandoffAPI",
  POINTS_API: "pointsAPI",
} as const;

export type ServiceName = (typeof SERVICE_NAMES)[keyof typeof SERVICE_NAMES];
