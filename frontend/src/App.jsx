import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SearchResults from "./pages/SearchResults";
import JobsPage from "./pages/JobsPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Roadmap from "./pages/Roadmap";
import StudentSection from "./pages/StudentSection";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/students" element={<StudentSection />} />
      </Routes>
    </BrowserRouter>
  );
}
