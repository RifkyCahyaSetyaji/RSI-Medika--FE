import React from 'react';
import { Examination, DR_GRADES } from '../types';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface GradeTrendChartProps {
  examinations: Examination[];
}

export const GradeTrendChart: React.FC<GradeTrendChartProps> = ({ examinations }) => {
  if (!examinations || examinations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 text-center text-slate-500 text-sm">
        Belum ada riwayat pemeriksaan untuk membentuk grafik tren grade.
      </div>
    );
  }

  // Sort chronological (oldest to newest)
  const sorted = [...examinations]
    .filter((e) => e.prediction !== null)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (sorted.length === 0) {
    return null;
  }

  // Dimensions for SVG
  const width = 640;
  const height = 220;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Grade Y mapping: 0 at bottom, 4 at top
  const getY = (grade: number) => {
    return paddingTop + chartH - (grade / 4) * chartH;
  };

  // Date X mapping
  const times = sorted.map((e) => new Date(e.created_at).getTime());
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeSpan = maxTime - minTime || 1;

  const getX = (idx: number, examTime: number) => {
    if (sorted.length === 1) return paddingLeft + chartW / 2;
    // Linear spacing if multiple exams to ensure clear readability
    return paddingLeft + (idx / (sorted.length - 1)) * chartW;
  };

  // Separate OD and OS series
  const odPoints = sorted
    .filter((e) => e.eye === 'OD')
    .map((e) => ({
      x: getX(sorted.indexOf(e), new Date(e.created_at).getTime()),
      y: getY(e.prediction?.clinician_grade ?? e.prediction!.grade),
      grade: e.prediction?.clinician_grade ?? e.prediction!.grade,
      date: new Date(e.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      exam: e,
    }));

  const osPoints = sorted
    .filter((e) => e.eye === 'OS')
    .map((e) => ({
      x: getX(sorted.indexOf(e), new Date(e.created_at).getTime()),
      y: getY(e.prediction?.clinician_grade ?? e.prediction!.grade),
      grade: e.prediction?.clinician_grade ?? e.prediction!.grade,
      date: new Date(e.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      exam: e,
    }));

  const odPath = odPoints.length > 1
    ? odPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  const osPath = osPoints.length > 1
    ? osPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  const referralThresholdY = getY(2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Visualisasi Tren Grade Retinopati Diabetik
          </h3>
          <p className="text-xs text-slate-500">
            Perkembangan grade keparahan retina OD (Mata Kanan) vs OS (Mata Kiri)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span className="text-slate-700">OD (Mata Kanan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-700">OS (Mata Kiri)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[500px] h-auto select-none"
        >
          {/* Y Gridlines and Labels */}
          {[0, 1, 2, 3, 4].map((g) => {
            const y = getY(g);
            const isRefThreshold = g === 2;
            return (
              <g key={g}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isRefThreshold ? '#f97316' : '#e2e8f0'}
                  strokeDasharray={isRefThreshold ? '4 3' : '2 2'}
                  strokeWidth={isRefThreshold ? 1.5 : 1}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill={isRefThreshold ? '#ea580c' : '#64748b'}
                  fontWeight={isRefThreshold ? 'bold' : 'normal'}
                >
                  Grade {g}
                </text>
              </g>
            );
          })}

          {/* Referral Threshold Label */}
          <text
            x={width - paddingRight}
            y={referralThresholdY - 6}
            textAnchor="end"
            fontSize="10"
            fill="#ea580c"
            fontWeight="600"
          >
            &uarr; Ambang Rujukan (Referable DR)
          </text>

          {/* OD Line and Points */}
          {odPath && (
            <path
              d={odPath}
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {odPoints.map((p, i) => (
            <g key={`od-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="2"
                className="hover:scale-125 transition-transform"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#065f46"
                fontWeight="bold"
              >
                G{p.grade}
              </text>
              <text
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {p.date}
              </text>
            </g>
          ))}

          {/* OS Line and Points */}
          {osPath && (
            <path
              d={osPath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 2"
            />
          )}
          {osPoints.map((p, i) => (
            <g key={`os-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
                className="hover:scale-125 transition-transform"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#1e40af"
                fontWeight="bold"
              >
                G{p.grade}
              </text>
              <text
                x={p.x}
                y={height - 24}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>* Nilai mencerminkan verifikasi akhir dokter bila telah direview.</span>
        <span className="font-medium text-orange-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Grade &ge; 2 mewajibkan penanganan spesialis retina
        </span>
      </div>
    </div>
  );
};
