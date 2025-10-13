/**
 * YieldFi Contract ABI Type Definitions
 *
 * Simplified, human-readable type definitions for YieldFi smart contracts.
 * These types focus on method signatures and are easier to understand than
 * the full TypeChain types.
 *
 * For actual contract interaction, use the connect functions from the SDK:
 * - connectManager() for Manager contract
 * - connectYToken() for YToken contracts
 * - connectVyToken() for vyToken contracts
 *
 * @example
 * ```typescript
 * import { ManagerABI, YTokenABI, VyTokenABI } from '@yfi/sdk';
 *
 * // Use these types for documentation and type checking
 * type DepositParams = Parameters<ManagerABI.UserMethods['deposit']>;
 * type BalanceOfReturn = ReturnType<YTokenABI.ERC20Methods['balanceOf']>;
 * type GuardrailReturn = ReturnType<VyTokenABI.ViewMethods['guardrailMultiplier']>;
 * ```
 */

export * from "./Manager.abi";
export * from "./YToken.abi";
export * from "./vyToken.abi";
