import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiUserAdd } from "react-icons/hi";

const SuggestedUsersSection = ({
  suggestedUsers,
  isDarkMode,
  followedUsers,
  handleFollow,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12 mb-8"
    >
      <h3
        className={`text-xl font-bold ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        } mb-4 flex items-center`}
      >
        <HiUserAdd className="h-6 w-6 text-blue-500 mr-2" />
        Suggested for You
      </h3>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((suggestedUser, index) => (
            <motion.div
              key={suggestedUser._id}
              className={`min-w-[150px] ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 relative transition-colors duration-500`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/profile/${suggestedUser._id}`}>
                <img
                  src={
                    suggestedUser.profilePicture ||
                    "https://avatar.iran.liara.run/public/40"
                  }
                  alt={`Profile: ${
                    suggestedUser.username || suggestedUser.email
                  }`}
                  className={`w-20 h-20 rounded-full object-cover border-2 ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                  loading="lazy"
                  onError={(e) =>
                    (e.target.src = "https://avatar.iran.liara.run/public/40")
                  }
                />
              </Link>
              <Link to={`/profile/${suggestedUser._id}`}>
                <p
                  className={`text-sm font-medium mt-3 text-center ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {suggestedUser.username && suggestedUser.username.trim()
                    ? suggestedUser.username
                    : suggestedUser.email}
                </p>
              </Link>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {suggestedUser.followersCount || 0} followers
              </p>
              <motion.button
                onClick={() => handleFollow(suggestedUser._id)}
                className={`mt-3 px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                  followedUsers.includes(suggestedUser._id)
                    ? isDarkMode
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-200 text-gray-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={
                  followedUsers.includes(suggestedUser._id)
                    ? `Unfollow ${
                        suggestedUser.username || suggestedUser.email
                      }`
                    : `Follow ${suggestedUser.username || suggestedUser.email}`
                }
              >
                {followedUsers.includes(suggestedUser._id)
                  ? "Following"
                  : "Follow"}
              </motion.button>
            </motion.div>
          ))
        ) : (
          <p
            className={`text-gray-600 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No suggestions available.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default SuggestedUsersSection;
