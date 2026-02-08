import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subText?: string;
  icon: LucideIcon;
  color: 'black' | 'green' | 'red' | 'yellow';
}

const colorMap = {
  black: 'bg-white text-slate-900 border-slate-200 border-l-4 border-l-slate-900',
  green: 'bg-white text-emerald-700 border-slate-200 border-l-4 border-l-emerald-500',
  red: 'bg-white text-red-700 border-slate-200 border-l-4 border-l-red-500',
  yellow: 'bg-white text-amber-700 border-slate-200 border-l-4 border-l-amber-500',
};

const iconBgMap = {
  black: 'bg-red-100 text-red-700', // Changed from slate to red to match the theme requested
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-amber-50 text-amber-600',
};

export const KPICard: React.FC<KPICardProps> = ({ title, value, subText, icon: Icon, color }) => {
  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-70 mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {subText && <p className="text-xs mt-2 font-medium opacity-80">{subText}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconBgMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};