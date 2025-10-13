/**
 * YieldFi Contract Types
 *
 * Type-safe smart contract interactions using ethers.js.
 * Provides TypeScript types for Manager, YToken, and vyToken contracts.
 *
 * @example Basic Usage with Helper Functions
 * ```typescript
 * import {
 *   connectManager,
 *   connectYToken,
 *   connectVyToken,
 *   CONTRACT_ADDRESSES,
 *   Chain
 * } from '@yfi/sdk';
 *
 * // You need to provide ABIs from your contract compilation or block explorer
 * const managerAbi = [...]; // Your Manager ABI
 * const yTokenAbi = [...];  // Your YToken ABI
 * const vyTokenAbi = [...]; // Your vyToken ABI
 *
 * // Connect with full type safety
 * const manager = connectManager(
 *   CONTRACT_ADDRESSES[Chain.ETHEREUM].manager,
 *   managerAbi,
 *   provider
 * );
 * const yUSD = connectYToken(
 *   CONTRACT_ADDRESSES[Chain.ETHEREUM].yUSD,
 *   yTokenAbi,
 *   signer
 * );
 * const vyUSD = connectVyToken(
 *   CONTRACT_ADDRESSES[Chain.ETHEREUM].vyUSD,
 *   vyTokenAbi,
 *   signer
 * );
 * ```
 *
 * @example Using ethers.Contract Directly
 * ```typescript
 * import { Contract } from 'ethers';
 * import type { Manager, YToken, VyToken } from '@yfi/sdk';
 *
 * const manager = new Contract(address, managerAbi, provider) as unknown as Manager;
 * const yToken = new Contract(address, yTokenAbi, signer) as unknown as YToken;
 * const vyToken = new Contract(address, vyTokenAbi, signer) as unknown as VyToken;
 * ```
 *
 * @example ABI Type Definitions
 * ```typescript
 * import { ManagerABI, YTokenABI, VyTokenABI } from '@yfi/sdk';
 *
 * // Use ABI types for documentation and type extraction
 * type DepositParams = Parameters<ManagerABI.UserMethods['deposit']>;
 * type VyTokenGuardrail = ReturnType<VyTokenABI.ViewMethods['guardrailMultiplier']>;
 * ```
 */

// Core contract type exports
export * from "./contracts";

// Helper functions for contract connections
export * from "./user-facing";

// Simplified ABI type definitions (for documentation and type checking)
export * from "./abi";
