export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream/75">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
            O
          </div>
          <div className="font-sans font-semibold text-lg text-cream">
            Opportunity<span className="text-accent">NYC</span>
          </div>
        </div>
        <p className="text-sm max-w-[260px]">
          A centralized, organized directory of opportunities and resources across New York City.
        </p>
      </div>
    </footer>
  );
}
