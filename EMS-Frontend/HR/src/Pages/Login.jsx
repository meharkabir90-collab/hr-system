import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from '../Services/authService';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const data = await login(formData);
      alert(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      const dashboardByRole = {
        SuperAdmin: "/superadmin/dashboard",
        HRAdmin: "/hr/dashboard",
        Manager: "/manager/dashboard",
        Employee: "/employee/dashboard",
      };

      navigate(dashboardByRole[data.user.role] || "/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="min-h-screen mt-24 flex items-center justify-center bg-blue-1000">
      <div className="w-full max-w-md p-4 rounded-xl shadow-lg hover:shadow-xl">
        <h1
          className="text-5xl font-bold text-center mb-12 text-sky-400"
          style={{ fontFamily: "times-new-roman" }}
        >
          Login
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
            className="w-full bg-sky-400 hover:bg-black disabled:bg-black
             disabled:cursor-not-allowed text-white py-3 rounded-md flex items-center justify-center gap-2"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="flex justify-center text-sm text-center mt-5 text-black gap-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-500 font-semibold">
            Create Account
          </Link>
        </p>
        <p className="flex justify-center text-sm text-center mt-3 text-black">
          Are you a candidate?{" "}
          <Link to="/candidate-login" className="text-green-500 font-semibold">
            Candidate Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;