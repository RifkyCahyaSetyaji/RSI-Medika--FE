import React, { useState } from 'react';
import {
  BookOpen,
  Stethoscope,
  Pill,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Printer,
  Search,
  Eye,
  Activity,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  Zap,
  ArrowRight,
  FileText,
  AlertOctagon,
  HeartPulse
} from 'lucide-react';
import {
  DR_EDUCATION_GRADES,
  TREATMENT_MODALITIES,
  PATIENT_LIFESTYLE_RULES,
  FAQ_DIABETIC_RETINOPATHY,
  DRGradeDetail
} from '../data/educationData';
import { GradeBadge } from '../components/GradeBadge';

interface EducationViewProps {
  initialGrade?: number;
  initialTab?: 'overview' | 'grades' | 'treatments' | 'calculator' | 'lifestyle';
  onNewExam?: () => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  initialGrade = 0,
  initialTab = 'overview',
  onNewExam,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'treatments' | 'calculator' | 'lifestyle'>(initialTab);
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<number>(initialGrade);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Calculator State
  const [calcGrade, setCalcGrade] = useState<number>(initialGrade || 2);
  const [calcSuspectedDME, setCalcSuspectedDME] = useState<boolean>(false);
  const [calcDurationYears, setCalcDurationYears] = useState<number>(8);
  const [calcHbA1c, setCalcHbA1c] = useState<string>('7.5-9.0');
  const [calcBloodPressure, setCalcBloodPressure] = useState<string>('stage1');

  const selectedGradeDetail: DRGradeDetail =
    DR_EDUCATION_GRADES.find((g) => g.grade === selectedGradeIndex) || DR_EDUCATION_GRADES[0];

  const handlePrint = () => {
    window.print();
  };

  // Calculator recommendation logic
  const getCalculatorRecommendation = () => {
    const isEmerg = calcGrade >= 4;
    const isUrg = calcGrade === 3;
    const isMod = calcGrade === 2;
    const hasDME = calcSuspectedDME;

    let urgencyText = '';
    let urgencyBadge = '';
    let referralTiming = '';
    let primaryAction = '';
    const recommendedTests: string[] = [];
    const recommendedTherapies: string[] = [];

    // Base on grade & DME
    if (isEmerg) {
      urgencyText = 'Rujukan Darurat / Sangat Segera (< 24–48 Jam)';
      urgencyBadge = 'bg-rose-100 text-rose-800 border-rose-300';
      referralTiming = 'Segera rujuk ke Instalasi Gawat Darurat Mata / Konsultan Vitreoretina';
      primaryAction = 'Kombinasi PRP Laser + Injeksi Anti-VEGF / Pertimbangan Vitrektomi Cito';
      recommendedTests.push('Pemeriksaan Biomikroskopi Slit-Lamp dengan Lensa Kontak Fundus');
      recommendedTests.push('B-Scan Ultrasonography (USG Mata) bila media keruh karena perdarahan vitreus');
      recommendedTests.push('Pemeriksaan Tekanan Intraokular (Tonometri) waspada Glaukoma Neovaskular');
      recommendedTherapies.push('Panretinal Photocoagulation (PRP Laser) segera untuk mencegah perburukan iskemik');
      recommendedTherapies.push('Injeksi Intravitreal Anti-VEGF (Aflibercept / Ranibizumab / Bevacizumab)');
      recommendedTherapies.push('Pars Plana Vitrectomy (PPV) bila ada perdarahan vitreus masif atau traksi makula');
    } else if (isUrg) {
      urgencyText = 'Rujukan Segera (1–2 Minggu)';
      urgencyBadge = 'bg-orange-100 text-orange-800 border-orange-300';
      referralTiming = 'Rujuk ke Dokter Spesialis Mata Konsultan Retina dalam 1–2 minggu';
      primaryAction = 'Evaluasi Non-Perfusi Kapiler + Pertimbangan PRP Laser Profilaksis';
      recommendedTests.push('Angiografi Fluoresin Fundus (FFA) untuk memetakan luas iskemia retina');
      recommendedTests.push('Optical Coherence Tomography (OCT) Makula');
      recommendedTherapies.push('Pertimbangan Panretinal Photocoagulation (PRP Laser) dini');
      recommendedTherapies.push(hasDME ? 'Injeksi Anti-VEGF Intravitreal untuk mengatasi DME' : 'Observasi ketat tiap 2–3 bulan');
    } else if (isMod) {
      urgencyText = 'Perlu Rujukan ke Dokter Spesialis Mata (2–4 Minggu)';
      urgencyBadge = 'bg-amber-100 text-amber-800 border-amber-300';
      referralTiming = 'Jadwalkan rujukan elektif ke Poliklinik Mata dalam 2–4 minggu';
      primaryAction = hasDME
        ? 'Penanganan Segera Edema Makula Diabetik (Anti-VEGF) + Monitoring Retina'
        : 'Pemeriksaan Fundus Dilatasi Lengkap & OCT Skrining DME';
      recommendedTests.push('OCT Makula untuk mendeteksi edema makula subklinis');
      recommendedTests.push('Foto Fundus Serial Berwarna untuk baseline perbandingan');
      recommendedTherapies.push(hasDME ? 'Injeksi Anti-VEGF Intravitreal (lini pertama DME sentral)' : 'Monitoring berkala tiap 3–6 bulan');
      recommendedTherapies.push('Focal / Grid Laser bila terdapat edema makula non-center involved');
    } else if (calcGrade === 1) {
      urgencyText = 'Monitoring di Faskes Primer / Rujukan Elektif';
      urgencyBadge = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      referralTiming = 'Kontrol foto fundus ulang 6–12 bulan di faskes primer';
      primaryAction = hasDME
        ? 'Rujuk Sp.M (karena terdapat keluhan buram / curiga DME pada stadium awal)'
        : 'Edukasi Agresif & Optimalisasi Kontrol Metabolik';
      recommendedTests.push('Foto Fundus Berkala 6–12 bulan');
      if (hasDME) recommendedTests.push('OCT Makula di Sp.M untuk konfirmasi edema');
      recommendedTherapies.push('Optimalisasi target HbA1c < 7.0%');
      recommendedTherapies.push('Pengendalian tensi darah dengan ACE-Inhibitor / ARB');
    } else {
      urgencyText = 'Skrining Rutin Tahunan (Faskes Primer)';
      urgencyBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      referralTiming = 'Pemeriksaan fundus ulang 12 bulan';
      primaryAction = 'Pencegahan Primer Komplikasi Mikrovaskular';
      recommendedTests.push('Pemeriksaan Funduskopi / Foto Fundus berkala tahunan');
      recommendedTests.push('Cek HbA1c dan profil lipid per 3–6 bulan');
      recommendedTherapies.push('Manajemen gaya hidup sehat (diet rendah glikemik, olahraga 150 menit/minggu)');
      recommendedTherapies.push('Pertahankan gula darah dan tekanan darah stabil');
    }

    // Systemic adjustments based on HbA1c & BP
    const systemicNotes: string[] = [];
    if (calcHbA1c === '>9.0') {
      systemicNotes.push('PERHATIAN GLIKEMIK TINGGI (HbA1c > 9.0%): Pasien memerlukan intensifikasi terapi diabetes segera oleh Dokter Spesialis Penyakit Dalam (Sp.PD). Namun, hindari penurunan HbA1c yang terlalu drastis (>3% dalam sebulan) tanpa monitoring retina karena berisiko "early worsening".');
    }
    if (calcBloodPressure === 'stage2') {
      systemicNotes.push('HIPERTENSI TINGGI: Tekanan darah tinggi mempercepat robekan mikroaneurisma dan kebocoran lipid ke fovea. Titrasi antihipertensi ke target < 130/80 mmHg.');
    }
    if (calcDurationYears >= 10) {
      systemicNotes.push(`DURASI DIABETES LAMA (${calcDurationYears} Tahun): Risiko komplikasi mikrovaskular kumulatif sangat tinggi (>80%). Skrining ketat organ target lain (ginjal & saraf perifer).`);
    }

    return {
      urgencyText,
      urgencyBadge,
      referralTiming,
      primaryAction,
      recommendedTests,
      recommendedTherapies,
      systemicNotes,
    };
  };

  const rec = getCalculatorRecommendation();

  return (
    <div className="space-y-6">
      {/* Top Hero Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Pengetahuan &amp; Protokol Klinis</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Edukasi &amp; Tatalaksana Retinopati Diabetik
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Panduan komprehensif bagi tenaga kesehatan dan pasien mengenai patofisiologi, klasifikasi internasional ICDR (Grade 0–4), protokol tindakan medis (Anti-VEGF, Laser PRP, Vitrektomi), serta edukasi pencegahan kebutaan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 border border-white/20"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Cetak / Simpan Lembar Edukasi</span>
            </button>

            {onNewExam && (
              <button
                type="button"
                onClick={onNewExam}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-md shadow-emerald-500/25"
              >
                <Activity className="w-4 h-4" />
                <span>Mulai Screening Pasien Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Ikhtisar &amp; Patologi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grades')}
          className={`flex-1 min-w-[160px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'grades'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>2. Klasifikasi ICDR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('treatments')}
          className={`flex-1 min-w-[170px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'treatments'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>3. Protokol Tindakan Medis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 min-w-[180px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'calculator'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>4. Kalkulator Tatalaksana</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lifestyle')}
          className={`flex-1 min-w-[160px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'lifestyle'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>5. Edukasi &amp; Tanda Bahaya</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW & PATHOLOGY ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Section: Definisi & Mekanisme */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Patofisiologi Penyakit</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Apa itu Retinopati Diabetik?
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                <strong>Retinopati Diabetik (RD)</strong> adalah komplikasi mikrovaskular kronis dari penyakit diabetes melitus yang merusak pembuluh darah kapiler pada retina—lapisan peka cahaya di dinding belakang bola mata. Kondisi ini merupakan <strong>penyebab utama kebutaan permanen</strong> pada populasi usia produktif (20–74 tahun) di seluruh dunia.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  "The Silent Killer of Vision": Mengapa Sering Terlambat Terdeteksi?
                </span>
                <p className="text-slate-700">
                  Pada tahap awal, kerusakan pembuluh darah retina <strong>sama sekali tidak menimbulkan rasa sakit atau penurunan penglihatan</strong>. Penglihatan pasien dapat tetap tajam 20/20 meskipun perdarahan dan kebocoran lipid sudah terjadi. Ketika gejala buram atau bintik hitam akhirnya dirasakan pasien, penyakit umumnya telah memasuki stadium lanjut yang membutuhkan tindakan invasif.
                </p>
              </div>

              {/* 4 Tahap Perkembangan Patologi */}
              <h3 className="text-base font-bold text-slate-900 pt-2">
                Alur Tahapan Kerusakan Mikrovaskular Retina
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Langkah 1
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Kematian Perisit &amp; Mikroaneurisma
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kadar gula darah tinggi yang kronis merusak sel perisit penyangga dinding kapiler, menyebabkan pelemahan dinding pembuluh darah dan pembentukan tonjolan kecil (mikroaneurisma).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                    Langkah 2
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Kebocoran Plasma &amp; Eksudat
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sawar darah-retina (blood-retinal barrier) bocor, menyebabkan cairan plasma, lipoprotein, dan sel darah merembes keluar ke jaringan retina, membentuk <em>hard exudates</em> dan edema makula.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-800">
                    Langkah 3
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Oklusi Kapiler &amp; Iskemia Retina
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pembuluh darah tersumbat, aliran darah berhenti (non-perfusi kapiler), memicu infark serabut saraf retina (<em>cotton wool spots</em>) dan hipoksia jaringan retina yang meluas.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                    Langkah 4
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Neovaskularisasi (PDR) &amp; Kebutaan
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Jaringan retina yang kekurangan oksigen memicu pelepasan masif faktor VEGF, menumbuhkan pembuluh darah baru yang abnormal dan sangat rapuh, memicu perdarahan vitreus dan ablasio retina.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar: Faktor Risiko & Anatomi Retina */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span>Faktor Risiko Utama</span>
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong>Durasi Menderita Diabetes:</strong> Faktor prediktor terkuat. Setelah 15–20 tahun terdiagnosis, hampir 80% pasien DM tipe 2 dan &gt;95% DM tipe 1 mengalami derajat tertentu dari RD.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong>Kontrol Glikemik Buruk (HbA1c):</strong> Setiap kenaikan 1% HbA1c meningkatkan risiko komplikasi retinopati sebesar 35%.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong>Hipertensi Tak Terkontrol:</strong> Tekanan darah tinggi merusak endotel vaskular dan mempercepat timbulnya perdarahan retina.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong>Dislipidemia:</strong> Peningkatan kolesterol LDL dan trigliserida memicu pengendapan lipid masif pada fovea makula.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong>Nefropati Diabetik:</strong> Adanya albuminuria atau penurunan fungsi ginjal berjalan beriringan dengan perburukan retina.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong>Kehamilan:</strong> Kehamilan pada wanita penderita DM dapat mempercepat progresi retinopati secara cepat sehingga perlu skrining per trimester.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Anatomi Lesi Kunci */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Glosarium Lesi Citra Retina
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <strong className="text-white block">Mikroaneurisma (MA)</strong>
                    Bintik merah kecil (titik) bulat berbatas tegas pada kapiler retina. Tanda patognomonik awal.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <strong className="text-white block">Hard Exudates (Eksudat Keras)</strong>
                    Bercak kuning lilin berbatas tajam, endapan lipoprotein yang merembes keluar dari kapiler bocor.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <strong className="text-white block">Cotton Wool Spots</strong>
                    Bercak putih seperti kapas berbatas kabur akibat infark lapisan serabut saraf ganglion.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <strong className="text-white block">Neovaskularisasi (NVD/NVE)</strong>
                    Pertumbuhan jalinan pembuluh darah baru abnormal di diskus optikus atau retina lain yang rapuh.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ICDR CLASSIFICATION (GRADE 0-4) ================= */}
      {activeTab === 'grades' && (
        <div className="space-y-6">
          {/* Grade Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {DR_EDUCATION_GRADES.map((g) => {
              const isSelected = selectedGradeIndex === g.grade;
              return (
                <button
                  key={g.grade}
                  type="button"
                  onClick={() => setSelectedGradeIndex(g.grade)}
                  className={`px-4 py-3 rounded-2xl border transition-all text-left flex-shrink-0 flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                      g.grade === 0
                        ? 'bg-emerald-600'
                        : g.grade === 1
                        ? 'bg-amber-500'
                        : g.grade === 2
                        ? 'bg-orange-500'
                        : g.grade === 3
                        ? 'bg-rose-600'
                        : 'bg-red-700'
                    }`}
                  >
                    {g.grade}
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900">
                      Grade {g.grade}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[130px] block">
                      {g.nameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Grade Full Detail Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header */}
            <div
              className={`p-6 sm:p-7 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                selectedGradeDetail.grade === 4
                  ? 'bg-gradient-to-r from-red-700 to-rose-900'
                  : selectedGradeDetail.grade === 3
                  ? 'bg-gradient-to-r from-rose-600 to-orange-700'
                  : selectedGradeDetail.grade === 2
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600'
                  : selectedGradeDetail.grade === 1
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700'
              }`}
            >
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded bg-white/20 border border-white/30 inline-block">
                  Skala ICDR (International Clinical Diabetic Retinopathy)
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white">
                  Grade {selectedGradeDetail.grade}: {selectedGradeDetail.nameId}
                </h2>
                <p className="text-sm text-white/90 mt-1 font-medium">
                  {selectedGradeDetail.nameEn} · Tingkat Keparahan:{' '}
                  <span className="capitalize font-bold">{selectedGradeDetail.severity}</span>
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center flex-shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                  Status Rujukan
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white block mt-0.5">
                  {selectedGradeDetail.grade >= 2 ? 'PERLU RUJUKAN' : 'MONITORING PRIMER'}
                </span>
                <span className="text-xs text-white/80">
                  {selectedGradeDetail.screeningInterval}
                </span>
              </div>
            </div>

            {/* Content Body Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Sample Fundus Image & Visual Features (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner relative group">
                  <img
                    src={selectedGradeDetail.sampleImageUrl}
                    alt={`Citra Fundus Grade ${selectedGradeDetail.grade}`}
                    className="w-full aspect-square object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs flex items-center justify-between">
                    <span className="font-semibold">Contoh Citra Fundus Grade {selectedGradeDetail.grade}</span>
                    <span className="text-[10px] text-slate-300 font-mono">Dataset CAD-ViT</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <strong className="text-slate-900 block font-bold text-sm">
                    Risiko Progresi Penyakit:
                  </strong>
                  <p>{selectedGradeDetail.progressionRisk}</p>
                </div>
              </div>

              {/* Right Column: Clinical Details, Findings, Actions (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Ringkasan Definisi Klinis
                  </h3>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                    {selectedGradeDetail.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Karakteristik &amp; Temuan Citra Retina Fundus
                  </h3>
                  <div className="space-y-2">
                    {selectedGradeDetail.fundusFindings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Protokol Tatalaksana Medis Utama
                  </h3>
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                    <strong className="text-blue-950 text-sm block">
                      {selectedGradeDetail.primaryTreatment}
                    </strong>
                    <ul className="space-y-1.5 text-xs text-blue-900">
                      {selectedGradeDetail.medicalInterventions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Instruksi Edukasi Bagi Pasien
                  </h3>
                  <div className="space-y-2">
                    {selectedGradeDetail.patientAdvice.map((adv, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: MEDICAL TREATMENTS & PROCEDURES ================= */}
      {activeTab === 'treatments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              Protokol Terapi &amp; Tindakan Medis Retinopati Diabetik
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Penatalaksanaan retinopati diabetik mencakup kombinasi kontrol metabolik sistemik di faskes primer, serta intervensi spesifik oleh dokter spesialis mata (Sp.M) vitreoretina berupa injeksi anti-VEGF, fotokoagulasi laser retina, dan pembedahan vitrektomi.
            </p>
          </div>

          <div className="space-y-6">
            {TREATMENT_MODALITIES.map((t, idx) => {
              const categoryBadge = {
                sistemik: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: HeartPulse },
                'anti-vegf': { bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: Pill },
                laser: { bg: 'bg-orange-50 text-orange-800 border-orange-200', icon: Zap },
                bedah: { bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: Activity },
                kortikosteroid: { bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: Sparkles },
              }[t.category] || { bg: 'bg-slate-50 text-slate-800 border-slate-200', icon: Stethoscope };

              const IconComponent = categoryBadge.icon;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="p-3 rounded-2xl bg-slate-100 text-slate-800">
                        <IconComponent className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${categoryBadge.bg}`}
                          >
                            {t.category.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                          {t.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          {t.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {t.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Indikasi */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Indikasi Klinis
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {t.indications.map((ind, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Regimen / Prosedur */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                        Prosedur / Regimen
                      </h4>
                      <ul className="space-y-1.5 text-xs text-blue-950">
                        {t.regimenOrProcedure.map((reg, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>{reg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Efficacy & Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                      <strong>Efektivitas Klinis:</strong> {t.efficacy}
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                      <strong>Risiko &amp; Efek Samping:</strong>
                      <ul className="mt-1 space-y-1">
                        {t.sideEffectsOrRisks.map((risk, i) => (
                          <li key={i}>• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: CLINICAL CALCULATOR & SIMULATOR ================= */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              Kalkulator &amp; Simulator Rekomendasi Tatalaksana Klinis
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Alat bantu interaktif bagi dokter faskes primer, operator CAD-ViT, atau perawat untuk mensimulasikan rekomendasi tatalaksana, urgensi rujukan, dan panduan edukasi berdasarkan temuan grade dan parameter metabolik pasien.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>Parameter Pasien</span>
              </h3>

              {/* 1. Hasil Grade AI / Skrining */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  1. Hasil Grade Skrining Retina (ICDR):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setCalcGrade(g)}
                      className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                        calcGrade === g
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm">{g}</span>
                      <span className="text-[9px] uppercase opacity-75">
                        {g === 0 ? 'Normal' : g === 4 ? 'PDR' : `G${g}`}
                      </span>
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {DR_EDUCATION_GRADES[calcGrade].nameId}
                </span>
              </div>

              {/* 2. Gejala DME / Penglihatan Sentral Buram */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  2. Gejala Penglihatan Sentral / Curiga Edema Makula (DME):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcSuspectedDME(false)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                      !calcSuspectedDME
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Tidak Ada Buram Sentral
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcSuspectedDME(true)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                      calcSuspectedDME
                        ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-500/20'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Ada Buram / Metamorfopsia
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  DME dapat terjadi pada grade berapa pun dan membutuhkan evaluasi OCT makula.
                </span>
              </div>

              {/* 3. Durasi Menderita Diabetes */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>3. Durasi Diabetes Melitus:</span>
                  <span className="text-emerald-700 font-mono text-sm">{calcDurationYears} Tahun</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={calcDurationYears}
                  onChange={(e) => setCalcDurationYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Baru Terdiagnosis</span>
                  <span>10 Tahun</span>
                  <span>20+ Tahun</span>
                </div>
              </div>

              {/* 4. Kadar HbA1c */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  4. Kadar HbA1c Terakhir:
                </label>
                <select
                  value={calcHbA1c}
                  onChange={(e) => setCalcHbA1c(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="<7.0">Terkontrol Baik (&lt; 7.0%)</option>
                  <option value="7.0-7.5">Mendekati Target (7.0% – 7.5%)</option>
                  <option value="7.5-9.0">Terkontrol Sedang (7.5% – 9.0%)</option>
                  <option value=">9.0">Sangat Tinggi (&gt; 9.0%)</option>
                </select>
              </div>

              {/* 5. Tekanan Darah */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  5. Tekanan Darah (Tensi):
                </label>
                <select
                  value={calcBloodPressure}
                  onChange={(e) => setCalcBloodPressure(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="normal">Normal (&lt; 120/80 mmHg)</option>
                  <option value="pre">Pre-Hipertensi (120–139 / 80–89 mmHg)</option>
                  <option value="stage1">Hipertensi Derajat 1 (140–159 / 90–99 mmHg)</option>
                  <option value="stage2">Hipertensi Derajat 2 (&ge; 160 / &ge; 100 mmHg)</option>
                </select>
              </div>
            </div>

            {/* Output Recommendations (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Rencana Tatalaksana Klinis Terintegrasi
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Rencana</span>
                  </button>
                </div>

                {/* Urgency Badge Banner */}
                <div className={`p-4 rounded-2xl border ${rec.urgencyBadge} space-y-1`}>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block">
                    Tingkat Urgensi &amp; Rekomendasi Rujukan
                  </span>
                  <div className="text-base sm:text-lg font-black">
                    {rec.urgencyText}
                  </div>
                  <p className="text-xs mt-1 font-medium">
                    {rec.referralTiming}
                  </p>
                </div>

                {/* Primary Recommended Action */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                    Tindakan Medis Utama
                  </span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {rec.primaryAction}
                  </div>
                </div>

                {/* Recommended Diagnostic Tests */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Pemeriksaan Penunjang Lanjutan yang Diperlukan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {rec.recommendedTests.map((tst, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950 font-medium flex items-start gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{tst}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Therapies */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Opsi Terapi yang Dipertimbangkan:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {rec.recommendedTherapies.map((thr, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 font-medium"
                      >
                        <Pill className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{thr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Systemic warnings */}
                {rec.systemicNotes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Catatan Pengendalian Sistemik Pasien
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {rec.systemicNotes.map((note, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 leading-relaxed font-medium"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: PATIENT LIFESTYLE & EMERGENCY RED FLAGS ================= */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-6">
          {/* Emergency Red Flags Card */}
          <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-white/20 border border-white/30">
                Peringatan Gawat Darurat Mata
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Tanda Bahaya Retinopati Diabetik: Kapan Pasien Harus Segera ke IGD Mata?
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Jika penderita diabetes mengalami salah satu dari gejala berikut, <strong>JANGAN MENUNGGU</strong> jadwal kontrol biasa. Pasien harus segera dibawa ke Instalasi Gawat Darurat (IGD) Rumah Sakit Mata dalam kurun waktu <strong>&lt; 24 jam</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                <span className="text-xs font-bold text-white block">
                  1. Hujan Bintik Hitam / Sarang Laba-laba Mendadak
                </span>
                <p className="text-xs text-white/80">
                  Kemunculan mendadak floaters dalam jumlah masif menandakan pecahnya pembuluh darah baru retina (perdarahan vitreus akut).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                <span className="text-xs font-bold text-white block">
                  2. Kilatan Cahaya Berulang (Fotopsia)
                </span>
                <p className="text-xs text-white/80">
                  Sensasi seperti kilatan blitz kamera pada mata menandakan adanya tarikan fisik mekanis (traksi) jaringan parut pada retina.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                <span className="text-xs font-bold text-white block">
                  3. Bayangan "Tirai Hitam" Menutup Penglihatan
                </span>
                <p className="text-xs text-white/80">
                  Sensasi seperti tirai gelap yang turun menutupi sebagian lapang pandang merupakan tanda bahaya lepasnya retina (ablasio retina).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                <span className="text-xs font-bold text-white block">
                  4. Kehilangan Penglihatan Sentral Mendadak
                </span>
                <p className="text-xs text-white/80">
                  Penurunan visus drastis tanpa rasa sakit dalam hitungan menit hingga jam memerlukan evaluasi segera untuk mencegah kebutaan ireversibel.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Golden Rules */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Panduan Pasien Mandiri
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                5 Langkah Emas Mencegah Kebutaan Akibat Diabetes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PATIENT_LIFESTYLE_RULES.map((rule) => (
                <div
                  key={rule.number}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-slate-50/80 transition space-y-2 relative"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                    {rule.number}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm pt-1">
                    {rule.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Pertanyaan yang Sering Diajukan
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Tanya Jawab Seputar Retinopati Diabetik (FAQ)
              </h3>
            </div>

            <div className="space-y-3">
              {FAQ_DIABETIC_RETINOPATHY.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6.5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
