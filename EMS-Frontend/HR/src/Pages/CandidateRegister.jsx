import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerCandidate } from "../Services/candidateAuthService";

function CandidateRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await registerCandidate(formData);
      localStorage.setItem("candidateToken", response.token);
      localStorage.setItem("candidate", JSON.stringify(response.candidate));
      alert(response.message);
      navigate(location.state?.returnTo || "/candidate-dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Candidate registration failed");
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
          Candidate Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["username", "Username", "text"],
            ["name", "Full Name", "text"],
            ["email", "Email", "email"],
            ["password", "Password", "password"],
            ["confirmPassword", "Confirm Password", "password"],
          ].map(([name, placeholder, type]) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border rounded-md p-3 text-black"
              required
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 hover:bg-black disabled:bg-black disabled:cursor-not-allowed text-white py-3 rounded-md"
          >
            {loading ? "Creating Account..." : "Create Candidate Account"}
          </button>
        </form>

        <p className="flex justify-center text-sm text-center mt-5 text-black gap-4">
          Already have an account? <Link to={{ pathname: "/candidate-login", state: location.state }} className="text-green-500 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default CandidateRegister;