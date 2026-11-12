import React, { useState } from 'react';
import { Stethoscope, CheckCircle, Clock, Save, AlertCircle, Sparkles } from 'lucide-react';
import { Prediction, DR_GRADES } from '../types';
import { reviewPrediction } from '../api';

interface DoctorReviewCardProps {
  prediction: Prediction;
  onReviewUpdated: (updated: Prediction) => void;
  currentUserRole?: string;
}

export const DoctorReviewCard: React.FC<DoctorReviewCardProps> = ({
  prediction,
  onReviewUpdated,
  currentUserRole = 'dr. Andi Pratama, Sp.M',
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(
    prediction.clinician_grade !== null ? prediction.clinician_grade : prediction.grade
  );
  const [notes, setNotes] = useState<string>(prediction.clinician_note || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const quickTemplates: Record<number, string[]> = {
    0: [
      'Retina tenang, tidak ditemukan mikroaneurisma atau perdarahan. Jadwalkan skrining ulang 12 bulan.',
      'Fundus normal, refleks fovea baik. Teruskan kontrol metabolik HbA1c < 7.0%.',
    ],
    1: [
      'Tampak mikroaneurisma minimal di temporal. Setuju Mild NPDR. Kontrol foto fundus 6–12 bulan.',
      'Lesi minimal belum mengancam makula. Optimalkan terapi OHO/insulin dan diet rendah glikemik.',
    ],
    2: [
      'Perdarahan bercak & hard exudates moderate. Rujuk ke Poliklinik Spesialis Mata untuk OCT makula.',
      'Ditemukan eksudat mendekati fovea, curiga DME. Rujuk Sp.M untuk evaluasi anti-VEGF.',
    ],
    3: [
      'Memenuhi kriteria Severe NPDR (4-2-1). Rujuk SEGERA ke Konsultan Vitreoretina untuk evaluasi PRP laser.',
      'Iskemia retina luas, risiko tinggi PDR. Rujuk segera < 1-2 minggu.',
    ],
    4: [
      'Tampak neovaskularisasi aktif (PDR). Rujukan DARURAT cito untuk PRP laser & pertimbangan Anti-VEGF.',
      'Proliferasi vaskular rapuh berisiko perdarahan vitreus masif. Tindakan cito Sp.M Vitreoretina.',
    ],
  };

  const handleApplyTemplate = (tpl: string) => {
    setNotes((prev) => (prev ? `${prev}\n${tpl}` : tpl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await reviewPrediction(prediction.id, selectedGrade, notes);
      onReviewUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan review dokter');
    } finally {
      setLoading(false);
    }
  };

  const isReviewed = prediction.status === 'reviewed';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Verifikasi &amp; Review Klinis Dokter
            </h3>
            <p className="text-xs text-slate-500">
              Dokter berwenang mengonfirmasi atau mengoreksi hasil analisis AI
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isReviewed ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
            Telah Diverifikasi
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi
          </span>
        )}
      </div>

      {/* Review details if already reviewed */}
      {isReviewed && prediction.reviewed_at && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>Waktu Verifikasi:</strong>{' '}
            {new Date(prediction.reviewed_at).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
          <span>
            <strong>Keputusan Klinis:</strong> Grade{' '}
            <strong className="text-slate-900">{prediction.clinician_grade}</strong>{' '}
            ({DR_GRADES[prediction.clinician_grade ?? 0]?.labelId})
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grade Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Pilihan Grade ICDR oleh Dokter:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((g) => {
              const info = DR_GRADES[g];
              const isSelected = selectedGrade === g;
              const isAiPick = prediction.grade === g;

              return (
                <button
                  type="button"
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm">Grade {g}</span>
                    {isAiPick && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 border px-1 py-0.2 rounded font-bold uppercase">
                        ViT
                      </span>
                    )}
                  </div>
                  <span className="text-xs line-clamp-1 font-medium">{info.labelId}</span>
                  <span
                    className={`text-[10px] mt-1 font-bold ${
                      g >= 2 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {g >= 2 ? 'Rujuk Sp.M' : 'Skrining Rutin'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinical Notes & Quick Templates */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Catatan Klinis &amp; Rekomendasi Dokter:
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Klik template cepat di bawah
            </span>
          </div>

          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ketik catatan klinis atau pilih dari template cepat di bawah..."
            className="w-full text-xs sm:text-sm rounded-2xl border border-slate-300 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400 font-sans"
          />

          {/* Quick Note Templates */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Template Grade {selectedGrade}:
            </span>
            {(quickTemplates[selectedGrade] || []).map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition max-w-full truncate text-left border border-slate-200/60"
                title={tpl}
              >
                + {tpl}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Hasil verifikasi dokter berhasil disimpan ke dalam rekam medis terpusat.</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500">
            Peninjau: <strong>{currentUserRole}</strong>
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Verifikasi Medis'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
