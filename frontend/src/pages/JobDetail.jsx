import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";
import OppBadge from "../components/OppBadge";
import { getOpportunityById } from "../lib/api";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJob() {
      setLoading(true);
      setError("");

      try {
        const data = await getOpportunityById(id);
        if (!cancelled) {
          setJob(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Could not load this job listing.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJob();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const badgeType = job?.category === "Job" ? "fulltime" : (job?.category || "").toLowerCase().replace(/\s+/g, "");
  const postedDate = formatDate(job?.postingDate || job?.createdAt);

  return (
    <div className="bg-cream min-h-screen">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/jobs" className="text-sm font-semibold text-forest hover:underline">
          ← Back to Job Assistance
        </Link>

        {loading && <p className="text-warm-gray text-sm mt-8">Loading job details...</p>}

        {!loading && error && (
          <p className="text-red-700 text-sm mt-8">{error}</p>
        )}

        {!loading && !error && job && (
          <article className="mt-6 bg-white border border-charcoal/[0.07] rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-2 mb-4">
              <OppBadge type={badgeType}>{(job.category || "Job").toUpperCase()}</OppBadge>
              {job.borough && (
                <span className="inline-block font-sans text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-charcoal/5 text-warm-gray">
                  {job.borough}
                </span>
              )}
              {job.employmentType && (
                <span className="inline-block font-sans text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-charcoal/5 text-warm-gray">
                  {job.employmentType}
                </span>
              )}
              {job.careerLevel && (
                <span className="inline-block font-sans text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-charcoal/5 text-warm-gray">
                  {job.careerLevel}
                </span>
              )}
              {job.requiresCivilServiceExam && (
                <span className="inline-block font-sans text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-peach-tint text-[#8A4A26]">
                  Requires Civil Service Exam
                </span>
              )}
            </div>

            <h1 className="font-sans font-bold text-2xl md:text-3xl text-charcoal mb-2">{job.title}</h1>
            <div className="text-warm-gray text-sm mb-6">
              {job.organization || job.agency}
              {job.workLocation ? ` · ${job.workLocation}` : ""}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
              {job.salarySummary && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-1">Salary</div>
                  <div className="text-charcoal font-medium">{job.salarySummary}</div>
                </div>
              )}
              {job.jobCategory && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-1">Job Category</div>
                  <div className="text-charcoal font-medium">{job.jobCategory}</div>
                </div>
              )}
              {postedDate && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-1">Posted</div>
                  <div className="text-charcoal font-medium">{postedDate}</div>
                </div>
              )}
              {job.borough && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-1">Borough</div>
                  <div className="text-charcoal font-medium">{job.borough}</div>
                </div>
              )}
            </div>

            {job.description && (
              <div className="mb-8">
                <div className="text-xs uppercase tracking-widest text-accent mb-2">Description</div>
                <p className="text-sm text-charcoal whitespace-pre-line leading-relaxed">{job.description}</p>
              </div>
            )}

            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-forest hover:bg-forest-dark text-white font-semibold text-sm rounded-xl px-6 py-3"
              >
                Apply on NYC Jobs →
              </a>
            )}
          </article>
        )}
      </section>

      <Footer />
      <HelpButton />
    </div>
  );
}
