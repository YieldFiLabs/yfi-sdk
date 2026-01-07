/**
 * Auth-related type definitions
 */

/**
 * Login request payload
 */
export interface LoginRequest {
  /**
   * Ethereum address
   */
  address: string;

  /**
   * Signature from signing the message
   */
  signature: string;

  /**
   * Message that was signed
   */
  message: string;

  /**
   * Optional partner ID for tracking
   */
  partnerId?: string;
}

/**
 * Nonce request payload
 */
export interface NonceRequest {
  /**
   * Ethereum address
   */
  address: string;
}

/**
 * Nonce response
 */
export interface NonceResponse {
  /**
   * Message to sign (includes address and timestamp)
   */
  message: string;

  /**
   * Timestamp when nonce was generated (epoch seconds)
   */
  timestamp: number;

  /**
   * Timestamp when nonce expires (epoch seconds, valid for 5 minutes)
   */
  expiresAt: number;
}

/**
 * User object returned in login response
 */
export interface AuthUser {
  /**
   * User ID
   */
  id: string;

  /**
   * Ethereum address
   */
  address: string;

  /**
   * User role
   */
  role: string;
}

/**
 * Login/Authentication response
 */
export interface LoginResponse {
  /**
   * Legacy token (for backward compatibility)
   */
  token: string;

  /**
   * Legacy token expiration (epoch seconds)
   */
  expiresAt: number;

  /**
   * Access token (JWT, short-lived)
   */
  accessToken: string;

  /**
   * Refresh token (long-lived)
   */
  refreshToken: string;

  /**
   * Access token expiration timestamp (epoch seconds)
   */
  accessTokenExpiresAt: number;

  /**
   * Refresh token expiration timestamp (epoch seconds)
   */
  refreshTokenExpiresAt: number;

  /**
   * User information
   */
  user: AuthUser;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  /**
   * Refresh token to use
   */
  refreshToken?: string;

  /**
   * API key to use (alternative to refresh token)
   */
  apiKey?: string;

  /**
   * Optional partner ID
   */
  partnerId?: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  /**
   * New access token
   */
  accessToken: string;

  /**
   * Refresh token (same as input for refreshToken flow)
   */
  refreshToken?: string;

  /**
   * Access token expiration timestamp (epoch seconds)
   */
  accessTokenExpiresAt: number;

  /**
   * Refresh token expiration timestamp (epoch seconds, only if refreshToken used)
   */
  refreshTokenExpiresAt?: number;
}

/**
 * Consent types for user agreements and permissions
 * 
 * These types represent different categories of user consent that can be recorded
 * and tracked for compliance and user preference management.
 */
export enum ConsentType {
  /**
   * User acceptance of terms of service
   * Required for using the platform
   */
  TERMS_OF_SERVICE = 'terms_of_service',
  
  /**
   * User acceptance of privacy policy
   * Required for data processing compliance
   */
  PRIVACY_POLICY = 'privacy_policy',
  
  /**
   * User consent for marketing communications
   * Optional - allows sending promotional emails, newsletters, etc.
   */
  MARKETING = 'marketing',
  
  /**
   * User consent for analytics tracking
   * Optional - allows collecting usage analytics and metrics
   */
  ANALYTICS = 'analytics',
  
  /**
   * User consent for cookie usage
   * Optional - allows using cookies for functionality and tracking
   */
  COOKIES = 'cookies',
}

/**
 * User consent record
 * 
 * Represents a single consent record for a user. Consent records are immutable
 * for audit compliance - once created, they cannot be deleted or revoked.
 */
export interface UserConsent {
  /** Unique identifier for the consent record */
  id: string;
  
  /** Ethereum address of the user who provided consent */
  userAddress: string;
  
  /** Type of consent (TERMS_OF_SERVICE, PRIVACY_POLICY, MARKETING, etc.) */
  consentType: ConsentType;
  
  /** Version of the consent document (e.g., '1.0', '2.1') */
  version: string;
  
  /** Whether consent was granted (true) or not granted (false) */
  granted: boolean;
  
  /** ISO timestamp when consent was granted */
  grantedAt: string;
  
  /** ISO timestamp when consent was revoked (null if never revoked) */
  revokedAt: string | null;
  
  /** IP address from which consent was recorded (for audit purposes) */
  ipAddress: string | null;
  
  /** User agent string from which consent was recorded (for audit purposes) */
  userAgent: string | null;
  
  /** Additional metadata (e.g., document hash, source URL) */
  metadata: Record<string, unknown> | null;
  
  /** ISO timestamp when the consent record was created */
  createdAt: string;
  
  /** ISO timestamp when the consent record was last updated */
  updatedAt: string;
}

/**
 * Request payload for recording user consent
 */
export interface RecordConsentRequest {
  /** Type of consent to record */
  consentType: ConsentType;
  
  /** Version of the consent document (e.g., '1.0', '2.1') */
  version: string;
  
  /** Whether consent is granted (defaults to true if not specified) */
  granted?: boolean;
  
  /** Optional metadata (e.g., document hash, source URL, etc.) */
  metadata?: Record<string, unknown>;
}

/**
 * Record consent response
 */
export interface RecordConsentResponse {
  success: boolean;
  data: UserConsent;
}

/**
 * Get consent response
 */
export interface GetConsentResponse {
  success: boolean;
  data: UserConsent;
}

/**
 * Get user consents response
 */
export interface GetUserConsentsResponse {
  success: boolean;
  data: UserConsent[];
  count: number;
}

/**
 * Consent status summary for a specific consent type
 * 
 * Represents the latest consent status for a consent type, including
 * whether it was granted, the version, and relevant timestamps.
 */
export interface ConsentStatus {
  /** Type of consent */
  consentType: ConsentType;
  
  /** Version of the consent document */
  version: string;
  
  /** Whether consent was granted */
  granted: boolean;
  
  /** ISO timestamp when consent was granted (null if never granted) */
  grantedAt: string | null;
  
  /** ISO timestamp when consent was revoked (null if never revoked) */
  revokedAt: string | null;
}

/**
 * Get consent statuses response
 */
export interface GetConsentStatusesResponse {
  success: boolean;
  data: ConsentStatus[];
}

