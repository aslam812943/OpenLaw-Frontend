'use client'

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  fetchLawyers,
  Lawyer,
  blockLawyer,
  unBlockLawyer,
  approveLawyer,
  rejectLawyer,
} from "@/service/lawyerService";
import AdminSidebar from "../../../components/AdminSIdeBar";
import Pagination from "@/components/common/Pagination";
import { showToast } from "@/utils/alerts";
import { confirmAction } from "@/utils/confirmAction";

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [total, setTotal] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const loadLawyers = async (pageNum: number) => {
    try {
      setLoading(true);
      const { lawyers, total } = await fetchLawyers(pageNum, limit);
      setLawyers(lawyers);
      setTotal(total);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to load lawyers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLawyers(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  const handleAction = async (
    type: string,
    id: string,
    email?: string,
    reason?: string
  ) => {
    try {
      let confirmed = false;

      if (type === "Block") {
        confirmed = await confirmAction(
          "Block Lawyer?",
          "Are you sure you want to block this lawyer? They will lose access to their account.",
          "Yes, Block",
          "warning"
        );
      } else if (type === "Unblock") {
        confirmed = await confirmAction(
          "Unblock Lawyer?",
          "Are you sure you want to unblock this lawyer? They will regain access to their account.",
          "Yes, Unblock",
          "warning"
        );
      } else if (type === "Approve") {
        confirmed = await confirmAction(
          "Approve Lawyer?",
          "Confirm approval for this lawyer’s verification request.",
          "Yes, Approve",
          "success"
        );
      } else if (type === "Reject") {
        confirmed = await confirmAction(
          "Reject Lawyer?",
          "Are you sure you want to reject this lawyer’s application?",
          "Yes, Reject",
          "warning"
        );
      }

      if (!confirmed) return;

      if (type === "Block") {
        await blockLawyer(id);
        showToast("success", "Lawyer blocked successfully.");
        setLawyers((prev) =>
          prev.map((l) => (l.id === id ? { ...l, isBlock: true } : l))
        );
        if (selectedLawyer?.id === id)
          setSelectedLawyer((prev) => (prev ? { ...prev, isBlock: true } : prev));

      } else if (type === "Unblock") {
        await unBlockLawyer(id);
        showToast("success", "Lawyer unblocked successfully.");
        setLawyers((prev) =>
          prev.map((l) => (l.id === id ? { ...l, isBlock: false } : l))
        );
        if (selectedLawyer?.id === id)
          setSelectedLawyer((prev) => (prev ? { ...prev, isBlock: false } : prev));

      } else if (type === "Approve") {
        await approveLawyer(id, email!);
        showToast("success", "Lawyer approved successfully.");
        setLawyers((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, isAdminVerified: true, verificationStatus: "Approved" }
              : l
          )
        );
        setSelectedLawyer((prev) =>
          prev
            ? { ...prev, isAdminVerified: true, verificationStatus: "Approved" }
            : prev
        );

      } else if (type === "Reject") {
        await rejectLawyer(id, email!, reason);
        showToast("warning", "Lawyer rejected successfully.");
        setLawyers((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, isAdminVerified: false, verificationStatus: "Rejected" }
              : l
          )
        );
        setSelectedLawyer((prev) =>
          prev
            ? { ...prev, isAdminVerified: false, verificationStatus: "Rejected" }
            : prev
        );
      }
    } catch (error: any) {
      showToast("error", `Failed to ${type.toLowerCase()} lawyer. Please try again.`);
    }
  };


  const handleRejectClick = async () => {
    const confirmed = await confirmAction(
      "Reject Lawyer?",
      "Do you really want to reject this lawyer? You’ll need to provide a reason.",
      "Continue to Reject",
      "warning"
    );
    if (confirmed) setShowRejectModal(true);
  };

  //  Confirm rejection with reason
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      showToast("error", "Please enter a rejection reason.");
      return;
    }

    if (selectedLawyer) {
      await handleAction("Reject", selectedLawyer.id, selectedLawyer.email, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  return (
    <div >

      <div

      >
        <h1 className="text-2xl font-semibold mb-6 text-white">Lawyer Management</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading lawyers...</p>
        ) : lawyers.length === 0 ? (
          <p className="text-center text-gray-500">No lawyers found.</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Years</th>
                    <th className="px-4 py-3">Practice Area</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Blocked</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lawyers.map((lawyer) => (
                    <tr
                      key={lawyer.id}
                      className="border-b hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-3 font-medium">{lawyer.name}</td>
                      <td className="px-4 py-3">{lawyer.email}</td>
                      <td className="px-4 py-3">{lawyer.phone}</td>
                      <td className="px-4 py-3">{lawyer.yearsOfPractice}</td>
                      <td className="px-4 py-3">
                        {lawyer.practiceAreas?.[0] || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {lawyer.verificationStatus === "Approved" ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            Approved
                          </span>
                        ) : lawyer.verificationStatus === "Rejected" ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            Rejected
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lawyer.isBlock ? (
                          <span className="text-red-600 font-medium">Blocked</span>
                        ) : (
                          <span className="text-green-600 font-medium">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedLawyer(lawyer)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalItems={total}
                limit={limit}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </>
        )}

        {/* ✅ Lawyer Detail Modal */}
        {selectedLawyer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 relative max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Lawyer Profile Details</h2>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <p><span className="font-medium">Name:</span> {selectedLawyer.name}</p>
                <p><span className="font-medium">Email:</span> {selectedLawyer.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedLawyer.phone}</p>
                <p><span className="font-medium">Bar Number:</span> {selectedLawyer.barNumber}</p>
                <p><span className="font-medium">Bar Admission:</span> {selectedLawyer.barAdmissionDate}</p>
                <p><span className="font-medium">Years of Practice:</span> {selectedLawyer.yearsOfPractice}</p>
                <p><span className="font-medium">Verified:</span> {selectedLawyer.isVerified ? "Yes" : "No"}</p>
                <p><span className="font-medium">Blocked:</span> {selectedLawyer.isBlock ? "Yes" : "No"}</p>
                <p><span className="font-medium">Status:</span> {selectedLawyer.verificationStatus}</p>
                <p className="col-span-2"><span className="font-medium">Practice Areas:</span> {selectedLawyer.practiceAreas.join(", ")}</p>
                <p className="col-span-2"><span className="font-medium">Languages:</span> {selectedLawyer.languages.join(", ")}</p>
              </div>

              {/* ✅ Documents */}
              <div className="mb-5">
                <h3 className="text-base font-semibold mb-2">Uploaded Documents</h3>
                {selectedLawyer.documentUrls.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedLawyer.documentUrls.map((url, index) => (
                      <li key={index} className="flex justify-between items-center border-b pb-1">
                        <span>Document {index + 1}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded.</p>
                )}
              </div>

              {/* ✅ Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    handleAction(selectedLawyer.isBlock ? "Unblock" : "Block", selectedLawyer.id)
                  }
                  className={`px-4 py-2 rounded-lg ${selectedLawyer.isBlock
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                >
                  {selectedLawyer.isBlock ? "Unblock" : "Block"}
                </button>

                {selectedLawyer.verificationStatus === "pending" && (
                  <>
                    <button
                      onClick={handleRejectClick}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleAction("Approve", selectedLawyer.id, selectedLawyer.email)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ✅ Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-[500px] p-6">
              <h2 className="text-lg font-semibold mb-4">Reject Lawyer</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting this lawyer's application.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
              />
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={handleRejectCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
