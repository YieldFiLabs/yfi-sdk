/**
 * YieldFi Contract Addresses
 * Source: https://docs.yield.fi/resources/contract-addresses
 */

/**
 * Supported blockchain networks
 */
export enum Chain {
  ETHEREUM = "ethereum",
  ARBITRUM = "arbitrum",
  BASE = "base",
  OPTIMISM = "optimism",
  SONIC = "sonic",
  PLUME = "plume",
  KATANA = "katana",
  BNB = "bnb",
  AVALANCHE = "avalanche",
  TAC = "tac",
}

/**
 * Chain IDs for each supported network
 */
export const CHAIN_IDS: Record<Chain, string> = {
  [Chain.ETHEREUM]: "1",
  [Chain.ARBITRUM]: "42161",
  [Chain.BASE]: "8453",
  [Chain.OPTIMISM]: "10",
  [Chain.SONIC]: "146",
  [Chain.PLUME]: "98866",
  [Chain.KATANA]: "747474",
  [Chain.BNB]: "56",
  [Chain.AVALANCHE]: "43114",
  [Chain.TAC]: "239",
};

/**
 * Contract types available on YieldFi
 */
export interface ChainContracts {
  /**
   * Manager contract address
   */
  manager?: string;

  /**
   * yUSD token contract address
   */
  yUSD?: string;

  /**
   * vyUSD token contract address
   */
  vyUSD?: string;

  /**
   * yBTC token contract address
   */
  yBTC?: string;

  /**
   * vyBTC token contract address
   */
  vyBTC?: string;

  /**
   * yETH token contract address
   */
  yETH?: string;

  /**
   * vyETH token contract address
   */
  vyETH?: string;
}

/**
 * Contract addresses per chain
 *
 * Source: https://docs.yield.fi/resources/contract-addresses
 *
 * Note: Empty strings indicate contracts that need to be populated with addresses
 * from the official documentation. Click through to each contract on the docs page
 * to get the specific deployment addresses.
 */
export const CONTRACT_ADDRESSES: Record<Chain, ChainContracts> = {
  [Chain.ETHEREUM]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x19Ebd191f7A24ECE672ba13A302212b5eF7F35cb",
    vyUSD: "0x2e3c5e514eef46727de1fe44618027a9b70d92fc",
    yBTC: "0xa01200b2e74DE6489cF56864E3d76BBc06fc6C43",
    vyBTC: "0x1e2a5622178f93EFd4349E2eB3DbDF2761749e1B",
    yETH: "0x8464F6eCAe1EA58EC816C13f964030eAb8Ec123A",
    vyETH: "0x3073112c2c4800b89764973d5790ccc7fba5c9f9",
  },
  [Chain.ARBITRUM]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.BASE]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.OPTIMISM]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.SONIC]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.PLUME]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.KATANA]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.BNB]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.AVALANCHE]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
  [Chain.TAC]: {
    manager: "0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC",
    yUSD: "0x4772D2e014F9fC3a820C444e3313968e9a5C8121",
    vyUSD: "0xF4F447E6AFa04c9D11Ef0e2fC0d7f19C24Ee55de",
  },
};

/**
 * Get contract addresses for a specific chain
 * @param chain The blockchain network
 * @returns Contract addresses for the specified chain
 *
 * @example
 * ```typescript
 * import { getContractAddresses, Chain } from 'yieldfi-sdk';
 *
 * const addresses = getContractAddresses(Chain.ETHEREUM);
 * console.log(addresses.yUSD); // yUSD contract address on Ethereum
 * ```
 */
export function getContractAddresses(chain: Chain): ChainContracts {
  return CONTRACT_ADDRESSES[chain] || {};
}

/**
 * Get a specific contract address for a chain
 * @param chain The blockchain network
 * @param contractType The type of contract (manager, yUSD, vyUSD, etc.)
 * @returns The contract address or undefined if not found
 *
 * @example
 * ```typescript
 * import { getContractAddress, Chain } from 'yieldfi-sdk';
 *
 * const yUSDAddress = getContractAddress(Chain.ETHEREUM, 'yUSD');
 * ```
 */
export function getContractAddress(
  chain: Chain,
  contractType: keyof ChainContracts,
): string | undefined {
  return CONTRACT_ADDRESSES[chain]?.[contractType];
}

/**
 * Get chain ID for a specific chain
 * @param chain The blockchain network
 * @returns The chain ID as a string
 *
 * @example
 * ```typescript
 * import { getChainId, Chain } from 'yieldfi-sdk';
 *
 * const chainId = getChainId(Chain.ETHEREUM); // '1'
 * ```
 */
export function getChainId(chain: Chain): string {
  return CHAIN_IDS[chain];
}

/**
 * Get chain by chain ID
 * @param chainId The chain ID as a string
 * @returns The chain enum or undefined if not found
 *
 * @example
 * ```typescript
 * import { getChainByChainId } from 'yieldfi-sdk';
 *
 * const chain = getChainByChainId('1'); // Chain.ETHEREUM
 * ```
 */
export function getChainByChainId(chainId: string): Chain | undefined {
  return Object.entries(CHAIN_IDS).find(([_, id]) => id === chainId)?.[0] as
    | Chain
    | undefined;
}

/**
 * Check if a chain is supported
 * @param chain The blockchain network
 * @returns True if the chain is supported
 *
 * @example
 * ```typescript
 * import { isChainSupported, Chain } from 'yieldfi-sdk';
 *
 * if (isChainSupported(Chain.ETHEREUM)) {
 *   // Chain is supported
 * }
 * ```
 */
export function isChainSupported(chain: Chain): boolean {
  return chain in CONTRACT_ADDRESSES;
}

/**
 * Get all supported chains
 * @returns Array of supported chains
 *
 * @example
 * ```typescript
 * import { getSupportedChains } from 'yieldfi-sdk';
 *
 * const chains = getSupportedChains();
 * // [Chain.ETHEREUM, Chain.ARBITRUM, ...]
 * ```
 */
export function getSupportedChains(): Chain[] {
  return Object.values(Chain);
}
