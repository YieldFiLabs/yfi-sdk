/**
 * Form API client
 *
 * Provides access to Curator Form Service endpoints via vault prefix.
 * Handles all curator forms (onboarding, vault requests, etc.)
 * Requires authentication for all endpoints.
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import {
    GetActiveFormsResponse,
    GetFormByIdResponse,
    CreateFormRequest,
    CreateFormResponse,
    CreateStageRequest,
    CreateStageResponse,
    CreateStepRequest,
    CreateStepResponse,
    GetInstancesByCuratorResponse,
    GetCuratorMetricsResponse,
    GetInstanceByIdResponse,
    CreateInstanceRequest,
    CreateInstanceResponse,
    UpdateInstanceRequest,
    UpdateInstanceResponse,
    SaveStepResponseRequest,
    SaveStepResponseResponse,
    SubmitStepResponseResponse,
    GetStepResponseResponse,
    ApproveStepResponseRequest,
    ApproveStepResponseResponse,
    GetApprovalsByInstanceResponse,
} from "../../types";

export class FormAPI {
    private readonly servicePrefix: string;

    constructor(
        private httpClient: HttpClient,
        private config: SDKConfig,
    ) {
        this.servicePrefix = config.servicePrefixes.vault;
    }

    /**
     * Build authorization headers
     * All onboarding endpoints require authentication
     */
    private getAuthHeaders(accessToken: string): Record<string, string> {
        if (!accessToken) {
            throw new Error('Access token is required for onboarding API calls');
        }
        return {
            Authorization: `Bearer ${accessToken}`,
        };
    }

    // ==================== CURATOR ENDPOINTS (AUTHENTICATED) ====================

    /**
     * Get all active onboarding forms (requires authentication)
     * GET /vault/api/onboarding/forms
     *
     * @param accessToken Access token (required)
     * @returns List of active forms
     *
     * @example
     * ```typescript
     * const forms = await sdk.onboarding.getActiveForms(accessToken);
     * ```
     */
    async getActiveForms(accessToken: string): Promise<GetActiveFormsResponse> {
        const response = await this.httpClient.get<GetActiveFormsResponse>(
            `/${this.servicePrefix}/api/onboarding/forms`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get form by ID with full details (requires authentication)
     * GET /vault/api/onboarding/forms/:formId
     *
     * @param formId Form ID
     * @param accessToken Access token (required)
     * @returns Form with stages and steps
     *
     * @example
     * ```typescript
     * const form = await sdk.onboarding.getFormById(1, accessToken);
     * ```
     */
    async getFormById(
        formId: number,
        accessToken: string,
    ): Promise<GetFormByIdResponse> {
        const response = await this.httpClient.get<GetFormByIdResponse>(
            `/${this.servicePrefix}/api/onboarding/forms/${formId}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all active onboarding forms (Admin)
     * GET /vault/api/admin/onboarding/forms
     *
     * @param accessToken Access token (required for admin endpoints)
     * @returns List of active forms
     *
     * @example
     * ```typescript
     * const forms = await sdk.onboarding.getActiveFormsAdmin(accessToken);
     * ```
     */
    async getActiveFormsAdmin(accessToken: string): Promise<GetActiveFormsResponse> {
        const response = await this.httpClient.get<GetActiveFormsResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/forms`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get form by ID with full details (Admin)
     * GET /vault/api/admin/onboarding/forms/:formId
     *
     * @param formId Form ID
     * @param accessToken Access token (required for admin endpoints)
     * @returns Form with stages and steps
     *
     * @example
     * ```typescript
     * const form = await sdk.onboarding.getFormByIdAdmin(1, accessToken);
     * ```
     */
    async getFormByIdAdmin(
        formId: number,
        accessToken: string,
    ): Promise<GetFormByIdResponse> {
        const response = await this.httpClient.get<GetFormByIdResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/forms/${formId}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Create a new onboarding form (Admin)
     * POST /vault/api/admin/onboarding/forms
     *
     * @param data Form data
     * @param accessToken Access token (required for admin endpoints)
     * @returns Created form
     *
     * @example
     * ```typescript
     * const form = await sdk.onboarding.createForm({
     *   name: 'Curator Onboarding Form',
     *   description: 'Initial onboarding form',
     *   version: '1.0.0'
     * }, accessToken);
     * ```
     */
    async createForm(
        data: CreateFormRequest,
        accessToken: string,
    ): Promise<CreateFormResponse> {
        const response = await this.httpClient.post<CreateFormResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/forms`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Create a new stage (Admin)
     * POST /vault/api/admin/onboarding/forms/:formId/stages
     *
     * @param formId Form ID
     * @param data Stage data
     * @param accessToken Access token (required for admin endpoints)
     * @returns Created stage
     *
     * @example
     * ```typescript
     * const stage = await sdk.onboarding.createStage(1, {
     *   name: 'Personal Information',
     *   stageOrder: 1,
     *   isRequired: true
     * }, accessToken);
     * ```
     */
    async createStage(
        formId: number,
        data: CreateStageRequest,
        accessToken: string,
    ): Promise<CreateStageResponse> {
        const response = await this.httpClient.post<CreateStageResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/forms/${formId}/stages`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Create a new step (Admin)
     * POST /vault/api/admin/onboarding/stages/:stageId/steps
     *
     * @param stageId Stage ID
     * @param data Step data
     * @param accessToken Access token (required for admin endpoints)
     * @returns Created step
     *
     * @example
     * ```typescript
     * const step = await sdk.onboarding.createStep(1, {
     *   name: 'Contact Details',
     *   stepOrder: 1,
     *   formFields: { fields: [...] },
     *   approvalRequired: false
     * }, accessToken);
     * ```
     */
    async createStep(
        stageId: number,
        data: CreateStepRequest,
        accessToken: string,
    ): Promise<CreateStepResponse> {
        const response = await this.httpClient.post<CreateStepResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/stages/${stageId}/steps`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Approve or reject a step response (Admin)
     * POST /vault/api/admin/onboarding/instances/:instanceId/steps/:stepId/approve
     *
     * @param instanceId Instance ID
     * @param stepId Step ID
     * @param data Approval data
     * @param accessToken Access token (required for admin endpoints)
     * @returns Approval result
     *
     * @example
     * ```typescript
     * const result = await sdk.onboarding.approveStepResponse(1, 1, {
     *   approved: true,
     *   comments: 'Looks good'
     * }, accessToken);
     * ```
     */
    async approveStepResponse(
        instanceId: number,
        stepId: number,
        data: ApproveStepResponseRequest,
        accessToken: string,
    ): Promise<ApproveStepResponseResponse> {
        const response = await this.httpClient.post<ApproveStepResponseResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/instances/${instanceId}/steps/${stepId}/approve`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get approval history for an instance (Admin)
     * GET /vault/api/admin/onboarding/instances/:instanceId/approvals
     *
     * @param instanceId Instance ID
     * @param accessToken Access token (required for admin endpoints)
     * @returns List of approvals
     *
     * @example
     * ```typescript
     * const approvals = await sdk.onboarding.getApprovalsByInstance(1, accessToken);
     * ```
     */
    async getApprovalsByInstance(
        instanceId: number,
        accessToken: string,
    ): Promise<GetApprovalsByInstanceResponse> {
        const response = await this.httpClient.get<GetApprovalsByInstanceResponse>(
            `/${this.servicePrefix}/api/admin/onboarding/instances/${instanceId}/approvals`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    // ==================== CURATOR ENDPOINTS ====================

    /**
     * Get all instances for a curator with optional status filter
     * GET /vault/api/onboarding/curators/:curatorKey/instances
     *
     * @param curatorKey Curator key
     * @param accessToken Access token (required)
     * @param status Optional status filter (single value or array: 'draft', 'in_progress', 'submitted', 'approved', 'rejected')
     * @returns List of instances for the curator
     *
     * @example
     * ```typescript
     * // Get all instances
     * const allInstances = await sdk.onboarding.getInstancesByCurator('curator-1', accessToken);
     * 
     * // Get only draft instances
     * const draftInstances = await sdk.onboarding.getInstancesByCurator('curator-1', accessToken, 'draft');
     * 
     * // Get draft and in_progress instances
     * const activeInstances = await sdk.onboarding.getInstancesByCurator('curator-1', accessToken, ['draft', 'in_progress']);
     * ```
     */
    async getInstancesByCurator(
        curatorKey: string,
        accessToken: string,
        status?: string | string[],
    ): Promise<GetInstancesByCuratorResponse> {
        const params = new URLSearchParams();
        if (status) {
            if (Array.isArray(status)) {
                params.set('status', status.join(','));
            } else {
                params.set('status', status);
            }
        }

        const queryString = params.toString();
        const url = `/${this.servicePrefix}/api/onboarding/curators/${curatorKey}/instances${queryString ? `?${queryString}` : ''}`;

        const response = await this.httpClient.get<GetInstancesByCuratorResponse>(
            url,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get curator instance metrics/statistics
     * GET /vault/api/onboarding/curators/:curatorKey/metrics
     *
     * @param curatorKey Curator key
     * @param accessToken Access token (required)
     * @returns Metrics including counts by status
     *
     * @example
     * ```typescript
     * const metrics = await sdk.onboarding.getCuratorMetrics('curator-1', accessToken);
     * // Returns: { total: 10, draft: 3, inProgress: 2, submitted: 3, approved: 1, rejected: 1 }
     * ```
     */
    async getCuratorMetrics(
        curatorKey: string,
        accessToken: string,
    ): Promise<GetCuratorMetricsResponse> {
        const response = await this.httpClient.get<GetCuratorMetricsResponse>(
            `/${this.servicePrefix}/api/onboarding/curators/${curatorKey}/metrics`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get instance with full details
     * GET /vault/api/onboarding/instances/:instanceId
     *
     * @param instanceId Instance ID
     * @param accessToken Access token (required)
     * @returns Instance with form, stages, steps, responses, and approvals
     *
     * @example
     * ```typescript
     * const instance = await sdk.onboarding.getInstanceById(1, accessToken);
     * ```
     */
    async getInstanceById(
        instanceId: number,
        accessToken: string,
    ): Promise<GetInstanceByIdResponse> {
        const response = await this.httpClient.get<GetInstanceByIdResponse>(
            `/${this.servicePrefix}/api/onboarding/instances/${instanceId}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Start a new onboarding instance
     * POST /vault/api/onboarding/curators/:curatorKey/instances
     *
     * @param curatorKey Curator key
     * @param data Instance data
     * @param accessToken Access token (required)
     * @returns Created instance
     *
     * @example
     * ```typescript
     * const instance = await sdk.onboarding.createInstance('curator-1', {
     *   formId: 1
     * }, accessToken);
     * ```
     */
    async createInstance(
        curatorKey: string,
        data: CreateInstanceRequest,
        accessToken: string,
    ): Promise<CreateInstanceResponse> {
        const response = await this.httpClient.post<CreateInstanceResponse>(
            `/${this.servicePrefix}/api/onboarding/curators/${curatorKey}/instances`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Update instance progress
     * PATCH /vault/api/onboarding/instances/:instanceId
     *
     * @param instanceId Instance ID
     * @param data Update data
     * @param accessToken Access token (required)
     * @returns Updated instance
     *
     * @example
     * ```typescript
     * const instance = await sdk.onboarding.updateInstance(1, {
     *   status: 'in_progress',
     *   currentStageId: 1,
     *   currentStepId: 1
     * }, accessToken);
     * ```
     */
    async updateInstance(
        instanceId: number,
        data: UpdateInstanceRequest,
        accessToken: string,
    ): Promise<UpdateInstanceResponse> {
        const response = await this.httpClient.patch<UpdateInstanceResponse>(
            `/${this.servicePrefix}/api/onboarding/instances/${instanceId}`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Save step response (draft)
     * PUT /vault/api/onboarding/instances/:instanceId/steps/:stepId/response
     *
     * @param instanceId Instance ID
     * @param stepId Step ID
     * @param data Response data
     * @param accessToken Access token (required)
     * @returns Saved response
     *
     * @example
     * ```typescript
     * const response = await sdk.onboarding.saveStepResponse(1, 1, {
     *   responseData: { name: 'John Doe', email: 'john@example.com' }
     * }, accessToken);
     * ```
     */
    async saveStepResponse(
        instanceId: number,
        stepId: number,
        data: SaveStepResponseRequest,
        accessToken: string,
    ): Promise<SaveStepResponseResponse> {
        const response = await this.httpClient.put<SaveStepResponseResponse>(
            `/${this.servicePrefix}/api/onboarding/instances/${instanceId}/steps/${stepId}/response`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Submit step response
     * POST /vault/api/onboarding/instances/:instanceId/steps/:stepId/submit
     *
     * @param instanceId Instance ID
     * @param stepId Step ID
     * @param accessToken Access token (required)
     * @returns Submission result
     *
     * @example
     * ```typescript
     * const result = await sdk.onboarding.submitStepResponse(1, 1, accessToken);
     * ```
     */
    async submitStepResponse(
        instanceId: number,
        stepId: number,
        accessToken: string,
    ): Promise<SubmitStepResponseResponse> {
        const response = await this.httpClient.post<SubmitStepResponseResponse>(
            `/${this.servicePrefix}/api/onboarding/instances/${instanceId}/steps/${stepId}/submit`,
            {},
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get step response
     * GET /vault/api/onboarding/instances/:instanceId/steps/:stepId/response
     *
     * @param instanceId Instance ID
     * @param stepId Step ID
     * @param accessToken Access token (required)
     * @returns Step response
     *
     * @example
     * ```typescript
     * const response = await sdk.onboarding.getStepResponse(1, 1, accessToken);
     * ```
     */
    async getStepResponse(
        instanceId: number,
        stepId: number,
        accessToken: string,
    ): Promise<GetStepResponseResponse> {
        const response = await this.httpClient.get<GetStepResponseResponse>(
            `/${this.servicePrefix}/api/onboarding/instances/${instanceId}/steps/${stepId}/response`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }
}
