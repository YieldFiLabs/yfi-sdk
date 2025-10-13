/**
 * User-Facing Contract Helpers
 *
 * Type-safe contract connections for YieldFi contracts.
 * Users should instantiate contracts using ethers.js Contract class with the appropriate ABI.
 *
 * @example
 * ```typescript
 * import { Contract } from 'ethers';
 * import type { Manager, YToken, VyToken } from 'yieldfi-sdk';
 *
 * // You need to provide your own ABI (from contract compilation or block explorer)
 * const managerAbi = [...]; // Your Manager contract ABI
 * const yTokenAbi = [...];  // Your YToken contract ABI
 * const vyTokenAbi = [...]; // Your vyToken contract ABI
 *
 * // Create typed contract instances
 * const manager = new Contract(managerAddress, managerAbi, provider) as unknown as Manager;
 * const yUSD = new Contract(yUSDAddress, yTokenAbi, signer) as unknown as YToken;
 * const vyUSD = new Contract(vyUSDAddress, vyTokenAbi, signer) as unknown as VyToken;
 *
 * // Now you have full type safety
 * await manager.deposit(yUSDAddress, assetAddress, amount, receiver, ethers.ZeroAddress, "0x", "0x");
 * await yUSD.balanceOf(userAddress);
 * await vyUSD.depositYToken(receiver, yTokenAmount);
 * ```
 */

import type { Manager, YToken, VyToken } from "./contracts";
import { Contract, type ContractRunner, type InterfaceAbi } from "ethers";

/**
 * Connect to Manager contract
 * Note: You must provide the Manager ABI from your contract compilation
 *
 * @param address Contract address
 * @param abi Contract ABI array
 * @param runner Provider or Signer
 * @returns Manager contract instance with full typing
 */
export function connectManager(
  address: string,
  abi: InterfaceAbi,
  runner: ContractRunner,
): Manager {
  return new Contract(address, abi, runner) as unknown as Manager;
}

/**
 * Connect to YToken contract
 * Note: You must provide the YToken ABI from your contract compilation
 *
 * @param address Contract address
 * @param abi Contract ABI array
 * @param runner Provider or Signer
 * @returns YToken contract instance with full typing
 */
export function connectYToken(
  address: string,
  abi: InterfaceAbi,
  runner: ContractRunner,
): YToken {
  return new Contract(address, abi, runner) as unknown as YToken;
}

/**
 * Connect to vyToken contract
 * Note: You must provide the vyToken ABI from your contract compilation
 *
 * @param address Contract address
 * @param abi Contract ABI array
 * @param runner Provider or Signer
 * @returns vyToken contract instance with full typing
 */
export function connectVyToken(
  address: string,
  abi: InterfaceAbi,
  runner: ContractRunner,
): VyToken {
  return new Contract(address, abi, runner) as unknown as VyToken;
}
