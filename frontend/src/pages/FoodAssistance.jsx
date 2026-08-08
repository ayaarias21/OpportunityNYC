import { Link, useNavigate } from "react-router-dom";
import foodPhoto from "../assets/iwant/food.jpg";
import { useState } from "react";
import Footer from "../components/Footer";

const foodTypes = [
  {
    tint: "bg-sage-tint",
    label: "Food Pantries",
    desc: "Free groceries and shelf-stable goods available weekly at community sites across the five boroughs.",
    to: "/food/pantries",
  },
  {
    tint: "bg-peach-tint",
    label: "Meal Programs",
    desc: "Hot, ready-to-eat meals served daily at soup kitchens and community centers near you.",
    to: "/food/meals",
  },
  {
    tint: "bg-lavender",
    label: "SNAP Benefits",
    desc: "Apply for or renew SNAP (food stamp) benefits, and get help with the application process.",
    to: "/food/snap",
  },
  {
    tint: "bg-sand",
    label: "Cash Assistance",
    desc: "Monthly and emergency cash help, unemployment income, and Social Security / SSI support.",
    to: "/food/cash-assistance",
  },
  {
    tint: "bg-sage-tint",
    label: "Health Coverage",
    desc: "Medicaid, Child Health Plus, and other no- or low-cost health insurance programs and enrollment offices.",
    to: "/food/health-coverage",
  },
  {
    tint: "bg-peach-tint",
    label: "Housing Help",
    desc: "Section 8 vouchers, HomeBase, HASA, affordable housing, and eviction prevention support.",
    to: "/food/housing",
  },
];

export default function FoodAssistance() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = searchValue.trim();
    navigate(trimmed ? `/food/search?q=${encodeURIComponent(trimmed)}` : "/food/search");
  }

  return (
    <div className="bg-cream">
      {/* Nav */}
      <div className="bg-accent-dark">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-md bg-accent flex items-center justify-center text-white font-sans font-bold text-lg">
              O
            </div>
            <div className="font-sans font-semibold text-lg text-cream">
              Opportunity<span className="text-accent">NYC</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-7 text-sm font-medium text-cream/85">
            <Link to="/food" className="hover:text-cream">Welfare Opportunities</Link>
            <Link to="/students" className="hover:text-cream">Student Section</Link>
            <Link to="/jobs" className="hover:text-cream">Job Assistance</Link>
            <Link to="/roadmap" className="hover:text-cream">Eligibility Machine</Link>
          </nav>

          <div className="flex items-center gap-3.5">
            <Link to="/signin" className="text-sm font-semibold text-cream hover:underline">Sign In</Link>
            <Link to="/signup" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white rounded-md px-5 py-2.5">
              Get Started
            </Link>
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
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Find welfare opportunities near you.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mb-7">
            Includes housing and SNAP, along with pantries, meal programs, and home delivery across all five boroughs.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="flex max-w-lg gap-1.5 bg-accent-dark/55 border border-cream/25 rounded-xl p-1.5 backdrop-blur-sm"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search SNAP, Medicaid, cash assistance, a borough, zip code..."
              className="flex-1 bg-transparent outline-none px-4 text-cream placeholder:text-cream/55"
            />
            <button type="submit" className="bg-white text-charcoal font-semibold text-sm rounded-lg px-6">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Types of welfare opportunities */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Did You Know?
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5 max-w-3xl mx-auto">
            1 in 5 eligible New Yorkers miss out on SNAP alone, and 57% of applicants hit
            roadblocks trying to access benefits system-wide. We&rsquo;re closing that gap.
          </h2>
          <p className="text-warm-gray text-sm">Pick the option that fits your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodTypes.map((type) => {
            const cardClasses =
              "bg-white border-2 border-charcoal rounded-xl p-7 flex gap-5 items-start" +
              (type.to ? " hover:shadow-md transition-shadow cursor-pointer" : "");

            const content = (
              <>
                <div className={`w-12 h-12 rounded-lg ${type.tint} flex-shrink-0`} />
                <div>
                  <h3 className="font-sans font-bold text-lg text-charcoal mb-1.5">{type.label}</h3>
                  <p className="text-sm text-warm-gray">{type.desc}</p>
                </div>
              </>
            );

            return type.to ? (
              <Link key={type.label} to={type.to} className={cardClasses}>
                {content}
              </Link>
            ) : (
              <div key={type.label} className={cardClasses}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
