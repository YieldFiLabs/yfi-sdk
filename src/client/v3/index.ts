/**
 * V3 API namespace
 */

import { VaultAPI } from "../../api/vault";
import { FormAPI } from "../../api/forms";
import { CuratorHandoffAPI } from "../../api/curator-handoff";

/**
 * V3 API namespace
 * Contains all APIs available in version 3
 */
export class V3API {
  /**
   * Vault API
   */
  public readonly vault: VaultAPI;

  /**
   * Onboarding API
   * Handles curator onboarding forms, stages, steps, instances, responses, and approvals
   */
  public readonly onboarding: FormAPI;
  public readonly forms: FormAPI; // Alias for better semantics

  /**
   * Curator Handoff API
   * Handles curator address transfers and handoff operations
   */
  public readonly curatorHandoff: CuratorHandoffAPI;

  constructor(
    vaultAPI: VaultAPI,
    onboardingAPI: FormAPI,
    curatorHandoffAPI: CuratorHandoffAPI,
  ) {
    this.vault = vaultAPI;
    this.onboarding = onboardingAPI; // Keeping for backward compatibility
    this.forms = onboardingAPI; // New semantic name
    this.curatorHandoff = curatorHandoffAPI;
  }
}

