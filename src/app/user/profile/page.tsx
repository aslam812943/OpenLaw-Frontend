"use client";

import { useEffect, useState } from "react";
import {
  getprofile,
  updateProfileInfo,
  changePassword,
} from "@/service/userService";
import { Camera, Edit2, Loader2, Save, X, User, Mail, Phone as PhoneIcon, MapPin, Lock } from "lucide-react";
import { showToast } from "@/utils/alerts";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // Changed default to false for cleaner initial view
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: '',
    oldPassword: "",
    newPassword: "",
    confirmPassword: ''
  });

  const [showPasswordInputs, setShowPasswordInputs] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await getprofile();
      const data = res.data;
      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.Address?.address || "",
        city: data.Address?.city || "",
        pincode: data.Address?.pincode || "",
        state: data.Address?.state || ' ',
        oldPassword: "",
        newPassword: "",
        confirmPassword: '',
      });
      setImagePreview(data.profileImage || "/profile.jpg");
      setIsEditing(false);
      setImageFile(null);
      setShowChangePassword(data.isPassword);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!isEditing || isSaving) return;

    if (formData.name.trim().length < 3) return showToast("error", "Name must be at least 3 characters");
    if (!/^\d{10}$/.test(formData.phone)) return showToast("error", "Phone number must be exactly 10 digits");
    if (formData.address.trim().length < 6) return showToast("error", "Address must be at least 6 characters");
    if (formData.city.trim().length < 3) return showToast("error", "City must be at least 3 characters");
    if (!/^\d{6}$/.test(formData.pincode)) return showToast("error", "Pincode must be exactly 6 digits");

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("phone", formData.phone);
      fd.append("address", formData.address || "");
      fd.append("city", formData.city || "");
      fd.append("pincode", formData.pincode || "");
      fd.append('state', formData.state || '')
      if (imageFile) fd.append("profileImage", imageFile);

      await updateProfileInfo(fd);
      showToast("success", "Profile updated successfully");
      await loadProfile();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPassword) return;

    if (!formData.oldPassword || !formData.newPassword) return showToast("error", "Enter old and new password");
    if (formData.newPassword !== formData.confirmPassword) return showToast('error', 'New passwords do not match');
    if (formData.newPassword.length < 6) return showToast("error", "New password must be at least 6 characters");

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      showToast("success", res.message || "Password changed successfully");
      setFormData({ ...formData, oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordInputs(false);
    } catch (err: any) {
      showToast("error", err?.message || "Password change failed");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-1">Manage your personal information and account security.</p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-teal-600 transition-all shadow-sm"
            >
              <Edit2 size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Edit Mode Actions (Top Right) */}
          {isEditing && (
            <div className="absolute top-6 right-6 flex gap-2 z-10">
              <button
                onClick={() => { setIsEditing(false); setImageFile(null); loadProfile(); }}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                title="Cancel Editing"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Save Changes</span>
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-10">
            {/* Profile Image Column */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="relative group">
                <label className={`relative block ${isEditing ? 'cursor-pointer' : ''}`}>
                  <div className="w-40 h-40 rounded-full p-1 bg-white border border-slate-100 shadow-md">
                    <img
                      src={imagePreview || "/default.jpg"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {isEditing && (
                    <>
                      <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-8 h-8" />
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      <div className="absolute bottom-2 right-2 bg-teal-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                        <Edit2 size={14} />
                      </div>
                    </>
                  )}
                </label>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-slate-900">{formData.name || "User"}</h2>
                <p className="text-slate-500 text-sm">{formData.email}</p>
              </div>
            </div>

            {/* Form Fields Column */}
            <div className="flex-1 space-y-8">

              {/* Personal Information */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User size={18} className="text-teal-600" /> Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <div className="relative">
                      <input
                        className={`w-full p-3 rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isEditing ? 'border-slate-200' : 'border-transparent bg-transparent pl-0'}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing || isSaving}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                      <input
                        className={`w-full p-3 rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isEditing ? 'border-slate-200' : 'border-transparent bg-transparent pl-0'}`}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing || isSaving}
                        placeholder="Start with country code if applicable"
                      />
                      {!isEditing && <PhoneIcon size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400" />}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                      <input
                        disabled
                        className="w-full p-3 rounded-xl border border-transparent bg-transparent text-slate-600 pl-0 cursor-not-allowed opacity-70"
                        value={formData.email}
                      />
                      <Mail size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MapPin size={18} className="text-teal-600" /> Address & Location
                </h3>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Street Address</label>
                    <textarea
                      className={`w-full p-3 rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none min-h-[80px] ${isEditing ? 'border-slate-200' : 'border-transparent bg-transparent pl-0 focus:ring-0 min-h-0'}`}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing || isSaving}
                      placeholder="Full street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">City</label>
                      <input
                        className={`w-full p-3 rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isEditing ? 'border-slate-200' : 'border-transparent bg-transparent pl-0'}`}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">State</label>
                      <input
                        className={`w-full p-3 rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isEditing ? 'border-slate-200' : 'border-transparent bg-transparent pl-0'}`}
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pincode</label>
                      <input
                        className={`w-full p-3 rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isEditing ? 'border-slate-200' : 'border-transparent bg-transparent pl-0'}`}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              {showChangePassword && (
                <div className="pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowPasswordInputs(!showPasswordInputs)}
                    className="flex items-center gap-2 text-slate-600 font-semibold hover:text-teal-600 transition-colors"
                  >
                    <Lock size={18} />
                    <span>{showPasswordInputs ? "Cancel Password Change" : "Change Password"}</span>
                  </button>

                  {showPasswordInputs && (
                    <div className="mt-6 bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-200">
                      <h4 className="font-bold text-slate-800 text-sm">Update Password</h4>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current password"
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                          value={formData.oldPassword}
                          onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                          disabled={isChangingPassword}
                        />
                        <input
                          type="password"
                          placeholder="New password (min 6 chars)"
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          disabled={isChangingPassword}
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleChangePassword}
                          className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center gap-2 disabled:opacity-70"
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? <Loader2 className="animate-spin" size={18} /> : null}
                          Update Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}