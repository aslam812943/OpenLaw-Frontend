"use client";

import { getallLawyers } from "@/service/lawyerService";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  List,
  ChevronRight,
  ShieldCheck,
  Phone
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

import Pagination from "@/components/common/Pagination";

const AllLawyers = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterPracticeArea, setFilterPracticeArea] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 1;


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
    setCurrentPage(1);
  }, [debouncedSearch, sort, filterPracticeArea]);

  useEffect(() => {
    async function fetchUpdated() {
      const res = await getallLawyers({
        search: debouncedSearch,
        sort,
        practiceArea: filterPracticeArea,
        page: currentPage,
        limit,
      });


      const list = res?.data?.response?.lawyers;
      const total = res?.data?.response?.totalCount || 0;



      if (Array.isArray(list)) {
        setLawyers(list);
        setTotalItems(total);
      }
    }

    fetchUpdated();
  }, [debouncedSearch, sort, filterPracticeArea, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* High Impact Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/20 z-10" />
          <img
            src="/lawyerssearch.jpg"
            alt="Legal Team"
            className="w-full h-full object-cover object-top opacity-200"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 py-20 md:py-32 flex flex-col items-start gap-8">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <span className="text-teal-500 font-bold tracking-widest uppercase text-sm">Open Law | Legal Group</span>
            <div className="h-px w-12 bg-teal-800"></div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight font-serif text-white">
              The experts that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 italic font-serif pr-2">
                stand behind you.
              </span>
            </h1>
          </motion.div>

          {/* CTA & Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-8 items-start md:items-center mt-6"
          >
            <button className="group relative px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-wider text-sm transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
              <span className="relative z-10 flex items-center gap-2">
                Get Your Free Consultation
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                    <UserIcon /> {/* Placeholder for user avatars */}
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-sm">
                <span className="text-teal-400 font-bold">#1 Rated Firm</span>
                <span className="text-xs text-slate-400">Criminal & Civil Defense</span>
              </div>
            </div>
          </motion.div>

          {/* Award Badge Floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="hidden lg:flex absolute right-0 bottom-10 bg-gradient-to-br from-slate-800 to-slate-900 p-4 border border-slate-700 shadow-2xl rounded-lg items-center gap-4 max-w-xs"
          >
            <div className="bg-teal-900/50 p-3 rounded-full border border-teal-500/30">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Region's Best</p>
              <p className="text-slate-400 text-xs">Voted #1 for Client Satisfaction three years in a row.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Bar Section */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Search Input */}
          <div className="relative w-full md:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:bg-white hover:shadow-md"
              placeholder="Find your legal expert by name or area..."
            />
          </div>

          {/* Quick Filters / Sort */}
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="block w-full md:w-48 pl-4 pr-10 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer hover:border-teal-500 transition-colors"
            >
              <option value="">Sort: Relevance</option>
              <option value="experience-desc">Experience: High to Low</option>
              <option value="experience-asc">Experience: Low to High</option>
            </select>
          </div>
        </div>
      </div>


      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-teal-600" />
                Filters
              </h2>
              <button
                onClick={() => {
                  setSearch("");
                  setSort("");
                  setFilterPracticeArea("");
                  setLocationFilter("");
                  setExperienceFilter("");
                  setFeeFilter("");
                }}
                className="text-sm text-teal-600 hover:text-teal-800 font-semibold transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Specialization Filter */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => toggleFilter('specialization')}
                className="flex items-center justify-between w-full text-left mb-4 group"
              >
                <span className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">Specialization</span>
                {expandedFilters.specialization ? <ChevronUp size={18} className="text-slate-400 group-hover:text-teal-600" /> : <ChevronDown size={18} className="text-slate-400 group-hover:text-teal-600" />}
              </button>

              {expandedFilters.specialization && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3">
                  {['Criminal Law', 'Family Law', 'Corporate Law', 'Property Law', 'Immigration Law', 'Personal Injury'].map((area) => (
                    <label key={area} className="flex items-center cursor-pointer group hover:bg-slate-50 p-2 rounded-lg -mx-2 transition-colors">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="specialization"
                          checked={filterPracticeArea === area.split(' ')[0].toLowerCase()}
                          onChange={() => setFilterPracticeArea(area.split(' ')[0].toLowerCase())}
                          className="peer h-4 w-4 border-2 border-slate-300 text-teal-600 focus:ring-teal-600 rounded-full cursor-pointer checked:border-teal-600"
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{area}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </div>

          </div>

          {/* Main Content - Lawyer List */}
          <div className="flex-1">
            {lawyers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 text-center px-4">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                  <Search className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No professionals found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">We couldn't find any lawyers matching your current filters. Try adjusting your search criteria.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSort("");
                    setFilterPracticeArea("");
                  }}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {lawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar Column */}
                      <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
                        <div className="relative">
                          <img
                            src={lawyer.profileImage || "/default.jpg"}
                            alt={lawyer.name}
                            className="w-28 h-28 md:w-32 md:h-32 rounded-xl object-cover shadow-lg group-hover:shadow-teal-100 transition-all"
                          />
                          <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-md">
                            <ShieldCheck className="w-6 h-6 text-teal-500 fill-teal-50" />
                          </div>
                        </div>
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < 4 ? "currentColor" : "currentColor"} className={i < 4 ? "" : "text-amber-200"} />
                          ))}
                        </div>
                      </div>

                      {/* Content Column */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{lawyer.name}</h3>
                              <p className="text-sm text-slate-500 font-medium">{lawyer.city || "New York"}, {lawyer.state || "NY"}</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                              <Star className="w-3 h-3 fill-current" />
                              Top Rated
                            </span>
                          </div>

                          <p className="text-teal-600 font-bold text-sm mb-4 uppercase tracking-wide flex items-center gap-2">
                            {lawyer.practiceAreas?.[0] || "Legal Consultant"}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-teal-500" />
                              <span className="font-medium">{lawyer.yearsOfPractice || 5}+ Years Exp.</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={16} className="text-teal-500" />
                              <span className="font-medium">Min ₹{lawyer.consultationFee || 200} / hr</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <button
                            onClick={() => { clickHandle(lawyer.userId) }}
                            className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-sm uppercase tracking-wide"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => clickHandle(lawyer.userId)}
                            className="flex-1 py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-md hover:shadow-teal-200 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}


            {lawyers.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  limit={limit}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-2">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

export default AllLawyers;
