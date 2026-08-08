import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppCard from "../components/OppCard";
import jobPhoto from "../assets/iwant/job-assistance.jpg";
import { getOpportunities, mapOpportunityToCard } from "../lib/api";

const jobTypes = [
  {
    tint: "bg-sage-tint",
    label: "Job Listings",
    desc: "Full-time and part-time openings with NYC agencies and partner organizations across the five boroughs.",
    anchor: "#open-positions",
  },
  {
    tint: "bg-peach-tint",
    label: "Job Training & Placement",
    desc: "Free training programs and placement support through Workforce1 Career Centers.",
    to: "/jobs/training",
  },
  {
    tint: "bg-lavender",
    label: "Resume & Interview Help",
    desc: "One-on-one help building your resume, preparing for interviews, and applying with confidence.",
    to: "/jobs/resume-help",
  },
  {
    tint: "bg-sand",
    label: "Career Counseling",
    desc: "Guidance on career paths, certifications, and next steps from a career coach.",
    to: "/jobs/career-counseling",
  },
];

const levelFilters = ["All Levels", "Entry Level", "Mid Level", "Senior Level"];

const sortOptions = [
  { value: "recent", label: "Most Recently Posted" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

const PAGE_SIZE = 50;

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [sortBy, setSortBy] = useState("recent");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      try {
        const response = await getOpportunities({
          category: "Job",
          limit: PAGE_SIZE,
          page,
          sort: sortBy,
          careerLevel: levelFilter !== "All Levels" ? levelFilter : undefined,
        });
        if (!cancelled) {
          setJobs((response.data || []).map(mapOpportunityToCard));
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalJobs(response.pagination?.total ?? (response.data || []).length);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setJobs([]);
          setError(fetchError.message || "Could not load job listings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, [page, levelFilter, sortBy]);

  const filteredJobs = jobs.filter((job) => {
    if (!searchValue.trim()) {
      return true;
    }

    const haystack = `${job.title} ${job.org} ${job.badgeLabel}`.toLowerCase();
    return haystack.includes(searchValue.trim().toLowerCase());
  });

  function handleSearchSubmit(event) {
    event.preventDefault();
  }

  function handleLevelFilterChange(level) {
    setLevelFilter(level);
    setPage(1);
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
    setPage(1);
  }

  return (
    <div className="bg-cream">
      <Nav />

      {/* Page hero */}
      <header
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.8) 100%), url(${jobPhoto})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Find job assistance near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mb-7">
            Full-time and part-time listings, job training, and career support across all five
            boroughs.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="flex max-w-lg gap-1.5 bg-accent-dark/55 border border-cream/25 rounded-xl p-1.5 backdrop-blur-sm"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Enter your zip code or borough"
              className="flex-1 bg-transparent outline-none px-4 text-cream placeholder:text-cream/55"
            />
            <button type="submit" className="bg-white text-charcoal font-semibold text-sm rounded-lg px-6">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Types of job assistance */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Ways to Get Help
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">Types of Job Assistance</h2>
          <p className="text-warm-gray text-sm">Pick the option that fits your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobTypes.map((type) => {
            const cardClasses =
              "bg-white border-2 border-charcoal rounded-xl p-7 flex gap-5 items-start" +
              (type.anchor || type.to ? " hover:shadow-md transition-shadow cursor-pointer" : "");

            const content = (
              <>
                <div className={`w-12 h-12 rounded-lg ${type.tint} flex-shrink-0`} />
                <div>
                  <h3 className="font-sans font-bold text-lg text-charcoal mb-1.5">{type.label}</h3>
                  <p className="text-sm text-warm-gray">{type.desc}</p>
                </div>
              </>
            );

            if (type.to) {
              return (
                <Link key={type.label} to={type.to} className={cardClasses}>
                  {content}
                </Link>
              );
            }

            return type.anchor ? (
              <a key={type.label} href={type.anchor} className={cardClasses}>
                {content}
              </a>
            ) : (
              <div key={type.label} className={cardClasses}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Open positions */}
      <section id="open-positions" className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-11">
            <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
              Open Positions
            </div>
            <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
              {loading
                ? "Loading..."
                : `${totalJobs} ${totalJobs === 1 ? "opportunity" : "opportunities"} found`}
            </h2>
            <p className="text-warm-gray text-sm">
              Live NYC job postings synced from NYC Open Data
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {levelFilters.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleLevelFilterChange(level)}
                className={`font-sans text-xs font-semibold tracking-wide px-4 py-2 rounded-full border-2 transition-colors ${
                  levelFilter === level
                    ? "bg-charcoal text-cream border-charcoal"
                    : "bg-white text-charcoal border-charcoal/15 hover:border-charcoal/40"
                }`}
              >
                {level}
              </button>
            ))}

            <label className="flex items-center gap-2 ml-1">
              <span className="font-sans text-xs font-semibold tracking-wide text-warm-gray">
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="font-sans text-xs font-semibold tracking-wide px-3.5 py-2 rounded-full border-2 border-charcoal/15 bg-white text-charcoal cursor-pointer hover:border-charcoal/40"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="text-center text-sm text-red-700 mb-6">
              {error} Run the Python sync script and backend server to populate live data.
            </p>
          )}

          {!loading && filteredJobs.length === 0 && !error ? (
            <p className="text-center text-warm-gray text-sm">
              Job listings will appear here after the NYC Open Data sync runs.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
                {filteredJobs.map((opp) => (
                  <OppCard key={opp.id || opp.title} {...opp} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-11">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || loading}
                    aria-label="Previous page"
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-charcoal bg-white text-charcoal font-semibold disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:border-charcoal/60"
                  >
                    ←
                  </button>
                  <span className="font-sans text-sm font-semibold text-charcoal">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages || loading}
                    aria-label="Next page"
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-charcoal bg-white text-charcoal font-semibold disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:border-charcoal/60"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
