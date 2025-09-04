import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { 
  OrbitControls, 
  Line, 
  Html 
} from "@react-three/drei";
import * as THREE from "three";
import { 
  Rocket, 
  Mountain, 
  Waves, 
  Orbit, 
  Settings, 
  Play, 
  Pause 
} from "lucide-react";

// Physics Utility Functions
const PhysicsUtils = {
  calculateKineticEnergy: (mass, velocity) => 0.5 * mass * Math.pow(velocity, 2),
  calculatePotentialEnergy: (mass, height, gravity = 9.8) => mass * gravity * height,
  calculateCentripetalForce: (mass, velocity, radius) => (mass * Math.pow(velocity, 2)) / radius
};

// Track Segment Types with Corrected Point Handling
const TRACK_SEGMENTS = [
  { 
    id: 'straight', 
    name: 'Straight Track', 
    icon: Rocket,
    points: [
      [0, 0, 0],
      [5, 0, 0]
    ]
  },
  { 
    id: 'uphill', 
    name: 'Uphill Climb', 
    icon: Mountain,
    points: [
      [0, 0, 0],
      [5, 3, 0]
    ]
  },
  { 
    id: 'downhill', 
    name: 'Steep Descent', 
    icon: Waves,
    points: [
      [0, 3, 0],
      [5, 0, 0]
    ]
  },
  { 
    id: 'loop', 
    name: 'Loop-de-Loop', 
    icon: Orbit,
    points: [
      [0, 0, 0],
      [2, 2, 0],
      [4, 2, 0],
      [5, 0, 0]
    ]
  }
];

// Roller Coaster Track Component with Safe Rendering
const RollerCoasterTrack = ({ segments }) => {
  // Ensure we always have valid points
  const safeTrackPoints = useMemo(() => {
    const points = segments.flatMap(segment => segment.points);
    // Ensure at least two points exist
    return points.length >= 2 ? points : [[0, 0, 0], [1, 0, 0]];
  }, [segments]);

  return (
    <Line
      points={safeTrackPoints}
      color="red"
      lineWidth={4}
      transparent
      opacity={0.7}
    />
  );
};

// Coaster Cart Component (Simplified)
const CoasterCart = ({ initialPosition = [0, 0, 0], trackPoints }) => {
  const [position, setPosition] = useState(initialPosition);
  
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
      <Html>
        <div className="text-xs text-white bg-black/50 p-1 rounded">
          Cart Position
        </div>
      </Html>
    </mesh>
  );
};

// Main Simulator Component
const RollerCoasterSimulator = () => {
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    trackSegments: [],
    gravity: 9.8,
    speed: 1
  });

  const [selectedSegment, setSelectedSegment] = useState(null);

  // Add track segment
  const addTrackSegment = (segment) => {
    setSimulationState(prev => ({
      ...prev,
      trackSegments: [...prev.trackSegments, segment]
    }));
  };

  // Render Track Segment Selector
  const renderTrackSegmentSelector = () => (
    <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Settings className="w-6 h-6 text-orange-500" /> Track Segments
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRACK_SEGMENTS.map((segment) => (
          <button
            key={segment.id}
            onClick={() => {
              setSelectedSegment(segment);
              addTrackSegment(segment);
            }}
            className={`p-3 rounded-lg flex flex-col items-center justify-center 
              transition-all hover:bg-orange-50 
              ${selectedSegment?.id === segment.id 
                ? 'bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white' 
                : 'bg-white text-gray-800 border'}`}
          >
            <segment.icon className="w-8 h-8 mb-2" />
            <span className="text-sm">{segment.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // 3D Simulation Scene
  const SimulationScene = () => {
    // Ensure we always have some track points
    const trackPoints = simulationState.trackSegments.length > 0 
      ? simulationState.trackSegments.flatMap(seg => seg.points)
      : [[0, 0, 0], [1, 0, 0]];
    
    return (
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Physics>
          <RollerCoasterTrack segments={simulationState.trackSegments} />
          <CoasterCart 
            initialPosition={trackPoints[0]} 
            trackPoints={trackPoints} 
          />
        </Physics>
        <OrbitControls />
      </Canvas>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-center mb-8 animate-pulse">
          Virtual Roller Coaster Simulator
        </h1>

        {/* Track Segment Selector */}
        {renderTrackSegmentSelector()}

        {/* 3D Simulation Area */}
        <div className="mt-6 bg-gray-100 rounded-xl h-[500px] border border-gray-200">
          <SimulationScene />
        </div>

        {/* Simulation Controls */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setSimulationState(prev => ({ 
              ...prev, 
              isRunning: !prev.isRunning 
            }))}
            className="px-8 py-3 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg hover:shadow-lg flex items-center gap-2"
          >
            {simulationState.isRunning ? <Pause /> : <Play />}
            {simulationState.isRunning ? 'Pause' : 'Start'} Simulation
          </button>
          
          {/* Gravity and Speed Controls */}
          <div className="flex items-center space-x-4">
            <label className="text-gray-700">
              Gravity:
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.1"
                value={simulationState.gravity}
                onChange={(e) => setSimulationState(prev => ({
                  ...prev,
                  gravity: parseFloat(e.target.value)
                }))}
                className="ml-2"
              />
              {simulationState.gravity.toFixed(1)}g
            </label>
          </div>
        </div>

        {/* Energy and Metrics Display */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-4 border border-orange-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Simulation Metrics
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Total Track Length:</p>
              <p className="text-2xl font-bold">
                {simulationState.trackSegments.reduce((total, seg) => 
                  total + Math.sqrt(
                    Math.pow(seg.points[1][0] - seg.points[0][0], 2) +
                    Math.pow(seg.points[1][1] - seg.points[0][1], 2)
                  ), 0).toFixed(2)} m
              </p>
            </div>
            <div>
              <p className="text-gray-600">Simulation Gravity:</p>
              <p className="text-2xl font-bold">
                {simulationState.gravity.toFixed(1)} m/s²
              </p>
            </div>
            <div>
              <p className="text-gray-600">Track Segments:</p>
              <p className="text-2xl font-bold">
                {simulationState.trackSegments.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollerCoasterSimulator;