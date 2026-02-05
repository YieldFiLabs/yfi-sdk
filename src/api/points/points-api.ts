/**
 * Points API client
 *
 * Provides access to user points, balances, and protocol points endpoints.
 * Requests go through the gateway (e.g. /pts/api/points/...).
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import {
  UserPointsResponse,
  UserBalancesResponse,
  ProtocolPointsResponse,
  PointsApiResponse,
} from "../../types";

export class PointsAPI {
  private readonly servicePrefix: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {
    this.servicePrefix = config.servicePrefixes.points;
  }

  /**
   * Build optional authorization headers
   */
  private getAuthHeaders(accessToken?: string): Record<string, string> {
    if (!accessToken) {
      return {};
    }
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  /**
   * Get a user's total points and breakdown by protocol
   * GET /pts/api/points/user/:address
   *
   * @param address Ethereum address (0x...)
   * @param accessToken Optional access token for authenticated requests
   * @returns User points and protocols breakdown
   *
   * @example
   * ```typescript
   * const points = await sdk.points.getUserPoints('0x...', accessToken);
   * console.log(points.totalPoints, points.protocols);
   * ```
   */
  async getUserPoints(
    address: string,
    accessToken?: string,
  ): Promise<UserPointsResponse> {
    const response = await this.httpClient.get<
      PointsApiResponse<UserPointsResponse>
    >(`/${this.servicePrefix}/api/points/user/${encodeURIComponent(address)}`, {
      headers: this.getAuthHeaders(accessToken),
    });
    return response.data;
  }

  /**
   * Get user balances by protocol and chain
   * GET /pts/api/points/balances/:address
   *
   * @param address Ethereum address (0x...)
   * @param accessToken Optional access token
   * @param chainId Optional chain ID filter
   * @returns User balances grouped by protocol
   *
   * @example
   * ```typescript
   * const balances = await sdk.points.getUserBalances('0x...', accessToken, '1');
   * ```
   */
  async getUserBalances(
    address: string,
    accessToken?: string,
    chainId?: string,
  ): Promise<UserBalancesResponse> {
    const response = await this.httpClient.get<
      PointsApiResponse<UserBalancesResponse>
    >(
      `/${this.servicePrefix}/api/points/balances/${encodeURIComponent(address)}`,
      {
        headers: this.getAuthHeaders(accessToken),
        params: chainId ? { chainId } : undefined,
      },
    );
    return response.data;
  }

  /**
   * Get all points for a specific protocol
   * GET /pts/api/points/protocol/:protocolId
   *
   * @param protocolId Protocol identifier
   * @param accessToken Optional access token
   * @param options Optional query params (limit, offset, chainId, tokenAddress)
   * @returns Protocol points with user breakdown
   *
   * @example
   * ```typescript
   * const protocolPoints = await sdk.points.getProtocolPoints('my-protocol', accessToken, {
   *   limit: 50,
   *   offset: 0,
   *   chainId: '1',
   * });
   * ```
   */
  async getProtocolPoints(
    protocolId: string,
    accessToken?: string,
    options?: {
      limit?: number;
      offset?: number;
      chainId?: string;
      tokenAddress?: string;
    },
  ): Promise<ProtocolPointsResponse> {
    const response = await this.httpClient.get<
      PointsApiResponse<ProtocolPointsResponse>
    >(
      `/${this.servicePrefix}/api/points/protocol/${encodeURIComponent(protocolId)}`,
      {
        headers: this.getAuthHeaders(accessToken),
        params: options,
      },
    );
    return response.data;
  }
}
