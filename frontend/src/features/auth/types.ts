export interface TenantSummary {
  id: number;
  name: string;
  plan: string | null;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string | null;
  tenant: TenantSummary | null;
  roles: string[];
}

export interface AuthResponse {
  message: string;
  user: AuthenticatedUser;
}

export interface MessageResponse {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  tenant_name: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type ApiValidationErrors = Record<string, string[]>;
