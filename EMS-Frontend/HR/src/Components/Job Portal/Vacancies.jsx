import { useEffect, useState } from "react";
import { BriefcaseBusiness, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../../Services/jobService";

function Vacancies() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleApply = (jobId) => {
    const candidate = localStorage.getItem("candidate");
    const applicationPath = `/vacancies/apply/${jobId}`;

    if (!candidate || !localStorage.getItem("candidateToken")) {
      navigate("/candidate-login", { state: { returnTo: applicationPath } });
      return;
    }

    navigate(applicationPath);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getJobs({ isActive: true, status: "Open" });
        const jobList = response.jobs || response.data || [];
        setJobs(jobList);
        if (jobList.length > 0) {
          setSelectedJob(jobList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="border-b border-[#17221e]/15 bg-[#f5f1e8] px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left text-[#17221e]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4643a] text-white">
              <BriefcaseBusiness size={20} />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">PeopleFirst</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-[#53635b]">Careers</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/candidate-login")}
              className="hidden items-center gap-2 px-3 py-2 text-sm font-semibold text-[#53635b] hover:text-[#17221e] sm:flex"
            >
              <LogIn size={17} /> Candidate login
            </button>
            <button
              type="button"
              onClick={() => navigate("/candidate-register")}
              className="rounded-full bg-[#17221e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#304139]"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Career Opportunities</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Available Vacancies</h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            Loading job openings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            No open positions right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_2fr] gap-6">
            <div className="space-y-4">
              {jobs.map((job) => (
                <button
                  key={job._id}
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left rounded-xl border p-5 shadow-sm transition ${
                    selectedJob?._id === job._id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {job.department?.name || "Department"} • {job.location || "Remote"}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {job.employmentType || "Full Time"}
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-slate-600">
                    {job.salaryRange?.min && job.salaryRange?.max
                      ? `$${job.salaryRange.min} - $${job.salaryRange.max}`
                      : "Salary negotiable"}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
              {selectedJob ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Open Role</p>
                      <h2 className="text-3xl font-bold text-slate-900 mt-2">{selectedJob.title}</h2>
                    </div>

                    <span className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
                      {selectedJob.employmentType || "Full Time"}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-medium text-slate-800">Department</div>
                      <div className="mt-1">{selectedJob.department?.name || "N/A"}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-medium text-slate-800">Location</div>
                      <div className="mt-1">{selectedJob.location || "Remote"}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-medium text-slate-800">Experience</div>
                      <div className="mt-1">{selectedJob.experience || "Not specified"}</div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-900">Role Description</h3>
                    <p className="mt-3 text-slate-600 leading-7">{selectedJob.description}</p>
                  </div>

                  <div className="mt-8 grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Requirements</h3>
                      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-600">
                        {(selectedJob.requirements || []).length > 0 ? (
                          selectedJob.requirements.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                        ) : (
                          <li>No specific requirements listed.</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Responsibilities</h3>
                      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-600">
                        {(selectedJob.responsibilities || []).length > 0 ? (
                          selectedJob.responsibilities.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                        ) : (
                          <li>No responsibilities listed.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                    <div className="text-sm text-slate-600">
                      {selectedJob.applicationDeadline
                        ? `Apply before: ${new Date(selectedJob.applicationDeadline).toLocaleDateString()}`
                        : "No application deadline set"}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApply(selectedJob._id)}
                      className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Apply Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-500">Select a vacancy to view details.</div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Vacancies;
