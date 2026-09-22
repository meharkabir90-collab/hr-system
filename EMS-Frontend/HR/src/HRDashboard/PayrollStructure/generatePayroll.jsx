import { useState } from "react";
import { generatePayroll } from "../../Services/payrollService";

function GeneratePayroll() {
	const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
	const currentYear = new Date().getFullYear();

	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleGenerate = async () => {
		try {
			setLoading(true);
			setError("");
			setMessage("");

			const response = await generatePayroll({ month, year });

			if (response?.success) {
				setMessage(response.message || "Payroll generated successfully.");
			} else {
				setError(response?.message || "Failed to generate payroll.");
			}
		} catch (err) {
			console.error("Generate payroll page error:", err);
			setError(err?.response?.data?.message || "Unable to generate payroll right now.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
				<h1 className="text-3xl font-bold text-gray-800">Generate Payroll</h1>
				<p className="mt-2 text-gray-500">
					Create payroll records for the selected month and year.
				</p>

				{message && (
					<div className="mt-5 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
						{message}
					</div>
				)}

				{error && (
					<div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
						{error}
					</div>
				)}

				<div className="mt-6 space-y-5">
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">Month</label>
						<select
							value={month}
							onChange={(e) => setMonth(e.target.value)}
							className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{[
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
								"July",
								"August",
								"September",
								"October",
								"November",
								"December",
							].map((item) => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">Year</label>
						<input
							type="number"
							min="2020"
							value={year}
							onChange={(e) => setYear(Number(e.target.value))}
							className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="button"
						onClick={handleGenerate}
						disabled={loading}
						className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{loading ? "Generating..." : "Generate Payroll"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default GeneratePayroll;
