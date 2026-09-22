import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addHR } from "../../Services/superAdminService";

function AddHR() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);

		try {
			const response = await addHR(formData);
			alert(response.message || "HR account created successfully");
			navigate("/superadmin/hr-portal");
		} catch (error) {
			alert(error.response?.data?.message || "Failed to create HR account");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="mx-auto max-w-2xl">
				<button
					type="button"
					onClick={() => navigate("/superadmin/hr-portal")}
					className="mb-4 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
				>
					Back
				</button>

				<h1 className="mb-1 text-3xl font-bold text-gray-800">Add HR Admin</h1>
				<p className="mb-6 text-gray-500">Create an HR administrator account.</p>

				<form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-md">
					{[
						["name", "Full Name", "text"],
						["username", "Username", "text"],
						["email", "Email", "email"],
						["password", "Password", "password"],
						["confirmPassword", "Confirm Password", "password"],
					].map(([name, label, type]) => (
						<label key={name} className="block text-sm font-medium text-gray-700">
							{label}
							<input
								type={type}
								name={name}
								value={formData[name]}
								onChange={handleChange}
								required
								className="mt-1 w-full rounded-md border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</label>
					))}

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{loading ? "Creating..." : "Create HR Account"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default AddHR;
