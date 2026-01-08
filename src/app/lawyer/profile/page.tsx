'use client'

import { useEffect, useState, useRef } from "react"
import { getprofile, updateProfile, changePassword } from "@/service/lawyerService"
import { showToast } from "@/utils/alerts"
import {
    Mail,
    Phone,
    Briefcase,
    Globe,
    FileText,
    Award,
    Calendar,
    MapPin,
    User,
    DollarSign,
    Edit2,
    Save,
    X,
    Camera,
    Upload,
    Lock,
    Shield,
    ChevronDown,
    ChevronUp
} from "lucide-react"

export default function GetProfile() {
    interface ProfileData {
        barNumber: string;
        barAdmissionDate: string;
        yearsOfPractice: number;
        practiceAreas: string[];
        languages: string[];
        documentUrls: string[];
        address: string[];
        name: string;
        email: string;
        phone: string | number;
        profileImage?: string;
        bio?: string;
        isPassword?: boolean;
        consultationFee?: number;
    }

    const [data, setData] = useState<ProfileData>({
        barNumber: '',
        barAdmissionDate: '',
        yearsOfPractice: 0,
        practiceAreas: [],
        languages: [],
        documentUrls: [],
        address: [],
        name: '',
        email: '',
        phone: '',
        profileImage: '',
        bio: '',
        consultationFee: 0
    })

    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showChengePassword, setShowChengePassword] = useState(true)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        profileImage: null as File | null,
        bio: '',
        consultationFee: ''
    })
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswordSection, setShowPasswordSection] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const fetchProfile = async () => {
        try {
            const response = await getprofile();
            const profileData = response?.data;
            setData({
                barNumber: profileData?.barNumber,
                barAdmissionDate: profileData?.barAdmissionDate,
                yearsOfPractice: profileData?.yearsOfPractice,
                practiceAreas: profileData?.practiceAreas || [],
                languages: profileData?.languages || [],
                documentUrls: profileData?.documentUrls || [],
                address: profileData?.address || [],
                name: profileData?.name,
                email: profileData?.email,
                phone: profileData?.phone,
                profileImage: profileData?.profileImage,
                bio: profileData?.bio || '',
                consultationFee: profileData?.consultationFee || 0
            })
            setShowChengePassword(profileData.isPassword)


            const addressArray = profileData?.address || [];
            setFormData({
                name: profileData?.name || '',
                phone: profileData?.phone || '',
                street: addressArray[0] ?? '',
                city: addressArray[1] ?? '',
                state: addressArray[2] ?? '',
                pincode: addressArray[3] ?? '',
                profileImage: null,
                bio: profileData?.bio || '',
                consultationFee: profileData?.consultationFee?.toString() || '0'
            })
        } catch (error) {
            showToast("error", "Failed to fetch profile");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, profileImage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const validateForm = () => {
        if (formData.name.trim().length <= 3) {
            showToast("error", "Name must be greater than 3 characters")
            return false
        }
        if (formData.phone.toString().length !== 10) {
            showToast("error", "Phone number must be exactly 10 digits")
            return false
        }
        if (formData.street.trim().length < 4) {
            showToast("error", "Street address must be at least 4 characters")
            return false
        }
        if (formData.city.trim().length < 4) {
            showToast("error", "City must be at least 4 characters")
            return false
        }
        if (formData.state.trim().length < 4) {
            showToast("error", "State must be at least 4 characters")
            return false
        }
        if (formData.pincode.length < 4) {
            showToast("error", "Pincode must be at least 4 characters")
            return false
        }
        if (formData.bio.trim().length < 5) {
            showToast("error", "Bio must be at least 5 characters")
            return false
        }
        return true
    }

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append('name', formData.name);
            dataToSend.append('phone', formData.phone.toString());
            dataToSend.append('address', formData.street);
            dataToSend.append('city', formData.city);
            dataToSend.append('state', formData.state);
            dataToSend.append('pincode', formData.pincode);
            dataToSend.append('bio', formData.bio);
            dataToSend.append('consultationFee', formData.consultationFee);

            if (formData.profileImage) {
                dataToSend.append('profileImage', formData.profileImage);
            }

            await updateProfile(dataToSend);
            await fetchProfile();
            setIsEditing(false);
            showToast("success", "Profile updated successfully")
        } catch (error) {
            showToast("error", "Failed to update profile")
        } finally {
            setSaving(false);
        }
    }

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewImage(null);

        const addressArray = data.address || [];
        setFormData({
            name: data.name || '',
            phone: data.phone.toString() || '',
            street: addressArray[0] || '',
            city: addressArray[1] || '',
            state: addressArray[2] || '',
            pincode: addressArray[3] || '',
            profileImage: null,
            bio: data.bio || '',
            consultationFee: data.consultationFee?.toString() || '0'
        })
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const validatePasswordForm = () => {
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showToast("error", "All password fields are required")
            return false
        }
        if (passwordData.newPassword.length < 6) {
            showToast("error", "New password must be at least 6 characters")
            return false
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("error", "New passwords do not match")
            return false
        }
        return true
    }

    const handlePasswordSubmit = async () => {
        if (!validatePasswordForm()) return;

        setChangingPassword(true);
        try {
            await changePassword(passwordData.oldPassword, passwordData.newPassword);
            showToast("success", "Password changed successfully")
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
            setShowPasswordSection(false)
        } catch (error: any) {
            showToast("error", error.message || "Failed to change password")
        } finally {
            setChangingPassword(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-slate-500 font-medium">Loading your profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Hero / Cover Section */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-slate-900"></div>
                    <div className="absolute inset-x-0 h-full w-full bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
                    <div className="flex justify-end pt-6">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-all duration-300 border border-white/20 shadow-lg"
                            >
                                <Edit2 size={16} className="mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCancel}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-all duration-300 border border-white/20 shadow-lg"
                                    disabled={saving}
                                >
                                    <X size={16} className="mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center transition-all duration-300 shadow-lg shadow-teal-500/20"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <Save size={16} className="mr-2" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Panel: Profile Info & Quick Contacts */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 text-center pt-12 relative">
                                {/* Profile Image with Camera Overlay */}
                                <div className="relative inline-block mb-6">
                                    <div className="h-32 w-32 rounded-3xl bg-slate-50 p-1 shadow-2xl overflow-hidden ring-4 ring-white relative group">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                        ) : data.profileImage ? (
                                            <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <User size={56} />
                                            </div>
                                        )}

                                        {isEditing && (
                                            <div
                                                className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Camera className="text-white w-8 h-8 mb-1" />
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {isEditing ? (
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold text-slate-900 text-center border-b-2 border-teal-500/30 focus:border-teal-500 outline-none bg-transparent w-full transition-colors"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                ) : (
                                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{data.name || 'Lawyer Name'}</h1>
                                )}

                                <p className="text-teal-600 font-semibold text-sm flex items-center justify-center mb-6">
                                    <Award className="w-4 h-4 mr-1.5" />
                                    Bar No: {data.barNumber || 'N/A'}
                                </p>

                                <div className="space-y-4 text-left border-t border-slate-50 pt-6">
                                    <div className="flex items-center space-x-3 group">
                                        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-semibold text-slate-700">{data.email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 group">
                                        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phone Number</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full text-sm font-semibold text-slate-700 bg-transparent border-b border-teal-500/20 focus:border-teal-500 outline-none mt-0.5"
                                                    placeholder="Phone Number"
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-slate-700">{data.phone || 'N/A'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 group">
                                        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience</p>
                                            <p className="text-sm font-semibold text-slate-700">{data.yearsOfPractice} Years of Practice</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 group">
                                        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                            <DollarSign size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Min. Consultation Fee</p>
                                            {isEditing ? (
                                                <div className="flex items-center">
                                                    <span className="text-slate-400 mr-1">₹</span>
                                                    <input
                                                        type="number"
                                                        name="consultationFee"
                                                        value={formData.consultationFee}
                                                        onChange={handleInputChange}
                                                        className="w-full text-sm font-semibold text-slate-700 bg-transparent border-b border-teal-500/20 focus:border-teal-500 outline-none mt-0.5"
                                                        placeholder="Amount"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-sm font-semibold text-slate-700">₹{data.consultationFee || 0}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mr-3">
                                    <MapPin size={18} />
                                </div>
                                Address Details
                            </h2>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 block leading-none">Street</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                            placeholder="Street Address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 block leading-none">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 block leading-none">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 block leading-none">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                            placeholder="Pincode"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {data.address && data.address.length > 0 ? (
                                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-sm font-semibold text-slate-700 mb-1">{data.address[0]}</p>
                                            <p className="text-sm text-slate-500">
                                                {data.address[1]} {data.address[2] && `• ${data.address[2]}`}
                                            </p>
                                            <p className="text-sm font-mono text-slate-400 mt-2">{data.address[3]}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-slate-400 italic">No address provided</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Detailed Info, Skills, Docs */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Bio / Professional Summary */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mr-3">
                                    <FileText size={18} />
                                </div>
                                Professional Summary
                            </h2>

                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none min-h-[160px] transition-all"
                                    placeholder="Briefly describe your expertise, achievements, and legal philosophy..."
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed">
                                    {data.bio || 'Your professional biography will appear here once updated.'}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Practice Areas */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                                        <Shield size={18} />
                                    </div>
                                    Practice Areas
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.practiceAreas && data.practiceAreas.length > 0 ? (
                                        data.practiceAreas.map((area, index) => (
                                            <span key={index} className="px-3.5 py-1.5 bg-teal-50/50 text-teal-700 rounded-xl text-xs font-bold border border-teal-100/50 uppercase tracking-wide">
                                                {area}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">Not specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                                        <Globe size={18} />
                                    </div>
                                    Languages
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.languages && data.languages.length > 0 ? (
                                        data.languages.map((lang, index) => (
                                            <span key={index} className="px-3.5 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200/50 uppercase tracking-wide">
                                                {lang}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">Not specified</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-lg font-bold text-slate-900 mb-8 flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mr-3">
                                    <Upload size={18} />
                                </div>
                                Verification Documents
                            </h2>

                            {data.documentUrls && data.documentUrls.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {data.documentUrls.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5"
                                        >
                                            <div className="aspect-video relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                                {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                    <img
                                                        src={url}
                                                        alt={`Document ${index + 1}`}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <FileText className="w-12 h-12 text-slate-300 group-hover:text-teal-500 transition-colors duration-300" />
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold mt-2 font-mono">PDF Document</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                                            </div>
                                            <div className="p-4 border-t border-slate-50 flex items-center justify-between">
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-bold text-slate-700 truncate group-hover:text-teal-600 transition-colors">
                                                        Case Document #{index + 1}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Verified on Registration</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all">
                                                    <Globe size={14} />
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4">
                                        <FileText className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-bold mb-1">No documents uploaded</p>
                                    <p className="text-xs text-slate-400">Essential for lawyer verification and trust</p>
                                </div>
                            )}
                        </div>

                        {/* Security Section (Change Password) */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            {showChengePassword && (
                                <button
                                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                                    className="w-full p-8 flex items-center justify-between group"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <Lock size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-lg font-bold text-slate-900 leading-none">Password Settings</h2>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">Update your login security credentials</p>
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-lg transition-all ${showPasswordSection ? 'bg-purple-100 text-purple-700' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                        {showPasswordSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </button>
                            )}

                            {showPasswordSection && (
                                <div className="px-8 pb-8 pt-2 space-y-6 animate-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block pl-1">Current Password</label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={passwordData.oldPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block pl-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                                placeholder="Min 6 characters"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block pl-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                                placeholder="Repeat new password"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handlePasswordSubmit}
                                            disabled={changingPassword}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
                                        >
                                            {changingPassword ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            ) : (
                                                <Lock size={16} className="mr-2" />
                                            )}
                                            Update Security Credentials
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
