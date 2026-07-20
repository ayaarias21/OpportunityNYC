import foodPhoto from "../assets/iwant/food.jpg";

const foodTypes = [
  {
    tint: "bg-sage-tint",
    label: "Food Pantries",
    desc: "Free groceries and shelf-stable goods available weekly at community sites across the five boroughs.",
  },
  {
    tint: "bg-peach-tint",
    label: "Meal Programs",
    desc: "Hot, ready-to-eat meals served daily at soup kitchens and community centers near you.",
  },
  {
    tint: "bg-lavender",
    label: "SNAP Benefits",
    desc: "Apply for or renew SNAP (food stamp) benefits, and get help with the application process.",
  },
  {
    tint: "bg-sand",
    label: "Home-Delivered Meals",
    desc: "Meal delivery for seniors, people with disabilities, and those unable to travel to a pantry.",
  },
];

export default function FoodAssistance() {
  return (
    <div className="bg-cream">
      {/* Nav */}
      <div className="bg-accent-dark">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
              O
            </div>
            <div className="font-sans font-semibold text-lg text-cream">
              Opportunity<span className="text-accent">NYC</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-7 text-sm font-medium text-cream/85">
            <a href="#" className="hover:text-cream">Jobs</a>
            <a href="#" className="hover:text-cream">Housing</a>
            <a href="#" className="hover:text-cream">Food</a>
            <a href="#" className="hover:text-cream">Education</a>
            <a href="#" className="hover:text-cream">Community</a>
          </nav>

          <div className="flex items-center gap-3.5">
            <a href="#" className="text-sm font-semibold text-cream hover:underline">Sign In</a>
            <a href="#" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white rounded-md px-5 py-2.5">
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Page hero */}
      <header
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.8) 100%), url(${foodPhoto})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="inline-block font-sans text-[11px] tracking-widest uppercase text-cream bg-cream/10 border border-cream/25 rounded-md px-3.5 py-2 mb-5">
            Food Assistance
          </div>
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Find food assistance near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mb-7">
            Pantries, meal programs, SNAP benefits, and home delivery across all five boroughs.
          </p>

          <form className="flex max-w-lg gap-1.5 bg-accent-dark/55 border border-cream/25 rounded-xl p-1.5 backdrop-blur-sm">
            <input
              type="text"
              placeholder="Enter your zip code or borough"
              className="flex-1 bg-transparent outline-none px-4 text-cream placeholder:text-cream/55"
            />
            <button type="submit" className="bg-white text-charcoal font-semibold text-sm rounded-lg px-6">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Types of food assistance */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Ways to Get Help
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">Types of Food Assistance</h2>
          <p className="text-warm-gray text-sm">Pick the option that fits your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodTypes.map((type) => (
            <div
              key={type.label}
              className="bg-white border-2 border-charcoal rounded-xl p-7 flex gap-5 items-start"
            >
              <div className={`w-12 h-12 rounded-lg ${type.tint} flex-shrink-0`} />
              <div>
                <h3 className="font-sans font-bold text-lg text-charcoal mb-1.5">{type.label}</h3>
                <p className="text-sm text-warm-gray">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Listings placeholder */}
      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-white border-2 border-charcoal flex items-center justify-center mx-auto mb-5">
            <div className="w-4 h-4 rounded-full border-2 border-charcoal" />
          </div>
          <h2 className="font-sans font-bold text-2xl text-charcoal mb-2">
            Resource listings coming soon
          </h2>
          <p className="text-warm-gray text-sm max-w-md mx-auto">
            We're currently compiling verified pantries, meal programs, and food assistance
            resources across NYC. Check back soon to search real locations near you.
          </p>
        </div>
      </section>

      <footer className="bg-accent-dark text-cream/75">
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
    </div>
  );
}
