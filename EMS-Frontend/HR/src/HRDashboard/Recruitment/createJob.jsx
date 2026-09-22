import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createJob, getJobById, updateJob } from "../../Services/jobService";
import { getDepartment } from "../../Services/departmentService";

const defaultFormData = {
  title: "",
  department: "",
  description: "",
  location: "Remote",
  employmentType: "Full Time",
  experience: "0-2 years",
  salaryRange: {
    min: "",
    max: "",
  },
  requirements: "",
  responsibilities: "",
  status: "Open",
  applicationDeadline: "",
  isActive: true,
};

function CreateJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/superadmin") ? "/superadmin/recruitment" : "/hr/recruitment";
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(defaultFormData);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartment();
        setDepartments(data.departments || data.data || []);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    const loadJob = async () => {
      if (!isEditMode) return;

      try {
        setPageLoading(true);
        const response = await getJobById(id);
        const job = response.job || response.data || response;

        setFormData({
          title: job.title || "",
          department: job.department?._id || job.department || "",
          description: job.description || "",
          location: job.location || "Remote",
          employmentType: job.employmentType || "Full Time",
          experience: job.experience || "0-2 years",
          salaryRange: {
            min: job.salaryRange?.min ?? "",
            max: job.salaryRange?.max ?? "",
          },
          requirements: (job.requirements || []).join("\n"),
          responsibilities: (job.responsibilities || []).join("\n"),
          status: job.status || "Open",
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline).toISOString().split("T")[0]
            : "",
          isActive: job.isActive !== false,
        });
      } catch (error) {
        console.error("Failed to load job:", error);
        alert(error?.response?.data?.message || "Failed to load job details.");
      } finally {
        setPageLoading(false);
      }
    };

    loadJob();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "min" || name === "max") {
      setFormData((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salaryRange: {
          min: Number(formData.salaryRange.min || 0),
          max: Number(formData.salaryRange.max || 0),
        },
        requirements: formData.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        responsibilities: formData.responsibilities
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        applicationDeadline: formData.applicationDeadline || null,
      };

      if (isEditMode) {
        const response = await updateJob(id, payload);
        alert(response.message || "Job updated successfully");
      } else {
        const response = await createJob(payload);
        alert(response.message || "Job created successfully");
      }

      navigate(basePath);
    } catch (error) {
      console.error("Job submit failed:", error);
      alert(error?.response?.data?.message || "Something went wrong while saving the job.");
    } finally {
      setLoading(false);
    }
  };

  const backPath = basePath;

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Loading job details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(backPath)}
          className="mb-4 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Job" : "Create New Job"}
            </h1>
            <p className="text-gray-500 mt-2">
              {isEditMode ? "Update vacancy details and requirements." : "Add a new vacancy to the recruitment pipeline."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Remote / Hybrid / On-site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0-2 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active vacancy
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                <input
                  type="number"
                  name="min"
                  value={formData.salaryRange.min}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                <input
                  type="number"
                  name="max"
                  value={formData.salaryRange.max}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="90000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe the role, responsibilities, and expectations"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (one per line)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="React&#10;Node.js&#10;Strong communication skills"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities (one per line)
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Develop frontend features&#10;Fix bugs&#10;Collaborate with design team"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(backPath)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Job" : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;
