"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Mail, Phone, MapPin, Award, Scale, Calendar,
  BookOpen, Briefcase, Languages, ExternalLink,
  ChevronLeft, ChevronRight, Star, ShieldCheck, Clock, DollarSign,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { checkChatAccess, getChatRoom } from "@/service/chatService";
import { showToast } from "@/utils/alerts";
import { getSingleLawyer, getallslots, Lawyer, Slot } from "@/service/lawyerService";
import { handlepayAndBook, addReview, allReview, Review, getWallet, bookWithWallet, rescheduleAppointment } from "@/service/userService";

export default function LawyersSinglePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.user);
  const [calendarDays, setCalendarDays] = useState<{ date: string, available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<{ start: string; end: string } | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingMode, setBookingMode] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(false);
  const [consultationFee, setConsultationFee] = useState<number | undefined>(0);
  const [description, setDescription] = useState("");
  const [hasChatAccess, setHasChatAccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'wallet'>('online');
  const [isProcessing, setIsProcessing] = useState(false);

  // Review State
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const router = useRouter();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchLawyer() {
      try {
        const response = await getSingleLawyer(`${id}`);
        const reviewsRes = await allReview(`${id}`);
        if (reviewsRes?.success) {
          setReviews(reviewsRes.data || []);
        }

        const lawyerData = response.data;
        setLawyer(lawyerData);
        if (lawyerData?.consultationFee) {
          setConsultationFee(Number(lawyerData.consultationFee));
        }
      } catch (error) {
        showToast("error", "Failed to fetch lawyer details");
      } finally {
        setLoading(false);
      }
    }

    async function fetchChatAccess() {
      try {
        const response = await checkChatAccess(id as string);
        setHasChatAccess(response.hasAccess);
      } catch (error) {
        showToast("error", "Failed to check chat access");
      }
    }

    async function fetchWalletBalance() {
      try {
        const response = await getWallet(1, 1);
        if (response.success) {
          setWalletBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance", error);
      }
    }

    if (id) {
      fetchLawyer();
      fetchChatAccess();
      fetchWalletBalance();
    }
  }, [id]);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    const deadlineParam = searchParams.get('deadline');
    const parentIdParam = searchParams.get('parentBookingId');

    if (dateParam) setSelectedDate(dateParam);
    if (timeParam) setSelectedTime({ start: timeParam, end: '' });
    if ((dateParam && timeParam) || deadlineParam) {
      setBookingMode(true);
      fetchslots();
      if (dateParam && timeParam) {
        setBookingSlot(true);
      }
    }
  }, [searchParams, lawyer]);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');

    if (dateParam && timeParam && slots.length > 0) {
      const matchingSlot = slots.find(s => s.date === dateParam && s.startTime === timeParam);
      if (matchingSlot) {
        setSelectedSlotId(matchingSlot.id);
        setSelectedTime({ start: matchingSlot.startTime, end: matchingSlot.endTime });
        setConsultationFee(Number(matchingSlot.consultationFee));
      }
    }
  }, [slots, searchParams]);

  const isPastDate = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const passedDate = new Date(date);
    return passedDate < today;
  };



  const isPastSlot = (date: string, startTime: string) => {
    const now = new Date();


    const slotDateTime = new Date(`${date}T${startTime}`);

    return slotDateTime <= now;
  };

  function generateMonthDays(year: number, month: number, availableDates: string[]) {
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();

    const emptyDays = Array(firstDayOfMonth).fill(null);

    const days = [...Array(daysInMonth)].map((_, i) => {
      const day = i + 1;
      const dateObj = new Date(Date.UTC(year, month, day));
      const formatted = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(2, "0")}`;

      return {
        date: formatted,
        available: availableDates.includes(formatted),
      };
    });

    return { emptyDays, days };
  }

  async function fetchslots() {
    const response = await getallslots(`${id}`);

    if (response?.success) {
      setSlots(response.data);
      if (response.data.length > 0) {
        setConsultationFee(Number(response.data[0].consultationFee));
      }
      updateCalendar(response.data);
    }
  }

  function updateCalendar(slotsData: any[]) {
    const uniqueDates = [...new Set(slotsData.map((slot: any) => slot.date))];
    const calendar = generateMonthDays(currentYear, currentMonth, uniqueDates as string[]);
    setCalendarDays(calendar.days);
  }

  useEffect(() => {
    if (slots.length > 0) {
      updateCalendar(slots);
    }
  }, [currentMonth, currentYear, slots]);

  const HandlePayment = async () => {
    if (!selectedDate || !selectedTime || !lawyer) return;

    if (!description.trim()) {
      showToast("error", "Please enter your consultation concern in the notes.");
      return;
    }

    const obj = {
      userId: user.id,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      date: selectedDate,
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      consultationFee: consultationFee,
      description,
      slotId: selectedSlotId,
      parentBookingId: searchParams.get('parentBookingId')
    };

    try {
      const response = await handlepayAndBook(obj);
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        showToast("error", "Failed to initiate payment. Please try again.");
      }
    } catch (error: any) {
      showToast("error", error.response?.data?.message || error.message || "Payment failed. Please try again.");
    }
  };

  const handleWalletPayment = async () => {
    if (!selectedDate || !selectedTime || !lawyer) return;

    if (!description.trim()) {
      showToast("error", "Please enter your consultation concern in the notes.");
      return;
    }

    if (walletBalance < (consultationFee || 0)) {
      showToast("error", "Insufficient wallet balance.");
      return;
    }

    setIsProcessing(true);

    const obj = {
      userId: user.id || null,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      date: selectedDate,
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      consultationFee: consultationFee,
      description,
      slotId: selectedSlotId || null,
      parentBookingId: searchParams.get('parentBookingId')
    };

    try {
      const response = await bookWithWallet(obj);
      if (response.success) {
        showToast("success", "Appointment booked successfully using wallet!");
        setBookingSlot(false);
        setBookingMode(false);
        router.push("/user/appointments");
      } else {
        showToast("error", response.message || "Failed to book with wallet.");
      }
    } catch (error: any) {
      showToast("error", error.response?.data?.message || error.message || "Wallet booking failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReschedule = async () => {
    const rescheduleBookingId = searchParams.get('rescheduleBookingId');
    if (!rescheduleBookingId || !selectedSlotId) return;

    setIsProcessing(true);
    try {
      await rescheduleAppointment(rescheduleBookingId, selectedSlotId);
      showToast("success", "Appointment rescheduled successfully!");
      setBookingSlot(false);
      setBookingMode(false);
      router.push("/user/bookings");
    } catch (error: any) {
      showToast("error", error.response?.data?.message || error.message || "Failed to reschedule appointment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth())) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (bookingMode) {
      setBookingMode(false);
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      showToast("error", "Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      showToast("error", "Please write a comment");
      return;
    }
    if (!lawyer) return;
    if (!user || !user.id) {
      showToast("error", "You must be logged in to review");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview({
        userId: user.id,
        lawyerId: lawyer.id,
        rating,
        comment: reviewComment
      });
      showToast("success", "Review submitted successfully!");

      const newReviews = await allReview(lawyer.id);
      if (newReviews?.data) {
        setReviews(newReviews.data);
      }

      setRating(0);
      setReviewComment("");
    } catch (error: any) {
      showToast("error", error.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-xl text-white">Lawyer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* 1. HIGH IMPACT HERO SECTION */}
      <div className="relative bg-slate-900 text-white overflow-hidden pb-12 pt-24 md:pt-32">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 opacity-90" />
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-teal-900/10 to-transparent pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb / Back (Optional, keeps it clean) */}
          {/* <div className="absolute top-0 left-6 md:left-0 mb-8">
              <button onClick={() => window.history.back()} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
                 <ChevronLeft size={16} /> Back to Search
              </button>
           </div> */}

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">

            {/* Profile Image - Cleaner Look */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group flex-shrink-0"
            >
              {/* Subtle ring instead of blur */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-teal-500 to-teal-800 opacity-50 blur-[2px]"></div>
              <img
                src={lawyer.profileImage || "/default.jpg"}
                alt={lawyer.name}
                className="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl ring-1 ring-slate-700/50"
              />
              <div className="absolute -bottom-3 -right-3 bg-slate-900 p-2 rounded-xl border border-slate-700 shadow-xl">
                <ShieldCheck className="w-6 h-6 text-teal-500" />
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left pb-2 w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-[11px] font-bold tracking-wider uppercase">
                    <ShieldCheck size={12} /> Verified Attorney
                  </span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 tracking-tight leading-none">
                  {lawyer.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 font-light mb-6 flex flex-col md:flex-row items-center md:items-start gap-2">
                  <span>Attorney at Law</span>
                  <span className="hidden md:inline text-slate-600">•</span>
                  <span className="text-slate-300">{lawyer.yearsOfPractice} Years of Excellence</span>
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
                    <MapPin size={14} className="text-teal-400" />
                    <span>{lawyer.city}, {lawyer.state}</span>
                  </div>
                  <a className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800 transition-colors">
                    <Mail size={14} className="text-teal-400" />
                    <span>{lawyer.email}</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons (Hero) */}
            <div className="w-full md:w-auto pb-2 flex justify-center md:block space-y-4">
              <button
                onClick={() => { setBookingMode(true); fetchslots(); }}
                className="w-full group relative bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-teal-900/20 hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Book Consultation</span>
                <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {hasChatAccess && (
                <button
                  onClick={async () => {
                    const roomRes = await getChatRoom({ lawyerId: lawyer?.id as string });
                    if (roomRes.success) {
                      router.push(`/user/chat/${roomRes.data.id}`);
                    }
                  }}
                  className="w-full group relative bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-full border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} className="text-teal-400" />
                  <span>Message Lawyer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION STRIP */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'expertise', label: 'Expertise', icon: Scale },

              { id: 'reviews', label: 'Reviews', icon: Star },

            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-2 py-4 text-sm font-semibold text-slate-600 hover:text-teal-600 border-b-2 border-transparent hover:border-teal-600 transition-all whitespace-nowrap"
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID */}
      {!bookingMode ? (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column (Main Info) */}
            <div className="lg:col-span-2 space-y-10">

              {/* Bio */}
              <section id="overview" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-teal-50 rounded-xl">
                    <BookOpen className="text-teal-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">About {lawyer.name}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                  {lawyer.bio}
                </p>
              </section>

              {/* Expertise */}
              <section id="expertise" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-teal-50 rounded-xl">
                    <Scale className="text-teal-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Areas of Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {lawyer.practiceAreas?.map((area, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-default">
                      {area}
                    </span>
                  ))}
                </div>
              </section>

              {/* Highlights Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold text-teal-400 mb-1">{lawyer.yearsOfPractice}+</div>
                  <div className="text-sm text-slate-400">Years Experience</div>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{lawyer.languages?.length}</div>
                  <div className="text-sm text-slate-500">Languages Spoken</div>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                  <div className="text-sm text-slate-500">Client Satisfaction</div>
                </div>
              </section>

              {/* 6. REVIEWS SECTION (Moved to Main Column) */}
              {reviews.length > 0 && (
                <section id="reviews" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-teal-50 rounded-xl">
                      <MessageSquare className="text-teal-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Client Reviews ({reviews.length})</h2>
                  </div>

                  {reviews.length > 10 ? (
                    <div className="relative overflow-hidden w-full">
                      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                      <motion.div
                        className="flex gap-4"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                          repeat: Infinity,
                          ease: "linear",
                          duration: Math.max(20, reviews.length * 2)
                        }}
                      >
                        {[...reviews, ...reviews].map((review: any, i) => (
                          <div key={`${review._id}-${i}`} className="w-[300px] flex-shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-3">
                              <img src={review.userImage || "/default-user.jpg"} alt={review.userName} className="w-8 h-8 rounded-full object-cover bg-slate-200" />
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{review.userName || "Anonymous"}</div>
                                <div className="flex text-amber-400 text-xs">
                                  {[...Array(5)].map((_, r) => (
                                    <Star key={r} size={10} fill={r < review.rating ? "currentColor" : "none"} className={r < review.rating ? "" : "text-slate-200"} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm line-clamp-3">{review.comment}</p>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={review.userImage || "/default-user.jpg"} alt={review.userName} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{review.userName || "Anonymous"}</div>
                              <div className="flex text-amber-400 gap-0.5">
                                {[...Array(5)].map((_, r) => (
                                  <Star key={r} size={12} fill={r < review.rating ? "currentColor" : "none"} className={r < review.rating ? "" : "text-slate-200"} />
                                ))}
                              </div>
                            </div>
                            <div className="ml-auto text-xs text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">

              {/* Sticky Booking Card (Mobile only shows at bottom or inline, Desktop sticky) */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg shadow-slate-200/50 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Consultation Fee</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900"> ₹{lawyer.consultationFee || 2000}</span>
                      <span className="text-sm text-slate-400">/ hr</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  </div>
                </div>

                <button
                  onClick={() => { setBookingMode(true); fetchslots(); }}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2 mb-4"
                >
                  <Calendar size={18} />
                  Book Appointment
                </button>

                <div className="text-center text-xs text-slate-400">
                  Avg. response time: &lt; 2 hours
                </div>
              </div>

              {/* Credentials Sidebar */}
              <div id="credentials" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm scroll-mt-24">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="text-teal-500" size={18} /> Credentials
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500">Bar Number</span>
                    <span className="font-medium text-slate-900 text-right">{lawyer.barNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500">Admitted</span>
                    <span className="font-medium text-slate-900 text-right">{lawyer.barAdmissionDate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Languages</span>
                    <span className="font-medium text-slate-900 text-right">
                      {lawyer.languages?.join(", ")}
                    </span>
                  </div>
                </div>
              </div>


              {/* Review Section - Only if hasChatAccess (implies booking) */}
              {hasChatAccess && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-8">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="text-amber-400" size={18} fill="currentColor" />
                    Write a Review
                  </h3>
                  {reviews.some((r: any) => r.userId === user.id) ? (
                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-sm font-medium">
                      You have already reviewed this lawyer. Thank you for your feedback!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={star <= rating ? "text-amber-400" : "text-slate-300"}
                              fill={star <= rating ? "currentColor" : "none"}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience working with this lawyer..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 min-h-[120px] resize-none"
                      />
                      <button
                        onClick={handleReviewSubmit}
                        disabled={isSubmittingReview}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* 4. BOOKING MODE VIEW */
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

            {/* Header */}
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <div>
                <h2 className="text-2xl font-bold">Book Appointment</h2>
                <p className="text-slate-400 text-sm mt-1">Select a date and time for your consultation with {lawyer.name}</p>
              </div>
              <button
                onClick={() => setBookingMode(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Calendar Side */}
              <div className="p-8 border-r border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={20} /></button>
                  <span className="font-bold text-lg text-slate-800">
                    {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                  </span>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ChevronRight size={20} /></button>
                </div>

                <div className="grid grid-cols-7 text-center mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <span key={d} className="text-xs font-bold text-slate-400 uppercase">{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array(new Date(currentYear, currentMonth, 1).getDay()).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                  {calendarDays.map((day) => {
                    const past = isPastDate(day.date);
                    const deadline = searchParams.get('deadline');
                    const beyondDeadline = deadline ? new Date(day.date) > new Date(deadline) : false;
                    const isSelected = selectedDate === day.date;
                    return (
                      <button
                        key={day.date}
                        disabled={!day.available || past || beyondDeadline}
                        onClick={() => !past && !beyondDeadline && setSelectedDate(day.date)}
                        className={`h-10 rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-teal-600 text-white shadow-md' :
                          day.available && !past && !beyondDeadline ? 'hover:bg-teal-50 text-slate-700 hover:text-teal-700' :
                            'text-slate-300 cursor-not-allowed'
                          }`}
                      >
                        {parseInt(day.date.split("-")[2])}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots Side */}
              <div className="p-8 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 mb-4 h-8 flex items-center">
                  {selectedDate ? `Available on ${selectedDate}` : "Select a date to view slots"}
                </h3>

                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-3">
                    {slots.filter(s => s.date === selectedDate && !isPastSlot(s.date, s.startTime)).map(slot => (

                      <button

                        key={slot.id}

                        disabled={slot.isBooked}
                        onClick={() => {
                          if (!slot.isBooked) {
                            setSelectedTime(prev => prev?.start === slot.startTime ? null : { start: slot.startTime, end: slot.endTime });
                            setConsultationFee(slot.consultationFee);
                            setSelectedSlotId(slot.id);
                          }
                        }}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedTime?.start === slot.startTime ? 'bg-teal-600 text-white border-teal-600 shadow-md' :
                          slot.isBooked ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' :
                            'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600'
                          }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                    {slots.filter(s => s.date === selectedDate).length === 0 && (
                      <p className="col-span-full text-slate-500 italic text-sm">No slots available.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <Calendar size={48} className="mb-2 opacity-20" />
                    <p>Please select a date from the calendar</p>
                  </div>
                )}

                {selectedTime && (
                  <div className="mt-6 mb-4 p-4 bg-teal-50 border border-teal-100 rounded-xl flex justify-between items-center animate-fadeIn">
                    <span className="text-slate-600 font-medium">Consultation Fee</span>
                    <span className="text-xl font-bold text-teal-700">₹{consultationFee}</span>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setBookingSlot(true)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedDate && selectedTime
                      ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {searchParams.get('rescheduleBookingId') ? 'Confirm New Slot' : 'Continue to Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-900">Confirm Details</h3>
              <button onClick={() => setBookingSlot(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Time</span>
                  <span className="font-medium text-slate-900">{selectedTime?.start} - {selectedTime?.end}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base">
                  <span className="font-bold text-slate-700">Total Fee</span>
                  <span className="font-bold text-teal-600">₹{consultationFee}</span>
                </div>
              </div>

              {/* Payment Method Selection - */}
              {!searchParams.get('rescheduleBookingId') && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'online'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                        }`}
                    >
                      <ExternalLink size={20} className="mb-1" />
                      <span className="text-xs font-bold uppercase">Online Payment</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('wallet')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'wallet'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                        }`}
                    >
                      <span className="text-xs font-bold uppercase">Wallet (₹{walletBalance})</span>
                    </button>
                  </div>
                  {paymentMethod === 'wallet' && walletBalance < (consultationFee || 0) && (
                    <p className="text-red-500 text-[10px] font-medium animate-pulse">
                      Insufficient balance. Please choose online payment.
                    </p>
                  )}
                </div>
              )}

              {/* Consultation Notes - Only if not rescheduling */}
              {!searchParams.get('rescheduleBookingId') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Notes</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your legal concern..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 h-24 resize-none"
                  />
                </div>
              )}

              <button
                onClick={searchParams.get('rescheduleBookingId') ? handleReschedule : (paymentMethod === 'online' ? HandlePayment : handleWalletPayment)}
                disabled={isProcessing || (!searchParams.get('rescheduleBookingId') && paymentMethod === 'wallet' && walletBalance < (consultationFee || 0))}
                className={`w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-lg ${isProcessing || (!searchParams.get('rescheduleBookingId') && paymentMethod === 'wallet' && walletBalance < (consultationFee || 0))
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'
                  }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  searchParams.get('rescheduleBookingId') ? "Confirm Reschedule" : (paymentMethod === 'online' ? "Pay Securely & Book" : "Confirm Wallet Payment")
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}