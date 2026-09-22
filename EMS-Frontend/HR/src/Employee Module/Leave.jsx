import { useEffect, useState } from "react";

import {
    applyLeave, getMyLeaves
} from '../Services/leaveService'

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    totalDays: "",
    reason: "",
    approvedBy: "",
    approvedAt: ""
  });

  // Get employee's leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const data = await getMyLeaves();

      setLeaves(data.leaves || []);
    } catch (error) {
      console.error(
        "Get leaves error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Apply for leave
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await applyLeave(formData);

      alert("Leave applied successfully!");

      setFormData({
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        totalDays: "",
        reason: "",
      });

      fetchLeaves();
    } catch (error) {
      console.error(
        "Apply leave error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to apply for leave"
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-sky-50 p-4 md:p-6 lg:p-8"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sky-400 font-semibold text-sm uppercase tracking-wide">
            Employee Portal
          </p>

        <h1 className="text-4xl font-bold text-sky-900">
          Leave Management
        </h1>

        <p className="text-base text-sky-700 mt-1">
          Apply for leave and track your leave requests
        </p>
      </div>

      {/* Apply Leave Section */}
      <div className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-sky-600 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            Apply for Leave
          </h2>

          <p className="text-sm text-sky-100 mt-1">
            Submit a new leave request
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Leave Type */}
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">
                Leave Type
              </label>

              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full border border-sky-200 rounded-lg px-4 py-3 text-base bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              >
                <option value="Casual">Casual</option>
                <option value="Sick">Sick</option>
                <option value="Annual">Annual</option>
                <option value="Emergency">Emergency</option>
                <option value="Maternity">Maternity</option>
                <option value="Paternity">Paternity</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-sky-200 rounded-lg px-4 py-3 text-base bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border border-sky-200 rounded-lg px-4 py-3 text-base bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              />
            </div>

            {/* Total Days */}
            <div>
              <label className="block text-base font-bold text-slate-700 mb-2">
                Total Days
              </label>

              <input
                type="number"
                name="totalDays"
                value={formData.totalDays}
                onChange={handleChange}
                min="1"
                required
                placeholder="Enter total days"
                className="w-full border border-sky-200 rounded-lg px-4 py-3 text-base bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              />
            </div>

            {/* Reason */}
            <div className="md:col-span-2">
              <label className="block text-base font-bold text-slate-700 mb-2">
                Reason
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter reason for leave"
                className="w-full border border-sky-200 rounded-lg px-4 py-3 text-base bg-sky-50 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-7">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-base px-7 py-3 rounded-lg shadow-sm transition duration-200"
            >
              Apply Leave
            </button>
          </div>
        </form>
      </div>

      {/* My Leave Requests */}
      <div className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden">
        {/* Header */}
        <div className="bg-sky-600 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            My Leave Requests
          </h2>

          <p className="text-sm text-sky-100 mt-1">
            View the status of your submitted leave requests
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-base text-sky-700">
                Loading leaves...
              </p>
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-10 bg-sky-50 rounded-xl">
              <p className="text-lg font-bold text-sky-800">
                No Leave Requests
              </p>

              <p className="text-sm text-slate-500 mt-1">
                You have not submitted any leave requests yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sky-100">
                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Leave Type
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Start Date
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      End Date
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Total Days
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Reason
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Status
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Approved By
                    </th>

                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Approved At
                    </th>
                    <th className="border border-sky-200 px-4 py-3 text-left text-base font-bold text-sky-900">
                      Rejection Reason
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr
                      key={leave._id}
                      className="hover:bg-sky-50 transition"
                    >
                      <td className="border border-sky-100 px-4 py-3 text-base text-slate-700">
                        {leave.leaveType}
                      </td>

                      <td className="border border-sky-100 px-4 py-3 text-sm text-slate-600">
                        {new Date(
                          leave.startDate
                        ).toLocaleDateString()}
                      </td>

                      <td className="border border-sky-100 px-4 py-3 text-sm text-slate-600">
                        {new Date(
                          leave.endDate
                        ).toLocaleDateString()}
                      </td>

                      <td className="border border-sky-100 px-4 py-3 text-base font-bold text-slate-700">
                        {leave.totalDays || "-"}
                      </td>

                      <td className="border border-sky-100 px-4 py-3 text-sm text-slate-600">
                        {leave.reason}
                      </td>

                      <td className="border border-sky-100 px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status || "Pending"}
                        </span>
                      </td>
                      <td className="border border-sky-100 px-4 py-3 text-sm text-slate-600">
                             {leave.approvedBy?.name || "--"}
                      </td>

                      <td className="border border-sky-100 px-4 py-3 text-sm text-slate-600">
                           {leave.approvedAt
                            ? new Date(leave.approvedAt).toLocaleString()
                               : "--"}
                      </td>
                      <td className="border border-sky-100 px-4 py-3 text-sm text-slate-600">
                          {leave.rejectionReason || "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leave;


