import React, { useState, useEffect } from 'react';
import { Patient, Stats, PatientCreate } from '../types';
import { fetchPatients, fetchStats, createPatient } from '../api';
import { GradeBadge } from '../components/GradeBadge';
import {
  Users,
  Search,
  UserPlus,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle,
  FileText,
  Calendar,
  BookOpen,
  Filter,
  Stethoscope
} from 'lucide-react';

interface PatientListViewProps {
  onSelectPatient: (patientId: number) => void;
  onNewExamForPatient: (patientId: number) => void;
  onNavigateToEducation?: () => void;
}

export const PatientListView: React.FC<PatientListViewProps> = ({
  onSelectPatient,
  onNewExamForPatient,
  onNavigateToEducation,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'all' | 'referral' | 'pending'>('all');

  // New Patient Form state
  const [formData, setFormData] = useState<PatientCreate>({
    medical_record_no: '',
    name: '',
    birth_date: '',
    sex: 'L',
    diabetes_type: 'Tipe 2',
    diabetes_duration_years: 5,
  });
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async (query?: string) => {
    setLoading(true);
    try {
      const [pts, st] = await Promise.all([
        fetchPatients(query),
        fetchStats().catch(() => null),
      ]);
      setPatients(pts);
      if (st) setStats(st);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData(search);
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const newPt = await createPatient({
        ...formData,
        diabetes_duration_years: formData.diabetes_duration_years
          ? Number(formData.diabetes_duration_years)
          : null,
      });
      setModalOpen(false);
      setFormData({
        medical_record_no: '',
        name: '',
        birth_date: '',
        sex: 'L',
        diabetes_type: 'Tipe 2',
        diabetes_duration_years: 5,
      });
      await loadData();
      onSelectPatient(newPt.id);
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan pasien');
    } finally {
      setFormLoading(false);
    }
  };

  const calculateAge = (birthDateStr: string | null) => {
    if (!birthDateStr) return '-';
    const birth = new Date(birthDateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} thn`;
  };

  // Filter patients based on tab
  const filteredPatients = patients.filter((pt) => {
    if (filterType === 'referral') {
      return pt.latest_referral || (pt.latest_grade !== undefined && pt.latest_grade !== null && pt.latest_grade >= 2);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Pasien
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.total_patients : patients.length}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Populasi terdaftar skrining</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pemeriksaan Fundus
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.total_examinations : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Citra dianalisis CAD-ViT</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              Perlu Rujukan (Grade &ge; 2)
            </span>
            <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-orange-600">
            {stats ? stats.referral_count : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Rujukan dokter spesialis mata</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Menunggu Review
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600">
            {stats ? stats.pending_reviews : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Perlu verifikasi klinis dokter</p>
        </div>
      </div>

      {/* Educational Banner */}
      {onNavigateToEducation && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md flex-shrink-0">
              <BookOpen className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Fitur Baru: Informasi &amp; Panduan Klinis
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Panduan Edukasi Retinopati Diabetik &amp; Tatalaksana Medis
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Pelajari 5 grade klasifikasi ICDR, protokol tindakan (Anti-VEGF, Laser PRP, Vitrektomi), serta kalkulator rekomendasi tatalaksana.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToEducation}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 text-xs sm:text-sm font-bold transition shadow-sm flex items-center gap-2"
          >
            <span>Buka Pusat Edukasi</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Main Patients Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Filter & Action Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan nama atau No. Rekam Medis (RM)..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({patients.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('referral')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === 'referral'
                    ? 'bg-orange-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Perlu Rujukan
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pasien Baru</span>
          </button>
        </div>

        {/* Table of Patients */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">No. Rekam Medis</th>
                <th className="px-5 py-3.5">Nama Pasien</th>
                <th className="px-5 py-3.5">Usia / JK</th>
                <th className="px-5 py-3.5">Riwayat Diabetes</th>
                <th className="px-5 py-3.5">Status Retina AI</th>
                <th className="px-5 py-3.5 text-center">Jml Periksa</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data pasien...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <p className="text-base font-bold text-slate-700">
                      Tidak ada data pasien yang cocok
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? `Kata kunci: "${search}"` : 'Belum ada data pasien dalam kategori ini.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pt) => {
                  return (
                    <tr
                      key={pt.id}
                      onClick={() => onSelectPatient(pt.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {pt.medical_record_no}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {pt.name}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {calculateAge(pt.birth_date)} · {pt.sex === 'L' ? 'Laki-laki' : pt.sex === 'P' ? 'Perempuan' : '-'}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="font-semibold text-slate-800">
                          {pt.diabetes_type || 'DM Tipe 2'}
                        </span>
                        {pt.diabetes_duration_years !== null && (
                          <span className="text-slate-500 block">
                            {pt.diabetes_duration_years} tahun
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {pt.latest_grade !== undefined && pt.latest_grade !== null ? (
                          <GradeBadge grade={pt.latest_grade} size="sm" />
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Belum diperiksa
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                          {pt.examinations_count || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => onNewExamForPatient(pt.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition"
                          >
                            + Periksa
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectPatient(pt.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pasien Baru */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-emerald-600 text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Registrasi Pasien Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Masukkan data demografis &amp; riwayat klinis diabetes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-5 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Rekam Medis (RM) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: RM-2026-088"
                    value={formData.medical_record_no}
                    onChange={(e) =>
                      setFormData({ ...formData, medical_record_no: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.sex || 'L'}
                    onChange={(e) =>
                      setFormData({ ...formData, sex: e.target.value as 'L' | 'P' })
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Pasien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Pamungkas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value || null })
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Diabetes
                  </label>
                  <select
                    value={formData.diabetes_type || 'Tipe 2'}
                    onChange={(e) =>
                      setFormData({ ...formData, diabetes_type: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Tipe 2">Diabetes Tipe 2</option>
                    <option value="Tipe 1">Diabetes Tipe 1</option>
                    <option value="Gestasional">Gestasional</option>
                    <option value="Lainnya">Lainnya / Sekunder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Durasi DM (Thn)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    step="0.5"
                    value={formData.diabetes_duration_years ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diabetes_duration_years: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {formLoading ? 'Menyimpan...' : 'Simpan & Daftarkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
