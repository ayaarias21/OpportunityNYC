import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import BackLink from "../components/BackLink";
import foodPhoto from "../assets/iwant/food.jpg";
import { cleanResourceText, getAllResources, groupByBorough, summarizeText } from "../lib/api";

const HOUSING_PROGRAM_GROUP_ORDER = [
  "Rental Assistance & Vouchers",
  "Affordable Housing & Homeownership",
  "Shelter & Homelessness Support",
  "Specialized Support",
];

const HOUSING_PROGRAM_GROUPS = {
  "Vouchers that pay part of your rent": "Rental Assistance & Vouchers",
  "Services to help you keep your housing": "Rental Assistance & Vouchers",
  "Help with rent for families with children": "Rental Assistance & Vouchers",
  "Rent freeze for people with disabilities": "Rental Assistance & Vouchers",
  "Rent freeze for seniors": "Rental Assistance & Vouchers",

  "Affordable public housing": "Affordable Housing & Homeownership",
  "Affordable housing lotteries": "Affordable Housing & Homeownership",
  "Affordable housing waiting lists": "Affordable Housing & Homeownership",
  "Resources for affordable homeownership": "Affordable Housing & Homeownership",
  "Property tax break for senior homeowners": "Affordable Housing & Homeownership",
  "Property tax break for homeowners with disabilities": "Affordable Housing & Homeownership",
  "Property tax break for veterans": "Affordable Housing & Homeownership",
  "Lower your property taxes with the STAR credit": "Affordable Housing & Homeownership",

  "Adult and family shelters and drop-in housing services": "Shelter & Homelessness Support",
  "Services and support for homeless youth": "Shelter & Homelessness Support",
  "Supportive housing for homeless veterans": "Shelter & Homelessness Support",
  "Homes for adults who cannot live alone": "Shelter & Homelessness Support",

  "Services for people with HIV or AIDS": "Specialized Support",
};

function groupHousingPrograms(programs) {
  const groups = new Map();

  programs.forEach((resource) => {
    const group = HOUSING_PROGRAM_GROUPS[resource.title] || "Other Housing Support";
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group).push(resource);
  });

  return [...groups.entries()].sort(([a], [b]) => {
    const indexA = HOUSING_PROGRAM_GROUP_ORDER.indexOf(a);
    const indexB = HOUSING_PROGRAM_GROUP_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

const ALL_PROGRAMS_FILTER = "All Programs";

export default function HousingHelp() {
  const [programs, setPrograms] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programGroupFilter, setProgramGroupFilter] = useState(ALL_PROGRAMS_FILTER);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        const [otherResources, housingResources] = await Promise.all([
          getAllResources("Other"),
          getAllResources("Housing"),
        ]);

        const matchedPrograms = otherResources.filter(
          (resource) => resource.title in HOUSING_PROGRAM_GROUPS
        );

        if (!cancelled) {
          setPrograms(matchedPrograms);
          setOrganizations(housingResources);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setPrograms([]);
          setOrganizations([]);
          setError(fetchError.message || "Could not load housing resources.");
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
            Find housing help near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl">
            Section 8 vouchers, HomeBase, HASA, affordable housing, and eviction prevention
            support across NYC.
          </p>
        </div>
      </header>

      {/* Housing programs */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Programs
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
            {loading
              ? "Loading..."
              : `${programs.length} housing ${programs.length === 1 ? "program" : "programs"} found`}
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

        {!loading && programs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[ALL_PROGRAMS_FILTER, ...HOUSING_PROGRAM_GROUP_ORDER].map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setProgramGroupFilter(group)}
                className={`font-sans text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                  programGroupFilter === group
                    ? "bg-charcoal text-cream border-charcoal"
                    : "bg-white text-charcoal border-charcoal/15 hover:border-charcoal/40"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}

        {!loading && programs.length === 0 && !error ? (
          <p className="text-center text-warm-gray text-sm">
            Housing programs will appear here after the NYC Open Data sync runs.
          </p>
        ) : (
          <div className="space-y-12">
            {groupHousingPrograms(
              programGroupFilter === ALL_PROGRAMS_FILTER
                ? programs
                : programs.filter((resource) => HOUSING_PROGRAM_GROUPS[resource.title] === programGroupFilter)
            ).map(([group, groupPrograms]) => (
              <div key={group}>
                <h3 className="font-sans font-bold text-xl text-charcoal mb-5 pb-2 border-b-2 border-charcoal/10">
                  {group}
                  <span className="ml-2 font-sans font-medium text-sm text-warm-gray">
                    ({groupPrograms.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupPrograms.map((resource) => (
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Housing organizations */}
      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-11">
            <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
              Organizations Near You
            </div>
            <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">
              {loading
                ? "Loading..."
                : `${organizations.length} housing ${organizations.length === 1 ? "organization" : "organizations"} found`}
            </h2>
            <p className="text-warm-gray text-sm">
              Live listings synced from NYC Open Data
            </p>
          </div>

          {!loading && organizations.length === 0 && !error ? (
            <p className="text-center text-warm-gray text-sm">
              Housing organizations will appear here after the NYC Open Data sync runs.
            </p>
          ) : (
            <div className="space-y-12">
              {groupByBorough(organizations).map(([borough, boroughOrgs]) => (
                <div key={borough}>
                  <h3 className="font-sans font-bold text-xl text-charcoal mb-5 pb-2 border-b-2 border-charcoal/10">
                    {borough}
                    <span className="ml-2 font-sans font-medium text-sm text-warm-gray">
                      ({boroughOrgs.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {boroughOrgs.map((resource) => (
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
        </div>
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
