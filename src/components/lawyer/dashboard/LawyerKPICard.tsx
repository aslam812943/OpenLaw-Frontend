import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface LawyerKPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    color?: 'teal' | 'slate' | 'rose' | 'amber' | 'indigo';
    delay?: number;
}

export const LawyerKPICard: React.FC<LawyerKPICardProps> = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = 'teal',
    delay = 0
}) => {
    const colorVariants = {
        teal: 'bg-teal-50/50 text-teal-600 border-teal-100 hover:border-teal-200 hover:shadow-teal-500/10',
        slate: 'bg-slate-50/50 text-slate-600 border-slate-100 hover:border-slate-200 hover:shadow-slate-500/10',
        rose: 'bg-rose-50/50 text-rose-600 border-rose-100 hover:border-rose-200 hover:shadow-rose-500/10',
        amber: 'bg-amber-50/50 text-amber-600 border-amber-100 hover:border-amber-200 hover:shadow-amber-500/10',
        indigo: 'bg-indigo-50/50 text-indigo-600 border-indigo-100 hover:border-indigo-200 hover:shadow-indigo-500/10',
    };

    const iconBgVariants = {
        teal: 'bg-teal-100/50 text-teal-600',
        slate: 'bg-slate-100/50 text-slate-600',
        rose: 'bg-rose-100/50 text-rose-600',
        amber: 'bg-amber-100/50 text-amber-600',
        indigo: 'bg-indigo-100/50 text-indigo-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden bg-white border rounded-3xl p-6 transition-all duration-300 group shadow-sm hover:shadow-xl ${colorVariants[color]}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${iconBgVariants[color]} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + 0.3 }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${trend.isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}
                    >
                        <span>{trend.isUp ? '↑' : '↓'} {trend.value}%</span>
                    </motion.div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                {description && (
                    <p className="text-slate-400 text-xs font-medium mt-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        {description}
                    </p>
                )}
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-6 -right-6 text-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-12">
                <Icon size={120} />
            </div>
        </motion.div>
    );
};
