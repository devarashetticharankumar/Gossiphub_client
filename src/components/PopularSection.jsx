import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PopularSection = ({ popularPosts, isDarkMode }) => {
  return (
    <motion.section
      className={`${isDarkMode ? "bg-gray-500" : "bg-gray-200"} p-5 rounded-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-black"
        } flex items-center`}
      >
        <span className="mr-2">🔥</span> Popular
      </h2>
      {popularPosts.length === 0 ? (
        <div
          className={`${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } rounded-xl shadow-md p-6 text-center transition-colors duration-500`}
        >
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No popular posts available yet. Check back later!
          </p>
          <Link
            to="/create-post"
            className="mt-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Share a Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularPosts.map((post, index) => (
            <motion.div
              key={post._id}
              className={`border-4 border-${
                isDarkMode ? "gray-700" : "gray-300"
              } rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-102`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/posts/${post._id}`}>
                <div className="relative h-48">
                  {post.media &&
                    (post.media.endsWith(".mp4") ? (
                      <video
                        src={post.media}
                        className="w-full h-full object-cover"
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
                        alt={`Popular: ${post.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src =
                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                        }
                      />
                    ))}
                  {post.category && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
                      {post.category}
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <h3
                    className={`text-md font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
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

export default PopularSection;
