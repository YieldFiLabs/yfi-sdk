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
    GetInstancesByVaultResponse,
    GetInstancesResponse,
    GetVaultMetricsResponse,
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
    ApproveFormInstanceRequest,
    ApproveFormInstanceResponse,
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
     * All form endpoints require authentication
     */
    private getAuthHeaders(accessToken: string): Record<string, string> {
        if (!accessToken) {
            throw new Error('Access token is required for form API calls');
        }
        return {
            Authorization: `Bearer ${accessToken}`,
        };
    }

    // ==================== CURATOR ENDPOINTS (AUTHENTICATED) ====================

    /**
     * Get all active forms (requires authentication)
     * GET /vault/api/forms/forms
     *
     * @param accessToken Access token (required)
     * @returns List of active forms
     *
     * @example
     * ```typescript
     * const forms = await sdk.forms.getActiveForms(accessToken);
     * ```
     */
    async getActiveForms(accessToken: string): Promise<GetActiveFormsResponse> {
        const response = await this.httpClient.get<GetActiveFormsResponse>(
            `/${this.servicePrefix}/api/forms/forms`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get form by ID with full details (requires authentication)
     * GET /vault/api/forms/forms/:formId
     *
     * @param formId Form ID
     * @param accessToken Access token (required)
     * @returns Form with stages and steps
     *
     * @example
     * ```typescript
     * const form = await sdk.forms.getFormById(1, accessToken);
     * ```
     */
    async getFormById(
        formId: number,
        accessToken: string,
    ): Promise<GetFormByIdResponse> {
        const response = await this.httpClient.get<GetFormByIdResponse>(
            `/${this.servicePrefix}/api/forms/forms/${formId}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all active forms (Admin)
     * GET /vault/api/admin/forms/forms
     *
     * @param accessToken Access token (required for admin endpoints)
     * @returns List of active forms
     *
     * @example
     * ```typescript
     * const forms = await sdk.forms.getActiveFormsAdmin(accessToken);
     * ```
     */
    async getActiveFormsAdmin(accessToken: string): Promise<GetActiveFormsResponse> {
        const response = await this.httpClient.get<GetActiveFormsResponse>(
            `/${this.servicePrefix}/api/admin/forms/forms`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get form by ID with full details (Admin)
     * GET /vault/api/admin/forms/forms/:formId
     *
     * @param formId Form ID
     * @param accessToken Access token (required for admin endpoints)
     * @returns Form with stages and steps
     *
     * @example
     * ```typescript
     * const form = await sdk.forms.getFormByIdAdmin(1, accessToken);
     * ```
     */
    async getFormByIdAdmin(
        formId: number,
        accessToken: string,
    ): Promise<GetFormByIdResponse> {
        const response = await this.httpClient.get<GetFormByIdResponse>(
            `/${this.servicePrefix}/api/admin/forms/forms/${formId}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Create a new form (Admin)
     * POST /vault/api/admin/forms/forms
     *
     * @param data Form data
     * @param accessToken Access token (required for admin endpoints)
     * @returns Created form
     *
     * @example
     * ```typescript
     * const form = await sdk.forms.createForm({
     *   name: 'Vault Request Form',
     *   description: 'Form for vault requests',
     *   version: '1.0.0'
     * }, accessToken);
     * ```
     */
    async createForm(
        data: CreateFormRequest,
        accessToken: string,
    ): Promise<CreateFormResponse> {
        const response = await this.httpClient.post<CreateFormResponse>(
            `/${this.servicePrefix}/api/admin/forms/forms`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Create a new stage (Admin)
     * POST /vault/api/admin/forms/forms/:formId/stages
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
            `/${this.servicePrefix}/api/admin/forms/forms/${formId}/stages`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Create a new step (Admin)
     * POST /vault/api/admin/forms/stages/:stageId/steps
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
            `/${this.servicePrefix}/api/admin/forms/stages/${stageId}/steps`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Approve or reject a step response (Admin)
     * POST /vault/api/admin/forms/instances/:instanceId/steps/:stepId/approve
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
            `/${this.servicePrefix}/api/admin/forms/instances/${instanceId}/steps/${stepId}/approve`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get all instances with optional filters (Admin)
     * GET /vault/api/admin/forms/instances?vaultKey=&status=
     *
     * @param accessToken Access token (required for admin endpoints)
     * @param options Optional filters: vaultKey, status (single or array)
     * @returns List of instances
     *
     * @example
     * ```typescript
     * // All instances
     * const all = await sdk.forms.getInstances(accessToken);
     * // Instances for a specific vault
     * const vaultInstances = await sdk.forms.getInstances(accessToken, { vaultKey: 'ydemo' });
     * // Filter by status
     * const submitted = await sdk.forms.getInstances(accessToken, { status: 'submitted' });
     * ```
     */
    async getInstances(
        accessToken: string,
        options?: { vaultKey?: string; status?: string | string[] },
    ): Promise<GetInstancesResponse> {
        const params = new URLSearchParams();
        if (options?.vaultKey) params.set('vaultKey', options.vaultKey);
        if (options?.status) {
            params.set('status', Array.isArray(options.status) ? options.status.join(',') : options.status);
        }
        const queryString = params.toString();
        const url = `/${this.servicePrefix}/api/admin/forms/instances${queryString ? `?${queryString}` : ''}`;
        const response = await this.httpClient.get<GetInstancesResponse>(url, {
            headers: this.getAuthHeaders(accessToken),
        });
        return response;
    }

    /**
     * Approve or reject entire form instance (Admin)
     * POST /vault/api/admin/forms/instances/:instanceId/approve
     *
     * @param instanceId Instance ID
     * @param data Approval data
     * @param accessToken Access token (required for admin endpoints)
     * @returns Approval result
     *
     * @example
     * ```typescript
     * const result = await sdk.forms.approveFormInstance(1, {
     *   approved: true,
     *   comments: 'All steps reviewed'
     * }, accessToken);
     * ```
     */
    async approveFormInstance(
        instanceId: number,
        data: ApproveFormInstanceRequest,
        accessToken: string,
    ): Promise<ApproveFormInstanceResponse> {
        const response = await this.httpClient.post<ApproveFormInstanceResponse>(
            `/${this.servicePrefix}/api/admin/forms/instances/${instanceId}/approve`,
            data,
            { headers: this.getAuthHeaders(accessToken) },
        );
        return response;
    }

    /**
     * Get approval history for an instance (Admin)
     * GET /vault/api/admin/forms/instances/:instanceId/approvals
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
            `/${this.servicePrefix}/api/admin/forms/instances/${instanceId}/approvals`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    // ==================== CURATOR ENDPOINTS ====================

    /**
     * Get all instances for a vault with optional status filter
     * GET /vault/api/forms/vaults/:vaultKey/instances
     *
     * @param vaultKey Vault key
     * @param accessToken Access token (required)
     * @param status Optional status filter (single value or array: 'draft', 'in_progress', 'submitted', 'approved', 'rejected')
     * @returns List of instances for the vault
     *
     * @example
     * ```typescript
     * // Get all instances
     * const allInstances = await sdk.forms.getInstancesByVault('ydemo', accessToken);
     *
     * // Get only draft instances
     * const draftInstances = await sdk.forms.getInstancesByVault('ydemo', accessToken, 'draft');
     *
     * // Get draft and in_progress instances
     * const activeInstances = await sdk.forms.getInstancesByVault('ydemo', accessToken, ['draft', 'in_progress']);
     * ```
     */
    async getInstancesByVault(
        vaultKey: string,
        accessToken: string,
        status?: string | string[],
    ): Promise<GetInstancesByVaultResponse> {
        const params = new URLSearchParams();
        if (status) {
            params.set('status', Array.isArray(status) ? status.join(',') : status);
        }
        const queryString = params.toString();
        const url = `/${this.servicePrefix}/api/forms/vaults/${vaultKey}/instances${queryString ? `?${queryString}` : ''}`;
        const response = await this.httpClient.get<GetInstancesByVaultResponse>(url, {
            headers: this.getAuthHeaders(accessToken),
        });
        return response;
    }

    /**
     * Get vault instance metrics/statistics
     * GET /vault/api/forms/vaults/:vaultKey/metrics
     *
     * @param vaultKey Vault key
     * @param accessToken Access token (required)
     * @returns Metrics including counts by status
     *
     * @example
     * ```typescript
     * const metrics = await sdk.forms.getVaultMetrics('ydemo', accessToken);
     * // Returns: { total: 10, draft: 3, inProgress: 2, submitted: 3, approved: 1, rejected: 1 }
     * ```
     */
    async getVaultMetrics(
        vaultKey: string,
        accessToken: string,
    ): Promise<GetVaultMetricsResponse> {
        const response = await this.httpClient.get<GetVaultMetricsResponse>(
            `/${this.servicePrefix}/api/forms/vaults/${vaultKey}/metrics`,
            { headers: this.getAuthHeaders(accessToken) },
        );
        return response;
    }

    /**
     * Get instance with full details
     * GET /vault/api/forms/instances/:instanceId
     *
     * @param instanceId Instance ID
     * @param accessToken Access token (required)
     * @returns Instance with form, stages, steps, responses, and approvals
     *
     * @example
     * ```typescript
     * const instance = await sdk.forms.getInstanceById(1, accessToken);
     * ```
     */
    async getInstanceById(
        instanceId: number,
        accessToken: string,
    ): Promise<GetInstanceByIdResponse> {
        const response = await this.httpClient.get<GetInstanceByIdResponse>(
            `/${this.servicePrefix}/api/forms/instances/${instanceId}`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Start a new form instance for a vault
     * POST /vault/api/forms/vaults/:vaultKey/instances
     *
     * @param vaultKey Vault key
     * @param data Instance data
     * @param accessToken Access token (required)
     * @returns Created instance
     *
     * @example
     * ```typescript
     * const instance = await sdk.forms.createInstance('ydemo', {
     *   formId: 1
     * }, accessToken);
     * ```
     */
    async createInstance(
        vaultKey: string,
        data: CreateInstanceRequest,
        accessToken: string,
    ): Promise<CreateInstanceResponse> {
        const response = await this.httpClient.post<CreateInstanceResponse>(
            `/${this.servicePrefix}/api/forms/vaults/${vaultKey}/instances`,
            data,
            { headers: this.getAuthHeaders(accessToken) },
        );
        return response;
    }

    /**
     * Update instance progress
     * PATCH /vault/api/forms/instances/:instanceId
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
            `/${this.servicePrefix}/api/forms/instances/${instanceId}`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Save step response (draft)
     * PUT /vault/api/forms/instances/:instanceId/steps/:stepId/response
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
            `/${this.servicePrefix}/api/forms/instances/${instanceId}/steps/${stepId}/response`,
            data,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Submit step response
     * POST /vault/api/forms/instances/:instanceId/steps/:stepId/submit
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
            `/${this.servicePrefix}/api/forms/instances/${instanceId}/steps/${stepId}/submit`,
            {},
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }

    /**
     * Get step response
     * GET /vault/api/forms/instances/:instanceId/steps/:stepId/response
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
            `/${this.servicePrefix}/api/forms/instances/${instanceId}/steps/${stepId}/response`,
            {
                headers: this.getAuthHeaders(accessToken),
            },
        );
        return response;
    }
}
