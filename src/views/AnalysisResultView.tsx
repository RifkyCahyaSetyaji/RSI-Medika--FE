import React, { useState, useEffect } from 'react';
import { Examination, Prediction, Patient } from '../types';
import { fetchExamination, fetchPatient } from '../api';
import { HeatmapViewer } from '../components/HeatmapViewer';
import { GradeBadge } from '../components/GradeBadge';
import { ReferralBanner } from '../components/ReferralBanner';
import { ProbabilityBars } from '../components/ProbabilityBars';
import { DoctorReviewCard } from '../components/DoctorReviewCard';
import { TreatmentModal } from '../components/TreatmentModal';
import { DR_EDUCATION_GRADES } from '../data/educationData';
import {
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  FileCheck,
  Stethoscope,
  BookOpen,
  ArrowRight,
  Pill
} from 'lucide-react';

interface AnalysisResultViewProps {
  examinationId: number;
  onBack: () => void;
  currentUserRole?: string;
  onNavigateToEducation?: (grade?: number) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  examinationId,
  onBack,
  currentUserRole,
  onNavigateToEducation,
}) => {
  const [exam, setExam] = useState<Examination | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [treatmentModalOpen, setTreatmentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const e = await fetchExamination(examinationId);
        setExam(e);
        const p = await fetchPatient(e.patient_id);
        setPatient(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examinationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Memuat hasil analisis CAD-ViT...</span>
        </div>
      </div>
    );
  }

  if (!exam || !exam.prediction) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
        <p className="text-slate-700 font-semibold">Hasil pemeriksaan tidak ditemukan.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  const pred = exam.prediction;
  const gradeDetail =
    DR_EDUCATION_GRADES.find((g) => g.grade === pred.grade) || DR_EDUCATION_GRADES[0];

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Pasien</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setTreatmentModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition flex items-center gap-2 border border-emerald-200 shadow-2xs"
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Panduan Tatalaksana Medis</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Lembar Screening</span>
          </button>
        </div>
      </div>

      {/* Patient & Exam Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm">
              {exam.eye}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {patient?.name || 'Pasien'}
                </h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border">
                  {patient?.medical_record_no}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {exam.eye === 'OD' ? 'Mata Kanan (OD)' : 'Mata Kiri (OS)'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Tanggal:{' '}
                  {new Date(exam.captured_at || exam.created_at).toLocaleDateString('id-ID', {
                    dateStyle: 'long',
                  })}
                </span>
                <span>·</span>
                <span className="font-medium">{patient?.diabetes_type || 'DM Tipe 2'}</span>
                {patient?.diabetes_duration_years !== null && (
                  <>
                    <span>·</span>
                    <span className="font-medium">Durasi DM: {patient?.diabetes_duration_years} Tahun</span>
                  </>
                )}
                <span>·</span>
                <span className="font-mono text-[11px] text-slate-400">
                  Model: {pred.model_version}
                </span>
              </div>
            </div>
          </div>

          {/* Large AI Grade Summary Pill */}
          <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Klasifikasi CAD-ViT
            </span>
            <div className="flex items-center gap-3">
              <GradeBadge grade={pred.grade} size="lg" />
              <div className="text-right">
                <span className="block text-sm font-black text-slate-900 font-mono">
                  {(pred.confidence * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500">Tingkat Keyakinan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Recommendation Banner (ICDR Guidelines) */}
      <ReferralBanner
        grade={pred.grade}
        referral={pred.referral}
        onViewGuidance={() => setTreatmentModalOpen(true)}
      />

      {/* Quick Clinical Guidance & Education Callout Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Protokol Klinis Grade {pred.grade}
            </span>
            <span className="text-xs text-slate-300">
              {gradeDetail.referralCriteria}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-white">
            Tatalaksana Utama: {gradeDetail.primaryTreatment}
          </h4>
          <p className="text-xs text-slate-300 line-clamp-2">
            {gradeDetail.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTreatmentModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Protokol Medis</span>
          </button>

          {onNavigateToEducation && (
            <button
              type="button"
              onClick={() => onNavigateToEducation(pred.grade)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600/50 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 border border-emerald-400/30"
            >
              <BookOpen className="w-4 h-4" />
              <span>Pusat Edukasi</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Heatmap Viewer & Probability/Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Heatmap Canvas with Transparency Slider (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <HeatmapViewer
            imageUrl={exam.image_url}
            heatmapUrl={exam.heatmap_url}
            eye={exam.eye}
            patientName={patient?.name}
          />
        </div>

        {/* Right: AI Insights, Probability Distribution, and Doctor Review Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Probability Distribution */}
          <ProbabilityBars
            probabilities={pred.probabilities}
            predictedGrade={pred.grade}
          />

          {/* Clinician Review Panel */}
          <DoctorReviewCard
            prediction={pred}
            currentUserRole={currentUserRole}
            onReviewUpdated={(updated) => {
              setExam({ ...exam, prediction: updated });
            }}
          />
        </div>
      </div>

      {/* Footer Clinical Audit Info */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          ID Pemeriksaan: <strong className="font-mono text-slate-800">EXAM-{exam.id}</strong> · Prediksi ID:{' '}
          <strong className="font-mono text-slate-800">PRED-{pred.id}</strong>
        </span>
        <span className="text-slate-400 text-center sm:text-right">
          Sistem Informasi Deteksi Retinopati Diabetik CAD-ViT · Sesuai UU PDP No. 27/2022
        </span>
      </div>

      {/* Treatment Modal */}
      <TreatmentModal
        grade={pred.grade}
        isOpen={treatmentModalOpen}
        onClose={() => setTreatmentModalOpen(false)}
        onNavigateToEducation={onNavigateToEducation}
        patientName={patient?.name}
        medicalRecordNo={patient?.medical_record_no}
      />
    </div>
  );
};
