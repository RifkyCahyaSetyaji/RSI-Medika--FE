export type EyeType = 'OD' | 'OS'; // OD: Mata Kanan, OS: Mata Kiri

export interface Patient {
  id: number;
  medical_record_no: string;
  name: string;
  birth_date: string | null;
  sex: 'L' | 'P' | null;
  diabetes_type: string | null;
  diabetes_duration_years: number | null;
  created_at: string;
  examinations_count?: number;
  latest_grade?: number | null;
  latest_referral?: boolean | null;
}

export interface PatientCreate {
  medical_record_no: string;
  name: string;
  birth_date?: string | null;
  sex?: 'L' | 'P' | null;
  diabetes_type?: string | null;
  diabetes_duration_years?: number | null;
}

export interface Prediction {
  id: number;
  grade: number;
  label: string;
  confidence: number;
  probabilities: number[];
  referral: boolean;
  status: 'pending' | 'reviewed';
  model_version: string;
  clinician_grade: number | null;
  clinician_note: string | null;
  reviewed_at: string | null;
}

export interface Examination {
  id: number;
  patient_id: number;
  eye: EyeType;
  image_url: string;
  heatmap_url: string | null;
  captured_at: string;
  created_at: string;
  prediction: Prediction | null;
}

export interface Stats {
  total_patients: number;
  total_examinations: number;
  referral_count: number;
  pending_reviews: number;
  grade_distribution: Record<string, number>;
}

export interface DRGradeInfo {
  grade: number;
  labelId: string;
  labelEn: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  followUp: string;
  isReferable: boolean;
  urgency: 'routine' | 'monitoring' | 'referral' | 'urgent' | 'emergency';
}

export const DR_GRADES: Record<number, DRGradeInfo> = {
  0: {
    grade: 0,
    labelId: 'Tidak Ada RD',
    labelEn: 'No DR',
    colorBg: 'bg-emerald-500',
    colorBorder: 'border-emerald-500',
    colorText: 'text-emerald-700',
    followUp: 'Screening ulang 12 bulan',
    isReferable: false,
    urgency: 'routine'
  },
  1: {
    grade: 1,
    labelId: 'Ringan (Mild NPDR)',
    labelEn: 'Mild NPDR',
    colorBg: 'bg-amber-500',
    colorBorder: 'border-amber-500',
    colorText: 'text-amber-700',
    followUp: 'Screening ulang 6–12 bulan',
    isReferable: false,
    urgency: 'monitoring'
  },
  2: {
    grade: 2,
    labelId: 'Sedang (Moderate NPDR)',
    labelEn: 'Moderate NPDR',
    colorBg: 'bg-orange-500',
    colorBorder: 'border-orange-500',
    colorText: 'text-orange-700',
    followUp: 'Rujuk ke dokter spesialis mata',
    isReferable: true,
    urgency: 'referral'
  },
  3: {
    grade: 3,
    labelId: 'Berat (Severe NPDR)',
    labelEn: 'Severe NPDR',
    colorBg: 'bg-red-500',
    colorBorder: 'border-red-500',
    colorText: 'text-red-700',
    followUp: 'Rujuk SEGERA ke spesialis retina',
    isReferable: true,
    urgency: 'urgent'
  },
  4: {
    grade: 4,
    labelId: 'Proliferatif (PDR)',
    labelEn: 'Proliferative DR',
    colorBg: 'bg-rose-700',
    colorBorder: 'border-rose-700',
    colorText: 'text-rose-800',
    followUp: 'Rujuk SEGERA / DARURAT (risiko kebutaan)',
    isReferable: true,
    urgency: 'emergency'
  }
};

export const CLINICAL_DISCLAIMER =
  'Hasil AI adalah alat bantu keputusan klinis (Computer-Aided Diagnosis / CAD), bukan diagnosis final. Seluruh keputusan medis dan penatalaksanaan pasien tetap menjadi wewenang dan tanggung jawab dokter spesialis mata.';
