import { useEffect, useState } from "react";
import { BriefcaseBusiness, LogOut, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyCandidateApplications } from "../../Services/candidateAuthService";
import LoadingSpinner from "../LoadingSpinner";

const statusStyles = {
  Applied: "bg-blue-100 text-blue-700",
  Reviewed: "bg-amber-100 text-amber-700",
  Shortlisted: "bg-green-100 text-green-700",
  Interviewed: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
};

function CandidateDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  useEffect(() => {
    if (!candidate || !localStorage.getItem("candidateToken")) {
      navigate("/candidate-login", { replace: true });
      return;
    }

    const loadApplications = async () => {
      try {
        const response = await getMyCandidateApplications();
        setApplications(response.applications || []);
      } catch (requestError) {
        console.error("Failed to load candidate applications:", requestError);
        setError(requestError.response?.data?.message || "Failed to load your applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [candidate, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("candidate");
    localStorage.removeItem("candidateToken");
    navigate("/candidate-login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#17221e]">
      <nav className="border-b border-[#17221e]/15 bg-[#f5f1e8] px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4643a] text-white">
              <BriefcaseBusiness size={20} />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">PeopleFirst</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-[#53635b]">Candidate space</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden items-center gap-2 text-sm font-semibold text-[#53635b] md:flex">
              <UserRound size={17} /> {candidate?.name || "Candidate"}
            </span>
            <button
              type="button"
              onClick={() => navigate("/vacancies")}
              className="inline-flex items-center gap-2 rounded-full border border-[#17221e]/20 px-4 py-2.5 text-sm font-semibold hover:bg-white"
            >
              <Search size={16} /> Vacancies
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-[#17221e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#304139]"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e4643a]">Candidate dashboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Your applications</h1>
          <p className="mt-3 max-w-xl text-lg leading-8 text-[#53635b]">
            Keep track of every role you have applied for and the latest hiring status.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white shadow-sm">
            <LoadingSpinner label="Loading your applications..." />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-[#17221e]/10 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">No applications yet</h2>
            <p className="mx-auto mt-2 max-w-md text-[#53635b]">Browse open roles and submit your first application.</p>
            <button
              type="button"
              onClick={() => navigate("/vacancies")}
              className="mt-6 rounded-full bg-[#e4643a] px-6 py-3 font-bold text-white hover:bg-[#c9522d]"
            >
              Browse vacancies
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {applications.map((application) => (
              <article key={application._id} className="rounded-2xl border border-[#17221e]/10 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#53635b]">Application</p>
                    <h2 className="mt-2 text-2xl font-bold">{application.job?.title || "Job application"}</h2>
                    <p className="mt-1 text-sm text-[#53635b]">{application.job?.location || "Location not specified"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[application.status] || "bg-gray-100 text-gray-700"}`}>
                    {application.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#17221e]/10 pt-5 text-sm">
                  <div>
                    <p className="text-[#53635b]">Submitted</p>
                    <p className="mt-1 font-semibold">{new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[#53635b]">Employment type</p>
                    <p className="mt-1 font-semibold">{application.job?.employmentType || "Not specified"}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CandidateDashboard;
