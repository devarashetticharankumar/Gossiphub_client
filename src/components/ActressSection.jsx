import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ActressSection = ({ actressPosts, isDarkMode }) => {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2
        className={`text-xl font-bold mb-3 ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        } flex items-center`}
      >
        <span className="mr-2"></span> Actress
      </h2>
      {actressPosts.length === 0 ? (
        <div
          className={`${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } rounded-xl shadow-md p-4 text-center transition-colors duration-500`}
        >
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No Actress posts available yet. Be the first to share your Actress
            gossip!
          </p>
          <Link
            to="/create-post"
            className="mt-3 inline-block px-4 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300 text-sm"
          >
            Post Actress Gossip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {actressPosts.map((post, index) => (
            <motion.div
              key={post._id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg overflow-hidden transition-colors duration-500`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/posts/${post._id}`}>
                {post.media &&
                  (post.media.endsWith(".mp4") ? (
                    <video
                      src={post.media}
                      className="w-full h-22 object-cover"
                      muted
                      autoPlay
                      loop
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src =
                          "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
                      }
                    />
                  ) : (
                    <img
                      src={post.media}
                      alt={`Actress: ${post.title}`}
                      className="w-full h-20 object-cover"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src =
                          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                      }
                    />
                  ))}
                <div className="p-3">
                  <h3
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    } line-clamp-2`}
                  >
                    {post.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default ActressSection;
