import OppCard from "./OppCard";

const featured = [
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
];

export default function FeaturedOpportunities() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-11">
        <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
          Handpicked for You
        </div>
        <h2 className="font-sans font-semibold text-3xl mb-2.5">Featured Opportunities</h2>
        <p className="text-warm-gray text-sm">A snapshot of what's currently open across the city.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
        {featured.map((opp) => (
          <OppCard key={opp.title} {...opp} />
        ))}
      </div>
    </section>
  );
}
