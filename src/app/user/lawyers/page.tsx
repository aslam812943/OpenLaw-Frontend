"use client";

import { getallLawyers } from "@/service/lawyerService";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Filter,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List
} from "lucide-react";

interface Lawyer {
  id: string;
  userId: string;
  profileImage: string;
  name: string;
  email: string;
  phone: string;
  yearsOfPractice?: number;
  practiceAreas?: string[];
  city?: string;
  state?: string;
  consultationFee?: number;
  // rating?: number; // Mocked for now if not in API
  // reviewCount?: number; // Mocked for now
}

const AllLawyers = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterPracticeArea, setFilterPracticeArea] = useState("");

  // Additional filters state (visual for now, can be hooked up if API supports)
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState("");

  const router = useRouter();
  const debouncedSearch = useDebounce(search, 500);

  const [expandedFilters, setExpandedFilters] = useState({
    specialization: true,
    location: true,
    experience: true,
    fee: true,
    availability: true
  });

  const toggleFilter = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clickHandle = (id: string) => {

    router.push(`/user/lawyers/${id}`);
  };

  useEffect(() => {
    async function fetchUpdated() {
      const res = await getallLawyers({
        search: debouncedSearch,
        sort,
        practiceArea: filterPracticeArea,
      });

      const list = res?.data?.response?.lawyers;
      if (Array.isArray(list)) setLawyers(list);
    }

    fetchUpdated();
  }, [debouncedSearch, sort, filterPracticeArea]);

  useEffect(() => {
    async function fetchLawyers() {
      const res = await getallLawyers();
      const list = res?.data?.response?.lawyers;
      if (Array.isArray(list)) {
        setLawyers(list);
      }
    }

    fetchLawyers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-30 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Search Bar */}
          <div className="relative w-full md:max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00b33c] focus:border-[#00b33c] sm:text-sm transition-shadow shadow-sm hover:shadow-md"
              placeholder="Search by lawyer name, specialization, or location..."
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap hidden md:block">Sort by:</span>
            <div className="relative w-full md:w-48">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-[#00b33c] focus:border-[#00b33c] sm:text-sm rounded-lg shadow-sm cursor-pointer appearance-none bg-white"
              >
                <option value="">Relevance</option>
                <option value="experience-desc">Experience: High to Low</option>
                <option value="experience-asc">Experience: Low to High</option>
                {/* <option value="fee-asc">Fee: Low to High</option>
                <option value="fee-desc">Fee: High to Low</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <LayoutGrid size={16} className="hidden" /> {/* Just a placeholder for icon if needed */}
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => {
                  setSearch("");
                  setSort("");
                  setFilterPracticeArea("");
                  setLocationFilter("");
                  setExperienceFilter("");
                  setFeeFilter("");
                }}
                className="text-sm text-[#00b33c] hover:text-[#00992e] font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Specialization Filter */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleFilter('specialization')}
                className="flex items-center justify-between w-full text-left mb-2 group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-[#00b33c] transition-colors">Specialization</span>
                {expandedFilters.specialization ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.specialization && (
                <div className="space-y-2 mt-2">
                  {['Criminal Law', 'Family Law', 'Corporate Law', 'Property Law', 'Immigration Law', 'Personal Injury'].map((area) => (
                    <label key={area} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="specialization"
                        checked={filterPracticeArea === area.split(' ')[0].toLowerCase()}
                        onChange={() => setFilterPracticeArea(area.split(' ')[0].toLowerCase())}
                        className="h-4 w-4 text-[#00b33c] focus:ring-[#00b33c] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">{area}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleFilter('location')}
                className="flex items-center justify-between w-full text-left mb-2 group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-[#00b33c] transition-colors">Location</span>
                {expandedFilters.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.location && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter city or state"
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#00b33c] focus:ring-1 focus:ring-[#00b33c] outline-none bg-gray-50"
                  />
                </div>
              )} */}
            {/* </div> */}

            {/* Experience Filter */}
            <div className="border-b border-gray-200 pb-4">
              {/* <button
                onClick={() => toggleFilter('experience')}
                className="flex items-center justify-between w-full text-left mb-2 group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-[#00b33c] transition-colors">Experience</span>
                {expandedFilters.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button> */}
              {/* {expandedFilters.experience && (
                <div className="space-y-2 mt-2">
                  {['0-5 years', '5-10 years', '10-20 years', '20+ years'].map((exp) => (
                    <label key={exp} className="flex items-center cursor-pointer group">
                      <input type="checkbox" className="h-4 w-4 text-[#00b33c] focus:ring-[#00b33c] border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">{exp}</span>
                    </label>
                  ))}
                </div>
              )} */}
            </div>

            {/* Consultation Fee Filter */}
            {/* <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleFilter('fee')}
                className="flex items-center justify-between w-full text-left mb-2 group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-[#00b33c] transition-colors">Consultation Fee</span>
                {expandedFilters.fee ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.fee && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$500+</span>
                  </div>
                  <input type="range" min="0" max="500" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00b33c]" />
                  <div className="text-center text-sm font-medium text-[#00b33c] bg-[#e6ffe6] py-1 rounded">Up to $500</div>
                </div>
              )}
            </div> */}

          </div>

          {/* Main Content - Lawyer List */}
          <div className="flex-1">
            {lawyers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No lawyers found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSort("");
                    setFilterPracticeArea("");
                  }}
                  className="mt-4 text-[#00b33c] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {lawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6"
                  >
                    {/* Avatar Section */}
                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                      <img
                        src={lawyer.profileImage || "/default.jpg"}
                        alt={lawyer.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                      />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
                            {/* Mock Top Lawyer Badge */}
                            <span className="bg-[#e6ffe6] text-[#00b33c] text-xs font-bold px-2 py-0.5 rounded-full">
                              Top Lawyer
                            </span>
                          </div>
                        </div>

                        <p className="text-[#00b33c] font-bold text-sm mb-3 uppercase tracking-wide">
                          {lawyer.practiceAreas?.[0] || "Legal Consultant"}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400" />
                            <span>{lawyer.yearsOfPractice || 5}+ years experience</span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{lawyer.city || "New York"}, {lawyer.state || "NY"}</span>
                          </div> */}
                          {/* <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <span className="font-medium text-gray-900">4.8</span>
                            <span className="text-gray-400">(120 reviews)</span>
                          </div> */}
                        </div>

                        {/* <div className="flex items-center gap-2 mb-4">
                          <DollarSign size={18} className="text-[#00b33c]" />
                          <span className="text-lg font-bold text-gray-900">
                            ${lawyer.consultationFee || 200}
                          </span>
                          <span className="text-gray-500 text-sm">consultation fee</span>
                        </div> */}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <button
                          onClick={() => { clickHandle(lawyer.userId) }}
                          className="flex-1 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => clickHandle(lawyer.userId)}
                          className="flex-1 py-2.5 px-4 bg-[#00b33c] text-white font-bold rounded-lg hover:bg-[#00992e] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLawyers;
