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
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view profiles");
//           navigate("/login");
//           return;
//         }

//         // Fetch the public user profile using api.js function
//         const userData = await getPublicUserProfile(userId);
//         setUser(userData);

//         // Fetch posts
//         const postsRes = await getPosts();
//         setPosts(postsRes.filter((p) => p.author._id === userData._id));

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
//         toast.error(err.message || "Failed to load profile or posts");
//         if (err.message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, navigate]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

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
//       toast.error(
//         err.message || `Failed to ${isFollowing ? "unfollow" : "follow"} user`
//       );
//     }
//   };

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
//                   user?.profilePicture
//                     ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${
//                         user.profilePicture
//                       }`
//                     : "https://via.placeholder.com/150"
//                 }
//                 alt="Profile picture"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 dark:border-teal-500"
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

//               <button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleFollowToggle}
//                 className={`mt-4 px-4 py-2 rounded-full transition-colors ${
//                   isFollowing
//                     ? "bg-red-500 hover:bg-red-600 text-white"
//                     : "bg-indigo-500 dark:bg-teal-500 hover:bg-indigo-600 dark:hover:bg-teal-600 text-white"
//                 }`}
//                 aria-label={isFollowing ? "Unfollow user" : "Follow user"}
//               >
//                 {isFollowing ? "Unfollow" : "Follow"}
//               </button>
//             </div>
//           </div>
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
//                         className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <img
//                           src={
//                             follower.profilePicture
//                               ? `${import.meta.env.VITE_API_URL.replace(
//                                   "/api",
//                                   ""
//                                 )}${follower.profilePicture}`
//                               : "https://via.placeholder.com/50"
//                           }
//                           alt={`${follower.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <p className="text-gray-900 dark:text-gray-100">
//                           {follower.username}
//                         </p>
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
//                         className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <img
//                           src={
//                             followedUser.profilePicture
//                               ? `${import.meta.env.VITE_API_URL.replace(
//                                   "/api",
//                                   ""
//                                 )}${followedUser.profilePicture}`
//                               : "https://via.placeholder.com/50"
//                           }
//                           alt={`${followedUser.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <p className="text-gray-900 dark:text-gray-100">
//                           {followedUser.username}
//                         </p>
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

//         {/* Posts History Section */}
//         <div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg"
//           role="region"
//           aria-label="User posts history"
//         >
//           <h3 className="text-2xl font-bold text-indigo-900 dark:text-teal-300 mb-6">
//             Posts
//           </h3>
//           {posts.length === 0 ? (
//             <p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center text-gray-500 dark:text-gray-400"
//             >
//               No posts yet.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {posts.map((post) => (
//                 <div
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
//                       post.media.endsWith(".mp4") ? (
//                         <video
//                           src={`${import.meta.env.VITE_API_URL.replace(
//                             "/api",
//                             ""
//                           )}${post.media}`}
//                           className="w-full h-full object-cover"
//                           muted
//                           aria-label="Post video thumbnail"
//                         />
//                       ) : (
//                         <img
//                           src={`${import.meta.env.VITE_API_URL.replace(
//                             "/api",
//                             ""
//                           )}${post.media}`}
//                           alt="Post media"
//                           className="w-full h-full object-cover"
//                         />
//                       )
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
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
//                         <span>👍 {post.likes.length}</span>
//                         <span>👎 {post.downvotes.length}</span>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicUserProfile;

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
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
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
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view profiles");
//           navigate("/login");
//           return;
//         }

//         // Fetch the public user profile using api.js function
//         const userData = await getPublicUserProfile(userId);
//         setUser(userData);

//         // Fetch posts
//         const postsRes = await getPosts();
//         setPosts(postsRes.filter((p) => p.author._id === userData._id));

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
//         toast.error(err.message || "Failed to load profile or posts");
//         if (err.message.includes("401")) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, navigate]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

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
//       toast.error(
//         err.message || `Failed to ${isFollowing ? "unfollow" : "follow"} user`
//       );
//     }
//   };

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
//                 src={user?.profilePicture || "https://via.placeholder.com/150"}
//                 alt="Profile picture"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 dark:border-teal-500"
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

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleFollowToggle}
//                 className={`mt-4 px-4 py-2 rounded-full transition-colors ${
//                   isFollowing
//                     ? "bg-red-500 hover:bg-red-600 text-white"
//                     : "bg-indigo-500 dark:bg-teal-500 hover:bg-indigo-600 dark:hover:bg-teal-600 text-white"
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
//                         className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <img
//                           src={
//                             follower.profilePicture ||
//                             "https://via.placeholder.com/50"
//                           }
//                           alt={`${follower.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <p className="text-gray-900 dark:text-gray-100">
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
//                         className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
//                       >
//                         <img
//                           src={
//                             followedUser.profilePicture ||
//                             "https://via.placeholder.com/50"
//                           }
//                           alt={`${followedUser.username}'s profile picture`}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <p className="text-gray-900 dark:text-gray-100">
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
//             Posts
//           </h3>
//           {posts.length === 0 ? (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center text-gray-500 dark:text-gray-400"
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
//                         />
//                       ) : (
//                         <img
//                           src={post.media}
//                           alt="Post media"
//                           className="w-full h-full object-cover"
//                         />
//                       )
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
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
//                         <span>👍 {post.likes.length}</span>
//                         <span>👎 {post.downvotes.length}</span>
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

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { HiFire } from "react-icons/hi";
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

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
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view profiles");
          navigate("/login");
          return;
        }

        // Fetch the public user profile using api.js function
        const userData = await getPublicUserProfile(userId);
        setUser(userData);

        // Fetch posts
        const postsRes = await getPosts();
        setPosts(postsRes.filter((p) => p.author._id === userData._id));

        // Fetch followers and following
        const [followersData, followingData] = await Promise.all([
          getFollowers(userData._id),
          getFollowing(userData._id),
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
      }
    };
    fetchData();
  }, [userId, navigate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        toast.success("User unfollowed successfully");
      } else {
        await followUser(userId);
        toast.success("User followed successfully");
      }
      // Refresh followers, following, and follow status
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
                src={user?.profilePicture || "https://via.placeholder.com/150"}
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

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowToggle}
                className={`mt-4 px-4 py-2 rounded-full transition-colors ${
                  isFollowing
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-indigo-500 dark:bg-teal-500 hover:bg-indigo-600 dark:hover:bg-teal-600 text-white"
                }`}
                aria-label={isFollowing ? "Unfollow user" : "Follow user"}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </motion.button>
            </div>
          </div>
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
                        className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
                      >
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
                        className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
                      >
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
            Posts
          </h3>
          {posts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400"
            >
              No posts yet.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                        <span>👍 {post.likes.length}</span>
                        <span>👎 {post.downvotes.length}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
