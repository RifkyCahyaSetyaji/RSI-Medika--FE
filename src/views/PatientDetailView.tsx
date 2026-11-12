import React, { useState, useEffect } from 'react';
import { Patient, Examination } from '../types';
import { fetchPatient, fetchPatientExaminations } from '../api';
import { GradeBadge } from '../components/GradeBadge';
import { GradeTrendChart } from '../components/GradeTrendChart';
import { TreatmentModal } from '../components/TreatmentModal';
import {
  ArrowLeft,
  PlusCircle,
  Eye,
  Calendar,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  ChevronRight,
  BookOpen,
  Stethoscope,
  Info
} from 'lucide-react';

interface PatientDetailViewProps {
  patientId: number;
  onBack: () => void;
  onNewExam: (patientId: number) => void;
  onSelectExam: (examId: number) => void;
  onNavigateToEducation?: (grade?: number) => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patientId,
  onBack,
  onNewExam,
  onSelectExam,
  onNavigateToEducation,
}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalGrade, setModalGrade] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pt, exams] = await Promise.all([
          fetchPatient(patientId),
          fetchPatientExaminations(patientId),
        ]);
        setPatient(pt);
        setExaminations(exams);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Memuat detail pasien &amp; rekam medis...</span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
        <p className="text-slate-700 font-semibold">Data pasien tidak ditemukan.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
        >
          Kembali ke Daftar Pasien
        </button>
      </div>
    );
  }

  const calculateAge = (birthDateStr: string | null) => {
    if (!birthDateStr) return '-';
    const birth = new Date(birthDateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} tahun (${birth.toLocaleDateString('id-ID', { dateStyle: 'medium' })})`;
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pasien</span>
        </button>

        <div className="flex items-center gap-2">
          {patient.latest_grade !== undefined && patient.latest_grade !== null && (
            <button
              type="button"
              onClick={() => setModalGrade(patient.latest_grade!)}
              className="px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Panduan Penanganan Grade {patient.latest_grade}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNewExam(patient.id)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Pemeriksaan Baru</span>
          </button>
        </div>
      </div>

      {/* Patient Demographic & Clinical Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-2xs font-black text-xl">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {patient.name}
                </h2>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                  {patient.medical_record_no}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Terdaftar di sistem sejak:{' '}
                {new Date(patient.created_at).toLocaleDateString('id-ID', {
                  dateStyle: 'long',
                })}
              </p>
            </div>
          </div>

          {/* Latest Status Pill */}
          {patient.latest_grade !== undefined && patient.latest_grade !== null ? (
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Status Terakhir Retina
              </span>
              <div className="flex items-center gap-2">
                <GradeBadge grade={patient.latest_grade} size="md" showFollowUp />
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Belum ada riwayat screening</span>
          )}
        </div>

        {/* Clinical Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Usia &amp; Tanggal Lahir
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block truncate">
              {calculateAge(patient.birth_date)}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Jenis Kelamin
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">
              {patient.sex === 'L' ? 'Laki-laki (L)' : patient.sex === 'P' ? 'Perempuan (P)' : '-'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tipe Diabetes
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">
              {patient.diabetes_type || 'Diabetes Tipe 2'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Durasi Menderita DM
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">
              {patient.diabetes_duration_years !== null
                ? `${patient.diabetes_duration_years} Tahun`
                : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Visualisasi Tren Grade (Timeline Graph) */}
      <GradeTrendChart examinations={examinations} />

      {/* Table: Riwayat Pemeriksaan */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Riwayat Pemeriksaan Citra Fundus ({examinations.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Tanggal Periksa</th>
                <th className="px-5 py-3.5">Mata</th>
                <th className="px-5 py-3.5">Citra Fundus</th>
                <th className="px-5 py-3.5">Grade AI (ViT)</th>
                <th className="px-5 py-3.5">Rujukan</th>
                <th className="px-5 py-3.5">Status Verifikasi Dokter</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examinations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500 text-sm">
                    Pasien ini belum memiliki riwayat pemeriksaan fundus.
                  </td>
                </tr>
              ) : (
                examinations.map((ex) => {
                  const pred = ex.prediction;
                  return (
                    <tr
                      key={ex.id}
                      onClick={() => onSelectExam(ex.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="px-5 py-4 text-xs font-medium text-slate-800">
                        {new Date(ex.captured_at || ex.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <span className="block text-[11px] text-slate-400">
                          {new Date(ex.captured_at || ex.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {ex.eye === 'OD' ? 'OD (Kanan)' : 'OS (Kiri)'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={ex.image_url}
                            alt="Fundus"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          {ex.heatmap_url && (
                            <img
                              src={ex.heatmap_url}
                              alt="Heatmap"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                            />
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {pred ? (
                          <div className="flex flex-col gap-0.5">
                            <GradeBadge grade={pred.grade} size="sm" />
                            <span className="text-[11px] text-slate-500 font-mono">
                              Keyakinan: {(pred.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {pred?.referral ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Rujuk Sp.M
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Screening Rutin
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs">
                        {pred?.status === 'reviewed' ? (
                          <div className="text-slate-800">
                            <span className="font-semibold text-emerald-700">Dikonfirmasi:</span>{' '}
                            Grade {pred.clinician_grade}
                            {pred.clinician_note && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                                "{pred.clinician_note}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-medium">
                            Menunggu Verifikasi
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectExam(ex.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition inline-flex items-center gap-1"
                        >
                          <span>Buka Analisis</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Treatment Modal */}
      {modalGrade !== null && (
        <TreatmentModal
          grade={modalGrade}
          isOpen={modalGrade !== null}
          onClose={() => setModalGrade(null)}
          onNavigateToEducation={onNavigateToEducation}
          patientName={patient.name}
          medicalRecordNo={patient.medical_record_no}
        />
      )}
    </div>
  );
};
