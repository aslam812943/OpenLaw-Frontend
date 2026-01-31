import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
}) => {
  const safeTotalItems = Number.isNaN(Number(totalItems)) ? 0 : Number(totalItems);
  const safeLimit = (Number.isNaN(Number(limit)) || Number(limit) <= 0) ? 10 : Number(limit);
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safeLimit));

  if (safeTotalItems === 0) return null;

  return (
    <div className="flex justify-between items-center mt-6 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">
        Showing page <span className="text-teal-600">{currentPage}</span> of <span className="text-teal-600">{totalPages}</span> ({safeTotalItems} total results)
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-5 py-2.5 border rounded-lg text-sm font-bold transition-all ${currentPage === 1
            ? "border-slate-300 text-slate-400 cursor-not-allowed bg-slate-50"
            : "border-teal-600 text-teal-600 hover:bg-teal-50 hover:border-teal-700 hover:shadow-md"
            }`}
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-5 py-2.5 border rounded-lg text-sm font-bold transition-all ${currentPage === totalPages
            ? "border-slate-300 text-slate-400 cursor-not-allowed bg-slate-50"
            : "border-teal-600 text-teal-600 hover:bg-teal-50 hover:border-teal-700 hover:shadow-md"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
