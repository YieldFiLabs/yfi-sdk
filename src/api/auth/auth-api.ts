/**
 * Authentication API client
 *
 * Token management is the responsibility of the application using this SDK.
 * Store tokens (accessToken, refreshToken) in your preferred storage mechanism
 * (localStorage, sessionStorage, secure storage, etc.)
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import { AuthenticationError } from "../../errors";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  NonceRequest,
  NonceResponse,
  ConsentType,
  RecordConsentRequest,
  RecordConsentResponse,
  GetConsentResponse,
  GetUserConsentsResponse,
  GetConsentStatusesResponse,
} from "../../types";

export class AuthAPI {
  private readonly authPrefix: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {
    this.authPrefix = config.servicePrefixes.auth;
  }

  /**
   * Generate a nonce for message signing
   * @param request Nonce request with address
   * @returns Nonce response with message to sign and expiration
   *
   * @example
   * ```typescript
   * const nonce = await sdk.auth.generateNonce({ address: '0x...' });
   * // Sign nonce.message with wallet
   * const signature = await wallet.signMessage(nonce.message);
   * ```
   */
  async generateNonce(request: NonceRequest): Promise<NonceResponse> {
    try {
      const response = await this.httpClient.post<NonceResponse>(
        `/${this.authPrefix}/nonce`,
        request,
      );
      return response;
    } catch (error: any) {
      throw new AuthenticationError("Failed to generate nonce", {
        error: error.message,
      });
    }
  }

  /**
   * Login with Ethereum signature
   * @param credentials Login credentials (address, signature, message)
   * @returns Authentication response with tokens and user info
   *
   * @example
   * ```typescript
   * // 1. Generate a nonce
   * const nonce = await sdk.auth.generateNonce({ address: '0x...' });
   *
   * // 2. Sign the nonce message with wallet
   * const signature = await wallet.signMessage(nonce.message);
   *
   * // 3. Login with signature
   * const authResponse = await sdk.auth.login({
   *   address: '0x...',
   *   signature,
   *   message: nonce.message
   * });
   *
   * // 4. Store tokens in your application
   * localStorage.setItem('accessToken', authResponse.accessToken);
   * localStorage.setItem('refreshToken', authResponse.refreshToken);
   * ```
   */
  async login(
    credentials: Omit<LoginRequest, "partnerId">,
  ): Promise<LoginResponse> {
    try {
      // Include partnerId from config
      const request: LoginRequest = {
        ...credentials,
        partnerId: this.config.partnerId,
      };

      const response = await this.httpClient.post<LoginResponse>(
        `/${this.authPrefix}/login`,
        request,
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Login failed", {
        error: error.message,
      });
    }
  }

  /**
   * Refresh access token using a refresh token or API key
   * @param request Refresh token or API key
   * @returns New token pair
   *
   * @example
   * ```typescript
   * // Using refresh token
   * const refreshToken = localStorage.getItem('refreshToken');
   * const newTokens = await sdk.auth.refresh({
   *   refreshToken
   * });
   * localStorage.setItem('accessToken', newTokens.accessToken);
   *
   * // Using API key
   * const newTokens = await sdk.auth.refresh({
   *   apiKey: 'yfi_...'
   * });
   * ```
   */
  async refresh(
    request: Omit<RefreshTokenRequest, "partnerId">,
  ): Promise<RefreshTokenResponse> {
    try {
      const fullRequest: RefreshTokenRequest = {
        ...request,
        partnerId: this.config.partnerId,
      };

      const response = await this.httpClient.post<RefreshTokenResponse>(
        `/${this.authPrefix}/refresh`,
        fullRequest,
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Token refresh failed", {
        error: error.message,
      });
    }
  }

  /**
   * Logout and revoke all tokens for the authenticated user
   * @param accessToken Access token for authentication
   * @returns Logout response with number of tokens revoked
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const result = await sdk.auth.logout(accessToken);
   *
   * // Clear tokens from storage
   * localStorage.removeItem('accessToken');
   * localStorage.removeItem('refreshToken');
   * ```
   */
  async logout(
    accessToken: string,
  ): Promise<{ message: string; tokensRevoked: number }> {
    try {
      const response = await this.httpClient.post<{
        message: string;
        tokensRevoked: number;
      }>(
        `/${this.authPrefix}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Logout failed", {
        error: error.message,
      });
    }
  }

  // ==================== CONSENT ENDPOINTS ====================

  /**
   * Record user consent for various consent types
   * 
   * This endpoint allows users to record their consent for different types of agreements
   * such as terms of service, privacy policy, marketing communications, analytics, and cookies.
   * Once consent is recorded, it cannot be deleted or revoked (for audit compliance).
   * 
   * **Consent Types:**
   * You can use the `ConsentType` enum for convenience, or pass any string value.
   * Common consent types include:
   * - `TERMS_OF_SERVICE` / `'terms_of_service'` - User acceptance of terms of service
   * - `PRIVACY_POLICY` / `'privacy_policy'` - User acceptance of privacy policy
   * - `MARKETING` / `'marketing'` - User consent for marketing communications
   * - `ANALYTICS` / `'analytics'` - User consent for analytics tracking
   * - `COOKIES` / `'cookies'` - User consent for cookie usage
   * 
   * **Important:** Consent records are immutable for audit purposes. Once granted, 
   * consent cannot be revoked or deleted, ensuring a complete audit trail.
   * 
   * POST /auth/consent
   *
   * @param accessToken Access token for authentication (required)
   * @param request Consent data to record
   * @param request.consentType Type of consent (can be ConsentType enum or any string)
   * @param request.version Version of the consent document (e.g., '1.0', '2.1')
   * @param request.granted Whether consent is granted (defaults to true)
   * @param request.metadata Optional metadata (e.g., document hash, source URL)
   * @returns Recorded consent with full details including timestamps and IP address
   * @throws {AuthenticationError} If authentication fails or user is not authenticated
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * 
   * // Record terms of service consent (using enum)
   * const consent = await sdk.auth.recordConsent(accessToken, {
   *   consentType: ConsentType.TERMS_OF_SERVICE,
   *   version: '1.0',
   *   granted: true,
   *   metadata: {
   *     documentHash: '0x...',
   *     sourceUrl: 'https://yield.fi/terms'
   *   }
   * });
   * 
   * // Record consent (using string)
   * await sdk.auth.recordConsent(accessToken, {
   *   consentType: 'custom_consent_type',
   *   version: '1.0',
   *   granted: true
   * });
   * 
   * // Record marketing consent (using enum)
   * await sdk.auth.recordConsent(accessToken, {
   *   consentType: ConsentType.MARKETING,
   *   version: '1.0',
   *   granted: true
   * });
   * ```
   */
  async recordConsent(
    accessToken: string,
    request: RecordConsentRequest,
  ): Promise<RecordConsentResponse> {
    try {
      const response = await this.httpClient.post<RecordConsentResponse>(
        `/${this.authPrefix}/consent`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Failed to record consent", {
        error: error.message,
      });
    }
  }

  /**
   * Get user consent record for a specific consent type
   * 
   * Retrieves the consent record for a specific consent type. If a version is provided,
   * returns the consent for that specific version. If no version is provided, returns
   * the most recent consent record for that type.
   * 
   * This is useful for:
   * - Checking if a user has consented to a specific agreement
   * - Verifying consent for a specific version of a document
   * - Displaying consent history to users
   * 
   * GET /auth/consent/:consentType
   *
   * @param accessToken Access token for authentication (required)
   * @param consentType Type of consent to retrieve (can be ConsentType enum or any string)
   * @param version Optional version of the consent document (e.g., '1.0'). If not provided, returns the latest consent
   * @returns Consent record with full details including granted status, timestamps, IP address, and metadata
   * @throws {AuthenticationError} If authentication fails or consent not found
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * 
   * // Get latest terms of service consent (using enum)
   * const consent = await sdk.auth.getConsent(
   *   accessToken,
   *   ConsentType.TERMS_OF_SERVICE
   * );
   * 
   * // Get latest consent (using string)
   * const consent = await sdk.auth.getConsent(
   *   accessToken,
   *   'custom_consent_type'
   * );
   * 
   * // Get specific version of privacy policy consent
   * const privacyConsent = await sdk.auth.getConsent(
   *   accessToken,
   *   ConsentType.PRIVACY_POLICY,
   *   '2.0'
   * );
   * 
   * if (consent.data.granted) {
   *   console.log('User has consented');
   * }
   * ```
   */
  async getConsent(
    accessToken: string,
    consentType: ConsentType | string,
    version?: string,
  ): Promise<GetConsentResponse> {
    try {
      const queryParams = version ? `?version=${version}` : '';
      const response = await this.httpClient.get<GetConsentResponse>(
        `/${this.authPrefix}/consent/${consentType}${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Failed to get consent", {
        error: error.message,
      });
    }
  }

  /**
   * Get all consent records for the authenticated user
   * 
   * Retrieves a complete list of all consent records for the authenticated user,
   * including all consent types and versions. This provides a full audit trail
   * of all consent decisions made by the user.
   * 
   * The response includes:
   * - All consent types the user has interacted with
   * - Multiple versions of the same consent type (if user consented to different versions)
   * - Full history including granted status, timestamps, IP addresses, and metadata
   * 
   * This is useful for:
   * - Displaying a user's complete consent history
   * - Compliance reporting and audit trails
   * - Understanding user consent preferences
   * 
   * GET /auth/consent
   *
   * @param accessToken Access token for authentication (required)
   * @returns List of all user consent records with count
   * @throws {AuthenticationError} If authentication fails
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const consents = await sdk.auth.getUserConsents(accessToken);
   * 
   * console.log(`User has ${consents.count} consent records`);
   * 
   * // Filter by consent type
   * const marketingConsents = consents.data.filter(
   *   c => c.consentType === ConsentType.MARKETING
   * );
   * 
   * // Display consent history
   * consents.data.forEach(consent => {
   *   console.log(`${consent.consentType} v${consent.version}: ${consent.granted ? 'Granted' : 'Not granted'}`);
   * });
   * ```
   */
  async getUserConsents(accessToken: string): Promise<GetUserConsentsResponse> {
    try {
      const response = await this.httpClient.get<GetUserConsentsResponse>(
        `/${this.authPrefix}/consent`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Failed to get user consents", {
        error: error.message,
      });
    }
  }

  /**
   * Get consent status summary for all consent types
   * 
   * Retrieves a summary of the user's consent status for each consent type.
   * For each consent type, returns the most recent consent decision (granted or not granted)
   * along with the version and timestamps.
   * 
   * Unlike `getUserConsents()` which returns all consent records, this endpoint returns
   * only the latest status for each consent type, making it ideal for:
   * - Quick consent checks before performing actions
   * - Displaying current consent status in UI
   * - Determining if user needs to provide new consent
   * - Compliance checks (e.g., "Can we send marketing emails?")
   * 
   * **Response Structure:**
   * - One entry per consent type (latest version only)
   * - Includes granted status, version, and timestamps
   * - Does not include full history or metadata
   * 
   * GET /auth/consent/status
   *
   * @param accessToken Access token for authentication (required)
   * @returns Summary of consent statuses for all consent types
   * @throws {AuthenticationError} If authentication fails
   *
   * @example
   * ```typescript
   * const accessToken = localStorage.getItem('accessToken');
   * const statuses = await sdk.auth.getConsentStatuses(accessToken);
   * 
   * // Check if user has consented to marketing
   * const marketingStatus = statuses.data.find(
   *   s => s.consentType === ConsentType.MARKETING
   * );
   * 
   * if (marketingStatus?.granted) {
   *   // User has consented, can send marketing emails
   *   sendMarketingEmail();
   * } else {
   *   // User has not consented, show consent banner
   *   showConsentBanner();
   * }
   * 
   * // Check all consent types
   * statuses.data.forEach(status => {
   *   console.log(`${status.consentType}: ${status.granted ? 'Granted' : 'Not granted'} (v${status.version})`);
   * });
   * ```
   */
  async getConsentStatuses(
    accessToken: string,
  ): Promise<GetConsentStatusesResponse> {
    try {
      const response = await this.httpClient.get<GetConsentStatusesResponse>(
        `/${this.authPrefix}/consent/status`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response;
    } catch (error: any) {
      throw new AuthenticationError("Failed to get consent statuses", {
        error: error.message,
      });
    }
  }

}
