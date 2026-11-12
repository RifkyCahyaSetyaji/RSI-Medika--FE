import React, { useState, useEffect } from 'react';
import { Examination, EyeType } from '../types';
import { fetchExaminations, fetchPatients } from '../api';
import { GradeBadge } from '../components/GradeBadge';
import {
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Filter,
  Search,
  X,
  Stethoscope
} from 'lucide-react';

interface ExaminationsListViewProps {
  onSelectExam: (examId: number) => void;
  onSelectPatient: (patientId: number) => void;
}

export const ExaminationsListView: React.FC<ExaminationsListViewProps> = ({
  onSelectExam,
  onSelectPatient,
}) => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterReferral, setFilterReferral] = useState<'all' | 'referral' | 'non-referral'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed'>('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [exams, patients] = await Promise.all([
          fetchExaminations(100),
          fetchPatients(),
        ]);
        setExaminations(exams);
        const map: Record<number, string> = {};
        patients.forEach((p) => {
          map[p.id] = `${p.name} (${p.medical_record_no})`;
        });
        setPatientMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = examinations.filter((e) => {
    if (filterReferral === 'referral' && !e.prediction?.referral) return false;
    if (filterReferral === 'non-referral' && e.prediction?.referral) return false;
    if (filterStatus === 'pending' && e.prediction?.status !== 'pending') return false;
    if (filterStatus === 'reviewed' && e.prediction?.status !== 'reviewed') return false;
    if (search) {
      const patientName = patientMap[e.patient_id]?.toLowerCase() || '';
      if (!patientName.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Riwayat Screening Fundus Retina
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Daftar seluruh pemeriksaan citra fundus yang diproses oleh model CAD-ViT
          </p>
        </div>

        {/* Search & Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pasien..."
              className="pl-8 pr-7 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setFilterReferral('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterReferral === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterReferral('referral')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterReferral === 'referral'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Perlu Rujukan
            </button>
            <button
              onClick={() => setFilterReferral('non-referral')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterReferral === 'non-referral'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Non-Rujukan
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Review
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'pending'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menunggu Review
            </button>
            <button
              onClick={() => setFilterStatus('reviewed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'reviewed'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terverifikasi
            </button>
          </div>
        </div>
      </div>

      {/* Examinations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Waktu Pemeriksaan</th>
                <th className="px-5 py-3.5">Identitas Pasien</th>
                <th className="px-5 py-3.5">Mata</th>
                <th className="px-5 py-3.5">Citra Fundus &amp; Heatmap</th>
                <th className="px-5 py-3.5">Klasifikasi AI</th>
                <th className="px-5 py-3.5">Status Rujukan</th>
                <th className="px-5 py-3.5">Status Dokter</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat riwayat pemeriksaan...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    Tidak ada data pemeriksaan yang sesuai kriteria filter.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const pred = e.prediction;
                  return (
                    <tr
                      key={e.id}
                      onClick={() => onSelectExam(e.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="px-5 py-4 text-xs font-medium text-slate-800">
                        {new Date(e.captured_at || e.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {new Date(e.captured_at || e.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs font-bold text-slate-900">
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            onSelectPatient(e.patient_id);
                          }}
                          className="hover:text-emerald-700 underline text-left"
                        >
                          {patientMap[e.patient_id] || `Pasien #${e.patient_id}`}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-slate-100 text-slate-800 border">
                          {e.eye}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={e.image_url}
                            alt="Fundus"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          {e.heatmap_url && (
                            <img
                              src={e.heatmap_url}
                              alt="Heatmap"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                            />
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {pred && <GradeBadge grade={pred.grade} size="sm" />}
                      </td>

                      <td className="px-5 py-4">
                        {pred?.referral ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Rujuk Sp.M
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Screening
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs">
                        {pred?.status === 'reviewed' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Grade {pred.clinician_grade}
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Menunggu Review
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            onSelectExam(e.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition inline-flex items-center gap-1"
                        >
                          Lihat Hasil
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
    </div>
  );
};
