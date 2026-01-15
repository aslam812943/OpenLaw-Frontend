'use client'

import { getAppoiments, updateAppointmentStatus } from "@/service/lawyerService"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { showToast } from "@/utils/alerts"
import { ReusableTable, Column } from "@/components/admin/shared/ReusableTable"
import { Info, CheckCircle, XCircle, CheckCheck, Clock } from "lucide-react"
import Swal from "sweetalert2"
import CompleteAppointmentModal from "@/components/lawyer/CompleteAppointmentModal"

interface Appointment {
  id: string;
  userId: string;
  date: string;
  consultationFee: number;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  desctiption: string;
  userName: string;
}

const Appointments = () => {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await getAppoiments();
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      showToast("error", "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string, appointment?: Appointment) => {
    if (status === 'completed' && appointment) {
      setSelectedAppointment(appointment);
      setIsModalOpen(true);
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to mark this appointment as ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'rejected' ? '#ef4444' : '#10b981',
      confirmButtonText: 'Yes, proceed!'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const confirmCompletion = async (feedback: string) => {
    if (!selectedAppointment) return;

    setIsSubmitting(true);
    try {
      await updateAppointmentStatus(selectedAppointment.id, 'completed', feedback);
      toast.success("Appointment completed successfully!");
      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to complete appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDescription = (desc: string) => {
    Swal.fire({
      title: 'Appointment Description',
      text: desc || 'No description provided.',
      icon: 'info',
      confirmButtonColor: '#0d9488'
    });
  };

  const columns: Column<Appointment>[] = [
    {
      header: "Client Name",
      accessor: "userName",
      className: "font-medium text-slate-900"
    },
    {
      header: "Date",
      accessor: "date",
      className: "text-slate-600"
    },
    {
      header: "Time",
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 text-teal-500" />
          <span>{row.startTime} - {row.endTime}</span>
        </div>
      )
    },
    {
      header: "Fee",
      render: (row) => <span className="font-semibold text-slate-900">₹{row.consultationFee}</span>
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${row.status === 'pending' ? 'bg-amber-100 text-amber-700' :
          row.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
            row.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
              'bg-red-100 text-red-700'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Payment",
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium ${row.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
          {row.paymentStatus}
        </span>
      )
    },
    {
      header: "Desc",
      render: (row) => (
        <button
          onClick={() => showDescription(row.desctiption)}
          className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
          title="Show Description"
        >
          <Info className="w-5 h-5" />
        </button>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex gap-2 justify-end">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(row.id, 'confirmed')}
                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                title="Accept"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStatusUpdate(row.id, 'rejected')}
                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                title="Reject"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
          {row.status === 'confirmed' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'completed', row)}
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              MARK COMPLETED
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and monitor your legal consultations</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700">{data.length} Total Bookings</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <ReusableTable
            columns={columns}
            data={data}
            isLoading={loading}
            emptyMessage="No consultations scheduled yet."
          />
        </div>
      </div>

      <CompleteAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCompletion}
        appointment={selectedAppointment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Appointments;
