import {
	ArrowRight,
	BriefcaseBusiness,
	Building2,
	CheckCircle2,
	LogIn,
	Search,
	UserRoundPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
	const navigate = useNavigate();
	const isCandidateLoggedIn = Boolean(
		localStorage.getItem("candidate") && localStorage.getItem("candidateToken")
	);

	return (
		<main className="min-h-screen bg-[#f5f1e8] text-[#17221e]">
			<nav className="border-b border-[#17221e]/15 bg-[#f5f1e8]/95 px-6 py-5 md:px-10">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<button
						type="button"
						onClick={() => navigate("/")}
						className="flex items-center gap-3 text-left"
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
							onClick={() => navigate(isCandidateLoggedIn ? "/candidate-dashboard" : "/candidate-login")}
							className="hidden items-center gap-2 px-3 py-2 text-sm font-semibold text-[#53635b] hover:text-[#17221e] sm:flex"
						>
							<LogIn size={17} /> Candidate login
						</button>
						<button
							type="button"
							onClick={() => navigate("/vacancies")}
							className="rounded-full bg-[#17221e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#304139]"
						>
							View openings
						</button>
					</div>
				</div>
			</nav>

			<section className="relative overflow-hidden border-b border-[#17221e]/15 px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20">
				<div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border-[48px] border-[#e4643a]/25" />
				<div className="pointer-events-none absolute bottom-[-90px] left-[42%] h-52 w-52 rotate-12 border-[28px] border-[#d6a93b]/30" />

				<div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
					<div>
						<p className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-[#e4643a]">
							<span className="h-px w-8 bg-[#e4643a]" /> A better way to find work
						</p>
						<h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl">
							Bring your best work to a team that makes room for it.
						</h1>
						<p className="mt-7 max-w-xl text-lg leading-8 text-[#53635b]">
							Explore thoughtful roles, meet a people-first workplace, and take the next step in your career.
						</p>

						<div className="mt-9 flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => navigate("/vacancies")}
								className="inline-flex items-center gap-2 rounded-full bg-[#e4643a] px-6 py-3.5 font-bold text-white transition hover:bg-[#c9522d]"
							>
								Explore vacancies <ArrowRight size={18} />
							</button>
							<button
								type="button"
								onClick={() => navigate("/candidate-register")}
								className="inline-flex items-center gap-2 rounded-full border border-[#17221e]/25 px-6 py-3.5 font-bold text-[#17221e] transition hover:bg-white"
							>
								Create candidate account <UserRoundPlus size={18} />
							</button>
						</div>
					</div>

					<div className="relative min-h-[340px] overflow-hidden rounded-[2rem] bg-[#263b32] p-7 text-white shadow-xl md:p-9">
						<div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
						<div className="absolute inset-0 bg-[#263b32]/70" />
						<div className="relative flex h-full flex-col justify-between">
							<div className="flex items-center justify-between">
								<span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Open roles</span>
								<Search size={22} className="text-[#f3c866]" />
							</div>
							<div>
								<p className="text-6xl font-black tracking-[-0.05em]">Find your fit.</p>
								<p className="mt-3 max-w-sm text-white/75">Your next opportunity may be closer than you think.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="px-6 py-14 md:px-10 md:py-20">
				<div className="mx-auto max-w-7xl">
					<div className="grid gap-6 md:grid-cols-3">
						<div className="border-t-2 border-[#e4643a] pt-5">
							<Building2 className="text-[#e4643a]" size={24} />
							<h2 className="mt-5 text-xl font-bold">Roles with purpose</h2>
							<p className="mt-2 leading-7 text-[#53635b]">Find work where your contribution is visible and valued.</p>
						</div>
						<div className="border-t-2 border-[#d6a93b] pt-5">
							<CheckCircle2 className="text-[#b38314]" size={24} />
							<h2 className="mt-5 text-xl font-bold">A clear application path</h2>
							<p className="mt-2 leading-7 text-[#53635b]">Create a candidate account, apply once, and follow your progress.</p>
						</div>
						<div className="border-t-2 border-[#263b32] pt-5">
							<UserRoundPlus className="text-[#263b32]" size={24} />
							<h2 className="mt-5 text-xl font-bold">Made for candidates</h2>
							<p className="mt-2 leading-7 text-[#53635b]">Keep your candidate access separate from internal employee accounts.</p>
						</div>
					</div>

					<div className="mt-16 flex flex-col items-start justify-between gap-7 border-t border-[#17221e]/15 pt-8 md:flex-row md:items-center">
						<div>
							<p className="text-sm font-bold uppercase tracking-[0.2em] text-[#53635b]">Already started?</p>
							<h2 className="mt-2 text-3xl font-black tracking-tight">Return to your candidate workspace.</h2>
						</div>
						<button
							type="button"
							onClick={() => navigate("/candidate-login")}
							className="inline-flex items-center gap-2 rounded-full bg-[#17221e] px-6 py-3.5 font-bold text-white transition hover:bg-[#304139]"
						>
							Candidate login <ArrowRight size={18} />
						</button>
					</div>

					<div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-[#53635b]">
						<span>© 2026 PeopleFirst Careers</span>
						<button type="button" onClick={() => navigate("/login")} className="font-semibold underline underline-offset-4 hover:text-[#17221e]">
							Internal team login
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}

export default LandingPage;
