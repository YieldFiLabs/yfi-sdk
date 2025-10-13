/**
 * @jest-environment node
 */

import {
  WHITELISTED_TOKENS,
  getTokensByChainId,
  getTokenByAddress,
  getTokensBySymbol,
  isTokenWhitelisted,
  getTokenDecimals,
  getSupportedChainIds,
  formatTokenAmount,
  parseTokenAmount,
  type Token,
} from "../../../src/constants/tokens";

describe("Tokens Constants", () => {
  describe("WHITELISTED_TOKENS", () => {
    it("should have valid token structure", () => {
      expect(WHITELISTED_TOKENS.length).toBeGreaterThan(0);

      WHITELISTED_TOKENS.forEach((token) => {
        expect(token).toHaveProperty("address");
        expect(token).toHaveProperty("symbol");
        expect(token).toHaveProperty("decimals");
        expect(token).toHaveProperty("chainId");
        expect(token).toHaveProperty("active");

        expect(typeof token.address).toBe("string");
        expect(typeof token.symbol).toBe("string");
        expect(typeof token.decimals).toBe("number");
        expect(typeof token.chainId).toBe("string");
        expect(typeof token.active).toBe("boolean");

        expect(token.decimals).toBeGreaterThanOrEqual(0);
        expect(token.decimals).toBeLessThanOrEqual(18);
      });
    });

    it("should contain USDT on Ethereum", () => {
      const usdtEth = WHITELISTED_TOKENS.find(
        (t) =>
          t.address === "0xdac17f958d2ee523a2206206994597c13d831ec7" &&
          t.chainId === "1",
      );

      expect(usdtEth).toBeDefined();
      expect(usdtEth?.symbol).toBe("USDT");
      expect(usdtEth?.decimals).toBe(6);
      expect(usdtEth?.active).toBe(true);
    });

    it("should contain yUSD on multiple chains", () => {
      const yUSDTokens = WHITELISTED_TOKENS.filter((t) => t.symbol === "yUSD");

      expect(yUSDTokens.length).toBeGreaterThan(1);

      const chainIds = yUSDTokens.map((t) => t.chainId);
      expect(chainIds).toContain("1"); // Ethereum
      expect(chainIds).toContain("42161"); // Arbitrum
      expect(chainIds).toContain("8453"); // Base
    });
  });

  describe("getTokensByChainId", () => {
    it("should return tokens for Ethereum mainnet", () => {
      const tokens = getTokensByChainId("1");

      expect(tokens.length).toBeGreaterThan(0);
      tokens.forEach((token) => {
        expect(token.chainId).toBe("1");
        expect(token.active).toBe(true);
      });
    });

    it("should return tokens for Arbitrum", () => {
      const tokens = getTokensByChainId("42161");

      expect(tokens.length).toBeGreaterThan(0);
      tokens.forEach((token) => {
        expect(token.chainId).toBe("42161");
      });
    });

    it("should return empty array for unsupported chain", () => {
      const tokens = getTokensByChainId("99999");
      expect(tokens).toEqual([]);
    });

    it("should return only active tokens by default", () => {
      const tokens = getTokensByChainId("1");
      tokens.forEach((token) => {
        expect(token.active).toBe(true);
      });
    });

    it("should return all tokens when activeOnly is false", () => {
      const tokens = getTokensByChainId("1", false);
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe("getTokenByAddress", () => {
    it("should return USDT on Ethereum by address", () => {
      const token = getTokenByAddress(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );

      expect(token).toBeDefined();
      expect(token?.symbol).toBe("USDT");
      expect(token?.decimals).toBe(6);
      expect(token?.chainId).toBe("1");
    });

    it("should be case-insensitive for addresses", () => {
      const lowerCase = getTokenByAddress(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      const upperCase = getTokenByAddress(
        "0xDAC17F958D2EE523A2206206994597C13D831EC7",
        "1",
      );

      expect(lowerCase).toBeDefined();
      expect(upperCase).toBeDefined();
      expect(lowerCase?.symbol).toBe(upperCase?.symbol);
    });

    it("should return undefined for non-existent address", () => {
      const token = getTokenByAddress(
        "0x0000000000000000000000000000000000000000",
        "1",
      );
      expect(token).toBeUndefined();
    });

    it("should return undefined for wrong chain", () => {
      const token = getTokenByAddress(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "42161",
      );
      expect(token).toBeUndefined();
    });

    it("should handle Tron addresses", () => {
      const token = getTokenByAddress(
        "tr7nhqjekqxgtci8q8zy4pl8otszgjlj6t",
        "728126428",
      );

      expect(token).toBeDefined();
      expect(token?.symbol).toBe("USDT");
      expect(token?.chainId).toBe("728126428");
    });
  });

  describe("getTokensBySymbol", () => {
    it("should return all yUSD tokens across chains", () => {
      const tokens = getTokensBySymbol("yUSD");

      expect(tokens.length).toBeGreaterThan(1);
      tokens.forEach((token) => {
        expect(token.symbol).toBe("yUSD");
      });
    });

    it("should be case-insensitive", () => {
      const lower = getTokensBySymbol("usdt");
      const upper = getTokensBySymbol("USDT");
      const mixed = getTokensBySymbol("UsDt");

      expect(lower.length).toBe(upper.length);
      expect(upper.length).toBe(mixed.length);
    });

    it("should return empty array for non-existent symbol", () => {
      const tokens = getTokensBySymbol("NONEXISTENT");
      expect(tokens).toEqual([]);
    });

    it("should return only active tokens by default", () => {
      const tokens = getTokensBySymbol("USDC");
      tokens.forEach((token) => {
        expect(token.active).toBe(true);
      });
    });

    it("should return all tokens when activeOnly is false", () => {
      const tokens = getTokensBySymbol("USDC", false);
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe("isTokenWhitelisted", () => {
    it("should return true for whitelisted USDT on Ethereum", () => {
      const isWhitelisted = isTokenWhitelisted(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(isWhitelisted).toBe(true);
    });

    it("should return false for non-whitelisted token", () => {
      const isWhitelisted = isTokenWhitelisted(
        "0x0000000000000000000000000000000000000000",
        "1",
      );
      expect(isWhitelisted).toBe(false);
    });

    it("should be case-insensitive", () => {
      const lowerCase = isTokenWhitelisted(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      const upperCase = isTokenWhitelisted(
        "0xDAC17F958D2EE523A2206206994597C13D831EC7",
        "1",
      );

      expect(lowerCase).toBe(true);
      expect(upperCase).toBe(true);
    });

    it("should return false for correct address on wrong chain", () => {
      const isWhitelisted = isTokenWhitelisted(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "99999",
      );
      expect(isWhitelisted).toBe(false);
    });
  });

  describe("getTokenDecimals", () => {
    it("should return 6 for USDT on Ethereum", () => {
      const decimals = getTokenDecimals(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(decimals).toBe(6);
    });

    it("should return 18 for yUSD tokens", () => {
      const decimalsEth = getTokenDecimals(
        "0x19ebd191f7a24ece672ba13a302212b5ef7f35cb",
        "1",
      );
      const decimalsArb = getTokenDecimals(
        "0x4772d2e014f9fc3a820c444e3313968e9a5c8121",
        "42161",
      );

      expect(decimalsEth).toBe(18);
      expect(decimalsArb).toBe(18);
    });

    it("should return 8 for WBTC", () => {
      const decimals = getTokenDecimals(
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        "1",
      );
      expect(decimals).toBe(8);
    });

    it("should return undefined for non-existent token", () => {
      const decimals = getTokenDecimals(
        "0x0000000000000000000000000000000000000000",
        "1",
      );
      expect(decimals).toBeUndefined();
    });
  });

  describe("getSupportedChainIds", () => {
    it("should return array of chain IDs", () => {
      const chainIds = getSupportedChainIds();

      expect(Array.isArray(chainIds)).toBe(true);
      expect(chainIds.length).toBeGreaterThan(0);
    });

    it("should include major chains", () => {
      const chainIds = getSupportedChainIds();

      expect(chainIds).toContain("1"); // Ethereum
      expect(chainIds).toContain("42161"); // Arbitrum
      expect(chainIds).toContain("8453"); // Base
      expect(chainIds).toContain("10"); // Optimism
    });

    it("should not have duplicates", () => {
      const chainIds = getSupportedChainIds();
      const uniqueChainIds = [...new Set(chainIds)];

      expect(chainIds.length).toBe(uniqueChainIds.length);
    });

    it("should be sorted", () => {
      const chainIds = getSupportedChainIds();
      const sortedChainIds = [...chainIds].sort();

      expect(chainIds).toEqual(sortedChainIds);
    });
  });

  describe("formatTokenAmount", () => {
    it("should format USDT amount with 6 decimals", () => {
      const formatted = formatTokenAmount(
        "1000000",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(formatted).toBe("1.000000");
    });

    it("should format yUSD amount with 18 decimals", () => {
      const formatted = formatTokenAmount(
        "1000000000000000000",
        "0x19ebd191f7a24ece672ba13a302212b5ef7f35cb",
        "1",
      );
      expect(formatted).toBe("1.000000000000000000");
    });

    it("should format WBTC amount with 8 decimals", () => {
      const formatted = formatTokenAmount(
        "100000000",
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        "1",
      );
      expect(formatted).toBe("1.00000000");
    });

    it("should handle bigint input", () => {
      const formatted = formatTokenAmount(
        1000000n,
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(formatted).toBe("1.000000");
    });

    it("should handle fractional amounts", () => {
      const formatted = formatTokenAmount(
        "1500000",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(formatted).toBe("1.500000");
    });

    it("should return undefined for non-existent token", () => {
      const formatted = formatTokenAmount(
        "1000000",
        "0x0000000000000000000000000000000000000000",
        "1",
      );
      expect(formatted).toBeUndefined();
    });

    it("should handle zero amount", () => {
      const formatted = formatTokenAmount(
        "0",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(formatted).toBe("0.000000");
    });

    it("should pad fractional part with zeros", () => {
      const formatted = formatTokenAmount(
        "1",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(formatted).toBe("0.000001");
    });
  });

  describe("parseTokenAmount", () => {
    it("should parse USDT amount with 6 decimals", () => {
      const raw = parseTokenAmount(
        "1.5",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(raw).toBe(1500000n);
    });

    it("should parse yUSD amount with 18 decimals", () => {
      const raw = parseTokenAmount(
        "1",
        "0x19ebd191f7a24ece672ba13a302212b5ef7f35cb",
        "1",
      );
      expect(raw).toBe(1000000000000000000n);
    });

    it("should parse WBTC amount with 8 decimals", () => {
      const raw = parseTokenAmount(
        "1",
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        "1",
      );
      expect(raw).toBe(100000000n);
    });

    it("should handle integer amounts without decimal point", () => {
      const raw = parseTokenAmount(
        "5",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(raw).toBe(5000000n);
    });

    it("should handle amounts with more decimal places than token decimals", () => {
      // Should truncate to 6 decimals
      const raw = parseTokenAmount(
        "1.123456789",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(raw).toBe(1123456n);
    });

    it("should handle amounts with fewer decimal places than token decimals", () => {
      const raw = parseTokenAmount(
        "1.5",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(raw).toBe(1500000n);
    });

    it("should return undefined for non-existent token", () => {
      const raw = parseTokenAmount(
        "1.5",
        "0x0000000000000000000000000000000000000000",
        "1",
      );
      expect(raw).toBeUndefined();
    });

    it("should handle zero amount", () => {
      const raw = parseTokenAmount(
        "0",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(raw).toBe(0n);
    });

    it("should handle very small amounts", () => {
      const raw = parseTokenAmount(
        "0.000001",
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "1",
      );
      expect(raw).toBe(1n);
    });
  });

  describe("formatTokenAmount and parseTokenAmount round-trip", () => {
    it("should maintain value consistency for USDT", () => {
      const address = "0xdac17f958d2ee523a2206206994597c13d831ec7";
      const chainId = "1";
      const original = "1.234567";

      const raw = parseTokenAmount(original, address, chainId);
      expect(raw).toBeDefined();

      const formatted = formatTokenAmount(raw!.toString(), address, chainId);
      expect(formatted).toBeDefined();

      // Should be truncated to 6 decimals
      expect(formatted).toBe("1.234567");
    });

    it("should maintain value consistency for yUSD", () => {
      const address = "0x19ebd191f7a24ece672ba13a302212b5ef7f35cb";
      const chainId = "1";
      const original = "1.5";

      const raw = parseTokenAmount(original, address, chainId);
      expect(raw).toBeDefined();

      const formatted = formatTokenAmount(raw!.toString(), address, chainId);
      expect(formatted).toBeDefined();

      expect(formatted).toBe("1.500000000000000000");
    });
  });
});
