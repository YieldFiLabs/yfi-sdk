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
  ProtocolStatsResponse,
  VaultDetailsResponse,
  WhitelistedAssetsResponse,
  WhitelistedAssetResponse,
  AddWhitelistedAssetRequest,
  CheckWhitelistedAssetResponse,
  VaultFaqsResponse,
  StrategiesResponse,
  TransactionFilters,
  TransactionListResponse,
  TransactionResponse,
  TransactionFilterOptionsResponse,
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
   * GET /vault/api/public/vaults/protocol/stats
   *
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Protocol statistics (total TVL, max APY, YPO, total fund managers, total users)
   *
   * @example
   * ```typescript
   * const stats = await sdk.vault.getProtocolStats();
   * console.log(`Total TVL: ${stats.stats.totalTvl}`);
   * ```
   */
  async getProtocolStats(accessToken?: string): Promise<ProtocolStatsResponse> {
    const response = await this.httpClient.get<ProtocolStatsResponse>(
      `/${this.servicePrefix}/api/public/vaults/protocol/stats`,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Get distinct strategies
   * GET /vault/api/public/vaults/strategies
   *
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns List of distinct strategy types
   *
   * @example
   * ```typescript
   * const strategies = await sdk.vault.getStrategies();
   * console.log(`Available strategies: ${strategies.strategies.join(', ')}`);
   * ```
   */
  async getStrategies(accessToken?: string): Promise<StrategiesResponse> {
    const response = await this.httpClient.get<StrategiesResponse>(
      `/${this.servicePrefix}/api/public/vaults/strategies`,
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
   * GET /vault/api/public/vaults
   *
   * @param filters Query filters (chainId, status, page, pageSize)
   * @param accessToken Optional access token (not required for public endpoint)
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
  async getVaults(filters?: VaultFilters, accessToken?: string): Promise<VaultListResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.chainId) queryParams.append("chainId", filters.chainId.toString());
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.pageSize) queryParams.append("pageSize", filters.pageSize.toString());

    const queryString = queryParams.toString();
    const url = `/${this.servicePrefix}/api/public/vaults${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<VaultListResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get vault by key
   * GET /vault/api/public/vaults/:key
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Vault details
   *
   * @example
   * ```typescript
   * const vault = await sdk.vault.getVaultByKey('yusd', 1);
   * ```
   */
  async getVaultByKey(
    vaultKey: string,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<VaultResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/public/vaults/${vaultKey}?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get vault by symbol
   * GET /vault/api/public/vaults/by-symbol/:symbol
   *
   * @param symbol Vault symbol (e.g., 'yUSD', 'yBTC')
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Vault details
   *
   * @example
   * ```typescript
   * const vault = await sdk.vault.getVaultBySymbol('yUSD', 1);
   * ```
   */
  async getVaultBySymbol(
    symbol: string,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<VaultResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/public/vaults/by-symbol/${symbol}?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get private vault by key (authenticated endpoint)
   * GET /vault/api/vaults/:key
   *
   * Requires x-user-address and x-user-role headers for authentication.
   * This endpoint is used to access private vaults that require whitelisting.
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param userAddress User's wallet address (required for authentication)
   * @param userRole User's role (e.g., 'user', 'admin') (required for authentication)
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Optional access token
   * @returns Vault details
   *
   * @example
   * ```typescript
   * const vault = await sdk.vault.getPrivateVaultByKey(
   *   'private-vault-key',
   *   '0x1234567890123456789012345678901234567890',
   *   'user',
   *   1
   * );
   * ```
   */
  async getPrivateVaultByKey(
    vaultKey: string,
    userAddress: string,
    userRole: string,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<VaultResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${vaultKey}?${queryParams.toString()}`;

    const headers = this.getAuthHeaders(accessToken);

    const response = await this.httpClient.get<VaultResponse>(url, {
      headers,
    });
    return response;
  }

  /**
   * Get vault details/fact sheet
   * GET /vault/api/public/vaults/:key/details
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Vault details/fact sheet
   *
   * @example
   * ```typescript
   * const details = await sdk.vault.getVaultDetails('yusd', 1);
   * ```
   */
  async getVaultDetails(
    vaultKey: string,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<VaultDetailsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/public/vaults/${vaultKey}/details?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultDetailsResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get FAQs for a vault
   * GET /vault/api/public/vaults/:key/faqs
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param chainId Chain ID (defaults to 1)
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Vault FAQs
   *
   * @example
   * ```typescript
   * const faqs = await sdk.vault.getVaultFaqs('yusd', 1);
   * ```
   */
  async getVaultFaqs(
    vaultKey: string,
    chainId: number = 1,
    accessToken?: string,
  ): Promise<VaultFaqsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/public/vaults/${vaultKey}/faqs?${queryParams.toString()}`;

    const response = await this.httpClient.get<VaultFaqsResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  // ==================== WHITELISTED ASSETS ENDPOINTS ====================

  /**
   * Get all whitelisted assets for a vault
   * GET /vault/api/public/vaults/:key/assets
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param chainId Chain ID (required)
   * @param includeInactive Include inactive assets
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns List of whitelisted assets
   *
   * @example
   * ```typescript
   * const assets = await sdk.vault.getWhitelistedAssets('yusd', 1);
   * ```
   */
  async getWhitelistedAssets(
    vaultKey: string,
    chainId: number,
    includeInactive: boolean = false,
    accessToken?: string,
  ): Promise<WhitelistedAssetsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());
    if (includeInactive) queryParams.append("includeInactive", "true");

    const url = `/${this.servicePrefix}/api/public/vaults/${vaultKey}/assets?${queryParams.toString()}`;

    const response = await this.httpClient.get<WhitelistedAssetsResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get specific whitelisted asset
   * GET /vault/api/public/vaults/:key/assets/:assetAddress
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param assetAddress Asset address
   * @param chainId Chain ID (required)
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Whitelisted asset details
   *
   * @example
   * ```typescript
   * const asset = await sdk.vault.getWhitelistedAsset(
   *   'yusd',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * ```
   */
  async getWhitelistedAsset(
    vaultKey: string,
    assetAddress: string,
    chainId: number,
    accessToken?: string,
  ): Promise<WhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/public/vaults/${vaultKey}/assets/${assetAddress}?${queryParams.toString()}`;

    const response = await this.httpClient.get<WhitelistedAssetResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Add whitelisted asset to a vault
   * POST /vault/api/vaults/:key/assets
   *
   * @param accessToken Access token (required for admin operations)
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param asset Asset data to add
   * @param chainId Chain ID (required)
   * @returns Created whitelisted asset
   *
   * @example
   * ```typescript
   * const asset = await sdk.vault.addWhitelistedAsset(
   *   accessToken,
   *   'yusd',
   *   {
   *     assetAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *     assetSymbol: 'USDC',
   *     assetName: 'USD Coin',
   *     assetDecimals: 6,
   *     depositRedeemEnabled: 2
   *   },
   *   1
   * );
   * ```
   */
  async addWhitelistedAsset(
    accessToken: string,
    vaultKey: string,
    asset: AddWhitelistedAssetRequest,
    chainId: number,
  ): Promise<WhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${vaultKey}/assets?${queryParams.toString()}`;

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
   * DELETE /vault/api/vaults/:key/assets/:assetAddress
   *
   * @param accessToken Access token (required for admin operations)
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param assetAddress Asset address to remove
   * @param chainId Chain ID (required)
   * @returns Success response
   *
   * @example
   * ```typescript
   * await sdk.vault.removeWhitelistedAsset(
   *   accessToken,
   *   'yusd',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * ```
   */
  async removeWhitelistedAsset(
    accessToken: string,
    vaultKey: string,
    assetAddress: string,
    chainId: number,
  ): Promise<{ success: boolean; message: string }> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/${vaultKey}/assets/${assetAddress}?${queryParams.toString()}`;

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
   * GET /vault/api/public/vaults/:key/assets/:assetAddress/check
   *
   * @param vaultKey Vault key (e.g., 'yusd', 'ybtc')
   * @param assetAddress Asset address to check
   * @param chainId Chain ID (required)
   * @param accessToken Optional access token (not required for public endpoint)
   * @returns Check result
   *
   * @example
   * ```typescript
   * const result = await sdk.vault.checkAssetWhitelisted(
   *   'yusd',
   *   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *   1
   * );
   * if (result.isWhitelisted) {
   *   console.log('Asset is whitelisted');
   * }
   * ```
   */
  async checkAssetWhitelisted(
    vaultKey: string,
    assetAddress: string,
    chainId: number,
    accessToken?: string,
  ): Promise<CheckWhitelistedAssetResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/public/vaults/${vaultKey}/assets/${assetAddress}/check?${queryParams.toString()}`;

    const response = await this.httpClient.get<CheckWhitelistedAssetResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  // ==================== TRANSACTION ENDPOINTS ====================

  /**
   * Get transactions with pagination and filters
   * GET /vault/api/vaults/transactions
   *
   * @param filters Query filters (chainId, vaultAddress, userAddress, type, status, etc.)
   * @param accessToken Access token (required for authenticated requests)
   * @returns Paginated list of transactions
   *
   * @example
   * ```typescript
   * const transactions = await sdk.vault.getTransactions({
   *   chainId: 1,
   *   type: 'deposit',
   *   status: 'PROCESSED',
   *   page: 1,
   *   pageSize: 20
   * }, accessToken);
   * ```
   */
  async getTransactions(
    filters?: TransactionFilters,
    accessToken?: string,
  ): Promise<TransactionListResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.chainId) queryParams.append("chainId", filters.chainId.toString());
    if (filters?.vaultAddress) queryParams.append("vaultAddress", filters.vaultAddress);
    if (filters?.userAddress) queryParams.append("userAddress", filters.userAddress);
    if (filters?.receiverAddress) queryParams.append("receiverAddress", filters.receiverAddress);
    if (filters?.assetAddress) queryParams.append("assetAddress", filters.assetAddress);
    if (filters?.type) queryParams.append("type", filters.type);
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.pageSize) queryParams.append("pageSize", filters.pageSize.toString());

    const queryString = queryParams.toString();
    const url = `/${this.servicePrefix}/api/vaults/transactions${queryString ? `?${queryString}` : ""}`;

    console.log(url);

    const response = await this.httpClient.get<TransactionListResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get transaction by ID
   * GET /vault/api/vaults/transactions/:id
   *
   * @param id Transaction ID
   * @param accessToken Access token (required for authenticated requests)
   * @returns Transaction details
   *
   * @example
   * ```typescript
   * const transaction = await sdk.vault.getTransactionById(1, accessToken);
   * ```
   */
  async getTransactionById(
    id: number,
    accessToken?: string,
  ): Promise<TransactionResponse> {
    const url = `/${this.servicePrefix}/api/vaults/transactions/${id}`;

    const response = await this.httpClient.get<TransactionResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get transaction by hash
   * GET /vault/api/vaults/transactions/hash/:txnHash
   *
   * @param txnHash Transaction hash
   * @param chainId Chain ID (required)
   * @param accessToken Access token (required for authenticated requests)
   * @returns Transaction details
   *
   * @example
   * ```typescript
   * const transaction = await sdk.vault.getTransactionByHash(
   *   '0x1234567890abcdef...',
   *   1,
   *   accessToken
   * );
   * ```
   */
  async getTransactionByHash(
    txnHash: string,
    chainId: number,
    accessToken?: string,
  ): Promise<TransactionResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", chainId.toString());

    const url = `/${this.servicePrefix}/api/vaults/transactions/hash/${txnHash}?${queryParams.toString()}`;

    const response = await this.httpClient.get<TransactionResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }

  /**
   * Get available filter options for transactions
   * GET /vault/api/vaults/transactions/filters
   *
   * @param accessToken Access token (required for authenticated requests)
   * @returns Available filter options (chainIds, statuses, types)
   *
   * @example
   * ```typescript
   * const filters = await sdk.vault.getTransactionFilterOptions(accessToken);
   * console.log('Available chain IDs:', filters.filters.chainIds);
   * ```
   */
  async getTransactionFilterOptions(
    accessToken?: string,
  ): Promise<TransactionFilterOptionsResponse> {
    const url = `/${this.servicePrefix}/api/vaults/transactions/filters`;

    const response = await this.httpClient.get<TransactionFilterOptionsResponse>(url, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response;
  }
}

