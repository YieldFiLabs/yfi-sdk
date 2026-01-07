/**
 * Vault API client
 *
 * Provides access to Vault Service endpoints via vault prefix.
 * Some methods require an access token for authentication (private vaults).
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import {
  VaultFilters,
  VaultListResponse,
  VaultResponse,
  VaultStateResponse,
  ProtocolStatsResponse,
  VaultDetailsResponse,
  WhitelistedAssetsResponse,
  WhitelistedAssetResponse,
  AddWhitelistedAssetRequest,
  CheckWhitelistedAssetResponse,
} from "../../types";

export class VaultAPI {
  private readonly servicePrefix: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {
    this.servicePrefix = config.servicePrefixes.vault;
  }

  /**
   * Build authorization headers
   */
  private getAuthHeaders(accessToken: string): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  // ==================== PROTOCOL STATS ENDPOINTS ====================

  /**
   * Get protocol-level statistics
   * GET /vault/api/vaults/protocol/stats
   *
   * @returns Protocol statistics (total TVL, max APY, YPO, total fund managers, total users)
   *
   * @example
   * ```typescript
   * const stats = await sdk.v3.vault.getProtocolStats(accessToken);
   * console.log(`Total TVL: ${stats.stats.totalTvl}`);
   * ```
   */
  async getProtocolStats(accessToken: string): Promise<ProtocolStatsResponse> {
    const response = await this.httpClient.get<ProtocolStatsResponse>(
      `/${this.servicePrefix}/api/vaults/protocol/stats`,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Refresh protocol statistics
   * POST /vault/api/vaults/protocol/stats/refresh
   *
   * @returns Refreshed protocol statistics
   *
   * @example
   * ```typescript
   * const stats = await sdk.v3.vault.refreshProtocolStats(accessToken);
   * ```
   */
  async refreshProtocolStats(accessToken: string): Promise<ProtocolStatsResponse> {
    const response = await this.httpClient.post<ProtocolStatsResponse>(
      `/${this.servicePrefix}/api/vaults/protocol/stats/refresh`,
      {},
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  // ==================== VAULT ENDPOINTS ====================

  /**
   * Get vaults with filters and pagination
   * GET /vault/api/vaults
   *
   * @param accessToken Access token for authentication
   * @param filters Query filters (chainId, status, page, pageSize)
   * @returns Paginated list of vaults
   *
   * @example
   * ```typescript
   * const vaults = await sdk.v3.vault.getVaults(accessToken, {
   *   chainId: 1,
   *   status: 'active',
   *   page: 1,
   *   pageSize: 20
   * });
   * ```
   */
  async getVaults(accessToken: string, filters?: VaultFilters): Promise<VaultListResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.chainId) queryParams.append("chainId", filters.chainId.toString());
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.pageSize) queryParams.append("pageSize", filters.pageSize.toString());

    const queryString = queryParams.toString();
    const url = `/${this.servicePrefix}/api/vaults${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<VaultListResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get vault by address
   * GET /vault/api/vaults/:address
   *
   * @param accessToken Access token for authentication
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @param userAddress User address (required for private vaults)
   * @returns Vault details
   *
   * @example
   * ```typescript
   * const vault = await sdk.v3.vault.getVaultByAddress(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getVaultByAddress(
    accessToken: string,
    address: string,
    chainId: number = 1,
    userAddress?: string,
  ): Promise<VaultResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());
    if (userAddress) queryParams.append("userAddress", userAddress);

    const queryString = queryParams.toString();
    const url = `/${this.servicePrefix}/api/vaults/${address}${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<VaultResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get vault state
   * GET /vault/api/vaults/:address/state
   *
   * @param accessToken Access token for authentication
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @returns Vault state
   *
   * @example
   * ```typescript
   * const state = await sdk.v3.vault.getVaultState(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getVaultState(
    accessToken: string,
    address: string,
    chainId: number = 1,
  ): Promise<VaultStateResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${address}/state?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultStateResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get vault details/fact sheet
   * GET /vault/api/vaults/:address/details
   *
   * @param accessToken Access token for authentication
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @returns Vault details/fact sheet
   *
   * @example
   * ```typescript
   * const details = await sdk.v3.vault.getVaultDetails(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getVaultDetails(
    accessToken: string,
    address: string,
    chainId: number = 1,
  ): Promise<VaultDetailsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${address}/details?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultDetailsResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  // ==================== WHITELISTED ASSETS ENDPOINTS ====================

  /**
   * Get all whitelisted assets for a vault
   * GET /vault/api/vaults/:address/assets
   *
   * @param accessToken Access token for authentication
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @param includeInactive Include inactive assets
   * @returns List of whitelisted assets
   *
   * @example
   * ```typescript
   * const assets = await sdk.v3.vault.getWhitelistedAssets(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getWhitelistedAssets(
    accessToken: string,
    address: string,
    chainId: number = 1,
    includeInactive: boolean = false,
  ): Promise<WhitelistedAssetsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());
    if (includeInactive) queryParams.append("includeInactive", "true");

    const url = `/${this.servicePrefix}/api/vaults/${address}/assets?${queryParams.toString()}`;

    const response = await this.httpClient.get<WhitelistedAssetsResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get specific whitelisted asset
   * GET /vault/api/vaults/:address/assets/:assetAddress
   *
   * @param accessToken Access token for authentication
   * @param address Vault address
   * @param assetAddress Asset address
   * @param chainId Chain ID (defaults to 1)
   * @returns Whitelisted asset details
   *
   * @example
   * ```typescript
   * const asset = await sdk.v3.vault.getWhitelistedAsset(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * ```
   */
  async getWhitelistedAsset(
    accessToken: string,
    address: string,
    assetAddress: string,
    chainId: number = 1,
  ): Promise<WhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${address}/assets/${assetAddress}?${queryParams.toString()}`;

    const response = await this.httpClient.get<WhitelistedAssetResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Add whitelisted asset to a vault
   * POST /vault/api/vaults/:address/assets
   *
   * @param accessToken Access token (required for admin operations)
   * @param address Vault address
   * @param asset Asset data to add
   * @param chainId Chain ID (defaults to 1)
   * @returns Created whitelisted asset
   *
   * @example
   * ```typescript
   * const asset = await sdk.v3.vault.addWhitelistedAsset(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   {
   *     assetAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *     assetSymbol: 'USDC',
   *     assetName: 'USD Coin',
   *     assetDecimals: 6
   *   },
   *   1
   * );
   * ```
   */
  async addWhitelistedAsset(
    accessToken: string,
    address: string,
    asset: AddWhitelistedAssetRequest,
    chainId: number = 1,
  ): Promise<WhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${address}/assets?${queryParams.toString()}`;

    const response = await this.httpClient.post<WhitelistedAssetResponse>(
      url,
      asset,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Remove whitelisted asset from a vault
   * DELETE /vault/api/vaults/:address/assets/:assetAddress
   *
   * @param accessToken Access token (required for admin operations)
   * @param address Vault address
   * @param assetAddress Asset address to remove
   * @param chainId Chain ID (defaults to 1)
   * @returns Success response
   *
   * @example
   * ```typescript
   * await sdk.v3.vault.removeWhitelistedAsset(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * ```
   */
  async removeWhitelistedAsset(
    accessToken: string,
    address: string,
    assetAddress: string,
    chainId: number = 1,
  ): Promise<{ success: boolean; message: string }> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${address}/assets/${assetAddress}?${queryParams.toString()}`;

    const response = await this.httpClient.delete<{ success: boolean; message: string }>(
      url,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Check if asset is whitelisted for a vault
   * GET /vault/api/vaults/:address/assets/:assetAddress/check
   *
   * @param accessToken Access token for authentication
   * @param address Vault address
   * @param assetAddress Asset address to check
   * @param chainId Chain ID (defaults to 1)
   * @returns Check result
   *
   * @example
   * ```typescript
   * const result = await sdk.v3.vault.checkAssetWhitelisted(
   *   accessToken,
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * if (result.isWhitelisted) {
   *   console.log('Asset is whitelisted');
   * }
   * ```
   */
  async checkAssetWhitelisted(
    accessToken: string,
    address: string,
    assetAddress: string,
    chainId: number = 1,
  ): Promise<CheckWhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${address}/assets/${assetAddress}/check?${queryParams.toString()}`;

    const response = await this.httpClient.get<CheckWhitelistedAssetResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }
}

