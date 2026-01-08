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
    VaultStateResponse,
    ProtocolStatsResponse,
    VaultDetailsResponse,
    WhitelistedAssetsResponse,
    WhitelistedAssetResponse,
    CheckWhitelistedAssetResponse,
    AddWhitelistedAssetRequest,
} from "../../../../src/types";

jest.mock("../../../../src/http");

describe("VaultAPI", () => {
    let vaultAPI: VaultAPI;
    let mockHttpClient: jest.Mocked<HttpClient>;
    let mockConfig: SDKConfig;

    const testVaultAddress = "0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB";
    const testAssetAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const testChainId = 1;
    const testAccessToken = "test-access-token";

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
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
                        address: testVaultAddress,
                        chainId: testChainId,
                        name: "yETH Vault",
                        status: "active",
                        tvl: "1000000000000000000000000",
                        apy: 0.05,
                        baseAsset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        inPartnershipWith: null,
                        strategyType: null,
                        isPrivate: false,
                        depositCap: null,
                        totalDeposited: "0",
                        startDate: null,
                        redemptionSla: null,
                        images: null,
                        nativeApy: null,
                        additionalApy: null,
                        rewards1: null,
                        rewards2: null,
                        expiryDate: null,
                        totalApy: null,
                        price: null,
                        priceChange7d: null,
                        createdAt: "2024-01-01T00:00:00.000Z",
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

    describe("getVaultByAddress", () => {
        it("should get vault by address without user address", async () => {
            const expectedResponse: VaultResponse = {
                success: true,
                vault: {
                    address: testVaultAddress,
                    chainId: testChainId,
                    name: "yETH Vault",
                    status: "active",
                    baseAsset: {
                        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    supportedAssets: [],
                    metrics: {
                        tvl: "1000000000000000000000000",
                        apy: 0.05,
                        totalDeposits: "1000000000000000000000000",
                        totalWithdrawals: "0",
                    },
                    fees: {
                        managementFee: 0.02,
                        performanceFee: 0.2,
                    },
                    inPartnershipWith: null,
                    strategyType: null,
                    isPrivate: false,
                    depositCap: null,
                    totalDeposited: "0",
                    startDate: null,
                    redemptionSla: null,
                    images: null,
                    apy: 0.05,
                    nativeApy: null,
                    additionalApy: null,
                    rewards1: null,
                    rewards2: null,
                    expiryDate: null,
                    totalApy: null,
                    price: null,
                    priceChange7d: null,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultByAddress(testVaultAddress, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should get vault by address with user address and access token", async () => {
            const expectedResponse: VaultResponse = {
                success: true,
                vault: {
                    address: testVaultAddress,
                    chainId: testChainId,
                    name: "Private Vault",
                    status: "active",
                    baseAsset: {
                        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    supportedAssets: [],
                    metrics: {
                        tvl: "1000000000000000000000000",
                        apy: 0.05,
                        totalDeposits: "1000000000000000000000000",
                        totalWithdrawals: "0",
                    },
                    fees: {
                        managementFee: 0.02,
                        performanceFee: 0.2,
                    },
                    inPartnershipWith: null,
                    strategyType: null,
                    isPrivate: true,
                    depositCap: null,
                    totalDeposited: "0",
                    startDate: null,
                    redemptionSla: null,
                    images: null,
                    apy: 0.05,
                    nativeApy: null,
                    additionalApy: null,
                    rewards1: null,
                    rewards2: null,
                    expiryDate: null,
                    totalApy: null,
                    price: null,
                    priceChange7d: null,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const userAddress = "0x944416e5df03ee4c14ec44c01495005564e6b07e";

            const result = await vaultAPI.getVaultByAddress(
                testVaultAddress,
                testChainId,
                userAddress,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}?chainId=${testChainId}&userAddress=${userAddress}`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getVaultByAddress(testVaultAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("getVaultState", () => {
        it("should get vault state", async () => {
            const expectedResponse: VaultStateResponse = {
                success: true,
                state: {
                    address: testVaultAddress,
                    chainId: testChainId,
                    totalAssets: "1000000000000000000000000",
                    totalSupply: "950000000000000000000000",
                    pricePerShare: "1052631578947368421",
                    tvl: "1000000000000000000000000",
                    apy: 0.05,
                    lastUpdated: "2024-01-01T12:00:00.000Z",
                    blockNumber: "18500000",
                    transactionHash:
                        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultState(testVaultAddress, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/state?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should use default chainId if not provided", async () => {
            const expectedResponse: VaultStateResponse = {
                success: true,
                state: {
                    address: testVaultAddress,
                    chainId: 1,
                    totalAssets: "1000000000000000000000000",
                    totalSupply: "950000000000000000000000",
                    pricePerShare: "1052631578947368421",
                    tvl: "1000000000000000000000000",
                    apy: 0.05,
                    lastUpdated: "2024-01-01T12:00:00.000Z",
                    blockNumber: "18500000",
                    transactionHash:
                        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultState(testVaultAddress);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/state?chainId=1`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(vaultAPI.getVaultState(testVaultAddress, testChainId)).rejects.toThrow(
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
                    manager: "YieldFi Fund Management",
                    yieldType: "DeFi Yield",
                    priceUpdateFrequency: "hourly",
                    rewards: "Additional rewards from protocol tokens",
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
                    depositChains: [1, 137, 8453],
                    withdrawChains: [1, 137, 8453],
                    contractAddress: testVaultAddress,
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultDetails(testVaultAddress, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/details?chainId=${testChainId}`,
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
                    manager: "YieldFi Fund Management",
                    yieldType: "DeFi Yield",
                    priceUpdateFrequency: "hourly",
                    rewards: "Additional rewards from protocol tokens",
                    redemptionSla: 24,
                    redemptionCapacity: "1000000000000000000000000",
                    transferability: true,
                    custody: "Non-custodial",
                    eligibility: "Open to all users",
                    legalTerms: "Standard terms and conditions apply",
                    risks: "Smart contract risk, impermanent loss",
                    feeStructure: "2% management fee, 20% performance fee",
                    audits: [],
                    depositChains: [1],
                    withdrawChains: [1],
                    contractAddress: testVaultAddress,
                    updatedAt: "2024-01-01T12:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getVaultDetails(testVaultAddress);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/details?chainId=1`,
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
                vaultAddress: testVaultAddress,
                chainId: testChainId,
                assets: [
                    {
                        id: "1",
                        assetAddress: testAssetAddress,
                        assetSymbol: "USDC",
                        assetName: "USD Coin",
                        assetDecimals: 6,
                        isActive: true,
                        addedAt: "2024-01-01T00:00:00.000Z",
                        updatedAt: "2024-01-01T00:00:00.000Z",
                    },
                ],
                count: 1,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAssets(testVaultAddress, testChainId);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should get whitelisted assets including inactive", async () => {
            const expectedResponse: WhitelistedAssetsResponse = {
                success: true,
                vaultAddress: testVaultAddress,
                chainId: testChainId,
                assets: [],
                count: 0,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAssets(
                testVaultAddress,
                testChainId,
                true,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets?chainId=${testChainId}&includeInactive=true`,
                {
                    headers: {},
                },
            );
        });

        it("should use default chainId if not provided", async () => {
            const expectedResponse: WhitelistedAssetsResponse = {
                success: true,
                vaultAddress: testVaultAddress,
                chainId: 1,
                assets: [],
                count: 0,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAssets(testVaultAddress);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets?chainId=1`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getWhitelistedAssets(testVaultAddress, testChainId),
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
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: "0x944416e5df03ee4c14ec44c01495005564e6b07e",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAsset(
                testVaultAddress,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets/${testAssetAddress}?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should use default chainId if not provided", async () => {
            const expectedResponse: WhitelistedAssetResponse = {
                success: true,
                asset: {
                    id: "1",
                    vaultAddress: testVaultAddress,
                    chainId: 1,
                    assetAddress: testAssetAddress,
                    assetSymbol: "USDC",
                    assetName: "USD Coin",
                    assetDecimals: 6,
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: null,
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.getWhitelistedAsset(testVaultAddress, testAssetAddress);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets/${testAssetAddress}?chainId=1`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.getWhitelistedAsset(testVaultAddress, testAssetAddress, testChainId),
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
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: "0x944416e5df03ee4c14ec44c01495005564e6b07e",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addWhitelistedAsset(
                testAccessToken,
                testVaultAddress,
                assetRequest,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultAddress}/assets?chainId=${testChainId}`,
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
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: null,
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addWhitelistedAsset(
                testAccessToken,
                testVaultAddress,
                assetRequest,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultAddress}/assets?chainId=${testChainId}`,
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
                    isActive: true,
                    addedAt: "2024-01-01T00:00:00.000Z",
                    addedBy: null,
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.addWhitelistedAsset(testAccessToken, testVaultAddress, assetRequest);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultAddress}/assets?chainId=1`,
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
                    testVaultAddress,
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
                testVaultAddress,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultAddress}/assets/${testAssetAddress}?chainId=${testChainId}`,
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
                testVaultAddress,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultAddress}/assets/${testAssetAddress}?chainId=${testChainId}`,
                {
                    headers: {
                        Authorization: `Bearer ${testAccessToken}`,
                    },
                },
            );
        });

        it("should use default chainId if not provided", async () => {
            const expectedResponse = {
                success: true,
                message: "Asset removed from whitelist successfully",
            };

            mockHttpClient.delete.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.removeWhitelistedAsset(
                testAccessToken,
                testVaultAddress,
                testAssetAddress,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `/vault/api/vaults/${testVaultAddress}/assets/${testAssetAddress}?chainId=1`,
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
                vaultAPI.removeWhitelistedAsset(testAccessToken, testVaultAddress, testAssetAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });

    describe("checkAssetWhitelisted", () => {
        it("should check if asset is whitelisted", async () => {
            const expectedResponse: CheckWhitelistedAssetResponse = {
                success: true,
                vaultAddress: testVaultAddress,
                assetAddress: testAssetAddress,
                chainId: testChainId,
                isWhitelisted: true,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.checkAssetWhitelisted(
                testVaultAddress,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets/${testAssetAddress}/check?chainId=${testChainId}`,
                {
                    headers: {},
                },
            );
        });

        it("should return false if asset is not whitelisted", async () => {
            const expectedResponse: CheckWhitelistedAssetResponse = {
                success: true,
                vaultAddress: testVaultAddress,
                assetAddress: testAssetAddress,
                chainId: testChainId,
                isWhitelisted: false,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.checkAssetWhitelisted(
                testVaultAddress,
                testAssetAddress,
                testChainId,
            );

            expect(result).toEqual(expectedResponse);
            expect(result.isWhitelisted).toBe(false);
        });

        it("should use default chainId if not provided", async () => {
            const expectedResponse: CheckWhitelistedAssetResponse = {
                success: true,
                vaultAddress: testVaultAddress,
                assetAddress: testAssetAddress,
                chainId: 1,
                isWhitelisted: true,
            };

            mockHttpClient.get.mockResolvedValue(expectedResponse);

            const result = await vaultAPI.checkAssetWhitelisted(
                testVaultAddress,
                testAssetAddress,
            );

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `/vault/api/public/vaults/${testVaultAddress}/assets/${testAssetAddress}/check?chainId=1`,
                {
                    headers: {},
                },
            );
        });

        it("should throw NetworkError on failure", async () => {
            const networkError = new NetworkError("Network error");
            mockHttpClient.get.mockRejectedValue(networkError);

            await expect(
                vaultAPI.checkAssetWhitelisted(testVaultAddress, testAssetAddress, testChainId),
            ).rejects.toThrow(NetworkError);
        });
    });
});

