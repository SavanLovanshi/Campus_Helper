import React from "react";
import { Atom, GraduationCap } from "lucide-react";

const RoleSelection = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Student Card */}
          <div
            onClick={() => onSelectRole("student")}
            className="bg-white/90 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative text-center">
              <GraduationCap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text text-transparent mb-2">
                Student
              </h2>
              <p className="text-gray-600">
                Join as a student to access learning resources and collaborate
                with peers
              </p>
            </div>
          </div>

          {/* Teacher Card */}
          <div
            onClick={() => onSelectRole("teacher")}
            className="bg-white/90 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative text-center">
              <Atom className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin-slow" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text text-transparent mb-2">
                Teacher
              </h2>
              <p className="text-gray-600">
                Sign in with your institutional email to manage classes and
                resources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
