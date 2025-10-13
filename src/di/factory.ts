/**
 * Dependency container factory utilities
 */

import { DependencyContainer } from "./service-registry";

/**
 * Create a new dependency container instance
 */
export function createContainer(): DependencyContainer {
  return new DependencyContainer();
}

/**
 * Global default container instance
 */
export const defaultContainer = createContainer();
