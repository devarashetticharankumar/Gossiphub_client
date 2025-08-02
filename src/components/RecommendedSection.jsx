import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RecommendedSection = ({ recommendedPosts, isDarkMode }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12"
    >
      <h3
        className={`text-xl font-bold ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        } mb-4`}
      >
        Recommended for You
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendedPosts.map((post, index) => (
          <motion.div
            key={post._id}
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } rounded-xl shadow-lg overflow-hidden transition-colors duration-500`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link to={`/posts/${post._id}`}>
              {post.media &&
                (post.media.endsWith(".mp4") ? (
                  <video
                    src={post.media}
                    className="w-full h-40 object-cover"
                    muted
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src =
                        "https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif")
                    }
                  />
                ) : (
                  <img
                    src={post.media}
                    alt={`Recommended: ${post.title}`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src =
                        "https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif")
                    }
                  />
                ))}
              <div className="p-4">
                <p
                  className={`text-sm font-medium line-clamp-2 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {post.title}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {post.category || "General"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default RecommendedSection;
