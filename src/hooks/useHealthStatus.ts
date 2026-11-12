import { useState, useEffect, useCallback } from 'react';
import { checkHealth, HealthResponse } from '../api';

export interface ModelStatus {
  loaded: boolean;
  version: string | null;
  qwenLoaded?: boolean;
  qwenVersion?: string | null;
}

export function useHealthStatus(pollIntervalMs?: number) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    loaded: false,
    version: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const data: HealthResponse = await checkHealth();
      setModelStatus({
        loaded: data.model_loaded,
        version: data.model_version,
        qwenLoaded: data.qwen_loaded,
        qwenVersion: data.qwen_model_version,
      });
      setError(null);
    } catch (err: any) {
      setModelStatus({ loaded: false, version: null });
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    if (pollIntervalMs && pollIntervalMs > 0) {
      const timer = setInterval(fetchHealth, pollIntervalMs);
      return () => clearInterval(timer);
    }
  }, [fetchHealth, pollIntervalMs]);

  return { modelStatus, loading, error, refreshHealth: fetchHealth };
}
