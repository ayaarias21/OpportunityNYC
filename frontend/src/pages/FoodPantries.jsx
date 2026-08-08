import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import foodPhoto from "../assets/iwant/food.jpg";
import { cleanResourceText, getAllResources, groupByBorough, summarizeText } from "../lib/api";

const FOOD_PANTRY_KEYWORDS = /food\s*\[?pantr(?:y|ies)|food bank/i;

const FOOD_PANTRY_EXCLUDED_TITLES = new Set([
  "Connecting to Advantages",
  "Money to buy food",
  "Extra grocery money for families over summer break",
]);

const FOOD_PANTRY_CATEGORIES = ["Healthcare", "Housing", "Other", "Student Support"];

export default function FoodPantries() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        const categoryResults = await Promise.all(
          FOOD_PANTRY_CATEGORIES.map((category) => getAllResources(category))
        );
        const combined = categoryResults.flat();
        const matches = combined.filter(
          (resource) =>
            !FOOD_PANTRY_EXCLUDED_TITLES.has(resource.title) &&
            (FOOD_PANTRY_KEYWORDS.test(resource.title) ||
              FOOD_PANTRY_KEYWORDS.test(resource.description || ""))
        );

        if (!cancelled) {
          setResources(matches);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setResources([]);
          setError(fetchError.message || "Could not load food pantry resources.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResources();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-cream">
      <Nav />

      {/* Page hero */}
      <header
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.8) 100%), url(${foodPhoto})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <BackLink to="/food" label="Back to Welfare Opportunities" />
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Find free groceries near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl">
            Food pantries and community organizations offering free groceries and shelf-stable
            goods across NYC.
          </p>
        </div>
      </header>

      {/* Food pantry listings */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Organizations That Can Help
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
            {loading
              ? "Loading..."
              : `${resources.length} ${resources.length === 1 ? "pantry" : "pantries"} found`}
          </h2>
          <p className="text-warm-gray text-sm">
            Live listings synced from NYC Open Data
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-red-700 mb-6">
            {error} Run the Python sync script and backend server to populate live data.
          </p>
        )}

        {!loading && resources.length === 0 && !error ? (
          <p className="text-center text-warm-gray text-sm">
            Food pantry resources will appear here after the NYC Open Data sync runs.
          </p>
        ) : (
          <div className="space-y-12">
            {groupByBorough(resources).map(([borough, boroughResources]) => (
              <div key={borough}>
                <h3 className="font-sans font-bold text-xl text-charcoal mb-5 pb-2 border-b-2 border-charcoal/10">
                  {borough}
                  <span className="ml-2 font-sans font-medium text-sm text-warm-gray">
                    ({boroughResources.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {boroughResources.map((resource) => (
                    <article
                      key={resource._id}
                      className="bg-white border-2 border-charcoal rounded-xl p-6"
                    >
                      <h3 className="font-sans font-bold text-lg text-charcoal mb-2">{resource.title}</h3>
                      <p className="text-sm text-warm-gray mb-3">
                        {summarizeText(cleanResourceText(resource.description), 2, 220)}
                      </p>
                      {resource.address && (
                        <p className="text-sm text-charcoal mb-1">{resource.address}</p>
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
