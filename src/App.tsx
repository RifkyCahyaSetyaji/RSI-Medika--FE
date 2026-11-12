import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PatientListView } from './views/PatientListView';
import { PatientDetailView } from './views/PatientDetailView';
import { NewExaminationView } from './views/NewExaminationView';
import { AnalysisResultView } from './views/AnalysisResultView';
import { ExaminationsListView } from './views/ExaminationsListView';
import { EducationView } from './views/EducationView';
import { checkHealth } from './api';
import { useHealthStatus } from './hooks/useHealthStatus';
import { BookOpen, ShieldCheck, HeartPulse, Eye, Users, PlusCircle, Activity } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<string>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [educationGrade, setEducationGrade] = useState<number>(0);
  const [educationTab, setEducationTab] = useState<'overview' | 'grades' | 'treatments' | 'calculator' | 'lifestyle'>('overview');

  const { modelStatus } = useHealthStatus();
  const [currentRole, setCurrentRole] = useState<string>('dr. Andi Pratama, Sp.M');

  const navigateTo = (
    view: string,
    params?: {
      patientId?: number;
      examId?: number;
      grade?: number;
      tab?: 'overview' | 'grades' | 'treatments' | 'calculator' | 'lifestyle';
    }
  ) => {
    if (params?.patientId !== undefined) setSelectedPatientId(params.patientId);
    if (params?.examId !== undefined) setSelectedExamId(params.examId);
    if (params?.grade !== undefined) setEducationGrade(params.grade);
    if (params?.tab !== undefined) setEducationTab(params.tab);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
        modelStatus={modelStatus}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'patients' && (
          <PatientListView
            onSelectPatient={(id) => navigateTo('patient-detail', { patientId: id })}
            onNewExamForPatient={(id) => navigateTo('new-examination', { patientId: id })}
            onNavigateToEducation={() => navigateTo('education')}
          />
        )}

        {currentView === 'patient-detail' && selectedPatientId !== null && (
          <PatientDetailView
            patientId={selectedPatientId}
            onBack={() => navigateTo('patients')}
            onNewExam={(id) => navigateTo('new-examination', { patientId: id })}
            onSelectExam={(id) => navigateTo('analysis', { examId: id })}
            onNavigateToEducation={(grade) =>
              navigateTo('education', { grade: grade ?? 0, tab: 'grades' })
            }
          />
        )}

        {currentView === 'new-examination' && (
          <NewExaminationView
            initialPatientId={selectedPatientId}
            onAnalysisComplete={(examId) => navigateTo('analysis', { examId })}
            onCancel={() =>
              selectedPatientId
                ? navigateTo('patient-detail', { patientId: selectedPatientId })
                : navigateTo('patients')
            }
          />
        )}

        {currentView === 'analysis' && selectedExamId !== null && (
          <AnalysisResultView
            examinationId={selectedExamId}
            currentUserRole={currentRole}
            onBack={() => {
              if (selectedPatientId) {
                navigateTo('patient-detail', { patientId: selectedPatientId });
              } else {
                navigateTo('examinations-list');
              }
            }}
            onNavigateToEducation={(grade) =>
              navigateTo('education', { grade: grade ?? 0, tab: 'grades' })
            }
          />
        )}

        {currentView === 'examinations-list' && (
          <ExaminationsListView
            onSelectExam={(id) => navigateTo('analysis', { examId: id })}
            onSelectPatient={(id) => navigateTo('patient-detail', { patientId: id })}
          />
        )}

        {currentView === 'education' && (
          <EducationView
            initialGrade={educationGrade}
            initialTab={educationTab}
            onNewExam={() => navigateTo('new-examination')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-2xs">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-slate-900 tracking-tight block">
                  CAD-ViT · Deteksi Retinopati Diabetik
                </span>
                <span className="text-xs text-slate-500">
                  Vision Transformer Base Patch16/224 · Grad-CAM Explainability
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => navigateTo('patients')}
                className="hover:text-emerald-700 transition"
              >
                Daftar Pasien
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigateTo('new-examination')}
                className="hover:text-emerald-700 transition"
              >
                Pemeriksaan Baru
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigateTo('examinations-list')}
                className="hover:text-emerald-700 transition"
              >
                Riwayat Screening
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigateTo('education')}
                className="text-emerald-700 hover:text-emerald-800 transition"
              >
                Edukasi &amp; Tatalaksana RD
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Standar Klasifikasi: <strong className="text-slate-600">ICDR (International Clinical Diabetic Retinopathy)</strong>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Kepatuhan UU PDP No. 27/2022
              </span>
              <span>·</span>
              <span>Computer-Aided Diagnosis System v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
