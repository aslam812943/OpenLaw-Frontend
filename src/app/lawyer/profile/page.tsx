'use client'

import { useEffect, useState, useRef } from "react"
import { getprofile, updateProfile, changePassword, fetchSpecializations } from "@/service/lawyerService";
import { showToast } from "@/utils/alerts"
import { useDispatch } from "react-redux"
import { setLawyerData } from "@/redux/lawyerSlice"
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
    Eye,
    EyeOff,
    Shield,
    ChevronDown,
    ChevronUp,
    Gavel,
    Heart,
    Home,
    Building,
    Landmark,
    Plane,
    TrendingUp,
    Leaf,
    Cross,
    UserCheck,
    Music,
    Ship,
    ScrollText,
    Book
} from "lucide-react"

interface Specialization {
    id: string;
    name: string;
    isActive: boolean;
}

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
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showChengePassword, setShowChengePassword] = useState(true)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        bio: "",
        consultationFee: "",
        practiceAreas: [] as string[],
        languages: [] as string[],
        profileImage: null as File | null
    });

    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [loadingSpecs, setLoadingSpecs] = useState(false);

    const languageOptions = [
        { value: "english", label: "English" },
        { value: "malayalam", label: "Malayalam" },
        { value: "hindi", label: "Hindi" },
        { value: "tamil", label: "Tamil" },
    ];

    const getIconForArea = (areaName: string) => {
        const lower = areaName.toLowerCase();
        if (lower.includes("corporate")) return Briefcase;
        if (lower.includes("criminal")) return Gavel;
        if (lower.includes("family")) return Heart;
        if (lower.includes("property") || lower.includes("real estate")) return Home;
        if (lower.includes("civil")) return User;
        if (lower.includes("labor") || lower.includes("employment")) return Building;
        if (lower.includes("consumer")) return Shield;
        if (lower.includes("tax")) return DollarSign;
        if (lower.includes("intellectual") || lower.includes("ip")) return FileText;
        if (lower.includes("constitutional")) return Landmark;
        if (lower.includes("international")) return Globe;
        if (lower.includes("immigration")) return Plane;
        if (lower.includes("securities") || lower.includes("finance")) return TrendingUp;
        if (lower.includes("environment")) return Leaf;
        if (lower.includes("health") || lower.includes("medical")) return Cross;
        if (lower.includes("rights")) return UserCheck;
        if (lower.includes("entertainment") || lower.includes("media")) return Music;
        if (lower.includes("maritime")) return Ship;
        if (lower.includes("bankrupt")) return DollarSign;
        if (lower.includes("estate") || lower.includes("probate")) return ScrollText;
        return Book;
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswordSection, setShowPasswordSection] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const fetchProfileData = async () => {
        try {
            const profileData = await getprofile();
            setData({
                barNumber: profileData?.barNumber,
                barAdmissionDate: profileData?.barAdmissionDate,
                yearsOfPractice: profileData?.yearsOfPractice,
                practiceAreas: profileData?.practiceAreas || [],
                languages: profileData?.languages || [],
                documentUrls: profileData?.documentUrls || [],
                address: profileData?.Address ? [
                    profileData.Address.address,
                    profileData.Address.city,
                    profileData.Address.state,
                    String(profileData.Address.pincode)
                ] : [],
                name: profileData?.name,
                email: profileData?.email,
                phone: profileData?.phone,
                profileImage: profileData?.profileImage,
                bio: profileData?.bio || '',
                consultationFee: profileData?.consultationFee || 0
            })

            dispatch(setLawyerData({
                id: profileData.id || null,
                email: profileData.email || null,
                name: profileData.name || null,
                phone: profileData.phone || null,
                role: 'lawyer',
                hasSubmittedVerification: !!profileData.hasSubmittedVerification,
                profileImage: profileData.profileImage || null
            }))

            setShowChengePassword(profileData.isPassword || false)

            const addr = profileData?.Address;
            setFormData({
                name: profileData?.name || '',
                email: profileData?.email || '',
                phone: profileData?.phone?.toString() || '',
                street: addr?.address || '',
                city: addr?.city || '',
                state: addr?.state || '',
                pincode: addr?.pincode?.toString() || '',
                bio: profileData?.bio || '',
                consultationFee: profileData?.consultationFee?.toString() || '0',
                practiceAreas: profileData?.practiceAreas || [],
                languages: profileData?.languages || [],
                profileImage: null
            })
        } catch (error) {
            showToast("error", "Failed to fetch profile");
        } finally {
            setLoading(false)
        }
    };

    const loadSpecializations = async () => {
        setLoadingSpecs(true);
        try {
            const response = await fetchSpecializations();
            if (response.success && response.data) {
                setSpecializations(response.data);
            }
        } catch (error) {
            console.error("Failed to load specializations", error);
        } finally {
            setLoadingSpecs(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
        loadSpecializations();
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith('image/')) {
                showToast("error", "Please select an image file (jpg, png, etc.)");
                return;
            }

            setFormData(prev => ({ ...prev, profileImage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const validateForm = () => {
        const name = formData.name.trim();
        const phone = formData.phone.toString().trim();
        const street = formData.street.trim();
        const city = formData.city.trim();
        const state = formData.state.trim();
        const pincode = formData.pincode.trim();
        const bio = formData.bio.trim();
        const fee = Number(formData.consultationFee);

        if (name.length <= 2) {
            showToast("error", "Name must be greater than 2 characters")
            return false
        }
        if (!/^[a-zA-Z]/.test(name)) {
            showToast("error", "Name must start with a letter")
            return false
        }
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            showToast("error", "Phone number must be exactly 10 digits")
            return false
        }
        if (street.length < 2) {
            showToast("error", "Street address must be at least 2 characters")
            return false
        }
        if (city.length < 2) {
            showToast("error", "City must be at least 2 characters")
            return false
        }
        if (state.length < 2) {
            showToast("error", "State must be at least 2 characters")
            return false
        }
        if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
            showToast("error", "Pincode must be exactly 6 digits")
            return false
        }

        if (isNaN(fee) || fee < 0 || formData.consultationFee.toString().trim() === "") {
            showToast("error", "Consultation fee is required")
            return false
        }

        if (!previewImage && !data.profileImage && !formData.profileImage) {
            showToast("error", "Profile photo is required")
            return false
        }

        if (bio.length < 5) {
            showToast("error", "Bio must be at least 5 characters")
            return false
        }
        if (bio.length > 1000) {
            showToast("error", "Bio must not exceed 1000 characters")
            return false
        }

        if (formData.practiceAreas.length === 0) {
            showToast("error", "At least one practice area is required")
            return false
        }

        if (formData.languages.length === 0) {
            showToast("error", "At least one language is required")
            return false
        }

        return true
    }

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append('name', formData.name.trim());
            dataToSend.append('phone', formData.phone.toString().trim());
            dataToSend.append('address', formData.street.trim());
            dataToSend.append('city', formData.city.trim());
            dataToSend.append('state', formData.state.trim());
            dataToSend.append('pincode', formData.pincode.trim());
            dataToSend.append('bio', formData.bio.trim());
            dataToSend.append('consultationFee', formData.consultationFee.toString().trim());
            dataToSend.append('practiceAreas', JSON.stringify(formData.practiceAreas));
            dataToSend.append('languages', JSON.stringify(formData.languages));

            if (formData.profileImage) {
                dataToSend.append('profileImage', formData.profileImage);
            }

            await updateProfile(dataToSend);
            await fetchProfileData();
            setIsEditing(false);
            showToast("success", "Profile updated successfully")
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
            showToast("error", errorMessage)
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
            email: data.email || '',
            phone: data.phone.toString() || '',
            street: addressArray[0] || '',
            city: addressArray[1] || '',
            state: addressArray[2] || '',
            pincode: addressArray[3] || '',
            profileImage: null,
            bio: data.bio || '',
            consultationFee: data.consultationFee?.toString() || '0',
            practiceAreas: data.practiceAreas || [],
            languages: data.languages || []
        })
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordSubmit = async () => {
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

        setChangingPassword(true);
        try {
            await changePassword(passwordData.oldPassword, passwordData.newPassword);
            showToast("success", "Password changed successfully")
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
            setShowPasswordSection(false)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to change password";
            showToast("error", errorMessage)
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

    const fullAddress = data.address?.filter(Boolean).join(", ");
    const profileStats = [
        {
            label: "Years Practice",
            value: `${data.yearsOfPractice || 0}+`,
            icon: Briefcase,
        },
        {
            label: "Consultation Fee",
            value: `₹${data.consultationFee || 0}`,
            icon: DollarSign,
        },
        {
            label: "Practice Areas",
            value: `${data.practiceAreas?.length || 0}`,
            icon: Shield,
        },
        {
            label: "Bar Since",
            value: data.barAdmissionDate || "N/A",
            icon: Calendar,
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100 pb-12">
            <div className="relative overflow-hidden border-b border-slate-800 bg-[#07051a]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#07051a_0%,#0a0820_45%,#0d1330_100%)]" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-8 pb-24">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-slate-200">
                                <Shield className="h-3.5 w-3.5" />
                                Lawyer Profile
                            </div>
                            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Professional profile overview
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                                Keep your profile simple, clear, and aligned with the rest of the dashboard.
                            </p>
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/15"
                            >
                                <Edit2 size={16} className="mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/15"
                                    disabled={saving}
                                >
                                    <X size={16} className="mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:bg-slate-100"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2"></div>
                                    ) : (
                                        <Save size={16} className="mr-2" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {profileStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">{stat.label}</p>
                                            <p className="mt-3 text-2xl font-extrabold text-white">{stat.value}</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                                            <Icon size={20} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                            <div className="relative p-8 pt-10 text-center">
                                <div className="absolute inset-x-0 top-0 h-24 bg-[#0b0820]" />
                                <div className="relative inline-block mb-6">
                                    <div className="h-36 w-36 rounded-[28px] bg-white p-1.5 shadow-2xl overflow-hidden ring-4 ring-white/80 relative group">
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
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change Profile Photo <span className="text-red-500">*</span></span>
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

                                <div className="relative">
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
                                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{data.name || 'Lawyer Name'}</h1>
                                )}

                                <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                                    <Award className="w-4 h-4 mr-1.5" />
                                    Bar No: {data.barNumber || 'N/A'}
                                </div>
                                </div>

                                <div className="mb-6 grid grid-cols-2 gap-3 text-left">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Primary Location</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-700">{data.address?.[1] || data.address?.[2] || "Not added"}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Languages</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-700">{data.languages?.length || 0} selected</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left border-t border-slate-100 pt-6">
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
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                Min. Consultation Fee {isEditing && <span className="text-red-500">*</span>}
                                            </p>
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

                        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
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
                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                            <p className="text-sm font-semibold text-slate-700">{fullAddress || "No address provided"}</p>
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
                        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                    <FileText size={18} />
                                </div>
                                Professional Summary
                            </h2>

                            {isEditing ? (
                                <div className="space-y-2">
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none min-h-[160px] transition-all"
                                        placeholder="Briefly describe your expertise, achievements, and legal philosophy..."
                                        maxLength={1000}
                                    />
                                    <div className="flex justify-end px-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.bio.length > 900 ? 'text-red-500' : 'text-slate-400'}`}>
                                            {formData.bio.length} / 1000 Characters
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                    <p className="text-slate-600 leading-relaxed">
                                        {data.bio || 'Your professional biography will appear here once updated.'}
                                    </p>
                                </div>
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
                                {isEditing ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                                        {specializations.map((spec) => {
                                            const Icon = getIconForArea(spec.name);
                                            const isSelected = formData.practiceAreas.some(a => a.toLowerCase() === spec.name.toLowerCase());
                                            return (
                                                <button
                                                    key={spec.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = isSelected
                                                            ? formData.practiceAreas.filter(a => a.toLowerCase() !== spec.name.toLowerCase())
                                                            : [...formData.practiceAreas, spec.name];
                                                        setFormData(prev => ({ ...prev, practiceAreas: updated }));
                                                    }}
                                                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-[11px] font-bold uppercase tracking-wider ${isSelected
                                                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-500/10'
                                                        : 'border-white bg-white text-slate-500 hover:border-slate-200 shadow-sm'
                                                        }`}
                                                >
                                                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span className="truncate">{spec.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {data.practiceAreas && data.practiceAreas.length > 0 ? (
                                            data.practiceAreas.map((area, index) => {
                                                const Icon = getIconForArea(area);
                                                return (
                                                    <span key={index} className="px-3.5 py-1.5 bg-teal-50/50 text-teal-700 rounded-xl text-xs font-bold border border-teal-100/50 uppercase tracking-wide flex items-center gap-1.5">
                                                        <Icon className="w-3 h-3" />
                                                        {area}
                                                    </span>
                                                )
                                            })
                                        ) : (
                                            <p className="text-slate-400 text-sm italic">Not specified</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Languages */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                                        <Globe size={18} />
                                    </div>
                                    Languages
                                </h2>
                                {isEditing ? (
                                    <div className="flex flex-wrap gap-2">
                                        {languageOptions.map((lang) => {
                                            const isSelected = formData.languages.some(l => l.toLowerCase() === lang.label.toLowerCase());
                                            return (
                                                <button
                                                    key={lang.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = isSelected
                                                            ? formData.languages.filter(l => l.toLowerCase() !== lang.label.toLowerCase())
                                                            : [...formData.languages, lang.label];
                                                        setFormData(prev => ({ ...prev, languages: updated }));
                                                    }}
                                                    className={`px-4 py-2 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-wider ${isSelected
                                                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-500/10'
                                                        : 'border-white bg-white text-slate-500 hover:border-slate-200 shadow-sm'
                                                        }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {data.languages && data.languages.length > 0 ? (
                                            data.languages.map((lang, index) => (
                                                <span key={index} className="px-3.5 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200/50 uppercase tracking-wide flex items-center gap-1.5">
                                                    <Globe className="w-3 h-3 text-slate-400" />
                                                    {lang}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 text-sm italic">Not specified</p>
                                        )}
                                    </div>
                                )}
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
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    name="oldPassword"
                                                    value={passwordData.oldPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full p-3.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                                >
                                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block pl-1">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full p-3.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                                    placeholder="Min 6 characters"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                                >
                                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block pl-1">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full p-3.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                                    placeholder="Repeat new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
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
