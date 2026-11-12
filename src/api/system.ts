import { request } from './client';
import { Stats } from '../types';

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_version: string | null;
  qwen_loaded?: boolean;
  qwen_model_version?: string | null;
  qwen_backend?: string | null;
}

export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health');
}

export async function fetchStats(): Promise<Stats> {
  return request<Stats>('/api/stats');
}
