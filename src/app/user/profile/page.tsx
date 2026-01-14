"use client";

import { useEffect, useState } from "react";
import {
  getprofile,
  updateProfileInfo,
  changePassword,
} from "@/service/userService";
import {
  Camera, Edit2, Loader2, Save, X, User, Mail,
  Phone as PhoneIcon, MapPin, Lock, ShieldCheck,
  Settings, Globe, CheckCircle2, ChevronRight
} from "lucide-react";
import { showToast } from "@/utils/alerts";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");

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
      const data = await getprofile();
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
      setImagePreview(data.profileImage || "");
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent shadow-lg"></div>
          <p className="text-slate-500 font-bold animate-pulse">Establishing secure access...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-full bg-slate-50/50 p-2 md:p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              {!isEditing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 text-teal-600 hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100 shadow-teal-500/5"
                >
                  <Edit2 size={18} />
                </motion.button>
              )}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative flex flex-col items-center">
                <div className="relative group/avatar">
                  <div className="w-36 h-36 roundedFull p-1.5  rotate-3 group-hover:rotate-0 transition-transform duration-500 mb-6">
                    <div className="w-full h-full rounded bg-white overflow-hidden ">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded bg-slate-100 flex items-center justify-center">
                          <User size={48} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <motion.label
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-teal-600 transition-colors border-4 border-white z-10"
                    >
                      <Camera size={20} />
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </motion.label>
                  )}
                </div>

                <div className="text-center">

                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{formData.name || "Anonymous User"}</h2>
                  <p className="text-teal-600 font-bold text-xs uppercase tracking-widest bg-teal-50 px-4 py-1.5 rounded-full inline-block">Verified Client</p>
                  <div className="w-full mt-8 pt-8 border-t border-slate-50 space-y-2">
                    <button
                      onClick={() => setActiveTab("personal")}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'personal' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 group'}`}
                    >
                      <div className="flex items-center gap-3">
                        <User size={20} className={activeTab === 'personal' ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'} />
                        <span className="font-bold text-sm">Personal Information</span>
                      </div>
                      <ChevronRight size={18} className={activeTab === 'personal' ? 'opacity-100' : 'opacity-0'} />
                    </button>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all mt-2 ${activeTab === 'security' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:text-white group'}`}
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className={activeTab === 'security' ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'} />
                        <span className="font-bold text-sm">Security & Privacy</span>
                      </div>
                      <ChevronRight size={18} className={activeTab === 'security' ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info (Moved from Sidebar Card) */}
            {/* <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 space-y-6"> */}
            {/* <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-2xl text-teal-500">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Email Address</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-2xl text-teal-500">
                  <PhoneIcon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Phone Number</p>
                  <p className="text-sm font-bold text-slate-200">{formData.phone || "Not provided"}</p>
                </div>
              </div>
            </div> */}
          </motion.div>

          {/* Right Column - Active Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border mr-0 border-white">

              {activeTab === 'personal' ? (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Settings className="text-teal-600" size={28} />
                      General Information
                    </h3>
                    <p className="text-slate-500 mt-2 font-medium">Update your core profile details to stay connected.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                      <div className="relative group">
                        <input
                          className={`w-full px-5 py-4 rounded-2xl border transition-all font-bold ${isEditing ? 'border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5' : 'border-transparent bg-slate-100/50 text-slate-900'}`}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing || isSaving}
                          placeholder="Enter your full name"
                        />
                        {!isEditing && <CheckCircle2 size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-500" />}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                      <div className="relative">
                        <input
                          className={`w-full px-5 py-4 rounded-2xl border transition-all font-bold ${isEditing ? 'border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5' : 'border-transparent bg-slate-100/50 text-slate-900'}`}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing || isSaving}
                          placeholder="10-digit mobile number"
                        />
                        {!isEditing && <PhoneIcon size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />}
                      </div>
                    </div>

                    <div className="space-y-2.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe size={14} className="text-teal-600" /> Current Residence
                      </label>
                      <textarea
                        className={`w-full px-5 py-4 rounded-2xl border transition-all font-bold resize-none min-h-[100px] ${isEditing ? 'border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5' : 'border-transparent bg-slate-100/50 text-slate-900'}`}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing || isSaving}
                        placeholder="Flat/House, Street, Area"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                      <input
                        className={`w-full px-5 py-4 rounded-2xl border transition-all font-bold ${isEditing ? 'border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5' : 'border-transparent bg-slate-100/50 text-slate-900'}`}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={!isEditing || isSaving}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                      <input
                        className={`w-full px-5 py-4 rounded-2xl border transition-all font-bold ${isEditing ? 'border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5' : 'border-transparent bg-slate-100/50 text-slate-900'}`}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-6 border-t border-slate-50 flex items-center justify-end gap-3"
                    >
                      <button
                        onClick={() => { setIsEditing(false); loadProfile(); }}
                        className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Profile
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Lock className="text-rose-600" size={28} />
                      Access & Security
                    </h3>
                    <p className="text-slate-500 mt-2 font-medium">Protect your account with a strong, updated password.</p>
                  </div>

                  {!showPasswordInputs ? (
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-400">
                        <ShieldCheck size={32} />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">Password Security</h4>
                      <p className="text-slate-500 text-sm max-w-xs mb-6">Regularly updating your password ensures your legal data stays private.</p>
                      <button
                        onClick={() => setShowPasswordInputs(true)}
                        className="px-8 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:border-teal-500/30 hover:shadow-lg transition-all text-sm"
                      >
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Old Password</label>
                          <input
                            type="password"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-bold"
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                            disabled={isChangingPassword}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                          <input
                            type="password"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-bold"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            disabled={isChangingPassword}
                            placeholder="Min 6 characters"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-bold"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            disabled={isChangingPassword}
                            placeholder="Repeat new password"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                        <button
                          onClick={() => setShowPasswordInputs(false)}
                          className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleChangePassword}
                          disabled={isChangingPassword}
                          className="px-8 py-3 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                          Update Access
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}