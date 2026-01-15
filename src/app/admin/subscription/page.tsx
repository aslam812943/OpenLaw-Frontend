'use client'

import { useState, useEffect, FormEvent } from 'react';
import { createSubscription, fetchSubscriptions, toggleSubscriptionStatus, updateSubscription } from '@/service/adminService';
import { showToast } from '@/utils/alerts';
import { Plus, List, ArrowLeft, Loader2, DollarSign, Clock, Percent, ShieldCheck, Power, PowerOff, Edit2 } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

type DurationUnit = 'month' | 'year';

interface SubscriptionPlan {
  id: string;
  planName: string;
  duration: number;
  durationUnit: string;
  price: number;
  commissionPercent: number;
  isActive: boolean;
}

const Subscription = () => {
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 3;

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('month');
  const [price, setPrice] = useState<number>(0);
  const [commissionPercent, setCommissionPercent] = useState<number>(0);

  useEffect(() => {
    loadSubscriptions(currentPage);
  }, [currentPage]);

  const loadSubscriptions = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await fetchSubscriptions(page, limit);
      if (res.success) {
        setPlans(res.data.plans || res.data);
        setTotalItems(res.data.total || (res.data.length > 0 ? res.data.length : 0));
        setCurrentPage(page);
      }
    } catch (error: any) {
      showToast('error', error.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!planName.trim()) {
      showToast('warning', 'Plan name is required');
      return;
    }
    if (duration <= 0) {
      showToast('warning', 'Duration must be greater than 0');
      return;
    }

    if (price < 50) {
      showToast('warning', 'Price must be at least 50');
      return;
    }
    if (commissionPercent < 0 || commissionPercent > 50) {
      showToast('warning', 'Commission must be between 0 and 50%');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { planName, duration, durationUnit, price, commissionPercent };

      let res;
      if (isEditing && editingId) {
        res = await updateSubscription(editingId, payload);
      } else {
        res = await createSubscription(payload);
      }

      if (res.success) {
        showToast('success', isEditing ? 'Subscription plan updated successfully' : 'Subscription plan created successfully');
        resetForm();
        setShowForm(false);
        loadSubscriptions(currentPage);
      }
    } catch (error: any) {
      showToast('error', error.message || `Failed to ${isEditing ? 'update' : 'create'} subscription`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingId(plan.id);
    setIsEditing(true);
    setPlanName(plan.planName);
    setDuration(plan.duration);
    setDurationUnit(plan.durationUnit as DurationUnit);
    setPrice(plan.price);
    setCommissionPercent(plan.commissionPercent);
    setShowForm(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      const newStatus = !currentStatus;
      const res = await toggleSubscriptionStatus(id, newStatus);
      if (res.success) {
        showToast('success', res.message);
        setPlans(plans.map(p => p.id === id ? { ...p, isActive: newStatus } : p));
      }
    } catch (error: any) {
      showToast('error', error.message || 'Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const resetForm = () => {
    setPlanName('');
    setDuration(1);
    setDurationUnit('month');
    setPrice(0);
    setCommissionPercent(0);
    setIsEditing(false);
    setEditingId(null);
  };

  if (loading && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="mt-4 text-slate-400 font-medium">Loading subscription plans...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
            Subscription Management
          </h1>
          <p className="text-slate-400 mt-1">Manage and create billing plans for lawyers</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            }
            setShowForm(!showForm);
          }}
          className={`group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${showForm
            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40 hover:-translate-y-0.5'
            }`}
        >
          {showForm ? (
            <>
              <List className="w-5 h-5" />
              <span>Back to Plans</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Plan</span>
            </>
          )}
        </button>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`group relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/10 ${plan.isActive ? 'border-slate-800 hover:border-teal-500/50' : 'border-red-900/30 opacity-75 hover:opacity-100'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${plan.isActive ? 'bg-teal-500/10' : 'bg-red-500/10'}`}>
                  <ShieldCheck className={`w-6 h-6 ${plan.isActive ? 'text-teal-500' : 'text-red-500'}`} />
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-bold ${plan.isActive ? 'text-white' : 'text-slate-400'}`}>${plan.price}</span>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Revenue</p>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 mb-2">
                <h3 className={`text-xl font-bold transition-colors ${plan.isActive ? 'text-white group-hover:text-teal-400' : 'text-slate-400'}`}>
                  {plan.planName}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-all transform active:scale-95"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    disabled={togglingId === plan.id}
                    onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                    className={`p-2 rounded-lg transition-all transform active:scale-95 ${plan.isActive
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      : 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20'
                      }`}
                    title={plan.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {togglingId === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : plan.isActive ? (
                      <PowerOff className="w-5 h-5" />
                    ) : (
                      <Power className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <Clock className={`w-4 h-4 ${plan.isActive ? 'text-teal-500/70' : 'text-slate-600'}`} />
                  <span>{plan.duration} {plan.durationUnit}{plan.duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Percent className={`w-4 h-4 ${plan.isActive ? 'text-teal-500/70' : 'text-slate-600'}`} />
                  <span>{plan.commissionPercent}% Platform Commission</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center text-sm">
                <span className="text-slate-500">ID: {plan.id.substring(0, 8)}...</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.isActive ? 'bg-teal-500/10 text-teal-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <div className="inline-flex p-4 bg-slate-800/50 rounded-full mb-4">
                <List className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">No active plans found</h3>
              <p className="text-slate-500 mt-2">Start by creating your first subscription plan.</p>
            </div>
          )}
          {plans.length > 0 && (
            <div className="col-span-full mt-8">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                limit={limit}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Subscription Plan' : 'New Subscription Plan'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Plan Name</label>
              <input
                type="text"
                required
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. Premium Annual Practice"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Duration</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-1/3 bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
                    className="w-2/3 bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none"
                  >
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Price ($)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    placeholder="50.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Admin Commission (%)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Percent className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  required
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(Number(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="e.g. 15"
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">Percentage taken from lawyer's booking earnings (Max 50%)</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg border border-teal-500/20 hover:from-teal-500 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isEditing ? 'Update Plan' : 'Create Plan'}</span>
                  {isEditing ? (
                    <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Subscription;
