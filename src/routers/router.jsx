import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "../components/RegistrationPage";
import InstructionsPage from "../components/InstructionsPage";
import LevelOne from "../components/LevelOne";
import LevelTwo from "../components/LevelTwo";
import Completed from "../components/completed"; // Import Completed Page
import ResultsPage from "../components/ResultsPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/level-one" element={<LevelOne />} />
        <Route path="/level-two" element={<LevelTwo />} />
        <Route path="/completed" element={<Completed />} /> {/* Added Completed Page */}
        <Route path="/resultPage" element={<ResultsPage/>}/>
      </Routes>
    </Router>
  );
};

export default AppRouter;
