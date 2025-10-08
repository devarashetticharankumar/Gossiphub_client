// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Logo from "../assets/GossippHublogo.svg";

// const PrivacyPolicy = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-950" : "bg-gray-100"
//       } transition-colors duration-500 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link to="/" className="flex items-center">
//             <img
//               src={Logo}
//               alt="GossippHub Logo"
//               className="h-10 rounded-md"
//               aria-label="GossippHub Home"
//             />
//           </Link>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
//             aria-label={
//               isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//             }
//           >
//             {isDarkMode ? (
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
//               </svg>
//             ) : (
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
//         <div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
//             Privacy Policy
//           </h1>
//           <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               At <span className="font-semibold text-red-600">GossippHub</span>,
//               we are committed to protecting your privacy. This Privacy Policy
//               explains how we collect, use, and safeguard your information when
//               you use our platform.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               1. Information We Collect
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               We collect information you provide directly, such as your
//               username, email address, and posts or comments you share. We also
//               collect usage data, including your IP address, browser type, and
//               activity on the platform, to improve our services.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               2. How We Use Your Information
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               Your information is used to provide and improve our services,
//               personalize your experience, and communicate with you. For
//               example, we may use your email to send notifications or respond to
//               your inquiries.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               3. Sharing Your Information
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               We do not sell or share your personal information with third
//               parties, except as required by law or to protect the safety of our
//               users and platform.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               4. Anonymity Options
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               You can choose to post anonymously on GossippHub. When you select
//               this option, your username and identifiable information will not
//               be displayed publicly.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               5. Cookies and Tracking
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               We use cookies to enhance your experience, such as remembering
//               your dark mode preference. You can manage cookie settings in your
//               browser.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               6. Data Security
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               We implement industry-standard security measures to protect your
//               data. However, no system is completely secure, and we cannot
//               guarantee absolute security.
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               7. Your Rights
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               You have the right to access, update, or delete your personal
//               information. To exercise these rights, please contact us at{" "}
//               <a
//                 href="mailto:support@gossipphub.com"
//                 className="text-red-600 hover:underline"
//               >
//                 support@gossipphub.com
//               </a>
//               .
//             </p>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               8. Changes to This Policy
//             </h2>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               We may update this Privacy Policy from time to time. We will
//               notify you of significant changes by posting a notice on our
//               platform.
//             </p>
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               If you have any questions about this Privacy Policy, please reach
//               out to us at{" "}
//               <a
//                 href="mailto:support@gossipphub.com"
//                 className="text-red-600 hover:underline"
//               >
//                 support@gossipphub.com
//               </a>
//               .
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-red-600 text-white py-6">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <div className="flex justify-center space-x-4 mb-4">
//             <Link to="/about" className="text-sm hover:underline">
//               About Us
//             </Link>
//             <Link to="/privacy" className="text-sm hover:underline">
//               Privacy Policy
//             </Link>
//             <Link to="/contact" className="text-sm hover:underline">
//               Contact Us
//             </Link>
//           </div>
//           <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PrivacyPolicy;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/GossippHublogo.svg";

const PrivacyPolicy = () => {
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div>
          <h1
            className={`text-3xl md:text-4xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } mb-6 transition-colors duration-500`}
          >
            Privacy Policy
          </h1>
          <div
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } rounded-2xl p-6 shadow-xl transition-colors duration-500`}
          >
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              At <span className="font-semibold text-red-600">GossipHub</span>,
              we are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your information when
              you use our platform.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              1. Information We Collect
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We collect information you provide directly, such as your
              username, email address, and posts or comments you share. We also
              collect usage data, including your IP address, browser type, and
              activity on the platform, to improve our services.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              2. How We Use Your Information
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Your information is used to provide and improve our services,
              personalize your experience, and communicate with you. For
              example, we may use your email to send notifications or respond to
              your inquiries.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              3. Sharing Your Information
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We do not sell or share your personal information with third
              parties, except as required by law or to protect the safety of our
              users and platform.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              4. Anonymity Options
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              You can choose to post anonymously on GossipHub. When you select
              this option, your username and identifiable information will not
              be displayed publicly.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              5. Cookies and Tracking
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We use cookies to enhance your experience, such as remembering
              your dark mode preference. You can manage cookie settings in your
              browser.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              6. Data Security
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We implement industry-standard security measures to protect your
              data. However, no system is completely secure, and we cannot
              guarantee absolute security.
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              7. Your Rights
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              You have the right to access, update, or delete your personal
              information. To exercise these rights, please contact us at{" "}
              <a
                href="mailto:gossipphub@gmail.com"
                className={`${
                  isDarkMode
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                } hover:underline transition-colors duration-200`}
              >
                gossiphub@gmail.com
              </a>
              .
            </p>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
            >
              8. Changes to This Policy
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by posting a notice on our
              platform.
            </p>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              } mb-4 leading-relaxed transition-colors duration-500`}
            >
              If you have any questions about this Privacy Policy, please reach
              out to us at{" "}
              <a
                href="mailto:gossipphub@gmail.com"
                className={`${
                  isDarkMode
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                } hover:underline transition-colors duration-200`}
              >
                gossiphub@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <Link
              to="/about"
              className="text-sm text-white hover:text-gray-200 transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-white hover:text-gray-200 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="text-sm text-white hover:text-gray-200 transition-colors duration-200"
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
          <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
