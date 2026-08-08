import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import { cleanResourceText, getResources, summarizeText } from "../lib/api";

const CATEGORY_ORDER = ["Food Assistance", "Other", "Housing", "Healthcare", "Student Support", "Workshop"];

function groupByCategory(resources) {
  const groups = new Map();

  resources.forEach((resource) => {
    const category = resource.category || "Other";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(resource);
  });

  return [...groups.entries()].sort(([a], [b]) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export default function WelfareSearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      if (!query.trim()) {
        setResults([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getResources({ search: query, limit: 500 });
        if (!cancelled) {
          setResults(response.data || []);
          setTotal(response.pagination?.total ?? (response.data || []).length);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Could not load search results.");
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
  }, [query]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = inputValue.trim();
    navigate(trimmed ? `/food/search?q=${encodeURIComponent(trimmed)}` : "/food/search");
  }

  return (
    <div className="bg-cream min-h-screen">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <BackLink to="/food" label="Back to Welfare Opportunities" />

        <form onSubmit={handleSubmit} className="flex max-w-xl gap-1.5 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Search SNAP, Medicaid, cash assistance, a borough, zip code..."
            className="flex-1 bg-white border border-charcoal/10 rounded-xl px-4 py-3 outline-none placeholder:text-warm-gray"
          />
          <button className="bg-forest hover:bg-forest-dark text-white font-semibold text-sm rounded-xl px-6">
            Search
          </button>
        </form>

        <h1 className="font-sans font-semibold text-2xl mb-1.5">
          {query ? `Results for "${query}"` : "Search Welfare Opportunities"}
        </h1>
        <p className="text-warm-gray text-sm mb-2">
          Live listings synced from NYC Open Data
        </p>
        <p className="text-warm-gray text-sm mb-8">
          {!query.trim()
            ? "Enter a keyword above to search across all welfare programs and resources."
            : loading
              ? "Loading..."
              : `${total} ${total === 1 ? "result" : "results"} found`}
        </p>

        {error && (
          <p className="text-sm text-red-700 mb-6">
            {error} Run the Python sync script and backend server to populate live data.
          </p>
        )}

        {!loading && query.trim() && results.length === 0 && !error && (
          <p className="text-warm-gray text-sm">
            No resources matched your search. Try a different keyword, borough, or zip code.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-12">
            {groupByCategory(results).map(([category, categoryResults]) => (
              <div key={category}>
                <h2 className="font-sans font-bold text-xl text-charcoal mb-5 pb-2 border-b-2 border-charcoal/10">
                  {category}
                  <span className="ml-2 font-sans font-medium text-sm text-warm-gray">
                    ({categoryResults.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryResults.map((resource) => (
                    <article
                      key={resource._id}
                      className="bg-white border-2 border-charcoal rounded-xl p-6"
                    >
                      <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2">
                        {resource.borough}
                      </div>
                      <h3 className="font-sans font-bold text-lg text-charcoal mb-2">{resource.title}</h3>
                      <p className="text-sm text-warm-gray mb-3">
                        {summarizeText(cleanResourceText(resource.description), 2, 220)}
                      </p>
                      {resource.address && (
                        <p className="text-sm text-charcoal mb-1">{resource.address}</p>
                      )}
                      {resource.hours && (
                        <p className="text-sm text-charcoal mb-1">{resource.hours}</p>
                      )}
                      {cleanResourceText(resource.contact) && (
                        <p className="text-sm text-charcoal mb-4">{cleanResourceText(resource.contact)}</p>
                      )}
                      {resource.link && (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-accent hover:underline"
                        >
                          Learn more →
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
