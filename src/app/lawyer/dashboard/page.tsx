'use client'

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Activity,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { fetchLawyerDashboardStats } from '@/service/lawyerService';
import { KPICard } from '@/components/admin/dashboard/KPICard';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { BookingStatusChart } from '@/components/admin/dashboard/BookingStatusChart';
import { DashboardFilter } from '@/components/admin/dashboard/DashboardFilter';
import { showToast } from '@/utils/alerts';

interface LawyerDashboardStats {
  totalEarnings: number;
  totalConsultations: number;
  bookingStats: {
    completed: number;
    cancelled: number;
    pending: number;
    rejected: number;
    confirmed: number;
  };
  monthlyEarnings: { month: string; earnings: number }[];
}

export default function LawyerDashboard() {
  const [stats, setStats] = useState<LawyerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState('6m');
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({
    start: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 6);
      return d;
    })(),
    end: new Date()
  });

  const loadStats = async (start?: Date, end?: Date) => {
    try {
      setLoading(true);
      const data = await fetchLawyerDashboardStats(
        start?.toISOString(),
        end?.toISOString()
      );
      setStats(data);
    } catch (error: any) {
      showToast("error", "Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(dateFilter.start, dateFilter.end);
  }, [dateFilter]);

  const handleFilterChange = (start?: Date, end?: Date) => {
    setDateFilter({ start, end });
  };

  const handleRangeSelect = (range: string) => {
    setActiveRange(range);
  };

  const renderContent = () => {
    if (loading && !stats) {
      return (
        <div className="flex items-center justify-center min-h-[40vh] w-full">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500/20 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-emerald-500 border-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }

    if (!stats) return null;

    const totalBookings = Object.values(stats.bookingStats).reduce((a, b) => a + b, 0);
    const successRate = totalBookings > 0
      ? ((stats.bookingStats.completed / (stats.bookingStats.completed + stats.bookingStats.cancelled + stats.bookingStats.rejected)) * 100).toFixed(1)
      : "0";

    return (
      <>
        {/* KPI Section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <KPICard
            title="Total Net Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 15, isUp: true }}
            color="bg-emerald-500/10"
            description="After platform commission"
          />
          <KPICard
            title="Completed Consultations"
            value={stats.bookingStats.completed}
            icon={Briefcase}
            trend={{ value: 5, isUp: true }}
            color="bg-blue-500/10"
            description={`${totalBookings} total appointments`}
          />
          <KPICard
            title="Success Rate"
            value={`${successRate}%`}
            icon={Target}
            description="Completed vs Cancelled/Rejected"
            color="bg-purple-500/10"
          />
        </div>

        {/* Charts Section */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {/* Earnings Trend */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-emerald-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Earning Performance</h2>
                <p className="text-slate-400 text-sm">Monthly net earnings trend</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold bg-emerald-500/5 px-4 py-2 rounded-full">
                <TrendingUp size={16} /> Improving
              </div>
            </div>
            <RevenueChart data={stats.monthlyEarnings.map(m => ({ month: m.month, revenue: m.earnings }))} />
          </div>

          {/* Consultation Split */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-emerald-500/20 transition-all duration-300">
            <h2 className="text-xl font-bold text-white mb-1">Consultation Split</h2>
            <p className="text-slate-400 text-sm mb-8">Status distribution analysis</p>
            <BookingStatusChart data={stats.bookingStats} />
          </div>
        </div>

        {/* Performance Insights */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="text-emerald-500" size={24} />
                <h3 className="text-xl font-bold text-white">Performance Insight</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Your consultation completion rate is <span className="text-emerald-400 font-bold">{successRate}%</span>.
                {Number(successRate) > 80 ? " You are in the top 10% of performers this month!" : " Try reducing cancellations to improve your visibility."}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">+{stats.bookingStats.confirmed}</span>
                  <span className="text-xs text-slate-500 font-medium">Upcoming Sessions</span>
                </div>
                <div className="w-px h-10 bg-white/10 mx-2"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">₹{(stats.totalEarnings / Math.max(stats.bookingStats.completed, 1)).toFixed(0)}</span>
                  <span className="text-xs text-slate-500 font-medium">Avg. Per Consultation</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 text-emerald-500/5 group-hover:scale-110 transition-transform duration-500">
              <Target size={120} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-white mb-2">Growth Tracker</h4>
              <p className="text-blue-50/80 text-sm max-w-[280px]">
                You've earned <span className="font-bold">₹{stats.totalEarnings.toLocaleString()}</span> in the selected period.
                Keep providing quality advice to grow your practice.
              </p>
              <button className="mt-6 bg-white text-blue-700 px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
                View Earnings Report
              </button>
            </div>
            <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={120} />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700 bg-slate-950 min-h-screen text-slate-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Lawyer Insights
          </h1>
          <p className="mt-2 text-slate-400 font-medium">
            Monitor your earnings, consultations, and practice growth.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl px-5 py-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-slate-300 text-sm font-semibold uppercase tracking-widest text-nowrap">Practice Online</span>
        </div>
      </div>

      {/* Filter Section */}
      <DashboardFilter
        activeRange={activeRange}
        onRangeSelect={handleRangeSelect}
        onFilterChange={handleFilterChange}
      />

      {renderContent()}
    </div>
  );
}
