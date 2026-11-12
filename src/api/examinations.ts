import { request } from './client';
import { Examination, EyeType, Prediction } from '../types';

export interface ValidationResponse {
  valid: boolean;
  reason: string;
}

export async function fetchExaminations(limit = 50): Promise<Examination[]> {
  return request<Examination[]>(`/api/examinations?limit=${limit}`);
}

export async function fetchPatientExaminations(patientId: number): Promise<Examination[]> {
  return request<Examination[]>(`/api/patients/${patientId}/examinations`);
}

export async function fetchExamination(id: number): Promise<Examination> {
  return request<Examination>(`/api/examinations/${id}`);
}

export async function validateFundusImage(file: File): Promise<ValidationResponse> {
  const fd = new FormData();
  fd.append('file', file);
  return request<ValidationResponse>('/api/validate-fundus', {
    method: 'POST',
    body: fd,
  });
}

export async function createExamination(
  patientId: number,
  eye: EyeType,
  file: File,
  capturedAt?: string
): Promise<Examination> {
  const fd = new FormData();
  fd.append('patient_id', String(patientId));
  fd.append('eye', eye);
  fd.append('file', file);
  if (capturedAt) {
    fd.append('captured_at', capturedAt);
  }

  return request<Examination>('/api/examinations', {
    method: 'POST',
    body: fd,
  });
}

export async function generateExaminationNarrative(examinationId: number): Promise<Prediction> {
  return request<Prediction>(`/api/examinations/${examinationId}/generate-narrative`, {
    method: 'POST',
  });
}
