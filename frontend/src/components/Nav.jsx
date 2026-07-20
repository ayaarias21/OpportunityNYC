import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <header className="bg-cream border-b border-charcoal/10">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
            O
          </div>
          <div className="font-sans font-semibold text-lg text-charcoal">
            Opportunity<span className="text-accent">NYC</span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-7 text-sm font-medium text-charcoal/75">
          <Link to="/jobs" className="hover:text-charcoal">Jobs</Link>
          <a href="#" className="hover:text-charcoal">Housing</a>
          <a href="#" className="hover:text-charcoal">Food</a>
          <a href="#" className="hover:text-charcoal">Education</a>
          <a href="#" className="hover:text-charcoal">Community</a>
        </nav>

        <div className="flex items-center gap-3.5">
          <a href="#" className="text-sm font-semibold text-charcoal hover:underline">Sign In</a>
          <a href="#" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white rounded-md px-5 py-2.5">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
