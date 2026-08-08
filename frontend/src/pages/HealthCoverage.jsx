import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import foodPhoto from "../assets/iwant/food.jpg";
import { cleanResourceText, getAllResources, groupByBorough, summarizeText } from "../lib/api";

const HEALTH_PROGRAM_TITLES = new Set([
  "No cost or low-cost healthcare",
  "Free or low-cost health insurance for children 18 and under",
  "Health insurance for adults who don't qualify for Medicaid",
  "Free health insurance for low-income residents",
  "Private health insurance plans",
  "Health care for children",
  "Health care for children and youth with disabilities",
  "Youth mental health care",
  "Talk, text, or chat for mental health help",
  "Support for children with behavioral challenges",
  "Long-term care at home",
  "Home visits for first-time parents",
  "Personal nurses for pregnant people",
]);

const HEALTH_OFFICE_DATASETS = new Set([
  "Medicaid Offices",
  "Equitable Health Systems - Health Insurance Enrollment",
]);

export default function HealthCoverage() {
  const [programs, setPrograms] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        const [otherResources, healthcareResources] = await Promise.all([
          getAllResources("Other"),
          getAllResources("Healthcare"),
        ]);

        const matchedPrograms = otherResources.filter((resource) =>
          HEALTH_PROGRAM_TITLES.has(resource.title)
        );
        const matchedOffices = healthcareResources.filter((resource) =>
          HEALTH_OFFICE_DATASETS.has(resource.sourceDataset)
        );

        if (!cancelled) {
          setPrograms(matchedPrograms);
          setOffices(matchedOffices);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setPrograms([]);
          setOffices([]);
          setError(fetchError.message || "Could not load health coverage resources.");
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
            Get health coverage for you and your family.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl">
            Medicaid, Child Health Plus, and other no- or low-cost health insurance programs,
            plus enrollment offices near you.
          </p>
        </div>
      </header>

      {/* Health coverage programs */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Programs
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
            {loading
              ? "Loading..."
              : `${programs.length} health coverage ${programs.length === 1 ? "program" : "programs"} found`}
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

        {!loading && programs.length === 0 && !error ? (
          <p className="text-center text-warm-gray text-sm">
            Health coverage programs will appear here after the NYC Open Data sync runs.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((resource) => (
              <article
                key={resource._id}
                className="bg-white border-2 border-charcoal rounded-xl p-6"
              >
                <h3 className="font-sans font-bold text-lg text-charcoal mb-2">{resource.title}</h3>
                <p className="text-sm text-warm-gray mb-3">
                  {summarizeText(cleanResourceText(resource.description), 2, 220)}
                </p>
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

      {/* Medicaid & enrollment offices */}
      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-11">
            <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
              Offices Near You
            </div>
            <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
              {loading
                ? "Loading..."
                : `${offices.length} Medicaid & enrollment ${offices.length === 1 ? "office" : "offices"} found`}
            </h2>
            <p className="text-warm-gray text-sm">
              Live listings synced from NYC Open Data
            </p>
          </div>

          {!loading && offices.length === 0 && !error ? (
            <p className="text-center text-warm-gray text-sm">
              Medicaid and enrollment offices will appear here after the NYC Open Data sync runs.
            </p>
          ) : (
            <div className="space-y-12">
              {groupByBorough(offices).map(([borough, boroughOffices]) => (
                <div key={borough}>
                  <h3 className="font-sans font-bold text-xl text-charcoal mb-5 pb-2 border-b-2 border-charcoal/10">
                    {borough}
                    <span className="ml-2 font-sans font-medium text-sm text-warm-gray">
                      ({boroughOffices.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {boroughOffices.map((resource) => (
                      <article
                        key={resource._id}
                        className="bg-white border-2 border-charcoal rounded-xl p-6"
                      >
                        <h3 className="font-sans font-bold text-lg text-charcoal mb-2">{resource.title}</h3>
                        <p className="text-sm text-warm-gray mb-3">{resource.organization}</p>
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
        </div>
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
