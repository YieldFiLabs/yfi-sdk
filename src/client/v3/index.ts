/**
 * V3 API namespace
 */

import { VaultAPI } from "../../api/vault";

/**
 * V3 API namespace
 * Contains all APIs available in version 3
 */
export class V3API {
  /**
   * Vault API
   */
  public readonly vault: VaultAPI;

  constructor(vaultAPI: VaultAPI) {
    this.vault = vaultAPI;
  }
}

