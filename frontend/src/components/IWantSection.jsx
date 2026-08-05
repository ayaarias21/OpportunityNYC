import { Link } from "react-router-dom";
import jobPhoto from "../assets/iwant/job.jpg";
import housingPhoto from "../assets/iwant/housing.jpg";
import studentPhoto from "../assets/iwant/student.jpg";

const items = [
  {
    photo: housingPhoto,
    title: "Welfare Opportunities",
    desc: "Housing, food assistance, SNAP benefits, and other essential support programs.",
    cta: "Go to Welfare Opportunities",
    to: "/food",
  },
  {
    photo: studentPhoto,
    title: "Student Section",
    desc: "Internship and scholarship resources for students.",
    cta: "Go to Student Section",
    to: "/students",
  },
  {
    photo: jobPhoto,
    title: "Job Assistance",
    desc: "Browse full-time and part-time listings across all five boroughs.",
    cta: "Go to Job Assistance",
    to: "/jobs",
  },
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
                <Link to={item.to} className="inline-block mt-4 text-sm font-bold text-accent">
                  {item.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
