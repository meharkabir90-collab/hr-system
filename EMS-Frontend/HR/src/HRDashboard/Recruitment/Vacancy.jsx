import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getJobs, deleteJob, closeJob } from "../../Services/jobService";
import LoadingSpinner from "../../Components/LoadingSpinner";

function Vacancy() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/superadmin") ? "/superadmin/recruitment" : "/hr/recruitment";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs();
      setJobs(response.jobs || response.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      alert(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(id);
      alert("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      console.error("Delete job failed:", error);
      alert(error?.response?.data?.message || "Failed to delete job");
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm("Do you want to close this vacancy?")) return;

    try {
      await closeJob(id);
      alert("Job closed successfully");
      fetchJobs();
    } catch (error) {
      console.error("Close job failed:", error);
      alert(error?.response?.data?.message || "Failed to close job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
            <p className="text-gray-500 mt-1">Manage open and closed vacancies.</p>
          </div>

          <button
            onClick={() => navigate(`${basePath}/add`)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
          >
            + Create Job
          </button>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <LoadingSpinner label="Loading vacancies..." size="sm" />
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {job.department?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{job.employmentType}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : job.status === "Draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {job.salaryRange?.min && job.salaryRange?.max
                          ? `$${job.salaryRange.min} - $${job.salaryRange.max}`
                          : "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => navigate(`${basePath}/${job._id}/edit`)}
                            className="px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleClose(job._id)}
                            className="px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-sm"
                          >
                            Close
                          </button>

                          <button
                            onClick={() => handleDelete(job._id)}
                            className="px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
                          >
                            Delete
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
    </div>
  );
}

export default Vacancy;
