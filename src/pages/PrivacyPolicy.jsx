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
              } mb-6 transition-colors duration-500`}
          >
            Privacy Policy
          </h1>
          <div
            className={`${isDarkMode ? "bg-gray-900" : "bg-white"
              } rounded-2xl p-6 shadow-xl transition-colors duration-500`}
          >
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              <span className="font-semibold text-red-600">GossipHub</span> is fully committed to protecting the privacy of all visitors to its website. The following discloses the information gathering and dissemination practices for our Web and mobile site.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              1. User Data Handling
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              If you have registered on GossipHub, you have voluntarily provided information about yourself and this information is predominantly collected and used in an anonymized or pseudonymized form which includes:
              <ul className="list-disc pl-5 mt-2">
                <li>The first name, last name, and title</li>
                <li>Address, Contact information (e.g. email, phone)</li>
                <li>Personal Photos of users for identification</li>
                <li>Marital Status</li>
              </ul>
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              2. How secure is your Personal Information?
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We store all the personal data of registration for contest purposes. All the above said data used by GossipHub like the forms, emails, and data is completely deleted once they have been handled. We will not disclose any personal information to any third party for any reason. Since we do not maintain any personal information, we will never send you any advertisements or unsolicited information about this site.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              3. Third Party Analytics Details
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub uses the third party analytics tools. When you open or use one of our services the information collected by third parties includes:
              <ul className="list-disc pl-5 mt-2">
                <li>The type of browser you are using</li>
                <li>The pages you have visited on our website</li>
                <li>The operating system</li>
                <li>Your IP address or shortened IP address</li>
                <li>User behavior (e.g. mouse movements, click behavior, session duration, etc.)</li>
                <li>The number of user visits, duration of visits, first-time visit details and also where the user comes from.</li>
              </ul>
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              4. Advertising
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub uses a few third-party advertising companies to serve ads when you visit our Web site. These companies may use information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements on this site about goods and services that may be of interest to you.
              <br /><br />
              In the course of serving advertisements to this site, our third-party advertisers may place or recognize a unique “cookie” on your browser.
              <br /><br />
              Google, as a third party vendor, uses cookies to serve ads on your site. Google’s use of the DART cookie enables it to serve ads to your users based on their visit to your sites and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              5. External Links
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Our site contains links to other websites. These external links are not endorsements of those organizations and GossipHub is not responsible for the privacy practices or the content of such Web sites.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              6. Public Forums
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              GossipHub makes opinion polls available to its users. Please note that these polls are only done just to know the public pulse regarding the upcoming films and the actors starring in it. This is not done to degrade and takes sides of any party.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              7. Security
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              This site has security measures in place to protect the loss, misuse, and alteration of the information provided by us. We make every effort to maintain the quality of service and prevent misuse.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              8. Policy Updates
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              We reserve the right to change or update this policy at any time. Such changes shall be posted to the user and other places we deem appropriate.
            </p>

            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                } mb-2 transition-colors duration-500`}
            >
              9. Grievance Redressal
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-4 leading-relaxed transition-colors duration-500`}
            >
              Our users may report a violation of breach of privacy, information or content theft in accordance with this Policy to the given email id – {" "}
              <a
                href="mailto:gossiphub@gmail.com"
                className={`${isDarkMode
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600 hover:text-red-700"
                  } hover:underline transition-colors duration-200`}
              >
                gossiphub@gmail.com
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
