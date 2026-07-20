const styles = {
  fulltime: "bg-sand text-charcoal",
  internship: "bg-peach-tint text-[#8A4A26]",
  scholarship: "bg-lavender text-[#5B4C87]",
};

export default function OppBadge({ type, children }) {
  return (
    <span className={`inline-block font-sans text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full mb-3 ${styles[type]}`}>
      {children}
    </span>
  );
}
