import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import subwayHero from "../assets/subway-hero.jpg";
import CategoryPill from "./CategoryPill";

const categories = [
  { label: "Jobs", dotColor: "#3D6E96", href: "/jobs" },
  { label: "Internships", dotColor: "#9B8AC4" },
  { label: "Housing", dotColor: "#6B9E78" },
  { label: "Food", dotColor: "#E0A94C" },
  { label: "Workshops", dotColor: "#5B8FA8" },
  { label: "Student Support", dotColor: "#C97B96" },
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
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
          <Link to="/jobs" className="hover:text-cream">Jobs</Link>
          <a href="#" className="hover:text-cream">Housing</a>
          <a href="#" className="hover:text-cream">Food</a>
          <a href="#" className="hover:text-cream">Education</a>
          <a href="#" className="hover:text-cream">Community</a>
        </nav>

        <div className="flex items-center gap-3.5">
          <a href="#" className="text-sm font-semibold text-cream hover:underline">Sign In</a>
          <a href="#" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white rounded-md px-5 py-2.5">
            Get Started
          </a>
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
