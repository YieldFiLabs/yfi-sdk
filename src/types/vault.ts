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

