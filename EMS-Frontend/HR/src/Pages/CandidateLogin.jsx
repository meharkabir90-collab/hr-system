import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginCandidate } from "../Services/candidateAuthService";

function CandidateLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await loginCandidate(formData);
      localStorage.setItem("candidateToken", response.token);
      localStorage.setItem("candidate", JSON.stringify(response.candidate));
      alert(response.message);
      navigate(location.state?.returnTo || "/candidate-dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Candidate login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-24 flex items-center justify-center bg-blue-1000" style={{ fontFamily: "times-new-roman" }}>
      <div className="w-full max-w-md p-4 rounded-xl shadow-lg hover:shadow-xl">
        <h1
          className="text-5xl font-bold text-center mb-12 text-sky-400"
          style={{ fontFamily: "times-new-roman" }}
        >
          Candidate Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-black"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-black"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 hover:bg-black disabled:bg-black disabled:cursor-not-allowed text-white py-3 rounded-md"
          >
            {loading ? "Logging In..." : "Login as Candidate"}
          </button>
        </form>

        <p className="flex justify-center text-sm text-center mt-5 text-black gap-4">
          New candidate? <Link to={{ pathname: "/candidate-register", state: location.state }} className="text-green-500 font-semibold">Register</Link>
        </p>
        <p className="flex justify-center text-sm text-center mt-3 text-black">
          Internal user? <Link to="/login" className="text-green-500 font-semibold">Internal Login</Link>
        </p>
      </div>
    </div>
  );
}

export default CandidateLogin;