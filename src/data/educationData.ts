export interface DRGradeDetail {
  grade: number;
  nameId: string;
  nameEn: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'proliferative';
  summary: string;
  fundusFindings: string[];
  progressionRisk: string;
  screeningInterval: string;
  referralCriteria: string;
  primaryTreatment: string;
  medicalInterventions: string[];
  patientAdvice: string[];
  sampleImageUrl: string;
}

export interface TreatmentModalInfo {
  title: string;
  subtitle: string;
  category: 'sistemik' | 'anti-vegf' | 'laser' | 'bedah' | 'kortikosteroid';
  description: string;
  indications: string[];
  regimenOrProcedure: string[];
  efficacy: string;
  sideEffectsOrRisks: string[];
}

export const DR_EDUCATION_GRADES: DRGradeDetail[] = [
  {
    grade: 0,
    nameId: 'Tidak Ada Retinopati Diabetik (Normal)',
    nameEn: 'No Apparent Diabetic Retinopathy',
    severity: 'normal',
    summary: 'Citra retina fundus normal tanpa kelainan mikrovaskular diabetik yang terlihat.',
    fundusFindings: [
      'Diskus optikus berbatas tegas dengan c/d ratio normal',
      'Refleks fovea jernih dan avaskular sentral intak',
      'Arteriol dan venula retina berkaliber normal tanpa beading/dilatasi',
      'Tidak ada mikroaneurisma, perdarahan, eksudat keras, atau cotton wool spots'
    ],
    progressionRisk: 'Risiko progresi tahunan rendah (<5-10%), tetapi tetap meningkat jika kontrol glikemik buruk.',
    screeningInterval: 'Skrining foto fundus ulang setiap 12 bulan sekali di fasilitas pelayanan primer.',
    referralCriteria: 'Tidak memerlukan rujukan ke dokter spesialis mata selama visus normal dan tidak ada gejala visual.',
    primaryTreatment: 'Optimalisasi kontrol metabolik diabetes preventif (Diet, Olahraga, OHO / Insulin).',
    medicalInterventions: [
      'Target HbA1c < 7.0% untuk mencegah timbulnya komplikasi mikrovaskular mata.',
      'Target Tekanan Darah < 130/80 mmHg untuk menjaga integritas endotel pembuluh darah.',
      'Target Kolesterol LDL < 100 mg/dL (atau < 70 mg/dL bila ada risiko kardiovaskular).',
      'Skrining berkala fungsi ginjal (ureum/kreatinin & mikroalbuminuria) karena nefropati berjalan paralel dengan retinopati.'
    ],
    patientAdvice: [
      'Pertahankan jadwal pemeriksaan mata tahunan meskipun mata terasa sangat sehat.',
      'Konsumsi makanan bergizi seimbang dengan indeks glikemik rendah dan tinggi antioksidan.',
      'Lakukan aktivitas fisik aerobik sedang minimal 150 menit per minggu.',
      'Hindari merokok yang merusak perfusi kapiler retina.'
    ],
    sampleImageUrl: '/samples/fundus_grade0_normal.jpg'
  },
  {
    grade: 1,
    nameId: 'Retinopati Diabetik Non-Proliferatif Ringan (Mild NPDR)',
    nameEn: 'Mild Non-Proliferative Diabetic Retinopathy',
    severity: 'mild',
    summary: 'Tahap awal kerusakan mikrovaskular retina yang ditandai secara klinis HANYA oleh mikroaneurisma.',
    fundusFindings: [
      'Tampak satu atau beberapa mikroaneurisma (titik-titik merah bulat kecil berbatas tegas, diameter 15–60 µm)',
      'Sering ditemukan di daerah temporal dari fovea makula',
      'Belum ada perdarahan intraretina berukuran besar, eksudat, atau cotton wool spots',
      'Ketajaman penglihatan (visus) umumnya masih 20/20 (normal)'
    ],
    progressionRisk: 'Risiko progresi menjadi PDR dalam 1 tahun sekitar 5%. Merupakan "alarm" bahwa hiperglikemia telah mulai merusak pembuluh darah kapiler mata.',
    screeningInterval: 'Skrining ulang foto fundus setiap 6–12 bulan untuk memantau kemungkinan perkembangan lesi.',
    referralCriteria: 'Dapat dipantau di faskes primer jika ada kamera fundus dan pembacaan ahli, atau dirujuk elektif bila HbA1c sulit dikendalikan atau visus menurun.',
    primaryTreatment: 'Kontrol glikemik intensif dan edukasi agresif pencegahan kerusakan lebih lanjut.',
    medicalInterventions: [
      'Optimalisasi regimen terapi diabetes untuk mencapai target HbA1c < 7.0%.',
      'Pengendalian tekanan darah dengan obat lini pertama ACE-Inhibitor atau ARB yang memiliki efek vaskuloprotektif.',
      'Terapi statin bila profil lipid abnormal.',
      'Belum ada indikasi untuk tindakan invasif seperti laser atau injeksi mata.'
    ],
    patientAdvice: [
      'Pahami bahwa tahap ini adalah fase "peringatan dini": kerusakan dapat dihambat atau bahkan mengalami regresi parsial bila gula darah distabilkan.',
      'Pantau gula darah mandiri (SMBG) secara teratur di rumah.',
      'Kurangi konsumsi karbohidrat olahan dan gula sederhana.',
      'Konsultasikan hasil pemeriksaan fundus ini ke dokter penanggung jawab diabetes Anda.'
    ],
    sampleImageUrl: '/samples/fundus_grade1_mild.jpg'
  },
  {
    grade: 2,
    nameId: 'Retinopati Diabetik Non-Proliferatif Sedang (Moderate NPDR)',
    nameEn: 'Moderate Non-Proliferative Diabetic Retinopathy',
    severity: 'moderate',
    summary: 'Kerusakan vaskular retina berlanjut: ditemukan lebih dari sekadar mikroaneurisma, tetapi belum mencapai kriteria berat (4:2:1).',
    fundusFindings: [
      'Banyak mikroaneurisma tersebar di beberapa kuadran',
      'Perdarahan intraretina (dot and blot hemorrhages) dan flame-shaped hemorrhages',
      'Eksudat keras (hard exudates) berwarna kuning cerah akibat kebocoran lipid dan protein plasma',
      'Cotton wool spots (bercak putih lembut) akibat mikroinfark pada lapisan serabut saraf retina',
      'Dapat disertai kecurigaan Edema Makula Diabetik (DME) jika eksudat mendekati sentral fovea'
    ],
    progressionRisk: 'Risiko progresi menjadi PDR dalam 1 tahun mencapai 12–27%.',
    screeningInterval: 'Evaluasi retina oleh dokter spesialis mata setiap 3–6 bulan sekali.',
    referralCriteria: 'WAJIB RUJUK KE DOKTER SPESIALIS MATA (Sp.M) dalam waktu 2–4 minggu untuk evaluasi komprehensif (termasuk pemeriksaan OCT).',
    primaryTreatment: 'Rujukan ke spesialis mata + Evaluasi Optical Coherence Tomography (OCT) Makula + Kontrol metabolik maksimal.',
    medicalInterventions: [
      'Pemeriksaan OCT Makula untuk mendeteksi edema makula diabetik subklinis (Center-Involved DME vs Non-Center Involved DME).',
      'Jika ditemukan DME yang melibatkan fovea: Inisiasi injeksi intravitreal Anti-VEGF (Aflibercept, Ranibizumab, atau Bevacizumab).',
      'Jika DME non-center involved: Pertimbangan laser fokal / grid photocoagulation.',
      'Evaluasi laboratorium menyeluruh: HbA1c, profil lipid, eGFR, dan mikroalbuminuria urin.'
    ],
    patientAdvice: [
      'Segera buat janji konsultasi ke poli mata rumah sakit rujukan.',
      'Waspadai gejala penurunan visus sentral atau garis lurus yang tampak bergelombang (metamorfopsia).',
      'Kendalikan tekanan darah dan gula darah secara ketat; lonjakan tensi dapat mempercepat perdarahan retina.',
      'Catat jadwal kunjungan dokter spesialis mata dan jangan tunda kontrol.'
    ],
    sampleImageUrl: '/samples/fundus_grade2_moderate.jpg'
  },
  {
    grade: 3,
    nameId: 'Retinopati Diabetik Non-Proliferatif Berat (Severe NPDR)',
    nameEn: 'Severe Non-Proliferative Diabetic Retinopathy',
    severity: 'severe',
    summary: 'Iskemia retina luas yang memenuhi "Aturan 4:2:1". Memiliki risiko sangat tinggi berubah menjadi retinopati proliferatif dan menyebabkan kehilangan penglihatan mendadak.',
    fundusFindings: [
      'Memenuhi salah satu dari kriteria aturan 4:2:1:',
      '• >20 perdarahan intraretina di masing-masing 4 kuadran retina (Aturan 4)',
      '• Venous beading (pelebaran vena menyerupai untaian sosis/tasbih) di ≥2 kuadran (Aturan 2)',
      '• IRMA (Intraretinal Microvascular Abnormalities) yang jelas di ≥1 kuadran (Aturan 1)',
      'Area iskemia dan non-perfusi kapiler yang luas, tetapi BELUM ada neovaskularisasi terbuka'
    ],
    progressionRisk: 'Sangat tinggi: 50% berkembang menjadi PDR dalam kurun waktu 1 tahun, dan 15% berisiko mengalami PDR risiko tinggi (high-risk PDR).',
    screeningInterval: 'Evaluasi sangat ketat setiap 2–3 bulan oleh Dokter Spesialis Mata Konsultan Vitreoretina.',
    referralCriteria: 'RUJUK SEGERA KE SPESIALIS MATA / KONSULTAN RETINA dalam waktu 1–2 minggu.',
    primaryTreatment: 'Panretinal Photocoagulation (PRP Laser) profilaksis atau observasi sangat ketat + Injeksi Anti-VEGF bila disertai DME.',
    medicalInterventions: [
      'Pemeriksaan Angiografi Fluoresin Fundus (FFA) untuk memetakan area iskemia non-perfusi kapiler.',
      'Pertimbangan Panretinal Photocoagulation (PRP Laser) dini untuk mencegah neovaskularisasi rapuh, terutama bila kepatuhan kontrol pasien diragukan.',
      'Pemberian injeksi intravitreal Anti-VEGF berkala.',
      'Kolaborasi intensif dengan dokter spesialis penyakit dalam (Sp.PD) untuk stabilisasi metabolik menyeluruh tanpa penurunan HbA1c yang terlalu drastis secara tiba-tiba (hindari paradox early worsening).'
    ],
    patientAdvice: [
      'Ini adalah stadium gawat bagi kesehatan penglihatan Anda: jangan tunda rujukan mata!',
      'Hindari aktivitas fisik mengejan ekstrem, angkat beban berat, atau menundukkan kepala terlalu lama yang dapat memicu perdarahan vitreus.',
      'Jika tiba-tiba muncul bayangan gelap seperti jaring laba-laba atau hujan bintik hitam, segera ke IGD Rumah Sakit Mata.',
      'Pastikan keluarga memahami pentingnya pendampingan pengobatan pasien.'
    ],
    sampleImageUrl: '/samples/fundus_grade3_severe.jpg'
  },
  {
    grade: 4,
    nameId: 'Retinopati Diabetik Proliferatif (PDR)',
    nameEn: 'Proliferative Diabetic Retinopathy',
    severity: 'proliferative',
    summary: 'Stadium paling lanjut dan paling berbahaya: pembentukan pembuluh darah baru (neovaskularisasi) yang rapuh dan mudah pecah, berisiko tinggi menyebabkan kebutaan permanen.',
    fundusFindings: [
      'Neovaskularisasi pada diskus optikus (NVD) atau di tempat lain pada retina (NVE)',
      'Perdarahan preretina (perdarahan subhyaloid berbentuk perahu) atau Perdarahan Vitreus masif (kekeruhan korpus siliaris)',
      'Proliferasi jaringan fibrovaskular yang menempel pada permukaan retina',
      'Ablasio retina traksional (Tractional Retinal Detachment / TRD) akibat tarikan jaringan parut',
      'Dapat berkembang menjadi Rubeosis Iridis (neovaskularisasi pada iris) dan Glaukoma Neovaskular'
    ],
    progressionRisk: 'Risiko kebutaan permanen dalam 2–5 tahun sangat tinggi jika tidak segera ditangani secara medis (hingga >60%).',
    screeningInterval: 'Kunjungan rutin setiap 2–4 minggu pasca tindakan intervensi sampai neovaskularisasi teregresi sempurna.',
    referralCriteria: 'RUJUKAN DARURAT / SEGERA (<24–48 jam) ke Rumah Sakit Mata / Konsultan Vitreoretina!',
    primaryTreatment: 'Tindakan Terapi Kombinasi Segera: Panretinal Photocoagulation (PRP) + Injeksi Intravitreal Anti-VEGF + Pembedahan Vitrektomi (Pars Plana Vitrectomy / PPV) bila terindikasi.',
    medicalInterventions: [
      'Panretinal Photocoagulation (PRP Laser): Terapi baku emas untuk menembakkan laser pada retina perifer iskemik, menurunkan stimulus VEGF, dan meregresikan neovaskularisasi.',
      'Injeksi Intravitreal Anti-VEGF (Aflibercept, Ranibizumab, Bevacizumab): Diberikan sebagai ajuvan sebelum PRP atau sebelum vitrektomi untuk mengurangi perdarahan operatif.',
      'Vitrektomi (Pars Plana Vitrectomy / PPV): Diindikasikan segera bila ada: (1) Perdarahan vitreus persisten >1 bulan, (2) Ablasio retina traksional yang mengancam makula, (3) Perdarahan premakular padat.',
      'Manajemen Glaukoma Neovaskular bila tekanan intraokular meningkat (obat antiglaukoma topikal, siklodestruksi, atau implan glaukoma).'
    ],
    patientAdvice: [
      'STATUS GAWAT DARURAT MATA: Segera kunjungi IGD Rumah Sakit Mata hari ini juga.',
      'Pertahankan posisi tidur setengah duduk (elevasi kepala 30-45 derajat) jika terdapat perdarahan vitreus agar darah mengendap di bawah dan tidak menutupi fovea.',
      'DILARANG keras mengangkat benda berat, mengejan kuat, atau batuk hebat yang tidak diobati.',
      'Kepatuhan terhadap jadwal injeksi dan sesi laser sangat menentukan apakah penglihatan dapat diselamatkan.'
    ],
    sampleImageUrl: '/samples/fundus_grade4_pdr.jpg'
  }
];

export const TREATMENT_MODALITIES: TreatmentModalInfo[] = [
  {
    title: 'Optimalisasi Kontrol Metabolik & Sistemik',
    subtitle: 'Pilar Dasar Semua Stadium Retinopati Diabetik',
    category: 'sistemik',
    description: 'Terapi mendasar yang wajib dijalankan oleh setiap penderita diabetes melitus dari Grade 0 sampai Grade 4. Kontrol metabolik yang baik terbukti secara klinis (studi DCCT & UKPDS) mampu memperlambat progresi mikrovaskular mata hingga 76%.',
    indications: [
      'Semua pasien diabetes melitus (Tipe 1, Tipe 2, dan Gestasional)',
      'Pencegahan primer timbulnya lesi pada Grade 0',
      'Pencegahan sekunder progresi lesi pada Grade 1–4'
    ],
    regimenOrProcedure: [
      'Target HbA1c: < 7.0% (individualisasi: 6.5% untuk usia muda tanpa komorbid, 7.5–8.0% untuk lansia rentan hipoglikemia)',
      'Target Tekanan Darah: < 130/80 mmHg, obat pilihan utama ACE-inhibitor (Captopril, Ramipril) atau ARB (Candesartan, Losartan) yang memiliki bukti vaskuloprotektif',
      'Target Profil Lipid: Statin (Atorvastatin, Simvastatin) untuk menurunkan LDL < 100 mg/dL dan mencegah pengendapan hard exudates di fovea makula',
      'Gaya hidup: Diet gizi seimbang rendah indeks glikemik, aktivitas aerobik 150 menit/minggu, dan berhenti merokok total'
    ],
    efficacy: 'Menurunkan risiko timbulnya retinopati baru sebesar 76% dan menurunkan progresi lesi retinopati sebesar 54%.',
    sideEffectsOrRisks: [
      'Waspadai hipoglikemia berat jika penurunan glikemik dilakukan terlalu agresif',
      'Waspadai "Early Worsening Paradox": penurunan HbA1c terlalu cepat (>2-3% dalam beberapa minggu) pada Severe NPDR dapat memicu perburukan transien, sehingga butuh pemantauan mata ketat'
    ]
  },
  {
    title: 'Injeksi Intravitreal Anti-VEGF',
    subtitle: 'Standar Terapi Edema Makula Diabetik (DME) & PDR Aktif',
    category: 'anti-vegf',
    description: 'Pemberian obat agen biologis penghambat Vascular Endothelial Growth Factor (VEGF) langsung ke dalam rongga vitreus bola mata. Bekerja sangat cepat menutup kebocoran pembuluh darah abnormal dan mengeringkan cairan edema di makula.',
    indications: [
      'Center-Involved Diabetic Macular Edema (CI-DME) dengan penurunan tajam penglihatan',
      'Retinopati Diabetik Proliferatif (PDR) aktif',
      'Terapi pra-bedah sebelum vitrektomi untuk mengurangi risiko perdarahan intraoperatif',
      'Retinopati Non-Proliferatif Berat (Grade 3) dengan DME'
    ],
    regimenOrProcedure: [
      'Pilihan Obat: Aflibercept (Eylea 2 mg), Ranibizumab (Lucentis 0.5 mg), atau Bevacizumab (Avastin 1.25 mg - off label)',
      'Fase Inisiasi (Loading Phase): Injeksi bulanan selama 3–5 dosis berturut-turut',
      'Fase Rumatan: Protokol Treat-and-Extend (T&E) atau Pro Re Nata (PRN) berdasarkan ketebalan fovea pada scan OCT berkala',
      'Prosedur: Dilakukan secara aseptik steril di ruang tindakan mata dengan anestesi tetes mata lokal (topikal tetrakain/proparakain)'
    ],
    efficacy: 'Memperbaiki tajam penglihatan secara signifikan: >60% pasien mengalami peningkatan visus ≥2 baris Snellen pada evaluasi 1 tahun.',
    sideEffectsOrRisks: [
      'Risiko endoftalmitis infeksius (<0.05% per injeksi) yang dapat dicegah dengan sterilisasi Povidone Iodine 5%',
      'Peningkatan tekanan intraokular sementara pasca injeksi',
      'Perdarahan subkonjungtiva minor di lokasi suntikan yang hilang dalam 1–2 minggu'
    ]
  },
  {
    title: 'Fotokoagulasi Laser Retina (Panretinal & Focal)',
    subtitle: 'Baku Emas Pencegahan Kebutaan Permanen pada PDR & Severe NPDR',
    category: 'laser',
    description: 'Penggunaan sinar laser terkonsentrasi untuk membuat luka bakar mikroskopis terapeutik pada retina perifer. Dengan mengablasi area retina yang mengalami iskemia kronis, produksi molekul angiogenik (VEGF) turun drastis, sehingga pembuluh darah baru yang rapuh akan layu dan menyusut.',
    indications: [
      'Panretinal Photocoagulation (PRP): High-Risk Proliferative Diabetic Retinopathy (Grade 4)',
      'Severe NPDR (Grade 3) pada pasien dengan kontrol buruk atau mata kontralateral telah mengalami PDR',
      'Focal / Grid Laser: Edema makula diabetik non-center involved dengan kebocoran fokal mikroaneurisma'
    ],
    regimenOrProcedure: [
      'PRP Laser: Memerlukan total 1.200 hingga 2.000 tembakan laser (spot size 200–500 µm)',
      'Umumnya dibagi dalam 2–3 sesi berjarak 1–2 minggu untuk meminimalkan nyeri dan risiko edema eksudatif',
      'Dilakukan di poliklinik mata menggunakan slit lamp biomicroscopy dengan lensa kontak khusus (Volk SuperQuad / Area Centralis)',
      'Pasien diberikan anestesi topikal atau blok retrobulbar/peribulbar bila sangat sensitif'
    ],
    efficacy: 'Menurunkan risiko kehilangan penglihatan berat (kebutaan) sebesar >50% pada pasien PDR risiko tinggi (studi DRS & ETDRS).',
    sideEffectsOrRisks: [
      'Penyempitan lapang pandang perifer (lapang pandang menjadi agak terbatas di malam hari)',
      'Penurunan adaptasi gelap (kesulitan melihat dalam ruangan remang)',
      'Eksaserbasi sementara edema makula pasca laser (dapat dimitigasi dengan kombinasi Anti-VEGF)'
    ]
  },
  {
    title: 'Pembedahan Vitrektomi (Pars Plana Vitrectomy / PPV)',
    subtitle: 'Tindakan Bedah Mikro Vitreoretina untuk Komplikasi Lanjut',
    category: 'bedah',
    description: 'Prosedur bedah mikro canggih di kamar operasi untuk mengeluarkan cairan korpus vitreus yang mengalami perdarahan dan melepaskan jaringan parut fibrovaskular yang menarik retina dari posisinya.',
    indications: [
      'Perdarahan vitreus non-clearing yang tidak kunjung terserap > 1–3 bulan',
      'Ablasio retina traksional (Tractional Retinal Detachment / TRD) yang mengancam atau melibatkan fovea makula',
      'Ablasio retina kombinasi traksional dan regmatogenosa (Combined RD)',
      'Perdarahan preretina subhyaloid padat tepat di depan fovea makula',
      'Glaukoma neovaskular dengan kekeruhan media refraksi'
    ],
    regimenOrProcedure: [
      'Menggunakan teknologi vitrektomi kaliber kecil (23-gauge, 25-gauge, atau 27-gauge sutureless)',
      'Vitrektomi pars plana 3-port: infus cairan intraokular, iluminasi fiber optic, dan vitreous cutter',
      'Delaminasi dan segmentasi membran fibrovaskular menggunakan pinset dan gunting mikro retina',
      'Endofotokoagulasi laser langsung pada retina perifer intraoperatif',
      'Pertukaran cairan-udara (fluid-air exchange) dan pengisian tamponade intraokular (gas SF6/C3F8 atau Silicone Oil bila traksi berat)'
    ],
    efficacy: 'Mampu mereposisi retina kembali menempel pada >90% kasus dan memulihkan sebagian visus sentral yang sebelumnya terhalang perdarahan masif.',
    sideEffectsOrRisks: [
      'Percepatan pembentukan katarak pada mata fakik (sering membutuhkan operasi katarak elektif di kemudian hari)',
      'Peningkatan tekanan intraokular sementara',
      'Perdarahan vitreus ulang pasca operasi',
      'Kewajiban posisi tengkurap (prone positioning) selama 1–2 minggu bila menggunakan tamponade gas/silikon'
    ]
  },
  {
    title: 'Kortikosteroid Intravitreal',
    subtitle: 'Terapi Lini Kedua / Refrakter untuk Edema Makula Diabetik Kronis',
    category: 'kortikosteroid',
    description: 'Pemberian obat antiinflamasi poten dosis tinggi langsung ke dalam mata untuk meredakan inflamasi vaskular dan kebocoran sawar darah retina pada kasus-kasus edema makula yang tidak respon penuh terhadap Anti-VEGF.',
    indications: [
      'Edema Makula Diabetik kronis atau refrakter terhadap suntikan Anti-VEGF',
      'Pasien pseudofakik (sudah operasi katarak) dengan edema makula diabetik',
      'Pasien dengan kontraindikasi terhadap Anti-VEGF sistemik (riwayat stroke/infark miokard baru <3 bulan)'
    ],
    regimenOrProcedure: [
      'Implan Dexamethasone intravitreal (Ozurdex 0.7 mg) yang melepaskan obat secara bertahap selama 4–6 bulan',
      'Injeksi Triamcinolone Acetonide intravitreal (Kenacort/Triesence 4 mg)',
      'Dilakukan di ruang tindakan mata dengan protokol sterilisasi ketat'
    ],
    efficacy: 'Sangat efektif mengeringkan cairan edema makula pada kasus persisten dengan durasi kerja yang lebih panjang dibanding anti-VEGF.',
    sideEffectsOrRisks: [
      'Peningkatan tekanan intraokular (respon steroid ocular hypertension / glaukoma sekunder) pada ~30% pasien',
      'Pembentukan katarak subkapsular posterior pada pasien yang belum dioperasi katarak'
    ]
  }
];

export const PATIENT_LIFESTYLE_RULES = [
  {
    number: 1,
    title: 'Kontrol Target "ABC" Diabetes',
    desc: 'A = A1c di bawah 7.0%, B = Blood Pressure di bawah 130/80 mmHg, C = Cholesterol LDL di bawah 100 mg/dL. Tiga angka kunci penyelamat penglihatan.'
  },
  {
    number: 2,
    title: 'Skrining Retina Rutin 1x Setahun',
    desc: 'Retinopati diabetik sering tidak bergejala sama sekali pada tahap awal. Jangan tunggu pandangan menjadi buram untuk memeriksakan retina fundus.'
  },
  {
    number: 3,
    title: 'Pola Makan Bergizi Rendah Glikemik',
    desc: 'Batasi konsumsi gula murni, minuman manis kemasan, dan karbohidrat sederhana. Perbanyak sayuran hijau, kacang-kacangan, dan ikan kaya omega-3.'
  },
  {
    number: 4,
    title: 'Olahraga Aerobik Teratur & Aman',
    desc: 'Lakukan jalan cepat, bersepeda statis, atau berenang 30 menit sehari (5x seminggu). Hindari olahraga mengejan kuat bila memiliki stadium lanjut.'
  },
  {
    number: 5,
    title: 'Kenali Tanda Bahaya Darurat Mata',
    desc: 'Bila melihat kilatan cahaya mendadak, bintik hitam hujan jelaga, atau tirai hitam turun menutupi pandangan, segera ke IGD Rumah Sakit Mata dalam 24 jam.'
  }
];

export const FAQ_DIABETIC_RETINOPATHY = [
  {
    q: 'Apakah penglihatan yang buram akibat retinopati diabetik bisa sembuh total?',
    a: 'Keberhasilan pemulihan penglihatan sangat bergantung pada stadium saat pertama kali didiagnosis. Pada stadium awal (Grade 1 & 2), pengobatan dini dan kontrol gula darah dapat menghentikan kerusakan dan mencegah kebutaan. Namun pada stadium lanjut dengan kerusakan saraf retina atau traksi parut, pengobatan bertujuan mempertahankan penglihatan yang tersisa dan mencegah kebutaan total.'
  },
  {
    q: 'Mengapa mata saya terasa normal 20/20 tetapi dokter mengatakan ada kerusakan retina?',
    a: 'Ini adalah karakteristik khas retinopati diabetik sebagai "silent killer of vision". Kerusakan mikrovaskular sering bermula di area retina perifer di luar fovea (pusat penglihatan). Selama fovea belum terkena cairan edema atau perdarahan, pasien tetap merasa melihat dengan jelas, padahal pembuluh darah telah rapuh.'
  },
  {
    q: 'Kapan pasien penderita diabetes pertama kali harus menjalani pemeriksaan foto fundus retina?',
    a: 'Untuk Diabetes Melitus Tipe 2: Segera saat pertama kali dinyatakan terdiagnosis diabetes, karena seringkali diabetes telah berlangsung tanpa disadari selama beberapa tahun. Untuk Diabetes Melitus Tipe 1: Dimulai dalam 5 tahun sejak pertama kali terdiagnosis. Untuk ibu hamil dengan diabetes: Wajib periksa pada trimester pertama dan pemantauan berkala.'
  },
  {
    q: 'Apakah suntikan mata (Anti-VEGF) terasa sangat sakit?',
    a: 'Tidak. Sebelum injeksi, mata pasien diberikan obat tetes anestesi lokal khusus yang membuat permukaan bola mata mati rasa secara sempurna. Sebagian besar pasien hanya merasakan sedikit tekanan ringan selama beberapa detik saat prosedur berlangsung.'
  },
  {
    q: 'Bolehkah saya berolahraga angkat beban jika terdiagnosis retinopati diabetik?',
    a: 'Bagi pasien dengan Grade 0 atau Grade 1, angkat beban ringan-sedang diperbolehkan. Namun bagi pasien dengan Grade 3 (Severe NPDR) atau Grade 4 (PDR), manuver Valsalva (mengejan kuat saat mengangkat beban berat) SANGAT DILARANG karena peningkatan tekanan vena kepala dapat memicu pecahnya pembuluh darah retina baru yang rapuh, menyebabkan perdarahan vitreus akut.'
  }
];
