/**
 * YieldFi Contract TypeChain Types
 *
 * These are TypeScript types for YieldFi smart contracts.
 */

// Export Manager contract types (legacy)
export type { Manager, ManagerInterface } from "./Manager";

// Export YToken contract types
export type { YToken, YTokenInterface } from "./YToken";

// Export vyToken contract types
export type { VyToken, VyTokenInterface } from "./vyToken";

// Export v3 contracts
export * from "./v3";
