import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SearchResults from "./pages/SearchResults";
import FoodAssistance from "./pages/FoodAssistance";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/food" element={<FoodAssistance />} />
      </Routes>
    </BrowserRouter>
  );
}
