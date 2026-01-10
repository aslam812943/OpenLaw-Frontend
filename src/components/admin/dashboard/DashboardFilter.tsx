import React, { useState } from 'react';
import { Calendar, Filter, ChevronDown } from 'lucide-react';

interface DashboardFilterProps {
    activeRange: string;
    onRangeSelect: (value: string) => void;
    onFilterChange: (startDate?: Date, endDate?: Date) => void;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({ activeRange, onRangeSelect, onFilterChange }) => {
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const ranges = [
        { label: 'Last 7 Days', value: '7d' },
        { label: 'Last 1 Month', value: '1m' },
        { label: 'Last 6 Months', value: '6m' },
        { label: 'Last 1 Year', value: '1y' },
        { label: 'Custom Range', value: 'custom' },
    ];

    const handleRangeSelect = (value: string) => {
        onRangeSelect(value);
        if (value === 'custom') {
            setShowCustomRange(true);
            return;
        }

        setShowCustomRange(false);
        const end = new Date();
        let start = new Date();

        if (value === '7d') start.setDate(end.getDate() - 7);
        else if (value === '1m') start.setMonth(end.getMonth() - 1);
        else if (value === '6m') start.setMonth(end.getMonth() - 6);
        else if (value === '1y') start.setFullYear(end.getFullYear() - 1);

        onFilterChange(start, end);
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customStart && customEnd) {
            onFilterChange(new Date(customStart), new Date(customEnd));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl w-fit">
                {ranges.map((range) => (
                    <button
                        key={range.value}
                        onClick={() => handleRangeSelect(range.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${activeRange === range.value
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {showCustomRange && (
                <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-end gap-4 p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl animate-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Start Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-[240px]"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">End Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-[240px]"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        Apply Filter
                    </button>
                </form>
            )}
        </div>
    );
};
