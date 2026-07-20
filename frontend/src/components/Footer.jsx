export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream/75">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-6 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
        <div>
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

        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-sand mb-4">About</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="#" className="hover:text-cream hover:underline">Our Mission</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Partner Orgs</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Team</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-sand mb-4">Resources</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="#" className="hover:text-cream hover:underline">Jobs</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Housing</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Food</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Education</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-sand mb-4">Legal</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="#" className="hover:text-cream hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Accessibility</a></li>
            <li><a href="#" className="hover:text-cream hover:underline">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-[18px] text-center font-sans text-xs text-cream/50">
        OPPORTUNITYNYC • CSCI STUDENT PROJECT • NOT AN OFFICIAL CITY SERVICE
      </div>
    </footer>
  );
}
