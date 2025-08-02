import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LatestStoriesSection = ({ latestStories, isDarkMode }) => {
  return (
    <motion.section
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } p-4 rounded-xl shadow-lg transition-colors duration-500`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h3
        className={`text-lg font-bold ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        } mb-4`}
      >
        Latest Stories
      </h3>
      <div className="space-y-4">
        {latestStories.length > 0 ? (
          latestStories.map((story) => (
            <motion.div
              key={story._id}
              className="flex gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/posts/${story._id}`} className="flex gap-3">
                {story.media &&
                  (story.media.endsWith(".mp4") ? (
                    <video
                      src={story.media}
                      className="w-16 h-16 object-cover rounded-lg"
                      muted
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src =
                          "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
                      }
                    />
                  ) : (
                    <img
                      src={story.media}
                      alt={`Story: ${story.title}`}
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src =
                          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                      }
                    />
                  ))}
                <div>
                  <p
                    className={`text-sm font-medium hover:text-red-600 transition-colors ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {story.title}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {story.category || "General"}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No recent stories available.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default LatestStoriesSection;
