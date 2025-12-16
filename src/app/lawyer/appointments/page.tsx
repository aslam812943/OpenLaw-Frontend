'use client'

import { getAppoiments, updateAppointmentStatus } from "@/service/lawyerService"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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

  const fetchAppointments = async () => {
    try {
      const response = await getAppoiments();
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Appointments</h1>
      {data.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{appointment.userName}</h2>
                  <p className="text-sm text-gray-500">{appointment.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {appointment.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span> {appointment.startTime} - {appointment.endTime}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fee:</span> ₹{appointment.consultationFee}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span> {appointment.desctiption}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Payment:</span> {appointment.paymentStatus}
                </p>
              </div>

              {appointment.status === 'pending' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
