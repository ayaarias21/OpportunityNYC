import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppCard from "../components/OppCard";

const allOpportunities = [
  {
    badgeType: "fulltime",
    badgeLabel: "FULL-TIME",
    title: "Community Health Outreach Coordinator",
    org: "NYC Dept. of Health · Brooklyn",
    posted: "Posted 2 days ago",
  },
  {
    badgeType: "internship",
    badgeLabel: "INTERNSHIP",
    title: "Summer Data Analytics Fellow",
    org: "NYC Opportunity · Manhattan",
    posted: "Posted 5 days ago",
  },
  {
    badgeType: "scholarship",
    badgeLabel: "SCHOLARSHIP",
    title: "CUNY First-Gen Student Grant",
    org: "CUNY Foundation · Citywide",
    posted: "Posted 1 week ago",
  },
  {
    badgeType: "fulltime",
    badgeLabel: "FULL-TIME",
    title: "Emergency Housing Case Manager",
    org: "NYC Dept. of Social Services · Bronx",
    posted: "Posted 3 days ago",
  },
  {
    badgeType: "internship",
    badgeLabel: "INTERNSHIP",
    title: "Youth Workforce Development Intern",
    org: "NYC Opportunity · Queens",
    posted: "Posted 1 week ago",
  },
  {
    badgeType: "scholarship",
    badgeLabel: "SCHOLARSHIP",
    title: "First-Gen College Access Grant",
    org: "CUNY Foundation · Staten Island",
    posted: "Posted 4 days ago",
  },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(query);

  const results = query
    ? allOpportunities.filter((opp) =>
        `${opp.title} ${opp.org} ${opp.badgeLabel}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : allOpportunities;

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(inputValue)}`);
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
            placeholder="Try 'summer internship in Brooklyn' or 'emergency housing'"
            className="flex-1 bg-white border border-charcoal/10 rounded-xl px-4 py-3 outline-none placeholder:text-warm-gray"
          />
          <button className="bg-forest hover:bg-forest-dark text-white font-semibold text-sm rounded-xl px-6">
            Search
          </button>
        </form>

        <h1 className="font-sans font-semibold text-2xl mb-1.5">
          {query ? `Results for "${query}"` : "All Opportunities"}
        </h1>
        <p className="text-warm-gray text-sm mb-8">
          {results.length} {results.length === 1 ? "opportunity" : "opportunities"} found
        </p>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            {results.map((opp) => (
              <OppCard key={opp.title} {...opp} />
            ))}
          </div>
        ) : (
          <p className="text-warm-gray text-sm">
            No opportunities matched your search. Try a different keyword.
          </p>
        )}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
