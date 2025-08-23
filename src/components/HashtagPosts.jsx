import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { getPostsByHashtag } from "../utils/api";

// Spinning Loader Component
const SpinningLoader = ({ isDarkMode }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div
      className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${
        isDarkMode ? "border-red-400" : "border-red-600"
      }`}
    ></div>
  </div>
);

const HashtagPosts = () => {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fetch posts by hashtag
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const decodedHashtag = decodeURIComponent(hashtag);
        const fetchedPosts = await getPostsByHashtag(decodedHashtag);
        setPosts(fetchedPosts || []);
      } catch (err) {
        toast.error("Failed to fetch posts for hashtag");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [hashtag]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // SEO metadata
  const pageTitle = `Posts tagged with #${decodeURIComponent(
    hashtag
  )} | GossipHub`;
  const pageDescription = `Explore posts tagged with #${decodeURIComponent(
    hashtag
  )} on GossipHub. Discover the latest gossip and stories!`;
  const pageUrl = `${window.location.origin}/posts/hashtag/${hashtag}`;
  const keywords = `${decodeURIComponent(
    hashtag
  )}, gossip, social media, entertainment, GossipHub`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: pageTitle,
    description: pageDescription,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "GossipHub",
      logo: {
        "@type": "ImageObject",
        url: "https://gossiphub.in/default-image.jpg",
        width: 1200,
        height: 400,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    keywords: keywords.split(", "),
  };

  if (loading) {
    return <SpinningLoader isDarkMode={isDarkMode} />;
  }

  return (
    <motion.div
      className={`min-h-screen font-inter ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-500`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="GossipHub" />
        <meta name="publisher" content="GossipHub" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GossipHub" />
        <meta
          property="og:image"
          content="https://gossiphub.in/default-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content="https://gossiphub.in/default-image.jpg"
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-red-md text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
            aria-label="Back to home"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-red-800 text-white hover:bg-red-700 transition-colors duration-200 rounded-3xl"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <motion.h1
          className={`text-2xl sm:text-3xl font-bold mb-6 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Tag Archives: {decodeURIComponent(hashtag)}
        </motion.h1>

        {posts.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No posts found for #{decodeURIComponent(hashtag)}.
          </motion.p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {currentPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-white"
                    } transition-colors duration-500 hover:scale-101 hover:shadow-md transform`}
                  >
                    <Link
                      to={`/posts/${post._id}`}
                      className="block"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      aria-label={`View post: ${post.title}`}
                    >
                      {post.media ? (
                        /\.(mp4|webm|ogg)$/i.test(post.media) ? (
                          <video
                            src={post.media}
                            className="w-full h-80 object-cover"
                            muted
                            loading="lazy"
                            onError={(e) =>
                              (e.target.src =
                                "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
                            }
                          />
                        ) : (
                          <img
                            src={post.media}
                            alt={post.title}
                            className="w-full h-80 object-cover"
                            loading="lazy"
                            onError={(e) =>
                              (e.target.src =
                                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                            }
                          />
                        )
                      ) : (
                        <div
                          className={`w-full h-48 flex items-center justify-center ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <p
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            No media
                          </p>
                        </div>
                      )}
                      <div className="p-4">
                        <h3
                          className={`text-lg font-semibold mb-2 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          } truncate`}
                        >
                          {post.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } mb-2 truncate`}
                        >
                          {post.description
                            ?.replace(/<[^>]+>/g, "")
                            .slice(0, 100)}
                          ...
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-xs font-medium px-3 py-1 ${
                              isDarkMode
                                ? "text-gray-300 bg-gray-700"
                                : "text-gray-700 bg-gray-200"
                            }`}
                          >
                            {post.category || "General"}
                          </span>
                          <div className="flex gap-2 text-sm">
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              👍 {post.likes?.length || 0}
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              💬 {post.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium ${
                  isDarkMode
                    ? currentPage === 1
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                    : currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                } transition-colors duration-200`}
                aria-label="Previous page"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-4 py-2 text-sm font-medium ${
                      currentPage === pageNumber
                        ? isDarkMode
                          ? "bg-red-500 text-white"
                          : "bg-red-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white"
                    } transition-colors duration-200`}
                    aria-label={`Go to page ${pageNumber}`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium ${
                  isDarkMode
                    ? currentPage === totalPages
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                    : currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                } transition-colors duration-200`}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <Link to="/about" className="text-sm hover:underline">
              About Us
            </Link>
            <Link to="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div>
          <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
        </div>
      </footer>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </motion.div>
  );
};

export default HashtagPosts;
