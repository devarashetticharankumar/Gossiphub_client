// import { motion } from "framer-motion";
// import { HiFire } from "react-icons/hi";

// const ReactionStreakSection = ({ user, isDarkMode }) => {
//   return (
//     <motion.section
//       className={`${
//         isDarkMode ? "bg-gray-900" : "bg-white"
//       } p-4 rounded-xl shadow-lg transition-colors duration-500`}
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h3
//         className={`text-lg font-bold ${
//           isDarkMode ? "text-gray-100" : "text-gray-900"
//         } mb-4 flex items-center`}
//       >
//         <HiFire className="h-6 w-6 text-orange-500 mr-2" />
//         Your Reaction Streak
//       </h3>
//       <div className="text-center">
//         <p className="text-4xl font-bold text-orange-600">
//           {user?.reactionStreak || 0}
//         </p>
//         <p
//           className={`text-sm ${
//             isDarkMode ? "text-gray-400" : "text-gray-600"
//           }`}
//         >
//           Day{user?.reactionStreak !== 1 ? "s" : ""} Streak
//         </p>
//         <div
//           className={`mt-4 w-full ${
//             isDarkMode ? "bg-gray-700" : "bg-gray-200"
//           } rounded-full h-2.5 transition-colors duration-500`}
//         >
//           <motion.div
//             className="bg-orange-500 h-2.5 rounded-full"
//             initial={{ width: 0 }}
//             animate={{
//               width: `${Math.min((user?.reactionStreak || 0) * 10, 100)}%`,
//             }}
//             transition={{ duration: 1 }}
//           />
//         </div>
//         <p
//           className={`text-xs mt-2 ${
//             isDarkMode ? "text-gray-400" : "text-gray-500"
//           }`}
//         >
//           Next Milestone:{" "}
//           {user?.reactionStreak ? Math.ceil(user.reactionStreak / 7) * 7 : 7}{" "}
//           Days
//         </p>
//       </div>
//       <div className="mt-4">
//         <h4
//           className={`text-sm font-semibold ${
//             isDarkMode ? "text-gray-100" : "text-gray-900"
//           } mb-2`}
//         >
//           Achievements
//         </h4>
//         {user?.streakRewards?.length > 0 ? (
//           <ul className="space-y-2">
//             {user.streakRewards.map((reward, index) => (
//               <motion.li
//                 key={index}
//                 className={`flex items-center text-sm ${
//                   isDarkMode ? "text-gray-300" : "text-gray-700"
//                 }`}
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <span className="mr-2 text-2xl">
//                   {reward.startsWith("Day ") ? "🔥" : "🎉"}
//                 </span>
//                 {reward}
//               </motion.li>
//             ))}
//           </ul>
//         ) : (
//           <p
//             className={`text-sm ${
//               isDarkMode ? "text-gray-400" : "text-gray-500"
//             }`}
//           >
//             No achievements yet. Keep reacting daily!
//           </p>
//         )}
//       </div>
//     </motion.section>
//   );
// };

// export default ReactionStreakSection;

import { motion } from "framer-motion";
import { HiFire } from "react-icons/hi";

const ReactionStreakSection = ({ user, isDarkMode, posts = [] }) => {
  // Calculate badges
  const totalLikes = posts.reduce(
    (sum, post) => sum + (post.likes?.length || 0),
    0
  );
  const badges = [
    {
      name: "New Gossip",
      description: "Posted 1 or more gossips",
      achieved: posts.length >= 1,
      icon: "🗣️",
    },
    {
      name: "Newbie",
      description: "Reached 100 points in Fun Meter",
      achieved: user?.badges?.includes("Newbie") || user?.funMeter >= 100,
      icon: "🌟",
    },
    {
      name: "Gossip Pro",
      description: "Reached 500 points in Fun Meter",
      achieved: user?.badges?.includes("Gossip Pro") || user?.funMeter >= 500,
      icon: "🏅",
    },
    {
      name: "Trendsetter",
      description: "Reached 1000 points in Fun Meter",
      achieved: user?.badges?.includes("Trendsetter") || user?.funMeter >= 1000,
      icon: "🎖️",
    },
    {
      name: "Popular Poster",
      description: "Received 10 or more likes",
      achieved: totalLikes >= 10,
      icon: "👍",
    },
    {
      name: "Veteran",
      description: "Account active for 1 year",
      achieved:
        user &&
        new Date(user.createdAt) <
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      icon: "🏆",
    },
    ...(user?.streakRewards || []).map((reward) => ({
      name: reward,
      description: reward.startsWith("Day ")
        ? `Achieved ${reward} for maintaining a daily streak`
        : `Reached ${reward} for a milestone streak`,
      achieved: true,
      icon: reward.startsWith("Day ") ? "🔥" : "🎉",
    })),
  ];

  // Calculate next Fun Meter milestone
  const funMeterMilestones = [100, 500, 1000, 1500];
  const nextMilestone =
    funMeterMilestones.find((milestone) => (user?.funMeter || 0) < milestone) ||
    funMeterMilestones[funMeterMilestones.length - 1];

  return (
    <motion.section
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } p-4 rounded-xl shadow-lg transition-colors duration-500`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Level and Fun Meter */}
      <div className="mb-6">
        <h3
          className={`text-lg font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          } mb-4 flex items-center`}
        >
          <span className="mr-2">🎮</span>
          Your Level & Fun Meter
        </h3>
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <p className="text-3xl font-bold text-red-600">
              Level {user?.level || 1}
            </p>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                isDarkMode
                  ? "bg-red-900/50 text-red-300"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user?.funMeter || 0} XP
            </span>
          </div>
          <div
            className={`mt-4 w-full ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } rounded-full h-2.5 transition-colors duration-500`}
          >
            <motion.div
              className="bg-red-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  ((user?.funMeter || 0) / nextMilestone) * 100,
                  100
                )}%`,
              }}
              transition={{ duration: 1 }}
            />
          </div>
          <p
            className={`text-xs mt-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Next Milestone: {nextMilestone} XP
          </p>
        </div>
      </div>

      {/* Reaction Streak */}
      <div className="mb-6">
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
      </div>

      {/* Achievements */}
      <div>
        <h4
          className={`text-lg font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          } mb-4`}
        >
          Achievements
        </h4>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.name}
                className={`p-3 rounded-lg ${
                  badge.achieved
                    ? isDarkMode
                      ? "bg-red-900/50"
                      : "bg-red-100"
                    : isDarkMode
                    ? "bg-gray-700/50 opacity-50"
                    : "bg-gray-200/50 opacity-50"
                } flex items-center gap-3 transition-colors duration-300`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                role="button"
                aria-label={`${badge.name} badge: ${badge.description}, ${
                  badge.achieved ? "achieved" : "not achieved"
                }`}
                tabIndex={0}
              >
                <span className="text-lg">{badge.icon}</span>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {badge.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No achievements yet. Keep engaging to earn badges!
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default ReactionStreakSection;
