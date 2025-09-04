
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Beaker,
  Lightbulb,
  Telescope,
  Waves,
  Atom,
  Sparkles,
  PlusCircle,

} from "lucide-react";


const BentoExperimentGrid = () => {
  const navigate = useNavigate();
  const experimentCards = [
    {
      id: 7,
      title: "Optical Fiber",
      description: "Calculate numerical aperture and acceptance angle",
      path: "/optical-fiber",
      icon: Waves,
      size: "large",
      color: "orange",
    },
    {
      id: 8,
      title: "Brewster's Law",
      description: "Calculate refractive index using polarizing angle",
      path: "/brewsters-law",
      icon: Lightbulb,
      size: "medium",
      color: "purple",
    },
    {
      id: 9,
      title: "PN Junction Diode",
      description: "Analyze diode characteristics for silicon and germanium",
      path: "/pn-junction",
      icon: Atom,
      size: "medium",
      color: "blue",
    },
    {
      id: 10,
      title: "Laser Wavelength",
      description: "Determine wavelength using diffraction grating",
      path: "/laser-wave",
      icon: Telescope,
      size: "medium",
      color: "green",
    },
    {
      id: 11,
      title: "Coming Soon",
      description: "New experiment coming soon",
      path: "/",
      icon: PlusCircle,
      size: "small",
      color: "gray",
    }
  ];

  const getCardSize = (size) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "medium":
        return "md:col-span-1 md:row-span-2";
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  const getCardColor = (color) => {
    const colors = {
      orange: "from-orange-500 to-orange-600",
      purple: "from-purple-500 to-purple-600",
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      gray: "from-gray-500 to-gray-600",
    };
    return colors[color] || colors.orange;
  };
  const menuItems = [
    { name: "Lab Manual", path: "/lab-manual" },
    { name: "Physics Calc", path: "/physics-calculator" },
    { name: "Virtual Lab", path: "/virtual-lab" },
    { name: "Game", path: "/game" },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* <NavbarPhysics /> */}
      <nav className="bg-orange-200 text-black px-2 mt-0 py-2 flex justify-center items-center gap-4 overflow-x-auto">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`px-4 py-2 rounded transition-all duration-300 
        ${location.pathname === item.path ? 'bg-orange-500 text-white' : 'hover:bg-orange-300'}`}
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-[#E83B00] to-[#FF7349]">
          Physics Lab Experiments
        </h1>

        {/* Floating Animation Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <Sparkles className="text-orange-300 opacity-30 w-6 h-6" />
            </div>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {experimentCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative ${getCardSize(card.size)} 
                  transform transition-all duration-300 hover:scale-102 hover:-translate-y-1`}
              >
                <a href={card.path} className="block h-full">
                  <div
                    className={`h-full rounded-2xl p-6 relative overflow-hidden
                    bg-gradient-to-br ${getCardColor(card.color)} 
                    shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <div className="absolute inset-0 bg-pattern"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">
                          Experiment {card.id}
                        </h2>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-white/80">{card.description}</p>

                      {/* Interactive Elements */}
                      <div className="mt-auto pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-4 py-2 bg-white/20 rounded-full text-sm">
                          Open Calculator →
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

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
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .bg-pattern {
          background-image: radial-gradient(
            circle at 2px 2px,
            white 1px,
            transparent 0
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default BentoExperimentGrid;