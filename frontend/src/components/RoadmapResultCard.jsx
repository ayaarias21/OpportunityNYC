import { useState } from "react";

export default function RoadmapResultCard({ title, reason, steps }) {
  const [checked, setChecked] = useState(() => steps.map(() => false));

  const toggleStep = (index) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-charcoal/[0.07] shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-sans font-bold text-base text-charcoal">{title}</h4>
        <span className="text-xs text-warm-gray flex-shrink-0">
          {doneCount}/{steps.length} done
        </span>
      </div>
      <p className="text-sm text-warm-gray mb-4">{reason}</p>
      <ul className="space-y-2.5">
        {steps.map((step, index) => (
          <li key={step}>
            <button
              type="button"
              onClick={() => toggleStep(index)}
              className="w-full flex items-start gap-3 text-left"
            >
              <span
                className={`mt-0.5 h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] ${
                  checked[index]
                    ? "bg-accent border-accent text-white"
                    : "border-charcoal/25"
                }`}
              >
                {checked[index] && "✓"}
              </span>
              <span
                className={`text-sm ${
                  checked[index] ? "text-warm-gray line-through" : "text-charcoal"
                }`}
              >
                {step}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
