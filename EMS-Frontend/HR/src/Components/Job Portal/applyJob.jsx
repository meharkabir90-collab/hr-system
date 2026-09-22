import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitJobApplication } from "../../Services/jobApplication";

const defaultFormData = {
  applicantName: "",
  email: "",
  phone: "",
  experience: "",
  resume: "",
  coverLetter: "",
  portfolio: "",
};

function ApplyJob() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

    if (!candidate || !localStorage.getItem("candidateToken")) {
      navigate("/candidate-login", {
        state: { returnTo: `/vacancies/apply/${jobId}` },
        replace: true,
      });
      return;
    }

    setFormData((current) => ({
      ...current,
      applicantName: candidate.name || "",
      email: candidate.email || "",
    }));
  }, [jobId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        job: jobId,
        ...formData,
      };

      const response = await submitJobApplication(payload);
      alert(response?.message || "Application submitted successfully");
      navigate("/vacancies");
    } catch (error) {
      console.error("Application submit error:", error);
      alert(error?.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <button
          type="button"
          onClick={() => navigate("/vacancies")}
          className="mb-4 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700"
        >
          ← Back to vacancies
        </button>

        <h1 className="text-3xl font-bold text-slate-900">Apply for this Role</h1>
        <p className="text-slate-500 mt-2">Share your details and submit your application.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resume URL</label>
            <input
              type="url"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio URL</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="6"
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you're a good fit..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyJob;
