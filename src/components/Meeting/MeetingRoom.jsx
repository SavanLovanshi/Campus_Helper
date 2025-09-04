import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  Atom,
  Sparkles,
  Microscope,
  Waves,
  Binary,
  Lightbulb,
  Beaker,
} from "lucide-react";

const Home = () => {
  const [fullName, setFullName] = useState("");
  const [roomID, setRoomID] = useState("");
  const [animationStep, setAnimationStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setFullName("");
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinMeeting = () => {
    if (roomID) {
      navigate(`/meeting/room/${roomID}`);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-orange-50 to-white min-h-screen">
      {/* Floating Physics Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated formulas */}
        <div className="absolute top-20 left-10 opacity-5 text-2xl animate-float-slow">
          E = mc²
        </div>
        <div className="absolute top-40 right-20 opacity-5 text-2xl animate-float-delay">
          F = ma
        </div>
        <div className="absolute bottom-40 left-30 opacity-5 text-2xl animate-float">
          V = IR
        </div>

        {/* Animated Icons */}
        {[Atom, Microscope, Beaker, Waves].map((Icon, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ${
              animationStep === index ? "opacity-30" : "opacity-0"
            }`}
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 20}%`,
              transform: `rotate(${index * 45}deg)`,
              animation: "float 6s infinite",
            }}
          >
            <Icon className="w-12 h-12 text-orange-500" />
          </div>
        ))}
      </div>

      <section className="relative text-black">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex-col gap-24 flex min-h-screen items-center">
          <div className="mx-auto max-w-4xl text-center relative">
            {/* 3D Glowing Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

            <div className="relative bg-white/90 rounded-2xl p-8 shadow-2xl transform hover:scale-102 transition-all duration-300">
              <h1 className="bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text font-black text-transparent text-5xl pb-4 animate-gradient">
                Physics Lab
              </h1>
              <h1 className="bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text font-black text-transparent text-5xl pb-4">
                <span className="block">Virtual Collaboration</span>
              </h1>

              <div className="flex items-center justify-center gap-4 mb-6">
                <Microscope className="w-8 h-8 text-orange-500 animate-bounce" />
                <Atom className="w-8 h-8 text-orange-500 animate-spin-slow" />
                <Lightbulb className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>

              <p className="mx-auto mt-6 max-w-xl sm:text-xl/relaxed font-bold text-gray-700">
                Connect with fellow physics students, collaborate on
                experiments, and solve problems together in real-time.
              </p>

              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="relative group w-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <input
                    type="text"
                    id="name"
                    onChange={(e) => setFullName(e.target.value.trim())}
                    className="relative w-full border rounded-lg focus:ring-2 focus:border-orange-500 focus:border-b-4 px-4 py-4 text-black bg-white/90 transform hover:-translate-y-1 transition-all duration-300"
                    placeholder="Enter your name"
                    autoComplete="off"
                  />
                </div>
              </div>

              {fullName && fullName.length >= 3 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="relative group w-full">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                      <input
                        type="text"
                        id="roomid"
                        value={roomID}
                        onChange={(e) => setRoomID(e.target.value.trim())}
                        className="relative w-full border rounded-lg focus:ring-2 focus:border-orange-500 focus:border-b-4 px-4 py-4 text-black bg-white/90 transform hover:-translate-y-1 transition-all duration-300"
                        placeholder="Enter room ID to join a meeting"
                      />
                    </div>
                    <button
                      className="px-8 py-4 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold relative group"
                      onClick={handleJoinMeeting}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                      <span className="relative flex items-center gap-2">
                        Join
                        <Sparkles className="w-5 h-5" />
                      </span>
                    </button>
                  </div>
                  <div className="mt-6">
                    <button
                      className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                      onClick={() => navigate(`/meeting/room/${uuid()}`)}
                    >
                      <Beaker className="w-5 h-5" />
                      Create New Lab Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 7s ease-in-out infinite 1s;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
