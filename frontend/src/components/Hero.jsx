import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import subwayHero from "../assets/subway-hero.jpg";
import CategoryPill from "./CategoryPill";
import { useAuth } from "../context/AuthContext";

const categories = [
  { label: "Welfare Opportunities", dotColor: "#6B9E78" },
  { label: "Student Section", dotColor: "#C97B96", href: "/students" },
  { label: "Job Assistance", dotColor: "#3D6E96", href: "/jobs" },
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleSignOut() {
    logout();
    navigate("/");
  }

  return (
    <header
      className="relative bg-cover bg-center pb-14"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.55) 0%, rgba(15,22,18,0.72) 55%, rgba(15,22,18,0.85) 100%), url(${subwayHero})`,
        backgroundPosition: "center 40%",
      }}
    >
      {/* Overlay nav */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
            O
          </div>
          <div className="font-sans font-semibold text-lg text-cream">
            Opportunity<span className="text-accent">NYC</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-7 text-sm font-medium text-cream/85">
          <a href="#" className="hover:text-cream">Welfare Opportunities</a>
          <Link to="/students" className="hover:text-cream">Student Section</Link>
          <Link to="/jobs" className="hover:text-cream">Job Assistance</Link>
          <Link to="/roadmap" className="hover:text-cream">Eligibility Machine</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          {loading ? null : user ? (
            <>
              <Link to="/saved" className="text-sm font-semibold text-cream hover:underline">
                Saved
              </Link>
              <span className="text-sm font-medium text-cream/85">
                Hi, {user.firstName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-semibold text-cream hover:underline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-semibold text-cream hover:underline">Sign In</Link>
              <Link to="/signup" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white rounded-md px-5 py-2.5">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero content */}
      <div className="max-w-3xl mx-auto px-6 pt-10 text-center">
        <h1 className="font-sans font-semibold text-white text-5xl leading-tight mb-4 text-left">
          Find opportunities built for New Yorkers.
        </h1>

        <p className="text-cream/80 text-lg max-w-lg mx-auto mb-7">
          Search jobs, housing, food assistance, and student support across all five
          boroughs.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="flex max-w-xl mx-auto gap-1.5 bg-accent-dark/55 border border-cream/25 rounded-xl p-1.5 backdrop-blur-sm mb-7"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for what you need!"
            className="flex-1 bg-transparent outline-none px-4 text-cream placeholder:text-cream/55"
          />
          <button className="bg-white text-charcoal font-semibold text-sm rounded-lg px-6">
            Search
          </button>
        </form>

        <div className="font-sans text-[11px] tracking-widest uppercase text-cream/60 mb-3.5">
          Browse by Category
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 items-center">
          {categories.map((c) => (
            <CategoryPill key={c.label} label={c.label} dotColor={c.dotColor} href={c.href} />
          ))}
          <a href="#" className="text-cream/65 hover:text-cream text-sm px-1 py-2.5">
            View all opportunities →
          </a>
        </div>
      </div>
    </header>
  );
}
