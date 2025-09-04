import React, { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, UserPlus, User } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const Navbar = ({ currentPath, onNavigate, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserName();
  }, [user]);
  {/* 
          <Route path="meeting" element={<Home />} />
          <Route path="meeting/room/:roomid" element={<Room />} /> */}
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Physics", path: "/physics" },
    { name: "Cse", path: "/cse" },
    { name: "ChatBot", path: "/bot" },
    { name: "Meeting", path: "/meeting" },
    { name: "Resume", path: "/resume" },
    { name: "Ask Doubt", path: "/ask-doubts" },
  ];

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setShowUserMenu(false);
      onNavigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const UserButton = ({ isMobile = false }) => (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`flex items-center gap-2 font-medium
          ${isMobile
            ? "w-full p-3 text-gray-700 hover:bg-gray-50 rounded-xl"
            : "px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl"
          }`}
      >
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-orange-500" />
        </div>
        <span className="text-sm">
          {userName || user?.email?.split("@")[0]}
        </span>
      </button>

      {showUserMenu && (
        <div
          className={`
          absolute bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48
          ${isMobile ? "relative w-full mt-2" : "right-0 mt-2"}
        `}
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {userName || user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  const AuthButtons = ({ isMobile = false }) => (
    <div
      className={`flex ${isMobile ? "flex-col w-full gap-3" : "items-center gap-3"
        }`}
    >
      <button
        onClick={() => onNavigate("/auth")}
        className={`group flex items-center justify-center gap-2 font-medium transition-all duration-300
          ${isMobile
            ? "w-full p-3 text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            : "px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
          }`}
      >
        <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        <span>Login</span>
      </button>
      <button
        onClick={() => onNavigate("/auth")}
        className={`group flex items-center justify-center gap-2 font-medium bg-gradient-to-r from-orange-500 to-orange-600 
          text-white transition-all duration-300
          ${isMobile
            ? "w-full p-3 rounded-xl hover:shadow-lg hover:shadow-orange-200"
            : "px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-orange-200"
          }`}
      >
        <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span>Sign Up</span>
      </button>
    </div>
  );

  // Click outside handler to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <nav className="w-full max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate("/")}
            className="flex items-center space-x-1 cursor-pointer group"
          >
            <div className="w-4 h-4 bg-orange-500 rounded-sm transform rotate-45 transition-transform group-hover:rotate-90" />
            <div className="w-4 h-4 bg-orange-500 rounded-full transition-transform group-hover:scale-110" />
            <div className="w-4 h-4 bg-orange-500 rounded-sm transition-transform group-hover:-rotate-45" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`relative text-gray-700 transition-all duration-300 px-4 py-2 rounded-xl
                  group overflow-hidden
                  ${currentPath === item.path
                    ? "bg-orange-500 text-white"
                    : "hover:bg-orange-50"
                  }`}
              >
                <span className="relative z-10">{item.name}</span>
                {currentPath !== item.path && (
                  <div
                    className="absolute inset-0 w-full h-full bg-orange-500 opacity-0 
                    group-hover:opacity-10 transition-opacity duration-300"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors duration-300
              rounded-xl hover:bg-orange-50"
          >
            {isMenuOpen ? (
              <X
                size={24}
                className="transition-transform duration-300 rotate-90"
              />
            ) : (
              <Menu size={24} className="transition-transform duration-300" />
            )}
          </button>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:block relative user-menu-container">
            {user ? <UserButton /> : <AuthButtons />}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 
            shadow-lg shadow-gray-100/50 py-4 px-4"
          >
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-3 rounded-xl transition-all duration-300
                    ${currentPath === item.path
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 user-menu-container">
              {user ? (
                <UserButton isMobile={true} />
              ) : (
                <AuthButtons isMobile={true} />
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
