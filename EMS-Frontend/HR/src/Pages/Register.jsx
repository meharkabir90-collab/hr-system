import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from '../Services/authService';


function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await register(formData);
      alert(data.message);
      navigate("/");
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
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-black"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-black"
            required
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-black"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-black"
            required
          >
            <option value="">Select internal role</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="HRAdmin">HR Admin</option>
            <option value="SuperAdmin">Super Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 hover:bg-black disabled:bg-black disabled:cursor-not-allowed text-white py-3 rounded-md flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="flex justify-center text-sm text-center mt-5 text-black gap-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 font-semibold">
            Login
          </Link>
        </p>
        <p className="flex justify-center text-sm text-center mt-3 text-black">
          Applying for a job?{" "}
          <Link to="/candidate-register" className="text-green-500 font-semibold">
            Register as Candidate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;