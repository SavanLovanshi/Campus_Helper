import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Rocket, 
  Waves, 
  Atom, 
  Sparkles,
  ArrowRight,
  ArrowLeft 
} from 'lucide-react';

const NewtonsThirdLawSimulator = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [balls, setBalls] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedBall, setSelectedBall] = useState(null);

  // Simulation constants
  const numBalls = 5;
  const spacing = 80;
  const originY = 150;
  const maxPullDistance = 120;
  const gravity = 0.2;
  const damping = 0.99;
  const interactionForce = 0.5; // Force of interaction between balls

  // Animation effect for background science icons
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initialize balls when component mounts
  useEffect(() => {
    const initialBalls = Array.from({ length: numBalls }, (_, i) => ({
      id: i,
      anchor: { 
        x: window.innerWidth / 2 - (numBalls - 1) * spacing / 2 + i * spacing, 
        y: originY 
      },
      position: { 
        x: window.innerWidth / 2 - (numBalls - 1) * spacing / 2 + i * spacing, 
        y: originY + 150 
      },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      radius: 20,
      dragging: false,
      color: `hsl(${i * 60}, 70%, 50%)` // Unique color for each ball
    }));

    setBalls(initialBalls);
  }, []);

  // Simulation logic for ball physics with interaction
  const updateBallPhysics = useCallback(() => {
    setBalls(prevBalls => {
      // Create a copy of balls to apply interactions
      const updatedBalls = [...prevBalls];

      return updatedBalls.map((ball, index) => {
        if (!ball.dragging) {
          // Apply gravity
          const newAcceleration = { 
            x: ball.acceleration.x, 
            y: ball.acceleration.y + gravity 
          };

          // Apply interaction forces
          updatedBalls.forEach((otherBall, otherIndex) => {
            if (index !== otherIndex) {
              // Calculate distance between balls
              const dx = ball.position.x - otherBall.position.x;
              const dy = ball.position.y - otherBall.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // Apply interaction force if balls are close
              if (distance < ball.radius * 3) {
                // Equal and opposite reaction
                newAcceleration.x += (dx > 0 ? 1 : -1) * interactionForce;
                newAcceleration.y += (dy > 0 ? 1 : -1) * interactionForce;
              }
            }
          });

          // Update velocity
          const newVelocity = {
            x: ball.velocity.x + newAcceleration.x,
            y: ball.velocity.y + newAcceleration.y
          };

          // Update position
          const newPosition = {
            x: ball.position.x + newVelocity.x,
            y: ball.position.y + newVelocity.y
          };

          // Dampen velocity
          newVelocity.x *= damping;
          newVelocity.y *= damping;

          // Constrain to anchor point
          const direction = {
            x: newPosition.x - ball.anchor.x,
            y: newPosition.y - ball.anchor.y
          };

          const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
          if (magnitude > 100) {
            const scaleFactor = 100 / magnitude;
            newPosition.x = ball.anchor.x + direction.x * scaleFactor;
            newPosition.y = ball.anchor.y + direction.y * scaleFactor;
          }

          return {
            ...ball,
            velocity: newVelocity,
            position: newPosition,
            acceleration: { x: 0, y: 0 }
          };
        }
        return ball;
      });
    });
  }, [gravity, damping, interactionForce]);

  // Handle ball selection and dragging
  const handleMouseDown = (ballId) => {
    setSelectedBall(ballId);
    setBalls(prevBalls => 
      prevBalls.map(ball => 
        ball.id === ballId ? { ...ball, dragging: true } : ball
      )
    );
  };

  const handleMouseMove = (e) => {
    if (selectedBall !== null) {
      setBalls(prevBalls => 
        prevBalls.map(ball => {
          if (ball.id === selectedBall) {
            return {
              ...ball,
              position: {
                x: e.clientX,
                y: e.clientY
              }
            };
          }
          return ball;
        })
      );
    }
  };

  const handleMouseUp = () => {
    if (selectedBall !== null) {
      // Apply opposite reaction to other balls
      setBalls(prevBalls => 
        prevBalls.map(ball => {
          if (ball.id === selectedBall) {
            return { ...ball, dragging: false };
          }
          // Apply opposite reaction force
          return {
            ...ball,
            velocity: {
              x: ball.velocity.x - interactionForce,
              y: ball.velocity.y - interactionForce
            }
          };
        })
      );
      setSelectedBall(null);
    }
  };

  // Simulate rocket launch (group interaction)
  const fireThruster = () => {
    setIsSimulating(true);
    
    // Start physics simulation
    const simulationInterval = setInterval(() => {
      updateBallPhysics();
    }, 50);

    // Stop simulation after 5 seconds
    setTimeout(() => {
      clearInterval(simulationInterval);
      setIsSimulating(false);
    }, 5000);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 md:p-8 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-center mb-8 animate-pulse">
          Newton's Third Law - Action & Reaction
        </h1>

        {/* Simulation Container */}
        <div className="bg-white rounded-xl shadow-2xl p-6 border border-orange-100">
          <p className="text-gray-800 text-center mb-6 text-lg">
            Drag and interact with balls to observe equal and opposite reactions!
          </p>

          {/* Simulation Canvas */}
          <div 
            className="bg-gray-100 rounded-lg h-[400px] mb-6 relative overflow-hidden border border-gray-200"
          >
            {balls.map((ball, index) => (
              <div
                key={ball.id}
                onMouseDown={() => handleMouseDown(ball.id)}
                className="absolute rounded-full cursor-grab active:cursor-grabbing"
                style={{
                  width: `${ball.radius * 2}px`,
                  height: `${ball.radius * 2}px`,
                  left: `${ball.position.x}px`,
                  top: `${ball.position.y}px`,
                  backgroundColor: ball.color,
                  boxShadow: selectedBall === ball.id 
                    ? '0 0 10px rgba(0,0,0,0.5)' 
                    : 'none'
                }}
              >
                {/* Optional velocity indicators */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${Math.abs(ball.velocity.x) * 5}px`,
                    height: `${Math.abs(ball.velocity.y) * 5}px`,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '50%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={fireThruster}
              disabled={isSimulating}
              className={`px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                isSimulating
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white hover:shadow-lg"
              }`}
            >
              <Rocket className="h-5 w-5" />
              {isSimulating ? "Launching..." : "Fire Thruster"}
            </button>
            
            {/* Reset Button */}
            <button
              onClick={() => {
                // Reset balls to initial position
                const initialBalls = Array.from({ length: numBalls }, (_, i) => ({
                  id: i,
                  anchor: { 
                    x: window.innerWidth / 2 - (numBalls - 1) * spacing / 2 + i * spacing, 
                    y: originY 
                  },
                  position: { 
                    x: window.innerWidth / 2 - (numBalls - 1) * spacing / 2 + i * spacing, 
                    y: originY + 150 
                  },
                  velocity: { x: 0, y: 0 },
                  acceleration: { x: 0, y: 0 },
                  radius: 20,
                  dragging: false,
                  color: `hsl(${i * 60}, 70%, 50%)`
                }));

                setBalls(initialBalls);
                setIsSimulating(false);
              }}
              className="px-8 py-3 bg-white text-gray-800 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
            >
              <ArrowRight className="h-5 w-5" /> Reset Simulation
            </button>
          </div>
        </div>

        {/* Physics Explanation */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-4 border border-orange-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Newton's Third Law Explained
          </h3>
          <p className="text-gray-600">
            For every action, there is an equal and opposite reaction. When you 
            pull or push a ball, it creates an equal force in the opposite 
            direction, demonstrating the fundamental principle of motion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewtonsThirdLawSimulator;