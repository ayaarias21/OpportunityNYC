// Example eligibility criteria — simplified stand-ins for real program rules.
// Swap the conditions below for actual thresholds once real program data is available.
export function buildRoadmap(answers) {
  const { isStudent, incomeBracket, housingSituation, citizenshipStatus, salaryRange } = answers;

  const welfare = [];
  const student = [];
  const jobAssistance = [];

  // Welfare Opportunities — applies regardless of student status.
  if (incomeBracket === "under25" || incomeBracket === "25to50") {
    welfare.push({
      title: "SNAP / Food Assistance",
      reason: "Your income bracket falls within typical SNAP eligibility limits.",
      steps: [
        "Check your household size against SNAP income limits on ACCESS HRA.",
        "Gather proof of income (pay stubs or benefit letters) and ID.",
        "Apply online at ACCESS HRA or visit your local SNAP office.",
        "Complete your eligibility interview (phone or in-person).",
      ],
    });
  }

  if (housingSituation === "unstable") {
    welfare.push({
      title: "Emergency Housing Assistance",
      reason: "You indicated your housing situation is unstable or at risk.",
      steps: [
        "Contact NYC's Homebase homelessness prevention program for your borough.",
        "Bring proof of income and your current housing situation to your appointment.",
        "Ask about one-time emergency rental assistance if facing eviction.",
        "Follow up within 5 business days if you haven't heard back.",
      ],
    });
  }

  if (housingSituation === "rentingOffCampus" && incomeBracket !== "50plus") {
    welfare.push({
      title: "Rental Assistance Program",
      reason: "You're renting and your income may qualify you for rental assistance.",
      steps: [
        "Confirm your household income falls within local rental assistance limits.",
        "Gather your lease and proof of income.",
        "Apply through your local HRA job center.",
        "Work with a housing specialist to review your eligible options.",
      ],
    });
  }

  // Student Section — only evaluated for students.
  if (isStudent === "yes") {
    if (citizenshipStatus === "international") {
      student.push({
        title: "International Student Support",
        reason: "You identified as an international student.",
        steps: [
          "Meet with your school's international student office about work-authorization rules (CPT/OPT).",
          "Ask about scholarships open specifically to international students.",
          "Check visa-compliant on-campus work-study options.",
        ],
      });
    }

    if (citizenshipStatus === "daca") {
      student.push({
        title: "DACA / Undocumented Student Support",
        reason: "You identified as DACA or undocumented.",
        steps: [
          "Connect with your school's undocumented student resource center.",
          "Look into NY State's tuition assistance for undocumented students.",
          "Ask about scholarship funds open to DACA recipients.",
        ],
      });
    }

    if (housingSituation === "unstable") {
      student.push({
        title: "Student Emergency & Basic Needs",
        reason: "You indicated your housing situation is unstable or at risk.",
        steps: [
          "Contact your school's basic needs or emergency fund office.",
          "Ask about emergency housing or meal assistance programs.",
          "Apply for a hardship withdrawal or tuition deferment if needed.",
        ],
      });
    }

    if (student.length === 0) {
      student.push({
        title: "General Student Support",
        reason: "Based on your answers, these general resources are a good starting point.",
        steps: [
          "Visit your school's financial aid office to review scholarship options.",
          "Check tutoring and mentorship programs available on campus.",
          "Ask about work-study opportunities for next semester.",
        ],
      });
    }
  }

  // Job Assistance — only evaluated for non-students.
  if (isStudent === "no") {
    if (salaryRange === "under30") {
      jobAssistance.push({
        title: "Job Training & Placement",
        reason: "Based on your target salary range, free training programs may boost your options.",
        steps: [
          "Visit your local Workforce1 Career Center for free job training.",
          "Bring a resume, or use their on-site resume help.",
          "Ask about certification programs in high-demand fields.",
          "Schedule a one-on-one session with a career coach.",
        ],
      });
    } else if (salaryRange === "30to60") {
      jobAssistance.push({
        title: "Mid-Level Job Placement",
        reason: "Based on your target salary range, sector-based placement programs are a good fit.",
        steps: [
          "Register with Workforce1 or a sector-based job program in your field.",
          "Update your resume and LinkedIn with a career counselor's help.",
          "Attend a hiring event or job fair in your borough.",
        ],
      });
    } else if (salaryRange === "60plus") {
      jobAssistance.push({
        title: "Career Advancement Resources",
        reason: "Based on your target salary range, upskilling and networking resources are a good fit.",
        steps: [
          "Explore professional certification or upskilling programs.",
          "Look for networking events in your industry.",
          "Consider mentorship programs for career growth.",
        ],
      });
    }

    if (citizenshipStatus === "daca") {
      jobAssistance.push({
        title: "Work Authorization Check",
        reason: "You identified as DACA or undocumented.",
        steps: [
          "Confirm your current work permit (EAD) is valid and not expiring soon.",
          "Ask employers directly about their sponsorship or hiring policies.",
          "Contact a legal aid clinic if you need help renewing your status.",
        ],
      });
    }

    if (citizenshipStatus === "international") {
      jobAssistance.push({
        title: "Work Authorization Requirements",
        reason: "You identified as an international student seeking work.",
        steps: [
          "Confirm your visa status allows employment in the U.S.",
          "Contact an immigration legal service for work-authorization guidance.",
        ],
      });
    }
  }

  return { welfare, student, jobAssistance };
}
