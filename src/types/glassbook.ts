/**
 * Glassbook API type definitions
 */

/**
 * Partner transaction status enum
 */
export enum PartnerTransactionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

/**
 * Partner transaction creation request
 */
export interface CreatePartnerTransactionRequest {
  /**
   * Transaction hash from blockchain
   */
  transactionHash: string;

  /**
   * Blockchain chain ID
   */
  chainId: string;
}

/**
 * Partner transaction response
 */
export interface PTXResponse {
  /**
   * Transaction ID
   */
  id: number;

  /**
   * Transaction hash
   */
  transactionHash: string;

  /**
   * User address
   */
  userAddress: string;

  /**
   * Partner ID
   */
  partnerId: string;

  /**
   * Chain ID
   */
  chainId: string;

  /**
   * Creation timestamp (Unix timestamp)
   */
  createdAt: number;
}

/**
 * Partner transaction query filters
 */
export interface PTXFilters {
  userAddress?: string;
  partnerId?: string;
  chainId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Paginated partner transaction response
 */
export interface PTXListResponse {
  transactions: PTXResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Referral interface
 */
export interface Referral {
  id: number;
  code: string;
  address: string;
  referredBy: string | null;
  createdAt: number;
}

/**
 * Request for creating a new referral
 */
export interface CreateReferralRequest {
  address?: string;
  code?: string;
  referredBy?: string;
}

/**
 * Request for updating referral code
 */
export interface UpdateReferralCodeRequest {
  code: string;
}

/**
 * Referral statistics
 */
export interface ReferralStats {
  totalReferred: number;
  address: string;
  crumbs: number;
  lastRunAt: number;
  code: string;
}

/**
 * Code availability check response
 */
export interface CodeAvailability {
  code: string;
  available: boolean;
}

/**
 * Referred addresses paginated response
 */
export interface ReferredAddressesResponse {
  referrer: string;
  referredAddresses: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
