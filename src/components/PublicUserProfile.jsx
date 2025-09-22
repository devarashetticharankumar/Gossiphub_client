// import { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import {
//   getUserProfile,
//   getPublicUserProfile,
//   getPosts,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const PublicUserProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   // Fetch user profile, posts, followers, and following
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view profiles");
//           navigate("/login");
//           return;
//         }

//         // Fetch the public user profile using api.js function
//         const userData = await getPublicUserProfile(userId);
//         setUser(userData);

//         // Fetch posts and filter out anonymous posts
//         const postsRes = await getPosts();
//         setPosts(
//           postsRes.filter(
//             (p) => p.author._id === userData._id && !p.isAnonymous
//           )
//         );

//         // Fetch followers and following
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userData._id),
//           getFollowing(userData._id),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);

//         // Check if the current user is following this user
//         const currentUser = await getUserProfile();
//         setIsFollowing(currentUser.following.includes(userId));
//       } catch (err) {
//         console.error("Error in fetchData:", err);
//         const message =
//           err.response?.data?.message || "Failed to load profile or posts";
//         toast.error(message);
//         if (message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, navigate]);

//   const handleFollowToggle = async () => {
//     try {
//       if (isFollowing) {
//         await unfollowUser(userId);
//         toast.success("User unfollowed successfully");
//       } else {
//         await followUser(userId);
//         toast.success("User followed successfully");
//       }
//       // Refresh followers, following, and follow status
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(userId),
//         getFollowing(userId),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const currentUser = await getUserProfile();
//       setIsFollowing(currentUser.following.includes(userId));
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         `Failed to ${isFollowing ? "unfollow" : "follow"} user`;
//       toast.error(message);
//     }
//   };

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
//                 src={user?.profilePicture || "https://via.placeholder.com/150"}
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

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleFollowToggle}
//                 className={`mt-4 px-4 py-2 rounded-full transition-colors ${
//                   isFollowing
//                     ? "bg-red-500 hover:bg-red-600 text-white"
//                     : "bg-indigo-500 hover:bg-indigo-600 text-white"
//                 }`}
//                 aria-label={isFollowing ? "Unfollow user" : "Follow user"}
//               >
//                 {isFollowing ? "Unfollow" : "Follow"}
//               </motion.button>
//             </div>
//           </div>
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
//                         className="flex items-center gap-3 py-2 border-b border-gray-200"
//                       >
//                         <img
//                           src={
//                             follower.profilePicture ||
//                             "https://via.placeholder.com/50"
//                           }
//                           alt={`${follower.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                         <p className="text-gray-900">{follower.username}</p>
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
//                         className="flex items-center gap-3 py-2 border-b border-gray-200"
//                       >
//                         <img
//                           src={
//                             followedUser.profilePicture ||
//                             "https://via.placeholder.com/50"
//                           }
//                           alt={`${followedUser.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                         <p className="text-gray-900">{followedUser.username}</p>
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

//         {/* Posts History Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="bg-white rounded-xl p-6 sm:p-8 shadow-lg"
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 mb-6">Posts</h3>
//           {posts.length === 0 ? (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center text-gray-500"
//             >
//               No posts yet.
//             </motion.p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {posts.map((post) => (
//                 <motion.div
//                   key={post._id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative aspect-square rounded-lg overflow-hidden group"
//                 >
//                   <Link
//                     to={`/posts/${post._id}`}
//                     className="block w-full h-full"
//                   >
//                     {post.media ? (
//                       post.media.endsWith(".mp4") ||
//                       post.media.includes("video") ? (
//                         <video
//                           src={post.media}
//                           className="w-full h-full object-cover"
//                           muted
//                           aria-label="Post video thumbnail"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={post.media}
//                           alt="Post media"
//                           className="w-full h-full object-cover"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                       )
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
//                         <span className="text-sm text-center p-2">
//                           {post.title}
//                         </span>
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
//                     <div className="absolute bottom-0 left-0 right-0 p-3">
//                       <p className="text-white text-sm font-semibold line-clamp-2">
//                         {post.title}
//                       </p>
//                     </div>
//                     <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="text-white text-sm flex gap-4">
//                         <span>👍 {post.likes?.length || 0}</span>
//                         <span>👎 {post.downvotes?.length || 0}</span>
//                       </div>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default PublicUserProfile;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import {
//   getUserProfile,
//   getPublicUserProfile,
//   getPosts,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const PublicUserProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view profiles");
//           navigate("/login");
//           return;
//         }

//         // Fetch the public user profile using api.js function
//         const userData = await getPublicUserProfile(userId);
//         setUser(userData);

//         // Fetch posts and filter out anonymous posts
//         const postsRes = await getPosts();
//         setPosts(
//           postsRes.filter(
//             (p) => p.author._id === userData._id && !p.isAnonymous
//           )
//         );

//         // Fetch followers and following
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userData._id),
//           getFollowing(userData._id),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);

//         // Check if the current user is following this user
//         const currentUser = await getUserProfile();
//         setIsFollowing(currentUser.following.includes(userId));
//       } catch (err) {
//         console.error("Error in fetchData:", err);
//         const message =
//           err.response?.data?.message || "Failed to load profile or posts";
//         toast.error(message);
//         if (message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, navigate]);

//   const handleFollowToggle = async () => {
//     try {
//       if (isFollowing) {
//         await unfollowUser(userId);
//         toast.success("User unfollowed successfully");
//       } else {
//         await followUser(userId);
//         toast.success("User followed successfully");
//       }
//       // Refresh followers, following, and follow status
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(userId),
//         getFollowing(userId),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const currentUser = await getUserProfile();
//       setIsFollowing(currentUser.following.includes(userId));
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         `Failed to ${isFollowing ? "unfollow" : "follow"} user`;
//       toast.error(message);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

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
//             isDarkMode ? "text-teal-400" : "text-red-600"
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
//         isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
//       } transition-colors duration-500 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 backdrop-blur-md shadow-md py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className={`flex items-center gap-2 ${
//               isDarkMode
//                 ? "text-teal-400 hover:text-teal-300"
//                 : "text-white hover:text-gray-200"
//             } transition-colors`}
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
//           className={`rounded-xl p-6 sm:p-8 shadow-lg mb-8 ${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           }`}
//           role="region"
//           aria-label="User profile"
//         >
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//             <div className="relative">
//               <img
//                 src={
//                   user?.profilePicture ||
//                   "https://avatar.iran.liara.run/public/49"
//                 }
//                 alt="Profile picture"
//                 className={`w-24 h-24 rounded-full object-cover border-2 ${
//                   isDarkMode ? "border-teal-500" : "border-indigo-500"
//                 }`}
//                 onError={(e) =>
//                   (e.target.src = "https://avatar.iran.liara.run/public/49")
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
//                     isDarkMode ? "text-teal-300" : "text-indigo-900"
//                   }`}
//                 >
//                   {user?.username || user?.email}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFollowers(true)}
//                     className={`text-sm ${
//                       isDarkMode
//                         ? "text-gray-400 hover:text-teal-400"
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
//                         ? "text-gray-400 hover:text-teal-400"
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

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleFollowToggle}
//                 className={`mt-4 px-4 py-2 rounded-full transition-colors ${
//                   isDarkMode
//                     ? isFollowing
//                       ? "bg-red-500 hover:bg-red-600"
//                       : "bg-teal-500 hover:bg-teal-600"
//                     : isFollowing
//                     ? "bg-red-500 hover:bg-red-600"
//                     : "bg-indigo-500 hover:bg-indigo-600"
//                 } text-white`}
//                 aria-label={isFollowing ? "Unfollow user" : "Follow user"}
//               >
//                 {isFollowing ? "Unfollow" : "Follow"}
//               </motion.button>
//             </div>
//           </div>
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
//                 className={`rounded-lg p-6 w-full max-w-sm shadow-lg ${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 }`}
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
//                         isDarkMode ? "text-gray-200" : "text-gray-700"
//                       }`}
//                     >
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className={`flex items-center gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <img
//                           src={
//                             follower.profilePicture ||
//                             "https://avatar.iran.liara.run/public/41"
//                           }
//                           alt={`${follower.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                           onError={(e) =>
//                             (e.target.src =
//                               "https://avatar.iran.liara.run/public/41")
//                           }
//                         />
//                         <p
//                           className={`${
//                             isDarkMode ? "text-gray-100" : "text-gray-900"
//                           }`}
//                         >
//                           {follower.username}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowers(false)}
//                     className={`px-4 py-2 rounded-full transition-colors ${
//                       isDarkMode
//                         ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
//                         : "bg-gray-300 text-gray-900 hover:bg-gray-400"
//                     }`}
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
//                 className={`rounded-lg p-6 w-full max-w-sm shadow-lg ${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 }`}
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
//                         isDarkMode ? "text-gray-200" : "text-gray-700"
//                       }`}
//                     >
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className={`flex items-center gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <img
//                           src={
//                             followedUser.profilePicture ||
//                             "https://avatar.iran.liara.run/public/9"
//                           }
//                           alt={`${followedUser.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                           onError={(e) =>
//                             (e.target.src =
//                               "https://avatar.iran.liara.run/public/9")
//                           }
//                         />
//                         <p
//                           className={`${
//                             isDarkMode ? "text-gray-100" : "text-gray-900"
//                           }`}
//                         >
//                           {followedUser.username}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex justify-end mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFollowing(false)}
//                     className={`px-4 py-2 rounded-full transition-colors ${
//                       isDarkMode
//                         ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
//                         : "bg-gray-300 text-gray-900 hover:bg-gray-400"
//                     }`}
//                     aria-label="Close following modal"
//                   >
//                     Close
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Posts History Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className={`rounded-xl p-6 sm:p-8 shadow-lg ${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           }`}
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3
//             className={`text-2xl font-bold ${
//               isDarkMode ? "text-teal-300" : "text-indigo-900"
//             } mb-6`}
//           >
//             Posts
//           </h3>
//           {posts.length === 0 ? (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className={`text-center ${
//                 isDarkMode ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               No posts yet.
//             </motion.p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {posts.map((post) => (
//                 <motion.div
//                   key={post._id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative aspect-square rounded-lg overflow-hidden group"
//                 >
//                   <Link
//                     to={`/posts/${post._id}`}
//                     className="block w-full h-full"
//                   >
//                     {post.media ? (
//                       post.media.endsWith(".mp4") ||
//                       post.media.includes("video") ? (
//                         <video
//                           src={post.media}
//                           className="w-full h-full object-cover"
//                           muted
//                           aria-label="Post video thumbnail"
//                           onError={(e) =>
//                             (e.target.src =
//                               "https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={post.media}
//                           alt="Post media"
//                           className="w-full h-full object-cover"
//                           onError={(e) =>
//                             (e.target.src =
//                               "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                           }
//                         />
//                       )
//                     ) : (
//                       <div
//                         className={`w-full h-full flex items-center justify-center ${
//                           isDarkMode
//                             ? "bg-gray-800 text-gray-400"
//                             : "bg-gray-200 text-gray-500"
//                         }`}
//                       >
//                         <span className="text-sm text-center p-2">
//                           {post.title}
//                         </span>
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
//                     <div className="absolute bottom-0 left-0 right-0 p-3">
//                       <p className="text-white text-sm font-semibold line-clamp-2">
//                         {post.title}
//                       </p>
//                     </div>
//                     <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="text-white text-sm flex gap-4">
//                         <span>👍 {post.likes?.length || 0}</span>
//                         <span>👎 {post.downvotes?.length || 0}</span>
//                       </div>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default PublicUserProfile;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import Masonry from "react-masonry-css";
// import {
//   getUserProfile,
//   getPublicUserProfile,
//   getPosts,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const PublicUserProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view profiles");
//           navigate("/login");
//           return;
//         }

//         // Fetch the public user profile using api.js function
//         const userData = await getPublicUserProfile(userId);
//         setUser(userData);

//         // Fetch posts and filter out anonymous posts
//         const postsRes = await getPosts();
//         setPosts(
//           postsRes.filter(
//             (p) => p.author._id === userData._id && !p.isAnonymous
//           )
//         );

//         // Fetch followers and following
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userData._id).catch(() => []),
//           getFollowing(userData._id).catch(() => []),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);

//         // Check if the current user is following this user
//         const currentUser = await getUserProfile();
//         setIsFollowing(currentUser.following.includes(userId));
//       } catch (err) {
//         console.error("Error in fetchData:", err);
//         const message =
//           err.response?.data?.message || "Failed to load profile or posts";
//         toast.error(message);
//         if (message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, navigate]);

//   const handleFollowToggle = async () => {
//     try {
//       if (isFollowing) {
//         await unfollowUser(userId);
//         toast.success("User unfollowed successfully");
//       } else {
//         await followUser(userId);
//         toast.success("User followed successfully");
//       }
//       // Refresh followers, following, and follow status
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(userId),
//         getFollowing(userId),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const currentUser = await getUserProfile();
//       setIsFollowing(currentUser.following.includes(userId));
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         `Failed to ${isFollowing ? "unfollow" : "follow"} user`;
//       toast.error(message);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Masonry breakpoints
//   const breakpointColumnsObj = {
//     default: 3,
//     1100: 2,
//     700: 1,
//   };

//   if (loading) {
//     return (
//       <div
//         className={`flex justify-center items-center h-screen ${
//           isDarkMode ? "bg-gray-900" : "bg-gray-50"
//         }`}
//       >
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.2 }}
//           className={`text-2xl font-medium ${
//             isDarkMode ? "text-white" : "text-red-600"
//           }`}
//         >
//           <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm2 0a4 4 0 108 0 4 4 0 00-8 0zm4-8a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-50"
//       } pt-16 pb-8 px-4 sm:px-6 lg:px-8 font-[Inter,sans-serif] transition-colors duration-300`}
//     >
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 shadow-lg py-3 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-red-200 transition-colors duration-200"
//             aria-label="Back to home"
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Home
//           </Link>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors duration-200"
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

//       <div className="max-w-5xl mx-auto">
//         {/* Profile Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className={`${
//             isDarkMode ? "bg-gray-800" : "bg-white"
//           } rounded-lg shadow-lg mt-4 overflow-hidden transition-colors duration-300`}
//           role="region"
//           aria-label="User profile"
//         >
//           <div className="relative h-40 bg-gradient-to-r from-red-600 to-red-800">
//             <div className="absolute inset-0 bg-black/20"></div>
//           </div>
//           <div className="relative -mt-20 px-6 pb-6">
//             <div className="flex justify-center">
//               <div
//                 className={`relative ${
//                   user?.streak > 0
//                     ? "p-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
//                     : ""
//                 }`}
//               >
//                 <img
//                   src={
//                     user?.profilePicture ||
//                     "https://avatar.iran.liara.run/public/49"
//                   }
//                   alt="Profile picture"
//                   className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
//                   onError={(e) =>
//                     (e.target.src = "https://avatar.iran.liara.run/public/49")
//                   }
//                 />
//                 {user?.streak > 0 && (
//                   <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
//                     <HiFire className="h-3 w-3 text-white" />
//                     <span className="text-xs font-medium text-white ml-1">
//                       {user?.streak || 0}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="text-center mt-4">
//               <h2
//                 className={`text-xl font-semibold ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 {user?.username || user?.email}
//               </h2>
//               <p
//                 className={`mt-1 text-sm ${
//                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                 } max-w-md mx-auto`}
//               >
//                 {user?.bio || "No bio yet."}
//               </p>
//               <div className="flex justify-center gap-6 mt-2 text-sm">
//                 <button
//                   onClick={() => setShowFollowers(true)}
//                   className={`font-medium ${
//                     isDarkMode
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-red-600"
//                   }`}
//                   aria-label="View followers"
//                 >
//                   <span className="font-semibold">
//                     {user?.followersCount || 0}
//                   </span>{" "}
//                   Followers
//                 </button>
//                 <button
//                   onClick={() => setShowFollowing(true)}
//                   className={`font-medium ${
//                     isDarkMode
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-red-600"
//                   }`}
//                   aria-label="View following"
//                 >
//                   <span className="font-semibold">
//                     {user?.followingCount || 0}
//                   </span>{" "}
//                   Following
//                 </button>
//               </div>
//               <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
//                 <p>
//                   Joined:{" "}
//                   {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//                 </p>
//               </div>
//               <div className="flex justify-center mt-4">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleFollowToggle}
//                   className={`px-4 py-1.5 rounded-full transition-colors text-sm font-medium ${
//                     isFollowing
//                       ? "bg-red-600 text-white hover:bg-red-700"
//                       : "bg-red-600 text-white hover:bg-red-700"
//                   }`}
//                   aria-label={isFollowing ? "Unfollow user" : "Follow user"}
//                 >
//                   {isFollowing ? "Unfollow" : "Follow"}
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Posts Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className={`${
//             isDarkMode ? "bg-gray-800" : "bg-white"
//           } rounded-lg p-6 shadow-lg mt-4 transition-colors duration-300`}
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3
//             className={`text-lg font-semibold ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             } mb-3`}
//           >
//             Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className={`text-center ${
//                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                 } text-sm`}
//               >
//                 No posts yet.
//               </motion.p>
//             ) : (
//               <Masonry
//                 breakpointCols={breakpointColumnsObj}
//                 className="flex w-auto -mx-2"
//                 columnClassName="px-2"
//               >
//                 {posts.map((post) => (
//                   <motion.div
//                     key={post._id}
//                     initial={{ opacity: 0, scale: 0.98 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.98 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative rounded-lg overflow-hidden shadow-sm mb-4 group"
//                   >
//                     <Link to={`/posts/${post._id}`} className="block w-full">
//                       {post.media ? (
//                         post.media.endsWith(".mp4") ||
//                         post.media.includes("video") ? (
//                           <video
//                             src={post.media}
//                             className="w-full h-auto object-cover"
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
//                             className="w-full h-auto object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                             }
//                           />
//                         )
//                       ) : (
//                         <div
//                           className={`w-full h-48 flex items-center justify-center ${
//                             isDarkMode
//                               ? "bg-gray-700 text-gray-300"
//                               : "bg-gray-100 text-gray-600"
//                           }`}
//                         >
//                           <span className="text-sm text-center p-2">
//                             {post.title}
//                           </span>
//                         </div>
//                       )}
//                       <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
//                       <div className="absolute bottom-0 left-0 right-0 p-3">
//                         <p className="text-white text-xs font-medium line-clamp-2">
//                           {post.title}
//                         </p>
//                       </div>
//                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <div className="text-white text-xs flex gap-3">
//                           <span>👍 {post.likes?.length || 0}</span>
//                           <span>👎 {post.downvotes?.length || 0}</span>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//               </Masonry>
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
//               className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Followers list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className={`${
//                   isDarkMode ? "bg-gray-800/90" : "bg-white/90"
//                 } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   } mb-3`}
//                 >
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-64 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className={`flex items-center gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <Link
//                           to={`/profile/${follower._id}`}
//                           className="flex items-center gap-3"
//                           onClick={() => setShowFollowers(false)}
//                         >
//                           <img
//                             src={
//                               follower.profilePicture ||
//                               "https://avatar.iran.liara.run/public/41"
//                             }
//                             alt={`${follower.username}'s profile picture`}
//                             className="w-8 h-8 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public/41")
//                             }
//                           />
//                           <p
//                             className={`text-sm font-medium ${
//                               isDarkMode ? "text-white" : "text-gray-900"
//                             }`}
//                           >
//                             {follower.username}
//                           </p>
//                         </Link>
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
//                         ? "bg-gray-700/90 text-gray-200"
//                         : "bg-gray-200/90 text-gray-900"
//                     } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
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
//               className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Following list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className={`${
//                   isDarkMode ? "bg-gray-800/90" : "bg-white/90"
//                 } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   } mb-3`}
//                 >
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-64 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className={`flex items-center gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <Link
//                           to={`/profile/${followedUser._id}`}
//                           className="flex items-center gap-3"
//                           onClick={() => setShowFollowing(false)}
//                         >
//                           <img
//                             src={
//                               followedUser.profilePicture ||
//                               "https://avatar.iran.liara.run/public/9"
//                             }
//                             alt={`${followedUser.username}'s profile picture`}
//                             className="w-8 h-8 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public/9")
//                             }
//                           />
//                           <p
//                             className={`text-sm font-medium ${
//                               isDarkMode ? "text-white" : "text-gray-900"
//                             }`}
//                           >
//                             {followedUser.username}
//                           </p>
//                         </Link>
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
//                         ? "bg-gray-700/90 text-gray-200"
//                         : "bg-gray-200/90 text-gray-900"
//                     } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
//                     aria-label="Close following modal"
//                   >
//                     Close
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

// export default PublicUserProfile;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiFire } from "react-icons/hi";
// import Masonry from "react-masonry-css";
// import {
//   getUserProfile,
//   getPublicUserProfile,
//   getPosts,
//   getFollowers,
//   getFollowing,
//   followUser,
//   unfollowUser,
// } from "../utils/api";

// const PublicUserProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view profiles");
//           navigate("/login");
//           return;
//         }

//         // Fetch the public user profile using api.js function
//         const userData = await getPublicUserProfile(userId);
//         setUser(userData);

//         // Fetch posts and filter out anonymous posts
//         const postsRes = await getPosts();
//         setPosts(
//           postsRes.filter(
//             (p) => p.author._id === userData._id && !p.isAnonymous
//           )
//         );

//         // Fetch followers and following
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(userData._id).catch(() => []),
//           getFollowing(userData._id).catch(() => []),
//         ]);
//         setFollowers(followersData);
//         setFollowing(followingData);

//         // Check if the current user is following this user
//         const currentUser = await getUserProfile();
//         setIsFollowing(currentUser.following.includes(userId));
//       } catch (err) {
//         console.error("Error in fetchData:", err);
//         const message =
//           err.response?.data?.message || "Failed to load profile or posts";
//         toast.error(message);
//         if (message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, navigate]);

//   const handleFollowToggle = async () => {
//     try {
//       if (isFollowing) {
//         await unfollowUser(userId);
//         toast.success("User unfollowed successfully");
//       } else {
//         await followUser(userId);
//         toast.success("User followed successfully");
//       }
//       // Refresh followers, following, and follow status
//       const [followersData, followingData] = await Promise.all([
//         getFollowers(userId),
//         getFollowing(userId),
//       ]);
//       setFollowers(followersData);
//       setFollowing(followingData);
//       const currentUser = await getUserProfile();
//       setIsFollowing(currentUser.following.includes(userId));
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         `Failed to ${isFollowing ? "unfollow" : "follow"} user`;
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
//       name: "Newbie",
//       description: "Reached 100 points in Fun Meter",
//       achieved: user?.badges?.includes("Newbie") || user?.funMeter >= 100,
//       icon: "🌟",
//     },
//     {
//       name: "Gossip Pro",
//       description: "Reached 500 points in Fun Meter",
//       achieved: user?.badges?.includes("Gossip Pro") || user?.funMeter >= 500,
//       icon: "🏅",
//     },
//     {
//       name: "Trendsetter",
//       description: "Reached 1000 points in Fun Meter",
//       achieved: user?.badges?.includes("Trendsetter") || user?.funMeter >= 1000,
//       icon: "🎖️",
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
//         : `Reached ${reward} for a milestone streak`,
//       achieved: true,
//       icon: reward.startsWith("Day ") ? "🔥" : "🎉",
//     })),
//   ];

//   // Masonry breakpoints
//   const breakpointColumnsObj = {
//     default: 3,
//     1100: 2,
//     700: 1,
//   };

//   if (loading) {
//     return (
//       <div
//         className={`flex justify-center items-center h-screen ${
//           isDarkMode ? "bg-gray-900" : "bg-gray-50"
//         }`}
//       >
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.2 }}
//           className={`text-2xl font-medium ${
//             isDarkMode ? "text-white" : "text-red-600"
//           }`}
//         >
//           <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm2 0a4 4 0 108 0 4 4 0 00-8 0zm4-8a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-50"
//       } pt-16 pb-8 px-4 sm:px-6 lg:px-8 font-[Inter,sans-serif] transition-colors duration-300`}
//     >
//       {/* Sticky Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 shadow-lg py-3 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-red-200 transition-colors duration-200"
//             aria-label="Back to home"
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Home
//           </Link>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors duration-200"
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

//       <div className="max-w-5xl mx-auto">
//         {/* Profile Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className={`${
//             isDarkMode ? "bg-gray-800" : "bg-white"
//           } rounded-lg shadow-lg mt-4 overflow-hidden transition-colors duration-300`}
//           role="region"
//           aria-label="User profile"
//         >
//           <div className="relative h-40 bg-gradient-to-r from-red-600 to-red-800">
//             <div className="absolute inset-0 bg-black/20"></div>
//           </div>
//           <div className="relative -mt-20 px-6 pb-6">
//             <div className="flex justify-center">
//               <div
//                 className={`relative ${
//                   user?.reactionStreak > 0
//                     ? "p-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
//                     : ""
//                 }`}
//               >
//                 <img
//                   src={
//                     user?.profilePicture ||
//                     "https://avatar.iran.liara.run/public/49"
//                   }
//                   alt="Profile picture"
//                   className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
//                   onError={(e) =>
//                     (e.target.src = "https://avatar.iran.liara.run/public/49")
//                   }
//                 />
//                 {user?.reactionStreak > 0 && (
//                   <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1 flex items-center">
//                     <HiFire className="h-3 w-3 text-white" />
//                     <span className="text-xs font-medium text-white ml-1">
//                       {user?.reactionStreak || 0}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="text-center mt-4">
//               <div className="flex justify-center items-center gap-2">
//                 <h2
//                   className={`text-xl font-semibold ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   {user?.username || user?.email}
//                 </h2>
//                 <span
//                   className={`text-xs font-medium px-2 py-1 rounded-full ${
//                     isDarkMode
//                       ? "bg-red-900/50 text-red-300"
//                       : "bg-red-100 text-red-600"
//                   }`}
//                 >
//                   Level {user?.level || 1}
//                 </span>
//               </div>
//               <p
//                 className={`mt-1 text-sm ${
//                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                 } max-w-md mx-auto`}
//               >
//                 {user?.bio || "No bio yet."}
//               </p>
//               <div className="flex justify-center gap-6 mt-2 text-sm">
//                 <button
//                   onClick={() => setShowFollowers(true)}
//                   className={`font-medium ${
//                     isDarkMode
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-red-600"
//                   }`}
//                   aria-label="View followers"
//                 >
//                   <span className="font-semibold">
//                     {user?.followersCount || 0}
//                   </span>{" "}
//                   Followers
//                 </button>
//                 <button
//                   onClick={() => setShowFollowing(true)}
//                   className={`font-medium ${
//                     isDarkMode
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-red-600"
//                   }`}
//                   aria-label="View following"
//                 >
//                   <span className="font-semibold">
//                     {user?.followingCount || 0}
//                   </span>{" "}
//                   Following
//                 </button>
//               </div>
//               <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
//                 <p>
//                   Joined:{" "}
//                   {user ? new Date(user.createdAt).toLocaleDateString() : ""}
//                 </p>
//                 <p>Fun Meter: {user?.funMeter || 0}</p>
//               </div>
//               <div className="flex justify-center mt-4">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleFollowToggle}
//                   className={`px-4 py-1.5 rounded-full transition-colors text-sm font-medium ${
//                     isFollowing
//                       ? "bg-gray-600 text-white hover:bg-gray-700"
//                       : "bg-red-600 text-white hover:bg-red-700"
//                   }`}
//                   aria-label={isFollowing ? "Unfollow user" : "Follow user"}
//                 >
//                   {isFollowing ? "Unfollow" : "Follow"}
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//           {/* Achievements */}
//           <div className="px-6 pb-6">
//             <h3
//               className={`text-lg font-semibold ${
//                 isDarkMode ? "text-white" : "text-gray-900"
//               } mb-3`}
//             >
//               Achievements
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {badges.map((badge) => (
//                 <motion.div
//                   key={badge.name}
//                   whileHover={{ scale: 1.03 }}
//                   className={`p-3 rounded-lg ${
//                     badge.achieved
//                       ? isDarkMode
//                         ? "bg-red-900/50"
//                         : "bg-red-100"
//                       : isDarkMode
//                       ? "bg-gray-700/50 opacity-50"
//                       : "bg-gray-200/50 opacity-50"
//                   } flex items-center gap-3 transition-colors duration-300`}
//                   role="button"
//                   aria-label={`${badge.name} badge: ${badge.description}, ${
//                     badge.achieved ? "achieved" : "not achieved"
//                   }`}
//                   tabIndex={0}
//                 >
//                   <span className="text-lg">{badge.icon}</span>
//                   <div>
//                     <p
//                       className={`text-sm font-medium ${
//                         isDarkMode ? "text-white" : "text-gray-900"
//                       }`}
//                     >
//                       {badge.name}
//                     </p>
//                     <p
//                       className={`text-xs ${
//                         isDarkMode ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       {badge.description}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//         {/* Posts Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className={`${
//             isDarkMode ? "bg-gray-800" : "bg-white"
//           } rounded-lg p-6 shadow-lg mt-4 transition-colors duration-300`}
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3
//             className={`text-lg font-semibold ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             } mb-3`}
//           >
//             Posts
//           </h3>
//           <AnimatePresence>
//             {posts.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className={`text-center ${
//                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                 } text-sm`}
//               >
//                 No posts yet.
//               </motion.p>
//             ) : (
//               <Masonry
//                 breakpointCols={breakpointColumnsObj}
//                 className="flex w-auto -mx-2"
//                 columnClassName="px-2"
//               >
//                 {posts.map((post) => (
//                   <motion.div
//                     key={post._id}
//                     initial={{ opacity: 0, scale: 0.98 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.98 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative rounded-lg overflow-hidden shadow-sm mb-4 group"
//                   >
//                     <Link to={`/posts/${post._id}`} className="block w-full">
//                       {post.media ? (
//                         post.media.endsWith(".mp4") ||
//                         post.media.includes("video") ? (
//                           <video
//                             src={post.media}
//                             className="w-full h-auto object-cover"
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
//                             className="w-full h-auto object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                             }
//                           />
//                         )
//                       ) : (
//                         <div
//                           className={`w-full h-48 flex items-center justify-center ${
//                             isDarkMode
//                               ? "bg-gray-700 text-gray-300"
//                               : "bg-gray-100 text-gray-600"
//                           }`}
//                         >
//                           <span className="text-sm text-center p-2">
//                             {post.title}
//                           </span>
//                         </div>
//                       )}
//                       <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
//                       <div className="absolute bottom-0 left-0 right-0 p-3">
//                         <p className="text-white text-xs font-medium line-clamp-2">
//                           {post.title}
//                         </p>
//                       </div>
//                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <div className="text-white text-xs flex gap-3">
//                           <span>👍 {post.likes?.length || 0}</span>
//                           <span>💖 {post.loves?.length || 0}</span>
//                           <span>😂 {post.laughs?.length || 0}</span>
//                           <span>😢 {post.sads?.length || 0}</span>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//               </Masonry>
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
//               className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Followers list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className={`${
//                   isDarkMode ? "bg-gray-800/90" : "bg-white/90"
//                 } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   } mb-3`}
//                 >
//                   Followers ({user?.followersCount || 0})
//                 </h3>
//                 <div className="max-h-64 overflow-y-auto">
//                   {followers.length === 0 ? (
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       No followers yet.
//                     </p>
//                   ) : (
//                     followers.map((follower) => (
//                       <div
//                         key={follower._id}
//                         className={`flex items-center gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <Link
//                           to={`/profile/${follower._id}`}
//                           className="flex items-center gap-3"
//                           onClick={() => setShowFollowers(false)}
//                         >
//                           <img
//                             src={
//                               follower.profilePicture ||
//                               "https://avatar.iran.liara.run/public/41"
//                             }
//                             alt={`${follower.username}'s profile picture`}
//                             className="w-8 h-8 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public/41")
//                             }
//                           />
//                           <p
//                             className={`text-sm font-medium ${
//                               isDarkMode ? "text-white" : "text-gray-900"
//                             }`}
//                           >
//                             {follower.username}
//                           </p>
//                         </Link>
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
//                         ? "bg-gray-700/90 text-gray-200"
//                         : "bg-gray-200/90 text-gray-900"
//                     } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
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
//               className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//               role="dialog"
//               aria-label="Following list modal"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className={`${
//                   isDarkMode ? "bg-gray-800/90" : "bg-white/90"
//                 } backdrop-blur-md rounded-lg p-5 w-full max-w-sm shadow-lg transition-colors duration-300`}
//               >
//                 <h3
//                   className={`text-lg font-semibold ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   } mb-3`}
//                 >
//                   Following ({user?.followingCount || 0})
//                 </h3>
//                 <div className="max-h-64 overflow-y-auto">
//                   {following.length === 0 ? (
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       Not following anyone yet.
//                     </p>
//                   ) : (
//                     following.map((followedUser) => (
//                       <div
//                         key={followedUser._id}
//                         className={`flex items-center gap-3 py-2 border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <Link
//                           to={`/profile/${followedUser._id}`}
//                           className="flex items-center gap-3"
//                           onClick={() => setShowFollowing(false)}
//                         >
//                           <img
//                             src={
//                               followedUser.profilePicture ||
//                               "https://avatar.iran.liara.run/public/9"
//                             }
//                             alt={`${followedUser.username}'s profile picture`}
//                             className="w-8 h-8 rounded-full object-cover"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public/9")
//                             }
//                           />
//                           <p
//                             className={`text-sm font-medium ${
//                               isDarkMode ? "text-white" : "text-gray-900"
//                             }`}
//                           >
//                             {followedUser.username}
//                           </p>
//                         </Link>
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
//                         ? "bg-gray-700/90 text-gray-200"
//                         : "bg-gray-200/90 text-gray-900"
//                     } px-4 py-1.5 rounded-full hover:bg-gray-300/90 transition-colors duration-200 text-sm font-medium`}
//                     aria-label="Close following modal"
//                   >
//                     Close
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

// export default PublicUserProfile;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { HiFire } from "react-icons/hi";
import Masonry from "react-masonry-css";
import {
  getUserProfile,
  getPublicUserProfile,
  getPosts,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../utils/api";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

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
        setPostsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view profiles");
          navigate("/login");
          return;
        }

        // Fetch the public user profile
        const userData = await getPublicUserProfile(userId);
        setUser(userData);

        // Fetch initial posts authored by the user
        const postsRes = await getPosts({
          page: 1,
          limit: 10,
          authorId: userId,
        });
        const postsArray = Array.isArray(postsRes.posts || postsRes)
          ? postsRes.posts || postsRes
          : [];
        const userPosts = postsArray.filter(
          (p) => p.author._id === userData._id && !p.isAnonymous
        );
        setPosts(userPosts);
        setHasMore(postsArray.length === 10); // Assume more posts if we get the full limit
        setPostsLoading(false);

        // Fetch followers and following
        const [followersData, followingData] = await Promise.all([
          getFollowers(userData._id).catch(() => []),
          getFollowing(userData._id).catch(() => []),
        ]);
        setFollowers(followersData);
        setFollowing(followingData);

        // Check if the current user is following this user
        const currentUser = await getUserProfile();
        setIsFollowing(currentUser.following.includes(userId));
      } catch (err) {
        console.error("Error in fetchData:", err);
        const message =
          err.response?.data?.message || "Failed to load profile or posts";
        toast.error(message);
        if (message.includes("401")) navigate("/login");
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    };
    fetchData();
  }, [userId, navigate]);

  // Fetch more posts for infinite scrolling
  const fetchMorePosts = useCallback(async () => {
    if (!hasMore || postsLoading) return;
    try {
      setPostsLoading(true);
      const nextPage = page + 1;
      const postsRes = await getPosts({
        page: nextPage,
        limit: 10,
        authorId: userId,
      });
      const postsArray = Array.isArray(postsRes.posts || postsRes)
        ? postsRes.posts || postsRes
        : [];
      const newPosts = postsArray.filter(
        (p) =>
          p.author._id === userId &&
          !p.isAnonymous &&
          !posts.some((existingPost) => existingPost._id === p._id)
      );
      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage(nextPage);
      }
      setHasMore(postsArray.length === 10);
    } catch (err) {
      toast.error("Failed to load more posts");
    } finally {
      setPostsLoading(false);
    }
  }, [page, hasMore, postsLoading, userId, posts]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || postsLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
      }
    };
  }, [fetchMorePosts, hasMore, postsLoading]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        toast.success("User unfollowed successfully");
      } else {
        await followUser(userId);
        toast.success("User followed successfully");
      }
      const [followersData, followingData] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
      const currentUser = await getUserProfile();
      setIsFollowing(currentUser.following.includes(userId));
    } catch (err) {
      const message =
        err.response?.data?.message ||
        `Failed to ${isFollowing ? "unfollow" : "follow"} user`;
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
      name: "Newbie",
      description: "Reached 100 points in Fun Meter",
      achieved: user?.badges?.includes("Newbie") || user?.funMeter >= 100,
      icon: "🌟",
    },
    {
      name: "Gossip Pro",
      description: "Reached 500 points in Fun Meter",
      achieved: user?.badges?.includes("Gossip Pro") || user?.funMeter >= 500,
      icon: "🏅",
    },
    {
      name: "Trendsetter",
      description: "Reached 1000 points in Fun Meter",
      achieved: user?.badges?.includes("Trendsetter") || user?.funMeter >= 1000,
      icon: "🎖️",
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
        : `Reached ${reward} for a milestone streak`,
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
        {/* Profile Section */}
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
                    user?.profilePicture ||
                    "https://avatar.iran.liara.run/public/49"
                  }
                  alt="Profile picture"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                  onError={(e) =>
                    (e.target.src = "https://avatar.iran.liara.run/public/49")
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
              <div className="flex justify-center items-center gap-2">
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.username || user?.email}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isDarkMode
                      ? "bg-red-900/50 text-red-300"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  Level {user?.level || 1}
                </span>
              </div>
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
              <div className="flex justify-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollowToggle}
                  className={`px-4 py-1.5 rounded-full transition-colors text-sm font-medium ${
                    isFollowing
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                  aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </motion.button>
              </div>
            </div>
          </div>
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
                  } flex items-center gap-3 transition-colors duration-300`}
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

        {/* Posts Section */}
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
            Posts
          </h3>
          <AnimatePresence>
            {postsLoading && posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className={`text-2xl font-medium ${
                    isDarkMode ? "text-white" : "text-red-600"
                  }`}
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm2 0a4 4 0 108 0 4 4 0 00-8 0zm4-8a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                No posts yet.
              </motion.p>
            ) : (
              <>
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
                    </motion.div>
                  ))}
                </Masonry>
                <div ref={sentinelRef} className="h-10" />
                {postsLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center py-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className={`text-2xl font-medium ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm2 0a4 4 0 108 0 4 4 0 00-8 0zm4-8a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
                {!hasMore && posts.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } mt-4`}
                  >
                    No more posts to load.
                  </motion.p>
                )}
              </>
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
                        className={`flex items-center gap-3 py-2 border-b ${
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
                        className={`flex items-center gap-3 py-2 border-b ${
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
                              "https://avatar.iran.liara.run/public/9"
                            }
                            alt={`${followedUser.username}'s profile picture`}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src =
                                "https://avatar.iran.liara.run/public/9")
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
      </div>
    </div>
  );
};

export default PublicUserProfile;
