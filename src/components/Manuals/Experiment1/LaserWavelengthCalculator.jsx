import React, { useState, useEffect } from "react";
import { Waves, Atom, Sparkles, Plus, Ruler, Activity } from "lucide-react";

const LaserWavelengthCalculator = () => {
  // State for managing readings
  const [readings, setReadings] = useState([]);

  // Input states
  const [distance, setDistance] = useState("");
  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");

  // Animation state
  const [animationStep, setAnimationStep] = useState(0);

  // Grating constant (example: can be modified based on specific grating)
  const GRATING_CONSTANT = 1000; // lines per cm

  // Animation effect for background science icons
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Add reading function
  const addReading = () => {
    if (distance && x1 && x2) {
      // Calculate X (average of x1 and x2)
      const X = (parseFloat(x1) + parseFloat(x2)) / 2;

      // Calculate X/D ratio
      const XOverD = X / parseFloat(distance);

      const newReading = {
        D: parseFloat(distance),
        x1: parseFloat(x1),
        x2: parseFloat(x2),
        X: X,
        XOverD: XOverD,
      };

      setReadings((prev) => [...prev, newReading]);

      // Reset inputs
      setDistance("");
      setX1("");
      setX2("");
    }
  };

  // Calculate mean X/D
  const calculateMeanXOverD = () => {
    if (readings.length === 0) return 0;
    const sum = readings.reduce((acc, reading) => acc + reading.XOverD, 0);
    return sum / readings.length;
  };

  // Calculate wavelength
  const calculateWavelength = () => {
    if (readings.length === 0) return null;

    const meanXOverD = calculateMeanXOverD();

    // Wavelength calculation using λ = e * X/D
    // e is the grating constant (lines per cm)
    const wavelength = GRATING_CONSTANT * meanXOverD * 1e-7; // Convert to nm

    return wavelength.toFixed(2);
  };

  // Render input section
  const renderInputSection = () => (
    <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Ruler className="w-6 h-6 text-orange-500" /> Add Measurement
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Distance from Grating (D) in cm
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Distance"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            First Order Maximum x1 (cm)
          </label>
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter x1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Second Order Maximum x2 (cm)
          </label>
          <input
            type="number"
            value={x2}
            onChange={(e) => setX2(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter x2"
          />
        </div>
      </div>
      <button
        onClick={addReading}
        className="w-full mt-4 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white py-2 rounded-lg hover:shadow-lg transition-all"
      >
        <Plus className="inline-block mr-2" /> Add Measurement
      </button>
    </div>
  );

  // Render readings table
  const renderReadingsTable = () => (
    <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100 mt-6 overflow-x-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Activity className="w-6 h-6 text-orange-500" /> Measurement Data
      </h3>
      <table className="w-full">
        <thead className="bg-orange-50 sticky top-0">
          <tr>
            <th className="p-2 text-left">D (cm)</th>
            <th className="p-2 text-left">x1 (cm)</th>
            <th className="p-2 text-left">x2 (cm)</th>
            <th className="p-2 text-left">X (cm)</th>
            <th className="p-2 text-left">X/D</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading, index) => (
            <tr
              key={index}
              className="border-b hover:bg-orange-50 transition-colors"
            >
              <td className="p-2">{reading.D.toFixed(2)}</td>
              <td className="p-2">{reading.x1.toFixed(2)}</td>
              <td className="p-2">{reading.x2.toFixed(2)}</td>
              <td className="p-2">{reading.X.toFixed(2)}</td>
              <td className="p-2">{reading.XOverD.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render results section
  const renderResultsSection = () => {
    const wavelength = calculateWavelength();
    const meanXOverD = calculateMeanXOverD();

    return (
      <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Waves className="w-6 h-6 text-orange-500" /> Calculation Results
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Mean (X/D):</p>
            <p className="text-2xl font-bold text-gray-800">
              {meanXOverD.toFixed(4)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Calculated Wavelength (λ):</p>
            <p className="text-2xl font-bold text-gray-800">
              {wavelength ? `${wavelength} nm` : "No data"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 md:p-8 relative overflow-hidden">
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

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-center mb-8 animate-pulse">
          Laser Wavelength Determination
        </h1>

        {/* Input Section */}
        {renderInputSection()}

        {/* Readings Table */}
        {readings.length > 0 && renderReadingsTable()}

        {/* Results Section */}
        {readings.length > 0 && renderResultsSection()}

        {/* Theory Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Waves className="w-6 h-6 text-orange-500" /> Experimental Method
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              <strong>Principle:</strong> Wavelength (λ) is determined using the
              diffraction grating equation:
            </p>
            <p className="bg-orange-50 p-3 rounded-lg">λ = e * (X/D)</p>
            <p>
              Where:
              <ul className="list-disc list-inside">
                <li>λ = Wavelength of laser light</li>
                <li>e = Grating constant (lines per cm)</li>
                <li>
                  X = Average distance of first-order maximum from central
                  maximum
                </li>
                <li>D = Distance from grating to screen</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaserWavelengthCalculator;
