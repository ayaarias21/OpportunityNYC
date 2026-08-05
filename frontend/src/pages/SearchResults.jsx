import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppCard from "../components/OppCard";
import { getOpportunities, mapOpportunityToCard } from "../lib/api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "Job";
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      setLoading(true);
      setError("");

      try {
        const response = await getOpportunities({
          category,
          q: query || undefined,
          limit: 60,
        });

        if (!cancelled) {
          setResults((response.data || []).map(mapOpportunityToCard));
          setTotal(response.pagination?.total || 0);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Could not load opportunities.");
          setResults([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResults();
    return () => {
      cancelled = true;
    };
  }, [query, category]);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (inputValue.trim()) {
      params.set("q", inputValue.trim());
    }
    if (category) {
      params.set("category", category);
    }
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div>
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <form onSubmit={handleSubmit} className="flex max-w-xl gap-1.5 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Try 'health outreach' or 'data analyst in Brooklyn'"
            className="flex-1 bg-white border border-charcoal/10 rounded-xl px-4 py-3 outline-none placeholder:text-warm-gray"
          />
          <button className="bg-forest hover:bg-forest-dark text-white font-semibold text-sm rounded-xl px-6">
            Search
          </button>
        </form>

        <h1 className="font-sans font-semibold text-2xl mb-1.5">
          {query ? `Results for "${query}"` : "NYC Job Postings"}
        </h1>
        <p className="text-warm-gray text-sm mb-2">
          Live listings synced from NYC Open Data
        </p>
        <p className="text-warm-gray text-sm mb-8">
          {loading ? "Loading..." : `${total} ${total === 1 ? "opportunity" : "opportunities"} found`}
        </p>

        {error && (
          <p className="text-sm text-red-700 mb-6">
            {error} Run `python scripts/sync_datasets.py` and start the backend to populate live data.
          </p>
        )}

        {!loading && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            {results.map((opp) => (
              <OppCard key={opp.id || opp.title} {...opp} />
            ))}
          </div>
        ) : !loading && !error ? (
          <p className="text-warm-gray text-sm">
            No opportunities matched your search. Try a different keyword.
          </p>
        ) : null}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
