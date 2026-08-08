import { useNavigate } from "react-router-dom";
import OppBadge from "./OppBadge";
import { useAuth } from "../context/AuthContext";

export default function OppCard({
  id,
  badgeType,
  badgeLabel,
  title,
  org,
  borough,
  careerLevel,
  requiresCivilServiceExam,
  posted,
  link,
  salarySummary,
}) {
  const navigate = useNavigate();
  const { user, savedIds, toggleSave } = useAuth();
  const isSaved = Boolean(id) && savedIds.has(String(id));

  function goToDetail() {
    if (id) {
      navigate(`/jobs/${id}`);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToDetail();
    }
  }

  function handleSaveClick(event) {
    event.stopPropagation();
    if (!user) {
      navigate("/signin");
      return;
    }
    toggleSave(id);
  }

  return (
    <div
      role={id ? "link" : undefined}
      tabIndex={id ? 0 : undefined}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      className={`relative bg-white rounded-xl overflow-hidden border border-charcoal/[0.07] shadow-sm hover:shadow-md transition-shadow ${id ? "cursor-pointer" : ""}`}
    >
      {id && (
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={isSaved ? "Remove from saved opportunities" : "Save opportunity"}
          aria-pressed={isSaved}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 border border-charcoal/[0.07] shadow-sm hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-4 h-4 ${isSaved ? "fill-accent stroke-accent" : "fill-none stroke-warm-gray"}`}
            strokeWidth="2"
          >
            <path
              d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <div className="p-[22px]">
        <div className="flex items-center gap-2 mb-3">
          <OppBadge type={badgeType}>{badgeLabel}</OppBadge>
          {borough && (
            <span className="inline-block font-sans text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-charcoal/5 text-warm-gray">
              {borough}
            </span>
          )}
          {careerLevel && (
            <span className="inline-block font-sans text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-charcoal/5 text-warm-gray">
              {careerLevel}
            </span>
          )}
        </div>
        <h3 className="font-sans font-semibold text-[17px] mb-1.5 pr-8">{title}</h3>
        <div className="text-sm text-warm-gray">{org}</div>
        {salarySummary && (
          <div className="text-sm text-charcoal mt-2">{salarySummary}</div>
        )}
        {requiresCivilServiceExam && (
          <div className="text-xs font-semibold text-[#8A4A26] bg-peach-tint inline-block mt-2.5 px-2.5 py-1 rounded-full">
            Requires Civil Service Exam
          </div>
        )}
      </div>
      <div className="border-t border-charcoal/[0.07] px-[22px] py-3.5 flex justify-between items-center text-xs text-warm-gray">
        <span>{posted}</span>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="text-forest font-semibold"
          >
            Apply →
          </a>
        ) : (
          <span className="text-forest font-semibold">Details →</span>
        )}
      </div>
    </div>
  );
}
