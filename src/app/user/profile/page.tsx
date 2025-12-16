"use client";

import { useEffect, useState } from "react";
import {
  getprofile,
  updateProfileInfo,
  changePassword,
} from "@/service/userService";
import { Camera, Edit2, Loader2 } from "lucide-react";
import { showToast } from "@/utils/alerts";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
const [showChengePassword,setShowChengePassword] = useState(true)
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

  const [showPassword, setShowPassword] = useState(false);

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
      setShowChengePassword(data.isPassword)
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

    if (formData.name.trim().length < 3) {
      return showToast("error", "Name must be at least 3 characters long");
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return showToast("error", "Phone number must be exactly 10 digits");
    }
    if (formData.address.trim().length < 6) {
      return showToast("error", "Address must be at least 6 characters long");
    }
    if (formData.city.trim().length < 3) {
      return showToast("error", "City must be at least 3 characters long");
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      return showToast("error", "Pincode must be exactly 6 digits");
    }

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
      showToast("success", "Profile updated");
      await loadProfile();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPassword) return;

    if (!formData.oldPassword || !formData.newPassword) {
      return showToast("error", "Enter old and new password");
    }


    if (formData.newPassword !== formData.confirmPassword) {
      return showToast('error', 'Conform password not correct')
    }
    if (formData.newPassword.length < 6) {
      return showToast("error", "New password must be at least 6 characters");
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      showToast("success", res.message || "Password changed");
      setFormData({ ...formData, oldPassword: "", newPassword: "" });
      setShowPassword(false);
    } catch (err: any) {
      showToast("error", err?.message || "Password change failed");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl ml-70 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow relative">

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
            aria-label={isEditing ? "Disable edit mode" : "Enable edit mode"}
            title={isEditing ? "Disable edit mode" : "Enable edit mode"}
          >
            <Edit2 size={20} className={isEditing ? "text-green-600" : "text-gray-600"} />
          </button>

          <div className="flex flex-col items-center">
            <div className="relative">
              <label>
                <img
                  src={imagePreview||undefined}
                  alt="Profile"
                  className={`w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                />
                {isEditing && (
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                )}
              </label>
            </div>

            <div className="w-full mt-6 space-y-4">
              <input
                className="border p-3 w-full rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                disabled={!isEditing || isSaving}
              />
              <input
                disabled
                className="border p-3 w-full bg-gray-100 rounded-lg text-gray-500"
                value={formData.email}
              />
              <input
                className="border p-3 w-full rounded-lg"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
                disabled={!isEditing || isSaving}
              />
              <textarea
                className="border p-3 w-full rounded-lg"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                disabled={!isEditing || isSaving}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="border p-3 rounded-lg"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing || isSaving}
                />
                <input
                  className="border p-3 rounded-lg"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={!isEditing || isSaving}
                />
                <input
                  className="border p-3 rounded-lg"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  disabled={!isEditing || isSaving}
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className={`w-full py-3 rounded-lg text-white transition-colors flex items-center justify-center space-x-2
                  ${isEditing && !isSaving ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"}
                `}
                disabled={!isEditing || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Profile"
                )}
              </button>
{showChengePassword && (
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
                disabled={isSaving}
              >
                {showPassword ? "Cancel Password Change" : "Change Password"}
              </button>
                 )}

              {showPassword && (
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Old password"
                    className="border w-full p-3 rounded-lg"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    disabled={isChangingPassword}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="border w-full p-3 rounded-lg"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    disabled={isChangingPassword}
                  />
                  <input
                    type="password"
                    placeholder="Conform password"
                    className="border w-full p-3 rounded-lg"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isChangingPassword}
                  />
                  <button
                    onClick={handleChangePassword}
                    className={`w-full text-white py-3 rounded-lg flex items-center justify-center space-x-2
                      ${isChangingPassword ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
                    `}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Updating...</span>
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              )}
           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}