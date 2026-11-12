import React, { useRef } from 'react';
import {
  X,
  Printer,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Calendar,
  Pill,
  ExternalLink,
  ShieldAlert,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DR_EDUCATION_GRADES, DRGradeDetail } from '../data/educationData';
import { GradeBadge } from './GradeBadge';

interface TreatmentModalProps {
  grade: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEducation?: (grade?: number) => void;
  patientName?: string;
  medicalRecordNo?: string;
}

export const TreatmentModal: React.FC<TreatmentModalProps> = ({
  grade,
  isOpen,
  onClose,
  onNavigateToEducation,
  patientName,
  medicalRecordNo,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const detail: DRGradeDetail =
    DR_EDUCATION_GRADES.find((g) => g.grade === grade) || DR_EDUCATION_GRADES[0];

  const isEmergency = grade >= 4;
  const isUrgent = grade === 3;
  const isReferral = grade >= 2;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div
          className={`p-5 sm:p-6 text-white flex items-start justify-between gap-4 transition-colors ${
            isEmergency
              ? 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800'
              : isUrgent
              ? 'bg-gradient-to-r from-rose-600 to-orange-600'
              : isReferral
              ? 'bg-gradient-to-r from-orange-600 to-amber-600'
              : grade === 1
              ? 'bg-gradient-to-r from-amber-600 to-yellow-600'
              : 'bg-gradient-to-r from-emerald-600 to-teal-700'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md flex-shrink-0">
              {isEmergency ? (
                <AlertOctagon className="w-6 h-6 text-white" />
              ) : isReferral ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-white/20 border border-white/30">
                  Panduan Tatalaksana Klinis
                </span>
                <span className="text-xs font-semibold text-white/80">
                  Standar ICDR &amp; PERDAMI
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-1 leading-tight text-white">
                Grade {detail.grade}: {detail.nameId}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5 font-medium">
                {detail.nameEn}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition flex-shrink-0"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={printRef} className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Patient Context Tag if present */}
          {(patientName || medicalRecordNo) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600 print:text-black">
              <span>
                Pasien: <strong className="text-slate-900">{patientName || '-'}</strong>
              </span>
              <span>
                No. RM: <strong className="font-mono text-slate-900">{medicalRecordNo || '-'}</strong>
              </span>
            </div>
          )}

          {/* Clinical Urgency & Referral Alert */}
          <div
            className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isEmergency
                ? 'bg-red-50 border-red-200 text-red-950'
                : isUrgent
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : isReferral
                ? 'bg-orange-50 border-orange-200 text-orange-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Tingkat Urgensi Rujukan
              </span>
              <p className="text-base font-extrabold text-slate-900">
                {detail.referralCriteria}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  Jadwal Kontrol: {detail.screeningInterval}
                </span>
              </div>
            </div>
          </div>

          {/* Summary & Findings */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Karakteristik &amp; Temuan Citra Fundus
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {detail.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {detail.fundusFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Medical Interventions */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" />
              Protokol Intervensi Medis yang Dianjurkan
            </h4>
            <div className="space-y-2">
              {detail.medicalInterventions.map((intervention, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-blue-950 leading-relaxed font-medium">
                    {intervention}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Advice & Self-care */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Instruksi Edukasi &amp; Peringatan Pasien
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              {detail.patientAdvice.map((advice, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-amber-950 font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Lembar Tatalaksana</span>
            </button>

            {onNavigateToEducation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToEducation(grade);
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 border border-emerald-200"
              >
                <span>Pusat Edukasi Lengkap</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
