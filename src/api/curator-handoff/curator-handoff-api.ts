/**
 * Curator Handoff API client
 *
 * Provides access to Curator Handoff Service endpoints via vault prefix.
 * Requires authentication for all endpoints.
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import {
    CuratorHandoffResponse,
    TransferCuratorAddressRequest,
} from "../../types";

export class CuratorHandoffAPI {
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
     * Get curator by key (to verify current address)
     * GET /vault/api/curators/:curatorKey
     *
     * @param curatorKey Curator key
     * @param accessToken Access token (required)
     * @returns Curator information
     *
     * @example
     * ```typescript
     * const curator = await sdk.curatorHandoff.getCuratorByKey('yieldfi', accessToken);
     * ```
     */
    async getCuratorByKey(
        curatorKey: string,
        accessToken: string,
    ): Promise<CuratorHandoffResponse> {
        const response = await this.httpClient.get<CuratorHandoffResponse>(
            `/${this.servicePrefix}/api/curators/${curatorKey}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Transfer curator address to a new address
     * POST /vault/api/curators/:curatorKey/handoff
     *
     * @param curatorKey Curator key
     * @param data Transfer data
     * @param accessToken Access token (required)
     * @returns Transfer result
     *
     * @example
     * ```typescript
     * const result = await sdk.curatorHandoff.transferCuratorAddress(
     *   'yieldfi',
     *   { newAddress: '0x1234...' },
     *   accessToken
     * );
     * ```
     */
    async transferCuratorAddress(
        curatorKey: string,
        data: TransferCuratorAddressRequest,
        accessToken: string,
    ): Promise<CuratorHandoffResponse> {
        const response = await this.httpClient.post<CuratorHandoffResponse>(
            `/${this.servicePrefix}/api/curators/${curatorKey}/handoff`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }
}
