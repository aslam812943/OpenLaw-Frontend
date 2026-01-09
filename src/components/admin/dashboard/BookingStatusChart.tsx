import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BookingStatusChartProps {
    data: {
        completed: number;
        cancelled: number;
        pending: number;
        rejected: number;
    };
}

export const BookingStatusChart: React.FC<BookingStatusChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Completed', value: data.completed, color: '#10b981' },
        { name: 'Cancelled', value: data.cancelled, color: '#f43f5e' },
        { name: 'Pending', value: data.pending, color: '#f59e0b' },
        { name: 'Rejected', value: data.rejected, color: '#64748b' },
    ].filter(item => item.value > 0);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#1e293b',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="text-slate-400 text-sm">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
