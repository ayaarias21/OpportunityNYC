export default function CategoryPill({ label, dotColor, href = "#" }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2.5 text-sm font-medium text-cream hover:bg-cream/20 transition-colors"
    >
      <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
      {label}
    </a>
  );
}
