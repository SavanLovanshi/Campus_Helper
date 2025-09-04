import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Components
import BrewstersLawCalculator from "./components/Manuals/Experiment8/BrewsterLawCalculator";
import OpticalFiberCalculator from "./components/Manuals/Experiment7/OpticalFiberCalculator";
import BentoExperimentGrid from "./components/Manuals/ExperimentGrid";
import Home from "./components/Meeting/MeetingRoom";
import Room from "./components/Meeting/Room";
import LandingPage from "./components/Home/Hero";
import ChatBot from "./components/Bot/ChatBot";
import Navbar from "./components/core/Navbar";
import LoginSignup from "./components/Auth/Login";
import MasonryDoubts from "./components/Doubts/ViewDoubts";
import PhysicsFormulaCalculator from "./components/Calculator/FormulaCalculator";
import VirtualPhysicsLab from "./components/VirtualLab/VirtualLab";
import Footer from "./components/core/Footer";
import NewtonsThirdLawSimulator from "./components/Game/NewtonsThirdLawSimulator";
import PNJunctionDiodeCharacteristics from "./components/Manuals/Experiment5/PNJunctionDiodeCharacteristics";
import LaserWavelengthCalculator from "./components/Manuals/Experiment1/LaserWavelengthCalculator";
import RollerCoasterSimulator from "./components/Game/RollerCoaster";
import Physics from "./components/Physics/Physics";
import Cse from "./components/Cse/Cse";
import Electronics from "./components/Electronics/Electronics";
import Mechanical from "./components/Mechanical/Mechanical";
import CQuizGame from "./components/Cse/CQuizGame"
import JavaScriptGame from "./components/Cse/JavaScriptGame"
import Resume from "./components/Resume/Resume";
import Skills from "./components/Resume/Sections/Skills";
// import ResMain from "./components/Resume/ResMain";
// AppContent component to use React Router hooks
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        user={user}
      />
      <div className="flex-grow pt-20">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<LandingPage onNavigate={handleNavigate} user={user} />} />

          {/* Auth route */}
          <Route path="/auth" element={<LoginSignup role="user" />} />

          {/* <Route path="/Select" element={<ResMain role="user" />} /> */}
          <Route path="/resume" element={<Resume role="user" />} />
          {/* <Route path="/resume-add-skills" element={<Skills />} /> */}

          <Route path="/physics/*" element={<Physics onNavigate={handleNavigate} user={user} />} />
          {/* Physics route */}
          <Route path="lab-manual" element={<BentoExperimentGrid />} />
          <Route path="optical-fiber" element={<OpticalFiberCalculator />} />
          <Route path="brewsters-law" element={<BrewstersLawCalculator />} />
          <Route path="bot" element={<ChatBot />} />
          <Route path="meeting" element={<Home />} />
          <Route path="meeting/room/:roomid" element={<Room />} />
          <Route path="ask-doubts" element={<MasonryDoubts />} />
          <Route path="physics-calculator" element={<PhysicsFormulaCalculator />} />
          <Route path="virtual-lab" element={<VirtualPhysicsLab />} />
          <Route path="game" element={<NewtonsThirdLawSimulator />} />
          <Route path="pn-junction" element={<PNJunctionDiodeCharacteristics />} />
          <Route path="laser-wave" element={<LaserWavelengthCalculator />} />
          <Route path="roller-coaster" element={<RollerCoasterSimulator />} />

          <Route path="/cse/*" element={<Cse onNavigate={handleNavigate} user={user} />} />
          <Route path="/cse/c" element={<CQuizGame onNavigate={handleNavigate} user={user} />} />
          <Route path="/cse/java-script" element={<JavaScriptGame onNavigate={handleNavigate} user={user} />} />

          <Route path="/electronics/*" element={<Electronics onNavigate={handleNavigate} user={user} />} />


          <Route path="/mechanical/*" element={<Mechanical onNavigate={handleNavigate} user={user} />} />
          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-orange-500 mb-4">
                    404
                  </h1>
                  <p className="text-gray-700 mb-4">Page not found</p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-md hover:shadow-lg transition-all duration-300"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;