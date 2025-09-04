import React, { useState, useEffect } from "react";
import {
  Beaker,
  Activity,
  BookOpen,
  Settings,
  ArrowRight,
  Circle,
  Sparkles,
  Atom,
  Waves,
} from "lucide-react";

const BrewstersLawCalculator = () => {
  const [readings, setReadings] = useState([]);
  const [angle, setAngle] = useState("");
  const [animationStep, setAnimationStep] = useState(0);
  const [activeTable, setActiveTable] = useState("results");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const calculateRefractiveIndex = (polarizingAngle) => {
    // Convert angle to radians for Math.tan
    const angleInRadians = (polarizingAngle * Math.PI) / 180;
    return Math.tan(angleInRadians).toFixed(4);
  };

  const handleAddReading = () => {
    if (angle) {
      const angleValue = parseFloat(angle);
      const refractiveIndex = calculateRefractiveIndex(angleValue);

      setReadings([
        ...readings,
        {
          id: readings.length + 1,
          angle: angleValue,
          refractiveIndex,
        },
      ]);

      setAngle("");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTable(id)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
        activeTable === id
          ? "bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-orange-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Floating Science Icons */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[Waves, Atom, Sparkles].map((Icon, index) => (
            <div
              key={index}
              className={`absolute transform transition-all duration-1000 ${
                animationStep === index
                  ? "translate-x-0 opacity-30"
                  : "translate-x-full opacity-0"
              }`}
              style={{
                top: `${index * 25}%`,
                left: `${index * 30}%`,
              }}
            >
              <Icon className="h-8 w-8 text-orange-500" />
            </div>
          ))}
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-center mb-8 animate-pulse">
            Brewster's Law Calculator
          </h1>

          {/* Input Section with 3D effect */}
          <div className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-102 transition-transform duration-300 border border-orange-100 relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <input
                  type="number"
                  placeholder="Polarizing Angle (ip) in degrees"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transform hover:-translate-y-1 transition-all duration-300"
                />
                <span className="absolute -top-2 left-2 px-2 bg-white text-orange-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Polarizing Angle
                </span>
              </div>
              <button
                onClick={handleAddReading}
                className="px-8 py-3 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Calculate
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            {showTooltip && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-green-500 text-white rounded-lg transition-all duration-300 animate-bounce">
                Reading added successfully!
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-4 mt-8 mb-4">
            <TabButton id="results" label="Results" icon={Activity} />
            <TabButton id="theory" label="Theory" icon={BookOpen} />
            <TabButton id="apparatus" label="Apparatus" icon={Beaker} />
            <TabButton id="procedure" label="Procedure" icon={Settings} />
          </div>

          {/* Content Tables */}
          <div className="grid grid-cols-1 gap-8">
            {/* Results Table */}
            {activeTable === "results" && (
              <div className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-102 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-orange-500" />
                  Measurements and Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                      <tr>
                        <th className="p-4 text-left">S.No</th>
                        <th className="p-4 text-left">
                          Polarizing Angle (ip°)
                        </th>
                        <th className="p-4 text-left">Refractive Index (μ)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.map((reading) => (
                        <tr
                          key={reading.id}
                          className="border-t hover:bg-orange-50 transition-colors duration-200"
                        >
                          <td className="p-4">{reading.id}</td>
                          <td className="p-4">{reading.angle}°</td>
                          <td className="p-4">{reading.refractiveIndex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Theory Table */}
            {activeTable === "theory" && (
              <div className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-102 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  Theory and Formulas
                </h2>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4 font-semibold">Brewster's Law</td>
                      <td className="p-4">μ = tan(ip)</td>
                    </tr>
                    <tr className="border-b hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4 font-semibold">Variables</td>
                      <td className="p-4">
                        μ = refractive index
                        <br />
                        ip = polarizing angle
                      </td>
                    </tr>
                    <tr className="hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4 font-semibold">Description</td>
                      <td className="p-4">
                        Brewster's law states that the tangent of the polarizing
                        angle equals the refractive index of the medium
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Apparatus Table */}
            {activeTable === "apparatus" && (
              <div className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-102 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Beaker className="h-6 w-6 text-orange-500" />
                  Required Apparatus
                </h2>
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <tr>
                      <th className="p-4 text-left">Item</th>
                      <th className="p-4 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">Polarizer</td>
                      <td className="p-4">To polarize incident light</td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">Glass plate</td>
                      <td className="p-4">Sample medium for reflection</td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">Light source</td>
                      <td className="p-4">For incident beam</td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">Protractor</td>
                      <td className="p-4">For angle measurements</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Procedure Table */}
            {activeTable === "procedure" && (
              <div className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-102 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-orange-500" />
                  Experimental Procedure
                </h2>
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <tr>
                      <th className="p-4 text-left">Step</th>
                      <th className="p-4 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">1</td>
                      <td className="p-4">
                        Set up the light source and glass plate
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">2</td>
                      <td className="p-4">
                        Adjust the polarizer to observe reflected light
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">3</td>
                      <td className="p-4">
                        Find the angle where reflected light is completely
                        polarized
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">4</td>
                      <td className="p-4">
                        Measure this polarizing angle and calculate refractive
                        index
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewstersLawCalculator;
