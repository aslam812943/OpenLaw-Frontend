'use client'


import { useEffect, useState } from "react";
import { showToast } from "@/utils/alerts";
import { fetchUsers, blockUser, unBlockUser } from "@/service/userService";
import Pagination from "../../../components/common/Pagination";
import type { IUser } from "@/types/user";
import { Eye } from "lucide-react";
import AdminSidebar from "../../../components/AdminSIdeBar";
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

  const loadUsers = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetchUsers(pageNum, limit, search, filter, sort);
      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotal(response.data.total);
      }
    } catch (e: any) {
      setError(e.message);
      showToast("error", e.message || "Failed to load users.");
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
    } catch (err: any) {
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
    { header: "Phone", accessor: "phone" },
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
            />
          </>
        )}

        {/* Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
              <h2 className="text-lg font-semibold mb-4">User Details</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedUser.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedUser.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedUser.phone}
                </p>
                <p>
                  <span className="font-medium">Blocked:</span>{" "}
                  {selectedUser.isBlock ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
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
                  className={`px-4 py-2 rounded-lg ${selectedUser.isBlock
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
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
