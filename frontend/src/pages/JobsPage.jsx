import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppCard from "../components/OppCard";
import { getOpportunities, mapOpportunityToCard } from "../lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const response = await getOpportunities({ category: "Job", limit: 60 });
        if (!cancelled) {
          setJobs((response.data || []).map(mapOpportunityToCard));
        }
      } catch {
        if (!cancelled) {
          setJobs([]);
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

  return (
    <div>
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <h1 className="font-sans font-semibold text-2xl mb-1.5">Jobs</h1>
        <p className="text-warm-gray text-sm mb-8">
          {loading
            ? "Loading..."
            : `${jobs.length} ${jobs.length === 1 ? "opportunity" : "opportunities"} found`}
        </p>

        {!loading && jobs.length === 0 ? (
          <p className="text-warm-gray text-sm">
            Job listings will appear here after the NYC Open Data sync runs.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            {jobs.map((opp) => (
              <OppCard key={opp.id || opp.title} {...opp} />
            ))}
          </div>
        )}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
