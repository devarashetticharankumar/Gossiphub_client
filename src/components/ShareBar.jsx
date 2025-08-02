// import { motion } from "framer-motion";
// import {
//   FaShareAlt,
//   FaTwitter,
//   FaWhatsapp,
//   FaFacebook,
//   FaTelegram,
//   FaLinkedin,
//   FaLink,
// } from "react-icons/fa";

// const ShareBar = ({
//   handleNativeShare,
//   handleShareTwitter,
//   handleShareWhatsapp,
//   handleShareFacebook,
//   handleShareTelegram,
//   handleShareLinkedin,
//   handleCopyLink,
//   isCopied,
//   isDarkMode,
// }) => {
//   return (
//     <motion.div
//       className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${
//         isDarkMode ? "bg-gray-900/90" : "bg-white/90"
//       } backdrop-blur-md shadow-lg flex justify-center items-center gap-4 transition-colors duration-500 md:sticky md:bottom-auto md:top-[calc(100vh-80px)] md:bg-transparent md:shadow-none md:flex-col md:items-end md:gap-2 md:pr-4`}
//       initial={{ y: 100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleNativeShare}
//         className={`p-2 rounded-full ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//         } hover:bg-red-600 hover:text-white transition-colors`}
//         aria-label="Share post natively"
//       >
//         <FaShareAlt className="h-5 w-5" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleShareTwitter}
//         className={`p-2 rounded-full ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//         } hover:bg-blue-500 hover:text-white transition-colors`}
//         aria-label="Share on Twitter"
//       >
//         <FaTwitter className="h-5 w-5" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleShareWhatsapp}
//         className={`p-2 rounded-full ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//         } hover:bg-green-500 hover:text-white transition-colors`}
//         aria-label="Share on WhatsApp"
//       >
//         <FaWhatsapp className="h-5 w-5" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleShareFacebook}
//         className={`p-2 rounded-full ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//         } hover:bg-blue-600 hover:text-white transition-colors`}
//         aria-label="Share on Facebook"
//       >
//         <FaFacebook className="h-5 w-5" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleShareTelegram}
//         className={`p-2 rounded-full ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//         } hover:bg-blue-400 hover:text-white transition-colors`}
//         aria-label="Share on Telegram"
//       >
//         <FaTelegram className="h-5 w-5" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleShareLinkedin}
//         className={`p-2 rounded-full ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//         } hover:bg-blue-700 hover:text-white transition-colors`}
//         aria-label="Share on LinkedIn"
//       >
//         <FaLinkedin className="h-5 w-5" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleCopyLink}
//         className={`p-2 rounded-full ${
//           isCopied
//             ? "bg-green-500 text-white"
//             : isDarkMode
//             ? "bg-gray-800 text-white"
//             : "bg-gray-200 text-gray-900"
//         } hover:bg-green-500 hover:text-white transition-colors`}
//         aria-label={isCopied ? "Link copied" : "Copy link"}
//       >
//         <FaLink className="h-5 w-5" />
//       </motion.button>
//     </motion.div>
//   );
// };

// export default ShareBar;

import { motion } from "framer-motion";
import {
  FaShareAlt,
  FaTwitter,
  FaWhatsapp,
  FaFacebook,
  FaTelegram,
  FaLinkedin,
  FaLink,
} from "react-icons/fa";

const ShareBar = ({
  handleNativeShare,
  handleShareTwitter,
  handleShareWhatsapp,
  handleShareFacebook,
  handleShareTelegram,
  handleShareLinkedin,
  handleCopyLink,
  isCopied,
  isDarkMode,
  postMedia,
}) => {
  return (
    <motion.div
      className={`fixed bottom-4 right-4 z-50 p-2 ${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      } rounded-lg flex justify-center items-center gap-2 transition-colors duration-300`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #ef4444" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNativeShare(postMedia)}
        className={`p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200`}
        aria-label="Share post natively"
      >
        <FaShareAlt className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #3b82f6" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShareTwitter(postMedia)}
        className={`p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200`}
        aria-label="Share on Twitter"
      >
        <FaTwitter className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #10b981" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShareWhatsapp(postMedia)}
        className={`p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200`}
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #1d4ed8" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShareFacebook(postMedia)}
        className={`p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200`}
        aria-label="Share on Facebook"
      >
        <FaFacebook className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #60a5fa" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShareTelegram(postMedia)}
        className={`p-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors duration-200`}
        aria-label="Share on Telegram"
      >
        <FaTelegram className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #1e40af" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShareLinkedin(postMedia)}
        className={`p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200`}
        aria-label="Share on LinkedIn"
      >
        <FaLinkedin className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, border: "2px solid #16a34a" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className={`p-2 rounded-lg ${
          isCopied
            ? "bg-green-500 text-white"
            : isDarkMode
            ? "bg-gray-700 text-white"
            : "bg-gray-400 text-white"
        } hover:bg-green-600 transition-colors duration-200`}
        aria-label={isCopied ? "Link copied" : "Copy link"}
      >
        <FaLink className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
};

export default ShareBar;
