import React, { useState, useEffect } from "react";
import {
  Beaker,
  Zap,
  BookOpen,
  Settings,
  ArrowRight,
  Circle,
  Activity,
  Sparkles,
  Atom,
} from "lucide-react";

const OpticalFiberCalculator = () => {
  const [readings, setReadings] = useState([]);
  const [distance, setDistance] = useState("");
  const [radius, setRadius] = useState("");
  const [animationStep, setAnimationStep] = useState(0);
  const [activeTable, setActiveTable] = useState("results");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const calculateMiracleAperture = (d, r) => {
    return (r / Math.sqrt(r * r + d * d)).toFixed(4);
  };

  const calculateAcceptanceAngle = (miracleAperture) => {
    return (Math.asin(miracleAperture) * (180 / Math.PI)).toFixed(2);
  };

  const handleAddReading = () => {
    if (distance && radius) {
      const d = parseFloat(distance);
      const r = parseFloat(radius);
      const miracleAperture = calculateMiracleAperture(d, r);
      const acceptanceAngle = calculateAcceptanceAngle(miracleAperture);

      setReadings([
        ...readings,
        {
          id: readings.length + 1,
          distance: d,
          radius: r,
          miracleAperture,
          acceptanceAngle,
        },
      ]);

      setDistance("");
      setRadius("");
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
          {[Beaker, Atom, Sparkles].map((Icon, index) => (
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
            Optical Fiber Experiment Calculator
          </h1>

          {/* Input Section with 3D effect */}
          <div className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-102 transition-transform duration-300 border border-orange-100 relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <input
                  type="number"
                  placeholder="Distance (d) in cm"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transform hover:-translate-y-1 transition-all duration-300"
                />
                <span className="absolute -top-2 left-2 px-2 bg-white text-orange-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Distance
                </span>
              </div>
              <div className="flex-1 relative group">
                <input
                  type="number"
                  placeholder="Radius of spot in cm"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transform hover:-translate-y-1 transition-all duration-300"
                />
                <span className="absolute -top-2 left-2 px-2 bg-white text-orange-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Radius
                </span>
              </div>
              <button
                onClick={handleAddReading}
                className="px-8 py-3 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Add Reading
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
                        <th className="p-4 text-left">Distance (d) cm</th>
                        <th className="p-4 text-left">Radius (r) cm</th>
                        <th className="p-4 text-left">Miracle Aperture</th>
                        <th className="p-4 text-left">Acceptance Angle (°)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.map((reading) => (
                        <tr
                          key={reading.id}
                          className="border-t hover:bg-orange-50 transition-colors duration-200"
                        >
                          <td className="p-4">{reading.id}</td>
                          <td className="p-4">{reading.distance}</td>
                          <td className="p-4">{reading.radius}</td>
                          <td className="p-4">{reading.miracleAperture}</td>
                          <td className="p-4">{reading.acceptanceAngle}°</td>
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
                      <td className="p-4 font-semibold">Formula</td>
                      <td className="p-4">NA = sin(θ_max) = r/√(r² + d²)</td>
                    </tr>
                    <tr className="border-b hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4 font-semibold">Variables</td>
                      <td className="p-4">
                        r = radius of the light spot
                        <br />d = distance between fiber end and screen
                      </td>
                    </tr>
                    <tr className="hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4 font-semibold">Description</td>
                      <td className="p-4">
                        The numerical aperture (NA) determines the optical
                        fiber's light-gathering ability
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
                      <td className="p-4">Optical fiber</td>
                      <td className="p-4">
                        Main component for light transmission
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">LED light source</td>
                      <td className="p-4">Input light signal</td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">Screen</td>
                      <td className="p-4">For observing output pattern</td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">Meter scale</td>
                      <td className="p-4">For distance measurements</td>
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
                        Set up the optical fiber with the LED light source at
                        one end
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">2</td>
                      <td className="p-4">
                        Place the screen at a measured distance (d) from the
                        fiber end
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">3</td>
                      <td className="p-4">
                        Measure the radius (r) of the light spot on the screen
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-orange-50 transition-colors duration-200">
                      <td className="p-4">4</td>
                      <td className="p-4">
                        Record measurements and calculate numerical aperture
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

export default OpticalFiberCalculator;
