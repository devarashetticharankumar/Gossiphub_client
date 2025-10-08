import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/GossippHublogo.svg";

const TermsAndConditions = () => {
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
        isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
      } transition-colors duration-500 font-sans antialiased`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-md transition-colors duration-500">
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
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
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
          <h1
            className={`text-3xl md:text-4xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } mb-6 transition-colors duration-500`}
          >
            Terms and Conditions
          </h1>
          <div
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } rounded-lg p-6 shadow-lg transition-colors duration-500`}
          >
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              <span className="font-semibold">Last Updated: October 2025</span>
            </p>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Welcome to{" "}
              <span className="font-semibold text-red-600">GossipHub</span>. By
              accessing or using our website{" "}
              <a
                href="https://gossiphub.in"
                className="text-red-600 hover:underline"
              >
                gossiphub.in
              </a>
              , you agree to comply with and be bound by the following Terms and
              Conditions. Please read them carefully before using our platform.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              1. Acceptance of Terms
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              By visiting GossipHub, you confirm that you have read, understood,
              and agreed to these Terms. If you do not agree, please do not use
              our site.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              2. Use of Content
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              All articles, images, and materials on GossipHub are for
              informational and entertainment purposes only. You may share our
              content by providing proper credit and linking back to the
              original page. Reproduction, distribution, or modification of our
              content without permission is prohibited.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              3. User-Generated Content
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              When you post comments or submit information on our site:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  You grant GossipHub the right to display and moderate your
                  content.
                </li>
                <li>
                  You agree not to post defamatory, offensive, or unlawful
                  material.
                </li>
                <li>
                  GossipHub reserves the right to remove or edit any user
                  content that violates these terms.
                </li>
              </ul>
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              4. Intellectual Property
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              All logos, designs, and written material on GossipHub are the
              intellectual property of the site owners. Unauthorized use of our
              brand, name, or assets is strictly prohibited.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              5. External Links
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Our website may contain links to third-party sites. We are not
              responsible for the content, privacy policies, or practices of
              these external websites.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              6. Disclaimer
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              While we strive to provide accurate and timely news, GossipHub
              makes no guarantees regarding the completeness, reliability, or
              accuracy of the information provided. Use of our site is at your
              own discretion and risk.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              7. Limitation of Liability
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub and its team are not liable for any direct or indirect
              damages arising from your use of our website or any linked
              content.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              8. Changes to These Terms
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We may update these Terms and Conditions at any time. Any
              modifications will be posted on this page with an updated “Last
              Updated” date. Your continued use of the site after changes
              signifies acceptance of the revised terms.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              9. Contact Us
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              If you have questions about these Terms, please contact us:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  📧{" "}
                  <a
                    href="mailto:gossiphub@gmail.com"
                    className="text-red-600 hover:underline"
                  >
                    gossiphub@gmail.com
                  </a>
                </li>
              </ul>
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
      <footer className="bg-red-600 text-white py-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <Link
              to="/about"
              className="text-sm text-white hover:underline transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-white hover:underline transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="text-sm text-white hover:underline transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              to="/terms"
              className="text-sm text-white hover:underline transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
          </div>
          <p className="text-sm text-white">
            © 2025 GossipHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
