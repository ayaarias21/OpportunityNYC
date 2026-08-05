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
        { text: "Check your household size against SNAP income limits on ACCESS HRA.", url: "https://a069-access.nyc.gov/" },
        { text: "Gather proof of income (pay stubs or benefit letters) and ID." },
        { text: "Apply online at ACCESS HRA or visit your local SNAP office.", url: "https://a069-access.nyc.gov/" },
        { text: "Complete your eligibility interview (phone or in-person)." },
      ],
    });
  }

  if (housingSituation === "unstable") {
    welfare.push({
      title: "Emergency Housing Assistance",
      reason: "You indicated your housing situation is unstable or at risk.",
      steps: [
        { text: "Contact NYC's Homebase homelessness prevention program for your borough.", url: "https://www.nyc.gov/site/hra/help/homebase.page" },
        { text: "Bring proof of income and your current housing situation to your appointment." },
        { text: "Ask about one-time emergency rental assistance if facing eviction.", url: "https://access.nyc.gov/programs/one-shot-deal/" },
        { text: "Follow up within 5 business days if you haven't heard back." },
      ],
    });
  }

  if (housingSituation === "rentingOffCampus" && incomeBracket !== "50plus") {
    welfare.push({
      title: "Rental Assistance Program",
      reason: "You're renting and your income may qualify you for rental assistance.",
      steps: [
        { text: "Confirm your household income falls within local rental assistance limits." },
        { text: "Gather your lease and proof of income." },
        { text: "Apply through your local HRA job center.", url: "https://www.nyc.gov/site/hra/locations/locations.page" },
        { text: "Work with a housing specialist to review your eligible options." },
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
          { text: "Meet with your school's international student office about work-authorization rules (CPT/OPT).", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" },
          { text: "Ask about scholarships open specifically to international students." },
          { text: "Check visa-compliant on-campus work-study options." },
        ],
      });
    }

    if (citizenshipStatus === "daca") {
      student.push({
        title: "DACA / Undocumented Student Support",
        reason: "You identified as DACA or undocumented.",
        steps: [
          { text: "Connect with your school's undocumented student resource center." },
          { text: "Look into NY State's tuition assistance for undocumented students.", url: "https://www.hesc.ny.gov/dream/" },
          { text: "Ask about scholarship funds open to DACA recipients." },
        ],
      });
    }

    if (housingSituation === "unstable") {
      student.push({
        title: "Student Emergency & Basic Needs",
        reason: "You indicated your housing situation is unstable or at risk.",
        steps: [
          { text: "Contact your school's basic needs or emergency fund office." },
          { text: "Ask about emergency housing or meal assistance programs." },
          { text: "Apply for a hardship withdrawal or tuition deferment if needed." },
        ],
      });
    }

    if (student.length === 0) {
      student.push({
        title: "General Student Support",
        reason: "Based on your answers, these general resources are a good starting point.",
        steps: [
          { text: "Visit your school's financial aid office to review scholarship options." },
          { text: "Check tutoring and mentorship programs available on campus." },
          { text: "Ask about work-study opportunities for next semester." },
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
          { text: "Visit your local Workforce1 Career Center for free job training.", url: "https://www.nyc.gov/site/sbs/careers/wf1-career-centers.page" },
          { text: "Bring a resume, or use their on-site resume help." },
          { text: "Ask about certification programs in high-demand fields." },
          { text: "Schedule a one-on-one session with a career coach." },
        ],
      });
    } else if (salaryRange === "30to60") {
      jobAssistance.push({
        title: "Mid-Level Job Placement",
        reason: "Based on your target salary range, sector-based placement programs are a good fit.",
        steps: [
          { text: "Register with Workforce1 or a sector-based job program in your field.", url: "https://www.nyc.gov/site/sbs/careers/wf1-career-centers.page" },
          { text: "Update your resume and LinkedIn with a career counselor's help.", url: "https://www.linkedin.com" },
          { text: "Attend a hiring event or job fair in your borough." },
        ],
      });
    } else if (salaryRange === "60plus") {
      jobAssistance.push({
        title: "Career Advancement Resources",
        reason: "Based on your target salary range, upskilling and networking resources are a good fit.",
        steps: [
          { text: "Explore professional certification or upskilling programs." },
          { text: "Look for networking events in your industry." },
          { text: "Consider mentorship programs for career growth." },
        ],
      });
    }

    if (citizenshipStatus === "daca") {
      jobAssistance.push({
        title: "Work Authorization Check",
        reason: "You identified as DACA or undocumented.",
        steps: [
          { text: "Confirm your current work permit (EAD) is valid and not expiring soon.", url: "https://www.uscis.gov/i-765" },
          { text: "Ask employers directly about their sponsorship or hiring policies." },
          { text: "Contact a legal aid clinic if you need help renewing your status.", url: "https://www.nyc.gov/site/hra/help/immigrant-resources.page" },
        ],
      });
    }

    if (citizenshipStatus === "international") {
      jobAssistance.push({
        title: "Work Authorization Requirements",
        reason: "You identified as an international student seeking work.",
        steps: [
          { text: "Confirm your visa status allows employment in the U.S.", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors" },
          { text: "Contact an immigration legal service for work-authorization guidance.", url: "https://www.nyc.gov/site/hra/help/immigrant-resources.page" },
        ],
      });
    }
  }

  return { welfare, student, jobAssistance };
}
