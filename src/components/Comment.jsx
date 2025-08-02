// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { timeAgo } from "./PostDetails"; // Assuming timeAgo is exported from PostDetails or a utils file

// const Comment = ({
//   comment,
//   handleCommentReaction,
//   isCommentReacting,
//   userId,
//   isAuthenticated,
//   isDarkMode,
// }) => {
//   const isLiked = comment.likes?.includes(userId);

//   return (
//     <motion.div
//       className={`p-4 rounded-lg mb-4 shadow-sm ${
//         comment.isPopular
//           ? isDarkMode
//             ? "bg-gray-800 border-l-4 border-yellow-500"
//             : "bg-gray-100 border-l-4 border-yellow-500"
//           : isDarkMode
//           ? "bg-gray-800"
//           : "bg-gray-100"
//       } transition-colors duration-500`}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.4 }}
//     >
//       <div className="flex justify-between items-start">
//         <div>
//           <p
//             className={`text-sm font-medium ${
//               isDarkMode ? "text-gray-100" : "text-gray-900"
//             }`}
//           >
//             {comment.isAnonymous ? (
//               "Anonymous"
//             ) : (
//               <Link
//                 to={`/profile/${comment.author._id}`}
//                 className={
//                   isDarkMode
//                     ? "text-indigo-400 hover:text-indigo-300"
//                     : "text-indigo-600 hover:text-indigo-700"
//                 }
//                 aria-label={`View ${comment.author.username}'s profile`}
//               >
//                 {comment.author?.username || "Unknown"}
//               </Link>
//             )}
//           </p>
//           <p
//             className={`text-xs ${
//               isDarkMode ? "text-gray-400" : "text-gray-500"
//             }`}
//           >
//             {timeAgo(comment.createdAt)}
//             {comment.isPopular && (
//               <span className="ml-2 text-yellow-500">🌟 Popular</span>
//             )}
//           </p>
//         </div>
//         {isAuthenticated && (
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleCommentReaction(comment._id, "like")}
//             className={`flex items-center gap-1 text-sm ${
//               isLiked
//                 ? "text-red-600"
//                 : isDarkMode
//                 ? "text-gray-300 hover:text-red-400"
//                 : "text-gray-600 hover:text-red-600"
//             } ${
//               isCommentReacting === comment._id
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//             disabled={isCommentReacting === comment._id}
//             aria-label={`Like comment (${comment.likes?.length || 0} likes)${
//               isLiked ? " (You liked this)" : ""
//             }`}
//           >
//             <span className="text-lg">👍</span>
//             <span>({comment.likes?.length || 0})</span>
//           </motion.button>
//         )}
//       </div>
//       <p
//         className={`mt-2 text-sm ${
//           isDarkMode ? "text-gray-200" : "text-gray-800"
//         }`}
//       >
//         {comment.text}
//       </p>
//     </motion.div>
//   );
// };

// export default Comment;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { timeAgo } from "./PostDetails";

const Comment = ({
  comment,
  handleCommentReaction,
  isCommentReacting,
  userId,
  isAuthenticated,
  isDarkMode,
}) => {
  const isLiked = comment.likes?.includes(userId);

  return (
    <motion.div
      className={`p-4 rounded-lg mb-4 shadow-sm ${
        comment.isPopular
          ? isDarkMode
            ? "bg-gray-800 border-l-4 border-yellow-500"
            : "bg-gray-100 border-l-4 border-yellow-500"
          : isDarkMode
          ? "bg-gray-800"
          : "bg-gray-100"
      } transition-colors duration-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {comment.isAnonymous ? (
              "Anonymous"
            ) : (
              <Link
                to={`/profile/${comment.author._id}`}
                className={
                  isDarkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-700"
                }
                aria-label={`View ${comment.author.username}'s profile`}
              >
                {comment.author?.username || "Unknown"}
              </Link>
            )}
          </p>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {timeAgo(comment.createdAt)}
            {comment.isPopular && (
              <span className="ml-2 text-yellow-500">🌟 Popular</span>
            )}
          </p>
        </div>
        {isAuthenticated && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCommentReaction(comment._id, "like")}
            className={`flex items-center gap-1 text-sm ${
              isLiked
                ? "text-red-600"
                : isDarkMode
                ? "text-gray-300 hover:text-red-400"
                : "text-gray-600 hover:text-red-600"
            } ${
              isCommentReacting === comment._id
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isCommentReacting === comment._id}
            aria-label={`Like comment (${comment.likes?.length || 0} likes)${
              isLiked ? " (You liked this)" : ""
            }`}
          >
            <span className="text-lg">👍</span>
            <span>({comment.likes?.length || 0})</span>
          </motion.button>
        )}
      </div>
      <p
        className={`mt-2 text-sm ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {comment.text}
      </p>
    </motion.div>
  );
};

export default Comment;
