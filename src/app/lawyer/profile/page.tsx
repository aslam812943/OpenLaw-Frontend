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
    Edit2,
    Save,
    X,
    Camera,
    Upload,
    Lock,
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
        bio: ''
    })

    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        profileImage: null as File | null,
        bio: ''
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
            const profileData = response.data;
            setData({
                barNumber: profileData.barNumber,
                barAdmissionDate: profileData.barAdmissionDate,
                yearsOfPractice: profileData.yearsOfPractice,
                practiceAreas: profileData.practiceAreas || [],
                languages: profileData.languages || [],
                documentUrls: profileData.documentUrls || [],
                address: profileData.address || [],
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                profileImage: profileData.profileImage,
                bio: profileData.bio || ''
            })


            const addressArray = profileData.address || [];
            setFormData({
                name: profileData.name || '',
                phone: profileData.phone || '',
                street: addressArray[0] || '',
                city: addressArray[1] || '',
                state: addressArray[2] || '',
                pincode: addressArray[3] || '',
                profileImage: null,
                bio: profileData.bio || ''
            })
        } catch (error) {
            console.error("Error fetching profile:", error);
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

            if (formData.profileImage) {
                dataToSend.append('profileImage', formData.profileImage);
            }

            await updateProfile(dataToSend);
            await fetchProfile();
            setIsEditing(false);
            showToast("success", "Profile updated successfully")
        } catch (error) {
            console.error("Error updating profile:", error);
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
            bio: data.bio || ''
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
            console.error("Error changing password:", error);
            showToast("error", error.message || "Failed to change password")
        } finally {
            setChangingPassword(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                    {/* Edit Button */}
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                        >
                            <Edit2 size={16} className="mr-2" />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                                onClick={handleCancel}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                                disabled={saving}
                            >
                                <X size={16} className="mr-2" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
                                disabled={saving}
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                ) : (
                                    <Save size={16} className="mr-2" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    )}

                    <div className="px-8 pb-8">
                        <div className="relative flex items-end -mt-12 mb-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg overflow-hidden">
                                    {isEditing && (
                                        <div
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 cursor-pointer rounded-full m-1"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Camera className="text-white w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : data.profileImage ? (
                                            <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="ml-6 mb-1 flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent w-full max-w-md"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1 className="text-3xl font-bold text-gray-900">{data.name || 'Lawyer Name'}</h1>
                                )}

                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <Award className="w-4 h-4 mr-1" />
                                    <span>Bar Number: {data.barNumber || 'N/A'}</span>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm mt-4">{data.bio || 'No bio available'}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                            <div className="flex items-center text-gray-600">
                                <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                                    <p className="text-sm font-medium">{data.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-600">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="text-sm font-medium border-b border-gray-300 focus:border-green-500 outline-none bg-transparent w-full"
                                            placeholder="Phone Number"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">{data.phone || 'N/A'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Experience</p>
                                    <p className="text-sm font-medium">{data.yearsOfPractice} Years Practice</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Address Section - Now Editable */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                                Address Details
                            </h2>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Street Address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-medium">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-medium">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Pincode"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.address && data.address.length > 0 ? (
                                        <>
                                            <p className="text-sm text-gray-600">{data.address[0]}</p>
                                            <p className="text-sm text-gray-600">
                                                {data.address[1]} {data.address[2] && `, ${data.address[2]}`}
                                            </p>
                                            <p className="text-sm text-gray-600">{data.address[3]}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No address provided</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Practice Areas (Read Only) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                Practice Areas
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.practiceAreas && data.practiceAreas.length > 0 ? (
                                    data.practiceAreas.map((area, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                            {area}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No practice areas listed</p>
                                )}
                            </div>
                        </div>

                        {/* Languages (Read Only) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                                Languages
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.languages && data.languages.length > 0 ? (
                                    data.languages.map((lang, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                            {lang}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No languages listed</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Info (Read Only) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Info</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Bar Admission</p>
                                        <p className="text-sm text-gray-500">{data.barAdmissionDate || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <button
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-4"
                            >
                                <div className="flex items-center">
                                    <Lock className="w-5 h-5 mr-2 text-purple-600" />
                                    Change Password
                                </div>
                                {showPasswordSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {showPasswordSection && (
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Current Password</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-medium">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button
                                        onClick={handlePasswordSubmit}
                                        disabled={changingPassword}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {changingPassword ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                            <Lock size={16} className="mr-2" />
                                        )}
                                        {changingPassword ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Documents (Read Only) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Documents & Certificates
                            </h2>

                            {data.documentUrls && data.documentUrls.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.documentUrls.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative block rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-md"
                                        >
                                            <div className="aspect-video bg-gray-100 relative flex items-center justify-center overflow-hidden">

                                                {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                    <img
                                                        src={url}
                                                        alt={`Document ${index + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <FileText className="w-12 h-12 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                            </div>
                                            <div className="p-3 bg-white">
                                                <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600">
                                                    Document {index + 1}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Click to view</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No documents uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
