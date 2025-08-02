// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Logo from "../assets/GossippHublogo.svg";

// const ContactUs = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

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

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Placeholder for form submission logic
//     toast.success("Message sent! We'll get back to you soon.");
//     setFormData({ name: "", email: "", message: "" });
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
//             Contact Us
//           </h1>
//           <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
//             <p className="text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
//               Have a question, suggestion, or just want to say hi? We'd love to
//               hear from you! Reach out to us using the form below, and we'll get
//               back to you as soon as possible.
//             </p>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none text-gray-900 dark:text-gray-100"
//                   placeholder="Your name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none text-gray-900 dark:text-gray-100"
//                   placeholder="Your email"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="message"
//                   className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
//                 >
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none resize-none h-32 text-gray-900 dark:text-gray-100"
//                   placeholder="Your message"
//                   required
//                 />
//               </div>
//               <button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="submit"
//                 className="w-full md:w-auto px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Send Message
//               </button>
//             </form>
//             <div className="mt-6">
//               <p className="text-base text-gray-700 dark:text-gray-200">
//                 You can also reach us at:{" "}
//                 <a
//                   href="mailto:support@gossipphub.com"
//                   className="text-red-600 hover:underline"
//                 >
//                   support@gossipphub.com
//                 </a>
//               </p>
//             </div>
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

// export default ContactUs;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/GossippHublogo.svg";

const ContactUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
      } transition-colors duration-500 font-sans antialiased`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-md transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
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
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <div>
          <h1
            className={`text-3xl md:text-4xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } mb-6 transition-colors duration-500`}
          >
            Contact Us
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
              Have a question, suggestion, or just want to say hi? We'd love to
              hear from you! Reach out to us using the form below, and we'll get
              back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-1 transition-colors duration-500`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-red-400"
                      : "bg-gray-100 border-gray-200 text-gray-900 focus:ring-red-500"
                  } border focus:ring-2 focus:outline-none transition-colors duration-500`}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-1 transition-colors duration-500`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-red-400"
                      : "bg-gray-100 border-gray-200 text-gray-900 focus:ring-red-500"
                  } border focus:ring-2 focus:outline-none transition-colors duration-500`}
                  placeholder="Your email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-1 transition-colors duration-500`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-red-400"
                      : "bg-gray-100 border-gray-200 text-gray-900 focus:ring-red-500"
                  } border focus:ring-2 focus:outline-none resize-none h-32 transition-colors duration-500`}
                  placeholder="Your message"
                  required
                />
              </div>
              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full md:w-auto px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
            <div className="mt-6">
              <p
                className={`text-base ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } transition-colors duration-500`}
              >
                You can also reach us at:{" "}
                <a
                  href="mailto:support@gossipphub.com"
                  className="text-red-600 hover:underline"
                >
                  support@gossiphub.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-6 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 text-center">
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
          </div>
          <p className="text-sm text-white">
            © 2025 GossipHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
