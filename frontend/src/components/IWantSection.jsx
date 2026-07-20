import jobPhoto from "../assets/iwant/job.jpg";
import housingPhoto from "../assets/iwant/housing.jpg";
import foodPhoto from "../assets/iwant/food.jpg";
import internshipPhoto from "../assets/iwant/internship.jpg";
import skillPhoto from "../assets/iwant/skill.jpg";
import studentPhoto from "../assets/iwant/student.jpg";

const items = [
  { photo: jobPhoto, title: "Find a job", desc: "Browse full-time and part-time listings across all five boroughs.", cta: "Go to Jobs" },
  { photo: housingPhoto, title: "Find housing", desc: "Emergency shelter, affordable units, and rental assistance programs.", cta: "Go to Housing" },
  { photo: foodPhoto, title: "Find food assistance", desc: "Locate the nearest pantry or meal program open today.", cta: "Go to Food" },
  { photo: internshipPhoto, title: "Apply for an internship", desc: "Paid and academic-credit opportunities for students.", cta: "Go to Internships" },
  { photo: skillPhoto, title: "Build a new skill", desc: "Free workshops and certification programs across the city.", cta: "Go to Workshops" },
  { photo: studentPhoto, title: "Get student support", desc: "Tutoring, mentorship, and scholarship resources.", cta: "Go to Student Support" },
];

export default function IWantSection() {
  return (
    <section className="bg-sand">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-11">
          <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
            Start Here
          </div>
          <h2 className="font-sans font-bold text-3xl text-charcoal mb-2.5">I want to...</h2>
          <p className="text-warm-gray text-sm">
            Tell us what you need, and we'll route you to the right section.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white border-2 border-charcoal rounded-xl overflow-hidden flex flex-col"
            >
              <img
                src={item.photo}
                alt=""
                className="w-full aspect-[3/2] object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-sans font-bold text-lg text-charcoal">{item.title}</h3>
                <hr className="border-t border-warm-gray/30 my-3" />
                <p className="text-sm text-warm-gray flex-1">{item.desc}</p>
                <a href="#" className="inline-block mt-4 text-sm font-bold text-accent">
                  {item.cta} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
