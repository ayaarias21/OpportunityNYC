import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import jobPhoto from "../assets/iwant/job-assistance.jpg";
import { getResources, summarizeText } from "../lib/api";

const boroughFilters = ["All Boroughs", "Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island", "Citywide"];

export default function JobTraining() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [boroughFilter, setBoroughFilter] = useState("All Boroughs");

  useEffect(() => {
    let cancelled = false;

    async function loadTrainingResources() {
      try {
        const response = await getResources({ category: "Workshop", limit: 100 });
        if (!cancelled) {
          setResources(response.data || []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setResources([]);
          setError(fetchError.message || "Could not load training & placement resources.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTrainingResources();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResources = resources.filter(
    (resource) => boroughFilter === "All Boroughs" || resource.borough === boroughFilter
  );

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
          <BackLink to="/jobs" label="Back to Job Assistance" />
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Free training and placement support near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl">
            Career centers and partner organizations across NYC offering job training, skills
            development, and placement help.
          </p>
        </div>
      </header>

      {/* Training & placement listings */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Programs & Career Centers
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
            {loading
              ? "Loading..."
              : `${filteredResources.length} training & placement ${
                  filteredResources.length === 1 ? "program" : "programs"
                } found`}
          </h2>
          <p className="text-warm-gray text-sm">
            Live listings synced from NYC Open Data
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {boroughFilters.map((borough) => (
            <button
              key={borough}
              type="button"
              onClick={() => setBoroughFilter(borough)}
              className={`font-sans text-xs font-semibold tracking-wide px-4 py-2 rounded-full border-2 transition-colors ${
                boroughFilter === borough
                  ? "bg-charcoal text-cream border-charcoal"
                  : "bg-white text-charcoal border-charcoal/15 hover:border-charcoal/40"
              }`}
            >
              {borough}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-700 mb-6">
            {error} Run the Python sync script and backend server to populate live data.
          </p>
        )}

        {!loading && filteredResources.length === 0 && !error ? (
          <p className="text-center text-warm-gray text-sm">
            No training or placement programs matched your filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <article
                key={resource._id}
                className="bg-white border-2 border-charcoal rounded-xl p-6"
              >
                <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2">
                  {resource.borough}
                </div>
                <h3 className="font-sans font-bold text-lg text-charcoal mb-2">{resource.title}</h3>
                <p className="text-sm text-warm-gray mb-3">{summarizeText(resource.description)}</p>
                {resource.address && (
                  <p className="text-sm text-charcoal mb-1">{resource.address}</p>
                )}
                {resource.contact && (
                  <p className="text-sm text-charcoal mb-4">{resource.contact}</p>
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
