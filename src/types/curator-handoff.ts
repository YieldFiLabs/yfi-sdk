/**
 * Type definitions for Curator Handoff API
 */

/**
 * Curator Handoff Response
 */
export interface CuratorHandoffResponse {
    success: boolean;
    message?: string;
    curator?: {
        id: string;
        key: string;
        name: string | null;
        address: string | null;
        websiteUrl: string | null;
        vault: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

/**
 * Transfer Curator Address Request
 */
export interface TransferCuratorAddressRequest {
    newAddress: string;
}
