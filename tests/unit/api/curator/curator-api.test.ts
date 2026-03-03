/**
 * Tests for CuratorAPI
 */

import { CuratorAPI } from "../../../../src/api/curator";
import { HttpClient } from "../../../../src/http";
import { SDKConfig } from "../../../../src/config";
import { NetworkError } from "../../../../src/errors";
import {
  CreateCuratorRequest,
  CreateCuratorResponse,
  CuratorVaultsResponse,
  AllCuratorsResponse,
  AllCuratorVaultsResponse,
} from "../../../../src/types";

jest.mock("../../../../src/http");

describe("CuratorAPI", () => {
  let curatorAPI: CuratorAPI;
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockConfig: SDKConfig;

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

    curatorAPI = new CuratorAPI(mockHttpClient, mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCurator", () => {
    it("should create a curator", async () => {
      const body: CreateCuratorRequest = {
        name: "Test Curator",
        userId: "0x123",
        vaults: [
          {
            vaultName: "Test Vault",
            vaultSymbol: "TV",
            websiteUrl: "https://example.com",
          },
        ],
        contact: {
          email: "test@example.com",
          telegram: "@test",
          discord: "test#1234",
        },
        additionalNotes: "Test notes",
      };

      const expectedResponse: CreateCuratorResponse = {
        success: true,
        curator: {
          id: "curator-1",
          key: "test-curator",
          name: "Test Curator",
          address: "0x123",
          websiteUrl: null,
          email: "test@example.com",
          telegram: "@test",
          discord: "test#1234",
          createdAt: "2024-01-01T12:00:00.000Z",
        },
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockHttpClient.post.mockResolvedValue(expectedResponse);

      const result = await curatorAPI.createCurator(testAccessToken, body);

      expect(result).toEqual(expectedResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/vault/api/curator/create",
        body,
        {
          headers: {
            Authorization: `Bearer ${testAccessToken}`,
          },
        },
      );
    });

    it("should throw NetworkError on failure", async () => {
      const body: CreateCuratorRequest = {
        name: "Test",
        userId: "0x123",
      };
      mockHttpClient.post.mockRejectedValue(new NetworkError("Network error"));

      await expect(
        curatorAPI.createCurator(testAccessToken, body),
      ).rejects.toThrow(NetworkError);
    });
  });

  describe("getCuratorVaults", () => {
    it("should get curator vaults", async () => {
      const expectedResponse: CuratorVaultsResponse = {
        success: true,
        vaults: [
          {
            id: "vault-1",
            vaultKey: "yusd",
            address: "0xabc",
            chainId: 1,
            symbol: "yUSD",
            name: "Yield USD",
            status: "ACTIVE",
            inPartnershipWith: "test-curator",
          },
        ],
      };

      mockHttpClient.get.mockResolvedValue(expectedResponse);

      const result = await curatorAPI.getCuratorVaults(testAccessToken);

      expect(result).toEqual(expectedResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/vault/api/curators/vaults",
        {
          headers: {
            Authorization: `Bearer ${testAccessToken}`,
          },
        },
      );
    });

    it("should throw NetworkError on failure", async () => {
      mockHttpClient.get.mockRejectedValue(new NetworkError("Network error"));

      await expect(
        curatorAPI.getCuratorVaults(testAccessToken),
      ).rejects.toThrow(NetworkError);
    });
  });

  describe("getAllCurators", () => {
    it("should get all curators (admin)", async () => {
      const expectedResponse: AllCuratorsResponse = {
        success: true,
        curators: [
          {
            id: "curator-1",
            key: "curator-1",
            name: "Curator One",
            address: "0x123",
            websiteUrl: null,
            vault: null,
            email: "c1@example.com",
            telegram: null,
            discord: null,
            createdAt: "2024-01-01T12:00:00.000Z",
            updatedAt: "2024-01-01T12:00:00.000Z",
          },
        ],
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockHttpClient.get.mockResolvedValue(expectedResponse);

      const result = await curatorAPI.getAllCurators(testAccessToken);

      expect(result).toEqual(expectedResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/vault/api/admin/curators",
        {
          headers: {
            Authorization: `Bearer ${testAccessToken}`,
          },
        },
      );
    });

    it("should throw NetworkError on failure", async () => {
      mockHttpClient.get.mockRejectedValue(new NetworkError("Network error"));

      await expect(
        curatorAPI.getAllCurators(testAccessToken),
      ).rejects.toThrow(NetworkError);
    });
  });

  describe("getAllCuratorVaults", () => {
    it("should get all curator vaults (admin)", async () => {
      const expectedResponse: AllCuratorVaultsResponse = {
        success: true,
        data: [
          {
            curatorKey: "curator-1",
            curatorName: "Curator One",
            vaults: [
              {
                vaultKey: "yusd",
                address: "0xabc",
                chainId: 1,
                symbol: "yUSD",
                name: "Yield USD",
                status: "ACTIVE",
              },
            ],
          },
        ],
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockHttpClient.get.mockResolvedValue(expectedResponse);

      const result = await curatorAPI.getAllCuratorVaults(testAccessToken);

      expect(result).toEqual(expectedResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/vault/api/admin/curators/vaults",
        {
          headers: {
            Authorization: `Bearer ${testAccessToken}`,
          },
        },
      );
    });

    it("should throw NetworkError on failure", async () => {
      mockHttpClient.get.mockRejectedValue(new NetworkError("Network error"));

      await expect(
        curatorAPI.getAllCuratorVaults(testAccessToken),
      ).rejects.toThrow(NetworkError);
    });
  });
});
