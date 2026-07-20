import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppCard from "../components/OppCard";

const jobs = [
  {
    badgeType: "fulltime",
    badgeLabel: "FULL-TIME",
    title: "Community Health Outreach Coordinator",
    org: "NYC Dept. of Health · Brooklyn",
    posted: "Posted 2 days ago",
  },
  {
    badgeType: "fulltime",
    badgeLabel: "FULL-TIME",
    title: "Emergency Housing Case Manager",
    org: "NYC Dept. of Social Services · Bronx",
    posted: "Posted 3 days ago",
  },
];

export default function JobsPage() {
  return (
    <div>
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <h1 className="font-sans font-semibold text-2xl mb-1.5">Jobs</h1>
        <p className="text-warm-gray text-sm mb-8">
          {jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"} found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {jobs.map((opp) => (
            <OppCard key={opp.title} {...opp} />
          ))}
        </div>
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
