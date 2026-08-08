import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import foodPhoto from "../assets/iwant/food.jpg";
import { cleanResourceText, getAllResources, summarizeText } from "../lib/api";

const CASH_ASSISTANCE_TITLES = new Set([
  "Monthly cash help when you are in need",
  "One-time cash help during an emergency",
  "Temporary income for eligible unemployed adults",
  "Social Securty Administration",
]);

export default function CashAssistance() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        const allOther = await getAllResources("Other");
        const matches = allOther.filter((resource) => CASH_ASSISTANCE_TITLES.has(resource.title));

        if (!cancelled) {
          setResources(matches);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setResources([]);
          setError(fetchError.message || "Could not load cash assistance resources.");
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
            Get cash assistance when you need it.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl">
            Monthly and emergency cash help, unemployment income, and Social Security / SSI
            support for NYC residents.
          </p>
        </div>
      </header>

      {/* Cash assistance listings */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Programs & Resources
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
            {loading
              ? "Loading..."
              : `${resources.length} cash assistance ${resources.length === 1 ? "program" : "programs"} found`}
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
            Cash assistance resources will appear here after the NYC Open Data sync runs.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
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
        )}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
