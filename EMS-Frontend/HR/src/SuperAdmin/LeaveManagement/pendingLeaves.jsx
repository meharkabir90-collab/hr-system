import { useEffect, useState } from "react";

import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from "../../Services/leaveService";

function PendingLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // Fetch Pending Leaves
  // ============================================

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPendingLeaves();

      console.log("PENDING LEAVES RESPONSE:", response);

      if (response?.success) {
        setLeaves(response.leaves || []);
      } else {
        setError(
          response?.message || "Failed to load pending leaves"
        );
      }
    } catch (error) {
      console.error("PENDING LEAVES ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load pending leaves"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  // ============================================
  // Format Date
  // ============================================

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ============================================
  // Approve Leave
  // ============================================

  const handleApprove = async (id) => {
    try {
      const response = await approveLeave(id);

      console.log("APPROVE LEAVE RESPONSE:", response);

      alert(
        response?.message || "Leave approved successfully"
      );

      // Refresh pending leaves
      fetchPendingLeaves();

    } catch (error) {
      console.error("APPROVE LEAVE ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Failed to approve leave"
      );
    }
  };

  // ============================================
  // Reject Leave
  // ============================================

  const handleReject = async (id) => {
    try {
      const response = await rejectLeave(
        id,
        "Rejected by manager"
      );

      console.log("REJECT LEAVE RESPONSE:", response);

      alert(
        response?.message || "Leave rejected successfully"
      );

      // Refresh pending leaves
      fetchPendingLeaves();

    } catch (error) {
      console.error("REJECT LEAVE ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Failed to reject leave"
      );
    }
  };

  // ============================================
  // Loading
  // ============================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">
          Loading pending leaves...
        </p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Pending Leaves
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review and manage pending leave requests from your team.
        </p>
      </div>


      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* Stats */}

      <div className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">

        <p className="text-sm text-gray-500">
          Pending Requests
        </p>

        <p className="mt-1 text-3xl font-bold text-sky-600">
          {leaves.length}
        </p>

      </div>


      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Employee
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Leave Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Start Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  End Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Reason
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-100">

              {leaves.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No pending leave requests.
                  </td>

                </tr>

              ) : (

                leaves.map((leave) => (

                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50"
                  >

                    {/* Employee */}

                    <td className="px-5 py-4">

                      <div>

                        <p className="font-medium text-gray-800">
                          {leave.employee?.name || "--"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {leave.employee?.email || "--"}
                        </p>

                      </div>

                    </td>


                    {/* Leave Type */}

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {leave.leaveType || "--"}
                    </td>


                    {/* Start Date */}

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(leave.startDate)}
                    </td>


                    {/* End Date */}

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(leave.endDate)}
                    </td>


                    {/* Reason */}

                    <td className="max-w-xs px-5 py-4 text-sm text-gray-600">
                      {leave.reason || "--"}
                    </td>


                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleApprove(leave._id)
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Approve
                        </button>


                        <button
                          onClick={() =>
                            handleReject(leave._id)
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Reject
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default PendingLeaves;

