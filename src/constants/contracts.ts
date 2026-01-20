/**
 * YieldFi Contract Addresses
 * Source: https://docs.yield.fi/resources/contract-addresses
 */

/**
 * Supported blockchain networks (Mainnet)
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
 * Supported blockchain testnet networks
 */
export enum TestnetChain {
  ETHEREUM_SEPOLIA = "ethereum-sepolia",
  ARBITRUM_SEPOLIA = "arbitrum-sepolia",
  BASE_SEPOLIA = "base-sepolia",
  OPTIMISM_SEPOLIA = "optimism-sepolia",
  BNB_TESTNET = "bnb-testnet",
  AVALANCHE_FUJI = "avalanche-fuji",
}

/**
 * Chain IDs for each supported mainnet network
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
 * Native gas token symbols for each supported mainnet network
 */
export const CHAIN_GAS_SYMBOLS: Record<Chain, string> = {
  [Chain.ETHEREUM]: "ETH",
  [Chain.ARBITRUM]: "ETH",
  [Chain.BASE]: "ETH",
  [Chain.OPTIMISM]: "ETH",
  [Chain.SONIC]: "SONIC",
  [Chain.PLUME]: "ETH",
  [Chain.KATANA]: "ETH",
  [Chain.BNB]: "BNB",
  [Chain.AVALANCHE]: "AVAX",
  [Chain.TAC]: "TAC",
};

/**
 * Chain IDs for each supported testnet network
 */
export const TESTNET_CHAIN_IDS: Record<TestnetChain, string> = {
  [TestnetChain.ETHEREUM_SEPOLIA]: "11155111",
  [TestnetChain.ARBITRUM_SEPOLIA]: "421614",
  [TestnetChain.BASE_SEPOLIA]: "84532",
  [TestnetChain.OPTIMISM_SEPOLIA]: "11155420",
  [TestnetChain.BNB_TESTNET]: "97",
  [TestnetChain.AVALANCHE_FUJI]: "43113",
};

/**
 * Native gas token symbols for each supported testnet network
 */
export const TESTNET_CHAIN_GAS_SYMBOLS: Record<TestnetChain, string> = {
  [TestnetChain.ETHEREUM_SEPOLIA]: "ETH",
  [TestnetChain.ARBITRUM_SEPOLIA]: "ETH",
  [TestnetChain.BASE_SEPOLIA]: "ETH",
  [TestnetChain.OPTIMISM_SEPOLIA]: "ETH",
  [TestnetChain.BNB_TESTNET]: "BNB",
  [TestnetChain.AVALANCHE_FUJI]: "AVAX",
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
 * Contract addresses per mainnet chain
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
 * Contract addresses per testnet chain
 *
 * Source: Testnet deployments
 *
 * Note: These addresses need to be populated with actual testnet deployment addresses.
 * Update these when testnet contracts are deployed.
 */
export const TESTNET_CONTRACT_ADDRESSES: Record<TestnetChain, ChainContracts> = {
  [TestnetChain.ETHEREUM_SEPOLIA]: {
    // TODO: Add testnet contract addresses when deployed
  },
  [TestnetChain.ARBITRUM_SEPOLIA]: {
    // TODO: Add testnet contract addresses when deployed
  },
  [TestnetChain.BASE_SEPOLIA]: {
    // TODO: Add testnet contract addresses when deployed
  },
  [TestnetChain.OPTIMISM_SEPOLIA]: {
    // TODO: Add testnet contract addresses when deployed
  },
  [TestnetChain.BNB_TESTNET]: {
    // TODO: Add testnet contract addresses when deployed
  },
  [TestnetChain.AVALANCHE_FUJI]: {
    // TODO: Add testnet contract addresses when deployed
  },
};

/**
 * Get contract addresses for a specific mainnet chain
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
 * Get contract addresses for a specific testnet chain
 * @param chain The testnet blockchain network
 * @returns Contract addresses for the specified testnet chain
 *
 * @example
 * ```typescript
 * import { getTestnetContractAddresses, TestnetChain } from 'yieldfi-sdk';
 *
 * const addresses = getTestnetContractAddresses(TestnetChain.ETHEREUM_SEPOLIA);
 * console.log(addresses.yUSD); // yUSD contract address on Ethereum Sepolia
 * ```
 */
export function getTestnetContractAddresses(
  chain: TestnetChain,
): ChainContracts {
  return TESTNET_CONTRACT_ADDRESSES[chain] || {};
}

/**
 * Get a specific contract address for a mainnet chain
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
 * Get a specific contract address for a testnet chain
 * @param chain The testnet blockchain network
 * @param contractType The type of contract (manager, yUSD, vyUSD, etc.)
 * @returns The contract address or undefined if not found
 *
 * @example
 * ```typescript
 * import { getTestnetContractAddress, TestnetChain } from 'yieldfi-sdk';
 *
 * const yUSDAddress = getTestnetContractAddress(TestnetChain.ETHEREUM_SEPOLIA, 'yUSD');
 * ```
 */
export function getTestnetContractAddress(
  chain: TestnetChain,
  contractType: keyof ChainContracts,
): string | undefined {
  return TESTNET_CONTRACT_ADDRESSES[chain]?.[contractType];
}

/**
 * Get chain ID for a specific mainnet chain
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
 * Get chain ID for a specific testnet chain
 * @param chain The testnet blockchain network
 * @returns The chain ID as a string
 *
 * @example
 * ```typescript
 * import { getTestnetChainId, TestnetChain } from 'yieldfi-sdk';
 *
 * const chainId = getTestnetChainId(TestnetChain.ETHEREUM_SEPOLIA); // '11155111'
 * ```
 */
export function getTestnetChainId(chain: TestnetChain): string {
  return TESTNET_CHAIN_IDS[chain];
}

/**
 * Get mainnet chain by chain ID
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
 * Get testnet chain by chain ID
 * @param chainId The chain ID as a string
 * @returns The testnet chain enum or undefined if not found
 *
 * @example
 * ```typescript
 * import { getTestnetChainByChainId } from 'yieldfi-sdk';
 *
 * const chain = getTestnetChainByChainId('11155111'); // TestnetChain.ETHEREUM_SEPOLIA
 * ```
 */
export function getTestnetChainByChainId(
  chainId: string,
): TestnetChain | undefined {
  return Object.entries(TESTNET_CHAIN_IDS).find(
    ([_, id]) => id === chainId,
  )?.[0] as TestnetChain | undefined;
}

/**
 * Check if a mainnet chain is supported
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
 * Check if a testnet chain is supported
 * @param chain The testnet blockchain network
 * @returns True if the testnet chain is supported
 *
 * @example
 * ```typescript
 * import { isTestnetChainSupported, TestnetChain } from 'yieldfi-sdk';
 *
 * if (isTestnetChainSupported(TestnetChain.ETHEREUM_SEPOLIA)) {
 *   // Testnet chain is supported
 * }
 * ```
 */
export function isTestnetChainSupported(chain: TestnetChain): boolean {
  return chain in TESTNET_CONTRACT_ADDRESSES;
}

/**
 * Get all supported mainnet chains
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

/**
 * Get all supported testnet chains
 * @returns Array of supported testnet chains
 *
 * @example
 * ```typescript
 * import { getSupportedTestnetChains } from 'yieldfi-sdk';
 *
 * const chains = getSupportedTestnetChains();
 * // [TestnetChain.ETHEREUM_SEPOLIA, TestnetChain.ARBITRUM_SEPOLIA, ...]
 * ```
 */
export function getSupportedTestnetChains(): TestnetChain[] {
  return Object.values(TestnetChain);
}
