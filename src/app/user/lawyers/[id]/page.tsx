'use client'

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";

import { getSingleLawyer, getallslots } from "@/service/lawyerService";

import { handlepayAndBook } from "@/service/userService";


import { Mail, Phone, MapPin, Award, Menu, ArrowRight, Scale, Calendar, Globe, CheckCircle, BookOpen, Briefcase, Languages, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface LawyerData {

  id: string;

  barNumber: string;

  barAdmissionDate: string;

  yearsOfPractice: number;

  practiceAreas: string[];

  languages: string[];

  address: string;

  city: string;

  state: string;

  name: string;

  email: string;

  phone: string;

  profileImage: string;

  bio: string;

}

export default function LawyersSinglePage() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.user);
  const [calendarDays, setCalendarDays] = useState<{ date: string, available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<{ start: string; end: string } | null>(null);
const [selectedSlotId,setSelectedSlotId] = useState<string|null>(null)
  const [lawyer, setLawyer] = useState<LawyerData | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingMode, setBookingMode] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(false);
  const [consultationFee, setConsultationFee] = useState<number | undefined>(0);
  const [description, setDescription] = useState("");

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchLawyer() {
      try {
       
        const response = await getSingleLawyer(`${id}`);
        
        setLawyer(response.data as unknown as LawyerData);
      } catch (error) {
        console.error("Failed to fetch lawyer", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLawyer();
    }
  }, [id]);

  const isPastDate = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const passedDate = new Date(date);
    return passedDate < today;
  };




  function generateMonthDays(year: number, month: number, availableDates: string[]) {
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();

    // Create empty slots for days before the first day of the month
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

    if (response) {
      setSlots(response.data);
      setConsultationFee(response.data.consultationFee);
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

    const obj = {
      userId: user.id,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      date: selectedDate,
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      consultationFee: consultationFee,
      description,
      slotId:selectedSlotId
    }

    try {
      const response = await handlepayAndBook(obj)
      if (response?.data?.url) {
        window.location.href = response.data.url
      } else {
        alert("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Payment failed. Please check console for details.");
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00b33c]"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <p className="text-xl text-white">Lawyer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-[#1A1A1A] text-white pt-10 pb-0 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            {/* Left: Text Content */}
            <div className="pb-16 md:pb-24 z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#00b33c] mb-4 leading-tight">
                {lawyer.name}
              </h1>
              <p className="text-white text-lg font-medium mb-8">
                Attorney at Law • {lawyer.yearsOfPractice} Years Experience
              </p>


              {/* Contact Icons Row */}
              <div className="flex flex-col sm:flex-row gap-6 text-sm font-medium tracking-wide">
                {/* Email */}
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-full border border-white/30 group-hover:border-[#00b33c] transition-colors">
                    <Mail size={16} />
                  </div>
                  <a href={`mailto:${lawyer.email}`} className="border-b border-transparent group-hover:border-[#00b33c] transition-all">
                    {lawyer.email}
                  </a>
                </div>
                {/* Phone */}
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-full border border-white/30 group-hover:border-[#00b33c] transition-colors">
                    <Phone size={16} />
                  </div>
                  <a href={`tel:${lawyer.phone}`} className="border-b border-transparent group-hover:border-[#00b33c] transition-all">
                    {lawyer.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 mt-6 text-[#00b33c]">
                <MapPin size={18} fill="currentColor" stroke="none" />
                <span className="text-gray-300 font-medium">
                  {lawyer.city}, {lawyer.state}
                </span>
              </div>
            </div>

            {/* Right: Lawyer Image */}
            <div className="relative h-full min-h-[400px] flex items-end justify-center md:justify-end">
              <img
                src={lawyer.profileImage || "https://via.placeholder.com/400"}
                alt={lawyer.name}
                className="w-full max-w-sm md:max-w-md object-cover rounded-t-xl md:rounded-t-none shadow-2xl md:shadow-none"
                style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Enhanced Navigation Strip --- */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto py-4 no-scrollbar">
            {[
              { href: "#overview", label: "Overview", icon: BookOpen },
              { href: "#expertise", label: "Expertise", icon: Scale },
              { href: "#credentials", label: "Credentials", icon: Award },
              { href: "#contact", label: "Contact", icon: Phone },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#00b33c] transition-colors whitespace-nowrap group"
              >
                <Icon size={16} className="group-hover:scale-110 transition-transform" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT SECTION ===== */}
      {!bookingMode ? (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== LEFT COLUMN: MAIN CONTENT ===== */}
            <div className="lg:col-span-2 space-y-8">
              {/* Biography Section */}
              <section id="overview" className="scroll-mt-24">
                <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10 border-l-4 border-l-[#00b33c] shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#e6ffe6] flex items-center justify-center">
                      <BookOpen className="text-[#00b33c]" size={20} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Professional Biography</h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="text-base md:text-lg whitespace-pre-line">{lawyer.bio}</p>
                  </div>
                </div>
              </section>

              {/* Practice Areas Section */}
              <section id="expertise" className="scroll-mt-24">
                <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#e6ffe6] flex items-center justify-center">
                      <Scale className="text-[#00b33c]" size={20} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Areas of Expertise</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(lawyer.practiceAreas || []).map((area, index) => (
                      <div
                        key={index}
                        className="group p-4 rounded-lg bg-gray-50 hover:bg-[#e6ffe6] border border-gray-200 hover:border-[#00b33c] transition-all duration-300 cursor-default"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#00b33c] group-hover:scale-125 transition-transform" />
                          <span className="font-medium text-gray-700 capitalize">{area}</span>
                        </div>
                      </div>
                    ))}
                    {(!lawyer.practiceAreas || lawyer.practiceAreas.length === 0) && (
                      <p className="col-span-2 text-gray-500 italic">No areas listed</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Professional Experience Highlight */}
              <section className="scroll-mt-24">
                <div className="bg-gradient-to-br from-[#e6ffe6] to-transparent border border-gray-200 rounded-xl p-8 md:p-10 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Briefcase className="text-[#00b33c]" size={20} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Professional Highlights</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-[#00b33c] mb-2">{lawyer.yearsOfPractice}+</div>
                      <div className="text-sm font-medium text-gray-600">Years of Practice</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-[#00b33c] mb-2">{lawyer.practiceAreas?.length || 0}</div>
                      <div className="text-sm font-medium text-gray-600">Practice Areas</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-[#00b33c] mb-2">{lawyer.languages?.length || 0}</div>
                      <div className="text-sm font-medium text-gray-600">Languages Spoken</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ===== RIGHT COLUMN: SIDEBAR ===== */}
            <div className="space-y-6">
              {/* Credentials Card */}
              <section id="credentials" className="scroll-mt-24">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-[#00b33c]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#e6ffe6] flex items-center justify-center">
                      <Award className="text-[#00b33c]" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Credentials</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-[#00b33c] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Bar Admission
                          </p>
                          <p className="text-base font-semibold text-gray-700">{lawyer.barAdmissionDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Award size={18} className="text-[#00b33c] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Bar Number
                          </p>
                          <p className="text-base font-semibold text-gray-700">{lawyer.barNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Scale size={18} className="text-[#00b33c] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Experience
                          </p>
                          <p className="text-base font-semibold text-gray-700">{lawyer.yearsOfPractice} Years</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-[#00b33c] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Location
                          </p>
                          <p className="text-base font-semibold text-gray-700">
                            {lawyer.address}<br />
                            {lawyer.city}, {lawyer.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Languages Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#e6ffe6] flex items-center justify-center">
                    <Languages className="text-[#00b33c]" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Languages</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(lawyer.languages || []).map((lang, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-[#00b33c] hover:text-white transition-colors duration-200"
                    >
                      {lang}
                    </span>
                  ))}
                  {(!lawyer.languages || lawyer.languages.length === 0) && (
                    <p className="text-gray-500 italic text-sm">No languages listed</p>
                  )}
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#e6ffe6] flex items-center justify-center">
                    <Phone className="text-[#00b33c]" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Contact & Appointments</h3>
                </div>

                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#e6ffe6] border border-gray-200 hover:border-[#00b33c] transition-all duration-200 group"
                  >
                    <Phone size={18} className="text-[#00b33c]" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Phone</div>
                      <div className="text-sm font-semibold text-gray-700 group-hover:text-[#00b33c]">
                        {lawyer.phone}
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-500 group-hover:text-[#00b33c]" />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#e6ffe6] border border-gray-200 hover:border-[#00b33c] transition-all duration-200 group"
                  >
                    <Mail size={18} className="text-[#00b33c]" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Email</div>
                      <div className="text-sm font-semibold text-gray-700 group-hover:text-[#00b33c] break-all">
                        {lawyer.email}
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-500 group-hover:text-[#00b33c]" />
                  </a>
                </div>

                {/* Appointment CTA */}
                <div className="mt-6">
                  <button
                    className="w-full py-3 rounded-lg bg-[#00b33c] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#00992e] transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => { setBookingMode(true); fetchslots(); }}
                  >
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ===== BOOKING SPLIT VIEW ===== */
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Book Appointment</h2>
            <button
              onClick={() => { setBookingMode(false); setSelectedDate(null); setSelectedTime(null); }}
              className="text-gray-500 hover:text-red-500 font-medium transition-colors"
            >
              Cancel Booking
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Calendar */}
            <div className="md:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-[#00b33c]"
                    }`}
                  disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
                >
                  <ChevronLeft size={20} />
                </button>
                <p className="text-center font-semibold text-gray-700">
                  {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                </p>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00b33c] transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Empty slots for days before start of month */}
                {Array(new Date(currentYear, currentMonth, 1).getDay()).fill(null).map((_, index) => (
                  <div key={`empty-${index}`} className="py-2"></div>
                ))}
                {calendarDays.map(day => {
                  const past = isPastDate(day.date);

                  return (
                    <button
                      key={day.date}
                      disabled={!day.available || past}
                      onClick={() => !past && setSelectedDate(day.date)}
                      className={`py-2 rounded-lg text-sm font-medium border transition 
        ${past
                          ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                          : day.available
                            ? selectedDate === day.date
                              ? "bg-[#00b33c] text-white border-[#006b22]"
                              : "bg-white text-[#00b33c] border-[#00b33c] hover:bg-[#e6ffe6]"
                            : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        }
      `}
                    >
                      {day.date.split("-")[2]}
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Right Column: Time Slots & Fee */}
            <div className="md:col-span-2 space-y-6">
              {/* Consultation Fee */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Consultation Fee</h3>
                  <p className="text-sm text-gray-500">Per session</p>
                </div>
                <div className="text-2xl font-bold text-[#00b33c]">
                  {consultationFee ? `₹${consultationFee}` : ""}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Available Times for {selectedDate}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
               {slots.filter(s => s.date === selectedDate).map(slot => {

  const isSelected = selectedTime?.start === slot.startTime;

  const buttonStyle = slot.isBooked
    ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
    : isSelected
      ? "bg-[#00b33c] text-white border-[#006b22]"
      : "bg-white text-[#00b33c] border-[#00b33c] hover:bg-[#e6ffe6]";

  return (
    <button
      key={slot.id}
      disabled={slot.isBooked}
      onClick={() => {
        if (!slot.isBooked) {
          setSelectedTime(prev =>
            prev?.start === slot.startTime ? null : { start: slot.startTime, end: slot.endTime }
          );
          setConsultationFee(slot.consultationFee);
          setSelectedSlotId(slot.id);
        }
      }}
      className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${buttonStyle}`}
    >
      {slot.startTime}
    </button>
  );
})}

                    {slots.filter(s => s.date === selectedDate).length === 0 && (
                      <p className="col-span-full text-gray-500 italic">No slots available for this date.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="flex justify-end">
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setBookingSlot(true)}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all
                    ${selectedDate && selectedTime
                      ? "bg-[#00b33c] hover:bg-[#00992e] shadow-md hover:shadow-lg"
                      : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📌 BOOKING DETAILS MODAL */}
      {bookingSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setBookingSlot(false)}>
                <span className="text-2xl">✕</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-900 font-semibold">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="text-gray-900 font-semibold">{selectedTime?.start} - {selectedTime?.end}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-800 font-bold">Total Fee:</span>
                  <span className="text-[#00b33c] font-bold">₹{consultationFee}</span>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe your legal concern
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b33c] focus:border-transparent outline-none transition-all min-h-[120px]"
                  placeholder="Please briefly explain your case or reason for consultation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setBookingSlot(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 rounded-lg bg-[#00b33c] text-white font-bold hover:bg-[#00992e] shadow-md hover:shadow-lg transition-all"
                  onClick={

                    HandlePayment
                  }
                >
                  Pay & Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}