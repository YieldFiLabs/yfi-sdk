/**
 * Authentication error classes
 */

import { SDKError } from "./sdk-error";

export class AuthenticationError extends SDKError {
  constructor(
    message: string = "Authentication failed",
    details?: Record<string, unknown>,
  ) {
    super(message, "AUTH_ERROR", 401, details);
    this.name = "AuthenticationError";
  }
}

export class UnauthorizedError extends SDKError {
  constructor(
    message: string = "Unauthorized access",
    details?: Record<string, unknown>,
  ) {
    super(message, "UNAUTHORIZED", 403, details);
    this.name = "UnauthorizedError";
  }
}

export class TokenExpiredError extends SDKError {
  constructor(
    message: string = "Token expired",
    details?: Record<string, unknown>,
  ) {
    super(message, "TOKEN_EXPIRED", 401, details);
    this.name = "TokenExpiredError";
  }
}
