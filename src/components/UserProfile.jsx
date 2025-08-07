// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import { BsThreeDotsVertical } from "react-icons/bs";
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
//   const [menuOpen, setMenuOpen] = useState(null); // Track which post's menu is open
//   const menuRef = useRef(null); // Ref for dropdown menu to detect outside clicks

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

//   // Close dropdown menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

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
//     setMenuOpen(null); // Close the dropdown menu
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
//   const totalLikes = posts.reduce(
//     (sum, post) => sum + (post.likes?.length || 0),
//     0
//   );
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
//       <div className="flex justify-center items-center h-screen bg-white">
//         <motion.div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="text-2xl font-medium text-red-600"
//         >
//           Loading...
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white transition-colors duration-500 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-poppins">
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white transition-colors"
//             aria-label="Back to home"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-3xl mx-auto">
//         {/* Profile Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="bg-white rounded-xl p-6 sm:p-8 shadow-lg mb-8"
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
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
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
//                 <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">
//                   {user?.username || user?.email}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFollowers(true)}
//                     className="text-sm text-gray-500 hover:text-indigo-600"
//                     aria-label="View followers"
//                   >
//                     {user?.followersCount || 0} Followers
//                   </button>
//                   <button
//                     onClick={() => setShowFollowing(true)}
//                     className="text-sm text-gray-500 hover:text-indigo-600"
//                     aria-label="View following"
//                   >
//                     {user?.followingCount || 0} Following
//                   </button>
//                 </div>
//               </div>
//               <p className="text-gray-600 mt-2">{user?.bio || "No bio yet."}</p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Joined:{" "}
//                 {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Fun Meter: {user?.funMeter || 0}
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors mr-2"
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
//                     className="block text-gray-700 mb-2"
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
//                     className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
//                     aria-label="Username input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label htmlFor="bio" className="block text-gray-700 mb-2">
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     maxLength={200}
//                     className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24 text-gray-900"
//                     aria-label="Bio input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="profilePicture"
//                     className="block text-gray-700 mb-2"
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
//                       className="w-full p-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
//                       aria-label="Profile picture upload"
//                     />
//                   </div>
//                   {preview && (
//                     <div className="mt-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-sm text-gray-600">Preview:</p>
//                         <button
//                           type="button"
//                           onClick={clearProfilePicture}
//                           className="text-sm text-red-600 hover:underline"
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
//                   className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors"
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
//                 className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p className="text-gray-700">No followers yet.</p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200"
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
//                           <p className="text-gray-900">{follower.username}</p>
//                         </div>
//                         {follower._id !== user?._id &&
//                           !following.some((f) => f._id === follower._id) && (
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleFollow(follower._id)}
//                               className="bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 transition-colors text-sm"
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
//                     className="bg-gray-300 text-gray-900 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
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
//                 className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p className="text-gray-700">Not following anyone yet.</p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className="flex items-center justify-between gap-3 py-2 border-b border-gray-200"
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
//                           <p className="text-gray-900">
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
//                     className="bg-gray-300 text-gray-900 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
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
//           className="bg-white rounded-xl p-6 sm:p-8 shadow-lg mb-8"
//           role="region"
//           aria-label="User achievements"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 mb-6">
//             Achievements
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {badges.map((badge) => (
//               <motion.div
//                 key={badge.name}
//                 whileHover={{ scale: 1.05 }}
//                 className={`p-4 rounded-xl ${
//                   badge.achieved ? "bg-indigo-100" : "bg-gray-100 opacity-50"
//                 } flex items-center gap-4`}
//                 role="button"
//                 aria-label={`${badge.name} badge: ${badge.description}, ${
//                   badge.achieved ? "achieved" : "not achieved"
//                 }`}
//                 tabIndex={0}
//               >
//                 <span className="text-2xl">{badge.icon}</span>
//                 <div>
//                   <p className="font-semibold text-indigo-900">{badge.name}</p>
//                   <p className="text-sm text-gray-600">{badge.description}</p>
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
//           className="bg-white rounded-xl p-6 sm:p-8 shadow-lg"
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 mb-6">
//             Your Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center text-gray-500"
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
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
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
//                           <span>👍 {post.likes?.length || 0}</span>
//                           <span>👎 {post.downvotes?.length || 0}</span>
//                         </div>
//                       </div>
//                     </Link>
//                     {/* Three Dots Menu */}
//                     <div className="absolute top-2 right-2 z-10">
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setMenuOpen(menuOpen === post._id ? null : post._id);
//                         }}
//                         className="p-1 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
//                         aria-label="Post options"
//                       >
//                         <BsThreeDotsVertical className="h-5 w-5" />
//                       </motion.button>
//                       <AnimatePresence>
//                         {menuOpen === post._id && (
//                           <motion.div
//                             ref={menuRef}
//                             initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                             transition={{ duration: 0.2 }}
//                             className="absolute top-8 right-0 bg-white rounded-lg shadow-lg py-1 w-32 z-20"
//                           >
//                             <motion.button
//                               whileHover={{
//                                 backgroundColor: "#e5e7eb",
//                               }}
//                               onClick={() => openDeleteModal(post)}
//                               className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-200"
//                               aria-label={`Delete post ${post.title}`}
//                             >
//                               Delete
//                             </motion.button>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
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
//                 className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Are you sure you want to delete this post?
//                 </h3>
//                 <p className="text-gray-700 mb-6">
//                   "{postToDelete?.title}" will be permanently deleted.
//                 </p>
//                 <div className="flex justify-end gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={closeDeleteModal}
//                     className="bg-gray-300 text-gray-900 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import { BsThreeDotsVertical } from "react-icons/bs";
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
//   const [menuOpen, setMenuOpen] = useState(null); // Track which post's menu is open
//   const menuRef = useRef(null); // Ref for dropdown menu to detect outside clicks
//   const [isDarkMode, setIsDarkMode] = useState(false);

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

//   // Close dropdown menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

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
//     setMenuOpen(null); // Close the dropdown menu
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

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Calculate badges
//   const totalLikes = posts.reduce(
//     (sum, post) => sum + (post.likes?.length || 0),
//     0
//   );
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
//       <div
//         className={`flex justify-center items-center h-screen ${
//           isDarkMode ? "bg-gray-950" : "bg-white"
//         }`}
//       >
//         <motion.div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className={`text-2xl font-medium ${
//             isDarkMode ? "text-gray-100" : "text-red-600"
//           }`}
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
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white transition-colors"
//             aria-label="Back to home"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </Link>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
//             aria-label={
//               isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//             }
//           >
//             {isDarkMode ? (
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
//           className={`${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           } rounded-xl p-6 sm:p-8 shadow-lg mb-8 transition-colors duration-500`}
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
//                     : "https://avatar.iran.liara.run/public/33")
//                 }
//                 alt="Profile picture"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
//                 onError={(e) =>
//                   (e.target.src = "https://avatar.iran.liara.run/public/33")
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
//                 <h2
//                   className={`text-2xl sm:text-3xl font-bold ${
//                     isDarkMode ? "text-gray-100" : "text-indigo-900"
//                   }`}
//                 >
//                   {user?.username || user?.email}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFollowers(true)}
//                     className={`text-sm ${
//                       isDarkMode
//                         ? "text-gray-400 hover:text-gray-200"
//                         : "text-gray-500 hover:text-indigo-600"
//                     }`}
//                     aria-label="View followers"
//                   >
//                     {user?.followersCount || 0} Followers
//                   </button>
//                   <button
//                     onClick={() => setShowFollowing(true)}
//                     className={`text-sm ${
//                       isDarkMode
//                         ? "text-gray-400 hover:text-gray-200"
//                         : "text-gray-500 hover:text-indigo-600"
//                     }`}
//                     aria-label="View following"
//                   >
//                     {user?.followingCount || 0} Following
//                   </button>
//                 </div>
//               </div>
//               <p
//                 className={`mt-2 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 {user?.bio || "No bio yet."}
//               </p>
//               <p
//                 className={`text-sm mt-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               >
//                 Joined:{" "}
//                 {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//               </p>
//               <p
//                 className={`text-sm mt-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               >
//                 Fun Meter: {user?.funMeter || 0}
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors mr-2"
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
//                     className={`block mb-2 ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
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
//                     className={`w-full p-3 rounded-xl ${
//                       isDarkMode
//                         ? "bg-gray-800 border-gray-700 text-gray-200"
//                         : "bg-gray-100 border-gray-200 text-gray-900"
//                     } border focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
//                     aria-label="Username input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="bio"
//                     className={`block mb-2 ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     maxLength={200}
//                     className={`w-full p-3 rounded-xl ${
//                       isDarkMode
//                         ? "bg-gray-800 border-gray-700 text-gray-200"
//                         : "bg-gray-100 border-gray-200 text-gray-900"
//                     } border focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24`}
//                     aria-label="Bio input"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="profilePicture"
//                     className={`block mb-2 ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
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
//                       className={`w-full p-3 rounded-xl ${
//                         isDarkMode
//                           ? "bg-gray-800 border-gray-700 text-gray-200"
//                           : "bg-gray-100 border-gray-200 text-gray-900"
//                       } border focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
//                       aria-label="Profile picture upload"
//                     />
//                   </div>
//                   {preview && (
//                     <div className="mt-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <p
//                           className={`text-sm ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           }`}
//                         >
//                           Preview:
//                         </p>
//                         <button
//                           type="button"
//                           onClick={clearProfilePicture}
//                           className={`text-sm ${
//                             isDarkMode
//                               ? "text-red-400 hover:underline"
//                               : "text-red-600 hover:underline"
//                           }`}
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
//                           (e.target.src =
//                             "https://avatar.iran.liara.run/public/26")
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="submit"
//                   className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors"
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
//                 className={`${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 } rounded-lg p-6 w-full max-w-sm shadow-lg transition-colors duration-500`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-gray-100" : "text-gray-900"
//                   } mb-4`}
//                 >
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p
//                       className={`${
//                         isDarkMode ? "text-gray-400" : "text-gray-700"
//                       }`}
//                     >
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className={`flex items-center justify-between gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <Link
//                           to={`/users/${follower._id}`}
//                           className="flex items-center gap-3"
//                           onClick={() => setShowFollowers(false)} // Close modal on click
//                         >
//                           <img
//                             src={
//                               follower.profilePicture ||
//                               "https://avatar.iran.liara.run/public/41"
//                             }
//                             alt={`${follower.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public/41")
//                             }
//                           />
//                           <p
//                             className={`${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             }`}
//                           >
//                             {follower.username}
//                           </p>
//                         </Link>
//                         {follower._id !== user?._id &&
//                           !following.some((f) => f._id === follower._id) && (
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleFollow(follower._id)}
//                               className="bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 transition-colors text-sm"
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
//                     className={`${
//                       isDarkMode
//                         ? "bg-gray-700 text-gray-200"
//                         : "bg-gray-300 text-gray-900"
//                     } px-4 py-2 rounded-full hover:bg-gray-400 transition-colors`}
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
//                 className={`${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 } rounded-lg p-6 w-full max-w-sm shadow-lg transition-colors duration-500`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-gray-100" : "text-gray-900"
//                   } mb-4`}
//                 >
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p
//                       className={`${
//                         isDarkMode ? "text-gray-400" : "text-gray-700"
//                       }`}
//                     >
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className={`flex items-center justify-between gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <Link
//                           to={`/users/${followedUser._id}`}
//                           className="flex items-center gap-3"
//                           onClick={() => setShowFollowing(false)} // Close modal on click
//                         >
//                           <img
//                             src={
//                               followedUser.profilePicture ||
//                               "https://avatar.iran.liara.run/public/17"
//                             }
//                             alt={`${followedUser.username}'s profile picture`}
//                             className="w-10 h-10 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public/17")
//                             }
//                           />
//                           <p
//                             className={`${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             }`}
//                           >
//                             {followedUser.username}
//                           </p>
//                         </Link>
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
//                     className={`${
//                       isDarkMode
//                         ? "bg-gray-700 text-gray-200"
//                         : "bg-gray-300 text-gray-900"
//                     } px-4 py-2 rounded-full hover:bg-gray-400 transition-colors`}
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
//           className={`${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           } rounded-xl p-6 sm:p-8 shadow-lg mb-8 transition-colors duration-500`}
//           role="region"
//           aria-label="User achievements"
//         >
//           <h3
//             className={`text-2xl font-bold ${
//               isDarkMode ? "text-gray-100" : "text-indigo-900"
//             } mb-6`}
//           >
//             Achievements
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {badges.map((badge) => (
//               <motion.div
//                 key={badge.name}
//                 whileHover={{ scale: 1.05 }}
//                 className={`p-4 rounded-xl ${
//                   badge.achieved
//                     ? isDarkMode
//                       ? "bg-indigo-900"
//                       : "bg-indigo-100"
//                     : isDarkMode
//                     ? "bg-gray-800 opacity-50"
//                     : "bg-gray-100 opacity-50"
//                 } flex items-center gap-4 transition-colors duration-500`}
//                 role="button"
//                 aria-label={`${badge.name} badge: ${badge.description}, ${
//                   badge.achieved ? "achieved" : "not achieved"
//                 }`}
//                 tabIndex={0}
//               >
//                 <span className="text-2xl">{badge.icon}</span>
//                 <div>
//                   <p
//                     className={`font-semibold ${
//                       isDarkMode ? "text-gray-100" : "text-indigo-900"
//                     }`}
//                   >
//                     {badge.name}
//                   </p>
//                   <p
//                     className={`text-sm ${
//                       isDarkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
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
//           className={`${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           } rounded-xl p-6 sm:p-8 shadow-lg transition-colors duration-500`}
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3
//             className={`text-2xl font-bold ${
//               isDarkMode ? "text-gray-100" : "text-indigo-900"
//             } mb-6`}
//           >
//             Your Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className={`text-center ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
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
//                               (e.target.src =
//                                 "https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={post.media}
//                             alt="Post media"
//                             className="w-full h-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                             }
//                           />
//                         )
//                       ) : (
//                         <div
//                           className={`w-full h-full flex items-center justify-center ${
//                             isDarkMode
//                               ? "bg-gray-800 text-gray-400"
//                               : "bg-gray-200 text-gray-500"
//                           }`}
//                         >
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
//                           <span>👍 {post.likes?.length || 0}</span>
//                           <span>👎 {post.downvotes?.length || 0}</span>
//                         </div>
//                       </div>
//                     </Link>
//                     {/* Three Dots Menu */}
//                     <div className="absolute top-2 right-2 z-10">
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setMenuOpen(menuOpen === post._id ? null : post._id);
//                         }}
//                         className="p-1 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
//                         aria-label="Post options"
//                       >
//                         <BsThreeDotsVertical className="h-5 w-5" />
//                       </motion.button>
//                       <AnimatePresence>
//                         {menuOpen === post._id && (
//                           <motion.div
//                             ref={menuRef}
//                             initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                             transition={{ duration: 0.2 }}
//                             className={`absolute top-8 right-0 ${
//                               isDarkMode ? "bg-gray-900" : "bg-white"
//                             } rounded-lg shadow-lg py-1 w-32 z-20 transition-colors duration-500`}
//                           >
//                             <motion.button
//                               whileHover={{
//                                 backgroundColor: isDarkMode
//                                   ? "#4b5563"
//                                   : "#e5e7eb",
//                               }}
//                               onClick={() => openDeleteModal(post)}
//                               className={`w-full text-left px-3 py-2 text-sm ${
//                                 isDarkMode
//                                   ? "text-red-400 hover:bg-gray-700"
//                                   : "text-red-600 hover:bg-gray-200"
//                               }`}
//                               aria-label={`Delete post ${post.title}`}
//                             >
//                               Delete
//                             </motion.button>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
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
//                 className={`${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 } rounded-lg p-6 w-full max-w-sm shadow-lg transition-colors duration-500`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-gray-100" : "text-gray-900"
//                   } mb-4`}
//                 >
//                   Are you sure you want to delete this post?
//                 </h3>
//                 <p
//                   className={`mb-6 ${
//                     isDarkMode ? "text-gray-400" : "text-gray-700"
//                   }`}
//                 >
//                   "{postToDelete?.title}" will be permanently deleted.
//                 </p>
//                 <div className="flex justify-end gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={closeDeleteModal}
//                     className={`${
//                       isDarkMode
//                         ? "bg-gray-700 text-gray-200"
//                         : "bg-gray-300 text-gray-900"
//                     } px-4 py-2 rounded-full hover:bg-gray-400 transition-colors`}
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

import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { HiFire } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Masonry from "react-masonry-css";
import {
  getPosts,
  getUserProfile,
  updateUserProfile,
  deletePost,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  updatePost,
} from "../utils/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const menuRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Generate session seed for randomization
  const sessionSeed = useMemo(() => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }, []);

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    let m = shuffled.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
    }
    return shuffled;
  };

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
        const userRes = await getUserProfile();
        const [postsRes, followersData, followingData] = await Promise.all([
          getPosts(),
          getFollowers(userRes._id).catch(() => []),
          getFollowing(userRes._id).catch(() => []),
        ]);
        setUser(userRes);
        setPosts(
          shuffleArray(postsRes.filter((p) => p.author._id === userRes._id))
        );
        setFormData({
          username: userRes.username || "",
          bio: userRes.bio || "",
          profilePicture: null,
        });
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (err) {
        const message = err.message || "Failed to load profile data";
        toast.error(message);
        if (
          message.includes("401") ||
          message.includes("No authentication token")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, sessionSeed]);

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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPEG or PNG image");
        e.target.value = null;
        setFormData((prev) => ({ ...prev, profilePicture: null }));
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB");
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
      const message = err.message || "Failed to update profile";
      toast.error(message);
      if (message.includes("username")) {
        setFormData((prev) => ({ ...prev, username: user.username || "" }));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
      const message = err.message || "Failed to delete post";
      toast.error(message);
    }
  };

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
    setMenuOpen(null);
  };

  const openEditPost = (postId) => {
    navigate(`/posts/${postId}/edit`);
    setMenuOpen(null);
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
      const message = err.message || "Failed to follow user";
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
      const message = err.message || "Failed to unfollow user";
      toast.error(message);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className={`text-2xl font-medium ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm2 0a4 4 0 108 0 4 4 0 00-8 0zm4-8a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } pt-16 pb-8 px-4 sm:px-6 lg:px-8 font-[Inter,sans-serif] transition-colors duration-300`}
    >
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 shadow-lg py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-red-200 transition-colors duration-200"
            aria-label="Back to home"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
            </svg>
            Home
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors duration-200"
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
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg p-2 shadow-md sticky top-14 z-40 transition-colors duration-300`}
        >
          <div className="flex space-x-1">
            {[
              "profile",
              "posts",
              ...(user?.role === "admin" ? ["admin"] : []),
            ].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                  activeTab === tab
                    ? "text-red-600"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-red-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View ${tab} section`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Profile Section */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg mt-4 overflow-hidden transition-colors duration-300`}
            role="region"
            aria-label="User profile"
          >
            <div className="relative h-40 bg-gradient-to-r from-red-600 to-red-800">
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="relative -mt-20 px-6 pb-6">
              <div className="flex justify-center">
                <div
                  className={`relative ${
                    user?.reactionStreak > 0
                      ? "p-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                      : ""
                  }`}
                >
                  <img
                    src={
                      preview ||
                      (user?.profilePicture
                        ? user.profilePicture
                        : "https://avatar.iran.liara.run/public/33")
                    }
                    alt="Profile picture"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) =>
                      (e.target.src = "https://avatar.iran.liara.run/public/33")
                    }
                  />
                  {user?.reactionStreak > 0 && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
                      <HiFire className="h-3 w-3 text-white" />
                      <span className="text-xs font-medium text-white ml-1">
                        {user?.reactionStreak || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center mt-4">
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.username || user?.email}
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } max-w-md mx-auto`}
                >
                  {user?.bio || "No bio yet."}
                </p>
                <div className="flex justify-center gap-6 mt-2 text-sm">
                  <button
                    onClick={() => setShowFollowers(true)}
                    className={`font-medium ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                    aria-label="View followers"
                  >
                    <span className="font-semibold">
                      {user?.followersCount || 0}
                    </span>{" "}
                    Followers
                  </button>
                  <button
                    onClick={() => setShowFollowing(true)}
                    className={`font-medium ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                    aria-label="View following"
                  >
                    <span className="font-semibold">
                      {user?.followingCount || 0}
                    </span>{" "}
                    Following
                  </button>
                </div>
                <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
                  <p>
                    Joined:{" "}
                    {user ? new Date(user.createdAt).toLocaleDateString() : ""}
                  </p>
                  <p>Fun Meter: {user?.funMeter || 0}</p>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                    aria-label={
                      isEditing ? "Cancel edit profile" : "Edit profile"
                    }
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                    aria-label="Logout"
                  >
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {isEditing && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleEditSubmit}
                  className="px-6 pb-6 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="username"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
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
                      className={`mt-1 w-full p-2 rounded-md border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      } focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200`}
                      aria-label="Username input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bio"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      maxLength={200}
                      className={`mt-1 w-full p-2 rounded-md border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      } focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200 resize-none h-20`}
                      aria-label="Bio input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profilePicture"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className={`mt-1 w-full p-2 rounded-md border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      } focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200`}
                      aria-label="Profile picture upload"
                    />
                    {preview && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={preview}
                          alt="Profile picture preview"
                          className="w-12 h-12 rounded-md object-cover"
                          onError={(e) =>
                            (e.target.src =
                              "https://avatar.iran.liara.run/public/26")
                          }
                        />
                        <button
                          type="button"
                          onClick={clearProfilePicture}
                          className={`text-xs font-medium ${
                            isDarkMode
                              ? "text-red-400 hover:underline"
                              : "text-red-600 hover:underline"
                          }`}
                          aria-label="Clear profile picture"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-red-600 text-white px-4 py-1.5 rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                    aria-label="Save profile changes"
                  >
                    Save Changes
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
            {/* Achievements */}
            <div className="px-6 pb-6">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-3`}
              >
                Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.name}
                    whileHover={{ scale: 1.03 }}
                    className={`p-3 rounded-lg ${
                      badge.achieved
                        ? isDarkMode
                          ? "bg-red-900/50"
                          : "bg-red-100"
                        : isDarkMode
                        ? "bg-gray-700/50 opacity-50"
                        : "bg-gray-200/50 opacity-50"
                    } flex items-center gap-3 transition-colors duration-200`}
                    role="button"
                    aria-label={`${badge.name} badge: ${badge.description}, ${
                      badge.achieved ? "achieved" : "not achieved"
                    }`}
                    tabIndex={0}
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {badge.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {badge.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Section */}
        {activeTab === "posts" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 shadow-lg mt-4 transition-colors duration-300`}
            role="region"
            aria-label="User posts history"
          >
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-3`}
            >
              Your Posts
            </h3>
            <AnimatePresence>
              {posts.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-sm`}
                >
                  No posts yet. Share your first gossip!
                </motion.p>
              ) : (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -mx-2"
                  columnClassName="px-2"
                >
                  {posts.map((post) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-lg overflow-hidden shadow-sm mb-4 group"
                    >
                      <Link to={`/posts/${post._id}`} className="block w-full">
                        {post.media ? (
                          post.media.endsWith(".mp4") ||
                          post.media.includes("video") ? (
                            <video
                              src={post.media}
                              className="w-full h-auto object-cover"
                              muted
                              aria-label="Post video thumbnail"
                              onError={(e) =>
                                (e.target.src =
                                  "https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif")
                              }
                            />
                          ) : (
                            <img
                              src={post.media}
                              alt="Post media"
                              className="w-full h-auto object-cover"
                              onError={(e) =>
                                (e.target.src =
                                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                              }
                            />
                          )
                        ) : (
                          <div
                            className={`w-full h-48 flex items-center justify-center ${
                              isDarkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span className="text-sm text-center p-2">
                              {post.title}
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-xs font-medium line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="text-white text-xs flex gap-3">
                            <span>👍 {post.likes?.length || 0}</span>
                            <span>💖 {post.loves?.length || 0}</span>
                            <span>😂 {post.laughs?.length || 0}</span>
                            <span>😢 {post.sads?.length || 0}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="absolute top-2 right-2 z-10">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(
                              menuOpen === post._id ? null : post._id
                            );
                          }}
                          className="p-1 rounded-full bg-gray-800/60 text-white hover:bg-gray-700/60 transition-colors duration-200"
                          aria-label="Post options"
                        >
                          <BsThreeDotsVertical className="h-4 w-4" />
                        </motion.button>
                        <AnimatePresence>
                          {menuOpen === post._id && (
                            <motion.div
                              ref={menuRef}
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className={`absolute top-8 right-0 ${
                                isDarkMode ? "bg-gray-800/90" : "bg-white/90"
                              } backdrop-blur-md rounded-lg shadow-lg py-1 w-28 z-20 transition-colors duration-200`}
                            >
                              <motion.button
                                whileHover={{
                                  backgroundColor: isDarkMode
                                    ? "#4b5563"
                                    : "#fee2e2",
                                }}
                                onClick={() => openEditPost(post._id)}
                                className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                                  isDarkMode
                                    ? "text-blue-400 hover:bg-gray-700"
                                    : "text-blue-600 hover:bg-blue-100"
                                }`}
                                aria-label={`Edit post ${post.title}`}
                              >
                                Edit
                              </motion.button>
                              <motion.button
                                whileHover={{
                                  backgroundColor: isDarkMode
                                    ? "#4b5563"
                                    : "#fee2e2",
                                }}
                                onClick={() => openDeleteModal(post)}
                                className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                                  isDarkMode
                                    ? "text-red-400 hover:bg-gray-700"
                                    : "text-red-600 hover:bg-red-100"
                                }`}
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
                </Masonry>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Admin Section */}
        {activeTab === "admin" && user?.role === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 shadow-lg mt-4 transition-colors duration-300`}
            role="region"
            aria-label="Admin dashboard"
          >
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-3`}
            >
              Admin Dashboard
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Admin features (analytics, reports, sponsored ads) are not
              implemented in this version. Please check back later.
            </p>
          </motion.div>
        )}

        {/* Followers Modal */}
        <AnimatePresence>
          {showFollowers && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              role="dialog"
              aria-label="Followers list modal"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  isDarkMode ? "bg-gray-800/90" : "bg-white/90"
                } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-3`}
                >
                  Followers ({user?.followersCount || 0})
                </h3>
                <div className="max-h-64 overflow-y-auto">
                  {followers.length === 0 ? (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      No followers yet.
                    </p>
                  ) : (
                    followers.map((follower) => (
                      <div
                        key={follower._id}
                        className={`flex items-center justify-between gap-3 py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <Link
                          to={`/profile/${follower._id}`}
                          className="flex items-center gap-3"
                          onClick={() => setShowFollowers(false)}
                        >
                          <img
                            src={
                              follower.profilePicture ||
                              "https://avatar.iran.liara.run/public/41"
                            }
                            alt={`${follower.username}'s profile picture`}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src =
                                "https://avatar.iran.liara.run/public/41")
                            }
                          />
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {follower.username}
                          </p>
                        </Link>
                        {follower._id !== user?._id &&
                          !following.some((f) => f._id === follower._id) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFollow(follower._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors duration-200 text-xs font-medium"
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
                    className={`${
                      isDarkMode
                        ? "bg-gray-700/90 text-gray-200"
                        : "bg-gray-200/90 text-gray-900"
                    } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              role="dialog"
              aria-label="Following list modal"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  isDarkMode ? "bg-gray-800/90" : "bg-white/90"
                } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-3`}
                >
                  Following ({user?.followingCount || 0})
                </h3>
                <div className="max-h-64 overflow-y-auto">
                  {following.length === 0 ? (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Not following anyone yet.
                    </p>
                  ) : (
                    following.map((followedUser) => (
                      <div
                        key={followedUser._id}
                        className={`flex items-center justify-between gap-3 py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <Link
                          to={`/profile/${followedUser._id}`}
                          className="flex items-center gap-3"
                          onClick={() => setShowFollowing(false)}
                        >
                          <img
                            src={
                              followedUser.profilePicture ||
                              "https://avatar.iran.liara.run/public/17"
                            }
                            alt={`${followedUser.username}'s profile picture`}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src =
                                "https://avatar.iran.liara.run/public/17")
                            }
                          />
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {followedUser.username}
                          </p>
                        </Link>
                        {followedUser._id !== user?._id && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUnfollow(followedUser._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors duration-200 text-xs font-medium"
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
                    className={`${
                      isDarkMode
                        ? "bg-gray-700/90 text-gray-200"
                        : "bg-gray-200/90 text-gray-900"
                    } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
                    aria-label="Close following modal"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              role="dialog"
              aria-label="Delete confirmation modal"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  isDarkMode ? "bg-gray-800/90" : "bg-white/90"
                } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-3`}
                >
                  Delete Post?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  "{postToDelete?.title}" will be permanently deleted.
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeDeleteModal}
                    className={`${
                      isDarkMode
                        ? "bg-gray-700/90 text-gray-200"
                        : "bg-gray-200/90 text-gray-900"
                    } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeletePost(postToDelete._id)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
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
