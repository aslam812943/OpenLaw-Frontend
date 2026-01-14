'use client'


import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { scheduleCreate, scheduleUpdate, fetchAllRules, deleteRule } from '@/service/lawyerService';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { showToast } from '@/utils/alerts';

interface SchedulingRule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  availableDays: string[];
  bufferTime: string;
  slotDuration: string;
  maxBookings: string;
  sessionType: string;
  consultationFee: number;
  exceptionDays: string[];
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function daysBetween(a: Date, b: Date) {
  const ms = 1000 * 60 * 60 * 24;
  return Math.round((+b - +a) / ms);
}

function isSameOrNextMonthAllowed(start: Date, end: Date) {
  const sMonth = start.getMonth();
  const eMonth = end.getMonth();
  const sYear = start.getFullYear();
  const eYear = end.getFullYear();

  if (sYear === eYear && sMonth === eMonth) return true;

  const monthDiff = (eYear - sYear) * 12 + (eMonth - sMonth);
  if (monthDiff !== 1) return false;
  return start.getDate() === end.getDate();
}

export default function App() {
  const [rules, setRules] = useState<SchedulingRule[]>([]);
  const lawyerId = useSelector((state: RootState) => state.lawyer?.id);
  useEffect(() => {
    async function loadRules() {
      try {
        if (!lawyerId) {
          showToast('info', 'lawyer id missing')
          return
        }
        const response = await fetchAllRules();

        if (!response?.data) return;


        const rulesData = Array.isArray(response.data) ? response.data : [];


        const mappedRules = rulesData.map((item: any) => {

          const rule = item['0'] || item;

          return {
            id: rule.id || rule._id,
            title: rule.title,
            startTime: rule.startTime,
            endTime: rule.endTime,
            startDate: rule.startDate,
            endDate: rule.endDate,
            availableDays: rule.availableDays || [],
            bufferTime: String(rule.bufferTime),
            slotDuration: String(rule.slotDuration),
            consultationFee: Number(rule.consultationFee),
            maxBookings: String(rule.maxBookings),
            sessionType: rule.sessionType,
            exceptionDays: rule.exceptionDays || []
          };
        });

        setRules(mappedRules);
      } catch (err) {

        showToast("error", "Failed to fetch rules");
      }
    }

    loadRules();
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<SchedulingRule, 'id'>>({
    title: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    availableDays: [],
    bufferTime: '',
    slotDuration: '',
    maxBookings: '1',
    sessionType: 'Online Video Call',
    exceptionDays: [],
    consultationFee: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Live validation functions
  const validateTitle = (value: string) => {
    if (!value || value.trim().length < 4) {
      return 'Title is required and must be at least 4 characters';
    }
    return '';
  };

  const validateStartTime = (value: string) => {
    if (!value) return 'Start time is required';
    return '';
  };

  const validateEndTime = (value: string) => {
    if (!value) return 'End time is required';
    return '';
  };

  const validateStartDate = (value: string) => {
    if (!value) return 'Start date is required';
    const now = new Date();
    const start = new Date(value);
    if (+start < +new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      return 'Start date cannot be in the past';
    }
    return '';
  };

  const validateEndDate = (value: string, startDate: string) => {
    if (!value) return 'End date is required';

    const start = new Date(startDate);
    const end = new Date(value);

    if (+end < +start) {
      return 'End date must be same or after start date';
    }

    // const daysDiff = daysBetween(start, end) + 1;
    // if (daysDiff > 31) {
    //   return 'Rule duration may not exceed 31 days';
    // }

    // if (!isSameOrNextMonthAllowed(start, end)) {
    //   return 'End date must be in same month or same day of next month';
    // }

    return '';
  };

  const validateBufferTime = (value: string) => {
    if (!value) return 'Buffer time is required';
    const bufferNum = Number(value);
    if (isNaN(bufferNum) || bufferNum < 5 || bufferNum > 60) {
      return 'Buffer time must be between 5 and 60 minutes';
    }
    return '';
  };

  const validateSlotDuration = (value: string) => {
    if (!value) return 'Slot duration is required';
    const slotNum = Number(value);
    if (isNaN(slotNum) || slotNum < 30 || slotNum > 120) {
      return 'Slot duration must be between 30 and 120 minutes';
    }
    return '';
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
    if (errors.availableDays) setErrors(prev => ({ ...prev, availableDays: '' }));
  };

  const handleExceptionDateAdd = (date: string) => {
    if (!date) return;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      showToast('error', 'Invalid exception date');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      showToast('error', 'Set start and end dates before adding exception days');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (+d < +start || +d > +end) {
      showToast('error', 'Exception date must be inside start and end date range');
      return;
    }

    if (formData.exceptionDays.includes(date)) {
      showToast('error', 'This exception date is already added');
      return;
    }

    setFormData(prev => ({ ...prev, exceptionDays: [...prev.exceptionDays, date].sort() }));
    if (errors.exceptionDays) setErrors(prev => ({ ...prev, exceptionDays: '' }));
  };

  const handleExceptionDateRemove = (date: string) => {
    setFormData(prev => ({ ...prev, exceptionDays: prev.exceptionDays.filter(d => d !== date) }));
  };

  function validateAll() {
    const e: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 4) {
      e.title = 'Title is required and must be at least 4 characters';
    }
    if (!formData.startTime) e.startTime = 'Start time is required';
    if (!formData.endTime) e.endTime = 'End time is required';
    if (!formData.startDate) e.startDate = 'Start date is required';
    if (!formData.endDate) e.endDate = 'End date is required';
    if (!formData.availableDays || formData.availableDays.length === 0) {
      e.availableDays = 'Select at least one available day';
    }
    if (!formData.bufferTime) e.bufferTime = 'Buffer time is required';
    if (!formData.slotDuration) e.slotDuration = 'Slot duration is required';
    if (!formData.maxBookings) e.maxBookings = 'Max bookings required';
    if (!formData.sessionType) e.sessionType = 'Session type required';
    if (!formData.consultationFee || formData.consultationFee <= 0) {
      e.consultationFee = 'Consultation Fee must be greater than 0';
    }
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;
    if (formData.startDate) start = new Date(formData.startDate);
    if (formData.endDate) end = new Date(formData.endDate);

    if (start && +start < +new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      e.startDate = 'Start date cannot be in the past';
    }

    if (start && end && +end < +start) {
      e.endDate = 'End date must be same or after start date';
    }

    // if (start && end) {
    //   const daysDiff = daysBetween(start, end) + 1;
    //   if (daysDiff > 31) {
    //     e.endDate = 'Rule duration may not exceed 31 days';
    //   }
    //   if (!isSameOrNextMonthAllowed(start, end)) {
    //     e.endDate = 'End date must be in same month or same day of next month ';
    //   }
    // }

    const bufferNum = Number(formData.bufferTime);
    if (isNaN(bufferNum) || bufferNum < 5 || bufferNum > 60) {
      e.bufferTime = 'Buffer time must be between 5 and 60 minutes';
    }

    const slotNum = Number(formData.slotDuration);
    if (isNaN(slotNum) || slotNum < 30 || slotNum > 120) {
      e.slotDuration = 'Slot duration must be between 30 and 120 minutes';
    }

    if (Number(formData.maxBookings) !== 1) {
      e.maxBookings = 'Max bookings must be 1';
    }

    if (formData.sessionType !== 'Online Video Call') {
      e.sessionType = 'Session type must be "Online Video Call"';
    }

    if (formData.exceptionDays.length > 0 && start && end) {
      for (const ex of formData.exceptionDays) {
        const d = new Date(ex);
        if (isNaN(d.getTime()) || +d < +start || +d > +end) {
          e.exceptionDays = 'All exception days must be between start and end date';
          break;
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleCreateRule = async () => {
    if (!lawyerId) {
      showToast('error', 'Lawyer ID missing. Please login again.');
      return;
    }

    if (!validateAll()) {
      showToast('error', 'Please fix validation errors first.');
      return;
    }

    const newRule: SchedulingRule = {
      id: Date.now().toString(),
      ...formData
    };

    try {
      const res = await scheduleCreate(newRule);
      showToast('success', res?.data?.message || 'Rule created successfully');


      const response = await fetchAllRules();
      if (response?.data) {
        const rulesData = Array.isArray(response.data) ? response.data : [];

        const mappedRules = rulesData.map((item: any) => {
          const rule = item['0'] || item;
          return {
            id: rule.id || rule._id,
            title: rule.title,
            startTime: rule.startTime,
            endTime: rule.endTime,
            startDate: rule.startDate,
            endDate: rule.endDate,
            availableDays: rule.availableDays || [],
            bufferTime: String(rule.bufferTime),
            slotDuration: String(rule.slotDuration),
            maxBookings: String(rule.maxBookings),
            sessionType: rule.sessionType,
            exceptionDays: rule.exceptionDays || [],
            consultationFee: rule.consultationFee || 0
          };
        });
        setRules(mappedRules);
      }

      resetForm();

    } catch (err: any) {

      showToast('error', err.message || 'Failed to create rule');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      availableDays: [],
      bufferTime: '',
      slotDuration: '',
      maxBookings: '1',
      sessionType: 'Online Video Call',
      exceptionDays: [],
      consultationFee: 0
    });
    setErrors({});
    setIsCreating(false);
    setEditingId(null);
  };

  const handleUpdateRule = async () => {
    if (!editingId) return;

    if (!validateAll()) {
      showToast('error', 'Please fix validation errors');
      return;
    }

    try {

      await scheduleUpdate(formData, editingId);

      showToast('success', 'Rule updated successfully');


      setRules(prev =>
        prev.map(rule =>
          rule.id === editingId ? { id: editingId, ...formData } : rule
        )
      );

      resetForm();

    } catch (err: any) {
      console.error('Update rule failed', err);
      showToast('error', err?.response?.data?.message || 'Update failed');
    }
  };

  const handleEditRule = (rule: SchedulingRule) => {
    setEditingId(rule.id);
    setFormData({
      title: rule.title,
      startTime: rule.startTime,
      endTime: rule.endTime,
      startDate: rule.startDate,
      endDate: rule.endDate,
      availableDays: rule.availableDays,
      bufferTime: rule.bufferTime,
      slotDuration: rule.slotDuration,
      maxBookings: rule.maxBookings,
      sessionType: rule.sessionType,
      exceptionDays: rule.exceptionDays,
      consultationFee: rule.consultationFee ?? 0
    });
    setIsCreating(true);
  };

  const handleDeleteRule = async (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    await deleteRule(id)
    showToast('success', 'Rule delete successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Lawyer Scheduling</h1>
            <p className="text-gray-600">Manage your availability and scheduling rules for client consultations.</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Scheduling Rules</h2>
                <p className="text-sm text-gray-600">Manage your availability rules and consultation settings.</p>
              </div>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add
                </button>
              )}
            </div>

            {isCreating && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  {editingId ? 'Edit Scheduling Rule' : 'Create New Scheduling Rule'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rule Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, title: value });
                        const error = validateTitle(value);
                        setErrors((prev) => ({ ...prev, title: error }));
                      }}
                      placeholder="e.g., Regular Office Hours"
                      className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock size={14} className="inline mr-1" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, startTime: value });
                          const error = validateStartTime(value);
                          setErrors((prev) => ({ ...prev, startTime: error }));
                        }}
                        className={`w-full px-3 py-2 border ${errors.startTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock size={14} className="inline mr-1" />
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, endTime: value });
                          const error = validateEndTime(value);
                          setErrors((prev) => ({ ...prev, endTime: error }));
                        }}
                        className={`w-full px-3 py-2 border ${errors.endTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={14} className="inline mr-1" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, startDate: value });
                          const error = validateStartDate(value);
                          setErrors((prev) => ({ ...prev, startDate: error }));
                          if (formData.endDate) {
                            const endError = validateEndDate(formData.endDate, value);
                            setErrors((prev) => ({ ...prev, endDate: endError }));
                          }
                        }}
                        className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={14} className="inline mr-1" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, endDate: value });
                          const error = validateEndDate(value, formData.startDate);
                          setErrors((prev) => ({ ...prev, endDate: error }));
                        }}
                        className={`w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Days
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {daysOfWeek.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.availableDays.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    {errors.availableDays && <p className="text-red-500 text-sm mt-1">{errors.availableDays}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buffer Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.bufferTime}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, bufferTime: value });
                          const error = validateBufferTime(value);
                          setErrors(prev => ({ ...prev, bufferTime: error }));
                        }}
                        placeholder="e.g., 15"
                        className={`w-full px-3 py-2 border ${errors.bufferTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        min={5}
                        max={60}
                      />
                      {errors.bufferTime && <p className="text-red-500 text-sm mt-1">{errors.bufferTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slot Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.slotDuration}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, slotDuration: value });
                          const error = validateSlotDuration(value);
                          setErrors(prev => ({ ...prev, slotDuration: error }));
                        }}
                        placeholder="e.g., 60"
                        className={`w-full px-3 py-2 border ${errors.slotDuration ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        min={30}
                        max={120}
                      />
                      {errors.slotDuration && <p className="text-red-500 text-sm mt-1">{errors.slotDuration}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Bookings
                      </label>
                      <input
                        type="number"
                        value={formData.maxBookings}
                        readOnly
                        title="Locked to 1"
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                      />
                      {errors.maxBookings && <p className="text-red-500 text-sm mt-1">{errors.maxBookings}</p>}
                    </div>



                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Type
                      </label>
                      <input
                        type="text"
                        value={formData.sessionType}
                        readOnly
                        title="Locked to Online Video Call"
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                      />

                      {errors.sessionType && <p className="text-red-500 text-sm mt-1">{errors.sessionType}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee
                      </label>
                      <input
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, consultationFee: Number(value) });
                          // const error = validateBufferTime(value);
                          // setErrors(prev => ({ ...prev, bufferTime: error }));
                        }}
                        title="Consultation Fee"
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                      />

                      {errors.consultationFee && <p className="text-red-500 text-sm mt-1">{errors.consultationFee}</p>}
                    </div>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exception Days (Exclusions)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        id="exceptionDateInput"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Select date"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('exceptionDateInput') as HTMLInputElement;
                          if (input && input.value) {
                            handleExceptionDateAdd(input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>

                    {formData.exceptionDays.length > 0 && (
                      <div className="flex gap-2 flex-wrap p-2 bg-gray-100 rounded-md">
                        {formData.exceptionDays.map(date => (
                          <div key={date} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                            {date}
                            <button onClick={() => handleExceptionDateRemove(date)} className="ml-1 text-blue-700 hover:text-red-600 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.exceptionDays && <p className="text-red-500 text-sm mt-1">{errors.exceptionDays}</p>}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingId ? handleUpdateRule : handleCreateRule}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {editingId ? 'Update Rule' : 'Create Rule'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {rules.map(rule => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{rule.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        Active
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* <button onClick={() => handleEditRule(rule)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={16} />
                      </button> */}
                      <button onClick={() => handleDeleteRule(rule.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 text-gray-900 font-medium">{rule.startTime} - {rule.endTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Dates:</span>
                      <span className="ml-2 text-gray-900 font-medium">{rule.startDate} to {rule.endDate}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Available Days:</span>
                      <div className="flex gap-2 mt-1">
                        {rule.availableDays.map(day => (
                          <span key={day} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{day}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Buffer:</span>
                      <span className="ml-2 text-gray-900 font-medium">{rule.bufferTime} min</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Slot Duration:</span>
                      <span className="ml-2 text-gray-900 font-medium">{rule.slotDuration} min</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Bookings:</span>
                      <span className="ml-2 text-gray-900 font-medium">{rule.maxBookings}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Session Type:</span>
                      <span className="ml-2 text-gray-900 font-medium">{rule.sessionType}</span>
                    </div>
                    {rule.exceptionDays && rule.exceptionDays.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Exception Days:</span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {rule.exceptionDays.map(date => (
                            <span key={date} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">{date}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}