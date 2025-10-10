import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ReviewsSection = ({ reviewPosts, isDarkMode }) => {
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
        <span className="mr-2">📝</span> Film Reviews & Trailers
      </h2>
      {reviewPosts.length === 0 ? (
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
            No reviews available yet. Be the first to share your review!
          </p>
          <Link
            to="/create-post"
            className="mt-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Write a Review
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviewPosts.map((post, index) => (
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
                      className="w-full h-40 object-cover"
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
                      alt={`Review: ${post.title}`}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src =
                          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                      }
                    />
                  ))}
                <div className="p-4">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    } line-clamp-2`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`text-sm mt-2 line-clamp-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {post.description.split("\n\n").map((paragraph, pIdx) => (
                      <div
                        key={pIdx}
                        className="mb-4 last:mb-0"
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    ))}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default ReviewsSection;
