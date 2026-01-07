/**
 * Vault API client
 *
 * Provides access to Vault Service endpoints via v3 prefix.
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
  private getAuthHeaders(accessToken?: string): Record<string, string> {
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return {};
  }

  // ==================== PROTOCOL STATS ENDPOINTS ====================

  /**
   * Get protocol-level statistics
   * GET /v3/vaults/protocol/stats
   *
   * @returns Protocol statistics (total TVL, max APY, YPO, total fund managers, total users)
   *
   * @example
   * ```typescript
   * const stats = await sdk.v3.vault.getProtocolStats();
   * console.log(`Total TVL: ${stats.stats.totalTvl}`);
   * ```
   */
  async getProtocolStats(): Promise<ProtocolStatsResponse> {
    const response = await this.httpClient.get<ProtocolStatsResponse>(
      `/${this.servicePrefix}/vaults/protocol/stats`,
    );
    return response;
  }

  /**
   * Refresh protocol statistics
   * POST /v3/vaults/protocol/stats/refresh
   *
   * @returns Refreshed protocol statistics
   *
   * @example
   * ```typescript
   * const stats = await sdk.v3.vault.refreshProtocolStats();
   * ```
   */
  async refreshProtocolStats(): Promise<ProtocolStatsResponse> {
    const response = await this.httpClient.post<ProtocolStatsResponse>(
      `/${this.servicePrefix}/vaults/protocol/stats/refresh`,
      {},
    );
    return response;
  }

  // ==================== VAULT ENDPOINTS ====================

  /**
   * Get vaults with filters and pagination
   * GET /v3/vaults
   *
   * @param filters Query filters (chainId, status, page, pageSize)
   * @returns Paginated list of vaults
   *
   * @example
   * ```typescript
   * const vaults = await sdk.v3.vault.getVaults({
   *   chainId: 1,
   *   status: 'active',
   *   page: 1,
   *   pageSize: 20
   * });
   * ```
   */
  async getVaults(filters?: VaultFilters): Promise<VaultListResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.chainId) queryParams.append("chainId", filters.chainId.toString());
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.pageSize) queryParams.append("pageSize", filters.pageSize.toString());

    const queryString = queryParams.toString();
    const url = `/${this.servicePrefix}/vaults${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<VaultListResponse>(url);
    return response;
  }

  /**
   * Get vault by address
   * GET /v3/vaults/:address
   *
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @param userAddress User address (required for private vaults)
   * @param accessToken Access token (required for private vaults)
   * @returns Vault details
   *
   * @example
   * ```typescript
   * const vault = await sdk.v3.vault.getVaultByAddress(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getVaultByAddress(
    address: string,
    chainId: number = 1,
    userAddress?: string,
    accessToken?: string,
  ): Promise<VaultResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());
    if (userAddress) queryParams.append("userAddress", userAddress);

    const queryString = queryParams.toString();
    const url = `/${this.servicePrefix}/vaults/${address}${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<VaultResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get vault state
   * GET /v3/vaults/:address/state
   *
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @returns Vault state
   *
   * @example
   * ```typescript
   * const state = await sdk.v3.vault.getVaultState(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getVaultState(
    address: string,
    chainId: number = 1,
  ): Promise<VaultStateResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/vaults/${address}/state?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultStateResponse>(url);
    return response;
  }

  /**
   * Get vault details/fact sheet
   * GET /v3/vaults/:address/details
   *
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @returns Vault details/fact sheet
   *
   * @example
   * ```typescript
   * const details = await sdk.v3.vault.getVaultDetails(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getVaultDetails(
    address: string,
    chainId: number = 1,
  ): Promise<VaultDetailsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/vaults/${address}/details?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultDetailsResponse>(url);
    return response;
  }

  // ==================== WHITELISTED ASSETS ENDPOINTS ====================

  /**
   * Get all whitelisted assets for a vault
   * GET /v3/vaults/:address/assets
   *
   * @param address Vault address
   * @param chainId Chain ID (defaults to 1)
   * @param includeInactive Include inactive assets
   * @returns List of whitelisted assets
   *
   * @example
   * ```typescript
   * const assets = await sdk.v3.vault.getWhitelistedAssets(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   1
   * );
   * ```
   */
  async getWhitelistedAssets(
    address: string,
    chainId: number = 1,
    includeInactive: boolean = false,
  ): Promise<WhitelistedAssetsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());
    if (includeInactive) queryParams.append("includeInactive", "true");

    const url = `/${this.servicePrefix}/vaults/${address}/assets?${queryParams.toString()}`;

    const response = await this.httpClient.get<WhitelistedAssetsResponse>(url);
    return response;
  }

  /**
   * Get specific whitelisted asset
   * GET /v3/vaults/:address/assets/:assetAddress
   *
   * @param address Vault address
   * @param assetAddress Asset address
   * @param chainId Chain ID (defaults to 1)
   * @returns Whitelisted asset details
   *
   * @example
   * ```typescript
   * const asset = await sdk.v3.vault.getWhitelistedAsset(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * ```
   */
  async getWhitelistedAsset(
    address: string,
    assetAddress: string,
    chainId: number = 1,
  ): Promise<WhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/vaults/${address}/assets/${assetAddress}?${queryParams.toString()}`;

    const response = await this.httpClient.get<WhitelistedAssetResponse>(url);
    return response;
  }

  /**
   * Add whitelisted asset to a vault
   * POST /v3/vaults/:address/assets
   *
   * @param address Vault address
   * @param asset Asset data to add
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Access token (required for admin operations)
   * @returns Created whitelisted asset
   *
   * @example
   * ```typescript
   * const asset = await sdk.v3.vault.addWhitelistedAsset(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   {
   *     assetAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *     assetSymbol: 'USDC',
   *     assetName: 'USD Coin',
   *     assetDecimals: 6
   *   },
   *   1,
   *   accessToken
   * );
   * ```
   */
  async addWhitelistedAsset(
    address: string,
    asset: AddWhitelistedAssetRequest,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<WhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/vaults/${address}/assets?${queryParams.toString()}`;

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
   * DELETE /v3/vaults/:address/assets/:assetAddress
   *
   * @param address Vault address
   * @param assetAddress Asset address to remove
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Access token (required for admin operations)
   * @returns Success response
   *
   * @example
   * ```typescript
   * await sdk.v3.vault.removeWhitelistedAsset(
   *   '0x5bE91d34FeFbB7554497a74e25dC6df96bFef5DB',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1,
   *   accessToken
   * );
   * ```
   */
  async removeWhitelistedAsset(
    address: string,
    assetAddress: string,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<{ success: boolean; message: string }> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/vaults/${address}/assets/${assetAddress}?${queryParams.toString()}`;

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
   * GET /v3/vaults/:address/assets/:assetAddress/check
   *
   * @param address Vault address
   * @param assetAddress Asset address to check
   * @param chainId Chain ID (defaults to 1)
   * @returns Check result
   *
   * @example
   * ```typescript
   * const result = await sdk.v3.vault.checkAssetWhitelisted(
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
    address: string,
    assetAddress: string,
    chainId: number = 1,
  ): Promise<CheckWhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/vaults/${address}/assets/${assetAddress}/check?${queryParams.toString()}`;

    const response = await this.httpClient.get<CheckWhitelistedAssetResponse>(url);
    return response;
  }
}

