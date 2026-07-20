import { useEffect, useState } from "react";
import OppCard from "./OppCard";
import { getOpportunities, mapOpportunityToCard } from "../lib/api";

export default function FeaturedOpportunities() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        const response = await getOpportunities({ category: "Job", limit: 3 });
        if (!cancelled) {
          setFeatured((response.data || []).map(mapOpportunityToCard));
        }
      } catch {
        if (!cancelled) {
          setFeatured([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-11">
        <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
          Handpicked for You
        </div>
        <h2 className="font-sans font-semibold text-3xl mb-2.5">Featured Opportunities</h2>
        <p className="text-warm-gray text-sm">
          {loading ? "Loading live NYC job postings..." : "A snapshot of what's currently open across the city."}
        </p>
      </div>

      {!loading && featured.length === 0 ? (
        <p className="text-center text-warm-gray text-sm">
          Featured jobs will appear here after the NYC Open Data sync runs.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {featured.map((opp) => (
            <OppCard key={opp.id || opp.title} {...opp} />
          ))}
        </div>
      )}
    </section>
  );
}
