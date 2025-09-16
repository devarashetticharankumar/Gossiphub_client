// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import {
//   getPosts,
//   moderatePost,
//   getReports,
//   resolveReport,
//   getAnalytics,
// } from "../utils/api";

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 15; // Number of posts per page

//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [postsRes, reportsRes, analyticsRes] = await Promise.all([
//           getPosts(),
//           getReports(),
//           getAnalytics(),
//         ]);
//         setPosts(postsRes);
//         setReports(reportsRes);
//         setAnalytics(analyticsRes);
//       } catch (err) {
//         toast.error(err.message || "Failed to fetch admin data");
//       }
//     };
//     fetchData();
//   }, []);

//   const handleModerate = async (postId, action) => {
//     try {
//       await moderatePost(postId, { action });
//       const res = await getPosts();
//       setPosts(res);
//       toast.success(`Post ${action}ed`);
//     } catch (err) {
//       toast.error(err.message || "Failed to moderate post");
//     }
//   };

//   const handleResolveReport = async (reportId, status) => {
//     try {
//       await resolveReport(reportId, { status });
//       const res = await getReports();
//       setReports(res);
//       toast.success(`Report ${status}`);
//     } catch (err) {
//       toast.error(err.message || "Failed to resolve report");
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(posts.length / postsPerPage);
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode
//           ? "bg-gray-950"
//           : "bg-gradient-to-br from-gray-100 to-blue-50"
//       } transition-colors duration-500 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <button
//             onClick={() => window.history.back()}
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to previous page"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </button>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
//             aria-label={
//               isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//             }
//           >
//             {isDarkMode ? (
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
//               </svg>
//             ) : (
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-7xl mx-auto px-4 pt-20 pb-12"
//       >
//         <h2
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center"
//         >
//           Admin Dashboard
//         </h2>

//         {/* Analytics Section */}
//         {analytics && (
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mb-12 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg transition-colors duration-500"
//           >
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
//               Analytics Overview
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//               <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg flex items-center space-x-4">
//                 <div className="text-blue-600 dark:text-blue-300">
//                   <svg
//                     className="w-8 h-8"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M10 8a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     Total Users
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {analytics.totalUsers}
//                   </p>
//                 </div>
//               </div>
//               <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg flex items-center space-x-4">
//                 <div className="text-green-600 dark:text-green-300">
//                   <svg
//                     className="w-8 h-8"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M2 10a8 8 0 018-8v2a6 6 0 00-6 6h2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     Total Posts
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {analytics.totalPosts}
//                   </p>
//                 </div>
//               </div>
//               <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg flex items-center space-x-4">
//                 <div className="text-red-600 dark:text-red-300">
//                   <svg
//                     className="w-8 h-8"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     Flagged Posts
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {analytics.flaggedPosts}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Posts Section */}
//         <h3
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6"
//         >
//           Manage Posts
//         </h3>
//         {posts.length === 0 ? (
//           <p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="text-gray-600 dark:text-gray-400 text-center"
//           >
//             No posts available
//           </p>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {currentPosts.map((post) => (
//                 <div
//                   key={post._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
//                 >
//                   <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
//                     {post.title}
//                   </h4>
//                   <p
//                     className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed line-clamp-3 overflow-hidden text-ellipsis break-words"
//                     dangerouslySetInnerHTML={{ __html: post.description }}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
//                     Status:{" "}
//                     <span
//                       className={
//                         post.isFlagged ? "text-red-500" : "text-green-500"
//                       }
//                     >
//                       {post.isFlagged ? "Flagged" : "Active"}
//                     </span>
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//                     Posted by:{" "}
//                     <span className="font-medium text-gray-700 dark:text-gray-300">
//                       {post.isAnonymous
//                         ? "Anonymous"
//                         : post.author?.username || "Unknown"}
//                     </span>
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleModerate(post._id, "flag")}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
//                         post.isFlagged
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-yellow-500 hover:bg-yellow-600"
//                       }`}
//                       disabled={post.isFlagged}
//                     >
//                       Flag
//                     </button>
//                     <button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleModerate(post._id, "remove")}
//                       className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
//                     >
//                       Remove
//                     </button>
//                     <button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleModerate(post._id, "restore")}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
//                         !post.isFlagged
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-green-500 hover:bg-green-600"
//                       }`}
//                       disabled={!post.isFlagged}
//                     >
//                       Restore
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination Controls */}
//             <div className="mt-8 flex justify-center items-center space-x-4">
//               <button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handlePreviousPage}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                   currentPage === 1
//                     ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
//                     : "bg-red-500 text-white hover:bg-red-600"
//                 }`}
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-700 dark:text-gray-300">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                   currentPage === totalPages
//                     ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
//                     : "bg-red-500 text-white hover:bg-red-600"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}

//         {/* Reports Section */}
//         <h3
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5, duration: 0.6 }}
//           className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-12 mb-6"
//         >
//           Manage Reports
//         </h3>
//         {reports.length === 0 ? (
//           <p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="text-gray-600 dark:text-gray-400 text-center"
//           >
//             No reports available
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {reports.map((report) => (
//               <div
//                 key={report._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
//               >
//                 <p className="text-gray-700 dark:text-gray-300 text-sm">
//                   <span className="font-medium">Post ID:</span> {report.post}
//                 </p>
//                 <p className="text-gray-700 dark:text-gray-300 text-sm">
//                   <span className="font-medium">Reason:</span> {report.reason}
//                 </p>
//                 <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
//                   <span className="font-medium">Status:</span>{" "}
//                   <span
//                     className={
//                       report.status === "pending"
//                         ? "text-yellow-500"
//                         : report.status === "resolved"
//                         ? "text-green-500"
//                         : "text-red-500"
//                     }
//                   >
//                     {report.status}
//                   </span>
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleResolveReport(report._id, "resolved")}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
//                       report.status !== "pending"
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-green-500 hover:bg-green-600"
//                     }`}
//                     disabled={report.status !== "pending"}
//                   >
//                     Resolve
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleResolveReport(report._id, "dismissed")}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
//                       report.status !== "pending"
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-red-500 hover:bg-red-600"
//                     }`}
//                     disabled={report.status !== "pending"}
//                   >
//                     Dismiss
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getPosts,
  moderatePost,
  getReports,
  resolveReport,
  getAnalytics,
  getNotifications,
  getUsers,
  getSponsoredAds,
  getUserProfile,
} from "../utils/api";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [sponsoredAds, setSponsoredAds] = useState([]);
  const [activeSection, setActiveSection] = useState("posts");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const postsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          postsRes,
          reportsRes,
          analyticsRes,
          notificationsRes,
          usersRes,
          adsRes,
          userRes,
        ] = await Promise.all([
          getPosts(),
          getReports(),
          getAnalytics(),
          getNotifications(),
          getUsers(),
          getSponsoredAds(),
          getUserProfile(),
        ]);
        setPosts(postsRes);
        setReports(reportsRes);
        setAnalytics(analyticsRes);
        setNotifications(notificationsRes);
        setUsers(usersRes);
        setSponsoredAds(adsRes);
        setUser(userRes);
      } catch (err) {
        toast.error(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleModerate = async (postId, action) => {
    try {
      await moderatePost(postId, { action });
      const res = await getPosts();
      setPosts(res);
      toast.success(`Post ${action}ed successfully`);
    } catch (err) {
      toast.error(err.message || "Failed to moderate post");
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await resolveReport(reportId, { status });
      const res = await getReports();
      setReports(res);
      toast.success(`Report ${status} successfully`);
    } catch (err) {
      toast.error(err.message || "Failed to resolve report");
    }
  };

  const getFilteredPosts = () => {
    return posts.filter((post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredUsers = () => {
    return users.filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  };

  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const filteredUsers = getFilteredUsers();

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
    toast.success("Logged out");
  };

  const toggleSidebar = () => {
    console.log("Toggling sidebar, new state:", !isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-row">
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar - Animated Slide */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">AdminPanel</h1>
          </div>
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => {
                setActiveSection("posts");
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Switching to Posts");
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeSection === "posts"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm13 2H5v8h8V7z"
                  clipRule="evenodd"
                />
              </svg>
              Posts
            </button>
            <button
              onClick={() => {
                setActiveSection("reports");
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Switching to Reports");
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeSection === "reports"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm10 0H6v12h8V4zM8 6a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              </svg>
              Reports
            </button>
            <button
              onClick={() => {
                setActiveSection("analytics");
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Switching to Analytics");
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeSection === "analytics"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Analytics
            </button>
            <button
              onClick={() => {
                setActiveSection("users");
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Switching to Users");
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeSection === "users"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Users
            </button>
            <button
              onClick={() => {
                setActiveSection("notifications");
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Switching to Notifications");
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeSection === "notifications"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.5l-1.5 1.5A1 1 0 002 13v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-.5-0.9L16 11.5V8a6 6 0 00-6-6zM4 8a4 4 0 018 0v3.5l-1-1V8a2 2 0 10-4 0v4.5l-1 1V8z" />
              </svg>
              Notifications
            </button>
            <button
              onClick={() => {
                setActiveSection("ads");
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Switching to Ads");
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeSection === "ads"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm10 10H6a1 1 0 01-1-1V7a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1z" />
              </svg>
              Ads
            </button>
          </nav>
          <div className="mt-6 space-y-2">
            <button className="w-full p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
              Upgrade to Pro
            </button>
            <button
              onClick={() => {
                handleLogout();
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                console.log("Logging out");
              }}
              className="w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => {
            console.log("Closing sidebar via overlay");
            setIsSidebarOpen(false);
          }}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 ml-0 w-0">
        {/* Profile Section */}
        {user && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center">
            <img
              src={user.profilePicture || "https://via.placeholder.com/40"}
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
              onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
            />
            <div>
              <h2 className="text-lg font-semibold">
                {user.username || user.email}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-auto flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="w-3xl p-2 rounded-lg border border-gray-300 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 bg-gray-200 rounded-lg ml-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M4 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 014 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button className="p-2 bg-gray-200 rounded-lg w-full md:w-auto mt-2 md:mt-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm1 0a7 7 0 1114 0 7 7 0 01-14 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {activeSection === "posts" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPosts.length === 0 ? (
              <p className="text-gray-500 text-center">No posts to display</p>
            ) : (
              currentPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-3 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={post.media || "https://via.placeholder.com/50"}
                      alt="Post Thumbnail"
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/50")
                      }
                    />
                    <h3 className="text-md font-semibold">{post.title}</h3>
                  </div>
                  <p
                    className="text-sm text-gray-600 mt-2 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Status: {post.isFlagged ? "Flagged" : "Active"}
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleModerate(post._id, "flag")}
                      className={`px-2 py-1 text-xs rounded ${
                        post.isFlagged
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      } w-full sm:w-auto`}
                      disabled={post.isFlagged}
                    >
                      Flag
                    </button>
                    <button
                      onClick={() => handleModerate(post._id, "remove")}
                      className="px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 rounded w-full sm:w-auto"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleModerate(post._id, "restore")}
                      className={`px-2 py-1 text-xs rounded ${
                        !post.isFlagged
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      } w-full sm:w-auto`}
                      disabled={!post.isFlagged}
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="col-span-full flex flex-col sm:flex-row justify-center items-center mt-4 gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 ${
                  currentPage === 1
                    ? "bg-gray-300"
                    : "bg-red-500 text-white hover:bg-red-600"
                } rounded w-full sm:w-auto`}
              >
                Previous
              </button>
              <span className="px-2 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-red-500 text-white hover:bg-red-600"
                } rounded w-full sm:w-auto`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeSection === "reports" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center">No reports to display</p>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white p-3 rounded-lg shadow-md"
                >
                  <p className="text-sm">Post ID: {report.post}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Reason: {report.reason}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Status: {report.status}
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() =>
                        handleResolveReport(report._id, "resolved")
                      }
                      className={`px-2 py-1 text-xs rounded ${
                        report.status !== "pending"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      } w-full sm:w-auto`}
                      disabled={report.status !== "pending"}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() =>
                        handleResolveReport(report._id, "dismissed")
                      }
                      className={`px-2 py-1 text-xs rounded ${
                        report.status !== "pending"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      } w-full sm:w-auto`}
                      disabled={report.status !== "pending"}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "analytics" && analytics && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <canvas id="activeUsersChart"></canvas>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <canvas id="totalPostsChart"></canvas>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <canvas id="flaggedPostsChart"></canvas>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-md font-semibold">Active Users Poll</h3>
                <p className="text-lg">{analytics.totalUsers}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-md font-semibold">Total Posts Poll</h3>
                <p className="text-lg">{analytics.totalPosts}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-md font-semibold">Flagged Posts Poll</h3>
                <p className="text-lg">{analytics.flaggedPosts}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "users" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center">No users to display</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white p-3 rounded-lg shadow-md mb-4 flex items-center border border-gray-400 hover:bg-red-50 transition-colors duration-200"
                >
                  <img
                    src={
                      user.profilePicture || "https://via.placeholder.com/40"
                    }
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/40")
                    }
                  />
                  <div>
                    <h2 className="text-md font-semibold text-black">
                      {user.username || user.email}
                    </h2>
                    <p className="text-sm text-red-600">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center">
                No notifications to display
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <p className="text-sm">Message: {notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Date: {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "ads" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsoredAds.length === 0 ? (
              <p className="text-gray-500 text-center">No ads to display</p>
            ) : (
              sponsoredAds.map((ad) => (
                <div key={ad._id} className="bg-white p-3 rounded-lg shadow-md">
                  <p className="text-sm">Title: {ad.title}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    Content: {ad.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Sponsor: {ad.sponsor}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
