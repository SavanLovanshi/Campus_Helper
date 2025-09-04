import React, { useState } from "react";
import {
  ChevronRight,
  BookOpen,
  Calculator,
  MessageCircle,
  Compass,
  ChevronDown,
  Send,
} from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

const LandingPage = ({ onNavigate, user }) => {
  const [email, setEmail] = useState("");

  const stats = [
    { value: "50+", label: "Interactive Experiments" },
    { value: "1000+", label: "Animations Learning" },
    { value: "24/7", label: "Learning Support" },
    { value: "98%", label: "Success Rate" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Thanks for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Make Your Learning Interactive
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Level Up Your{" "}
                <span className="inline-block min-w-[300px] bg-clip-text text-transparent bg-gradient-to-r from-[#E83B00] to-[#FF7349]">
                  <Typewriter
                    words={["First Year"]}
                    loop={true}
                    cursor
                    cursorStyle="_"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
              </h1>

              <p className="text-lg text-gray-700 max-w-lg">
                Learn <b>Physics, CSE, Mechanical and Electronics</b> through
                interactive learning, hands-on experiments, and immersive
                visualization —all in one place!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate("/virtual-lab")}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white font-medium text-lg
                    shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-1"
                >
                  Start Learning
                </button>

                <button
                  onClick={() => {
                    const featuresSection = document.getElementById("features");
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-lg
                    hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Explore Features</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-2xl shadow-xl group hover:shadow-2xl transition-all duration-300 ease-in-out">
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              </div>

              <div className="relative space-y-6">
                {/* Learn by Doing */}
                <div className="flex items-start gap-4 transition-transform group-hover:scale-[1.02] duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] flex items-center justify-center animate-pulse">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Gamified Learning</h3>
                    <p className="text-gray-600 text-sm">
                      Earn XP while performing virtual experiments and
                      challenges.
                    </p>
                  </div>
                </div>

                {/* Calculate & Analyze */}
                <div className="flex items-start gap-4 transition-transform group-hover:scale-[1.02] duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Smart Problem Solver
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Solve real-world problems in Physics, Math, and CSE with
                      step-by-step breakdowns.
                    </p>
                  </div>
                </div>

                {/* Get Instant Help */}
                <div className="flex items-start gap-4 transition-transform group-hover:scale-[1.02] duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Instant Doubt Solver
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ask questions anytime. Get answers from mentors and peers
                      in real-time.
                    </p>
                  </div>
                </div>

                {/* Final Call-to-Action */}
                <div className="px-5 py-4 bg-white rounded-xl shadow border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#E83B00] rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <p className="font-semibold">Immersive Simulations</p>
                        <p className="text-sm text-gray-500">
                          Hands-on labs and real-time visualizations to boost
                          concept clarity.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate("/virtual-lab")}
                      className="p-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E83B00] to-[#FF7349]">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,138.7C672,117,768,75,864,80C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Master Any Subject
            </h2>
            <p className="text-gray-600 text-lg">
              Our comprehensive platform provides all the tools you need to
              understand and excel in any Subject through practical and
              visualization learning.
            </p>
          </div>
        </div>
      </section>

      {/* Subjects Overview Section */}
      <section className="py-24 bg-gradient-to-b from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-fade-in">
            Dive into Core Subjects Like Never Before!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Subject Card Template */}
            {[
              {
                title: "Physics",
                color: "orange",
                description:
                  "Unleash your inner scientist! Perform virtual experiments, defy gravity, and conquer physics puzzles.",
                bg: "hover:bg-orange-100",
                items: [
                  "🧪 Lab Manual",
                  "🤖 AI Physics Bot",
                  "🧬 Virtual Lab",
                  "🎮 Concept Games",
                ],
              },
              {
                title: "Computer Science",
                color: "blue",
                description:
                  "Turn code into magic! Practice logic, master languages, and solve real-world challenges.",
                bg: "hover:bg-blue-100",
                items: [
                  "💻 JavaScript Playground",
                  "🔄 OOPS Simulator",
                  "🧠 C Language Basics",
                  "🕹️ Coding Challenges",
                ],
              },
              {
                title: "Mechanical",
                color: "green",
                description:
                  "Bring machines to life! Explore blueprints, tools, and the magic behind moving parts.",
                bg: "hover:bg-green-100",
                items: [
                  "⚙️ CAD Simulations",
                  "🔧 Machine Design Walkthroughs",
                  "📐 Mechanics Toolkit",
                  "🎓 Interactive Quizzes",
                ],
              },
              {
                title: "Electronics",
                color: "purple",
                description:
                  "Spark your curiosity! Build circuits, test sensors, and explore the IoT universe.",
                bg: "hover:bg-purple-100",
                items: [
                  "📡 Circuit Builder",
                  "⚡ Sensor Simulations",
                  "🔋 IoT Experiments",
                  "🔬 Component Analyzer",
                ],
              },
            ].map((subject, index) => (
              <div
                key={index}
                className={`p-8 rounded-3xl bg-white shadow-xl border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${subject.bg} group`}
              >
                <h3
                  className={`text-2xl font-bold mb-3 text-${subject.color}-600`}
                >
                  {subject.title}
                </h3>
                <p className="text-gray-700 mb-5">{subject.description}</p>
                <ul className="space-y-3 text-gray-800">
                  {subject.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 font-medium transition-all duration-200 group-hover:translate-x-1"
                    >
                      <span className="text-xl animate-bounce-slow">
                        {item.split(" ")[0]}
                      </span>
                      <span>{item.split(" ").slice(1).join(" ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-12 lg:p-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Learning Experience?
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Join thousands of students who have improved their
                  understanding of Learning through our interactive platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => onNavigate("/auth")}
                    className="px-8 py-3 rounded-xl bg-white text-[#E83B00] font-medium
                      hover:shadow-lg transition-all duration-300"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => onNavigate("/virtual-lab")}
                    className="px-8 py-3 rounded-xl bg-white/20 text-white font-medium
                      hover:bg-white/30 transition-all duration-300"
                  >
                    Try Demo
                  </button>
                </div>
              </div>
              <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-4">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        <ChevronRight className="w-8 h-8 text-[#E83B00]" />
                      </div>
                    </div>
                    <p className="text-white font-medium">Watch Demo Video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 pb-48 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Latest Courses Resources
            </h2>
            <p className="text-gray-600 mb-8">
              Supercharge Your Learning! 🚀 Get Weekly Insights in Physics, CSE,
              Math & More!
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E83B00]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white font-medium
                  hover:shadow-lg shadow-orange-200 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}

      {/* Custom CSS for background grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
