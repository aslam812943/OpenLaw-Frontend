import React, { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

interface Option {
    label: string;
    value: string;
}

interface ReusableFilterBarProps {
    onSearch: (value: string) => void;
    onFilterChange?: (value: string) => void;
    onSortChange?: (value: string) => void;
    onDateChange?: (value: string) => void;
    filterOptions?: Option[];
    sortOptions?: Option[];
    placeholder?: string;
    initialSearch?: string;
    initialFilter?: string;
    initialSort?: string;
    initialDate?: string;
}

export const FilterBar: React.FC<ReusableFilterBarProps> = ({
    onSearch,
    onFilterChange,
    onSortChange,
    onDateChange,
    filterOptions = [],
    sortOptions = [],
    placeholder = "Search...",
    initialSearch = "",
    initialFilter = "",
    initialSort = "",
    initialDate = "",
}) => {
    const [searchValue, setSearchValue] = useState(initialSearch);
    const [selectedFilter, setSelectedFilter] = useState(initialFilter);
    const [selectedSort, setSelectedSort] = useState(initialSort);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const isFirstMount = React.useRef(true);
    const lastNotifiedSearch = React.useRef(initialSearch);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        if (searchValue === lastNotifiedSearch.current) {
            return;
        }

        const timer = setTimeout(() => {
            onSearch(searchValue);
            lastNotifiedSearch.current = searchValue;
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue, onSearch]);

    const handleFilterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value !== selectedFilter) {
            setSelectedFilter(value);
            if (onFilterChange) onFilterChange(value);
        }
    };

    const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value !== selectedSort) {
            setSelectedSort(value);
            if (onSortChange) onSortChange(value);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedDate(value);
        if (onDateChange) onDateChange(value);
    };

    const clearFilters = () => {
        setSearchValue("");
        setSelectedFilter("");
        setSelectedSort("");
        setSelectedDate("");
        onSearch("");
        if (onFilterChange) onFilterChange("");
        if (onSortChange) onSortChange("");
        if (onDateChange) onDateChange("");
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {searchValue && (
                    <button
                        onClick={() => setSearchValue("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {/* Filter Dropdown */}
                {filterOptions.length > 0 && (
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        <select
                            value={selectedFilter}
                            onChange={handleFilterSelect}
                            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm appearance-none cursor-pointer hover:bg-gray-50 min-w-[140px]"
                        >
                            <option value="">All Status</option>
                            {filterOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                )}

                {/* Sort Dropdown */}
                {sortOptions.length > 0 && (
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        <select
                            value={selectedSort}
                            onChange={handleSortSelect}
                            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm appearance-none cursor-pointer hover:bg-gray-50 min-w-[140px]"
                        >
                            <option value="">Sort By</option>
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                )}

                {/* Date Filter */}
                {onDateChange && (
                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm cursor-pointer hover:bg-gray-50 min-w-[140px]"
                        />
                    </div>
                )}

                {/* Reset Button */}
                {(selectedFilter || selectedSort || searchValue || selectedDate) && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
};
