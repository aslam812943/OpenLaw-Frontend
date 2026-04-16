'use client'


import { useEffect, useState } from "react";
import { showToast } from "@/utils/alerts";
import { fetchUsers, blockUser, unBlockUser } from "@/service/userService";
import Pagination from "../../../components/common/Pagination";
import type { IUser } from "@/types/user";
import { Eye } from "lucide-react";
import { confirmAction } from "@/utils/confirmAction";
import { ReusableTable, Column } from "@/components/admin/shared/ReusableTable";
import { FilterBar } from "@/components/admin/shared/ReusableFilterBar";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const formatPhone = (phone: unknown): string => {
    if (phone === null || phone === undefined) return "Not provided";
    const value = String(phone).trim();
    if (!value || value.toLowerCase() === "nan" || value.toLowerCase() === "undefined" || value.toLowerCase() === "null") {
      return "Not provided";
    }
    return value;
  };

  const loadUsers = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetchUsers(pageNum, limit, search, filter, sort);
      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotal(response.data.total);
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      showToast("error", (e as Error).message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(page);
  }, [page, search, filter, sort]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };


  const handleAction = async (type: string, id: string) => {
    try {
      const user = users.find((u) => u._id === id);
      if (!user) return;

      const confirmed = await confirmAction(
        type === "Block" ? `Block ${user.name}?` : `Unblock ${user.name}?`,
        type === "Block"
          ? "Are you sure you want to block this user? They will lose access until unblocked."
          : "Are you sure you want to unblock this user? They will regain access to their account.",
        type === "Block" ? "Yes, Block" : "Yes, Unblock",
        "warning",
        // type === "Block" ? "#dc2626" : "#10b981"
      );

      if (!confirmed) return;

      if (type === "Block") {
        const response = await blockUser(id);
        showToast("success", response || "User blocked successfully.");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlock: true } : u))
        );
        if (selectedUser?._id === id)
          setSelectedUser((prev) =>
            prev ? { ...prev, isBlock: true } : prev
          );
      } else if (type === "Unblock") {
        const response = await unBlockUser(id);
        showToast("success", response || "User unblocked successfully.");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlock: false } : u))
        );
        if (selectedUser?._id === id)
          setSelectedUser((prev) =>
            prev ? { ...prev, isBlock: false } : prev
          );
      }
    } catch (err: unknown) {
      showToast(
        "error",
        `Failed to ${type.toLowerCase()} user. Please try again.`
      );
    }
  };

  const totalPages = Math.ceil(total / limit);

  const columns: Column<IUser>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Phone",
      render: (u) => formatPhone(u.phone),
    },
    {
      header: "Status",
      render: (u) =>
        u.isBlock ? (
          <span className="text-red-600 font-medium">Blocked</span>
        ) : (
          <span className="text-green-600 font-medium">Active</span>
        ),
    },
    {
      header: "Action",
      className: "text-center",
      render: (u) => (
        <button
          onClick={() => setSelectedUser(u)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye size={20} />
        </button>
      ),
    },
  ];

  return (
    <div>

      <div

      >
        <h1 className="text-2xl text-white font-semibold mb-6">User Management</h1>


        {error ? (
          <div className="p-6 text-red-500 text-center">Error: {error}</div>
        ) : (
          <>
            <FilterBar
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              placeholder="Search users..."
              variant="dark"
              filterOptions={[
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
              ]}
              sortOptions={[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Name (A-Z)", value: "name-asc" },
                { label: "Name (Z-A)", value: "name-desc" },
              ]}
            />
            <ReusableTable
              columns={columns}
              data={users}
              isLoading={loading}
              emptyMessage="No users found."
              variant="dark"
            />
          </>
        )}

        {/* Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#111111] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-[#161616]">
                <h2 className="text-lg font-semibold text-white">User Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-[#1a1a1a] border border-slate-800 rounded-xl p-3">
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Name</p>
                    <p className="text-slate-100 font-medium mt-1">{selectedUser.name || "Not provided"}</p>
                  </div>
                  <div className="bg-[#1a1a1a] border border-slate-800 rounded-xl p-3">
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Email</p>
                    <p className="text-slate-100 font-medium mt-1 break-all">{selectedUser.email || "Not provided"}</p>
                  </div>
                  <div className="bg-[#1a1a1a] border border-slate-800 rounded-xl p-3">
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Phone</p>
                    <p className="text-slate-100 font-medium mt-1">{formatPhone(selectedUser.phone)}</p>
                  </div>
                  <div className="bg-[#1a1a1a] border border-slate-800 rounded-xl p-3">
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Status</p>
                    <p className={`font-semibold mt-1 ${selectedUser.isBlock ? "text-rose-400" : "text-emerald-400"}`}>
                      {selectedUser.isBlock ? "Blocked" : "Active"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-[#161616]">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      selectedUser.isBlock ? "Unblock" : "Block",
                      selectedUser._id
                    )
                  }
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${selectedUser.isBlock
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                    }`}
                >
                  {selectedUser.isBlock ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/*  Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalItems={total}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
}
