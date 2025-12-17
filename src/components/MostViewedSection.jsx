import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MostViewedSection = ({ mostViewedPosts, isDarkMode }) => {
  return (
    <motion.section
      className={`${isDarkMode ? "bg-gray-900" : "bg-white"
        } p-4 rounded-xl shadow-lg transition-colors duration-500`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3
        className={`text-lg font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"
          } mb-4`}
      >
        Most Viewed
      </h3>
      <div className="space-y-4">
        {mostViewedPosts.map((post) => (
          <motion.div
            key={post._id}
            className="flex gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {post.media &&
              (post.media.endsWith(".mp4") ? (
                <video
                  src={post.media}
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
                  src={post.media}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) =>
                  (e.target.src =
                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                  }
                />
              ))}
            <div>
              <Link
                to={`/posts/${post.slug || post._id}`}
                className={`text-sm font-medium hover:text-red-600 transition-colors ${isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
              >
                {post.title}
              </Link>
              <p
                className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {post.category || "General"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default MostViewedSection;
