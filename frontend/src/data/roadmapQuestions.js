// Questions asked to everyone, in order.
export const baseQuestions = [
  {
    id: "isStudent",
    title: "Student Status",
    options: [
      { value: "yes", label: "I'm currently a student" },
      { value: "no", label: "I'm not currently a student" },
    ],
  },
  {
    id: "incomeBracket",
    title: "Income Bracket",
    options: [
      { value: "under25", label: "Under $25k/year" },
      { value: "25to50", label: "$25k-50k/year" },
      { value: "50plus", label: "$50k+/year" },
    ],
  },
  {
    id: "housingSituation",
    title: "Housing Situation",
    options: [
      { value: "rentingOffCampus", label: "Renting off campus" },
      { value: "livingAtHome", label: "Living at home" },
      { value: "unstable", label: "Unstable/at Risk" },
    ],
  },
  {
    id: "citizenshipStatus",
    title: "Citizenship Status",
    options: [
      { value: "citizen", label: "US citizen/Resident" },
      { value: "international", label: "International Student" },
      { value: "daca", label: "DACA/Undocumented" },
    ],
  },
];

// Only asked when isStudent === "no" — feeds the Job Assistance track.
export const salaryRangeQuestion = {
  id: "salaryRange",
  title: "Salary Range",
  options: [
    { value: "under30", label: "Under $30k/year" },
    { value: "30to60", label: "$30k-60k/year" },
    { value: "60plus", label: "$60k+/year" },
  ],
};

export function getQuestionsFor(answers) {
  const questions = [...baseQuestions];
  if (answers.isStudent === "no") {
    questions.push(salaryRangeQuestion);
  }
  return questions;
}
