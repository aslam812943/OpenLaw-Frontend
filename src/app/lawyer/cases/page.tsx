'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLawyerCases, Case } from '@/service/lawyerService';
import { showToast } from '@/utils/alerts';
import { Calendar, Clock, MessageSquare, Briefcase, Plus } from 'lucide-react';

const CasesPage = () => {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getLawyerCases();
        if (res?.success) {
          setCases(res.data || []);
        }
      } catch (error) {
        showToast('error', 'Failed to fetch cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleMessage = (userId: string) => {

    router.push(`/lawyer/chat?userId=${userId}`);
  };


  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">


      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Briefcase className="text-indigo-700" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Active Cases</h1>
                <p className="text-slate-500 mt-1">Manage your accepted appointments and client cases</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/lawyer/slotShedule')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              Manage Schedule
            </button>
          </div>

          {/* Cases List */}
          {loading ? (
            <div className="flex justify-center items-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="p-6 bg-slate-50 rounded-full mb-6">
                <Briefcase size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Cases</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                You don't have any accepted appointments yet. Check your appointments page to accept new requests.
              </p>
              <button
                onClick={() => router.push('/lawyer/appointments')}
                className="mt-6 text-teal-600 font-medium hover:text-teal-700 hover:underline"
              >
                Go to Appointments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {cases.map((clientCase) => (
                <div
                  key={clientCase.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">

                    {/* Client Info & Case Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{clientCase.userName}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full tracking-wide">
                          Active
                        </span>
                      </div>

                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {clientCase.desctiption || "No description provided."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <Calendar size={16} className="text-slate-400" />
                          <span>{clientCase.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <Clock size={16} className="text-slate-400" />
                          <span>{clientCase.startTime} - {clientCase.endTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center sm:flex-row md:flex-col gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <button
                        onClick={() => handleMessage(clientCase.userId)}
                        className="flex items-center justify-center gap-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 px-4 rounded-xl font-medium transition-colors"
                      >
                        <MessageSquare size={18} />
                        Message
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CasesPage;