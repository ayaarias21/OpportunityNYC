import { useEffect, useState } from "react";
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
  },
  {
    tint: "bg-peach-tint",
    label: "Job Training & Placement",
    desc: "Free training programs and placement support through Workforce1 Career Centers.",
  },
  {
    tint: "bg-lavender",
    label: "Resume & Interview Help",
    desc: "One-on-one help building your resume, preparing for interviews, and applying with confidence.",
  },
  {
    tint: "bg-sand",
    label: "Career Counseling",
    desc: "Guidance on career paths, certifications, and next steps from a career coach.",
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const response = await getOpportunities({ category: "Job", limit: 60 });
        if (!cancelled) {
          setJobs((response.data || []).map(mapOpportunityToCard));
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
  }, []);

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
          <div className="inline-block font-sans text-[11px] tracking-widest uppercase text-cream bg-cream/10 border border-cream/25 rounded-md px-3.5 py-2 mb-5">
            Job Assistance
          </div>
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
          {jobTypes.map((type) => (
            <div
              key={type.label}
              className="bg-white border-2 border-charcoal rounded-xl p-7 flex gap-5 items-start"
            >
              <div className={`w-12 h-12 rounded-lg ${type.tint} flex-shrink-0`} />
              <div>
                <h3 className="font-sans font-bold text-lg text-charcoal mb-1.5">{type.label}</h3>
                <p className="text-sm text-warm-gray">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions */}
      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-11">
            <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
              Open Positions
            </div>
            <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
              {loading
                ? "Loading..."
                : `${filteredJobs.length} ${filteredJobs.length === 1 ? "opportunity" : "opportunities"} found`}
            </h2>
            <p className="text-warm-gray text-sm">
              Live NYC job postings synced from NYC Open Data
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
              {filteredJobs.map((opp) => (
                <OppCard key={opp.id || opp.title} {...opp} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
