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
