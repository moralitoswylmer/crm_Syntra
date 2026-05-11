import type {
  ApiValidationErrors,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';

const DEFAULT_API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;
const API_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');

interface ApiErrorPayload {
  message?: string;
  errors?: ApiValidationErrors;
}

export class ApiError extends Error {
  status: number;
  errors: ApiValidationErrors;

  constructor(message: string, status: number, errors: ApiValidationErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function getCookieValue(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie() {
  const response = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    throw new ApiError('No fue posible inicializar la protección CSRF.', response.status);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  const method = init?.method?.toUpperCase() ?? 'GET';

  headers.set('Accept', 'application/json');
  headers.set('X-Requested-With', 'XMLHttpRequest');

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCookieValue('XSRF-TOKEN');

    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = (isJson ? await response.json() : null) as ApiErrorPayload | T | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;

    throw new ApiError(
      errorPayload?.message ?? 'Ocurrió un error inesperado.',
      response.status,
      errorPayload?.errors ?? {},
    );
  }

  return payload as T;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  await ensureCsrfCookie();

  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await ensureCsrfCookie();

  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
  await ensureCsrfCookie();

  return request<MessageResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
  await ensureCsrfCookie();

  return request<MessageResponse>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/me');
}

export async function logout(): Promise<MessageResponse> {
  await ensureCsrfCookie();

  return request<MessageResponse>('/api/auth/logout', {
    method: 'POST',
  });
}
