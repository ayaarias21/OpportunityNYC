import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppCard from "../components/OppCard";
import { useAuth } from "../context/AuthContext";
import { getSavedOpportunities, mapOpportunityToCard } from "../lib/api";

export default function SavedOpportunities() {
  const { user, token, loading: authLoading, savedIds } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSaved() {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getSavedOpportunities(token);
        if (!cancelled) {
          setOpportunities((response.data || []).map(mapOpportunityToCard));
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Could not load saved opportunities.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSaved();
    return () => {
      cancelled = true;
    };
  }, [token, savedIds]);

  return (
    <div className="bg-cream min-h-screen">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-charcoal mb-1.5">
          Saved Opportunities
        </h1>
        <p className="text-warm-gray text-sm mb-8">
          Jobs and internships you&rsquo;ve bookmarked to come back to.
        </p>

        {!authLoading && !user ? (
          <p className="text-warm-gray text-sm">
            <Link to="/signin" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>{" "}
            to see your saved opportunities.
          </p>
        ) : (
          <>
            {error && <p className="text-sm text-red-700 mb-6">{error}</p>}

            {loading ? (
              <p className="text-warm-gray text-sm">Loading...</p>
            ) : opportunities.length === 0 && !error ? (
              <p className="text-warm-gray text-sm">
                You haven&rsquo;t saved any opportunities yet. Browse{" "}
                <Link to="/jobs" className="text-accent font-semibold hover:underline">
                  Job Assistance
                </Link>{" "}
                and tap the bookmark icon on a listing to save it here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
                {opportunities.map((opp) => (
                  <OppCard key={opp.id || opp.title} {...opp} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
