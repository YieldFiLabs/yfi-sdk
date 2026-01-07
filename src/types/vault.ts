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
 * Vault list item
 */
export interface VaultListItem {
  address: string;
  chainId: number;
  name: string | null;
  status: string;
  tvl: string | null;
  apy: number | null;
  baseAsset: string;
  inPartnershipWith: string | null;
  strategyType: string | null;
  isPrivate: boolean;
  depositCap: string | null;
  totalDeposited: string;
  startDate: string | null;
  redemptionSla: number | null;
  images: string[] | null;
  nativeApy: number | null;
  additionalApy: number | null;
  rewards1: string | null;
  rewards2: string | null;
  expiryDate: string | null;
  totalApy: number | null;
  price: string | null;
  priceChange7d: number | null;
  createdAt: string;
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
  totalDeposits: string;
  totalWithdrawals: string;
}

/**
 * Vault fees
 */
export interface VaultFees {
  managementFee: number;
  performanceFee: number;
}

/**
 * Supported asset
 */
export interface SupportedAsset {
  address: string;
  symbol: string | null;
  name: string | null;
  decimals: number;
}

/**
 * Vault details
 */
export interface Vault {
  address: string;
  chainId: number;
  name: string | null;
  status: string;
  baseAsset: VaultBaseAsset;
  supportedAssets: SupportedAsset[];
  metrics: VaultMetrics;
  fees: VaultFees;
  inPartnershipWith: string | null;
  strategyType: string | null;
  isPrivate: boolean;
  depositCap: string | null;
  totalDeposited: string;
  startDate: string | null;
  redemptionSla: number | null;
  images: string[] | null;
  apy: number | null;
  nativeApy: number | null;
  additionalApy: number | null;
  rewards1: string | null;
  rewards2: string | null;
  expiryDate: string | null;
  totalApy: number | null;
  price: string | null;
  priceChange7d: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vault state
 */
export interface VaultState {
  address: string;
  chainId: number;
  totalAssets: string;
  totalSupply: string;
  pricePerShare: string;
  tvl: string;
  apy: number;
  lastUpdated: string;
  blockNumber: string;
  transactionHash: string;
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
  manager: string | null;
  yieldType: string | null;
  priceUpdateFrequency: string | null;
  rewards: string | null;
  redemptionSla: number | null;
  redemptionCapacity: string | null;
  transferability: boolean;
  custody: string | null;
  eligibility: string | null;
  legalTerms: string | null;
  risks: string | null;
  feeStructure: string | null;
  audits: any[] | null;
  depositChains: number[];
  withdrawChains: number[];
  contractAddress: string | null;
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
 * Vault state response
 */
export interface VaultStateResponse {
  success: boolean;
  state: VaultState;
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
  vaultAddress: string;
  chainId: number;
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
  vaultAddress: string;
  assetAddress: string;
  chainId: number;
  isWhitelisted: boolean;
}

