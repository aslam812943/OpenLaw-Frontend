"use client";

import React, { useEffect, useState } from 'react';
import { getUserAppointments, cancelAppointment } from '../../../service/userService';

import CancelAppointmentModal from '../../../components/CancelAppointmentModal';

interface Appointment {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    consultationFee: number;
    description?: string;
    cancellationReason?: string;
    lawyerId: string;
    lawyerName?: string;
}

import { useRouter } from 'next/navigation';

const UserAppointmentsPage = () => {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            const data = await getUserAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancelClick = (id: string) => {
        setSelectedAppointmentId(id);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async (reason: string) => {
        if (!selectedAppointmentId) return;

        try {
            await cancelAppointment(selectedAppointmentId, reason);

            fetchAppointments()
        } catch (error) {
            console.error("Error cancelling appointment:", error);
        } finally {
            setIsModalOpen(false);
            setSelectedAppointmentId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
            {appointments.length === 0 ? (
                <p className="text-gray-600">No appointments found.</p>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appointment) => {
                        const isCancellable = appointment.status === 'pending' || appointment.status === 'confirmed';
                        return (
                            <div key={appointment.id} className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Appointment Details</h3>
                                        {appointment.lawyerName && (
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Lawyer:</span>{' '}
                                                <span
                                                    onClick={() => {
                                                       
                                                        router.push(`/user/lawyers/${appointment.lawyerId}`);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                                                >
                                                    {appointment.lawyerName}
                                                   
                                                </span>
                                            </p>
                                        )}
                                        <p className="text-gray-600"><span className="font-medium">Date:</span> {appointment.date}</p>
                                        <p className="text-gray-600"><span className="font-medium">Time:</span> {appointment.startTime} - {appointment.endTime}</p>
                                        <p className="text-gray-600"><span className="font-medium">Fee:</span> ${appointment.consultationFee}</p>
                                        <p className="text-gray-600"><span className="font-medium">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-sm ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </p>
                                        {appointment.description && (
                                            <p className="text-gray-600 mt-2"><span className="font-medium">Description:</span> {appointment.description}</p>
                                        )}
                                        {appointment.cancellationReason && (
                                            <p className="text-red-600 mt-2"><span className="font-medium">Cancellation Reason:</span> {appointment.cancellationReason}</p>
                                        )}
                                    </div>
                                    {isCancellable && (
                                        <button
                                            onClick={() => handleCancelClick(appointment.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <CancelAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default UserAppointmentsPage;
