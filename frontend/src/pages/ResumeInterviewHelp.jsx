import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import jobPhoto from "../assets/iwant/job-assistance.jpg";
import { getResources, summarizeText } from "../lib/api";

const RESUME_INTERVIEW_KEYWORDS =
  /resume|interview|cover letter|business clothing|professional attire|career service|career counsel/i;

export default function ResumeInterviewHelp() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        const response = await getResources({ category: "Workshop", limit: 100 });
        if (!cancelled) {
          const matches = (response.data || []).filter(
            (resource) =>
              RESUME_INTERVIEW_KEYWORDS.test(resource.title) ||
              RESUME_INTERVIEW_KEYWORDS.test(resource.description || "")
          );
          setResources(matches);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setResources([]);
          setError(fetchError.message || "Could not load resume & interview help resources.");
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
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.8) 100%), url(${jobPhoto})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <BackLink to="/jobs" label="Back to Job Assistance" />
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Get one-on-one help preparing to apply.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl">
            NYC partner organizations offering resume building, interview coaching, and
            professional attire support.
          </p>
        </div>
      </header>

      {/* Resume & interview help listings */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Organizations That Can Help
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
            {loading
              ? "Loading..."
              : `${resources.length} ${resources.length === 1 ? "organization" : "organizations"} found`}
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
            Resume and interview help resources will appear here after the NYC Open Data sync
            runs.
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
