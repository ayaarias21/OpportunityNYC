import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <header className="bg-accent-dark">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
            O
          </div>
          <div className="font-sans font-semibold text-lg text-cream">
            Opportunity<span className="text-accent">NYC</span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-7 text-sm font-medium text-cream/85">
          <a href="#" className="hover:text-cream">Welfare Opportunities</a>
          <Link to="/students" className="hover:text-cream">Student Section</Link>
          <Link to="/jobs" className="hover:text-cream">Job Assistance</Link>
          <Link to="/roadmap" className="hover:text-cream">Eligibility Machine</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <Link to="/signin" className="text-sm font-semibold text-cream hover:underline">Sign In</Link>
          <Link to="/signup" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white rounded-md px-5 py-2.5">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
