/**
 * Validation error classes
 */

import { SDKError } from "./sdk-error";

export class ValidationError extends SDKError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class ConfigurationError extends SDKError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "CONFIGURATION_ERROR", undefined, details);
    this.name = "ConfigurationError";
  }
}
