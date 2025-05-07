import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getPosts,
  moderatePost,
  getReports,
  resolveReport,
  getAnalytics,
} from "../utils/api";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15; // Number of posts per page

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, reportsRes, analyticsRes] = await Promise.all([
          getPosts(),
          getReports(),
          getAnalytics(),
        ]);
        setPosts(postsRes);
        setReports(reportsRes);
        setAnalytics(analyticsRes);
      } catch (err) {
        toast.error(err.message || "Failed to fetch admin data");
      }
    };
    fetchData();
  }, []);

  const handleModerate = async (postId, action) => {
    try {
      await moderatePost(postId, { action });
      const res = await getPosts();
      setPosts(res);
      toast.success(`Post ${action}ed`);
    } catch (err) {
      toast.error(err.message || "Failed to moderate post");
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await resolveReport(reportId, { status });
      const res = await getReports();
      setReports(res);
      toast.success(`Report ${status}`);
    } catch (err) {
      toast.error(err.message || "Failed to resolve report");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Pagination logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-950"
          : "bg-gradient-to-br from-gray-100 to-blue-50"
      } transition-colors duration-500 font-poppins`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Back to previous page"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
            </svg>
            Back
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 pt-20 pb-12"
      >
        <h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center"
        >
          Admin Dashboard
        </h2>

        {/* Analytics Section */}
        {analytics && (
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg transition-colors duration-500"
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Analytics Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg flex items-center space-x-4">
                <div className="text-blue-600 dark:text-blue-300">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analytics.totalUsers}
                  </p>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg flex items-center space-x-4">
                <div className="text-green-600 dark:text-green-300">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10a8 8 0 018-8v2a6 6 0 00-6 6h2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analytics.totalPosts}
                  </p>
                </div>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg flex items-center space-x-4">
                <div className="text-red-600 dark:text-red-300">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Flagged Posts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analytics.flaggedPosts}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Section */}
        <h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6"
        >
          Manage Posts
        </h3>
        {posts.length === 0 ? (
          <p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-center"
          >
            No posts available
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                    {post.title}
                  </h4>
                  <p
                    className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed line-clamp-3 overflow-hidden text-ellipsis break-words"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Status:{" "}
                    <span
                      className={
                        post.isFlagged ? "text-red-500" : "text-green-500"
                      }
                    >
                      {post.isFlagged ? "Flagged" : "Active"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Posted by:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {post.isAnonymous
                        ? "Anonymous"
                        : post.author?.username || "Unknown"}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModerate(post._id, "flag")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
                        post.isFlagged
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                      disabled={post.isFlagged}
                    >
                      Flag
                    </button>
                    <button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModerate(post._id, "remove")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                    >
                      Remove
                    </button>
                    <button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModerate(post._id, "restore")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
                        !post.isFlagged
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      disabled={!post.isFlagged}
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Reports Section */}
        <h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-12 mb-6"
        >
          Manage Reports
        </h3>
        {reports.length === 0 ? (
          <p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-center"
          >
            No reports available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <span className="font-medium">Post ID:</span> {report.post}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <span className="font-medium">Reason:</span> {report.reason}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      report.status === "pending"
                        ? "text-yellow-500"
                        : report.status === "resolved"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {report.status}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResolveReport(report._id, "resolved")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
                      report.status !== "pending"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={report.status !== "pending"}
                  >
                    Resolve
                  </button>
                  <button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResolveReport(report._id, "dismissed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
                      report.status !== "pending"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={report.status !== "pending"}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
