import React, { useState, useEffect, useRef } from 'react';
import { Patient, EyeType } from '../types';
import { fetchPatients, createExamination } from '../api';
import { useFundusValidator } from '../hooks/useFundusValidator';
import {
  UploadCloud,
  Eye,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  FileImage,
  RefreshCw,
  Search,
  Info,
  ShieldCheck
} from 'lucide-react';

interface NewExaminationViewProps {
  initialPatientId?: number | null;
  onAnalysisComplete: (examinationId: number) => void;
  onCancel: () => void;
}

export const NewExaminationView: React.FC<NewExaminationViewProps> = ({
  initialPatientId = null,
  onAnalysisComplete,
  onCancel,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(initialPatientId);
  const [patientSearch, setPatientSearch] = useState<string>('');
  const [eye, setEye] = useState<EyeType>('OD');

  const {
    selectedFile,
    previewUrl,
    isValidating: validatingImage,
    validationResult: imageValidation,
    validationError,
    processFile: handleFile,
    loadSample: loadSampleImage,
  } = useFundusValidator();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPatients().then(setPatients).catch(console.error);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError('Pilih data pasien terlebih dahulu.');
      return;
    }
    if (!selectedFile) {
      setError('Harap pilih atau unggah citra fundus retina.');
      return;
    }
    if (imageValidation && !imageValidation.valid) {
      setError(`Tidak dapat melanjutkan: Citra yang diunggah tidak terdeteksi sebagai foto fundus retina. ${imageValidation.reason}`);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulated progress steps for better clinical UX
    setLoadingStep('1/3: Praproses citra (crop border hitam & normalisasi Ben Graham)...');
    const t1 = setTimeout(() => {
      setLoadingStep('2/3: Ekstraksi representasi patch Vision Transformer (ViT-B/16)...');
    }, 1200);
    const t2 = setTimeout(() => {
      setLoadingStep('3/3: Menghitung Grad-CAM attention heatmap & probabilitas 5 kelas...');
    }, 2400);

    try {
      const exam = await createExamination(selectedPatientId, eye, selectedFile);
      clearTimeout(t1);
      clearTimeout(t2);
      onAnalysisComplete(exam.id);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      setError(err.message || 'Gagal memproses pemeriksaan');
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.medical_record_no.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Pemeriksaan Baru Citra Fundus Retina
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Pilih data pasien, mata yang diperiksa, dan unggah foto fundus untuk klasifikasi AI CAD-ViT
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Pilih Pasien */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">Identitas Pasien</h3>
          </div>

          {selectedPatient ? (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                  Pasien Terpilih
                </span>
                <h4 className="font-black text-slate-900 text-lg">
                  {selectedPatient.name}
                </h4>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2.5 mt-0.5">
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-900">
                    {selectedPatient.medical_record_no}
                  </span>
                  <span>·</span>
                  <span>{selectedPatient.diabetes_type || 'DM Tipe 2'}</span>
                  {selectedPatient.diabetes_duration_years !== null && (
                    <>
                      <span>·</span>
                      <span>Durasi DM: {selectedPatient.diabetes_duration_years} Tahun</span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatientId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition self-start sm:self-center shadow-2xs"
              >
                Ganti Pasien
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Ketik nama atau No. Rekam Medis pasien..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl">
                {filteredPatients.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-400">
                    Tidak ditemukan data pasien dengan kata kunci tersebut.
                  </div>
                ) : (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className="p-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">
                          {p.name}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {p.medical_record_no} · {p.diabetes_type || 'DM Tipe 2'}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition">
                        Pilih
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Pilih Mata */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">Mata yang Diperiksa</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setEye('OD')}
              className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                eye === 'OD'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${
                  eye === 'OD' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                OD
              </div>
              <div>
                <span className="font-extrabold block text-sm">Oculus Dexter (OD)</span>
                <span className="text-xs text-slate-500 font-medium">Mata Kanan</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEye('OS')}
              className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                eye === 'OS'
                  ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${
                  eye === 'OS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                OS
              </div>
              <div>
                <span className="font-extrabold block text-sm">Oculus Sinister (OS)</span>
                <span className="text-xs text-slate-500 font-medium">Mata Kiri</span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Unggah Citra Fundus */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-extrabold text-slate-900 text-base">Unggah Citra Fundus Retina</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Format: JPG, PNG (Maksimal 10 MB)</span>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center relative overflow-hidden ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50'
                : imageValidation && !imageValidation.valid
                ? 'border-rose-400 bg-rose-50/40'
                : previewUrl
                ? 'border-emerald-300 bg-slate-50'
                : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div className="space-y-3 w-full max-w-md mx-auto">
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Pratinjau Fundus"
                    className={`max-h-60 w-auto rounded-2xl shadow-md border block mx-auto object-contain bg-slate-950 ${
                      imageValidation && !imageValidation.valid
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300'
                    }`}
                  />
                  <div
                    className={`absolute top-2 right-2 text-white p-1.5 rounded-full shadow-md ${
                      validatingImage
                        ? 'bg-amber-500'
                        : imageValidation && !imageValidation.valid
                        ? 'bg-rose-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {validatingImage ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : imageValidation && !imageValidation.valid ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">{selectedFile?.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB · Klik untuk mengganti citra
                  </p>
                </div>

                {/* Validation Status Badges */}
                {validatingImage && (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 py-1.5 px-3 rounded-xl mx-auto w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Memverifikasi kesesuaian citra fundus retina...</span>
                  </div>
                )}

                {imageValidation && imageValidation.valid && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 py-1.5 px-3 rounded-xl mx-auto w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Foto Fundus Retina Terverifikasi Valid</span>
                  </div>
                )}

                {imageValidation && !imageValidation.valid && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-left text-xs text-rose-900 space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-rose-800 text-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Citra Tidak Terdeteksi Sebagai Retina</span>
                    </div>
                    <p className="text-rose-700 leading-relaxed font-medium">
                      {imageValidation.reason}
                    </p>
                    <p className="text-[11px] text-rose-600 font-semibold pt-1 border-t border-rose-200/70">
                      Harap ganti dengan foto penapisan fundus retina mata (bukan foto dokumen, wajah, pemandangan, atau benda lain).
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Tarik &amp; Letakkan Citra Fundus di Sini
                </div>
                <p className="text-xs text-slate-500">
                  atau <span className="text-emerald-700 font-bold underline">klik untuk memilih file dari komputer</span>
                </p>
              </div>
            )}
          </div>

          {/* Clinical Tip Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs text-emerald-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Tips Kualitas Citra:</strong> Pastikan citra fundus berfokus tajam pada makula dan diskus optikus, tidak terdapat refleksi kilatan cahaya kamera yang menutupi sentral fovea, dan pencahayaan memadai.
            </p>
          </div>

          {/* Quick Sample Selector for Instant Demo/Testing */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 block mb-2">
              Uji Cepat dengan Citra Sampel Klinis:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: 'Normal (Grade 0)', file: '/samples/fundus_grade0_normal.jpg', name: 'fundus_grade0_normal.jpg' },
                { label: 'Mild (Grade 1)', file: '/samples/fundus_grade1_mild.jpg', name: 'fundus_grade1_mild.jpg' },
                { label: 'Moderate (Grade 2)', file: '/samples/fundus_grade2_moderate.jpg', name: 'fundus_grade2_moderate.jpg' },
                { label: 'Severe (Grade 3)', file: '/samples/fundus_grade3_severe.jpg', name: 'fundus_grade3_severe.jpg' },
                { label: 'PDR (Grade 4)', file: '/samples/fundus_grade4_pdr.jpg', name: 'fundus_grade4_pdr.jpg' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => loadSampleImage(s.file, s.name)}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-xs font-bold transition text-center shadow-2xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        {(error || validationError) && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error || validationError}</span>
          </div>
        )}

        {/* Loading State Banner during ViT inference */}
        {loading && (
          <div className="p-6 rounded-3xl bg-emerald-950 text-white border border-emerald-800 shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 animate-scan" />
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
              <h4 className="font-extrabold text-sm sm:text-base">Sedang Menganalisis Citra Fundus CAD-ViT...</h4>
            </div>
            <p className="text-xs text-emerald-200 font-mono">{loadingStep}</p>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              !selectedFile ||
              !selectedPatientId ||
              validatingImage ||
              (imageValidation !== null && !imageValidation.valid)
            }
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              imageValidation && !imageValidation.valid
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
            }`}
          >
            {imageValidation && !imageValidation.valid ? (
              <>
                <XCircle className="w-4 h-4 text-white" />
                <span>Bukan Citra Retina</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{loading ? 'Memproses CAD-ViT...' : 'Mulai Analisis AI CAD-ViT'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
