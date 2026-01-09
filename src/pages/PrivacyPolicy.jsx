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
//               At <span className="font-semibold text-red-600">GossipHub</span>,
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
//               You can choose to post anonymously on GossipHub. When you select
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
      className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
        } transition-colors duration-500 font-sans antialiased`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-md transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="GossipHub Logo"
              className="h-10 rounded-md"
              aria-label="GossipHub Home"
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
            className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2 transition-colors duration-500`}
          >
            Privacy Policy
          </h1>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
            Last Updated: January 2026
          </p>

          <div
            className={`${isDarkMode ? "bg-gray-900" : "bg-white"
              } rounded-2xl p-6 shadow-xl transition-colors duration-500`}
          >
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              At GossipHub (accessible at{" "}
              <a href="https://gossiphub.in" className="text-red-600 hover:underline">
                https://gossiphub.in
              </a>
              ), we value the privacy of our visitors. This Privacy Policy document outlines the types of information that are collected and recorded by GossipHub and how we use it.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>

            {/* 1. Information We Collect */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              1. Information We Collect
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2 leading-relaxed transition-colors duration-500`}
            >
              We do not require users to provide personal information to browse GossipHub.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2 leading-relaxed transition-colors duration-500`}
            >
              However, we may collect limited information in the following cases:
            </p>
            <ul className={`list-disc pl-5 mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              <li>When users contact us directly via email or contact forms (such as name and email address)</li>
              <li>When users voluntarily submit comments or feedback</li>
              <li>Automatically collected data such as IP address, browser type, pages visited, date and time of visit, and referring URLs</li>
            </ul>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              This information is used only to improve user experience and site performance.
            </p>

            {/* 2. How We Use Your Information */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              2. How We Use Your Information
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2 leading-relaxed transition-colors duration-500`}
            >
              The information we collect is used to:
            </p>
            <ul className={`list-disc pl-5 mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              <li>Operate and maintain our website</li>
              <li>Improve content quality and user experience</li>
              <li>Understand user behavior and traffic patterns</li>
              <li>Respond to user inquiries and feedback</li>
              <li>Detect and prevent spam or abuse</li>
            </ul>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We do not sell, trade, or rent users’ personal information to third parties.
            </p>

            {/* 3. Cookies and Web Beacons */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              3. Cookies and Web Beacons
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2 leading-relaxed transition-colors duration-500`}
            >
              GossipHub uses cookies to:
            </p>
            <ul className={`list-disc pl-5 mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              <li>Store visitor preferences</li>
              <li>Optimize content based on visitors’ browser types or behavior</li>
              <li>Serve relevant advertisements</li>
            </ul>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Users can choose to disable cookies through their individual browser options.
            </p>

            {/* 4. Google AdSense & Advertising Partners */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              4. Google AdSense & Advertising Partners
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub displays advertisements provided by third-party advertising partners, including Google AdSense.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Google uses cookies (including the DoubleClick cookie) to serve ads based on users’ visits to this and other websites. This allows Google to show ads that are relevant to users’ interests.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Users may opt out of personalized advertising by visiting Google’s Ads Settings.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              👉 Google’s advertising policies can be reviewed on Google’s official privacy pages.
            </p>

            {/* 5. Third-Party Privacy Policies */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              5. Third-Party Privacy Policies
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub’s Privacy Policy does not apply to other advertisers or websites.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We encourage users to review the Privacy Policies of third-party ad servers or websites for more detailed information about their practices and instructions on how to opt out of certain options.
            </p>

            {/* 6. External Links */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              6. External Links
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Our website may contain links to external websites for reference or additional information. GossipHub is not responsible for the privacy practices, content, or policies of third-party websites.
            </p>

            {/* 7. Children’s Information */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              7. Children’s Information
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Protecting children’s privacy is important to us.
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe that your child has provided such information on our website, please contact us immediately, and we will promptly remove it from our records.
            </p>

            {/* 8. Data Security */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              8. Data Security
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We take reasonable measures to protect user information from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            {/* 9. Content & Gossip Disclaimer */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              9. Content & Gossip Disclaimer
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2 leading-relaxed transition-colors duration-500`}
            >
              GossipHub publishes entertainment news, celebrity updates, and gossip-related content for informational and entertainment purposes only.
            </p>
            <ul className={`list-disc pl-5 mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              <li>Rumors or unverified information are clearly labeled as such</li>
              <li>Readers are advised not to treat gossip or rumors as confirmed facts</li>
            </ul>

            {/* 10. Consent */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              10. Consent
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>

            {/* 11. Updates to This Policy */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              11. Updates to This Policy
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>

            {/* 12. Contact Us */}
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mt-6 mb-2 transition-colors duration-500`}
            >
              12. Contact Us
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              If you have any questions or concerns about this Privacy Policy, you may contact us at:
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2 leading-relaxed transition-colors duration-500`}
            >
              📧 Email:{" "}
              <a
                href="mailto:gossiphub@gmail.com"
                className="text-red-600 hover:underline"
              >
                gossiphub@gmail.com
              </a>
            </p>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              🌐 Website:{" "}
              <a
                href="https://gossiphub.in"
                className="text-red-600 hover:underline"
              >
                https://gossiphub.in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}

    </div>
  );
};

export default PrivacyPolicy;
