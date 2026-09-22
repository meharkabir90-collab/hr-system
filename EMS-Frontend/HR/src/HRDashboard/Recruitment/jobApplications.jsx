import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
	getAllApplications,
	getApplicationsByJob,
	updateApplicationStatus,
} from "../../Services/jobApplication";
import LoadingSpinner from "../../Components/LoadingSpinner";

const applicationStatuses = [
	"Applied",
	"Reviewed",
	"Shortlisted",
	"Rejected",
	"Interviewed",
	"Selected"
];

function JobApplications() {
	const location = useLocation();
	const [applications, setApplications] = useState([]);
	const [jobId, setJobId] = useState("");
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);

	const loadApplications = async (filterJobId = "") => {
		try {
			setLoading(true);
			const response = filterJobId
				? await getApplicationsByJob(filterJobId)
				: await getAllApplications();
			setApplications(response.applications || response.data || []);
		} catch (error) {
			console.error("Failed to fetch job applications:", error);
			alert(error?.response?.data?.message || "Failed to load job applications");
			setApplications([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadApplications();
	}, []);

	const handleFilter = (event) => {
		event.preventDefault();
		loadApplications(jobId.trim());
	};

	const handleClearFilter = () => {
		setJobId("");
		loadApplications();
	};

	const handleStatusChange = async (applicationId, status) => {
		try {
			setUpdatingId(applicationId);
			const response = await updateApplicationStatus(applicationId, status);
			const updatedApplication = response.application;

			setApplications((currentApplications) =>
				currentApplications.map((application) =>
					application._id === applicationId
						? updatedApplication || { ...application, status }
						: application
				)
			);
		} catch (error) {
			console.error("Failed to update application status:", error);
			alert(error?.response?.data?.message || "Failed to update application status");
		} finally {
			setUpdatingId(null);
		}
	};

	const basePath = location.pathname.startsWith("/superadmin")
		? "/superadmin"
		: "/hr";

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
					<p className="text-gray-500 mt-1">
						Review candidates and update their application status.
					</p>
				</div>

				<form onSubmit={handleFilter} className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-3">
					<input
						type="text"
						value={jobId}
						onChange={(event) => setJobId(event.target.value)}
						placeholder="Filter by job ID"
						className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
					>
						Filter
					</button>
					<button
						type="button"
						onClick={handleClearFilter}
						className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300"
					>
						Show All
					</button>
				</form>

				<div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Candidate</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Job</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Contact</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Experience</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Links</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{loading ? (
									<tr>
										<td colSpan="6" className="px-6 py-4"><LoadingSpinner label="Loading applications..." size="sm" /></td>
									</tr>
								) : applications.length === 0 ? (
									<tr>
										<td colSpan="6" className="px-6 py-10 text-center text-gray-500">No applications found.</td>
									</tr>
								) : (
									applications.map((application) => (
										<tr key={application._id} className="hover:bg-gray-50 align-top">
											<td className="px-6 py-4">
												<div className="font-semibold text-gray-900">{application.applicantName}</div>
												<div className="text-sm text-gray-500">{application.email}</div>
											</td>
											<td className="px-6 py-4 text-gray-700">
												<div>{application.job?.title || "Unknown job"}</div>
												<div className="text-xs text-gray-500">{application.job?.department?.name || application.job?.department || ""}</div>
											</td>
											<td className="px-6 py-4 text-gray-700">{application.phone}</td>
											<td className="px-6 py-4 text-gray-700">{application.experience || "Not specified"}</td>
											<td className="px-6 py-4">
												<select
													value={application.status}
													disabled={updatingId === application._id}
													onChange={(event) => handleStatusChange(application._id, event.target.value)}
													className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
												>
													{applicationStatuses.map((status) => (
														<option key={status} value={status}>{status}</option>
													))}
												</select>
											</td>
											<td className="px-6 py-4">
												<div className="flex flex-col gap-1 text-sm">
													{application.resume && <a href={application.resume} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Resume</a>}
													{application.portfolio && <a href={application.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Portfolio</a>}
													{!application.resume && !application.portfolio && <span className="text-gray-400">None</span>}
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				<button
					type="button"
					onClick={() => window.history.back()}
					className="mt-5 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
				>
					Back to dashboard
				</button>
				<span className="sr-only">Current portal: {basePath}</span>
			</div>
		</div>
	);
}

export default JobApplications;
