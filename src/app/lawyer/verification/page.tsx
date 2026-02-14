'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { submitVerificationDetails, fetchSpecializations, Specialization } from "@/service/lawyerService";
import { RootState } from "@/redux/store";
import { showToast } from "@/utils/alerts";
import {
  Scale,
  CheckCircle2,
  Upload,
  Briefcase,
  Users,
  Building,
  Gavel,
  Heart,
  Home,
  Shield,
  FileText,
  Landmark,
  Globe,
  Plane,
  TrendingUp,
  Coins,
  Leaf,
  Cross,
  UserCheck,
  Music,
  Ship,
  DollarSign,
  ScrollText,
  Book,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";

const LawyerSignup = () => {
  const router = useRouter();
  const lawyer = useSelector((state: RootState) => state.lawyer);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    barNumber: "",
    barAdmissionDate: "",
    yearsOfPractice: "",
    practiceAreas: [] as string[],
    languages: [] as string[],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [practiceOptions, setPracticeOptions] = useState<{ value: string; label: string; icon: any }[]>([]);

  const getIconForArea = (areaName: string) => {
    const lower = areaName.toLowerCase();
    if (lower.includes("corporate")) return Briefcase;
    if (lower.includes("criminal")) return Gavel;
    if (lower.includes("family")) return Heart;
    if (lower.includes("property") || lower.includes("real estate")) return Home;
    if (lower.includes("civil")) return Users;
    if (lower.includes("labor") || lower.includes("employment")) return Building;
    if (lower.includes("consumer")) return Shield;
    if (lower.includes("tax")) return Coins;
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

  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        const response = await fetchSpecializations();
        if (response.success && response.data) {
          const options = response.data.map((spec: Specialization) => ({
            value: spec.name,
            label: spec.name,
            icon: getIconForArea(spec.name),
          }));
          setPracticeOptions(options);
        }
      } catch (error: unknown) {
        showToast("error", "Failed to load practice areas");
      }
    };
    loadSpecializations();
  }, []);

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "malayalam", label: "Malayalam" },
    { value: "both", label: "Both (English & Malayalam)" },
  ];

  const validateBarNumber = (barNumber: string) => (!barNumber.trim() ? "Bar number is required" : "");
  const validateBarAdmissionDate = (date: string) => (!date.trim() ? "Bar admission date is required" : "");
  const validateYearsOfPractice = (years: string) => {
    if (!years.trim()) return "Years of practice is required";
    if (isNaN(Number(years)) || Number(years) < 0) return "Please enter a valid number";
    return "";
  };
  const validatePracticeAreas = (areas: string[]) => (areas.length === 0 ? "Please select at least one practice area" : "");
  const validateLanguages = (langs: string[]) => (langs.length === 0 ? "Please select your language preference" : "");
  const validateFiles = (files: File[]) => (files.length === 0 ? "Please upload at least one document" : "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePracticeArea = (value: string) => {
    const updatedAreas = formData.practiceAreas.includes(value)
      ? formData.practiceAreas.filter((area) => area !== value)
      : [...formData.practiceAreas, value];
    setFormData((prev) => ({ ...prev, practiceAreas: updatedAreas }));
    if (errors.practiceAreas) {
      setErrors((prev) => ({ ...prev, practiceAreas: "" }));
    }
  };

  const selectLanguage = (value: string) => {
    setFormData((prev) => ({ ...prev, languages: [value] }));
    if (errors.languages) {
      setErrors((prev) => ({ ...prev, languages: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles: File[] = [];
    let errorMsg = "";

    selectedFiles.forEach((file) => {
      if (file.size > maxSize) {
        errorMsg = `${file.name} exceeds 10MB limit`;
      } else if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        errorMsg = `${file.name} is not a valid format (PDF, JPG, PNG only)`;
      } else {
        validFiles.push(file);
      }
    });

    if (errorMsg) {
      setUploadMessage(errorMsg);
      showToast("error", errorMsg);
      setTimeout(() => setUploadMessage(""), 3000);
    } else {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      setUploadMessage("");
      if (errors.files) {
        setErrors((prev) => ({ ...prev, files: "" }));
      }
      showToast("success", "File(s) uploaded successfully.");
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (errors.files) {
      setErrors((prev) => ({ ...prev, files: "" }));
    }
    showToast("info", "File removed.");
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      newErrors.barNumber = validateBarNumber(formData.barNumber);
      newErrors.barAdmissionDate = validateBarAdmissionDate(formData.barAdmissionDate);
      newErrors.yearsOfPractice = validateYearsOfPractice(formData.yearsOfPractice);
    }

    if (step === 2) {
      newErrors.practiceAreas = validatePracticeAreas(formData.practiceAreas);
      newErrors.languages = validateLanguages(formData.languages);
    }

    if (step === 3) {
      newErrors.files = validateFiles(files);
    }

    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key] === "") {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("success", "Step completed successfully.");
    } else {
      showToast("error", "Please fill all required fields before proceeding.");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("info", "Moved to previous step.");
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      showToast("error", "Please fix validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("barNumber", formData.barNumber);
      formDataToSend.append("barAdmissionDate", formData.barAdmissionDate);
      formDataToSend.append("yearsOfPractice", formData.yearsOfPractice);
      formDataToSend.append("practiceAreas", JSON.stringify(formData.practiceAreas));
      formDataToSend.append("languages", JSON.stringify(formData.languages));
      formDataToSend.append("userId", JSON.stringify(lawyer.id));

      files.forEach((file) => formDataToSend.append("documents", file));

      await submitVerificationDetails(formDataToSend);

      showToast("success", "Verification details submitted successfully!");
      setIsSubmitted(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to submit form. Please try again.";
      setErrors({ submit: message });
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      router.push("/lawyer/dashboard");
    }
  }, [isSubmitted, router]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <Scale className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900">
            Lawyer Verification
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Complete your profile to get verified and start connecting with clients
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep >= step
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                      : "bg-slate-200 text-slate-500"
                      }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${currentStep >= step ? "text-teal-600" : "text-slate-500"
                      }`}
                  >
                    {step === 1 && "Professional"}
                    {step === 2 && "Expertise"}
                    {step === 3 && "Documents"}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all duration-300 ${currentStep > step ? "bg-teal-600" : "bg-slate-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your bar number"
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg transition-all focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:outline-none ${errors.barNumber ? "border-red-500" : "border-slate-200"
                    }`}
                />
                {errors.barNumber && <p className="mt-1.5 text-sm text-red-500">{errors.barNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bar Admission Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="barAdmissionDate"
                  value={formData.barAdmissionDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg transition-all focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:outline-none ${errors.barAdmissionDate ? "border-red-500" : "border-slate-200"
                    }`}
                />
                {errors.barAdmissionDate && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.barAdmissionDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Years of Practice <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="yearsOfPractice"
                  value={formData.yearsOfPractice}
                  onChange={handleInputChange}

                  placeholder="e.g., 5"
                  min={0}
                  max={99}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg transition-all focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:outline-none ${errors.yearsOfPractice ? "border-red-500" : "border-slate-200"
                    }`}
                />
                {errors.yearsOfPractice && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.yearsOfPractice}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Practice Areas <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-slate-500 mb-4">Select all areas you specialize in</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {practiceOptions.map((area) => {
                    const Icon = area.icon;
                    const isSelected = formData.practiceAreas.includes(area.value);
                    return (
                      <button
                        key={area.value}
                        type="button"
                        onClick={() => togglePracticeArea(area.value)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${isSelected
                          ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-500/20"
                          : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-md"
                          }`}
                      >
                        <Icon
                          className={`w-6 h-6 mb-2 ${isSelected ? "text-teal-600" : "text-slate-500"}`}
                        />
                        <span
                          className={`text-xs font-medium text-center ${isSelected ? "text-teal-700" : "text-slate-700"
                            }`}
                        >
                          {area.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1" />}
                      </button>
                    );
                  })}
                </div>
                {errors.practiceAreas && (
                  <p className="mt-3 text-sm text-red-500">{errors.practiceAreas}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Language Preference <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {languageOptions.map((lang) => {
                    const isSelected = formData.languages.includes(lang.value);
                    return (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => selectLanguage(lang.value)}
                        className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${isSelected
                          ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-500/20"
                          : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-md"
                          }`}
                      >
                        <span className={`font-medium ${isSelected ? "text-teal-700" : "text-slate-700"}`}>
                          {lang.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600 ml-2" />}
                      </button>
                    );
                  })}
                </div>
                {errors.languages && <p className="mt-3 text-sm text-red-500">{errors.languages}</p>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Verification Documents</h2>
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-teal-500 transition-all duration-300 group cursor-pointer"
                onClick={() => document.getElementById("documentUpload")?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 group-hover:text-teal-600 transition-colors duration-300" />
                <p className="text-sm text-slate-600 mb-2 font-medium">
                  Upload Bar License & Professional ID
                </p>
                <p className="text-xs text-slate-500">PDF, JPG or PNG (Max. 10MB each)</p>
                <input
                  id="documentUpload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {files.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <h3 className="text-sm font-semibold mb-3">Selected Files ({files.length}):</h3>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate">{file.name}</span>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}
              {uploadMessage && <p className="text-sm text-red-500">{uploadMessage}</p>}
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 flex gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isSubmitting}
                className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 h-14 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-14 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Verification
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Need help?{" "}
            <a href="#" className="text-teal-600 font-medium hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerSignup;