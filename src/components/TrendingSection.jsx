import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiFire } from "react-icons/hi";

const TrendingSection = ({ trends, isDarkMode }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h3
        className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"
          } mb-4 flex items-center`}
      >
        <HiFire className="h-6 w-6 text-orange-500 mr-2" />
        Trending Now
      </h3>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {trends.map((trend, index) => (
          <motion.div
            key={trend._id}
            className={`min-w-[200px] ${isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg overflow-hidden transition-colors duration-500`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={`/posts/${trend._id}`}>
              {trend.media &&
                (trend.media.endsWith(".mp4") ? (
                  <video
                    src={trend.media}
                    className="w-full h-32 object-cover"
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
                    src={trend.media}
                    alt={`Trending: ${trend.title}`}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                    onError={(e) =>
                    (e.target.src =
                      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                    }
                  />
                ))}
              <div className="p-3">
                <p
                  className={`text-sm font-medium ${isDarkMode ? "text-gray-100" : "text-gray-900"
                    } line-clamp-2`}
                >
                  {trend.title}
                </p>
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    } mt-1`}
                >
                  {trend.category || "General"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TrendingSection;
