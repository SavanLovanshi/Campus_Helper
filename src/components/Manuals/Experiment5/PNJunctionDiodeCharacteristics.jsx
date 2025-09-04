import React, { useState, useEffect, useRef } from "react";
import {
  Atom,
  Waves,
  Sparkles,
  Plus,
  Minus,
  BarChart2,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PNJunctionDiodeCharacteristics = () => {
  // State for managing readings and chart data
  const [silconForwardReadings, setSiliconForwardReadings] = useState([]);
  const [siliconReverseReadings, setSiliconReverseReadings] = useState([]);
  const [germaniumForwardReadings, setGermaniumForwardReadings] = useState([]);
  const [germaniumReverseReadings, setGermaniumReverseReadings] = useState([]);

  // Input state
  const [siliconForwardVoltage, setSiliconForwardVoltage] = useState("");
  const [siliconForwardCurrent, setSiliconForwardCurrent] = useState("");
  const [siliconReverseVoltage, setSiliconReverseVoltage] = useState("");
  const [siliconReverseCurrent, setSiliconReverseCurrent] = useState("");

  const [germaniumForwardVoltage, setGermaniumForwardVoltage] = useState("");
  const [germaniumForwardCurrent, setGermaniumForwardCurrent] = useState("");
  const [germaniumReverseVoltage, setGermaniumReverseVoltage] = useState("");
  const [germaniumReverseCurrent, setGermaniumReverseCurrent] = useState("");

  // Animation state
  const [animationStep, setAnimationStep] = useState(0);
  const [activeTab, setActiveTab] = useState("silicon");

  // Animation effect for background science icons
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Add reading functions for each type of reading
  const addSiliconForwardReading = () => {
    if (siliconForwardVoltage && siliconForwardCurrent) {
      const newReading = {
        voltage: parseFloat(siliconForwardVoltage),
        current: parseFloat(siliconForwardCurrent),
      };
      setSiliconForwardReadings((prev) => [...prev, newReading]);
      setSiliconForwardVoltage("");
      setSiliconForwardCurrent("");
    }
  };

  const addSiliconReverseReading = () => {
    if (siliconReverseVoltage && siliconReverseCurrent) {
      const newReading = {
        voltage: parseFloat(siliconReverseVoltage),
        current: parseFloat(siliconReverseCurrent),
      };
      setSiliconReverseReadings((prev) => [...prev, newReading]);
      setSiliconReverseVoltage("");
      setSiliconReverseCurrent("");
    }
  };

  const addGermaniumForwardReading = () => {
    if (germaniumForwardVoltage && germaniumForwardCurrent) {
      const newReading = {
        voltage: parseFloat(germaniumForwardVoltage),
        current: parseFloat(germaniumForwardCurrent),
      };
      setGermaniumForwardReadings((prev) => [...prev, newReading]);
      setGermaniumForwardVoltage("");
      setGermaniumForwardCurrent("");
    }
  };

  const addGermaniumReverseReading = () => {
    if (germaniumReverseVoltage && germaniumReverseCurrent) {
      const newReading = {
        voltage: parseFloat(germaniumReverseVoltage),
        current: parseFloat(germaniumReverseCurrent),
      };
      setGermaniumReverseReadings((prev) => [...prev, newReading]);
      setGermaniumReverseVoltage("");
      setGermaniumReverseCurrent("");
    }
  };

  // Render input section for each type of reading
  const renderInputSection = (
    forwardVoltage,
    setForwardVoltage,
    forwardCurrent,
    setForwardCurrent,
    addForwardReading,
    reverseVoltage,
    setReverseVoltage,
    reverseCurrent,
    setReverseCurrent,
    addReverseReading
  ) => (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Forward Bias Input */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" /> Forward Bias
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Voltage (V)
            </label>
            <input
              type="number"
              value={forwardVoltage}
              onChange={(e) => setForwardVoltage(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter Voltage"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Current (mA)
            </label>
            <input
              type="number"
              value={forwardCurrent}
              onChange={(e) => setForwardCurrent(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter Current"
            />
          </div>
          <button
            onClick={addForwardReading}
            className="w-full bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="inline-block mr-2" /> Add Reading
          </button>
        </div>
      </div>

      {/* Reverse Bias Input */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-red-500 rotate-180" /> Reverse
          Bias
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Voltage (V)
            </label>
            <input
              type="number"
              value={reverseVoltage}
              onChange={(e) => setReverseVoltage(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter Voltage"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Current (mA)
            </label>
            <input
              type="number"
              value={reverseCurrent}
              onChange={(e) => setReverseCurrent(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter Current"
            />
          </div>
          <button
            onClick={addReverseReading}
            className="w-full bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="inline-block mr-2" /> Add Reading
          </button>
        </div>
      </div>
    </div>
  );

  // Render readings table
  const renderReadingsTable = (forwardReadings, reverseReadings) => (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {/* Forward Bias Readings */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" /> Forward Bias
          Readings
        </h3>
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-orange-50 sticky top-0">
              <tr>
                <th className="p-2 text-left">Voltage (V)</th>
                <th className="p-2 text-left">Current (mA)</th>
              </tr>
            </thead>
            <tbody>
              {forwardReadings.map((reading, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-orange-50 transition-colors"
                >
                  <td className="p-2">{reading.voltage.toFixed(2)}</td>
                  <td className="p-2">{reading.current.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reverse Bias Readings */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-red-500 rotate-180" /> Reverse
          Bias Readings
        </h3>
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-orange-50 sticky top-0">
              <tr>
                <th className="p-2 text-left">Voltage (V)</th>
                <th className="p-2 text-left">Current (mA)</th>
              </tr>
            </thead>
            <tbody>
              {reverseReadings.map((reading, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-orange-50 transition-colors"
                >
                  <td className="p-2">{reading.voltage.toFixed(2)}</td>
                  <td className="p-2">{reading.current.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render chart
  const renderChart = (forwardReadings, reverseReadings, diodeType) => (
    <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100 mt-6 h-[500px]">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart2 className="w-6 h-6 text-orange-500" />
        {diodeType.charAt(0).toUpperCase() + diodeType.slice(1)} Diode
        Characteristics
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="voltage"
            name="Voltage (V)"
            domain={["auto", "auto"]}
          />
          <YAxis
            type="number"
            dataKey="current"
            name="Current (mA)"
            domain={["auto", "auto"]}
          />
          <Tooltip />
          <Legend />
          {/* Forward Bias Line */}
          <Line
            type="monotone"
            dataKey="current"
            data={forwardReadings}
            name="Forward Bias"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
          {/* Reverse Bias Line */}
          <Line
            type="monotone"
            dataKey="current"
            data={reverseReadings}
            name="Reverse Bias"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 md:p-8 relative overflow-hidden">
      {/* Floating Science Icons */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[Atom, Waves, Sparkles].map((Icon, index) => (
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
          PN Junction Diode Characteristics
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full shadow-md inline-flex">
            <button
              onClick={() => setActiveTab("silicon")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === "silicon"
                  ? "bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              Silicon Diode
            </button>
            <button
              onClick={() => setActiveTab("germanium")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === "germanium"
                  ? "bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              Germanium Diode
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Active Tab */}
        {activeTab === "silicon" ? (
          <>
            {renderInputSection(
              siliconForwardVoltage,
              setSiliconForwardVoltage,
              siliconForwardCurrent,
              setSiliconForwardCurrent,
              addSiliconForwardReading,
              siliconReverseVoltage,
              setSiliconReverseVoltage,
              siliconReverseCurrent,
              setSiliconReverseCurrent,
              addSiliconReverseReading
            )}

            {renderReadingsTable(silconForwardReadings, siliconReverseReadings)}

            {renderChart(
              silconForwardReadings,
              siliconReverseReadings,
              "silicon"
            )}
          </>
        ) : (
          <>
            {renderInputSection(
              germaniumForwardVoltage,
              setGermaniumForwardVoltage,
              germaniumForwardCurrent,
              setGermaniumForwardCurrent,
              addGermaniumForwardReading,
              germaniumReverseVoltage,
              setGermaniumReverseVoltage,
              germaniumReverseCurrent,
              setGermaniumReverseCurrent,
              addGermaniumReverseReading
            )}

            {renderReadingsTable(
              germaniumForwardReadings,
              germaniumReverseReadings
            )}

            {renderChart(
              germaniumForwardReadings,
              germaniumReverseReadings,
              "germanium"
            )}
          </>
        )}

        {/* Theory Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-orange-500" /> Theory of PN
            Junction Diode
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-700 mb-2">
                Silicon Diode Characteristics
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Typical forward voltage: 0.6 - 0.7 V</li>
                <li>Lower temperature coefficient</li>
                <li>Higher breakdown voltage</li>
                <li>More stable at high temperatures</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-700 mb-2">
                Germanium Diode Characteristics
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Typical forward voltage: 0.2 - 0.3 V</li>
                <li>Higher temperature sensitivity</li>
                <li>Lower breakdown voltage</li>
                <li>More sensitive to temperature changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PNJunctionDiodeCharacteristics;
