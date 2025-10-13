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
}
