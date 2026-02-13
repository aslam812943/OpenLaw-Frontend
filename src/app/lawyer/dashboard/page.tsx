'use client'

import React, { useEffect, useState } from 'react';
import { TrendingUp, Briefcase, DollarSign, Activity, ArrowUpRight, Target, Users, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLawyerDashboardStats, getprofile, LawyerDashboardStats } from '@/service/lawyerService';
import { LawyerKPICard } from '@/components/lawyer/dashboard/LawyerKPICard';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { BookingStatusChart } from '@/components/admin/dashboard/BookingStatusChart';
import { DashboardFilter } from '@/components/admin/dashboard/DashboardFilter';
import { showToast } from '@/utils/alerts';

export default function LawyerDashboard() {
  const [stats, setStats] = useState<LawyerDashboardStats | null>(null);
  const [lawyerName, setLawyerName] = useState('');
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

  const loadData = async (start?: Date, end?: Date) => {
    try {
      setLoading(true);
      const [statsRes, profileData] = await Promise.all([
        fetchLawyerDashboardStats(start?.toISOString(), end?.toISOString()),
        getprofile()
      ]);
      if (statsRes?.success) {
        setStats(statsRes.data);
      }
      setLawyerName(profileData?.name || 'Counselor');
    } catch (error: any) {
      showToast("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(dateFilter.start, dateFilter.end);
  }, [dateFilter]);

  const handleFilterChange = (start?: Date, end?: Date) => {
    setDateFilter({ start, end });
  };

  const handleRangeSelect = (range: string) => {
    setActiveRange(range);
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-slate-800 rounded-full animate-spin"></div>
        <Sparkles className="w-6 h-6 text-slate-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-slate-600 font-medium">Assembling your insights...</p>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading && !stats) return <div className="p-8">{renderLoading()}</div>;
  if (!stats) return null;

  const totalBookings = Object.values(stats.bookingStats).reduce((a, b) => a + b, 0);
  const relevantForSuccess = stats.bookingStats.completed + stats.bookingStats.cancelled + stats.bookingStats.rejected;
  const successRate = relevantForSuccess > 0
    ? ((stats.bookingStats.completed / relevantForSuccess) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8"
      >
        {/* Hero Header */}
        <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 shadow-2xl border border-slate-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-slate-600/20 to-transparent rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium">Welcome Back,</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Hello, {lawyerName.split(' ')[0]}
                </h1>
              </div>
            </div>

            <p className="text-slate-300 text-lg max-w-2xl mb-6">
              Here's what's happening with your practice today. Your current success rate is <span className="text-white font-semibold">{successRate}%</span>.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-300">Upcoming</p>
                    <p className="text-xl font-bold text-white">{stats.bookingStats.confirmed}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-300">Pending</p>
                    <p className="text-xl font-bold text-white">{stats.bookingStats.pending}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={item} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <DashboardFilter
            onFilterChange={handleFilterChange}
            activeRange={activeRange}
            onRangeSelect={handleRangeSelect}
          />
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LawyerKPICard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 12.5, isUp: true }}
            color="teal"
            description="Revenue generated from consultations"
            delay={0.1}
          />

          <LawyerKPICard
            title="Total Consultations"
            value={totalBookings.toString()}
            icon={Users}
            trend={{ value: 8.2, isUp: true }}
            color="slate"
            description="All bookings across all statuses"
            delay={0.2}
          />

          <LawyerKPICard
            title="Completed Sessions"
            value={stats.bookingStats.completed.toString()}
            icon={Target}
            trend={{ value: 15.3, isUp: true }}
            color="slate"
            description="Successfully finished consultations"
            delay={0.3}
          />

          <LawyerKPICard
            title="Success Rate"
            value={`${successRate}%`}
            icon={TrendingUp}
            trend={{ value: Number(successRate) > 80 ? 5.1 : -2.3, isUp: Number(successRate) > 80 }}
            color={Number(successRate) > 80 ? 'teal' : 'amber'}
            description="Ratio of completed vs cancelled sessions"
            delay={0.5}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Earnings Performance</h2>
                <p className="text-slate-600">Visualization of your financial growth trend</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span className="text-sm font-medium text-teal-700">Performance Tracking Active</span>
              </div>
            </div>
            <div className="h-80">
              <RevenueChart data={stats.monthlyEarnings.map(m => ({ month: m.month, revenue: m.earnings }))} />
            </div>
          </motion.div>

          {/* Status Breakdown */}
          <motion.div variants={item} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Split</h3>
              <p className="text-slate-600 text-sm">Session status distribution</p>
            </div>

            <div className="h-64 mb-6">
              <BookingStatusChart data={stats.bookingStats} />
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                <span className="text-sm font-medium text-red-700">Cancelled</span>
                <span className="text-lg font-bold text-red-900">{stats.bookingStats.cancelled}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100">
                <span className="text-sm font-medium text-orange-700">Rejected</span>
                <span className="text-lg font-bold text-orange-900">{stats.bookingStats.rejected}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Action Footer */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl border border-slate-700 hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-700/30 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-emerald-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Financial Mastery</h3>
              <p className="text-slate-300 mb-6">
                Explore indepth reports of your earnings and download tax-ready statements.
              </p>
{/* 
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors duration-200 group/btn">
                Go to Earnings
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button> */}
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-100/50 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-slate-700" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">Consultation Insight</h3>
              <p className="text-slate-600 mb-6">
                Your average earning per session is <span className="font-bold text-slate-900">₹{(stats.totalEarnings / Math.max(stats.bookingStats.completed, 1)).toFixed(0)}</span>.
                {Number(successRate) > 85
                  ? " Excellent consistency! Maintain this to stay featured."
                  : " Focus on completing sessions to boost your profile visibility."}
              </p>

              {/* <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors duration-200 group/btn">
                View Appointment Analytics
                <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
              </button> */}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}