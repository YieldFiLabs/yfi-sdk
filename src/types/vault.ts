/**
 * Vault API type definitions
 */

import { PaginationParams, PaginatedResponse } from "./common";

/**
 * Vault filters for listing vaults
 */
export interface VaultFilters extends PaginationParams {
  chainId?: number;
  status?: string;
}

/**
 * Vault reward detail
 */
export interface VaultRewardDetail {
  rewardDescription: string;
  validityStart: string | null;
  validityEnd: string | null;
  durationDays: number | null;
  rewardLink: string | null;
}

/**
 * Vault list item
 */
export interface VaultListItem {
  vaultKey: string;
  address: string;
  registry?: string | null;
  chainId: number;
  symbol: string | null;
  name: string | null;
  status: string;
  tvl: string | null;
  apy: number | null;
  nativeApy: number | null;
  additionalApy: number | null;
  totalApy: number | null;
  baseAsset: string;
  inPartnershipWith: string | null;
  strategyType: string | null;
  isPrivate: boolean;
  depositCap: string | null;
  depositRedeemEnabled: number; // 0 = none, 1 = deposit, 2 = both
  startDate: string | null;
  images: string[] | null;
  price: string | null;
  priceChange7d: number | null;
  createdAt: string;
  // Details from details table
  strategy: string | null;
  priceUpdateFrequency: string | null;
  redemptionSla: number | null;
  redemptionCapacity: string | null;
  transferability: boolean | null;
  custody: string | null;
  eligibility: string | null;
  legalTerms: string | null;
  risks: string | null;
  feeStructure: string | null;
  audits: any[] | null;
  // Rewards from rewards_details table
  rewards: VaultRewardDetail[];
}

/**
 * Vault base asset
 */
export interface VaultBaseAsset {
  address: string;
  symbol: string;
  decimals: number;
}

/**
 * Vault metrics
 */
export interface VaultMetrics {
  tvl: string;
  apy: number | null;
  apy7d: number | null;
  totalDeposits: string;
  totalWithdrawals: string;
}

/**
 * Vault fees
 */
export interface VaultFees {
  managementFee: number;
  performanceFee: number;
  chainFees?: Array<{
    chainId: number;
    managementFee: number;
    performanceFee: number;
    depositFee: number;
    withdrawFee: number;
  }>;
}

/**
 * Supported asset
 */
export interface SupportedAsset {
  address: string;
  symbol: string | null;
  name: string | null;
  decimals: number;
  depositRedeemEnabled: number; // 0 = none, 1 = deposit, 2 = both
}

/**
 * Vault partner/curator
 */
export interface VaultPartner {
  key: string;
  name: string | null;
  address: string | null;
  websiteUrl: string | null;
  contractAddress: string | null;
}

/**
 * Vault FAQ
 */
export interface VaultFaq {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

/**
 * Vault details
 */
export interface Vault {
  vaultKey: string;
  address: string;
  registry?: string | null;
  chainId: number;
  symbol: string | null;
  name: string | null;
  description: string | null;
  status: string;
  baseAsset: VaultBaseAsset;
  manager: string | null;
  supportedAssets: SupportedAsset[];
  metrics: VaultMetrics;
  fees: VaultFees;
  partner: VaultPartner | null;
  strategyType: string | null;
  isPrivate: boolean;
  depositCap: string | null;
  depositRedeemEnabled: number; // 0 = none, 1 = deposit, 2 = both
  startDate: string | null;
  images: string[] | null;
  price: string | null;
  priceChange7d: number | null;
  faqs: VaultFaq[];
  createdAt: string;
  updatedAt: string;
}


/**
 * Protocol statistics
 */
export interface ProtocolStats {
  totalTvl: string;
  maxApy: number | null;
  ypo: string | null;
  totalFundManagers: number;
  totalUsers: number;
  calculatedAt: string;
}

/**
 * Vault details/fact sheet
 */
export interface VaultDetails {
  vaultAddress: string;
  registry?: string | null;
  chainId: number;
  strategy: string | null;
  priceUpdateFrequency: string | null;
  redemptionSla: number | null;
  redemptionCapacity: string | null;
  transferability: boolean;
  custody: string | null;
  eligibility: string | null;
  legalTerms: string | null;
  risks: string | null;
  feeStructure: string | null;
  audits: any[] | null;
  backingRatio: number | null;
  yieldBuffer: number | null;
  slaWarningThreshold: number | null;
  updatedAt: string;
}

/**
 * Whitelisted asset
 */
export interface WhitelistedAsset {
  id: string;
  assetAddress: string;
  assetSymbol: string | null;
  assetName: string | null;
  assetDecimals: number;
  depositRedeemEnabled: number; // 0 = none, 1 = deposit, 2 = both
  isActive: boolean;
  addedAt: string;
  updatedAt: string;
}

/**
 * Add whitelisted asset request
 */
export interface AddWhitelistedAssetRequest {
  assetAddress: string;
  assetSymbol?: string;
  assetName?: string;
  assetDecimals?: number;
  depositRedeemEnabled?: number; // 0 = none, 1 = deposit, 2 = both
  addedBy?: string;
}

/**
 * Vault list response
 */
export interface VaultListResponse {
  success: boolean;
  vaults: VaultListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Vault response
 */
export interface VaultResponse {
  success: boolean;
  vault: Vault;
}

/**
 * Vault FAQs response
 */
export interface VaultFaqsResponse {
  success: boolean;
  faqs: VaultFaq[];
}

/**
 * Strategies response
 */
export interface StrategiesResponse {
  success: boolean;
  strategies: string[];
}

/**
 * Protocol stats response
 */
export interface ProtocolStatsResponse {
  success: boolean;
  stats: ProtocolStats;
}

/**
 * Vault details response
 */
export interface VaultDetailsResponse {
  success: boolean;
  details: VaultDetails;
}

/**
 * Whitelisted assets response
 */
export interface WhitelistedAssetsResponse {
  success: boolean;
  vaultKey: string;
  assets: WhitelistedAsset[];
  count: number;
}

/**
 * Whitelisted asset response
 */
export interface WhitelistedAssetResponse {
  success: boolean;
  asset: WhitelistedAsset & {
    vaultAddress: string;
    chainId: number;
    addedBy: string | null;
  };
}

/**
 * Check whitelisted asset response
 */
export interface CheckWhitelistedAssetResponse {
  success: boolean;
  vaultKey: string;
  assetAddress: string;
  isWhitelisted: boolean;
}

/**
 * Transaction filters for listing transactions
 */
export interface TransactionFilters extends PaginationParams {
  chainId?: number;
  vaultAddress?: string;
  userAddress?: string;
  receiverAddress?: string;
  assetAddress?: string;
  type?: 'deposit' | 'redemption';
  status?: 'PENDING' | 'PROCESSED' | 'CANCELLED' | 'NO-RETRY' | 'FAILED' | 'PAUSED';
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
}

/**
 * Transaction record
 */
export interface Transaction {
  id: number;
  chainId: number;
  txnHash: string;
  type: 'deposit' | 'redemption';
  vaultAddress: string;
  userAddress: string;
  receiverAddress?: string | null;
  assetAddress: string;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED' | 'NO-RETRY' | 'FAILED' | 'PAUSED';
  queueIndex?: number | null;
  assetAmount?: string | null;
  sharesAmount?: string | null;
  metaData?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transaction list response
 */
export interface TransactionListResponse {
  success: boolean;
  transactions: Transaction[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Transaction response
 */
export interface TransactionResponse {
  success: boolean;
  transaction: Transaction;
}

/**
 * Transaction filter options response
 */
export interface TransactionFilterOptionsResponse {
  success: boolean;
  filters: {
    chainIds: number[];
    statuses: string[];
    types: string[];
  };
}

/**
 * Curator vault role (admin/writer/reader per vault)
 */
export type CuratorVaultRoleType = 'admin' | 'writer' | 'reader';

export interface CuratorVaultRole {
  curatorAddress: string;
  vaultKey: string;
  role: CuratorVaultRoleType;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Vault role list response
 */
export interface VaultRoleListResponse {
  success: boolean;
  data: CuratorVaultRole[];
}

/**
 * Add or update vault role request
 */
export interface AddOrUpdateVaultRoleRequest {
  curatorAddress: string;
  role: CuratorVaultRoleType;
}

/**
 * Add or update vault role response
 */
export interface AddOrUpdateVaultRoleResponse {
  success: boolean;
  data: CuratorVaultRole;
}

/**
 * Pending redemption summary item (per vault and chain)
 */
export interface PendingRedemptionSummaryItem {
  chainId: number;
  vaultAddress: string;
  count: number;
  totalAssetAmount: string;
  totalSharesAmount: string;
}

/**
 * Pending redemptions summary response (curator-only)
 */
export interface PendingRedemptionsSummaryResponse {
  success: boolean;
  data: {
    pendingRedemptions: PendingRedemptionSummaryItem[];
    total: number;
  };
}

/**
 * Redemption type options for vault redemption jobs
 */
export type RedemptionType = 'ltoh' | 'htol' | 'fifo';

/**
 * Redemption job settings for a vault
 */
export interface RedemptionJobSettings {
  id?: number;
  vaultKey: string;
  vaultAddress?: string;
  chainId: number;
  enabled: boolean;
  intervalSeconds: number;
  redemptionType: RedemptionType;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Response for GET /api/vaults/settings - all vault redemption job settings
 */
export interface AllRedemptionJobSettingsResponse {
  success: boolean;
  data: RedemptionJobSettings[];
}

/**
 * Response for GET /api/vaults/:key/settings - per-vault redemption job settings
 * API returns an array (0 or more items when chainId provided, all matching when not)
 */
export interface RedemptionJobSettingsResponse {
  success: boolean;
  data: RedemptionJobSettings[];
}

/**
 * Request body for PUT /api/vaults/:key/settings - update redemption job settings
 */
export interface UpdateRedemptionJobSettingsRequest {
  chainId: number;
  enabled?: boolean;
  intervalSeconds?: number;
  redemptionType?: RedemptionType;
}

/**
 * Response for PUT /api/vaults/:key/settings - updated redemption job settings
 */
export interface UpdateRedemptionJobSettingsResponse {
  success: boolean;
  data: RedemptionJobSettings;
}

