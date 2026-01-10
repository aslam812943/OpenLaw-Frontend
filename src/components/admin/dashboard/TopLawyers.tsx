import React from 'react';

interface TopLawyersProps {
    lawyers: { name: string; revenue: number; bookings: number }[];
}

export const TopLawyers: React.FC<TopLawyersProps> = ({ lawyers }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-slate-500 text-sm">
                        <th className="pb-4 pl-4 font-medium uppercase tracking-wider">Lawyer</th>
                        <th className="pb-4 font-medium uppercase tracking-wider">Revenue</th>
                        <th className="pb-4 font-medium uppercase tracking-wider">Bookings</th>
                    </tr>
                </thead>
                <tbody>
                    {lawyers.map((lawyer, index) => (
                        <tr key={index} className="group bg-slate-900/30 hover:bg-slate-900/60 transition-colors duration-200">
                            <td className="py-4 pl-4 rounded-l-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">
                                        {lawyer.name.charAt(0)}
                                    </div>
                                    <span className="text-white font-medium group-hover:text-emerald-400 transition-colors uppercase">{lawyer.name}</span>
                                </div>
                            </td>
                            <td className="py-4">
                                <span className="text-emerald-400 font-semibold tracking-tighter">₹{lawyer.revenue.toLocaleString()}</span>
                            </td>
                            <td className="py-4 rounded-r-xl">
                                <span className="text-slate-400">{lawyer.bookings}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
