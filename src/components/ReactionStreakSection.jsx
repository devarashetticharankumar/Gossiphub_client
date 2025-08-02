import { motion } from "framer-motion";
import { HiFire } from "react-icons/hi";

const ReactionStreakSection = ({ user, isDarkMode }) => {
  return (
    <motion.section
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } p-4 rounded-xl shadow-lg transition-colors duration-500`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3
        className={`text-lg font-bold ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        } mb-4 flex items-center`}
      >
        <HiFire className="h-6 w-6 text-orange-500 mr-2" />
        Your Reaction Streak
      </h3>
      <div className="text-center">
        <p className="text-4xl font-bold text-orange-600">
          {user?.reactionStreak || 0}
        </p>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Day{user?.reactionStreak !== 1 ? "s" : ""} Streak
        </p>
        <div
          className={`mt-4 w-full ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded-full h-2.5 transition-colors duration-500`}
        >
          <motion.div
            className="bg-orange-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((user?.reactionStreak || 0) * 10, 100)}%`,
            }}
            transition={{ duration: 1 }}
          />
        </div>
        <p
          className={`text-xs mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Next Milestone:{" "}
          {user?.reactionStreak ? Math.ceil(user.reactionStreak / 7) * 7 : 7}{" "}
          Days
        </p>
      </div>
      <div className="mt-4">
        <h4
          className={`text-sm font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          } mb-2`}
        >
          Achievements
        </h4>
        {user?.streakRewards?.length > 0 ? (
          <ul className="space-y-2">
            {user.streakRewards.map((reward, index) => (
              <motion.li
                key={index}
                className={`flex items-center text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="mr-2 text-2xl">
                  {reward.startsWith("Day ") ? "🔥" : "🎉"}
                </span>
                {reward}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No achievements yet. Keep reacting daily!
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default ReactionStreakSection;
