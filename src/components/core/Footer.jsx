import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  UserPlus,
} from "lucide-react";

const Footer = ({ onNavigate }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };


  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Wave animation for the top separator
  const waveVariants = {
    hidden: { pathLength: 0, pathOffset: 1 },
    visible: {
      pathLength: 1,
      pathOffset: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <footer className="bg-gray-900 text-white relative mt-32" id="footer">
      {/* Wave Separator at top */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240" className="w-full">
          <motion.path
            initial="hidden"
            animate="visible"
            variants={waveVariants}
            fill="#1f2937"
            d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,138.7C672,117,768,75,864,80C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></motion.path>
        </svg>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-1 mb-6">
              <div className="w-4 h-4 bg-orange-500 rounded-sm transform rotate-45" />
              <div className="w-4 h-4 bg-orange-500 rounded-full" />
              <div className="w-4 h-4 bg-orange-500 rounded-sm transform -rotate-45" />
              <span className="ml-2 text-xl font-bold">Interactive Learning</span>
            </div>
            <p className="text-gray-400 mb-6">
              Interactive physics learning platform with virtual experiments,
              calculators, and expert assistance.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 relative">
              Quick Links
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </h3>
            <ul className="space-y-4">
              {[
                { path: "/lab-manual", name: "Lab Manual" },
                { path: "/virtual-lab", name: "Virtual Lab" },
                { path: "/physics-calculator", name: "Calculator" },
                { path: "/ask-doubts", name: "Ask Doubts" }
              ].map((link, index) => (
                <motion.li key={link.path}
                  variants={{
                    hidden: { x: -20, opacity: 0 },
                    visible: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 100
                      }
                    }
                  }}
                >
                  <motion.button
                    onClick={() => onNavigate(link.path)}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      className="text-orange-500"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                    <span>{link.name}</span>
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 relative">
              Contact Us
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </h3>
            <ul className="space-y-4">
              <motion.li
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  123 Physics Avenue, Education District, Science City, 10001
                </span>
              </motion.li>
              <motion.li
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">info@physicslab.com</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">+1 (123) 456-7890</span>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 relative">
              Join Us
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </h3>
            <p className="text-gray-400 mb-6">
              Sign up today and start your journey to mastering physics
              concepts through interactive learning.
            </p>
            <motion.button
              onClick={() => onNavigate("/auth")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(232, 59, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            &copy; {new Date().getFullYear()} PhysicsLab. All rights reserved.
          </motion.p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="hover:text-white transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                whileHover={{ color: "#ffffff", y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;