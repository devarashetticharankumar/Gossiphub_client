// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import {
//   getPosts,
//   getUserProfile,
//   updateUserProfile,
//   deletePost,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     bio: "",
//     profilePicture: null,
//   });
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [postToDelete, setPostToDelete] = useState(null);
//   // State for followers and following
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Fetch user profile, posts, followers, and following
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [userRes, postsRes] = await Promise.all([
//           getUserProfile(),
//           getPosts(),
//         ]);
//         setUser(userRes);
//         setPosts(postsRes.filter((p) => p.author._id === userRes._id));
//         setFormData({
//           username: userRes.username || "",
//           bio: userRes.bio || "",
//           profilePicture: null,
//         });

//         // Fetch followers and following using api.js functions
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userRes._id),
//           getFollowing(userRes._id),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);
//       } catch (err) {
//         toast.error(
//           err.message || "Failed to load profile, posts, or followers"
//         );
//         if (err.message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   // Handle file preview
//   useEffect(() => {
//     if (formData.profilePicture) {
//       const url = URL.createObjectURL(formData.profilePicture);
//       setPreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setPreview(null);
//     }
//   }, [formData.profilePicture]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       data.append("username", formData.username);
//       data.append("bio", formData.bio);
//       if (formData.profilePicture) {
//         data.append("profilePicture", formData.profilePicture);
//       }
//       const updatedUser = await updateUserProfile(data);
//       setUser(updatedUser);
//       setFormData({
//         username: updatedUser.username || "",
//         bio: updatedUser.bio || "",
//         profilePicture: null,
//       });
//       setIsEditing(false);
//       toast.success("Profile updated successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to update profile");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//     toast.success("Logged out");
//   };

//   // Handle post deletion
//   const handleDeletePost = async (postId) => {
//     try {
//       await deletePost(postId);
//       setPosts(posts.filter((post) => post._id !== postId));
//       toast.success("Post deleted successfully");
//       setShowDeleteModal(false);
//       setPostToDelete(null);
//     } catch (err) {
//       toast.error(err.message || "Failed to delete post");
//     }
//   };

//   const openDeleteModal = (post) => {
//     setPostToDelete(post);
//     setShowDeleteModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setPostToDelete(null);
//   };

//   // Handle follow user
//   const handleFollow = async (userId) => {
//     try {
//       await followUser(userId);
//       // Refresh followers and following
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(user._id),
//         getFollowing(user._id),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       // Update user counts
//       const userRes = await getUserProfile();
//       setUser(userRes);
//       toast.success("User followed successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to follow user");
//     }
//   };

//   // Handle unfollow user
//   const handleUnfollow = async (userId) => {
//     try {
//       await unfollowUser(userId);
//       // Refresh followers and following
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(user._id),
//         getFollowing(user._id),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       // Update user counts
//       const userRes = await getUserProfile();
//       setUser(userRes);
//       toast.success("User unfollowed successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to unfollow user");
//     }
//   };

//   // Calculate badges
//   const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
//   const badges = [
//     {
//       name: "New Gossip",
//       description: "Posted 1 or more gossips",
//       achieved: posts.length >= 1,
//       icon: "🗣️",
//     },
//     {
//       name: "Fun Master",
//       description: "Fun Meter reached 50 or more",
//       achieved: user?.funMeter >= 10,
//       icon: "😄",
//     },
//     {
//       name: "Popular Poster",
//       description: "Received 10 or more likes",
//       achieved: totalLikes >= 10,
//       icon: "👍",
//     },
//     {
//       name: "Veteran",
//       description: "Account active for 1 year",
//       achieved:
//         user &&
//         new Date(user.createdAt) < new Date(Date.now() - 365 * 24 * 600),
//       icon: "🏆",
//     },
//     // Add streak rewards (daily streak and weekly milestones)
//     ...(user?.streakRewards || []).map((reward) => ({
//       name: reward,
//       description: reward.startsWith("Day ")
//         ? `Achieved ${reward} for maintaining a daily streak`
//         : `Reached ${reward} for a 7-day streak`,
//       achieved: true,
//       icon: reward.startsWith("Day ") ? "🔥" : "🎉",
//     })),
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-950">
//         <div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="text-2xl font-medium text-red-600 dark:text-teal-400"
//         >
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-950" : "bg-white"
//       } transition-colors duration-500 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
//             aria-label="Back to home"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </Link>
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
//       </div>

//       <div className="max-w-3xl mx-auto">
//         {/* Profile Section */}
//         <div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User profile"
//         >
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//             <div className="relative">
//               <img
//                 src={
//                   preview ||
//                   (user?.profilePicture
//                     ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${
//                         user.profilePicture
//                       }`
//                     : "https://via.placeholder.com/150")
//                 }
//                 alt="Profile picture"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 dark:border-teal-500"
//               />
//               {/* Streak Badge on Profile Picture */}
//               <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
//                 <HiFire className="h-4 w-4 text-white mr-1" />
//                 <span className="text-xs font-medium text-white">
//                   {user?.streak || 0}
//                 </span>
//               </div>
//             </div>
//             <div className="text-center sm:text-left">
//               <div className="flex items-center justify-center sm:justify-start gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-teal-300">
//                   {user?.username || user?.email}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFollowers(true)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
//                     aria-label="View followers"
//                   >
//                     {user?.followersCount || 0} Followers
//                   </button>
//                   <button
//                     onClick={() => setShowFollowing(true)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
//                     aria-label="View following"
//                   >
//                     {user?.followingCount || 0} Following
//                   </button>
//                 </div>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">
//                 {user?.bio || "No bio yet."}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Joined:{" "}
//                 {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Fun Meter: {user?.funMeter || 0}
//               </p>
//               <button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="mt-4 bg-indigo-500 dark:bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors mr-2"
//                 aria-label={isEditing ? "Cancel edit profile" : "Edit profile"}
//               >
//                 {isEditing ? "Cancel" : "Edit Profile"}
//               </button>
//               <button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
//                 aria-label="Logout"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Edit Profile Form */}
//           <AnimatePresence>
//             {isEditing && (
//               <form
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 onSubmit={handleEditSubmit}
//                 className="mt-6"
//               >
//                 <div className="mb-4">
//                   <label
//                     htmlFor="username"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     minLength={3}
//                     maxLength={20}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
//                     aria-label="Username input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="bio"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     maxLength={200}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100"
//                     aria-label="Bio input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="profilePicture"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Profile Picture
//                   </label>
//                   <input
//                     type="file"
//                     id="profilePicture"
//                     name="profilePicture"
//                     accept="image/jpeg,image/png"
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
//                     aria-label="Profile picture upload"
//                   />
//                 </div>
//                 <button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="submit"
//                   className="bg-indigo-500 dark:bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors"
//                   aria-label="Save profile changes"
//                 >
//                   Save Changes
//                 </button>
//               </form>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Followers Modal */}
//         <AnimatePresence>
//           {showFollowers && (
//             <div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Followers list modal"
//             >
//               <div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p className="text-gray-700 dark:text-gray-200">
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               follower.profilePicture
//                                 ? `${import.meta.env.VITE_API_URL.replace(
//                                     "/api",
//                                     ""
//                                   )}${follower.profilePicture}`
//                                 : "https://via.placeholder.com/50"
//                             }
//                             alt={`${follower.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                           />
//                           <p className="text-gray-900 dark:text-gray-100">
//                             {follower.username}
//                           </p>
//                         </div>
//                         {follower._id !== user?._id &&
//                           !following.some((f) => f._id === follower._id) && (
//                             <button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleFollow(follower._id)}
//                               className="bg-indigo-500 dark:bg-teal-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors text-sm"
//                               aria-label={`Follow ${follower.username}`}
//                             >
//                               Follow
//                             </button>
//                           )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowers(false)}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Close followers modal"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* Following Modal */}
//         <AnimatePresence>
//           {showFollowing && (
//             <div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Following list modal"
//             >
//               <div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p className="text-gray-700 dark:text-gray-200">
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               followedUser.profilePicture
//                                 ? `${import.meta.env.VITE_API_URL.replace(
//                                     "/api",
//                                     ""
//                                   )}${followedUser.profilePicture}`
//                                 : "https://via.placeholder.com/50"
//                             }
//                             alt={`${followedUser.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                           />
//                           <p className="text-gray-900 dark:text-gray-100">
//                             {followedUser.username}
//                           </p>
//                         </div>
//                         {followedUser._id !== user?._id && (
//                           <button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleUnfollow(followedUser._id)}
//                             className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
//                             aria-label={`Unfollow ${followedUser.username}`}
//                           >
//                             Unfollow
//                           </button>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowing(false)}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Close following modal"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* Achievements/Badges Section */}
//         <div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User achievements"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Achievements
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {badges.map((badge) => (
//               <div
//                 key={badge.name}
//                 whileHover={{ scale: 1.05 }}
//                 className={`p-4 rounded-xl ${
//                   badge.achieved
//                     ? "bg-indigo-100 dark:bg-teal-900"
//                     : "bg-gray-100 dark:bg-gray-800 opacity-50"
//                 } flex items-center gap-4`}
//                 role="button"
//                 aria-label={`${badge.name} badge: ${badge.description}, ${
//                   badge.achieved ? "achieved" : "not achieved"
//                 }`}
//                 tabIndex={0}
//               >
//                 <span className="text-2xl">{badge.icon}</span>
//                 <div>
//                   <p className="font-semibold text-indigo-900 dark:text-teal-300">
//                     {badge.name}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {badge.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Posts History Section (Grid Style with Title and Gradient) */}
//         <div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg"
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Your Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center text-gray-500 dark:text-gray-400"
//               >
//                 No posts yet. Share your first gossip!
//               </p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {posts.map((post) => (
//                   <div
//                     key={post._id}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative aspect-square rounded-lg overflow-hidden group"
//                   >
//                     <Link
//                       to={`/posts/${post._id}`}
//                       className="block w-full h-full"
//                     >
//                       {post.media ? (
//                         post.media.endsWith(".mp4") ? (
//                           <video
//                             src={`${import.meta.env.VITE_API_URL.replace(
//                               "/api",
//                               ""
//                             )}${post.media}`}
//                             className="w-full h-full object-cover"
//                             muted
//                             aria-label="Post video thumbnail"
//                           />
//                         ) : (
//                           <img
//                             src={`${import.meta.env.VITE_API_URL.replace(
//                               "/api",
//                               ""
//                             )}${post.media}`}
//                             alt="Post media"
//                             className="w-full h-full object-cover"
//                           />
//                         )
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                           <span className="text-sm text-center p-2">
//                             {post.title}
//                           </span>
//                         </div>
//                       )}
//                       {/* Black Gradient Overlay at Bottom */}
//                       <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
//                       {/* Post Title */}
//                       <div className="absolute bottom-0 left-0 right-0 p-3">
//                         <p className="text-white text-sm font-semibold line-clamp-2">
//                           {post.title}
//                         </p>
//                       </div>
//                       {/* Hover overlay for engagement metrics */}
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="text-white text-sm flex gap-4">
//                           <span>👍 {post.likes.length}</span>
//                           <span>👎 {post.downvotes.length}</span>
//                           <button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={(e) => {
//                               e.preventDefault();
//                               openDeleteModal(post);
//                             }}
//                             className="text-red-500 hover:text-red-400"
//                             aria-label={`Delete post ${post.title}`}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Delete Confirmation Modal */}
//         <AnimatePresence>
//           {showDeleteModal && (
//             <div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Delete confirmation modal"
//             >
//               <div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Are you sure you want to delete this post?
//                 </h3>
//                 <p className="text-gray-700 dark:text-gray-200 mb-6">
//                   "{postToDelete?.title}" will be permanently deleted.
//                 </p>
//                 <div className="flex justify-end gap-3">
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={closeDeleteModal}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Cancel deletion"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleDeletePost(postToDelete._id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
//                     aria-label="Confirm deletion"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import {
//   getPosts,
//   getUserProfile,
//   updateUserProfile,
//   deletePost,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     bio: "",
//     profilePicture: null,
//   });
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [postToDelete, setPostToDelete] = useState(null);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Fetch user profile, posts, followers, and following
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [userRes, postsRes] = await Promise.all([
//           getUserProfile(),
//           getPosts(),
//         ]);
//         setUser(userRes);
//         setPosts(postsRes.filter((p) => p.author._id === userRes._id));
//         setFormData({
//           username: userRes.username || "",
//           bio: userRes.bio || "",
//           profilePicture: null,
//         });

//         // Fetch followers and following
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userRes._id),
//           getFollowing(userRes._id),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);
//       } catch (err) {
//         toast.error(
//           err.message || "Failed to load profile, posts, or followers"
//         );
//         if (err.message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   // Handle file preview
//   useEffect(() => {
//     if (formData.profilePicture) {
//       const url = URL.createObjectURL(formData.profilePicture);
//       setPreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setPreview(null);
//     }
//   }, [formData.profilePicture]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "profilePicture" && files && files[0]) {
//       const file = files[0];
//       // Validate file type
//       const validTypes = ["image/jpeg", "image/png"];
//       if (!validTypes.includes(file.type)) {
//         toast.error("Please upload a JPEG or PNG image");
//         e.target.value = null;
//         setFormData((prev) => ({ ...prev, profilePicture: null }));
//         return;
//       }
//       // Validate file size (5MB limit)
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (file.size > maxSize) {
//         toast.error("File size exceeds 5MB. Please upload a smaller image.");
//         e.target.value = null;
//         setFormData((prev) => ({ ...prev, profilePicture: null }));
//         return;
//       }
//       setFormData((prev) => ({ ...prev, profilePicture: file }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const clearProfilePicture = () => {
//     setFormData((prev) => ({ ...prev, profilePicture: null }));
//     document.getElementById("profilePicture").value = null;
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Validate form data
//       if (!formData.username.trim()) {
//         toast.error("Username cannot be empty");
//         return;
//       }
//       if (formData.username.length < 3 || formData.username.length > 20) {
//         toast.error("Username must be between 3 and 20 characters");
//         return;
//       }

//       const data = new FormData();
//       data.append("username", formData.username);
//       data.append("bio", formData.bio);
//       if (formData.profilePicture) {
//         data.append("profilePicture", formData.profilePicture);
//       }
//       const updatedUser = await updateUserProfile(data);
//       setUser(updatedUser);
//       setFormData({
//         username: updatedUser.username || "",
//         bio: updatedUser.bio || "",
//         profilePicture: null,
//       });
//       setIsEditing(false);
//       toast.success("Profile updated successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to update profile");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//     toast.success("Logged out");
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       await deletePost(postId);
//       setPosts(posts.filter((post) => post._id !== postId));
//       toast.success("Post deleted successfully");
//       setShowDeleteModal(false);
//       setPostToDelete(null);
//     } catch (err) {
//       toast.error(err.message || "Failed to delete post");
//     }
//   };

//   const openDeleteModal = (post) => {
//     setPostToDelete(post);
//     setShowDeleteModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setPostToDelete(null);
//   };

//   const handleFollow = async (userId) => {
//     try {
//       await followUser(userId);
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(user._id),
//         getFollowing(user._id),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const userRes = await getUserProfile();
//       setUser(userRes);
//       toast.success("User followed successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to follow user");
//     }
//   };

//   const handleUnfollow = async (userId) => {
//     try {
//       await unfollowUser(userId);
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(user._id),
//         getFollowing(user._id),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const userRes = await getUserProfile();
//       setUser(userRes);
//       toast.success("User unfollowed successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to unfollow user");
//     }
//   };

//   // Calculate badges
//   const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
//   const badges = [
//     {
//       name: "New Gossip",
//       description: "Posted 1 or more gossips",
//       achieved: posts.length >= 1,
//       icon: "🗣️",
//     },
//     {
//       name: "Fun Master",
//       description: "Fun Meter reached 50 or more",
//       achieved: user?.funMeter >= 10,
//       icon: "😄",
//     },
//     {
//       name: "Popular Poster",
//       description: "Received 10 or more likes",
//       achieved: totalLikes >= 10,
//       icon: "👍",
//     },
//     {
//       name: "Veteran",
//       description: "Account active for 1 year",
//       achieved:
//         user &&
//         new Date(user.createdAt) <
//           new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
//       icon: "🏆",
//     },
//     ...(user?.streakRewards || []).map((reward) => ({
//       name: reward,
//       description: reward.startsWith("Day ")
//         ? `Achieved ${reward} for maintaining a daily streak`
//         : `Reached ${reward} for a 7-day streak`,
//       achieved: true,
//       icon: reward.startsWith("Day ") ? "🔥" : "🎉",
//     })),
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-950">
//         <motion.div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="text-2xl font-medium text-red-600 dark:text-teal-400"
//         >
//           Loading...
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-950" : "bg-white"
//       } transition-colors duration-500 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
//             aria-label="Back to home"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </Link>
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
//       </div>

//       <div className="max-w-3xl mx-auto">
//         {/* Profile Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User profile"
//         >
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//             <div className="relative">
//               <img
//                 src={
//                   preview ||
//                   (user?.profilePicture
//                     ? user.profilePicture
//                     : "https://via.placeholder.com/150")
//                 }
//                 alt="Profile picture"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 dark:border-teal-500"
//                 onError={(e) =>
//                   (e.target.src = "https://via.placeholder.com/150")
//                 }
//               />
//               <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
//                 <HiFire className="h-4 w-4 text-white mr-1" />
//                 <span className="text-xs font-medium text-white">
//                   {user?.streak || 0}
//                 </span>
//               </div>
//             </div>
//             <div className="text-center sm:text-left">
//               <div className="flex items-center justify-center sm:justify-start gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-teal-300">
//                   {user?.username || user?.email}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFollowers(true)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
//                     aria-label="View followers"
//                   >
//                     {user?.followersCount || 0} Followers
//                   </button>
//                   <button
//                     onClick={() => setShowFollowing(true)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
//                     aria-label="View following"
//                   >
//                     {user?.followingCount || 0} Following
//                   </button>
//                 </div>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">
//                 {user?.bio || "No bio yet."}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Joined:{" "}
//                 {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Fun Meter: {user?.funMeter || 0}
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="mt-4 bg-indigo-500 dark:bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors mr-2"
//                 aria-label={isEditing ? "Cancel edit profile" : "Edit profile"}
//               >
//                 {isEditing ? "Cancel" : "Edit Profile"}
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
//                 aria-label="Logout"
//               >
//                 Logout
//               </motion.button>
//             </div>
//           </div>

//           {/* Edit Profile Form */}
//           <AnimatePresence>
//             {isEditing && (
//               <motion.form
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 onSubmit={handleEditSubmit}
//                 className="mt-6"
//               >
//                 <div className="mb-4">
//                   <label
//                     htmlFor="username"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     minLength={3}
//                     maxLength={20}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
//                     aria-label="Username input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="bio"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     maxLength={200}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100"
//                     aria-label="Bio input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="profilePicture"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Profile Picture
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="file"
//                       id="profilePicture"
//                       name="profilePicture"
//                       accept="image/jpeg,image/png"
//                       onChange={handleInputChange}
//                       className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
//                       aria-label="Profile picture upload"
//                     />
//                   </div>
//                   {preview && (
//                     <div className="mt-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Preview:
//                         </p>
//                         <button
//                           type="button"
//                           onClick={clearProfilePicture}
//                           className="text-sm text-red-600 dark:text-red-400 hover:underline"
//                           aria-label="Clear profile picture"
//                         >
//                           Clear
//                         </button>
//                       </div>
//                       <img
//                         src={preview}
//                         alt="Profile picture preview"
//                         className="max-w-xs rounded-lg shadow-sm"
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="submit"
//                   className="bg-indigo-500 dark:bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors"
//                   aria-label="Save profile changes"
//                 >
//                   Save Changes
//                 </motion.button>
//               </motion.form>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Followers Modal */}
//         <AnimatePresence>
//           {showFollowers && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Followers list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p className="text-gray-700 dark:text-gray-200">
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               follower.profilePicture ||
//                               "https://via.placeholder.com/50"
//                             }
//                             alt={`${follower.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                           <p className="text-gray-900 dark:text-gray-100">
//                             {follower.username}
//                           </p>
//                         </div>
//                         {follower._id !== user?._id &&
//                           !following.some((f) => f._id === follower._id) && (
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleFollow(follower._id)}
//                               className="bg-indigo-500 dark:bg-teal-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors text-sm"
//                               aria-label={`Follow ${follower.username}`}
//                             >
//                               Follow
//                             </motion.button>
//                           )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowers(false)}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Close followers modal"
//                   >
//                     Close
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Following Modal */}
//         <AnimatePresence>
//           {showFollowing && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Following list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p className="text-gray-700 dark:text-gray-200">
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               followedUser.profilePicture ||
//                               "https://via.placeholder.com/50"
//                             }
//                             alt={`${followedUser.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                           <p className="text-gray-900 dark:text-gray-100">
//                             {followedUser.username}
//                           </p>
//                         </div>
//                         {followedUser._id !== user?._id && (
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleUnfollow(followedUser._id)}
//                             className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
//                             aria-label={`Unfollow ${followedUser.username}`}
//                           >
//                             Unfollow
//                           </motion.button>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowing(false)}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Close following modal"
//                   >
//                     Close
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Achievements/Badges Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User achievements"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Achievements
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {badges.map((badge) => (
//               <motion.div
//                 key={badge.name}
//                 whileHover={{ scale: 1.05 }}
//                 className={`p-4 rounded-xl ${
//                   badge.achieved
//                     ? "bg-indigo-100 dark:bg-teal-900"
//                     : "bg-gray-100 dark:bg-gray-800 opacity-50"
//                 } flex items-center gap-4`}
//                 role="button"
//                 aria-label={`${badge.name} badge: ${badge.description}, ${
//                   badge.achieved ? "achieved" : "not achieved"
//                 }`}
//                 tabIndex={0}
//               >
//                 <span className="text-2xl">{badge.icon}</span>
//                 <div>
//                   <p className="font-semibold text-indigo-900 dark:text-teal-300">
//                     {badge.name}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {badge.description}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Posts History Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg"
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Your Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center text-gray-500 dark:text-gray-400"
//               >
//                 No posts yet. Share your first gossip!
//               </motion.p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {posts.map((post) => (
//                   <motion.div
//                     key={post._id}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative aspect-square rounded-lg overflow-hidden group"
//                   >
//                     <Link
//                       to={`/posts/${post._id}`}
//                       className="block w-full h-full"
//                     >
//                       {post.media ? (
//                         post.media.endsWith(".mp4") ||
//                         post.media.includes("video") ? (
//                           <video
//                             src={post.media}
//                             className="w-full h-full object-cover"
//                             muted
//                             aria-label="Post video thumbnail"
//                           />
//                         ) : (
//                           <img
//                             src={post.media}
//                             alt="Post media"
//                             className="w-full h-full object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/150")
//                             }
//                           />
//                         )
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                           <span className="text-sm text-center p-2">
//                             {post.title}
//                           </span>
//                         </div>
//                       )}
//                       <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
//                       <div className="absolute bottom-0 left-0 right-0 p-3">
//                         <p className="text-white text-sm font-semibold line-clamp-2">
//                           {post.title}
//                         </p>
//                       </div>
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="text-white text-sm flex gap-4">
//                           <span>👍 {post.likes.length}</span>
//                           <span>👎 {post.downvotes.length}</span>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={(e) => {
//                               e.preventDefault();
//                               openDeleteModal(post);
//                             }}
//                             className="text-red-500 hover:text-red-400"
//                             aria-label={`Delete post ${post.title}`}
//                           >
//                             Delete
//                           </motion.button>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Delete Confirmation Modal */}
//         <AnimatePresence>
//           {showDeleteModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Delete confirmation modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Are you sure you want to delete this post?
//                 </h3>
//                 <p className="text-gray-700 dark:text-gray-200 mb-6">
//                   "{postToDelete?.title}" will be permanently deleted.
//                 </p>
//                 <div className="flex justify-end gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={closeDeleteModal}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Cancel deletion"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleDeletePost(postToDelete._id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
//                     aria-label="Confirm deletion"
//                   >
//                     Delete
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import {
//   getPosts,
//   getUserProfile,
//   updateUserProfile,
//   deletePost,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     bio: "",
//     profilePicture: null,
//   });
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [postToDelete, setPostToDelete] = useState(null);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Fetch user profile, posts, followers, and following
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [userRes, postsRes] = await Promise.all([
//           getUserProfile(),
//           getPosts(),
//         ]);
//         setUser(userRes);
//         setPosts(postsRes.filter((p) => p.author._id === userRes._id));
//         setFormData({
//           username: userRes.username || "",
//           bio: userRes.bio || "",
//           profilePicture: null,
//         });

//         // Fetch followers and following
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userRes._id),
//           getFollowing(userRes._id),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);
//       } catch (err) {
//         const message =
//           err.response?.data?.message ||
//           "Failed to load profile, posts, or followers";
//         toast.error(message);
//         if (message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   // Handle file preview
//   useEffect(() => {
//     if (formData.profilePicture) {
//       const url = URL.createObjectURL(formData.profilePicture);
//       setPreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setPreview(null);
//     }
//   }, [formData.profilePicture]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "profilePicture" && files && files[0]) {
//       const file = files[0];
//       // Validate file type
//       const validTypes = ["image/jpeg", "image/png"];
//       if (!validTypes.includes(file.type)) {
//         toast.error("Please upload a JPEG or PNG image");
//         e.target.value = null;
//         setFormData((prev) => ({ ...prev, profilePicture: null }));
//         return;
//       }
//       // Validate file size (5MB limit)
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (file.size > maxSize) {
//         toast.error("File size exceeds 5MB. Please upload a smaller image.");
//         e.target.value = null;
//         setFormData((prev) => ({ ...prev, profilePicture: null }));
//         return;
//       }
//       setFormData((prev) => ({ ...prev, profilePicture: file }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const clearProfilePicture = () => {
//     setFormData((prev) => ({ ...prev, profilePicture: null }));
//     document.getElementById("profilePicture").value = null;
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Validate form data
//       if (!formData.username.trim()) {
//         toast.error("Username cannot be empty");
//         return;
//       }
//       if (formData.username.length < 3 || formData.username.length > 20) {
//         toast.error("Username must be between 3 and 20 characters");
//         return;
//       }

//       const data = new FormData();
//       data.append("username", formData.username);
//       data.append("bio", formData.bio);
//       if (formData.profilePicture) {
//         data.append("profilePicture", formData.profilePicture);
//       }
//       const updatedUser = await updateUserProfile(data);
//       setUser(updatedUser);
//       setFormData({
//         username: updatedUser.username || "",
//         bio: updatedUser.bio || "",
//         profilePicture: null,
//       });
//       setIsEditing(false);
//       toast.success("Profile updated successfully");
//     } catch (err) {
//       const message = err.response?.data?.message || "Failed to update profile";
//       toast.error(message);
//       if (message.includes("username")) {
//         setFormData((prev) => ({ ...prev, username: user.username || "" }));
//       }
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//     toast.success("Logged out");
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       await deletePost(postId);
//       setPosts(posts.filter((post) => post._id !== postId));
//       toast.success("Post deleted successfully");
//       setShowDeleteModal(false);
//       setPostToDelete(null);
//     } catch (err) {
//       const message = err.response?.data?.message || "Failed to delete post";
//       toast.error(message);
//     }
//   };

//   const openDeleteModal = (post) => {
//     setPostToDelete(post);
//     setShowDeleteModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setPostToDelete(null);
//   };

//   const handleFollow = async (userId) => {
//     try {
//       await followUser(userId);
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(user._id),
//         getFollowing(user._id),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const userRes = await getUserProfile();
//       setUser(userRes);
//       toast.success("User followed successfully");
//     } catch (err) {
//       const message = err.response?.data?.message || "Failed to follow user";
//       toast.error(message);
//     }
//   };

//   const handleUnfollow = async (userId) => {
//     try {
//       await unfollowUser(userId);
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(user._id),
//         getFollowing(user._id),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const userRes = await getUserProfile();
//       setUser(userRes);
//       toast.success("User unfollowed successfully");
//     } catch (err) {
//       const message = err.response?.data?.message || "Failed to unfollow user";
//       toast.error(message);
//     }
//   };

//   // Calculate badges
//   const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
//   const badges = [
//     {
//       name: "New Gossip",
//       description: "Posted 1 or more gossips",
//       achieved: posts.length >= 1,
//       icon: "🗣️",
//     },
//     {
//       name: "Fun Master",
//       description: "Fun Meter reached 50 or more",
//       achieved: user?.funMeter >= 10,
//       icon: "😄",
//     },
//     {
//       name: "Popular Poster",
//       description: "Received 10 or more likes",
//       achieved: totalLikes >= 10,
//       icon: "👍",
//     },
//     {
//       name: "Veteran",
//       description: "Account active for 1 year",
//       achieved:
//         user &&
//         new Date(user.createdAt) <
//           new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
//       icon: "🏆",
//     },
//     ...(user?.streakRewards || []).map((reward) => ({
//       name: reward,
//       description: reward.startsWith("Day ")
//         ? `Achieved ${reward} for maintaining a daily streak`
//         : `Reached ${reward} for a 7-day streak`,
//       achieved: true,
//       icon: reward.startsWith("Day ") ? "🔥" : "🎉",
//     })),
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-950">
//         <motion.div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="text-2xl font-medium text-red-600 dark:text-teal-400"
//         >
//           Loading...
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-950" : "bg-white"
//       } transition-colors duration-500 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
//             aria-label="Back to home"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </Link>
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
//       </div>

//       <div className="max-w-3xl mx-auto">
//         {/* Profile Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User profile"
//         >
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//             <div className="relative">
//               <img
//                 src={
//                   preview ||
//                   (user?.profilePicture
//                     ? user.profilePicture
//                     : "https://via.placeholder.com/150")
//                 }
//                 alt="Profile picture"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 dark:border-teal-500"
//                 onError={(e) =>
//                   (e.target.src = "https://via.placeholder.com/150")
//                 }
//               />
//               <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
//                 <HiFire className="h-4 w-4 text-white mr-1" />
//                 <span className="text-xs font-medium text-white">
//                   {user?.streak || 0}
//                 </span>
//               </div>
//             </div>
//             <div className="text-center sm:text-left">
//               <div className="flex items-center justify-center sm:justify-start gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-teal-300">
//                   {user?.username || user?.email}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFollowers(true)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
//                     aria-label="View followers"
//                   >
//                     {user?.followersCount || 0} Followers
//                   </button>
//                   <button
//                     onClick={() => setShowFollowing(true)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
//                     aria-label="View following"
//                   >
//                     {user?.followingCount || 0} Following
//                   </button>
//                 </div>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">
//                 {user?.bio || "No bio yet."}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Joined:{" "}
//                 {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Fun Meter: {user?.funMeter || 0}
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="mt-4 bg-indigo-500 dark:bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors mr-2"
//                 aria-label={isEditing ? "Cancel edit profile" : "Edit profile"}
//               >
//                 {isEditing ? "Cancel" : "Edit Profile"}
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
//                 aria-label="Logout"
//               >
//                 Logout
//               </motion.button>
//             </div>
//           </div>

//           {/* Edit Profile Form */}
//           <AnimatePresence>
//             {isEditing && (
//               <motion.form
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 onSubmit={handleEditSubmit}
//                 className="mt-6"
//               >
//                 <div className="mb-4">
//                   <label
//                     htmlFor="username"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     minLength={3}
//                     maxLength={20}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
//                     aria-label="Username input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="bio"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     maxLength={200}
//                     className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100"
//                     aria-label="Bio input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="profilePicture"
//                     className="block text-gray-700 dark:text-gray-200 mb-2"
//                   >
//                     Profile Picture
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="file"
//                       id="profilePicture"
//                       name="profilePicture"
//                       accept="image/jpeg,image/png"
//                       onChange={handleInputChange}
//                       className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
//                       aria-label="Profile picture upload"
//                     />
//                   </div>
//                   {preview && (
//                     <div className="mt-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Preview:
//                         </p>
//                         <button
//                           type="button"
//                           onClick={clearProfilePicture}
//                           className="text-sm text-red-600 dark:text-red-400 hover:underline"
//                           aria-label="Clear profile picture"
//                         >
//                           Clear
//                         </button>
//                       </div>
//                       <img
//                         src={preview}
//                         alt="Profile picture preview"
//                         className="max-w-xs rounded-lg shadow-sm"
//                         onError={(e) =>
//                           (e.target.src = "https://via.placeholder.com/150")
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="submit"
//                   className="bg-indigo-500 dark:bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors"
//                   aria-label="Save profile changes"
//                 >
//                   Save Changes
//                 </motion.button>
//               </motion.form>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Followers Modal */}
//         <AnimatePresence>
//           {showFollowers && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Followers list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p className="text-gray-700 dark:text-gray-200">
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               follower.profilePicture ||
//                               "https://via.placeholder.com/50"
//                             }
//                             alt={`${follower.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                           <p className="text-gray-900 dark:text-gray-100">
//                             {follower.username}
//                           </p>
//                         </div>
//                         {follower._id !== user?._id &&
//                           !following.some((f) => f._id === follower._id) && (
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleFollow(follower._id)}
//                               className="bg-indigo-500 dark:bg-teal-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors text-sm"
//                               aria-label={`Follow ${follower.username}`}
//                             >
//                               Follow
//                             </motion.button>
//                           )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowers(false)}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Close followers modal"
//                   >
//                     Close
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Following Modal */}
//         <AnimatePresence>
//           {showFollowing && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Following list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p className="text-gray-700 dark:text-gray-200">
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               followedUser.profilePicture ||
//                               "https://via.placeholder.com/50"
//                             }
//                             alt={`${followedUser.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                           <p className="text-gray-900 dark:text-gray-100">
//                             {followedUser.username}
//                           </p>
//                         </div>
//                         {followedUser._id !== user?._id && (
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleUnfollow(followedUser._id)}
//                             className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
//                             aria-label={`Unfollow ${followedUser.username}`}
//                           >
//                             Unfollow
//                           </motion.button>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowing(false)}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Close following modal"
//                   >
//                     Close
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Achievements/Badges Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User achievements"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Achievements
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {badges.map((badge) => (
//               <motion.div
//                 key={badge.name}
//                 whileHover={{ scale: 1.05 }}
//                 className={`p-4 rounded-xl ${
//                   badge.achieved
//                     ? "bg-indigo-100 dark:bg-teal-900"
//                     : "bg-gray-100 dark:bg-gray-800 opacity-50"
//                 } flex items-center gap-4`}
//                 role="button"
//                 aria-label={`${badge.name} badge: ${badge.description}, ${
//                   badge.achieved ? "achieved" : "not achieved"
//                 }`}
//                 tabIndex={0}
//               >
//                 <span className="text-2xl">{badge.icon}</span>
//                 <div>
//                   <p className="font-semibold text-indigo-900 dark:text-teal-300">
//                     {badge.name}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {badge.description}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Posts History Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg"
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Your Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center text-gray-500 dark:text-gray-400"
//               >
//                 No posts yet. Share your first gossip!
//               </motion.p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {posts.map((post) => (
//                   <motion.div
//                     key={post._id}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative aspect-square rounded-lg overflow-hidden group"
//                   >
//                     <Link
//                       to={`/posts/${post._id}`}
//                       className="block w-full h-full"
//                     >
//                       {post.media ? (
//                         post.media.endsWith(".mp4") ||
//                         post.media.includes("video") ? (
//                           <video
//                             src={post.media}
//                             className="w-full h-full object-cover"
//                             muted
//                             aria-label="Post video thumbnail"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/150")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={post.media}
//                             alt="Post media"
//                             className="w-full h-full object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/150")
//                             }
//                           />
//                         )
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                           <span className="text-sm text-center p-2">
//                             {post.title}
//                           </span>
//                         </div>
//                       )}
//                       <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
//                       <div className="absolute bottom-0 left-0 right-0 p-3">
//                         <p className="text-white text-sm font-semibold line-clamp-2">
//                           {post.title}
//                         </p>
//                       </div>
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="text-white text-sm flex gap-4">
//                           <span>👍 {post.likes.length}</span>
//                           <span>👎 {post.downvotes.length}</span>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={(e) => {
//                               e.preventDefault();
//                               openDeleteModal(post);
//                             }}
//                             className="text-red-500 hover:text-red-400"
//                             aria-label={`Delete post ${post.title}`}
//                           >
//                             Delete
//                           </motion.button>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Delete Confirmation Modal */}
//         <AnimatePresence>
//           {showDeleteModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Delete confirmation modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Are you sure you want to delete this post?
//                 </h3>
//                 <p className="text-gray-700 dark:text-gray-200 mb-6">
//                   "{postToDelete?.title}" will be permanently deleted.
//                 </p>
//                 <div className="flex justify-end gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={closeDeleteModal}
//                     className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Cancel deletion"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleDeletePost(postToDelete._id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
//                     aria-label="Confirm deletion"
//                   >
//                     Delete
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { HiFire } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getPosts,
  getUserProfile,
  updateUserProfile,
  deletePost,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../utils/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null); // Track which post's menu is open
  const menuRef = useRef(null); // Ref for dropdown menu to detect outside clicks

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Fetch user profile, posts, followers, and following
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, postsRes] = await Promise.all([
          getUserProfile(),
          getPosts(),
        ]);
        setUser(userRes);
        setPosts(postsRes.filter((p) => p.author._id === userRes._id));
        setFormData({
          username: userRes.username || "",
          bio: userRes.bio || "",
          profilePicture: null,
        });

        // Fetch followers and following
        const [followersData, followingData] = await Promise.all([
          getFollowers(userRes._id),
          getFollowing(userRes._id),
        ]);
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to load profile, posts, or followers";
        toast.error(message);
        if (message.includes("401")) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Handle file preview
  useEffect(() => {
    if (formData.profilePicture) {
      const url = URL.createObjectURL(formData.profilePicture);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [formData.profilePicture]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];
      // Validate file type
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPEG or PNG image");
        e.target.value = null;
        setFormData((prev) => ({ ...prev, profilePicture: null }));
        return;
      }
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB. Please upload a smaller image.");
        e.target.value = null;
        setFormData((prev) => ({ ...prev, profilePicture: null }));
        return;
      }
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearProfilePicture = () => {
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    document.getElementById("profilePicture").value = null;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.username.trim()) {
        toast.error("Username cannot be empty");
        return;
      }
      if (formData.username.length < 3 || formData.username.length > 20) {
        toast.error("Username must be between 3 and 20 characters");
        return;
      }

      const data = new FormData();
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser);
      setFormData({
        username: updatedUser.username || "",
        bio: updatedUser.bio || "",
        profilePicture: null,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      toast.error(message);
      if (message.includes("username")) {
        setFormData((prev) => ({ ...prev, username: user.username || "" }));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out");
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully");
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete post";
      toast.error(message);
    }
  };

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
    setMenuOpen(null); // Close the dropdown menu
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      const [followersData, followingData] = await Promise.all([
        getFollowers(user._id),
        getFollowing(user._id),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
      const userRes = await getUserProfile();
      setUser(userRes);
      toast.success("User followed successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to follow user";
      toast.error(message);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      const [followersData, followingData] = await Promise.all([
        getFollowers(user._id),
        getFollowing(user._id),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
      const userRes = await getUserProfile();
      setUser(userRes);
      toast.success("User unfollowed successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to unfollow user";
      toast.error(message);
    }
  };

  // Calculate badges
  const totalLikes = posts.reduce(
    (sum, post) => sum + (post.likes?.length || 0),
    0
  );
  const badges = [
    {
      name: "New Gossip",
      description: "Posted 1 or more gossips",
      achieved: posts.length >= 1,
      icon: "🗣️",
    },
    {
      name: "Fun Master",
      description: "Fun Meter reached 50 or more",
      achieved: user?.funMeter >= 10,
      icon: "😄",
    },
    {
      name: "Popular Poster",
      description: "Received 10 or more likes",
      achieved: totalLikes >= 10,
      icon: "👍",
    },
    {
      name: "Veteran",
      description: "Account active for 1 year",
      achieved:
        user &&
        new Date(user.createdAt) <
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      icon: "🏆",
    },
    ...(user?.streakRewards || []).map((reward) => ({
      name: reward,
      description: reward.startsWith("Day ")
        ? `Achieved ${reward} for maintaining a daily streak`
        : `Reached ${reward} for a 7-day streak`,
      achieved: true,
      icon: reward.startsWith("Day ") ? "🔥" : "🎉",
    })),
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-950">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-2xl font-medium text-red-600 dark:text-teal-400"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-white"
      } transition-colors duration-500 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-poppins`}
    >
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
            aria-label="Back to home"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
            </svg>
            Back
          </Link>
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
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
          role="region"
          aria-label="User profile"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={
                  preview ||
                  (user?.profilePicture
                    ? user.profilePicture
                    : "https://via.placeholder.com/150")
                }
                alt="Profile picture"
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 dark:border-teal-500"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                }
              />
              <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
                <HiFire className="h-4 w-4 text-white mr-1" />
                <span className="text-xs font-medium text-white">
                  {user?.streak || 0}
                </span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-teal-300">
                  {user?.username || user?.email}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFollowers(true)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
                    aria-label="View followers"
                  >
                    {user?.followersCount || 0} Followers
                  </button>
                  <button
                    onClick={() => setShowFollowing(true)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-teal-400"
                    aria-label="View following"
                  >
                    {user?.followingCount || 0} Following
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {user?.bio || "No bio yet."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Joined:{" "}
                {user ? new Date(user.createdAt).toLocaleDateString() : ""}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Fun Meter: {user?.funMeter || 0}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 bg-indigo-500 dark:bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors mr-2"
                aria-label={isEditing ? "Cancel edit profile" : "Edit profile"}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                aria-label="Logout"
              >
                Logout
              </motion.button>
            </div>
          </div>

          {/* Edit Profile Form */}
          <AnimatePresence>
            {isEditing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEditSubmit}
                className="mt-6"
              >
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    minLength={3}
                    maxLength={20}
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
                    aria-label="Username input"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="bio"
                    className="block text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    maxLength={200}
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100"
                    aria-label="Bio input"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="profilePicture"
                    className="block text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Profile Picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:outline-none text-gray-900 dark:text-gray-100"
                      aria-label="Profile picture upload"
                    />
                  </div>
                  {preview && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Preview:
                        </p>
                        <button
                          type="button"
                          onClick={clearProfilePicture}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                          aria-label="Clear profile picture"
                        >
                          Clear
                        </button>
                      </div>
                      <img
                        src={preview}
                        alt="Profile picture preview"
                        className="max-w-xs rounded-lg shadow-sm"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-indigo-500 dark:bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors"
                  aria-label="Save profile changes"
                >
                  Save Changes
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Followers Modal */}
        <AnimatePresence>
          {showFollowers && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-label="Followers list modal"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Followers ({user?.followersCount || 0})
                </h3>
                <div className="max-h-60 overflow-y-auto">
                  {followers.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-200">
                      No followers yet.
                    </p>
                  ) : (
                    followers.map((follower) => (
                      <div
                        key={follower._id}
                        className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              follower.profilePicture ||
                              "https://via.placeholder.com/50"
                            }
                            alt={`${follower.username}'s profile picture`}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                          <p className="text-gray-900 dark:text-gray-100">
                            {follower.username}
                          </p>
                        </div>
                        {follower._id !== user?._id &&
                          !following.some((f) => f._id === follower._id) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFollow(follower._id)}
                              className="bg-indigo-500 dark:bg-teal-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 dark:hover:bg-teal-600 transition-colors text-sm"
                              aria-label={`Follow ${follower.username}`}
                            >
                              Follow
                            </motion.button>
                          )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFollowers(false)}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Close followers modal"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Following Modal */}
        <AnimatePresence>
          {showFollowing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-label="Following list modal"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Following ({user?.followingCount || 0})
                </h3>
                <div className="max-h-60 overflow-y-auto">
                  {following.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-200">
                      Not following anyone yet.
                    </p>
                  ) : (
                    following.map((followedUser) => (
                      <div
                        key={followedUser._id}
                        className="flex items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              followedUser.profilePicture ||
                              "https://via.placeholder.com/50"
                            }
                            alt={`${followedUser.username}'s profile picture`}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                          <p className="text-gray-900 dark:text-gray-100">
                            {followedUser.username}
                          </p>
                        </div>
                        {followedUser._id !== user?._id && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUnfollow(followedUser._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
                            aria-label={`Unfollow ${followedUser.username}`}
                          >
                            Unfollow
                          </motion.button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFollowing(false)}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Close following modal"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements/Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg mb-8"
          role="region"
          aria-label="User achievements"
        >
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
            Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.name}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl ${
                  badge.achieved
                    ? "bg-indigo-100 dark:bg-teal-900"
                    : "bg-gray-100 dark:bg-gray-800 opacity-50"
                } flex items-center gap-4`}
                role="button"
                aria-label={`${badge.name} badge: ${badge.description}, ${
                  badge.achieved ? "achieved" : "not achieved"
                }`}
                tabIndex={0}
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-semibold text-indigo-900 dark:text-teal-300">
                    {badge.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Posts History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg"
          role="region"
          aria-label="User posts history"
        >
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
            Your Posts
          </h3>
          <AnimatePresence>
            {posts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 dark:text-gray-400"
              >
                No posts yet. Share your first gossip!
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <Link
                      to={`/posts/${post._id}`}
                      className="block w-full h-full"
                    >
                      {post.media ? (
                        post.media.endsWith(".mp4") ||
                        post.media.includes("video") ? (
                          <video
                            src={post.media}
                            className="w-full h-full object-cover"
                            muted
                            aria-label="Post video thumbnail"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            }
                          />
                        ) : (
                          <img
                            src={post.media}
                            alt="Post media"
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            }
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          <span className="text-sm text-center p-2">
                            {post.title}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-semibold line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-sm flex gap-4">
                          <span>👍 {post.likes?.length || 0}</span>
                          <span>👎 {post.downvotes?.length || 0}</span>
                        </div>
                      </div>
                    </Link>
                    {/* Three Dots Menu */}
                    <div className="absolute top-2 right-2 z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuOpen(menuOpen === post._id ? null : post._id);
                        }}
                        className="p-1 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
                        aria-label="Post options"
                      >
                        <BsThreeDotsVertical className="h-5 w-5" />
                      </motion.button>
                      <AnimatePresence>
                        {menuOpen === post._id && (
                          <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 w-32 z-20"
                          >
                            <motion.button
                              whileHover={{
                                backgroundColor: isDarkMode
                                  ? "#4b5563"
                                  : "#e5e7eb",
                              }}
                              onClick={() => openDeleteModal(post)}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                              aria-label={`Delete post ${post.title}`}
                            >
                              Delete
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-label="Delete confirmation modal"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Are you sure you want to delete this post?
                </h3>
                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  "{postToDelete?.title}" will be permanently deleted.
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeDeleteModal}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeletePost(postToDelete._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Confirm deletion"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
