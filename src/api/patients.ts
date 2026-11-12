import { request } from './client';
import { Patient, PatientCreate } from '../types';

export async function fetchPatients(query?: string): Promise<Patient[]> {
  const url = query ? `/api/patients?q=${encodeURIComponent(query)}` : '/api/patients';
  return request<Patient[]>(url);
}

export async function fetchPatient(id: number): Promise<Patient> {
  return request<Patient>(`/api/patients/${id}`);
}

export async function createPatient(data: PatientCreate): Promise<Patient> {
  return request<Patient>('/api/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
