import { Link } from "react-router-dom";

export default function BackLink({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream/85 hover:text-cream mb-6"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
