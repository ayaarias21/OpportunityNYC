import OppBadge from "./OppBadge";

export default function OppCard({ badgeType, badgeLabel, title, org, posted }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-charcoal/[0.07] shadow-sm">
      <div className="p-[22px]">
        <OppBadge type={badgeType}>{badgeLabel}</OppBadge>
        <h3 className="font-sans font-semibold text-[17px] mb-1.5">{title}</h3>
        <div className="text-sm text-warm-gray">{org}</div>
      </div>
      <div className="border-t border-charcoal/[0.07] px-[22px] py-3.5 flex justify-between items-center text-xs text-warm-gray">
        <span>{posted}</span>
        <a href="#" className="text-forest font-semibold">View →</a>
      </div>
    </div>
  );
}
