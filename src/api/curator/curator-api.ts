/**
 * Curator API client
 *
 * Provides access to Curator onboarding and admin endpoints via vault prefix.
 * Requires authentication for all endpoints.
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import {
  CreateCuratorRequest,
  CreateCuratorResponse,
  CuratorVaultsResponse,
  AllCuratorsResponse,
  AllCuratorVaultsResponse,
} from "../../types";

export class CuratorAPI {
  private readonly servicePrefix: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {
    this.servicePrefix = config.servicePrefixes.vault;
  }

  /**
   * Build authorization headers
   */
  private getAuthHeaders(accessToken: string): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  /**
   * Create curator (onboard)
   * POST /vault/api/curator/create
   *
   * @param accessToken Access token (required)
   * @param body Curator onboarding data
   * @returns Created curator
   */
  async createCurator(
    accessToken: string,
    body: CreateCuratorRequest,
  ): Promise<CreateCuratorResponse> {
    const response = await this.httpClient.post<CreateCuratorResponse>(
      `/${this.servicePrefix}/api/curator/create`,
      body,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Get curator's vaults
   * GET /vault/api/curators/vaults
   *
   * @param accessToken Access token (required - must be curator)
   * @returns List of vaults for the authenticated curator
   */
  async getCuratorVaults(accessToken: string): Promise<CuratorVaultsResponse> {
    const response = await this.httpClient.get<CuratorVaultsResponse>(
      `/${this.servicePrefix}/api/curators/vaults`,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Get all curators (admin only)
   * GET /vault/api/admin/curators
   *
   * @param accessToken Access token (required - must be admin)
   * @returns List of all curators
   */
  async getAllCurators(accessToken: string): Promise<AllCuratorsResponse> {
    const response = await this.httpClient.get<AllCuratorsResponse>(
      `/${this.servicePrefix}/api/admin/curators`,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }

  /**
   * Get all vaults for each curator (admin only)
   * GET /vault/api/admin/curators/vaults
   *
   * @param accessToken Access token (required - must be admin)
   * @returns Curators with their vaults
   */
  async getAllCuratorVaults(
    accessToken: string,
  ): Promise<AllCuratorVaultsResponse> {
    const response = await this.httpClient.get<AllCuratorVaultsResponse>(
      `/${this.servicePrefix}/api/admin/curators/vaults`,
      {
        headers: this.getAuthHeaders(accessToken),
      },
    );
    return response;
  }
}
