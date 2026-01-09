import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    color?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = "bg-emerald-500/10"
}) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/30 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} text-emerald-500 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span>{trend.isUp ? '+' : '-'}{trend.value}%</span>
                        <svg
                            className={`w-4 h-4 ${trend.isUp ? '' : 'rotate-180'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                {description && <p className="text-slate-500 text-xs mt-2">{description}</p>}
            </div>
        </div>
    );
};
