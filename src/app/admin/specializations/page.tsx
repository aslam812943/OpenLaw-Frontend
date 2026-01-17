'use client';

import React, { useEffect, useState } from 'react';
import { ReusableTable, Column } from '@/components/admin/shared/ReusableTable';
import { fetchSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '@/service/adminService';
import { showToast } from '@/utils/alerts';
import Swal from 'sweetalert2';
import { Edit2, Trash2, Plus, Info } from 'lucide-react';

interface Specialization {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

const SpecializationsPage = () => {
    const [data, setData] = useState<Specialization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState<Specialization | null>(null);

    const [formData, setFormData] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({ name: '' });

    const fetchData = async () => {
        try {
            const res = await fetchSpecializations();
            if (res.success) {
                setData(res.data);
            }
        } catch (error) {
            showToast('error', 'Failed to fetch specializations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Specialization) => {
        if (item) {
            setIsEditMode(true);
            setCurrentItem(item);
            setFormData({ name: item.name, description: item.description || '' });
        } else {
            setIsEditMode(false);
            setCurrentItem(null);
            setFormData({ name: '', description: '' });
        }
        setErrors({ name: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '' });
        setErrors({ name: '' });
    };

    const validate = () => {
        if (formData.name.trim().length < 3) {
            setErrors({ name: 'Name must be at least 3 characters long.' });
            return false;
        }
        setErrors({ name: '' });
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (isEditMode && currentItem) {
                const res = await updateSpecialization(currentItem.id, formData);
                if (res.success) {
                    showToast('success', 'Specialization updated successfully');
                    fetchData();
                    handleCloseModal();
                } else {
                    showToast('error', res.message || 'Failed to update');
                }
            } else {
                const res = await createSpecialization(formData);
                if (res.success) {
                    showToast('success', 'Specialization created successfully');
                    fetchData();
                    handleCloseModal();
                } else {
                    showToast('error', res.message || 'Failed to create');
                }
            }
        } catch (error: any) {
            showToast('error', error.message || 'An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await deleteSpecialization(id);
                if (res.success) {
                    showToast('success', 'Deleted successfully');
                    fetchData();
                } else {
                    showToast('error', res.message || 'Failed to delete');
                }
            } catch (error) {
                showToast('error', 'Failed to delete');
            }
        }
    };

    const columns: Column<Specialization>[] = [
        { header: 'Name', accessor: 'name', className: 'font-medium' },
        { header: 'Description', accessor: 'description', className: 'text-gray-500' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Specializations</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>

            <ReusableTable
                columns={columns}
                data={data}
                isLoading={loading}
                emptyMessage="No specializations found."
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Specialization' : 'Add Specialization'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="e.g. Criminal Law"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                                        rows={3}
                                        placeholder="Optional description..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                                >
                                    {isEditMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecializationsPage;
