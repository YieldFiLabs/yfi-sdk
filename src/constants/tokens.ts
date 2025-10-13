/**
 * YieldFi Whitelisted Tokens
 * Tokens that are supported for deposits and transactions across all chains
 */

/**
 * Token information interface
 */
export interface Token {
  /**
   * Token contract address (lowercase)
   */
  address: string;

  /**
   * Token symbol (e.g., USDT, USDC, yUSD)
   */
  symbol: string;

  /**
   * Token decimals
   */
  decimals: number;

  /**
   * Chain ID where the token is deployed
   */
  chainId: string;

  /**
   * Whether the token is currently active
   */
  active: boolean;
}

/**
 * Whitelisted tokens across all supported chains
 */
export const WHITELISTED_TOKENS: Token[] = [
  // Ethereum (Chain ID: 1)
  {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    chainId: "1",
    symbol: "USDT",
    active: true,
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
    chainId: "1",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0x66a1e37c9b0eaddca17d3662d6c05f4decf3e110",
    decimals: 18,
    chainId: "1",
    symbol: "USR",
    active: true,
  },
  {
    address: "0x1202f5c7b4b9e47a1a484e8b270be34dbbc75055",
    decimals: 18,
    chainId: "1",
    symbol: "wstUSR",
    active: true,
  },
  {
    address: "0x7c1156e515aa1a2e851674120074968c905aaf37",
    decimals: 18,
    chainId: "1",
    symbol: "lvlUSD",
    active: true,
  },
  {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    chainId: "1",
    symbol: "DAI",
    active: true,
  },
  {
    address: "0x19ebd191f7a24ece672ba13a302212b5ef7f35cb",
    decimals: 18,
    chainId: "1",
    symbol: "yUSD",
    active: true,
  },
  {
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    decimals: 18,
    chainId: "1",
    symbol: "WETH",
    active: true,
  },
  {
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
    chainId: "1",
    symbol: "WBTC",
    active: true,
  },
  {
    address: "0x8464f6ecae1ea58ec816c13f964030eab8ec123a",
    decimals: 18,
    chainId: "1",
    symbol: "yETH",
    active: true,
  },
  {
    address: "0xa01200b2e74de6489cf56864e3d76bbc06fc6c43",
    decimals: 18,
    chainId: "1",
    symbol: "yBTC",
    active: true,
  },

  // Optimism (Chain ID: 10)
  {
    address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    decimals: 6,
    chainId: "10",
    symbol: "USDT",
    active: true,
  },
  {
    address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    decimals: 6,
    chainId: "10",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "10",
    symbol: "yUSD",
    active: true,
  },

  // Arbitrum (Chain ID: 42161)
  {
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    decimals: 6,
    chainId: "42161",
    symbol: "USDT",
    active: true,
  },
  {
    address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    decimals: 6,
    chainId: "42161",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "42161",
    symbol: "yUSD",
    active: true,
  },
  {
    address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    decimals: 18,
    chainId: "42161",
    symbol: "WETH",
    active: true,
  },
  {
    address: "0x1f52edf2815bfa625890b61d6bf43ddc24671fe8",
    decimals: 18,
    chainId: "42161",
    symbol: "yETH",
    active: true,
  },

  // Base (Chain ID: 8453)
  {
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimals: 6,
    chainId: "8453",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "8453",
    symbol: "yUSD",
    active: true,
  },
  {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    chainId: "8453",
    symbol: "WETH",
    active: true,
  },
  {
    address: "0x1f52edf2815bfa625890b61d6bf43ddc24671fe8",
    decimals: 18,
    chainId: "8453",
    symbol: "yETH",
    active: true,
  },

  // Tron (Chain ID: 728126428)
  {
    address: "tr7nhqjekqxgtci8q8zy4pl8otszgjlj6t",
    decimals: 6,
    chainId: "728126428",
    symbol: "USDT",
    active: true,
  },
  {
    address: "tekxitehnzsmse2xqrbj4w32run966rdz8",
    decimals: 6,
    chainId: "728126428",
    symbol: "USDC",
    active: true,
  },

  // Sonic (Chain ID: 146)
  {
    address: "0x29219dd400f2bf60e5a23d13be72b486d4038894",
    decimals: 6,
    chainId: "146",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "146",
    symbol: "yUSD",
    active: true,
  },
  {
    address: "0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae",
    decimals: 6,
    chainId: "146",
    symbol: "scUSD",
    active: true,
  },

  // Plume (Chain ID: 98866)
  {
    address: "0xdddd73f5df1f0dc31373357beac77545dc5a6f3f",
    decimals: 6,
    chainId: "98866",
    symbol: "pUSD",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "98866",
    symbol: "yUSD",
    active: true,
  },

  // Katana (Chain ID: 747474)
  {
    address: "0x203a662b0bd271a6ed5a60edfbd04bfce608fd36",
    decimals: 6,
    chainId: "747474",
    symbol: "vbUSDC",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "747474",
    symbol: "yUSD",
    active: true,
  },

  // BNB Chain (Chain ID: 56)
  {
    address: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
    chainId: "56",
    symbol: "BUSDT",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "56",
    symbol: "yUSD",
    active: true,
  },

  // Avalanche (Chain ID: 43114)
  {
    address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    decimals: 6,
    chainId: "43114",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "43114",
    symbol: "yUSD",
    active: true,
  },

  // TAC (Chain ID: 239)
  {
    address: "0xaf988c3f7cb2aceabb15f96b19388a259b6c438f",
    decimals: 6,
    chainId: "239",
    symbol: "USDT",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "239",
    symbol: "yUSD",
    active: true,
  },

  // Linea (Chain ID: 59144)
  {
    address: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
    decimals: 6,
    chainId: "59144",
    symbol: "USDC",
    active: true,
  },
  {
    address: "0xa219439258ca9da29e9cc4ce5596924745e12b93",
    decimals: 6,
    chainId: "59144",
    symbol: "USDT",
    active: true,
  },
  {
    address: "0x4e559dbccbe87de66c6a9f3f25231096f24c2e28",
    decimals: 18,
    chainId: "59144",
    symbol: "yUSD",
    active: true,
  },

  // Zetachain (Chain ID: 9745)
  {
    address: "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb",
    decimals: 6,
    chainId: "9745",
    symbol: "USDT",
    active: true,
  },
  {
    address: "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
    decimals: 18,
    chainId: "9745",
    symbol: "yUSD",
    active: true,
  },
];

/**
 * Get all whitelisted tokens for a specific chain
 * @param chainId The chain ID as a string
 * @param activeOnly If true, only return active tokens (default: true)
 * @returns Array of tokens for the specified chain
 *
 * @example
 * ```typescript
 * import { getTokensByChainId } from 'yieldfi-sdk';
 *
 * const ethTokens = getTokensByChainId('1');
 * console.log(ethTokens); // All active tokens on Ethereum
 * ```
 */
export function getTokensByChainId(
  chainId: string,
  activeOnly: boolean = true,
): Token[] {
  return WHITELISTED_TOKENS.filter(
    (token) => token.chainId === chainId && (!activeOnly || token.active),
  );
}

/**
 * Get a specific token by address and chain ID
 * @param address Token contract address
 * @param chainId The chain ID as a string
 * @returns Token or undefined if not found
 *
 * @example
 * ```typescript
 * import { getTokenByAddress } from 'yieldfi-sdk';
 *
 * const usdt = getTokenByAddress('0xdac17f958d2ee523a2206206994597c13d831ec7', '1');
 * console.log(usdt?.symbol); // 'USDT'
 * console.log(usdt?.decimals); // 6
 * ```
 */
export function getTokenByAddress(
  address: string,
  chainId: string,
): Token | undefined {
  const normalizedAddress = address.toLowerCase();
  return WHITELISTED_TOKENS.find(
    (token) =>
      token.address.toLowerCase() === normalizedAddress &&
      token.chainId === chainId,
  );
}

/**
 * Get all tokens by symbol across all chains
 * @param symbol Token symbol (case-insensitive)
 * @param activeOnly If true, only return active tokens (default: true)
 * @returns Array of tokens with the specified symbol
 *
 * @example
 * ```typescript
 * import { getTokensBySymbol } from 'yieldfi-sdk';
 *
 * const yUSDTokens = getTokensBySymbol('yUSD');
 * // Returns yUSD tokens on all chains: Ethereum, Arbitrum, Base, etc.
 * ```
 */
export function getTokensBySymbol(
  symbol: string,
  activeOnly: boolean = true,
): Token[] {
  const normalizedSymbol = symbol.toUpperCase();
  return WHITELISTED_TOKENS.filter(
    (token) =>
      token.symbol.toUpperCase() === normalizedSymbol &&
      (!activeOnly || token.active),
  );
}

/**
 * Check if a token is whitelisted
 * @param address Token contract address
 * @param chainId The chain ID as a string
 * @returns True if the token is whitelisted and active
 *
 * @example
 * ```typescript
 * import { isTokenWhitelisted } from 'yieldfi-sdk';
 *
 * if (isTokenWhitelisted('0xdac17f958d2ee523a2206206994597c13d831ec7', '1')) {
 *   // USDT on Ethereum is whitelisted
 * }
 * ```
 */
export function isTokenWhitelisted(address: string, chainId: string): boolean {
  const token = getTokenByAddress(address, chainId);
  return token !== undefined && token.active;
}

/**
 * Get token decimals
 * @param address Token contract address
 * @param chainId The chain ID as a string
 * @returns Token decimals or undefined if not found
 *
 * @example
 * ```typescript
 * import { getTokenDecimals } from 'yieldfi-sdk';
 *
 * const decimals = getTokenDecimals('0xdac17f958d2ee523a2206206994597c13d831ec7', '1');
 * console.log(decimals); // 6 (USDT has 6 decimals)
 * ```
 */
export function getTokenDecimals(
  address: string,
  chainId: string,
): number | undefined {
  return getTokenByAddress(address, chainId)?.decimals;
}

/**
 * Get all unique chain IDs that have whitelisted tokens
 * @returns Array of chain IDs with whitelisted tokens
 *
 * @example
 * ```typescript
 * import { getSupportedChainIds } from 'yieldfi-sdk';
 *
 * const chainIds = getSupportedChainIds();
 * // ['1', '10', '42161', '8453', ...]
 * ```
 */
export function getSupportedChainIds(): string[] {
  const chainIds = new Set(WHITELISTED_TOKENS.map((token) => token.chainId));
  return Array.from(chainIds).sort();
}

/**
 * Format token amount with proper decimals
 * @param amount Raw token amount (as string or bigint)
 * @param address Token contract address
 * @param chainId The chain ID as a string
 * @returns Formatted amount as string or undefined if token not found
 *
 * @example
 * ```typescript
 * import { formatTokenAmount } from 'yieldfi-sdk';
 *
 * // USDT has 6 decimals
 * const formatted = formatTokenAmount('1000000', '0xdac17f958d2ee523a2206206994597c13d831ec7', '1');
 * console.log(formatted); // '1.000000'
 * ```
 */
export function formatTokenAmount(
  amount: string | bigint,
  address: string,
  chainId: string,
): string | undefined {
  const decimals = getTokenDecimals(address, chainId);
  if (decimals === undefined) return undefined;

  const amountStr = typeof amount === "bigint" ? amount.toString() : amount;
  const amountNum = BigInt(amountStr);

  const divisor = BigInt(10 ** decimals);
  const integerPart = amountNum / divisor;
  const fractionalPart = amountNum % divisor;

  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  return `${integerPart}.${fractionalStr}`;
}

/**
 * Parse token amount to raw value
 * @param amount Human-readable amount (e.g., '1.5')
 * @param address Token contract address
 * @param chainId The chain ID as a string
 * @returns Raw amount as bigint or undefined if token not found
 *
 * @example
 * ```typescript
 * import { parseTokenAmount } from 'yieldfi-sdk';
 *
 * // USDT has 6 decimals
 * const raw = parseTokenAmount('1.5', '0xdac17f958d2ee523a2206206994597c13d831ec7', '1');
 * console.log(raw); // 1500000n
 * ```
 */
export function parseTokenAmount(
  amount: string,
  address: string,
  chainId: string,
): bigint | undefined {
  const decimals = getTokenDecimals(address, chainId);
  if (decimals === undefined) return undefined;

  const [integerPart, fractionalPart = ""] = amount.split(".");
  const paddedFractional = fractionalPart
    .padEnd(decimals, "0")
    .slice(0, decimals);
  const rawAmount = `${integerPart}${paddedFractional}`;

  return BigInt(rawAmount);
}
