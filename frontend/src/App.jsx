import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./pages/Homepage";
import SearchResults from "./pages/SearchResults";
import FoodAssistance from "./pages/FoodAssistance";
import SnapBenefits from "./pages/SnapBenefits";
import MealPrograms from "./pages/MealPrograms";
import FoodPantries from "./pages/FoodPantries";
import CashAssistance from "./pages/CashAssistance";
import HealthCoverage from "./pages/HealthCoverage";
import WelfareSearchResults from "./pages/WelfareSearchResults";
import HousingHelp from "./pages/HousingHelp";
import JobsPage from "./pages/JobsPage";
import JobDetail from "./pages/JobDetail";
import JobTraining from "./pages/JobTraining";
import ResumeInterviewHelp from "./pages/ResumeInterviewHelp";
import CareerCounseling from "./pages/CareerCounseling";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Roadmap from "./pages/Roadmap";
import StudentSection from "./pages/StudentSection";
import SavedOpportunities from "./pages/SavedOpportunities";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/food" element={<FoodAssistance />} />
          <Route path="/food/snap" element={<SnapBenefits />} />
          <Route path="/food/meals" element={<MealPrograms />} />
          <Route path="/food/pantries" element={<FoodPantries />} />
          <Route path="/food/cash-assistance" element={<CashAssistance />} />
          <Route path="/food/health-coverage" element={<HealthCoverage />} />
          <Route path="/food/search" element={<WelfareSearchResults />} />
          <Route path="/food/housing" element={<HousingHelp />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/training" element={<JobTraining />} />
          <Route path="/jobs/resume-help" element={<ResumeInterviewHelp />} />
          <Route path="/jobs/career-counseling" element={<CareerCounseling />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/students" element={<StudentSection />} />
          <Route path="/saved" element={<SavedOpportunities />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
