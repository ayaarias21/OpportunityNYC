import studentPhoto from "../assets/iwant/student.jpg";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const studentTypes = [
  {
    label: "Internships",
    desc: "Paid and academic-credit internship opportunities with NYC agencies and partner organizations.",
  },
  {
    label: "Workshops & Skill-Building",
    desc: "Free workshops and certification programs to help you build new skills across the city.",
  },
  {
    label: "Scholarships",
    desc: "Financial aid and scholarship resources for first-generation and low-income students.",
  },
];

export default function StudentSection() {
  return (
    <div className="bg-cream">
      <Nav />

      {/* Page hero */}
      <header
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.8) 100%), url(${studentPhoto})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="font-sans font-bold text-white text-4xl leading-tight mb-4 max-w-2xl">
            Resources built for NYC students.
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mb-7">
            Internships, workshops, and scholarships across all five boroughs.
          </p>

          <form className="flex max-w-lg gap-1.5 bg-accent-dark/55 border border-cream/25 rounded-xl p-1.5 backdrop-blur-sm">
            <input
              type="text"
              placeholder="Search internships, workshops, or scholarships"
              className="flex-1 bg-transparent outline-none px-4 text-cream placeholder:text-cream/55"
            />
            <button type="submit" className="bg-white text-charcoal font-semibold text-sm rounded-lg px-6">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Types of student resources */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Ways to Get Involved
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">Types of Student Support</h2>
          <p className="text-warm-gray text-sm">Pick the option that fits your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentTypes.map((type) => (
            <div
              key={type.label}
              className="bg-white border-2 border-charcoal rounded-xl p-7"
            >
              <h3 className="font-sans font-bold text-lg text-charcoal mb-2">{type.label}</h3>
              <p className="text-sm text-warm-gray">{type.desc}</p>
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
            We're currently compiling verified internships, workshops, and scholarship
            resources across NYC. Check back soon to search real opportunities near you.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
