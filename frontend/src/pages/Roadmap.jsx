import { useMemo, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import QuestionCard from "../components/QuestionCard";
import RoadmapResultCard from "../components/RoadmapResultCard";
import { Button } from "../components/ui/button";
import { getQuestionsFor } from "../data/roadmapQuestions";
import { buildRoadmap } from "../lib/eligibilityEngine";
import roadmapHero from "../assets/roadmap-hero.jpg";

export default function Roadmap() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => getQuestionsFor(answers), [answers]);
  const currentQuestion = questions[stepIndex];
  const roadmap = useMemo(() => buildRoadmap(answers), [answers]);

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (stepIndex + 1 < questions.length) {
      setStepIndex(stepIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const handleBack = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
    setFinished(false);
    setStarted(false);
  };

  const totalMatches = roadmap.welfare.length + roadmap.student.length + roadmap.jobAssistance.length;

  return (
    <div>
      <Nav />

      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${roadmapHero})` }}
        />

        <section className="relative max-w-2xl mx-auto px-6 pt-14 pb-20">
        {!started && (
          <div className="text-center">
            <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
              Personalized Roadmap
            </div>
            <h1 className="font-sans font-bold text-3xl text-charcoal mb-3">
              Find the programs you qualify for
            </h1>
            <p className="text-warm-gray text-sm max-w-md mx-auto mb-8">
              Answer a few short questions and we'll match you to welfare, student, and job
              assistance programs you may be eligible for, plus a step-by-step checklist to get
              started.
            </p>
            <Button variant="accent" size="lg" onClick={() => setStarted(true)}>
              Start
            </Button>
          </div>
        )}

        {started && !finished && currentQuestion && (
          <div>
            <div className="mb-6">
              <div className="text-xs text-warm-gray mb-1.5">
                Question {stepIndex + 1} of {questions.length}
              </div>
              <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${((stepIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <QuestionCard
              title={currentQuestion.title}
              options={currentQuestion.options}
              value={answers[currentQuestion.id]}
              onChange={handleSelect}
            />

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={stepIndex === 0}
              >
                Back
              </Button>
              <Button
                variant="accent"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
              >
                {stepIndex + 1 === questions.length ? "See my roadmap" : "Next"}
              </Button>
            </div>
          </div>
        )}

        {finished && (
          <div>
            <div className="mb-8">
              <div className="font-sans text-xs tracking-widest uppercase text-accent mb-2.5">
                Your Roadmap
              </div>
              <h1 className="font-sans font-bold text-2xl text-charcoal mb-1.5">
                {totalMatches > 0
                  ? `You may qualify for ${totalMatches} program${totalMatches === 1 ? "" : "s"}`
                  : "No matches based on your answers yet"}
              </h1>
              <p className="text-warm-gray text-sm">
                Check off each step as you complete it.
              </p>
            </div>

            {roadmap.welfare.length > 0 && (
              <div className="mb-8">
                <h2 className="font-sans font-semibold text-lg text-charcoal mb-3">
                  Welfare Opportunities
                </h2>
                <div className="space-y-4">
                  {roadmap.welfare.map((match) => (
                    <RoadmapResultCard key={match.title} {...match} />
                  ))}
                </div>
              </div>
            )}

            {roadmap.student.length > 0 && (
              <div className="mb-8">
                <h2 className="font-sans font-semibold text-lg text-charcoal mb-3">
                  Student Section
                </h2>
                <div className="space-y-4">
                  {roadmap.student.map((match) => (
                    <RoadmapResultCard key={match.title} {...match} />
                  ))}
                </div>
              </div>
            )}

            {roadmap.jobAssistance.length > 0 && (
              <div className="mb-8">
                <h2 className="font-sans font-semibold text-lg text-charcoal mb-3">
                  Job Assistance
                </h2>
                <div className="space-y-4">
                  {roadmap.jobAssistance.map((match) => (
                    <RoadmapResultCard key={match.title} {...match} />
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" onClick={handleRestart}>
              Start over
            </Button>
          </div>
        )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
