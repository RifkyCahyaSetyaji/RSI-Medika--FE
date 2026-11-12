import React from 'react';
import { DR_GRADES } from '../types';

interface ProbabilityBarsProps {
  probabilities: number[];
  predictedGrade: number;
}

export const ProbabilityBars: React.FC<ProbabilityBarsProps> = ({
  probabilities,
  predictedGrade,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Distribusi Probabilitas Kelas (Vision Transformer)
          </h4>
          <p className="text-xs text-slate-500">
            Softmax output ViT-B/16 untuk 5 grade skala ICDR
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          5 Kelas
        </span>
      </div>

      <div className="space-y-3">
        {probabilities.map((prob, grade) => {
          const info = DR_GRADES[grade] || DR_GRADES[0];
          const pct = Math.round(prob * 1000) / 10;
          const isWinner = grade === predictedGrade;

          const barColors = [
            'bg-emerald-500', // 0
            'bg-amber-500',   // 1
            'bg-orange-500',  // 2
            'bg-rose-500',    // 3
            'bg-red-700',     // 4
          ];

          return (
            <div key={grade} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`flex items-center gap-1.5 ${
                    isWinner ? 'font-bold text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isWinner ? barColors[grade] : 'bg-slate-300'
                    }`}
                  />
                  <span>Grade {grade} · {info.labelId}</span>
                  {isWinner && (
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 rounded">
                      Prediksi Utama
                    </span>
                  )}
                </span>
                <span
                  className={`font-mono text-xs ${
                    isWinner ? 'font-bold text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {pct.toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isWinner ? barColors[grade] : 'bg-slate-300'
                  }`}
                  style={{ width: `${Math.max(pct, 1)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
