/**
 * Base HTTP Client for DR CAD-ViT Web Application.
 */

export const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') || endpoint.startsWith('/') ? endpoint : `${API_BASE}/${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    let errorBody: any = null;
    try {
      errorBody = await res.json();
      if (errorBody && errorBody.detail) {
        errorDetail = typeof errorBody.detail === 'string' ? errorBody.detail : JSON.stringify(errorBody.detail);
      }
    } catch {
      // Body not JSON
    }
    throw new ApiError(errorDetail, res.status, errorBody);
  }

  return res.json() as Promise<T>;
}
