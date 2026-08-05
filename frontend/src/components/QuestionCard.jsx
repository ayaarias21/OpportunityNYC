export default function QuestionCard({ title, options, value, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-charcoal/[0.07] shadow-sm p-6">
      <h3 className="font-sans font-bold text-base text-charcoal mb-4">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="w-full flex items-center gap-3 text-left text-sm"
            >
              <span
                className={`h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selected ? "border-accent" : "border-charcoal/25"
                }`}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
              </span>
              <span className={selected ? "text-charcoal font-medium" : "text-warm-gray"}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
