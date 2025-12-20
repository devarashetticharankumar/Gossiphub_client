import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiVideo,
  FiAlertTriangle,
  FiBarChart2,
  FiActivity,
  FiLogOut,
  FiSearch,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiMenu,
  FiFlag,
} from "react-icons/fi";
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
  getShorts,
  deleteShort,
} from "../utils/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalShorts: 0,
    flaggedPosts: 0,
  });
  const [posts, setPosts] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [postsPage, setPostsPage] = useState(1);
  const [shortsPage, setShortsPage] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [shortsTotal, setShortsTotal] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [userRes, analyticsRes, reportsRes] = await Promise.all([
        getUserProfile(),
        getAnalytics(),
        getReports(),
      ]);
      setUser(userRes);
      setStats(analyticsRes);
      setReports(reportsRes);

      // Initial Fetch for Tabs
      await fetchPosts(1);
      await fetchShorts(1);
      await fetchUsers();

    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (page) => {
    try {
      const res = await getPosts({ page, limit: 10 });
      setPosts(res.posts || []);
      setPostsTotal(res.totalPages || 1);
      setPostsPage(page);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const fetchShorts = async (page) => {
    try {
      // Assuming getShorts supports pagination in the response structure
      const res = await getShorts({ page, limit: 10 });
      setShorts(res.shorts || []);
      setShortsTotal(Math.ceil((res.total || res.shorts?.length || 0) / 10)); // Approximate if total missing
      setShortsPage(page);
    } catch (err) {
      console.error("Error fetching shorts:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handlePostAction = async (postId, action) => {
    try {
      await moderatePost(postId, { action });
      await fetchPosts(postsPage); // Refresh
      toast.success(`Post ${action}ed`);
    } catch (err) {
      toast.error(`Failed to ${action} post`);
    }
  };

  const handleDeleteShort = async (shortId) => {
    if (!window.confirm("Are you sure you want to delete this short?")) return;
    try {
      await deleteShort(shortId);
      await fetchShorts(shortsPage); // Refresh
      toast.success("Short deleted");
    } catch (err) {
      toast.error("Failed to delete short");
    }
  };

  const handleReportAction = async (reportId, status) => {
    try {
      await resolveReport(reportId, { status });
      const res = await getReports();
      setReports(res);
      toast.success(`Report marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update report");
    }
  };

  // Filter Logic
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, searchQuery]);

  const filteredShorts = useMemo(() => {
    if (!searchQuery) return shorts;
    return shorts.filter(s => s.caption?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [shorts, searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [users, searchQuery]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl transform md:relative md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              AdminPanel
            </h1>
          </div>

          {/* User Info */}
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div className="relative mx-auto w-20 h-20 mb-3">
              <img
                src={user?.profilePicture || "https://avatar.iran.liara.run/public/33"}
                className="w-full h-full rounded-full object-cover border-4 border-red-100 dark:border-red-900/30"
                alt="Admin"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">{user?.username || "Admin"}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            <NavItem icon={FiHome} label="Overview" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }} />
            <NavItem icon={FiFileText} label="Manage Posts" active={activeTab === "posts"} onClick={() => { setActiveTab("posts"); setIsSidebarOpen(false); }} />
            <NavItem icon={FiVideo} label="Manage Shorts" active={activeTab === "shorts"} onClick={() => { setActiveTab("shorts"); setIsSidebarOpen(false); }} />
            <NavItem icon={FiUsers} label="Users" active={activeTab === "users"} onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }} />
            <NavItem icon={FiAlertTriangle} label="Reports" active={activeTab === "reports"} count={reports.length} onClick={() => { setActiveTab("reports"); setIsSidebarOpen(false); }} />
            <NavItem icon={FiBarChart2} label="Analytics" active={activeTab === "analytics"} onClick={() => { setActiveTab("analytics"); setIsSidebarOpen(false); }} />
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 dark:text-white">
            <FiMenu size={24} />
          </button>
          <span className="font-bold text-gray-800 dark:text-white">Admin Panel</span>
          <div className="w-8"></div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {activeTab !== "overview" && activeTab !== "analytics" && (
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
              <div className="relative w-full md:w-96">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>
              <div className="text-sm text-gray-500">
                Showing {activeTab === "posts" ? filteredPosts.length : activeTab === "shorts" ? filteredShorts.length : activeTab === "users" ? filteredUsers.length : 0} items
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                <StatCard icon={FiFileText} label="Total Posts" value={stats.totalPosts} color="bg-orange-500" />
                <StatCard icon={FiVideo} label="Total Shorts" value={stats.totalShorts} color="bg-purple-500" />
                <StatCard icon={FiAlertTriangle} label="Flagged Posts" value={stats.flaggedPosts} color="bg-red-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Pending Reports</h3>
                  {reports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending reports.</p>
                  ) : (
                    <div className="space-y-4">
                      {reports.slice(0, 5).map(report => (
                        <div key={report._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">Reason: {report.reason}</p>
                            <p className="text-xs text-gray-500">Post ID: {report.post?._id || "Unknown"}</p>
                          </div>
                          <button onClick={() => setActiveTab("reports")} className="text-xs text-red-500 hover:text-red-700">Review</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab("users")} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-colors flex flex-col items-center gap-2">
                      <FiUsers size={24} /> <span>Manage Users</span>
                    </button>
                    <button onClick={() => setActiveTab("posts")} className="p-4 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-100 transition-colors flex flex-col items-center gap-2">
                      <FiFlag size={24} /> <span>Moderation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-4 font-medium">Post</th>
                      <th className="px-6 py-4 font-medium">Author</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredPosts.map(post => (
                      <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={post.media || "https://via.placeholder.com/48"} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt="" />
                            <div className="max-w-xs">
                              <p className="font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                              <p className="text-xs text-gray-500 truncate">{post.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                              {post.author?.profilePicture && <img src={post.author.profilePicture} className="w-full h-full object-cover" alt="" />}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{post.isAnonymous ? "Anonymous" : post.author?.username || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.isFlagged ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {post.isFlagged ? "Flagged" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => navigate(`/posts/${post.slug}`)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="View"><FiEye /></button>
                            <button onClick={() => handlePostAction(post._id, "flag")} className="p-2 text-gray-400 hover:text-yellow-500 transition-colors" title="Flag"><FiFlag /></button>
                            <button onClick={() => handlePostAction(post._id, "remove")} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-4">
                <button disabled={postsPage === 1} onClick={() => fetchPosts(postsPage - 1)} className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50">Previous</button>
                <span className="flex items-center text-sm">Page {postsPage} of {postsTotal}</span>
                <button disabled={postsPage >= postsTotal} onClick={() => fetchPosts(postsPage + 1)} className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}

          {activeTab === "shorts" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-4 font-medium">Short</th>
                      <th className="px-6 py-4 font-medium">Caption</th>
                      <th className="px-6 py-4 font-medium">Author</th>
                      <th className="px-6 py-4 font-medium">Metrics</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredShorts.map(short => (
                      <tr key={short._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-20 bg-gray-900 rounded-lg overflow-hidden relative">
                            <video src={short.mediaUrl} className="w-full h-full object-cover" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <FiVideo className="text-white opacity-80" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800 dark:text-white line-clamp-2 max-w-xs">{short.caption || "No caption"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">@{short.user?.username || "Unknown"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-gray-500">
                            <span>❤️ {short.likes?.length || 0}</span>
                            <span>👀 {short.views || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => navigate(`/shorts`)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="View"><FiEye /></button>
                            <button onClick={() => handleDeleteShort(short._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-4">
                <button disabled={shortsPage === 1} onClick={() => fetchShorts(shortsPage - 1)} className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50">Previous</button>
                <span className="flex items-center text-sm">Page {shortsPage} of {shortsTotal}</span>
                <button disabled={shortsPage >= shortsTotal} onClick={() => fetchShorts(shortsPage + 1)} className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Joined</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredUsers.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={u.profilePicture || "https://avatar.iran.liara.run/public/33"} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="" />
                            <span className="font-medium text-gray-900 dark:text-white">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => navigate(`/profile/${u._id}`)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><FiEye /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                <div key={report._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>
                    <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Reported for: {report.reason}</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-500 mb-1">Target Post ID:</p>
                    <p className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">{report.post?._id || "Deleted or Unknown"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReportAction(report._id, "resolved")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"><FiCheck /> Resolve</button>
                    <button onClick={() => handleReportAction(report._id, "dismissed")} className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"><FiX /> Dismiss</button>
                  </div>
                </div>
              ))}
              {reports.length === 0 && <p className="col-span-full text-center text-gray-500">No pending reports found.</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span>{label}</span>
    </div>
    {count > 0 && (
      <span className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
        {count}
      </span>
    )}
  </button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
