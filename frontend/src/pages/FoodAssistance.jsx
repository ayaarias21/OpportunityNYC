import { Link } from "react-router-dom";
import foodPhoto from "../assets/iwant/food.jpg";
import { useEffect, useState } from "react";
import { getResources } from "../lib/api";

const foodTypes = [
  {
    tint: "bg-sage-tint",
    label: "Food Pantries",
    desc: "Free groceries and shelf-stable goods available weekly at community sites across the five boroughs.",
  },
  {
    tint: "bg-peach-tint",
    label: "Meal Programs",
    desc: "Hot, ready-to-eat meals served daily at soup kitchens and community centers near you.",
  },
  {
    tint: "bg-lavender",
    label: "SNAP Benefits",
    desc: "Apply for or renew SNAP (food stamp) benefits, and get help with the application process.",
  },
  {
    tint: "bg-sand",
    label: "Home-Delivered Meals",
    desc: "Meal delivery for seniors, people with disabilities, and those unable to travel to a pantry.",
  },
];

export default function FoodAssistance() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      setLoading(true);
      setError("");

      try {
        const response = await getResources({ type: "Food", limit: 100 });
        if (!cancelled) {
          setResources(response.data || []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Could not load SNAP center listings.");
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

  const filteredResources = resources.filter((resource) => {
    if (!searchValue.trim()) {
      return true;
    }

    const haystack = `${resource.title} ${resource.borough} ${resource.address} ${resource.postcode}`.toLowerCase();
    return haystack.includes(searchValue.trim().toLowerCase());
  });

  function handleSearchSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="bg-cream">
      <div className="bg-accent-dark">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
              O
            </div>
            <div className="font-sans font-semibold text-lg text-cream">
              Opportunity<span className="text-accent">NYC</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-7 text-sm font-medium text-cream/85">
            <Link to="/search?category=Job" className="hover:text-cream">Jobs</Link>
            <Link to="/food" className="hover:text-cream">Food</Link>
          </nav>
        </div>
      </div>

      <header
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.8) 100%), url(${foodPhoto})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="inline-block font-sans text-[11px] tracking-widest uppercase text-cream bg-cream/10 border border-cream/25 rounded-md px-3.5 py-2 mb-5">
            Food Assistance
          </div>
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Find food assistance near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mb-7">
            Live SNAP center listings synced from NYC Open Data across all five boroughs.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="flex max-w-lg gap-1.5 bg-accent-dark/55 border border-cream/25 rounded-xl p-1.5 backdrop-blur-sm"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Enter your zip code or borough"
              className="flex-1 bg-transparent outline-none px-4 text-cream placeholder:text-cream/55"
            />
            <button type="submit" className="bg-white text-charcoal font-semibold text-sm rounded-lg px-6">
              Search
            </button>
          </form>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Ways to Get Help
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">Types of Food Assistance</h2>
          <p className="text-warm-gray text-sm">Pick the option that fits your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodTypes.map((type) => (
            <div
              key={type.label}
              className="bg-white border-2 border-charcoal rounded-xl p-7 flex gap-5 items-start"
            >
              <div className={`w-12 h-12 rounded-lg ${type.tint} flex-shrink-0`} />
              <div>
                <h3 className="font-sans font-bold text-lg text-charcoal mb-1.5">{type.label}</h3>
                <p className="text-sm text-warm-gray">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="font-sans font-bold text-2xl text-charcoal mb-2">
              SNAP Center Locations
            </h2>
            <p className="text-warm-gray text-sm max-w-md mx-auto">
              {loading
                ? "Loading live listings..."
                : `${filteredResources.length} verified SNAP centers available through OpportunityNYC.`}
            </p>
          </div>

          {error && (
            <p className="text-center text-sm text-red-700 mb-6">
              {error} Run the Python sync script and backend server to populate live data.
            </p>
          )}

          {!loading && filteredResources.length === 0 && !error && (
            <p className="text-center text-warm-gray text-sm">
              No SNAP centers matched your search.
            </p>
          )}

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
                <p className="text-sm text-warm-gray mb-3">{resource.address}</p>
                {resource.hours && (
                  <p className="text-sm text-charcoal mb-4">{resource.hours}</p>
                )}
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    Learn about SNAP benefits →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-accent-dark text-cream/75">
        <div className="max-w-6xl mx-auto px-6 py-[18px] text-center font-sans text-xs text-cream/50">
          OPPORTUNITYNYC • CSCI STUDENT PROJECT • NOT AN OFFICIAL CITY SERVICE
        </div>
      </footer>
    </div>
  );
}
