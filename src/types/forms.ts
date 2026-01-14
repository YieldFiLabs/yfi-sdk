/**
 * Type definitions for Curator Onboarding API
 */

/**
 * Onboarding Form
 */
export interface OnboardingForm {
    id: number;
    name: string;
    description?: string;
    version: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
}

/**
 * Onboarding Stage
 */
export interface OnboardingStage {
    id: number;
    formId: number;
    name: string;
    description?: string;
    stageOrder: number;
    isRequired: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Onboarding Step
 */
export interface OnboardingStep {
    id: number;
    stageId: number;
    name: string;
    description?: string;
    stepOrder: number;
    formFields: Record<string, unknown>; // JSONB field for UI rendering
    isRequired: boolean;
    approvalRequired: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Step Response
 */
export interface StepResponse {
    id: number;
    instanceId: number;
    stepId: number;
    responseData: Record<string, unknown>; // JSONB field for curator's filled data
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    submittedAt?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Onboarding Instance
 */
export interface OnboardingInstance {
    id: number;
    curatorKey: string;
    formId: number;
    status: 'draft' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
    currentStageId?: number;
    currentStepId?: number;
    submittedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
}

/**
 * Approval Record
 */
export interface Approval {
    id: number;
    instanceId: number;
    stepId?: number;
    approvalType: 'step_approval' | 'stage_approval' | 'form_approval';
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    comments?: string;
    createdAt: string;
}

/**
 * Form with full details (stages and steps)
 */
export interface FormWithDetails {
    form: OnboardingForm;
    stages: Array<OnboardingStage & { steps: OnboardingStep[] }>;
}

/**
 * Instance with full details (form, stages, steps, responses, approvals)
 */
export interface InstanceWithDetails {
    instance: OnboardingInstance;
    form: OnboardingForm;
    stages: Array<
        OnboardingStage & {
            steps: Array<OnboardingStep & { response?: StepResponse }>;
        }
    >;
    approvals: Approval[];
}

// ==================== REQUEST TYPES ====================

/**
 * Create Form Request
 */
export interface CreateFormRequest {
    name: string;
    description?: string;
    version?: string;
}

/**
 * Create Stage Request
 */
export interface CreateStageRequest {
    name: string;
    description?: string;
    stageOrder: number;
    isRequired?: boolean;
}

/**
 * Create Step Request
 */
export interface CreateStepRequest {
    name: string;
    description?: string;
    stepOrder: number;
    formFields: Record<string, unknown>;
    isRequired?: boolean;
    approvalRequired?: boolean;
}

/**
 * Create Instance Request
 */
export interface CreateInstanceRequest {
    formId: number;
}

/**
 * Update Instance Request
 */
export interface UpdateInstanceRequest {
    status?: 'draft' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
    currentStageId?: number;
    currentStepId?: number;
    submittedAt?: string;
    completedAt?: string;
}

/**
 * Save Step Response Request
 */
export interface SaveStepResponseRequest {
    responseData: Record<string, unknown>;
}

/**
 * Approve Step Response Request
 */
export interface ApproveStepResponseRequest {
    approved: boolean;
    rejectionReason?: string;
    comments?: string;
}

// ==================== RESPONSE TYPES ====================

/**
 * Get Active Forms Response
 */
export interface GetActiveFormsResponse {
    success: boolean;
    forms: OnboardingForm[];
}

/**
 * Get Form By ID Response
 */
export interface GetFormByIdResponse {
    success: boolean;
    form: OnboardingForm;
    stages: Array<OnboardingStage & { steps: OnboardingStep[] }>;
}

/**
 * Create Form Response
 */
export interface CreateFormResponse {
    success: boolean;
    form: OnboardingForm;
}

/**
 * Create Stage Response
 */
export interface CreateStageResponse {
    success: boolean;
    stage: OnboardingStage;
}

/**
 * Create Step Response
 */
export interface CreateStepResponse {
    success: boolean;
    step: OnboardingStep;
}

/**
 * Get Instances By Curator Response
 */
export interface GetInstancesByCuratorResponse {
    success: boolean;
    curatorKey: string;
    filter?: { status: string | string[] } | null;
    count: number;
    instances: OnboardingInstance[];
}

/**
 * Curator Instance Metrics
 */
export interface CuratorMetrics {
    total: number;
    draft: number;
    inProgress: number;
    submitted: number;
    approved: number;
    rejected: number;
}

/**
 * Get Curator Metrics Response
 */
export interface GetCuratorMetricsResponse {
    success: boolean;
    curatorKey: string;
    metrics: CuratorMetrics;
}

/**
 * Get Instance By ID Response
 */
export interface GetInstanceByIdResponse {
    success: boolean;
    instance: OnboardingInstance;
    form: OnboardingForm;
    stages: Array<
        OnboardingStage & {
            steps: Array<OnboardingStep & { response?: StepResponse }>;
        }
    >;
    approvals: Approval[];
}

/**
 * Create Instance Response
 */
export interface CreateInstanceResponse {
    success: boolean;
    instance: OnboardingInstance;
}

/**
 * Update Instance Response
 */
export interface UpdateInstanceResponse {
    success: boolean;
    instance: OnboardingInstance;
}

/**
 * Save Step Response Response
 */
export interface SaveStepResponseResponse {
    success: boolean;
    response: StepResponse;
}

/**
 * Submit Step Response Response
 */
export interface SubmitStepResponseResponse {
    success: boolean;
    message: string;
    response: StepResponse;
}

/**
 * Get Step Response Response
 */
export interface GetStepResponseResponse {
    success: boolean;
    response: StepResponse;
}

/**
 * Approve Step Response Response
 */
export interface ApproveStepResponseResponse {
    success: boolean;
    message: string;
    response: StepResponse;
}

/**
 * Get Approvals By Instance Response
 */
export interface GetApprovalsByInstanceResponse {
    success: boolean;
    approvals: Approval[];
}
