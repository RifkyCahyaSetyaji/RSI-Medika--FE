import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, Calendar, ArrowRight, BookOpen, Stethoscope } from 'lucide-react';
import { DR_GRADES } from '../types';

interface ReferralBannerProps {
  grade: number;
  referral: boolean;
  onViewGuidance?: () => void;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({ grade, referral, onViewGuidance }) => {
  const info = DR_GRADES[grade] || DR_GRADES[0];

  if (referral || grade >= 2) {
    const isEmergency = grade >= 4;
    const isUrgent = grade === 3;

    return (
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all ${
          isEmergency
            ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-100 border-red-300 text-red-950 ring-1 ring-red-500/10'
            : isUrgent
            ? 'bg-gradient-to-r from-rose-50 via-orange-50 to-orange-100 border-rose-300 text-rose-950 ring-1 ring-rose-500/10'
            : 'bg-gradient-to-r from-orange-50 via-amber-50 to-amber-100 border-orange-300 text-orange-950 ring-1 ring-orange-500/10'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 shadow-sm ${
              isEmergency
                ? 'bg-red-600 text-white'
                : isUrgent
                ? 'bg-rose-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            {isEmergency ? (
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-current">
                {isEmergency
                  ? 'RUJUKAN DARURAT (< 24-48 JAM)'
                  : isUrgent
                  ? 'RUJUKAN SEGERA (1-2 MINGGU)'
                  : 'STATUS: PERLU RUJUKAN (REFERABLE DR)'}
              </span>
              <span className="text-xs text-slate-500 font-mono">ICDR Grade {grade}</span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold mt-1 text-slate-900 leading-tight">
              {info.followUp}
            </h4>
            <p className="text-xs sm:text-sm mt-1 text-slate-700 max-w-2xl leading-relaxed">
              Grade {grade} ({info.labelEn}) terdeteksi pada citra retina. Pasien membutuhkan pemeriksaan penunjang lanjutan (OCT / FFA) serta tatalaksana spesifik (PRP Laser / Anti-VEGF) oleh Dokter Spesialis Mata (Sp.M) untuk mencegah hilangnya penglihatan.
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 self-start md:self-center">
          {onViewGuidance ? (
            <button
              type="button"
              onClick={onViewGuidance}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition shadow-sm border border-slate-300/80 flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Panduan Penanganan</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-800 flex items-center gap-1.5">
              ICDR Grade &ge; 2
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-emerald-950 shadow-sm ring-1 ring-emerald-500/10">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white flex-shrink-0 shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
              NON-REFERABLE DR (SKRINING RUTIN FASKES PRIMER)
            </span>
            <span className="text-xs text-emerald-700 font-mono">ICDR Grade {grade}</span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold mt-1 text-slate-900 leading-tight">
            {info.followUp}
          </h4>
          <p className="text-xs sm:text-sm mt-1 text-slate-700 max-w-2xl leading-relaxed">
            Kondisi retina saat ini stabil ({info.labelId}). Belum terdapat indikasi rujukan segera ke spesialis mata. Lanjutkan pemantauan kadar gula darah (HbA1c &lt; 7.0%) dan jadwalkan evaluasi fundus berkala.
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2 self-start md:self-center">
        {onViewGuidance ? (
          <button
            type="button"
            onClick={onViewGuidance}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm transition shadow-sm border border-emerald-200 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Panduan Edukasi Pasien</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        ) : (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white shadow-sm border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Jadwal Skrining Berkala
          </span>
        )}
      </div>
    </div>
  );
};
