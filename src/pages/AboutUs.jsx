import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/GossippHublogo.svg";

const AboutUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gray-100"
      } transition-colors duration-500 font-poppins`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="GossippHub Logo"
              className="h-10 rounded-md"
              aria-label="GossippHub Home"
            />
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            About Us
          </h1>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
              Welcome to{" "}
              <span className="font-semibold text-red-600">GossippHub</span>,
              the ultimate platform for sharing and discovering the juiciest
              gossip, stories, and conversations! We are a vibrant community
              where users can spill the tea, engage in lively discussions, and
              stay updated on trending topics.
            </p>
            <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
              Founded in 2024, GossippHub was created to provide a fun, safe,
              and engaging space for people to connect over shared interests and
              stories. Whether you're here to share a hot rumor, read about the
              latest buzz, or simply enjoy some entertaining content, we've got
              you covered.
            </p>
            <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
              Our mission is to foster a community where everyone can express
              themselves freely while maintaining respect and authenticity. We
              value user privacy and ensure that you can share anonymously if
              you choose to. Join us today and become part of the GossippHub
              family!
            </p>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-block px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <Link to="/about" className="text-sm hover:underline">
              About Us
            </Link>

            <Link to="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div>
          <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
