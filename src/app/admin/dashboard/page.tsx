'use client'

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  CreditCard,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { fetchDashboardStats } from '@/service/adminService';
import { KPICard } from '@/components/admin/dashboard/KPICard';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { BookingStatusChart } from '@/components/admin/dashboard/BookingStatusChart';
import { TopLawyers } from '@/components/admin/dashboard/TopLawyers';
import { showToast } from '@/utils/alerts';

interface DashboardStats {
  totalRevenue: number;
  totalCommission: number;
  bookingStats: {
    completed: number;
    cancelled: number;
    pending: number;
    rejected: number;
  };
  withdrawalStats: {
    totalWithdrawn: number;
    pendingWithdrawals: number;
  };
  topLawyers: { name: string; revenue: number; bookings: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error: any) {
        showToast("error", "Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-emerald-500 border-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Platform Analytics
          </h1>
          <p className="mt-2 text-slate-400 font-medium">
            Monitor revenue, growth, and operations performance.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl px-5 py-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-slate-300 text-sm font-semibold uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Platform Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, isUp: true }}
          color="bg-emerald-500/10"
        />
        <KPICard
          title="Commission Earned"
          value={`₹${stats.totalCommission.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 8.4, isUp: true }}
          color="bg-blue-500/10"
        />
        <KPICard
          title="Total Bookings"
          value={Object.values(stats.bookingStats).reduce((a, b) => a + b, 0)}
          icon={Briefcase}
          description="Across all categories"
          color="bg-purple-500/10"
        />
        <KPICard
          title="Pending Withdrawals"
          value={`₹${stats.withdrawalStats.pendingWithdrawals.toLocaleString()}`}
          icon={CreditCard}
          description="Awaiting approval"
          color="bg-amber-500/10"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Revenue Performance</h2>
              <p className="text-slate-400 text-sm">Monthly growth metrics across the platform</p>
            </div>
            <button className="flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors bg-emerald-500/5 px-4 py-2 rounded-full">
              Full Report <ArrowUpRight size={16} />
            </button>
          </div>
          <RevenueChart data={stats.monthlyRevenue} />
        </div>

        {/* Booking Distribution */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-emerald-500/20 transition-all duration-300">
          <h2 className="text-xl font-bold text-white mb-1">Booking Split</h2>
          <p className="text-slate-400 text-sm mb-8">Status distribution analysis</p>
          <BookingStatusChart data={stats.bookingStats} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Lawyers */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-emerald-500" size={24} />
            <h3 className="text-xl font-bold text-white">Top Performing Partners</h3>
          </div>
          <TopLawyers lawyers={stats.topLawyers} />
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-center">
            <p className="text-slate-400 text-sm font-medium mb-1">Consultation Success Rate</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">
                {stats.bookingStats.completed + stats.bookingStats.pending > 0
                  ? ((stats.bookingStats.completed / (stats.bookingStats.completed + stats.bookingStats.rejected + stats.bookingStats.cancelled)) * 100).toFixed(1)
                  : 0}%
              </span>
              <span className="text-emerald-400 text-sm font-medium pb-1.5 flex items-center gap-1">
                <ArrowUpRight size={14} /> 2.3%
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${stats.bookingStats.completed > 0 ? (stats.bookingStats.completed / (stats.bookingStats.completed + stats.bookingStats.rejected + stats.bookingStats.cancelled)) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-center">
            <p className="text-slate-400 text-sm font-medium mb-1">Average Retention</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">84.5%</span>
              <span className="text-emerald-400 text-sm font-medium pb-1.5 flex items-center gap-1">
                <ArrowUpRight size={14} /> 1.2%
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '84.5%' }}></div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-white mb-2">Payout Efficiency</h4>
              <p className="text-emerald-50/80 text-sm max-w-[280px]">
                Currently processing withdrawals with 98.4% accuracy and 24h average resolution time.
              </p>
              <button className="mt-6 bg-white text-emerald-700 px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20">
                View Requests
              </button>
            </div>
            <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-110 transition-transform duration-500">
              <PieChartIcon size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
