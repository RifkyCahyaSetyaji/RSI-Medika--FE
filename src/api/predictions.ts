import { request } from './client';
import { Prediction } from '../types';

export async function reviewPrediction(
  predictionId: number,
  clinicianGrade: number,
  clinicianNote?: string
): Promise<Prediction> {
  return request<Prediction>(`/api/predictions/${predictionId}/review`, {
    method: 'PATCH',
    body: JSON.stringify({
      clinician_grade: clinicianGrade,
      clinician_note: clinicianNote || null,
    }),
  });
}
