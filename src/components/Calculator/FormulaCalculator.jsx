import React, { useState } from "react";
import {
  X,
  Calculator,
  ChevronRight,
  Check,
  ArrowRight,
  Copy,
} from "lucide-react";

// Formula categories and definitions
const formulaCategories = [
  {
    id: "mechanics",
    name: "Classical Mechanics & Kinematics",
    color: "from-[#E83B00] to-[#FF7349]",
    icon: "⚙️",
    formulas: [
      {
        id: "displacement",
        name: "Displacement",
        equation: "s = ut + ½at²",
        variables: [
          { id: "u", name: "Initial Velocity (u)", unit: "m/s" },
          { id: "t", name: "Time (t)", unit: "s" },
          { id: "a", name: "Acceleration (a)", unit: "m/s²" },
        ],
        calculate: (values) => {
          const { u, t, a } = values;
          return (
            parseFloat(u) * parseFloat(t) +
            0.5 * parseFloat(a) * Math.pow(parseFloat(t), 2)
          );
        },
        result: { name: "Displacement (s)", unit: "m" },
      },
      {
        id: "final-velocity",
        name: "Final Velocity",
        equation: "v = u + at",
        variables: [
          { id: "u", name: "Initial Velocity (u)", unit: "m/s" },
          { id: "a", name: "Acceleration (a)", unit: "m/s²" },
          { id: "t", name: "Time (t)", unit: "s" },
        ],
        calculate: (values) => {
          const { u, a, t } = values;
          return parseFloat(u) + parseFloat(a) * parseFloat(t);
        },
        result: { name: "Final Velocity (v)", unit: "m/s" },
      },
      {
        id: "newtons-second-law",
        name: "Newton's Second Law",
        equation: "F = m × a",
        variables: [
          { id: "m", name: "Mass (m)", unit: "kg" },
          { id: "a", name: "Acceleration (a)", unit: "m/s²" },
        ],
        calculate: (values) => {
          const { m, a } = values;
          return parseFloat(m) * parseFloat(a);
        },
        result: { name: "Force (F)", unit: "N" },
      },
      {
        id: "work-done",
        name: "Work Done",
        equation: "W = F × d × cos(θ)",
        variables: [
          { id: "F", name: "Force (F)", unit: "N" },
          { id: "d", name: "Distance (d)", unit: "m" },
          { id: "theta", name: "Angle (θ)", unit: "degrees" },
        ],
        calculate: (values) => {
          const { F, d, theta } = values;
          return (
            parseFloat(F) *
            parseFloat(d) *
            Math.cos((parseFloat(theta) * Math.PI) / 180)
          );
        },
        result: { name: "Work Done (W)", unit: "J" },
      },
      {
        id: "power",
        name: "Power",
        equation: "P = W / t",
        variables: [
          { id: "W", name: "Work Done (W)", unit: "J" },
          { id: "t", name: "Time (t)", unit: "s" },
        ],
        calculate: (values) => {
          const { W, t } = values;
          return parseFloat(W) / parseFloat(t);
        },
        result: { name: "Power (P)", unit: "W" },
      },
      {
        id: "kinetic-energy",
        name: "Kinetic Energy",
        equation: "KE = ½ m v²",
        variables: [
          { id: "m", name: "Mass (m)", unit: "kg" },
          { id: "v", name: "Velocity (v)", unit: "m/s" },
        ],
        calculate: (values) => {
          const { m, v } = values;
          return 0.5 * parseFloat(m) * Math.pow(parseFloat(v), 2);
        },
        result: { name: "Kinetic Energy (KE)", unit: "J" },
      },
      {
        id: "potential-energy",
        name: "Potential Energy",
        equation: "PE = m × g × h",
        variables: [
          { id: "m", name: "Mass (m)", unit: "kg" },
          {
            id: "g",
            name: "Gravitational Acceleration (g)",
            unit: "m/s²",
            defaultValue: "9.8",
          },
          { id: "h", name: "Height (h)", unit: "m" },
        ],
        calculate: (values) => {
          const { m, g, h } = values;
          return parseFloat(m) * parseFloat(g) * parseFloat(h);
        },
        result: { name: "Potential Energy (PE)", unit: "J" },
      },
      {
        id: "momentum",
        name: "Momentum",
        equation: "p = m × v",
        variables: [
          { id: "m", name: "Mass (m)", unit: "kg" },
          { id: "v", name: "Velocity (v)", unit: "m/s" },
        ],
        calculate: (values) => {
          const { m, v } = values;
          return parseFloat(m) * parseFloat(v);
        },
        result: { name: "Momentum (p)", unit: "kg·m/s" },
      },
      {
        id: "impulse",
        name: "Impulse",
        equation: "J = F × Δt = Δp",
        variables: [
          { id: "F", name: "Force (F)", unit: "N" },
          { id: "dt", name: "Time Interval (Δt)", unit: "s" },
        ],
        calculate: (values) => {
          const { F, dt } = values;
          return parseFloat(F) * parseFloat(dt);
        },
        result: { name: "Impulse (J)", unit: "N·s" },
      },
      {
        id: "centripetal-force",
        name: "Centripetal Force",
        equation: "Fc = m × v² / r",
        variables: [
          { id: "m", name: "Mass (m)", unit: "kg" },
          { id: "v", name: "Velocity (v)", unit: "m/s" },
          { id: "r", name: "Radius (r)", unit: "m" },
        ],
        calculate: (values) => {
          const { m, v, r } = values;
          return (parseFloat(m) * Math.pow(parseFloat(v), 2)) / parseFloat(r);
        },
        result: { name: "Centripetal Force (Fc)", unit: "N" },
      },
    ],
  },
  {
    id: "thermo",
    name: "Thermodynamics & Heat Transfer",
    color: "from-[#FF4500] to-[#FF8C00]",
    icon: "🔥",
    formulas: [
      {
        id: "heat-energy",
        name: "Heat Energy",
        equation: "Q = m × c × ΔT",
        variables: [
          { id: "m", name: "Mass (m)", unit: "kg" },
          { id: "c", name: "Specific Heat Capacity (c)", unit: "J/(kg·K)" },
          { id: "dT", name: "Temperature Change (ΔT)", unit: "K" },
        ],
        calculate: (values) => {
          const { m, c, dT } = values;
          return parseFloat(m) * parseFloat(c) * parseFloat(dT);
        },
        result: { name: "Heat Energy (Q)", unit: "J" },
      },
      {
        id: "efficiency",
        name: "Efficiency",
        equation: "η = (Wout / Ein) × 100%",
        variables: [
          { id: "Wout", name: "Work Output (Wout)", unit: "J" },
          { id: "Ein", name: "Energy Input (Ein)", unit: "J" },
        ],
        calculate: (values) => {
          const { Wout, Ein } = values;
          return (parseFloat(Wout) / parseFloat(Ein)) * 100;
        },
        result: { name: "Efficiency (η)", unit: "%" },
      },
      {
        id: "carnot-efficiency",
        name: "Carnot Efficiency",
        equation: "η = (1 - T₂/T₁) × 100%",
        variables: [
          { id: "T1", name: "Hot Reservoir Temperature (T₁)", unit: "K" },
          { id: "T2", name: "Cold Reservoir Temperature (T₂)", unit: "K" },
        ],
        calculate: (values) => {
          const { T1, T2 } = values;
          return (1 - parseFloat(T2) / parseFloat(T1)) * 100;
        },
        result: { name: "Carnot Efficiency (η)", unit: "%" },
      },
      {
        id: "ideal-gas-law",
        name: "Ideal Gas Law",
        equation: "PV = nRT",
        variables: [
          { id: "P", name: "Pressure (P)", unit: "Pa" },
          { id: "V", name: "Volume (V)", unit: "m³" },
          { id: "n", name: "Amount of Substance (n)", unit: "mol" },
          { id: "T", name: "Temperature (T)", unit: "K" },
        ],
        calculate: (values) => {
          const { P, V, n, T } = values;
          const R = 8.314; // Universal gas constant in J/(mol·K)
          if (values.solveFor === "P")
            return (parseFloat(n) * R * parseFloat(T)) / parseFloat(V);
          if (values.solveFor === "V")
            return (parseFloat(n) * R * parseFloat(T)) / parseFloat(P);
          if (values.solveFor === "n")
            return (parseFloat(P) * parseFloat(V)) / (R * parseFloat(T));
          if (values.solveFor === "T")
            return (parseFloat(P) * parseFloat(V)) / (R * parseFloat(n));
          return null;
        },
        solveFor: true,
        result: {
          P: { name: "Pressure (P)", unit: "Pa" },
          V: { name: "Volume (V)", unit: "m³" },
          n: { name: "Amount of Substance (n)", unit: "mol" },
          T: { name: "Temperature (T)", unit: "K" },
        },
      },
      {
        id: "boyles-law",
        name: "Boyle's Law",
        equation: "P₁V₁ = P₂V₂",
        variables: [
          { id: "P1", name: "Initial Pressure (P₁)", unit: "Pa" },
          { id: "V1", name: "Initial Volume (V₁)", unit: "m³" },
          { id: "P2", name: "Final Pressure (P₂)", unit: "Pa" },
        ],
        calculate: (values) => {
          const { P1, V1, P2 } = values;
          return (parseFloat(P1) * parseFloat(V1)) / parseFloat(P2);
        },
        result: { name: "Final Volume (V₂)", unit: "m³" },
      },
    ],
  },
  {
    id: "electricity",
    name: "Electricity & Magnetism",
    color: "from-[#0066CC] to-[#0099FF]",
    icon: "⚡",
    formulas: [
      {
        id: "ohms-law",
        name: "Ohm's Law",
        equation: "V = I × R",
        variables: [
          { id: "I", name: "Current (I)", unit: "A" },
          { id: "R", name: "Resistance (R)", unit: "Ω" },
        ],
        calculate: (values) => {
          const { I, R } = values;
          return parseFloat(I) * parseFloat(R);
        },
        result: { name: "Voltage (V)", unit: "V" },
      },
      {
        id: "power-circuit",
        name: "Power in Circuit",
        equation: "P = V × I = I²R = V²/R",
        variables: [
          { id: "V", name: "Voltage (V)", unit: "V" },
          { id: "I", name: "Current (I)", unit: "A" },
        ],
        calculate: (values) => {
          const { V, I } = values;
          return parseFloat(V) * parseFloat(I);
        },
        result: { name: "Power (P)", unit: "W" },
      },
      {
        id: "coulombs-law",
        name: "Coulomb's Law",
        equation: "F = k(q₁q₂ / r²)",
        variables: [
          { id: "q1", name: "Charge 1 (q₁)", unit: "C" },
          { id: "q2", name: "Charge 2 (q₂)", unit: "C" },
          { id: "r", name: "Distance (r)", unit: "m" },
        ],
        calculate: (values) => {
          const { q1, q2, r } = values;
          const k = 8.9875e9; // Coulomb's constant in N·m²/C²
          return (
            (k * (parseFloat(q1) * parseFloat(q2))) / Math.pow(parseFloat(r), 2)
          );
        },
        result: { name: "Force (F)", unit: "N" },
      },
      {
        id: "magnetic-force",
        name: "Magnetic Force",
        equation: "F = qvB sin(θ)",
        variables: [
          { id: "q", name: "Charge (q)", unit: "C" },
          { id: "v", name: "Velocity (v)", unit: "m/s" },
          { id: "B", name: "Magnetic Field (B)", unit: "T" },
          { id: "theta", name: "Angle (θ)", unit: "degrees" },
        ],
        calculate: (values) => {
          const { q, v, B, theta } = values;
          return (
            parseFloat(q) *
            parseFloat(v) *
            parseFloat(B) *
            Math.sin((parseFloat(theta) * Math.PI) / 180)
          );
        },
        result: { name: "Force (F)", unit: "N" },
      },
      {
        id: "capacitance",
        name: "Capacitance",
        equation: "C = Q/V",
        variables: [
          { id: "Q", name: "Charge (Q)", unit: "C" },
          { id: "V", name: "Voltage (V)", unit: "V" },
        ],
        calculate: (values) => {
          const { Q, V } = values;
          return parseFloat(Q) / parseFloat(V);
        },
        result: { name: "Capacitance (C)", unit: "F" },
      },
    ],
  },
  {
    id: "modern",
    name: "Modern Physics & Quantum Mechanics",
    color: "from-[#6600CC] to-[#9966FF]",
    icon: "🔭",
    formulas: [
      {
        id: "einstein-energy",
        name: "Einstein's Energy Equation",
        equation: "E = mc²",
        variables: [{ id: "m", name: "Mass (m)", unit: "kg" }],
        calculate: (values) => {
          const { m } = values;
          const c = 299792458; // Speed of light in m/s
          return parseFloat(m) * Math.pow(c, 2);
        },
        result: { name: "Energy (E)", unit: "J" },
      },
      {
        id: "de-broglie",
        name: "de Broglie Wavelength",
        equation: "λ = h/p",
        variables: [{ id: "p", name: "Momentum (p)", unit: "kg·m/s" }],
        calculate: (values) => {
          const { p } = values;
          const h = 6.62607015e-34; // Planck's constant in J·s
          return h / parseFloat(p);
        },
        result: { name: "Wavelength (λ)", unit: "m" },
      },
      {
        id: "photoelectric",
        name: "Photoelectric Equation",
        equation: "hν = φ + KE",
        variables: [
          { id: "nu", name: "Frequency (ν)", unit: "Hz" },
          { id: "phi", name: "Work Function (φ)", unit: "eV" },
        ],
        calculate: (values) => {
          const { nu, phi } = values;
          const h = 4.135667696e-15; // Planck's constant in eV·s
          return h * parseFloat(nu) - parseFloat(phi);
        },
        result: { name: "Kinetic Energy (KE)", unit: "eV" },
      },
      {
        id: "time-dilation",
        name: "Relativistic Time Dilation",
        equation: "t' = t / √(1 - v²/c²)",
        variables: [
          { id: "t", name: "Proper Time (t)", unit: "s" },
          { id: "v", name: "Relative Velocity (v)", unit: "m/s" },
        ],
        calculate: (values) => {
          const { t, v } = values;
          const c = 299792458; // Speed of light in m/s
          return parseFloat(t) / Math.sqrt(1 - Math.pow(parseFloat(v) / c, 2));
        },
        result: { name: "Dilated Time (t')", unit: "s" },
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering & Structural Formulas",
    color: "from-[#008800] to-[#66CC33]",
    icon: "🏗️",
    formulas: [
      {
        id: "stress",
        name: "Stress",
        equation: "σ = F/A",
        variables: [
          { id: "F", name: "Force (F)", unit: "N" },
          { id: "A", name: "Area (A)", unit: "m²" },
        ],
        calculate: (values) => {
          const { F, A } = values;
          return parseFloat(F) / parseFloat(A);
        },
        result: { name: "Stress (σ)", unit: "Pa" },
      },
      {
        id: "strain",
        name: "Strain",
        equation: "ε = ΔL/L",
        variables: [
          { id: "dL", name: "Change in Length (ΔL)", unit: "m" },
          { id: "L", name: "Original Length (L)", unit: "m" },
        ],
        calculate: (values) => {
          const { dL, L } = values;
          return parseFloat(dL) / parseFloat(L);
        },
        result: { name: "Strain (ε)", unit: "(dimensionless)" },
      },
      {
        id: "hookes-law",
        name: "Hooke's Law",
        equation: "σ = Eε",
        variables: [
          { id: "E", name: "Young's Modulus (E)", unit: "Pa" },
          { id: "epsilon", name: "Strain (ε)", unit: "(dimensionless)" },
        ],
        calculate: (values) => {
          const { E, epsilon } = values;
          return parseFloat(E) * parseFloat(epsilon);
        },
        result: { name: "Stress (σ)", unit: "Pa" },
      },
      {
        id: "fluid-pressure",
        name: "Fluid Pressure",
        equation: "P = ρgh",
        variables: [
          { id: "rho", name: "Density (ρ)", unit: "kg/m³" },
          {
            id: "g",
            name: "Gravitational Acceleration (g)",
            unit: "m/s²",
            defaultValue: "9.8",
          },
          { id: "h", name: "Height (h)", unit: "m" },
        ],
        calculate: (values) => {
          const { rho, g, h } = values;
          return parseFloat(rho) * parseFloat(g) * parseFloat(h);
        },
        result: { name: "Pressure (P)", unit: "Pa" },
      },
    ],
  },
];

// Utilities
const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return "Invalid Input";

  // For very small numbers, use scientific notation
  if (Math.abs(num) < 0.0001 && num !== 0) {
    return num.toExponential(6);
  }

  // For very large numbers, use scientific notation
  if (Math.abs(num) > 1000000) {
    return num.toExponential(6);
  }

  // For regular numbers, use fixed decimal places
  return num.toFixed(4).replace(/\.?0+$/, "");
};

const PhysicsFormulaCalculator = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [showFormulaDialog, setShowFormulaDialog] = useState(false);
  const [solveFor, setSolveFor] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedFormula(null);
    setInputValues({});
    setResult(null);
    setSolveFor(null);
  };

  const handleFormulaSelect = (formula) => {
    setSelectedFormula(formula);
    setShowFormulaDialog(true);

    // Initialize default values if provided
    const initialValues = {};
    formula.variables.forEach((variable) => {
      if (variable.defaultValue) {
        initialValues[variable.id] = variable.defaultValue;
      } else {
        initialValues[variable.id] = "";
      }
    });

    if (formula.solveFor) {
      setSolveFor(Object.keys(formula.result)[0]);
    } else {
      setSolveFor(null);
    }

    setInputValues(initialValues);
    setResult(null);
  };

  const handleInputChange = (variableId, value) => {
    setInputValues((prev) => ({
      ...prev,
      [variableId]: value,
    }));
  };

  const handleCalculate = () => {
    try {
      // Check if all required fields are filled
      const missingValues = Object.keys(inputValues).filter(
        (key) => inputValues[key] === ""
      );
      if (missingValues.length > 0) {
        throw new Error("Please fill in all fields");
      }

      const values = { ...inputValues };

      // Add solveFor information if needed
      if (solveFor) {
        values.solveFor = solveFor;
      }

      const calculationResult = selectedFormula.calculate(values);

      if (
        calculationResult === undefined ||
        calculationResult === null ||
        isNaN(calculationResult)
      ) {
        throw new Error("Calculation error: invalid result");
      }

      setResult({
        value: calculationResult,
        formula: selectedFormula,
        solveFor: solveFor,
      });
    } catch (error) {
      setResult({
        error: error.message,
      });
    }
  };

  const handleCloseDialog = () => {
    setShowFormulaDialog(false);
  };

  const copyResult = () => {
    if (!result || result.error) return;

    let resultName;
    if (solveFor) {
      resultName = selectedFormula.result[solveFor].name;
    } else {
      resultName = selectedFormula.result.name;
    }

    let resultUnit;
    if (solveFor) {
      resultUnit = selectedFormula.result[solveFor].unit;
    } else {
      resultUnit = selectedFormula.result.unit;
    }

    const textToCopy = `${resultName}: ${formatNumber(
      result.value
    )} ${resultUnit}`;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] mb-2">
          Physics Formula Calculator
        </h1>
        <p className="text-gray-600">
          Select a category and formula to perform calculations
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formulaCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className={`p-6 rounded-lg shadow-md cursor-pointer transform hover:scale-102 transition-all duration-300 
              bg-white hover:shadow-xl ${
                selectedCategory?.id === category.id
                  ? "ring-2 ring-[#E83B00]"
                  : ""
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-lg font-semibold text-gray-800">
                  {category.name}
                </h2>
              </div>
              <ChevronRight className="text-[#E83B00] w-5 h-5" />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {category.formulas.length} formulas available
            </p>
          </div>
        ))}
      </div>

      {/* Formula Selection */}
      {selectedCategory && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedFormula(null);
              }}
              className="text-[#E83B00] hover:underline flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4 transform rotate-180" />
              Back to Categories
            </button>
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] mb-4">
            {selectedCategory.name} Formulas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory.formulas.map((formula) => (
              <div
                key={formula.id}
                onClick={() => handleFormulaSelect(formula)}
                className="bg-white p-5 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {formula.name}
                  </h3>
                  <Calculator className="text-[#E83B00] w-5 h-5" />
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-700 font-medium">
                    {formula.equation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula Dialog */}
      {showFormulaDialog && selectedFormula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out">
            {/* Dialog Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text text-transparent">
                {selectedFormula.name}
              </h2>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Formula Equation Display */}
            <div className="p-4 bg-gray-50">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <p className="text-lg font-medium">
                  {selectedFormula.equation}
                </p>
              </div>
            </div>

            {/* Variable Inputs */}
            <div className="p-6 space-y-6">
              {/* Solve for selection for formulas that support multiple outputs */}
              {selectedFormula.solveFor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solve for:
                  </label>
                  <select
                    value={solveFor}
                    onChange={(e) => setSolveFor(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] transition-all duration-300 hover:border-[#FF7349]"
                  >
                    {Object.keys(selectedFormula.result).map((key) => (
                      <option key={key} value={key}>
                        {selectedFormula.result[key].name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Input fields for each variable */}
              {selectedFormula.variables.map((variable) => (
                <div
                  key={variable.id}
                  className={solveFor === variable.id ? "hidden" : ""}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variable.name}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      step="any"
                      value={inputValues[variable.id] || ""}
                      onChange={(e) =>
                        handleInputChange(variable.id, e.target.value)
                      }
                      placeholder={`Enter ${variable.name}`}
                      className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E83B00] transition-all duration-300 hover:border-[#FF7349]"
                    />
                    <div className="ml-2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 flex items-center">
                      {variable.unit}
                    </div>
                  </div>
                </div>
              ))}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg 
                hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 
                flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate
              </button>

              {/* Result Display */}
              {result && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    result.error
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">Result</h3>
                    {!result.error && (
                      <button
                        onClick={copyResult}
                        className="p-1.5 text-gray-500 hover:text-[#E83B00] rounded-lg hover:bg-white 
                          transition-colors duration-300"
                        title="Copy result"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {result.error ? (
                    <p className="text-red-600">{result.error}</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {solveFor
                            ? selectedFormula.result[solveFor].name
                            : selectedFormula.result.name}
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {formatNumber(result.value)}
                          <span className="ml-2 text-sm font-medium text-gray-600">
                            {solveFor
                              ? selectedFormula.result[solveFor].unit
                              : selectedFormula.result.unit}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white p-2 rounded-full">
                        <Check className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicsFormulaCalculator;
