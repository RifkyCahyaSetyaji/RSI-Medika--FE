import React from 'react';
import { DR_GRADES } from '../types';

interface GradeBadgeProps {
  grade: number;
  size?: 'sm' | 'md' | 'lg';
  showFollowUp?: boolean;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  grade,
  size = 'md',
  showFollowUp = false,
}) => {
  const info = DR_GRADES[grade] || DR_GRADES[0];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base font-bold',
  };

  const badgeColor = {
    0: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    1: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
    2: 'bg-orange-50 text-orange-800 border-orange-200 ring-orange-500/20',
    3: 'bg-rose-50 text-rose-800 border-rose-200 ring-rose-500/20',
    4: 'bg-red-100 text-red-900 border-red-300 ring-red-600/30',
  }[grade] || 'bg-slate-100 text-slate-700 border-slate-200';

  const dotColor = {
    0: 'bg-emerald-500',
    1: 'bg-amber-500',
    2: 'bg-orange-500',
    3: 'bg-rose-500',
    4: 'bg-red-700 animate-pulse',
  }[grade] || 'bg-slate-400';

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border ring-1 font-semibold ${badgeColor} ${sizeClasses[size]}`}
      >
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span>Grade {grade}: {info.labelId}</span>
      </div>
      {showFollowUp && (
        <span className="text-xs text-slate-500 italic pl-1">
          {info.followUp}
        </span>
      )}
    </div>
  );
};
