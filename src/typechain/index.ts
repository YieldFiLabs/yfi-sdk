/**
 * YieldFi Contract Types
 *
 * Type-safe smart contract interactions using ethers.js.
 * Provides TypeScript types for Manager (legacy), ManagerV3, VaultContract (v3), YToken, and vyToken contracts.
 *
 * @example Basic Usage with Helper Functions
 * ```typescript
 * import {
 *   connectManager,
 *   connectManagerV3,
 *   connectVault,
 *   connectYToken,
 *   connectVyToken,
 *   CONTRACT_ADDRESSES,
 *   Chain
 * } from 'yieldfi-sdk';
 *
 * // You need to provide ABIs from your contract compilation or block explorer
 * const managerAbi = [...];     // Your Manager (legacy) ABI
 * const managerV3Abi = [...];  // Your Manager v3 ABI
 * const vaultAbi = [...];      // Your Vault v3 ABI
 * const yTokenAbi = [...];     // Your YToken ABI
 * const vyTokenAbi = [...];    // Your vyToken ABI
 *
 * // Connect with full type safety
 * const manager = connectManager(
 *   CONTRACT_ADDRESSES[Chain.ETHEREUM].manager,
 *   managerAbi,
 *   provider
 * );
 * const managerV3 = connectManagerV3(
 *   managerV3Address,
 *   managerV3Abi,
 *   provider
 * );
 * const vault = connectVault(
 *   vaultAddress,
 *   vaultAbi,
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
 * import type { Manager, ManagerV3, VaultContract, YToken, VyToken } from 'yieldfi-sdk';
 *
 * const manager = new Contract(address, managerAbi, provider) as unknown as Manager;
 * const managerV3 = new Contract(address, managerV3Abi, provider) as unknown as ManagerV3;
 * const vault = new Contract(address, vaultAbi, provider) as unknown as VaultContract;
 * const yToken = new Contract(address, yTokenAbi, signer) as unknown as YToken;
 * const vyToken = new Contract(address, vyTokenAbi, signer) as unknown as VyToken;
 * ```
 *
 * @example ABI Type Definitions
 * ```typescript
 * import { ManagerABI, YTokenABI, VyTokenABI } from 'yieldfi-sdk';
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
