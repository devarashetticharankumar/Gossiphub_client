import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const VideosSection = ({ videoPosts, isDarkMode }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3
        className={`text-xl font-bold ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        } mb-4`}
      >
        Videos
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {videoPosts.length > 0 ? (
          videoPosts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/posts/${post._id}`}>
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <video
                    src={post.media}
                    className="w-full h-32 object-cover"
                    muted
                    loop
                    autoPlay
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src =
                        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
                    }
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                    <p className="text-xs line-clamp-1">{post.title}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            No videos available.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default VideosSection;
