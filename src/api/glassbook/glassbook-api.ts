/**
 * Glassbook API client
 *
 * Provides access to PTX (Partner Transaction) and Referral endpoints.
 * All methods require an access token for authentication.
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import { AuthenticationError } from "../../errors";
import {
  CreatePartnerTransactionRequest,
  PTXResponse,
  PTXListResponse,
  PTXFilters,
  Referral,
  CreateReferralRequest,
  UpdateReferralCodeRequest,
  ReferralStats,
  CodeAvailability,
  ReferredAddressesResponse,
} from "../../types";

export class GlassbookAPI {
  private readonly servicePrefix: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {
    this.servicePrefix = config.servicePrefixes.glassbook;
  }

  /**
   * Build authorization headers
   */
  private getAuthHeaders(accessToken: string): Record<string, string> {
    if (!accessToken) {
      throw new AuthenticationError("Access token is required");
    }
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  // ==================== PTX ENDPOINTS ====================

  /**
   * Store/Post a partner transaction
   * POST /gb/ptx
   *
   * @param accessToken Access token for authentication
   * @param transaction Transaction data to store
   * @returns Created partner transaction
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const ptx = await sdk.glassbook.createPartnerTransaction(accessToken, {
   *   transactionHash: '0x...',
   *   chainId: '1'
   * });
   * ```
   */
  async createPartnerTransaction(
    accessToken: string,
    transaction: CreatePartnerTransactionRequest,
  ): Promise<PTXResponse> {
    const response = await this.httpClient.post<{
      success: boolean;
      data: PTXResponse;
    }>(`/${this.servicePrefix}/ptx`, transaction, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get partner transactions with filters and pagination
   * GET /gb/ptx
   *
   * @param accessToken Access token for authentication
   * @param filters Query filters
   * @returns Paginated list of partner transactions
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const transactions = await sdk.glassbook.getPartnerTransactions(accessToken, {
   *   page: 1,
   *   pageSize: 10,
   *   chainId: '1'
   * });
   * ```
   */
  async getPartnerTransactions(
    accessToken: string,
    filters?: PTXFilters,
  ): Promise<PTXListResponse> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: PTXListResponse;
    }>(`/${this.servicePrefix}/ptx`, {
      headers: this.getAuthHeaders(accessToken),
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a specific partner transaction by ID
   * GET /gb/ptx/:id
   *
   * @param accessToken Access token for authentication
   * @param id Transaction ID
   * @returns Partner transaction
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const ptx = await sdk.glassbook.getPartnerTransactionById(accessToken, 123);
   * ```
   */
  async getPartnerTransactionById(
    accessToken: string,
    id: number,
  ): Promise<PTXResponse> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: PTXResponse;
    }>(`/${this.servicePrefix}/ptx/${id}`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get partner transactions for the current authenticated user
   * GET /gb/ptx/me
   *
   * @param accessToken Access token for authentication
   * @param page Page number (optional)
   * @param pageSize Page size (optional)
   * @returns Paginated list of user's partner transactions
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const myTransactions = await sdk.glassbook.getMyPartnerTransactions(accessToken, 1, 10);
   * ```
   */
  async getMyPartnerTransactions(
    accessToken: string,
    page?: number,
    pageSize?: number,
  ): Promise<PTXListResponse> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: PTXListResponse;
    }>(`/${this.servicePrefix}/ptx/me`, {
      headers: this.getAuthHeaders(accessToken),
      params: { page, pageSize },
    });
    return response.data;
  }

  // ==================== REFERRAL ENDPOINTS ====================

  /**
   * Get current user's referral data
   * GET /gb/referrals/me
   *
   * @param accessToken Access token for authentication
   * @returns User's referral data
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const myReferral = await sdk.glassbook.getMyReferral(accessToken);
   * ```
   */
  async getMyReferral(accessToken: string): Promise<Referral> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: Referral;
    }>(`/${this.servicePrefix}/referrals/me`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get current user's referral statistics
   * GET /gb/referrals/me/stats
   *
   * @param accessToken Access token for authentication
   * @returns User's referral statistics
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const stats = await sdk.glassbook.getMyReferralStats(accessToken);
   * ```
   */
  async getMyReferralStats(accessToken: string): Promise<ReferralStats> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: ReferralStats;
    }>(`/${this.servicePrefix}/referrals/me/stats`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get addresses referred by current user
   * GET /gb/referrals/me/referred
   *
   * @param accessToken Access token for authentication
   * @param page Page number (default: 1)
   * @param pageSize Page size (default: 50)
   * @returns Paginated list of referred addresses
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const referred = await sdk.glassbook.getMyReferredAddresses(accessToken, 1, 10);
   * ```
   */
  async getMyReferredAddresses(
    accessToken: string,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<ReferredAddressesResponse> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: ReferredAddressesResponse;
    }>(`/${this.servicePrefix}/referrals/me/referred`, {
      headers: this.getAuthHeaders(accessToken),
      params: { page, pageSize },
    });
    return response.data;
  }

  /**
   * Create a new referral
   * POST /gb/referrals
   *
   * @param accessToken Access token for authentication
   * @param request Referral creation request
   * @returns Created referral
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const referral = await sdk.glassbook.createReferral(accessToken, {
   *   code: 'MYCODE123',
   *   referredBy: 'REFERRER_CODE'
   * });
   * ```
   */
  async createReferral(
    accessToken: string,
    request: CreateReferralRequest,
  ): Promise<Referral> {
    const response = await this.httpClient.post<{
      success: boolean;
      data: Referral;
    }>(`/${this.servicePrefix}/referrals`, request, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get referral by code
   * GET /gb/referrals/code/:code
   *
   * @param accessToken Access token for authentication
   * @param code Referral code
   * @returns Referral data
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const referral = await sdk.glassbook.getReferralByCode(accessToken, 'MYCODE123');
   * ```
   */
  async getReferralByCode(
    accessToken: string,
    code: string,
  ): Promise<Referral> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: Referral;
    }>(`/${this.servicePrefix}/referrals/code/${code}`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Check if a referral code is available
   * GET /gb/referrals/check/:code
   *
   * @param accessToken Access token for authentication
   * @param code Referral code to check
   * @returns Code availability status
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const availability = await sdk.glassbook.checkReferralCodeAvailability(accessToken, 'MYCODE123');
   * ```
   */
  async checkReferralCodeAvailability(
    accessToken: string,
    code: string,
  ): Promise<CodeAvailability> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: CodeAvailability;
    }>(`/${this.servicePrefix}/referrals/check/${code}`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get referral by address
   * GET /gb/referrals/:address
   *
   * @param accessToken Access token for authentication
   * @param address Ethereum address
   * @returns Referral data
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const referral = await sdk.glassbook.getReferralByAddress(accessToken, '0x...');
   * ```
   */
  async getReferralByAddress(
    accessToken: string,
    address: string,
  ): Promise<Referral> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: Referral;
    }>(`/${this.servicePrefix}/referrals/${address}`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Update referral code
   * PUT /gb/referrals/:address/code
   *
   * @param accessToken Access token for authentication
   * @param address Ethereum address
   * @param request Update request with new code
   * @returns Updated referral
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const updated = await sdk.glassbook.updateReferralCode(accessToken, '0x...', {
   *   code: 'NEWCODE123'
   * });
   * ```
   */
  async updateReferralCode(
    accessToken: string,
    address: string,
    request: UpdateReferralCodeRequest,
  ): Promise<Referral> {
    const response = await this.httpClient.put<{
      success: boolean;
      data: Referral;
    }>(`/${this.servicePrefix}/referrals/${address}/code`, request, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get referral statistics for a specific address
   * GET /gb/referrals/:address/stats
   *
   * @param accessToken Access token for authentication
   * @param address Ethereum address
   * @returns Referral statistics
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const stats = await sdk.glassbook.getReferralStats(accessToken, '0x...');
   * ```
   */
  async getReferralStats(
    accessToken: string,
    address: string,
  ): Promise<ReferralStats> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: ReferralStats;
    }>(`/${this.servicePrefix}/referrals/${address}/stats`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get addresses referred by a specific address
   * GET /gb/referrals/:address/referred
   *
   * @param accessToken Access token for authentication
   * @param address Ethereum address
   * @param page Page number (default: 1)
   * @param pageSize Page size (default: 50)
   * @returns Paginated list of referred addresses
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const referred = await sdk.glassbook.getReferredAddressesByAddress(accessToken, '0x...', 1, 10);
   * ```
   */
  async getReferredAddressesByAddress(
    accessToken: string,
    address: string,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<ReferredAddressesResponse> {
    const response = await this.httpClient.get<{
      success: boolean;
      data: ReferredAddressesResponse;
    }>(`/${this.servicePrefix}/referrals/${address}/referred`, {
      headers: this.getAuthHeaders(accessToken),
      params: { page, pageSize },
    });
    return response.data;
  }
}
