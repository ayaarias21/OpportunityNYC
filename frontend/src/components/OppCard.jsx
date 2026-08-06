import { useNavigate } from "react-router-dom";
import OppBadge from "./OppBadge";

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

  return (
    <div
      role={id ? "link" : undefined}
      tabIndex={id ? 0 : undefined}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      className={`bg-white rounded-xl overflow-hidden border border-charcoal/[0.07] shadow-sm hover:shadow-md transition-shadow ${id ? "cursor-pointer" : ""}`}
    >
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
        <h3 className="font-sans font-semibold text-[17px] mb-1.5">{title}</h3>
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
