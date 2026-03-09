/**
 * Tests for VaultAPI
 */

import { VaultAPI } from "../../../../src/api/vault";
import { HttpClient } from "../../../../src/http";
import { SDKConfig } from "../../../../src/config";
import { NetworkError } from "../../../../src/errors";
import {
    VaultListResponse,
    VaultResponse,
    ProtocolStatsResponse,
    VaultDetailsResponse,
    WhitelistedAssetsResponse,
    WhitelistedAssetResponse,
    CheckWhitelistedAssetResponse,
    AddWhitelistedAssetRequest,
    VaultFaqsResponse,
    StrategiesResponse,
} from "../../../../src/types";
import {
    TransactionSettingsBody,
    TransactionSettingsResponse,
    VaultSlaBody,
    VaultSlaResponse,
} from "../../../../src/types/curator";

jest.mock("../../../../src/http");

describe("VaultAPI", () => {
    let vaultAPI: VaultAPI;
    let mockHttpClient: jest.Mocked<HttpClient>;
    let mockConfig: SDKConfig;

    const testVaultKey = "yusd";
    const testVaultAddress = "0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB";
    const testAssetAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const testChainId = 1;
    const testAccessToken = "test-access-token";

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        mockConfig = {
            gatewayUrl: "http://localhost:9501",
            servicePrefixes: {
                auth: "auth",
                glassbook: "gb",
                keystone: "ks",
                vault: "vault",
            },
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000,
            environment: "development",
            debug: false,
        } as SDKConfig;

        vaultAPI = new VaultAPI(mockHttpClient, mockConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ==================== PROTOCOL STATS ENDPOINTS ====================

    describe("getProtocolStats", () => {
        it("should get protocol statistics", async () => {
            const expectedResponse: ProtocolStatsResponse = {
                success: true,
                stats: {
                    totalTvl: "1000000000000000000000000",
                    maxApy: 0.12,
                    ypo: "120000000000000000000000",
                    totalFundManagers: 5,
                    totalUsers: 1000,
                    calculatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getProtocolStats();

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith("/vault/api/public/vaults/protocol/stats", {
                headers: {},
            });
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(vaultAPI.getProtocolStats()).rejects.toThrow(NetworkError);
        });
    });

    describe("refreshProtocolStats", () => {
        it("should refresh protocol statistics", async () => {
            const expectedResponse: ProtocolStatsResponse = {
                success: true,
                stats: {
                    totalTvl: "1000000000000000000000000",
                    maxApy: 0.12,
                    ypo: "120000000000000000000000",
                    totalFundManagers: 5,
                    totalUsers: 1000,
                    calculatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.refreshProtocolStats(testAccessToken);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                "/vault/api/vaults/protocol/stats/refresh",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.post.mockRejectedValue(networkError);

            await expect(vaultAPI.refreshProtocolStats(testAccessToken)).rejects.toThrow(NetworkError);
        });
    });

    // ==================== VAULT ENDPOINTS ====================

    describe("getVaults", () => {
        it("should get vaults without filters", async () => {
            const expectedResponse: VaultListResponse = {
                success: true,
                vaults: [
                    {
                        vaultKey: testVaultKey,
                        address: testVaultAddress,
                        chainId: testChainId,
                        symbol: "yUSD",
                        name: "yUSD Vault",
                        status: "active",
                        tvl: "1000000000000000000000000",
                        apy: 0.05,
                        nativeApy: 0.03,
                        additionalApy: 0.02,
                        totalApy: 0.05,
                        baseAsset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        inPartnershipWith: null,
                        strategyType: null,
                        isPrivate: false,
                        depositCap: null,
                        depositRedeemEnabled: 2,
                        startDate: null,
                        images: null,
                        price: null,
                        priceChange7d: null,
                        createdAt: "2024-01-01T00:00:00.000Z",
                        strategy: null,
                        priceUpdateFrequency: null,
                        redemptionSla: null,
                        redemptionCapacity: null,
                        transferability: null,
                        custody: null,
                        eligibility: null,
                        legalTerms: null,
                        risks: null,
                        feeStructure: null,
                        audits: null,
                        rewards: [],
                    },
                ],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    totalPages: 1,
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaults();

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith("/vault/api/public/vaults", {
                headers: {},
            });
        });

        it("should get vaults with filters", async () => {
            const expectedResponse: VaultListResponse = {
                success: true,
                vaults: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 0,
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const filters = {
                chainId: testChainId,
                status: "active",
                page: 1,
                pageSize: 20,
            };

            const result = await vaultAPI.getVaults(filters);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "/vault/api/public/vaults?chainId=1&status=active&page=1&pageSize=20",
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(vaultAPI.getVaults()).rejects.toThrow(NetworkError);
        });
    });

    describe("getVaultByKey", () => {
        it("should get vault by key", async () => {
            const expectedResponse: VaultResponse = {
                success: true,
                vault: {
                    vaultKey: testVaultKey,
                    address: testVaultAddress,
                    chainId: testChainId,
                    symbol: "yUSD",
                    name: "yUSD Vault",
                    description: "A yield farming vault",
                    status: "active",
                    baseAsset: {
                        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        symbol: "USDC",
                        decimals: 6,
                    },
                    manager: "0x1234567890123456789012345678901234567890",
                    supportedAssets: [],
                    metrics: {
                        tvl: "1000000000000000000000000",
                        apy: 0.05,
                        apy7d: 0.048,
                        totalDeposits: "1000000000000000000000000",
                        totalWithdrawals: "0",
                    },
                    fees: {
                        managementFee: 0.02,
                        performanceFee: 0.2,
                        chainFees: [],
                    },
                    partner: null,
                    strategyType: null,
                    isPrivate: false,
                    depositCap: null,
                    depositRedeemEnabled: 2,
                    startDate: null,
                    images: null,
                    price: null,
                    priceChange7d: null,
                    faqs: [],
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultByKey(testVaultKey, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getVaultByKey(testVaultKey, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("getVaultBySymbol", () => {
        it("should get vault by symbol", async () => {
            const expectedResponse: VaultResponse = {
                success: true,
                vault: {
                    vaultKey: testVaultKey,
                    address: testVaultAddress,
                    chainId: testChainId,
                    symbol: "yUSD",
                    name: "yUSD Vault",
                    description: "A yield farming vault",
                    status: "active",
                    baseAsset: {
                        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        symbol: "USDC",
                        decimals: 6,
                    },
                    manager: "0x1234567890123456789012345678901234567890",
                    supportedAssets: [],
                    metrics: {
                        tvl: "1000000000000000000000000",
                        apy: 0.05,
                        apy7d: 0.048,
                        totalDeposits: "1000000000000000000000000",
                        totalWithdrawals: "0",
                    },
                    fees: {
                        managementFee: 0.02,
                        performanceFee: 0.2,
                        chainFees: [],
                    },
                    partner: null,
                    strategyType: null,
                    isPrivate: false,
                    depositCap: null,
                    depositRedeemEnabled: 2,
                    startDate: null,
                    images: null,
                    price: null,
                    priceChange7d: null,
                    faqs: [],
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultBySymbol("yUSD", testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/by-symbol/yUSD?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });
    });

    describe("getStrategies", () => {
        it("should get distinct strategies", async () => {
            const expectedResponse: StrategiesResponse = {
                success: true,
                strategies: ["yield-farming", "liquidity-provision", "lending"],
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getStrategies();

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith("/vault/api/public/vaults/strategies", {
                headers: {},
            });
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(vaultAPI.getStrategies()).rejects.toThrow(NetworkError);
        });
    });

    describe("getVaultFaqs", () => {
        it("should get vault FAQs", async () => {
            const expectedResponse: VaultFaqsResponse = {
                success: true,
                faqs: [
                    {
                        id: "1",
                        question: "What is this vault?",
                        answer: "This vault provides yield farming opportunities...",
                        displayOrder: 1,
                    },
                ],
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultFaqs(testVaultKey, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/faqs?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(vaultAPI.getVaultFaqs(testVaultKey, testChainId)).rejects.toThrow(
                NetworkError,
            );
        });
    });

    describe("getVaultDetails", () => {
        it("should get vault details", async () => {
            const expectedResponse: VaultDetailsResponse = {
                success: true,
                details: {
                    vaultAddress: testVaultAddress,
                    chainId: testChainId,
                    strategy: "Yield farming on Uniswap V3",
                    priceUpdateFrequency: "hourly",
                    redemptionSla: 24,
                    redemptionCapacity: "1000000000000000000000000",
                    transferability: true,
                    custody: "Non-custodial",
                    eligibility: "Open to all users",
                    legalTerms: "Standard terms",
                    risks: "Smart contract risk",
                    feeStructure: "2% management fee, 20% performance fee",
                    audits: [],
                    backingRatio: 1,
                    yieldBuffer: 0.1,
                    slaWarningThreshold: 12,
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultDetails(testVaultKey, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/details?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(vaultAPI.getVaultDetails(testVaultKey, testChainId)).rejects.toThrow(
                NetworkError,
            );
        });
    });

    describe("getVaultDetails", () => {
        it("should get vault details", async () => {
            const expectedResponse: VaultDetailsResponse = {
                success: true,
                details: {
                    vaultAddress: testVaultAddress,
                    chainId: testChainId,
                    strategy: "Yield farming on Uniswap V3",
                    priceUpdateFrequency: "hourly",
                    redemptionSla: 24,
                    redemptionCapacity: "1000000000000000000000000",
                    transferability: true,
                    custody: "Non-custodial",
                    eligibility: "Open to all users",
                    legalTerms: "Standard terms and conditions apply",
                    risks: "Smart contract risk, impermanent loss",
                    feeStructure: "2% management fee, 20% performance fee",
                    audits: [
                        {
                            auditor: "CertiK",
                            reportUrl: "https://example.com/audit-report.pdf",
                            date: "2024-01-01",
                        },
                    ],
                    backingRatio: 1,
                    yieldBuffer: 0.1,
                    slaWarningThreshold: 12,
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultDetails(testVaultKey, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/details?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should use default chainId if not provided", async () => {
            const expectedResponse: VaultDetailsResponse = {
                success: true,
                details: {
                    vaultAddress: testVaultAddress,
                    chainId: 1,
                    strategy: "Yield farming on Uniswap V3",
                    priceUpdateFrequency: "hourly",
                    redemptionSla: 24,
                    redemptionCapacity: "1000000000000000000000000",
                    transferability: true,
                    custody: "Non-custodial",
                    eligibility: "Open to all users",
                    legalTerms: "Standard terms and conditions apply",
                    risks: "Smart contract risk, impermanent loss",
                    feeStructure: "2% management fee, 20% performance fee",
                    audits: [],
                    backingRatio: 1,
                    yieldBuffer: 0.1,
                    slaWarningThreshold: 12,
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultDetails(testVaultKey, 1);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/details?chainId=1`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getVaultDetails(testVaultAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    // ==================== WHITELISTED ASSETS ENDPOINTS ====================

    describe("getWhitelistedAssets", () => {
        it("should get whitelisted assets", async () => {
            const expectedResponse: WhitelistedAssetsResponse = {
                success: true,
                vaultKey: testVaultKey,
                assets: [
                    {
                        id: "1",
                        assetAddress: testAssetAddress,
                        assetSymbol: "USDC",
                        assetName: "USD Coin",
                        assetDecimals: 6,
                        depositRedeemEnabled: 2,
                        isActive: true,
                        addedAt: "2024-01-01T00:00:00.000Z",
                        updatedAt: "2024-01-01T00:00:00.000Z",
                    },
                ],
                count: 1,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAssets(testVaultKey, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/assets?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should get whitelisted assets including inactive", async () => {
            const expectedResponse: WhitelistedAssetsResponse = {
                success: true,
                vaultKey: testVaultKey,
                assets: [],
                count: 0,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAssets(
                testVaultKey,
                testChainId,
                true,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/assets?chainId=${testChainId}&includeInactive=true`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getWhitelistedAssets(testVaultKey, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("getWhitelistedAsset", () => {
        it("should get specific whitelisted asset", async () => {
            const expectedResponse: WhitelistedAssetResponse = {
                success: true,
                asset: {
                    id: "1",
                    vaultAddress: testVaultAddress,
                    chainId: testChainId,
                    assetAddress: testAssetAddress,
                    assetSymbol: "USDC",
                    assetName: "USD Coin",
                    assetDecimals: 6,
                    depositRedeemEnabled: 2,
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: "0x944416e5df03ee4c14ec44c01495005564e6b07e",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAsset(
                testVaultKey,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/assets/${testAssetAddress}?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getWhitelistedAsset(testVaultKey, testAssetAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("addWhitelistedAsset", () => {
        it("should add whitelisted asset", async () => {
            const assetRequest: AddWhitelistedAssetRequest = {
                assetAddress: testAssetAddress,
                assetSymbol: "USDC",
                assetName: "USD Coin",
                assetDecimals: 6,
                addedBy: "0x944416e5df03ee4c14ec44c01495005564e6b07e",
            };

            const expectedResponse: WhitelistedAssetResponse = {
                success: true,
                asset: {
                    id: "1",
                    vaultAddress: testVaultAddress,
                    chainId: testChainId,
                    assetAddress: testAssetAddress,
                    assetSymbol: "USDC",
                    assetName: "USD Coin",
                    assetDecimals: 6,
                    depositRedeemEnabled: 2,
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: "0x944416e5df03ee4c14ec44c01495005564e6b07e",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addWhitelistedAsset(
                testAccessToken,
                testVaultKey,
                assetRequest,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/assets?chainId=${testChainId}`,
                assetRequest,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should add whitelisted asset without access token", async () => {
            const assetRequest: AddWhitelistedAssetRequest = {
                assetAddress: testAssetAddress,
            };

            const expectedResponse: WhitelistedAssetResponse = {
                success: true,
                asset: {
                    id: "1",
                    vaultAddress: testVaultAddress,
                    chainId: testChainId,
                    assetAddress: testAssetAddress,
                    assetSymbol: null,
                    assetName: null,
                    assetDecimals: 18,
                    depositRedeemEnabled: 2,
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: null,
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addWhitelistedAsset(
                testAccessToken,
                testVaultKey,
                assetRequest,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/assets?chainId=${testChainId}`,
                assetRequest,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should use default chainId if not provided", async () => {
            const assetRequest: AddWhitelistedAssetRequest = {
                assetAddress: testAssetAddress,
            };

            const expectedResponse: WhitelistedAssetResponse = {
                success: true,
                asset: {
                    id: "1",
                    vaultAddress: testVaultAddress,
                    chainId: 1,
                    assetAddress: testAssetAddress,
                    assetSymbol: null,
                    assetName: null,
                    assetDecimals: 18,
                    depositRedeemEnabled: 2,
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: null,
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addWhitelistedAsset(testAccessToken, testVaultKey, assetRequest, 1);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/assets?chainId=1`,
                assetRequest,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.post.mockRejectedValue(networkError);

            await expect(
                vaultAPI.addWhitelistedAsset(
                    testAccessToken,
                    testVaultKey,
                    { assetAddress: testAssetAddress },
                    testChainId,
                ),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("removeWhitelistedAsset", () => {
        it("should remove whitelisted asset", async () => {
            const expectedResponse = {
                success: true,
                message: "Asset removed from whitelist successfully",
            };

            mockHttpClient.delete.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.removeWhitelistedAsset(
                testAccessToken,
                testVaultKey,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/assets/${testAssetAddress}?chainId=${testChainId}`,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should remove whitelisted asset without access token", async () => {
            const expectedResponse = {
                success: true,
                message: "Asset removed from whitelist successfully",
            };

            mockHttpClient.delete.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.removeWhitelistedAsset(
                testAccessToken,
                testVaultKey,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/assets/${testAssetAddress}?chainId=${testChainId}`,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.delete.mockRejectedValue(networkError);

            await expect(
                vaultAPI.removeWhitelistedAsset(testAccessToken, testVaultKey, testAssetAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("checkAssetWhitelisted", () => {
        it("should check if asset is whitelisted", async () => {
            const expectedResponse: CheckWhitelistedAssetResponse = {
                success: true,
                vaultKey: testVaultKey,
                assetAddress: testAssetAddress,
                isWhitelisted: true,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.checkAssetWhitelisted(
                testVaultKey,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultKey}/assets/${testAssetAddress}/check?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should return false if asset is not whitelisted", async () => {
            const expectedResponse: CheckWhitelistedAssetResponse = {
                success: true,
                vaultKey: testVaultKey,
                assetAddress: testAssetAddress,
                isWhitelisted: false,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.checkAssetWhitelisted(
                testVaultKey,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(result.isWhitelisted).toBe(false);
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.checkAssetWhitelisted(testVaultKey, testAssetAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("pauseTransaction", () => {
        it("should pause a PENDING transaction", async () => {
            const transactionId = 123;
            const expectedResponse = {
                success: true,
                transaction: {
                    id: transactionId,
                    chainId: testChainId,
                    txnHash: "0xabc",
                    type: "deposit" as const,
                    vaultAddress: testVaultAddress,
                    userAddress: "0x123",
                    assetAddress: testAssetAddress,
                    status: "PAUSED" as const,
                    createdAt: "2024-01-01T12:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.pauseTransaction(
                transactionId,
                testAccessToken,
                testVaultKey,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/transactions/${transactionId}/pause`,
                { vaultKey: testVaultKey, chainId: testChainId },
                { headers: { Authorization: `Bearer ${testAccessToken}` } },
            );
        });
    });

    describe("unpauseTransaction", () => {
        it("should unpause a PAUSED transaction", async () => {
            const transactionId = 456;
            const expectedResponse = {
                success: true,
                transaction: {
                    id: transactionId,
                    chainId: testChainId,
                    txnHash: "0xdef",
                    type: "redemption" as const,
                    vaultAddress: testVaultAddress,
                    userAddress: "0x456",
                    assetAddress: testAssetAddress,
                    status: "PENDING" as const,
                    createdAt: "2024-01-01T12:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.unpauseTransaction(
                transactionId,
                testAccessToken,
                testVaultKey,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/transactions/${transactionId}/unpause`,
                { vaultKey: testVaultKey, chainId: testChainId },
                { headers: { Authorization: `Bearer ${testAccessToken}` } },
            );
        });
    });

    describe("getVaultsWithRoles", () => {
        it("should get list of vault keys with roles", async () => {
            const expectedResponse = {
                success: true,
                data: ["yusd", "ybtc"],
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultsWithRoles(testAccessToken);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "/vault/api/vaults/roles/vaults",
                { headers: { Authorization: `Bearer ${testAccessToken}` } },
            );
        });
    });

    describe("getVaultRoles", () => {
        it("should get vault roles", async () => {
            const expectedResponse = {
                success: true,
                data: [
                    {
                        curatorAddress: "0x1234567890123456789012345678901234567890",
                        vaultKey: testVaultKey,
                        role: "admin" as const,
                        createdAt: "2024-01-01T12:00:00.000Z",
                        updatedAt: "2024-01-01T12:00:00.000Z",
                    },
                ],
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultRoles(testVaultKey, testAccessToken);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/roles`,
                { headers: { Authorization: `Bearer ${testAccessToken}` } },
            );
        });
    });

    describe("addOrUpdateVaultRole", () => {
        it("should add or update vault role", async () => {
            const body = {
                curatorAddress: "0x1234567890123456789012345678901234567890",
                role: "writer" as const,
            };
            const expectedResponse = {
                success: true,
                data: {
                    curatorAddress: body.curatorAddress,
                    vaultKey: testVaultKey,
                    role: "writer" as const,
                    createdAt: "2024-01-01T12:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.put.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addOrUpdateVaultRole(
                testVaultKey,
                body,
                testAccessToken,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/roles`,
                body,
                { headers: { Authorization: `Bearer ${testAccessToken}` } },
            );
        });
    });

    describe("removeVaultRole", () => {
        it("should remove vault role", async () => {
            const curatorAddress = "0x1234567890123456789012345678901234567890";
            const expectedResponse = { success: true, message: "Role removed successfully" };

            mockHttpClient.delete.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.removeVaultRole(
                testVaultKey,
                curatorAddress,
                testAccessToken,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/roles/${encodeURIComponent(curatorAddress)}`,
                { headers: { Authorization: `Bearer ${testAccessToken}` } },
            );
        });
    });

    describe("updateTransactionSettings", () => {
        it("should update transaction settings", async () => {
            const body: TransactionSettingsBody = {
                vaultKey: testVaultKey,
                chainId: testChainId,
                status: "PAUSE",
                auto: true,
                order: 1,
                threshold: 100,
            };

            const expectedResponse: TransactionSettingsResponse = {
                success: true,
                settings: {
                    vaultKey: testVaultKey,
                    chainId: testChainId,
                    pauseTransactions: true,
                    autoPause: true,
                    autoTrigger: false,
                    processingOrder: 1,
                    orderThreshold: "100",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
                timestamp: "2024-01-01T12:00:00.000Z",
            };

            mockHttpClient.put.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.updateTransactionSettings(
                testAccessToken,
                body,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                "/vault/api/vaults/transactions/settings",
                body,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const body: TransactionSettingsBody = {
                vaultKey: testVaultKey,
                status: "PROCESS",
            };
            mockHttpClient.put.mockRejectedValue(new NetworkError("Network error"));

            await expect(
                vaultAPI.updateTransactionSettings(testAccessToken, body),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("updateVaultSla", () => {
        it("should update vault SLA", async () => {
            const body: VaultSlaBody = {
                time: 24,
                threshold: 12,
            };

            const expectedResponse: VaultSlaResponse = {
                success: true,
                message: "Vault SLA updated",
                timestamp: "2024-01-01T12:00:00.000Z",
            };

            mockHttpClient.put.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.updateVaultSla(
                testAccessToken,
                testVaultKey,
                body,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/sla?chainId=${testChainId}`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should use default chainId of 1 when not provided", async () => {
            const body: VaultSlaBody = { time: 48 };
            mockHttpClient.put.mockResolvedValue({
                success: true,
                message: "Updated",
                timestamp: "2024-01-01T12:00:00.000Z",
            });

            await vaultAPI.updateVaultSla(testAccessToken, testVaultKey, body);

            expect(mockHttpClient.put).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultKey}/sla?chainId=1`,
                body,
                expect.any(Object),
            );
        });

        it("should throw NetworkError on failure", async () => {
            const body: VaultSlaBody = { threshold: 6 };
            mockHttpClient.put.mockRejectedValue(new NetworkError("Network error"));

            await expect(
                vaultAPI.updateVaultSla(
                    testAccessToken,
                    testVaultKey,
                    body,
                    testChainId,
                ),
            ).rejects.toThrow(NetworkError);
        });
    });
});

