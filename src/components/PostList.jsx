// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   HiArrowUp,
//   HiDocumentText,
//   HiChatAlt,
//   HiPlus,
//   HiBell,
//   HiUser,
//   HiFire,
//   HiSearch,
//   HiShare,
//   HiUserAdd,
// } from "react-icons/hi";
// import {
//   getPosts,
//   getUserProfile,
//   getPublicUserProfile,
//   getUsers,
//   followUser,
//   unfollowUser,
// } from "../utils/api";
// import Logo from "../assets/GossippHublogo.svg";
// import confetti from "canvas-confetti";

// const PostList = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [categories, setCategories] = useState(["All"]);
//   const [displayedCount, setDisplayedCount] = useState(6);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestedUsers, setSuggestedUsers] = useState([]);
//   const [followedUsers, setFollowedUsers] = useState([]);
//   const POSTS_PER_PAGE = 7;
//   const isAuthenticated = !!localStorage.getItem("token");

//   // Utility function to shuffle an array
//   const shuffleArray = (array) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [postsRes] = await Promise.all([getPosts()]);
//         // Ensure posts with invalid media are filtered out early
//         const sanitizedPosts = postsRes.map((post) => ({
//           ...post,
//           media:
//             typeof post.media === "string" && post.media.trim() !== ""
//               ? post.media
//               : null,
//         }));
//         setPosts(sanitizedPosts);
//         const uniqueCategories = [
//           "All",
//           ...new Set(sanitizedPosts.map((post) => post.category || "General")),
//         ];
//         setCategories(uniqueCategories);

//         if (isAuthenticated) {
//           try {
//             const userRes = await getUserProfile();
//             setUser(userRes);

//             const shownRewards =
//               JSON.parse(localStorage.getItem("shownStreakRewards")) || [];
//             const dailyReward = `Day ${userRes.reactionStreak} Streak`;
//             if (
//               userRes.streakRewards.includes(dailyReward) &&
//               !shownRewards.includes(dailyReward)
//             ) {
//               toast.success(`🏆 ${dailyReward} Achieved!`);
//               localStorage.setItem(
//                 "shownStreakRewards",
//                 JSON.stringify([...shownRewards, dailyReward])
//               );
//             }

//             if (userRes.reactionStreak % 7 === 0) {
//               const weekNumber = userRes.reactionStreak / 7;
//               const milestoneReward = `Week ${weekNumber} Milestone`;
//               if (
//                 userRes.streakRewards.includes(milestoneReward) &&
//                 !shownRewards.includes(milestoneReward)
//               ) {
//                 toast.success(`🎉 ${milestoneReward} Achieved!`);
//                 confetti({
//                   particleCount: 150,
//                   spread: 90,
//                   origin: { y: 0.6 },
//                 });
//                 localStorage.setItem(
//                   "shownStreakRewards",
//                   JSON.stringify([...shownRewards, milestoneReward])
//                 );
//               }
//             }

//             setFollowedUsers(userRes.following || []);

//             try {
//               const allUsers = await getUsers();
//               const suggestedUserIds = allUsers
//                 .filter(
//                   (u) =>
//                     u._id !== userRes._id &&
//                     !(userRes.following || []).includes(u._id)
//                 )
//                 .slice(0, 10)
//                 .map((u) => u._id);

//               if (suggestedUserIds.length === 0) {
//                 setSuggestedUsers([]);
//                 return;
//               }

//               const suggestedUsersData = await Promise.all(
//                 suggestedUserIds.map(async (userId) => {
//                   try {
//                     const userData = await getPublicUserProfile(userId);
//                     return userData;
//                   } catch (err) {
//                     console.error(`Failed to fetch user ${userId}:`, err);
//                     return null;
//                   }
//                 })
//               );

//               const filteredUsers = suggestedUsersData.filter(
//                 (user) => user !== null
//               );
//               // Shuffle the filtered users before setting state
//               const shuffledUsers = shuffleArray(filteredUsers);
//               setSuggestedUsers(shuffledUsers);
//             } catch (err) {
//               toast.error("Failed to load suggested users");
//               setSuggestedUsers([]);
//             }
//           } catch (err) {
//             const message =
//               err.response?.data?.message || "Failed to fetch user profile";
//             toast.error(message);
//             if (message.includes("401")) navigate("/login");
//           }
//         }
//       } catch (err) {
//         const message = err.response?.data?.message || "Failed to fetch posts";
//         toast.error(message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     setDisplayedCount(POSTS_PER_PAGE);
//   }, [selectedCategory]);

//   const filteredPosts =
//     selectedCategory === "All"
//       ? posts
//       : posts.filter(
//           (post) => (post.category || "General") === selectedCategory
//         );

//   const searchedPosts = searchQuery
//     ? filteredPosts.filter(
//         (post) =>
//           post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           post.description.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : filteredPosts;

//   const displayedPosts = searchedPosts.slice(0, displayedCount);

//   // Debug video posts calculation
//   const videoPosts = displayedPosts
//     .filter((post) => {
//       const isVideo =
//         post.media &&
//         typeof post.media === "string" &&
//         post.media.endsWith(".mp4");
//       return isVideo;
//     })
//     .slice(0, 5);

//   // Log videoPosts for debugging
//   useEffect(() => {
//     console.log("Video Posts:", videoPosts);
//     console.log("Displayed Posts:", displayedPosts);
//   }, [videoPosts, displayedPosts]);

//   const loadMore = () => {
//     setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
//   };

//   const profileImage = isAuthenticated
//     ? user?.profilePicture || "https://via.placeholder.com/150"
//     : null;

//   const featuredPost = displayedPosts.length > 0 ? displayedPosts[0] : null;
//   const remainingPosts = displayedPosts.slice(1);

//   const photoPosts = displayedPosts
//     .filter(
//       (post) =>
//         post.media &&
//         typeof post.media === "string" &&
//         !post.media.endsWith(".mp4")
//     )
//     .slice(0, 5);

//   const mostViewedPosts = displayedPosts
//     .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//     .slice(0, 3);

//   const latestStories = posts
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);

//   const trends = posts
//     .sort((a, b) => {
//       const totalReactionsA =
//         (a.likes?.length || 0) +
//         (a.loves?.length || 0) +
//         (a.laughs?.length || 0) +
//         (a.sads?.length || 0);
//       const totalReactionsB =
//         (b.likes?.length || 0) +
//         (b.loves?.length || 0) +
//         (b.laughs?.length || 0) +
//         (b.sads?.length || 0);
//       return totalReactionsB - totalReactionsA;
//     })
//     .slice(0, 5);

//   const recentComments = posts
//     .flatMap((post) =>
//       (post.comments || []).map((comment) => ({
//         postId: post._id,
//         postTitle: post.title,
//         commentText: comment.text,
//         commentDate: comment.createdAt,
//       }))
//     )
//     .sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate))
//     .slice(0, 4);

//   const recommendedPosts = filteredPosts
//     .sort(() => Math.random() - 0.5)
//     .slice(0, 3);

//   const handleQuickShare = (post) => {
//     const shareUrl = `${window.location.origin}/posts/${post._id}`;
//     const stripHtmlTags = (text) => {
//       return text
//         .replace(/<[^>]+>/g, "")
//         .replace(/\s+/g, " ")
//         .trim();
//     };
//     const truncateDescription = (text, maxLength = 100) => {
//       if (text.length <= maxLength) return text;
//       const lastSpace = text.lastIndexOf(" ", maxLength);
//       const truncateAt = lastSpace === -1 ? maxLength : lastSpace;
//       return text.substring(0, truncateAt) + "...";
//     };
//     const cleanDescription = stripHtmlTags(post.description);
//     const truncatedDescription = truncateDescription(cleanDescription);

//     if (navigator.share) {
//       navigator
//         .share({
//           title: post.title,
//           text: `${post.title}\n${truncatedDescription}`,
//           url: shareUrl,
//         })
//         .then(() => toast.success("Shared successfully!"))
//         .catch(() => toast.error("Failed to share post"));
//     } else {
//       navigator.clipboard
//         .writeText(shareUrl)
//         .then(() => toast.success("Link copied to clipboard!"))
//         .catch(() => toast.error("Failed to copy link"));
//     }
//   };

//   const handleFollow = async (userId) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to follow users");
//       return;
//     }

//     try {
//       const isCurrentlyFollowing = followedUsers.includes(userId);
//       if (isCurrentlyFollowing) {
//         await unfollowUser(userId);
//         setFollowedUsers((prev) => prev.filter((id) => id !== userId));
//         setSuggestedUsers((prev) =>
//           prev.map((user) =>
//             user._id === userId
//               ? { ...user, followersCount: (user.followersCount || 1) - 1 }
//               : user
//           )
//         );
//         toast.success("Unfollowed user!");
//       } else {
//         await followUser(userId);
//         setFollowedUsers((prev) => [...prev, userId]);
//         setSuggestedUsers((prev) =>
//           prev.map((user) =>
//             user._id === userId
//               ? { ...user, followersCount: (user.followersCount || 0) + 1 }
//               : user
//           )
//         );
//         toast.success("Followed user!");
//       }

//       const updatedUser = await getUserProfile();
//       setFollowedUsers(updatedUser.following || []);

//       // Refetch and reshuffle suggested users after follow/unfollow
//       const allUsers = await getUsers();
//       const newSuggestedUserIds = allUsers
//         .filter(
//           (u) =>
//             u._id !== user._id && !(updatedUser.following || []).includes(u._id)
//         )
//         .slice(0, 10)
//         .map((u) => u._id);

//       if (newSuggestedUserIds.length === 0) {
//         setSuggestedUsers([]);
//         return;
//       }

//       const newSuggestedUsersData = await Promise.all(
//         newSuggestedUserIds.map(async (userId) => {
//           try {
//             const userData = await getPublicUserProfile(userId);
//             return userData;
//           } catch (err) {
//             console.error(`Failed to fetch user ${userId}:`, err);
//             return null;
//           }
//         })
//       );

//       const filteredNewUsers = newSuggestedUsersData.filter(
//         (user) => user !== null
//       );
//       const shuffledNewUsers = shuffleArray(filteredNewUsers);
//       setSuggestedUsers(shuffledNewUsers);
//     } catch (err) {
//       const message = err.message || "Failed to update follow status";
//       toast.error(message);
//       if (message.includes("401")) {
//         navigate("/login");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 font-poppins">
//       <Helmet>
//         <title>GossipHub | Discover Trending Posts & Stories</title>
//         <meta
//           name="description"
//           content="Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
//         />
//         <meta
//           name="keywords"
//           content="social media, posts, gossip, trending stories, user suggestions, GossipHub"
//         />
//         <meta name="robots" content="index, follow" />
//         <meta name="author" content="GossipHub Team" />
//         <meta
//           property="og:title"
//           content="GossipHub | Discover Trending Posts & Stories"
//         />
//         <meta
//           property="og:description"
//           content="Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
//         />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://gossipphub.netlify.app/" />
//         <meta property="og:image" content={Logo} />
//         <meta property="og:image:alt" content="GossipHub Logo" />
//         <meta property="og:site_name" content="GossipHub" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta
//           name="twitter:title"
//           content="GossipHub | Discover Trending Posts & Stories"
//         />
//         <meta
//           name="twitter:description"
//           content="Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
//         />
//         <meta name="twitter:image" content={Logo} />
//         <meta name="twitter:image:alt" content="GossipHub Logo" />
//         <link rel="canonical" href="https://gossipphub.netlify.app/" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             name: "GossipHub | Discover Trending Posts & Stories",
//             description:
//               "Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!",
//             url: "https://gossipphub.netlify.app/",
//             publisher: {
//               "@type": "Organization",
//               name: "GossipHub",
//               logo: {
//                 "@type": "ImageObject",
//                 url: Logo,
//               },
//             },
//             mainEntity: {
//               "@type": "CollectionPage",
//               name: "Trending Posts",
//               description:
//                 "A collection of trending posts and stories on GossipHub.",
//             },
//           })}
//         </script>
//       </Helmet>

//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/80 backdrop-blur-md text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link to="/" className="flex items-center">
//             <motion.img
//               src={Logo}
//               alt="GossipHub Logo"
//               className="h-10 md:h-12 rounded-md"
//               whileHover={{ scale: 1.1 }}
//               transition={{ duration: 0.3 }}
//             />
//           </Link>
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search posts..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setDisplayedCount(POSTS_PER_PAGE);
//                 }}
//                 className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//             </div>
//             <nav className="hidden md:flex items-center space-x-3">
//               <Link
//                 to="/create-post"
//                 className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Create Post
//               </Link>
//               <Link
//                 to="/notifications"
//                 className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Notifications
//               </Link>
//               {isAuthenticated && (
//                 <div className="flex items-center space-x-2">
//                   <motion.div
//                     className="flex items-center bg-orange-500 rounded-full px-3 py-1"
//                     whileHover={{ scale: 1.1 }}
//                   >
//                     <HiFire className="h-5 w-5 text-white mr-1" />
//                     <span className="text-sm font-medium">
//                       {user?.reactionStreak || 0}
//                     </span>
//                   </motion.div>
//                   <Link
//                     to="/profile"
//                     className="flex items-center"
//                     aria-label="Profile"
//                   >
//                     <motion.img
//                       src={profileImage}
//                       alt="User profile picture"
//                       className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
//                       whileHover={{ scale: 1.1 }}
//                       onError={(e) =>
//                         (e.target.src = "https://via.placeholder.com/150")
//                       }
//                     />
//                   </Link>
//                 </div>
//               )}
//               {!isAuthenticated && (
//                 <Link
//                   to="/login"
//                   className="flex items-center"
//                   aria-label="Login"
//                 >
//                   <motion.img
//                     src="https://via.placeholder.com/150"
//                     alt="Login"
//                     className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
//                     whileHover={{ scale: 1.1 }}
//                   />
//                 </Link>
//               )}
//             </nav>
//           </div>
//         </div>
//         <div className="bg-white/90 backdrop-blur-md text-gray-700 shadow-md">
//           <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
//             {categories.map((category) => (
//               <motion.button
//                 key={category}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   setDisplayedCount(POSTS_PER_PAGE);
//                 }}
//                 className={`px-3 py-1 text-sm font-medium uppercase tracking-wide rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
//                   selectedCategory === category
//                     ? "bg-red-600 text-white"
//                     : "hover:bg-red-100 hover:text-red-600"
//                 }`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label={`Filter by ${category}`}
//               >
//                 {category}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 pt-40 md:pt-36 pb-20 md:pb-12">
//         {loading ? (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="mb-8"
//           >
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="md:w-2/3">
//                 <div className="relative rounded-xl overflow-hidden shadow-xl">
//                   <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse"></div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
//                     <div className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-24 h-6 bg-gray-300 animate-pulse"></div>
//                     <div className="h-8 md:h-10 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
//                     <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="md:w-1/3 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
//                 <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
//                 <ul className="space-y-3">
//                   {[...Array(4)].map((_, index) => (
//                     <li key={index} className="text-sm text-gray-700">
//                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
//                       <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </motion.section>
//         ) : (
//           featuredPost && (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="mb-8"
//             >
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="md:w-2/3">
//                   <Link to={`/posts/${featuredPost._id}`}>
//                     <motion.div
//                       className="relative rounded-xl overflow-hidden shadow-xl"
//                       whileHover={{ scale: 1.02 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {featuredPost.media &&
//                         (featuredPost.media.endsWith(".mp4") ? (
//                           <video
//                             src={featuredPost.media}
//                             className="w-full h-64 md:h-96 object-cover"
//                             muted
//                             autoPlay
//                             loop
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/300")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={featuredPost.media}
//                             alt="Featured post"
//                             className="w-full h-64 md:h-96 object-cover"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/300")
//                             }
//                           />
//                         ))}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
//                         <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-fit">
//                           {featuredPost.category || "General"}
//                         </span>
//                         <motion.h2
//                           className="text-2xl md:text-4xl font-bold text-white"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.2 }}
//                         >
//                           {featuredPost.title}
//                         </motion.h2>
//                         <motion.p
//                           className="text-gray-200 mt-2 line-clamp-2"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.3 }}
//                         >
//                           {featuredPost.description
//                             .split("\n\n")
//                             .map((paragraph, pIdx) => (
//                               <div
//                                 key={pIdx}
//                                 className="mb-4 last:mb-0"
//                                 dangerouslySetInnerHTML={{ __html: paragraph }}
//                               />
//                             ))}
//                         </motion.p>
//                       </div>
//                     </motion.div>
//                   </Link>
//                 </div>
//                 <motion.div
//                   className="md:w-1/3 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                     <HiChatAlt className="h-6 w-6 text-blue-500 mr-2" />
//                     Recent Activity
//                   </h3>
//                   <ul className="space-y-3">
//                     {recentComments.length > 0 ? (
//                       recentComments.map((comment, index) => (
//                         <motion.li
//                           key={index}
//                           className="text-sm text-gray-700"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                         >
//                           <Link
//                             to={`/posts/${comment.postId}`}
//                             className="font-medium text-gray-900 hover:text-red-600 transition-colors"
//                           >
//                             {comment.postTitle.length > 40
//                               ? `${comment.postTitle.slice(0, 40)}...`
//                               : comment.postTitle}
//                           </Link>
//                           <p className="text-gray-600 mt-1 line-clamp-1">
//                             {comment.commentText}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {new Date(comment.commentDate).toLocaleDateString(
//                               "en-US",
//                               {
//                                 month: "short",
//                                 day: "numeric",
//                               }
//                             )}
//                           </p>
//                         </motion.li>
//                       ))
//                     ) : (
//                       <li className="text-sm text-gray-500">
//                         No recent activity available.
//                       </li>
//                     )}
//                   </ul>
//                 </motion.div>
//               </div>
//             </motion.section>
//           )
//         )}

//         {loading ? (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="mb-8"
//           >
//             <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//             <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//               {[...Array(5)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="min-w-[200px] bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//                 >
//                   <div className="w-full h-32 bg-gray-200"></div>
//                   <div className="p-3">
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.section>
//         ) : (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="mb-8"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//               <HiFire className="h-6 w-6 text-orange-500 mr-2" />
//               Trending Now
//             </h3>
//             <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//               {trends.map((trend, index) => (
//                 <motion.div
//                   key={trend._id}
//                   className="min-w-[200px] bg-white rounded-xl shadow-lg overflow-hidden"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <Link to={`/posts/${trend._id}`}>
//                     {trend.media &&
//                       (trend.media.endsWith(".mp4") ? (
//                         <video
//                           src={trend.media}
//                           className="w-full h-32 object-cover"
//                           muted
//                           autoPlay
//                           loop
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={trend.media}
//                           alt="Trending post"
//                           className="w-full h-32 object-cover"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                       ))}
//                     <div className="p-3">
//                       <p className="text-sm font-medium text-gray-900 line-clamp-2">
//                         {trend.title}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {trend.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.section>
//         )}

//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="md:w-2/3">
//             {loading ? (
//               <div className="grid grid-cols-1 gap-6">
//                 {[...Array(4)].map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className="bg-white rounded-xl shadow-md p-4 animate-pulse"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
//                     <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
//                     <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//                   </motion.div>
//                 ))}
//               </div>
//             ) : remainingPosts.length === 0 ? (
//               <motion.div
//                 className="text-center py-12 bg-white rounded-xl shadow-md"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <HiDocumentText className="mx-auto h-24 w-24 text-red-400" />
//                 <h3 className="mt-4 text-xl font-semibold text-gray-900">
//                   No Gossips in {selectedCategory}!
//                 </h3>
//                 <p className="mt-2 text-gray-600 max-w-md mx-auto text-sm">
//                   Spill some tea and get the conversation started!
//                 </p>
//                 <Link
//                   to="/create-post"
//                   className="mt-6 inline-block px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
//                 >
//                   Share Your Gossip
//                 </Link>
//               </motion.div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6">
//                 <AnimatePresence>
//                   {remainingPosts.map((post, index) => (
//                     <motion.div
//                       key={post._id}
//                       className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <div className="flex flex-col sm:flex-row relative">
//                         {post.media && (
//                           <div className="sm:w-1/3">
//                             {post.media.endsWith(".mp4") ? (
//                               <video
//                                 src={post.media}
//                                 controls
//                                 className="w-full h-40 object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://via.placeholder.com/150")
//                                 }
//                               />
//                             ) : (
//                               <img
//                                 src={post.media}
//                                 alt="Post media"
//                                 className="w-full h-40 object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://via.placeholder.com/150")
//                                 }
//                               />
//                             )}
//                           </div>
//                         )}
//                         <div className="p-4 sm:w-2/3">
//                           <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1">
//                             {post.category || "General"}
//                           </span>
//                           <h3 className="text-lg font-bold text-gray-900 mt-2">
//                             <Link
//                               to={`/posts/${post._id}`}
//                               className="hover:text-red-600 transition-colors duration-200"
//                             >
//                               {post.title}
//                             </Link>
//                           </h3>
//                           <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//                             {post.description
//                               .split("\n\n")
//                               .map((paragraph, pIdx) => (
//                                 <div
//                                   key={pIdx}
//                                   className="mb-4 last:mb-0"
//                                   dangerouslySetInnerHTML={{
//                                     __html: paragraph,
//                                   }}
//                                 />
//                               ))}
//                           </p>
//                           <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
//                             <p>
//                               By{" "}
//                               {post.isAnonymous
//                                 ? "Anonymous"
//                                 : post.author?.username || "Unknown"}
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               <motion.span
//                                 className="flex items-center"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 👍 {post.likes?.length || 0}
//                               </motion.span>
//                               <motion.span
//                                 className="flex items-center"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 💖 {post.loves?.length || 0}
//                               </motion.span>
//                               <motion.span
//                                 className="flex items-center"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 😂 {post.laughs?.length || 0}
//                               </motion.span>
//                               <motion.span
//                                 className="flex items-center"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 😢 {post.sads?.length || 0}
//                               </motion.span>
//                               <motion.span
//                                 className="flex items-center"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <HiChatAlt className="h-4 w-4 text-blue-400 mr-1" />
//                                 {post.comments?.length || 0}
//                               </motion.span>
//                             </div>
//                           </div>
//                         </div>
//                         <motion.button
//                           className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleQuickShare(post)}
//                           aria-label="Quick share"
//                         >
//                           <HiShare className="h-5 w-5 text-gray-600" />
//                         </motion.button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//                 {remainingPosts.length < searchedPosts.length - 1 && (
//                   <div className="flex justify-center mt-8">
//                     <motion.button
//                       onClick={loadMore}
//                       className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       aria-label="Load more posts"
//                     >
//                       Load More
//                     </motion.button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="md:w-1/3 space-y-6 md:sticky md:top-36 md:h-[calc(100vh-144px)] md:overflow-y-auto scrollbar-hide">
//             {isAuthenticated && (
//               <motion.section
//                 className="bg-white p-4 rounded-xl shadow-lg"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                   <HiFire className="h-6 w-6 text-orange-500 mr-2" />
//                   Your Reaction Streak
//                 </h3>
//                 <div className="text-center">
//                   <p className="text-4xl font-bold text-orange-600">
//                     {user?.reactionStreak || 0}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Day{user?.reactionStreak !== 1 ? "s" : ""} Streak
//                   </p>
//                   <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
//                     <motion.div
//                       className="bg-orange-500 h-2.5 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{
//                         width: `${Math.min(
//                           (user?.reactionStreak || 0) * 10,
//                           100
//                         )}%`,
//                       }}
//                       transition={{ duration: 1 }}
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Next Milestone:{" "}
//                     {user?.reactionStreak
//                       ? Math.ceil(user.reactionStreak / 7) * 7
//                       : 7}{" "}
//                     Days
//                   </p>
//                 </div>
//                 <div className="mt-4">
//                   <h4 className="text-sm font-semibold text-gray-900 mb-2">
//                     Achievements
//                   </h4>
//                   {user?.streakRewards?.length > 0 ? (
//                     <ul className="space-y-2">
//                       {user.streakRewards.map((reward, index) => (
//                         <motion.li
//                           key={index}
//                           className="flex items-center text-sm text-gray-700"
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                         >
//                           <span className="mr-2 text-2xl">
//                             {reward.startsWith("Day ") ? "🔥" : "🎉"}
//                           </span>
//                           {reward}
//                         </motion.li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-sm text-gray-500">
//                       No achievements yet. Keep reacting daily!
//                     </p>
//                   )}
//                 </div>
//               </motion.section>
//             )}

//             {loading ? (
//               <motion.section
//                 className="bg-white p-4 rounded-xl shadow-lg"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//               >
//                 <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//                 <div className="space-y-4">
//                   {[...Array(5)].map((_, index) => (
//                     <div key={index} className="flex gap-3 animate-pulse">
//                       <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//                       <div className="flex-1">
//                         <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                         <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.section>
//             ) : (
//               <motion.section
//                 className="bg-white p-4 rounded-xl shadow-lg"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//               >
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">
//                   Latest Stories
//                 </h3>
//                 <div className="space-y-4">
//                   {latestStories.length > 0 ? (
//                     latestStories.map((story) => (
//                       <motion.div
//                         key={story._id}
//                         className="flex gap-3"
//                         whileHover={{ scale: 1.02 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <Link to={`/posts/${story._id}`} className="flex gap-3">
//                           {story.media &&
//                             (story.media.endsWith(".mp4") ? (
//                               <video
//                                 src={story.media}
//                                 className="w-16 h-16 object-cover rounded-lg"
//                                 muted
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://via.placeholder.com/50")
//                                 }
//                               />
//                             ) : (
//                               <img
//                                 src={story.media}
//                                 alt="Story thumbnail"
//                                 className="w-16 h-16 object-cover rounded-lg"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://via.placeholder.com/50")
//                                 }
//                               />
//                             ))}
//                           <div>
//                             <p className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">
//                               {story.title}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {story.category || "General"}
//                             </p>
//                           </div>
//                         </Link>
//                       </motion.div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">
//                       No recent stories available.
//                     </p>
//                   )}
//                 </div>
//               </motion.section>
//             )}

//             {loading ? (
//               <motion.section
//                 className="bg-white p-4 rounded-xl shadow-lg"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//               >
//                 <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, index) => (
//                     <div key={index} className="flex gap-3 animate-pulse">
//                       <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//                       <div className="flex-1">
//                         <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                         <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.section>
//             ) : (
//               <motion.section
//                 className="bg-white p-4 rounded-xl shadow-lg"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//               >
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">
//                   Most Viewed
//                 </h3>
//                 <div className="space-y-4">
//                   {mostViewedPosts.map((post) => (
//                     <motion.div
//                       key={post._id}
//                       className="flex gap-3"
//                       whileHover={{ scale: 1.02 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {post.media &&
//                         (post.media.endsWith(".mp4") ? (
//                           <video
//                             src={post.media}
//                             className="w-16 h-16 object-cover rounded-lg"
//                             muted
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={post.media}
//                             alt="Most viewed post"
//                             className="w-16 h-16 object-cover rounded-lg"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                         ))}
//                       <div>
//                         <Link
//                           to={`/posts/${post._id}`}
//                           className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
//                         >
//                           {post.title}
//                         </Link>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {post.category || "General"}
//                         </p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.section>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mt-12 mb-8"
//           >
//             <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//             <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//               {[...Array(5)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="min-w-[150px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 animate-pulse"
//                 >
//                   <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
//                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
//                   <div className="h-8 bg-gray-200 rounded-full w-20"></div>
//                 </div>
//               ))}
//             </div>
//           </motion.section>
//         ) : (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mt-12 mb-8"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//               <HiUserAdd className="h-6 w-6 text-blue-500 mr-2" />
//               Suggested for You
//             </h3>
//             <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//               {suggestedUsers.length > 0 ? (
//                 suggestedUsers.map((suggestedUser, index) => (
//                   <motion.div
//                     key={suggestedUser._id}
//                     className="min-w-[150px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 relative"
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ scale: 1.05 }}
//                   >
//                     <Link to={`/profile/${suggestedUser._id}`}>
//                       <img
//                         src={
//                           suggestedUser.profilePicture ||
//                           "https://via.placeholder.com/150"
//                         }
//                         alt={`${
//                           suggestedUser.username || suggestedUser.email
//                         }'s profile picture`}
//                         className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//                         onError={(e) =>
//                           (e.target.src = "https://via.placeholder.com/150")
//                         }
//                       />
//                     </Link>
//                     <Link to={`/profile/${suggestedUser._id}`}>
//                       <p className="text-sm font-medium text-gray-900 mt-3 text-center">
//                         {suggestedUser.username && suggestedUser.username.trim()
//                           ? suggestedUser.username
//                           : suggestedUser.email}
//                       </p>
//                     </Link>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {suggestedUser.followersCount || 0} followers
//                     </p>
//                     <motion.button
//                       onClick={() => handleFollow(suggestedUser._id)}
//                       className={`mt-3 px-4 py-1 text-sm font-medium rounded-full transition-colors ${
//                         followedUsers.includes(suggestedUser._id)
//                           ? "bg-gray-200 text-gray-700"
//                           : "bg-blue-500 text-white hover:bg-blue-600"
//                       }`}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       aria-label={
//                         followedUsers.includes(suggestedUser._id)
//                           ? `Unfollow ${
//                               suggestedUser.username || suggestedUser.email
//                             }`
//                           : `Follow ${
//                               suggestedUser.username || suggestedUser.email
//                             }`
//                       }
//                     >
//                       {followedUsers.includes(suggestedUser._id)
//                         ? "Following"
//                         : "Follow"}
//                     </motion.button>
//                   </motion.div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No suggestions available.</p>
//               )}
//             </div>
//           </motion.section>
//         )}

//         {loading ? (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mt-12"
//           >
//             <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {[...Array(3)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//                 >
//                   <div className="w-full h-40 bg-gray-200"></div>
//                   <div className="p-4">
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.section>
//         ) : (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mt-12"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-4">
//               Recommended for You
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {recommendedPosts.map((post, index) => (
//                 <motion.div
//                   key={post._id}
//                   className="bg-white rounded-xl shadow-lg overflow-hidden"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ scale: 1.02 }}
//                 >
//                   <Link to={`/posts/${post._id}`}>
//                     {post.media &&
//                       (post.media.endsWith(".mp4") ? (
//                         <video
//                           src={post.media}
//                           className="w-full h-40 object-cover"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={post.media}
//                           alt="Recommended post"
//                           className="w-full h-40 object-cover"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                       ))}
//                     <div className="p-4">
//                       <p className="text-sm font-medium text-gray-900 line-clamp-2">
//                         {post.title}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {post.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.section>
//         )}

//         {loading ? (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.5 }}
//             className="mt-12"
//           >
//             <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//               {[...Array(5)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
//                 >
//                   <div className="w-full h-32 bg-gray-200"></div>
//                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//                     <div className="h-3 bg-gray-300 rounded w-3/4"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.section>
//         ) : (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.5 }}
//             className="mt-12"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Photos</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//               {photoPosts.length > 0 ? (
//                 photoPosts.map((post) => (
//                   <motion.div
//                     key={post._id}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Link to={`/posts/${post._id}`}>
//                       <div className="relative rounded-lg overflow-hidden shadow-md">
//                         <img
//                           src={post.media}
//                           alt="Photo post"
//                           className="w-full h-32 object-cover"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
//                           <p className="text-xs line-clamp-1">{post.title}</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No photos available.</p>
//               )}
//             </div>
//           </motion.section>
//         )}

//         {loading ? (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.6 }}
//             className="mt-12"
//           >
//             <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//               {[...Array(5)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
//                 >
//                   <div className="w-full h-32 bg-gray-200"></div>
//                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//                     <div className="h-3 bg-gray-300 rounded w-3/4"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.section>
//         ) : (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.6 }}
//             className="mt-12"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Videos</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//               {videoPosts.length > 0 ? (
//                 videoPosts.map((post) => (
//                   <motion.div
//                     key={post._id}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Link to={`/posts/${post._id}`}>
//                       <div className="relative rounded-lg overflow-hidden shadow-md">
//                         <video
//                           src={post.media}
//                           className="w-full h-32 object-cover"
//                           muted
//                           loop
//                           autoPlay
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/150")
//                           }
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
//                           <p className="text-xs line-clamp-1">{post.title}</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No videos available.</p>
//               )}
//             </div>
//           </motion.section>
//         )}
//       </main>

//       <footer className="bg-red-600 text-white py-8">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <div className="flex justify-center space-x-4 mb-4">
//             <Link to="/about" className="text-sm hover:underline">
//               About Us
//             </Link>
//             <Link to="/privacy" className="text-sm hover:underline">
//               Privacy Policy
//             </Link>
//             <Link to="/contact" className="text-sm hover:underline">
//               Contact Us
//             </Link>
//           </div>
//           <div className="mb-4">
//             <h4 className="text-sm font-semibold mb-2">Stay Connected</h4>
//             <div className="flex justify-center space-x-4">
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white hover:text-gray-200"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
//                 </svg>
//               </a>
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white hover:text-gray-200"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M24 12a12 12 0 10-13.9 11.9v-8.4h-3V12h3V9.7a4.2 4.2 0 014.5-4.6 18 18 0 012.7.2v3h-1.6a2 2 0 00-2.3 2.2V12h3.9l-.5 3.4h-3.4v8.4A12 12 0 0024 12z" />
//                 </svg>
//               </a>
//               <a
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white hover:text-gray-200"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 2.2c3.2 0 3.6 0 4.8.1a6.6 6.6 0 012.2.4 3.7 3.7 0 012.2 2.2 6.6 6.6 0 01.4 2.2c.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8a6.6 6.6 0 01-.4 2.2 3.7 3.7 0 01-2.2 2.2 6.6 6.6 0 01-2.2.4c-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1a6.6 6.6 0 01-2.2-.4 3.7 3.7 0 01-2.2-2.2 6.6 6.6 0 01-.4-2.2c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8a6.6 6.6 0 01.4-2.2 3.7 3.7 0 012.2-2.2 6.6 6.6 0 012.2-.4c1.2-.1 1.6-.1 4.8-.1m0-2.2C8.7 0 8.2 0 7 0a8.8 8.8 0 00-2.9.5 5.9 5.9 0 00-3.4 3.4A8.8 8.8 0 000 7c0 1.2 0 1.7.1 3s.1 3.6.1 4.8-.1 3.6-.1 4.8a8.8 8.8 0 00.5 2.9 5.9 5.9 0 003.4 3.4 8.8 8.8 0 002.9.5c1.2 0 1.7 0 3 0s3.6-.1 4.8-.1a8.8 8.8 0 002.9-.5 5.9 5.9 0 003.4-3.4 8.8 8.8 0 00.5-2.9c0-1.2 0-1.7-.1-3s-.1-3.6-.1-4.8.1-3.6.1-4.8a8.8 8.8 0 00-.5-2.9 5.9 5.9 0 00-3.4-3.4A8.8 8.8 0 0017 0c-1.2 0-1.7 0-3 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm7.8-10.5a1.4 1.4 0 11-2.8 0 1.4 1.4 0 012.8 0z" />
//                 </svg>
//               </a>
//             </div>
//           </div>
//           <div className="mb-4">
//             <h4 className="text-sm font-semibold mb-2">
//               Subscribe to Our Newsletter
//             </h4>
//             <form className="flex justify-center">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="px-4 py-2 rounded-l-full bg-white text-gray-900 focus:outline-none"
//               />
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition-colors"
//               >
//                 Subscribe
//               </button>
//             </form>
//           </div>
//           <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
//         </div>
//       </footer>

//       <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 border-t border-gray-200">
//         <div
//           className="flex justify-around items-center py-0 px-4"
//           style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//         >
//           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <Link
//               to="/create-post"
//               className="p-2 rounded-full transition-all duration-200"
//               aria-label="Create Post"
//               title="Create Post"
//             >
//               <HiPlus className="h-5 w-5 text-red-600" />
//             </Link>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <Link
//               to="/notifications"
//               className="p-2 rounded-full transition-all duration-200"
//               aria-label="Notifications"
//               title="Notifications"
//             >
//               <HiBell className="h-5 w-5 text-gray-600" />
//             </Link>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <Link
//               to={isAuthenticated ? "/profile" : "/login"}
//               className="p-1 rounded-full transition-all duration-200"
//               aria-label={isAuthenticated ? "Profile" : "Login"}
//               title={isAuthenticated ? "Profile" : "Login"}
//             >
//               {isAuthenticated ? (
//                 <div className="relative">
//                   <img
//                     src={profileImage}
//                     alt="User profile picture"
//                     className="h-7 w-7 rounded-full object-cover border-2 border-gray-500 hover:border-gray-600 transition-all duration-200"
//                     onError={(e) =>
//                       (e.target.src = "https://via.placeholder.com/150")
//                     }
//                   />
//                   <div className="absolute -top-0.5 -right-0.5 bg-orange-500 rounded-full p-1">
//                     <HiFire className="h-3 w-3 text-white" />
//                   </div>
//                 </div>
//               ) : (
//                 <HiUser className="h-5 w-5 text-gray-600" />
//               )}
//             </Link>
//           </motion.div>
//         </div>
//       </nav>

//       {displayedPosts.length > 5 && (
//         <motion.button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="fixed bottom-20 md:bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
//           aria-label="Back to top"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <HiArrowUp className="h-5 w-5" />
//         </motion.button>
//       )}
//     </div>
//   );
// };

// export default PostList;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowUp,
  HiDocumentText,
  HiChatAlt,
  HiPlus,
  HiBell,
  HiUser,
  HiFire,
  HiSearch,
  HiShare,
  HiUserAdd,
} from "react-icons/hi";
import {
  getPosts,
  getUserProfile,
  getPublicUserProfile,
  getUsers,
  followUser,
  unfollowUser,
} from "../utils/api";
import Logo from "../assets/GossippHublogo.svg";
import confetti from "canvas-confetti";
import { SiYoutubeshorts } from "react-icons/si";

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [displayedCount, setDisplayedCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Add dark mode state
  const POSTS_PER_PAGE = 7;
  const isAuthenticated = !!localStorage.getItem("token");

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes] = await Promise.all([getPosts()]);
        // Ensure posts with invalid media are filtered out early
        const sanitizedPosts = postsRes.map((post) => ({
          ...post,
          media:
            typeof post.media === "string" && post.media.trim() !== ""
              ? post.media
              : null,
        }));
        setPosts(sanitizedPosts);
        const uniqueCategories = [
          "All",
          ...new Set(sanitizedPosts.map((post) => post.category || "General")),
        ];
        setCategories(uniqueCategories);

        if (isAuthenticated) {
          try {
            const userRes = await getUserProfile();
            setUser(userRes);

            const shownRewards =
              JSON.parse(localStorage.getItem("shownStreakRewards")) || [];
            const dailyReward = `Day ${userRes.reactionStreak} Streak`;
            if (
              userRes.streakRewards.includes(dailyReward) &&
              !shownRewards.includes(dailyReward)
            ) {
              toast.success(`🏆 ${dailyReward} Achieved!`);
              localStorage.setItem(
                "shownStreakRewards",
                JSON.stringify([...shownRewards, dailyReward])
              );
            }

            if (userRes.reactionStreak % 7 === 0) {
              const weekNumber = userRes.reactionStreak / 7;
              const milestoneReward = `Week ${weekNumber} Milestone`;
              if (
                userRes.streakRewards.includes(milestoneReward) &&
                !shownRewards.includes(milestoneReward)
              ) {
                toast.success(`🎉 ${milestoneReward} Achieved!`);
                confetti({
                  particleCount: 150,
                  spread: 90,
                  origin: { y: 0.6 },
                });
                localStorage.setItem(
                  "shownStreakRewards",
                  JSON.stringify([...shownRewards, milestoneReward])
                );
              }
            }

            setFollowedUsers(userRes.following || []);

            try {
              const allUsers = await getUsers();
              const suggestedUserIds = allUsers
                .filter(
                  (u) =>
                    u._id !== userRes._id &&
                    !(userRes.following || []).includes(u._id)
                )
                .slice(0, 10)
                .map((u) => u._id);

              if (suggestedUserIds.length === 0) {
                setSuggestedUsers([]);
                return;
              }

              const suggestedUsersData = await Promise.all(
                suggestedUserIds.map(async (userId) => {
                  try {
                    const userData = await getPublicUserProfile(userId);
                    return userData;
                  } catch (err) {
                    console.error(`Failed to fetch user ${userId}:`, err);
                    return null;
                  }
                })
              );

              const filteredUsers = suggestedUsersData.filter(
                (user) => user !== null
              );
              // Shuffle the filtered users before setting state
              const shuffledUsers = shuffleArray(filteredUsers);
              setSuggestedUsers(shuffledUsers);
            } catch (err) {
              toast.error("Failed to load suggested users");
              setSuggestedUsers([]);
            }
          } catch (err) {
            const message =
              err.response?.data?.message || "Failed to fetch user profile";
            toast.error(message);
            if (message.includes("401")) navigate("/login");
          }
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to fetch posts";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setDisplayedCount(POSTS_PER_PAGE);
  }, [selectedCategory]);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter(
          (post) => (post.category || "General") === selectedCategory
        );

  const searchedPosts = searchQuery
    ? filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  const displayedPosts = searchedPosts.slice(0, displayedCount);

  // Debug video posts calculation
  const videoPosts = displayedPosts
    .filter((post) => {
      const isVideo =
        post.media &&
        typeof post.media === "string" &&
        post.media.endsWith(".mp4");
      return isVideo;
    })
    .slice(0, 5);

  // Log videoPosts for debugging
  useEffect(() => {
    console.log("Video Posts:", videoPosts);
    console.log("Displayed Posts:", displayedPosts);
  }, [videoPosts, displayedPosts]);

  const loadMore = () => {
    setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
  };

  const profileImage = isAuthenticated
    ? user?.profilePicture || "https://via.placeholder.com/150"
    : null;

  const featuredPost = displayedPosts.length > 0 ? displayedPosts[0] : null;
  const remainingPosts = displayedPosts.slice(1);

  const photoPosts = displayedPosts
    .filter(
      (post) =>
        post.media &&
        typeof post.media === "string" &&
        !post.media.endsWith(".mp4")
    )
    .slice(0, 5);

  const mostViewedPosts = displayedPosts
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3);

  const latestStories = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const trends = posts
    .sort((a, b) => {
      const totalReactionsA =
        (a.likes?.length || 0) +
        (a.loves?.length || 0) +
        (a.laughs?.length || 0) +
        (a.sads?.length || 0);
      const totalReactionsB =
        (b.likes?.length || 0) +
        (b.loves?.length || 0) +
        (b.laughs?.length || 0) +
        (b.sads?.length || 0);
      return totalReactionsB - totalReactionsA;
    })
    .slice(0, 5);

  const recentComments = posts
    .flatMap((post) =>
      (post.comments || []).map((comment) => ({
        postId: post._id,
        postTitle: post.title,
        commentText: comment.text,
        commentDate: comment.createdAt,
      }))
    )
    .sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate))
    .slice(0, 4);

  const recommendedPosts = filteredPosts
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const handleQuickShare = (post) => {
    const shareUrl = `${window.location.origin}/posts/${post._id}`;
    const stripHtmlTags = (text) => {
      return text
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };
    const truncateDescription = (text, maxLength = 100) => {
      if (text.length <= maxLength) return text;
      const lastSpace = text.lastIndexOf(" ", maxLength);
      const truncateAt = lastSpace === -1 ? maxLength : lastSpace;
      return text.substring(0, truncateAt) + "...";
    };
    const cleanDescription = stripHtmlTags(post.description);
    const truncatedDescription = truncateDescription(cleanDescription);

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: `${post.title}\n${truncatedDescription}`,
          url: shareUrl,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch(() => toast.error("Failed to share post"));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  const handleFollow = async (userId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      const isCurrentlyFollowing = followedUsers.includes(userId);
      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
        setFollowedUsers((prev) => prev.filter((id) => id !== userId));
        setSuggestedUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, followersCount: (user.followersCount || 1) - 1 }
              : user
          )
        );
        toast.success("Unfollowed user!");
      } else {
        await followUser(userId);
        setFollowedUsers((prev) => [...prev, userId]);
        setSuggestedUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, followersCount: (user.followersCount || 0) + 1 }
              : user
          )
        );
        toast.success("Followed user!");
      }

      const updatedUser = await getUserProfile();
      setFollowedUsers(updatedUser.following || []);

      // Refetch and reshuffle suggested users after follow/unfollow
      const allUsers = await getUsers();
      const newSuggestedUserIds = allUsers
        .filter(
          (u) =>
            u._id !== user._id && !(updatedUser.following || []).includes(u._id)
        )
        .slice(0, 10)
        .map((u) => u._id);

      if (newSuggestedUserIds.length === 0) {
        setSuggestedUsers([]);
        return;
      }

      const newSuggestedUsersData = await Promise.all(
        newSuggestedUserIds.map(async (userId) => {
          try {
            const userData = await getPublicUserProfile(userId);
            return userData;
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err);
            return null;
          }
        })
      );

      const filteredNewUsers = newSuggestedUsersData.filter(
        (user) => user !== null
      );
      const shuffledNewUsers = shuffleArray(filteredNewUsers);
      setSuggestedUsers(shuffledNewUsers);
    } catch (err) {
      const message = err.message || "Failed to update follow status";
      toast.error(message);
      if (message.includes("401")) {
        navigate("/login");
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen font-poppins transition-colors duration-500 ${
        isDarkMode ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      <Helmet>
        <title>GossipHub | Discover Trending Posts & Stories</title>
        <meta
          name="description"
          content="Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
        />
        <meta
          name="keywords"
          content="social media, posts, gossip, trending stories, user suggestions, GossipHub"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GossipHub Team" />
        <meta
          property="og:title"
          content="GossipHub | Discover Trending Posts & Stories"
        />
        <meta
          property="og:description"
          content="Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gossiphub.in/" />
        <meta property="og:image" content={Logo} />
        <meta property="og:image:alt" content="GossipHub Logo" />
        <meta property="og:site_name" content="GossipHub" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="GossipHub | Discover Trending Posts & Stories"
        />
        <meta
          name="twitter:description"
          content="Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
        />
        <meta name="twitter:image" content={Logo} />
        <meta name="twitter:image:alt" content="GossipHub Logo" />
        <link rel="canonical" href="https://gossiphub.in/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "GossipHub | Discover Trending Posts & Stories",
            description:
              "Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!",
            url: "https://gossiphub.in/",
            publisher: {
              "@type": "Organization",
              name: "GossipHub",
              logo: {
                "@type": "ImageObject",
                url: Logo,
              },
            },
            mainEntity: {
              "@type": "CollectionPage",
              name: "Trending Posts",
              description:
                "A collection of trending posts and stories on GossipHub.",
            },
          })}
        </script>
      </Helmet>

      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/80 backdrop-blur-md text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <motion.img
              src={Logo}
              alt="GossipHub Logo"
              className="h-10 md:h-12 rounded-md"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayedCount(POSTS_PER_PAGE);
                }}
                className={`pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-950"
                }`}
              />
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <nav className="hidden md:flex items-center space-x-3">
              <Link
                to="/create-post"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Post
              </Link>
              {/* <Link
                to="/shorts"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Watch Shorts
              </Link> */}
              <Link
                to="/notifications"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Notifications
              </Link>
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="flex items-center bg-orange-500 rounded-full px-3 py-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <HiFire className="h-5 w-5 text-white mr-1" />
                    <span className="text-sm font-medium">
                      {user?.reactionStreak || 0}
                    </span>
                  </motion.div>
                  <Link
                    to="/profile"
                    className="flex items-center"
                    aria-label="Profile"
                  >
                    <motion.img
                      src={profileImage}
                      alt="User profile picture"
                      className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                  </Link>
                </div>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center"
                  aria-label="Login"
                >
                  <motion.img
                    src="https://via.placeholder.com/150"
                    alt="Login"
                    className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                  />
                </Link>
              )}
            </nav>
          </div>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white/90"
          } backdrop-blur-md text-gray-500 shadow-md transition-colors duration-500`}
        >
          {/* <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setDisplayedCount(POSTS_PER_PAGE);
                }}
                className={`px-3 py-1 text-sm font-medium uppercase tracking-wide rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700 hover:text-white"
                    : "hover:bg-red-100 hover:text-red-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </motion.button>
            ))}
          </div> */}
          <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setDisplayedCount(POSTS_PER_PAGE);
                }}
                className={`px-3 py-1 text-sm font-medium uppercase tracking-wide rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700 hover:text-white"
                    : "hover:bg-red-100 hover:text-red-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-30 md:pt-36 pb-20 md:pb-12">
        {loading ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                    <div className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-24 h-6 bg-gray-300 animate-pulse"></div>
                    <div className="h-8 md:h-10 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div
                className={`md:w-1/3 ${
                  isDarkMode ? "bg-gray-900" : "bg-white/90"
                } backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors duration-500`}
              >
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                <ul className="space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        ) : (
          featuredPost && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <Link to={`/posts/${featuredPost._id}`}>
                    <motion.div
                      className="relative rounded-xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {featuredPost.media &&
                        (featuredPost.media.endsWith(".mp4") ? (
                          <video
                            src={featuredPost.media}
                            className="w-full h-64 md:h-96 object-cover"
                            muted
                            autoPlay
                            loop
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/300")
                            }
                          />
                        ) : (
                          <img
                            src={featuredPost.media}
                            alt="Featured post"
                            className="w-full h-64 md:h-96 object-cover"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/300")
                            }
                          />
                        ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-fit">
                          {featuredPost.category || "General"}
                        </span>
                        <motion.h2
                          className="text-2xl md:text-4xl font-bold text-white"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {featuredPost.title}
                        </motion.h2>
                        <motion.p
                          className="text-gray-200 mt-2 line-clamp-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {featuredPost.description
                            .split("\n\n")
                            .map((paragraph, pIdx) => (
                              <div
                                key={pIdx}
                                className="mb-4 last:mb-0"
                                dangerouslySetInnerHTML={{ __html: paragraph }}
                              />
                            ))}
                        </motion.p>
                      </div>
                    </motion.div>
                  </Link>
                </div>
                <motion.div
                  className={`md:w-1/3 ${
                    isDarkMode ? "bg-gray-900" : "bg-white/90"
                  } backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors duration-500`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3
                    className={`text-lg font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    } mb-4 flex items-center`}
                  >
                    <HiChatAlt className="h-6 w-6 text-blue-500 mr-2" />
                    Recent Activity
                  </h3>
                  <ul className="space-y-3">
                    {recentComments.length > 0 ? (
                      recentComments.map((comment, index) => (
                        <motion.li
                          key={index}
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={`/posts/${comment.postId}`}
                            className={`font-medium ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            } hover:text-red-600 transition-colors`}
                          >
                            {comment.postTitle.length > 40
                              ? `${comment.postTitle.slice(0, 40)}...`
                              : comment.postTitle}
                          </Link>
                          <p
                            className={`text-gray-600 mt-1 line-clamp-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {comment.commentText}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDarkMode ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {new Date(comment.commentDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </motion.li>
                      ))
                    ) : (
                      <li
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No recent activity available.
                      </li>
                    )}
                  </ul>
                </motion.div>
              </div>
            </motion.section>
          )
        )}

        {loading ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="min-w-[200px] bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-4 flex items-center`}
            >
              <HiFire className="h-6 w-6 text-orange-500 mr-2" />
              Trending Now
            </h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {trends.map((trend, index) => (
                <motion.div
                  key={trend._id}
                  className={`min-w-[200px] ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
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
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ) : (
                        <img
                          src={trend.media}
                          alt="Trending post"
                          className="w-full h-32 object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ))}
                    <div className="p-3">
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        } line-clamp-2`}
                      >
                        {trend.title}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
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
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(4)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-4 animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </motion.div>
                ))}
              </div>
            ) : remainingPosts.length === 0 ? (
              <motion.div
                className={`text-center py-12 ${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                } rounded-xl shadow-md transition-colors duration-500`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <HiDocumentText className="mx-auto h-24 w-24 text-red-400" />
                <h3
                  className={`mt-4 text-xl font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  No Gossips in {selectedCategory}!
                </h3>
                <p
                  className={`mt-2 max-w-md mx-auto text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Spill some tea and get the conversation started!
                </p>
                <Link
                  to="/create-post"
                  className="mt-6 inline-block px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  Share Your Gossip
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {remainingPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      className={`${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } lg:rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transition-colors duration-500`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row relative">
                        {post.media && (
                          <div className="sm:w-1/3">
                            {post.media.endsWith(".mp4") ? (
                              <video
                                src={post.media}
                                controls
                                className="w-full lg:h-45 object-cover "
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/150")
                                }
                              />
                            ) : (
                              <img
                                src={post.media}
                                alt="Post media"
                                className="w-full lg:h-45 object-cover "
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/150")
                                }
                              />
                            )}
                          </div>
                        )}
                        <div className="p-4 sm:w-2/3">
                          <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1">
                            {post.category || "General"}
                          </span>
                          <h3
                            className={`text-lg font-bold ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            } mt-2`}
                          >
                            <Link
                              to={`/posts/${post._id}`}
                              className="hover:text-red-600 transition-colors duration-200"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p
                            className={`text-sm mt-1 line-clamp-2 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {post.description
                              .split("\n\n")
                              .map((paragraph, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="mb-4 last:mb-0"
                                  dangerouslySetInnerHTML={{
                                    __html: paragraph,
                                  }}
                                />
                              ))}
                          </p>
                          <div
                            className={`flex items-center justify-between text-xs mt-3 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <p>
                              By{" "}
                              {post.isAnonymous
                                ? "Anonymous"
                                : post.author?.username || "Unknown"}
                            </p>
                            <div className="flex items-center space-x-2">
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                👍 {post.likes?.length || 0}
                              </motion.span>
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                💖 {post.loves?.length || 0}
                              </motion.span>
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                😂 {post.laughs?.length || 0}
                              </motion.span>
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                😢 {post.sads?.length || 0}
                              </motion.span>
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <HiChatAlt className="h-4 w-4 text-blue-400 mr-1" />
                                {post.comments?.length || 0}
                              </motion.span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          className={`absolute top-4 right-4 p-2 rounded-full ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          } transition-colors duration-500`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuickShare(post)}
                          aria-label="Quick share"
                        >
                          <HiShare
                            className={`h-5 w-5 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {remainingPosts.length < searchedPosts.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <motion.button
                      onClick={loadMore}
                      className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Load more posts"
                    >
                      Load More
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:w-1/3 space-y-6 md:sticky md:top-36 md:h-[calc(100vh-144px)] md:overflow-y-auto scrollbar-hide">
            {isAuthenticated && (
              <motion.section
                className={`${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                } p-4 rounded-xl shadow-lg transition-colors duration-500`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-4 flex items-center`}
                >
                  <HiFire className="h-6 w-6 text-orange-500 mr-2" />
                  Your Reaction Streak
                </h3>
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600">
                    {user?.reactionStreak || 0}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Day{user?.reactionStreak !== 1 ? "s" : ""} Streak
                  </p>
                  <div
                    className={`mt-4 w-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded-full h-2.5 transition-colors duration-500`}
                  >
                    <motion.div
                      className="bg-orange-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (user?.reactionStreak || 0) * 10,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Next Milestone:{" "}
                    {user?.reactionStreak
                      ? Math.ceil(user.reactionStreak / 7) * 7
                      : 7}{" "}
                    Days
                  </p>
                </div>
                <div className="mt-4">
                  <h4
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    } mb-2`}
                  >
                    Achievements
                  </h4>
                  {user?.streakRewards?.length > 0 ? (
                    <ul className="space-y-2">
                      {user.streakRewards.map((reward, index) => (
                        <motion.li
                          key={index}
                          className={`flex items-center text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="mr-2 text-2xl">
                            {reward.startsWith("Day ") ? "🔥" : "🎉"}
                          </span>
                          {reward}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No achievements yet. Keep reacting daily!
                    </p>
                  )}
                </div>
              </motion.section>
            )}

            {loading ? (
              <motion.section
                className="bg-white p-4 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) : (
              <motion.section
                className={`${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                } p-4 rounded-xl shadow-lg transition-colors duration-500`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-4`}
                >
                  Latest Stories
                </h3>
                <div className="space-y-4">
                  {latestStories.length > 0 ? (
                    latestStories.map((story) => (
                      <motion.div
                        key={story._id}
                        className="flex gap-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link to={`/posts/${story._id}`} className="flex gap-3">
                          {story.media &&
                            (story.media.endsWith(".mp4") ? (
                              <video
                                src={story.media}
                                className="w-16 h-16 object-cover rounded-lg"
                                muted
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/50")
                                }
                              />
                            ) : (
                              <img
                                src={story.media}
                                alt="Story thumbnail"
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/50")
                                }
                              />
                            ))}
                          <div>
                            <p
                              className={`text-sm font-medium hover:text-red-600 transition-colors ${
                                isDarkMode ? "text-gray-100" : "text-gray-900"
                              }`}
                            >
                              {story.title}
                            </p>
                            <p
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {story.category || "General"}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No recent stories available.
                    </p>
                  )}
                </div>
              </motion.section>
            )}

            {loading ? (
              <motion.section
                className="bg-white p-4 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) : (
              <motion.section
                className={`${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                } p-4 rounded-xl shadow-lg transition-colors duration-500`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  } mb-4`}
                >
                  Most Viewed
                </h3>
                <div className="space-y-4">
                  {mostViewedPosts.map((post) => (
                    <motion.div
                      key={post._id}
                      className="flex gap-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {post.media &&
                        (post.media.endsWith(".mp4") ? (
                          <video
                            src={post.media}
                            className="w-16 h-16 object-cover rounded-lg"
                            muted
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                        ) : (
                          <img
                            src={post.media}
                            alt="Most viewed post"
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                        ))}
                      <div>
                        <Link
                          to={`/posts/${post._id}`}
                          className={`text-sm font-medium hover:text-red-600 transition-colors ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {post.title}
                        </Link>
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {post.category || "General"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>

        {loading ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 mb-8"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="min-w-[150px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 animate-pulse"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 mb-8"
          >
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-4 flex items-center`}
            >
              <HiUserAdd className="h-6 w-6 text-blue-500 mr-2" />
              Suggested for You
            </h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {suggestedUsers.length > 0 ? (
                suggestedUsers.map((suggestedUser, index) => (
                  <motion.div
                    key={suggestedUser._id}
                    className={`min-w-[150px] ${
                      isDarkMode ? "bg-gray-900" : "bg-white"
                    } rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 relative transition-colors duration-500`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link to={`/profile/${suggestedUser._id}`}>
                      <img
                        src={
                          suggestedUser.profilePicture ||
                          "https://via.placeholder.com/150"
                        }
                        alt={`${
                          suggestedUser.username || suggestedUser.email
                        }'s profile picture`}
                        className={`w-20 h-20 rounded-full object-cover border-2 ${
                          isDarkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                    </Link>
                    <Link to={`/profile/${suggestedUser._id}`}>
                      <p
                        className={`text-sm font-medium mt-3 text-center ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {suggestedUser.username && suggestedUser.username.trim()
                          ? suggestedUser.username
                          : suggestedUser.email}
                      </p>
                    </Link>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {suggestedUser.followersCount || 0} followers
                    </p>
                    <motion.button
                      onClick={() => handleFollow(suggestedUser._id)}
                      className={`mt-3 px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                        followedUsers.includes(suggestedUser._id)
                          ? isDarkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={
                        followedUsers.includes(suggestedUser._id)
                          ? `Unfollow ${
                              suggestedUser.username || suggestedUser.email
                            }`
                          : `Follow ${
                              suggestedUser.username || suggestedUser.email
                            }`
                      }
                    >
                      {followedUsers.includes(suggestedUser._id)
                        ? "Following"
                        : "Follow"}
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <p
                  className={`text-gray-600 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No suggestions available.
                </p>
              )}
            </div>
          </motion.section>
        )}

        {loading ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-4`}
            >
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendedPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  className={`${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                  } rounded-xl shadow-lg overflow-hidden transition-colors duration-500`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link to={`/posts/${post._id}`}>
                    {post.media &&
                      (post.media.endsWith(".mp4") ? (
                        <video
                          src={post.media}
                          className="w-full h-40 object-cover"
                          muted
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ) : (
                        <img
                          src={post.media}
                          alt="Recommended post"
                          className="w-full h-40 object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ))}
                    <div className="p-4">
                      <p
                        className={`text-sm font-medium line-clamp-2 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {post.title}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {post.category || "General"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {loading ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
                >
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-4`}
            >
              Photos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {photoPosts.length > 0 ? (
                photoPosts.map((post) => (
                  <motion.div
                    key={post._id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/posts/${post._id}`}>
                      <div className="relative rounded-lg overflow-hidden shadow-md">
                        <img
                          src={post.media}
                          alt="Photo post"
                          className="w-full h-32 object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
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
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No photos available.
                </p>
              )}
            </div>
          </motion.section>
        )}

        {loading ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
                >
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
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
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
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
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No videos available.
                </p>
              )}
            </div>
          </motion.section>
        )}
      </main>

      <footer className="bg-red-600 text-white py-8">
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
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Stay Connected</h4>
            <div className="flex justify-center space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12a12 12 0 10-13.9 11.9v-8.4h-3V12h3V9.7a4.2 4.2 0 014.5-4.6 18 18 0 012.7.2v3h-1.6a2 2 0 00-2.3 2.2V12h3.9l-.5 3.4h-3.4v8.4A12 12 0 0024 12z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1a6.6 6.6 0 012.2.4 3.7 3.7 0 012.2 2.2 6.6 6.6 0 01.4 2.2c.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8a6.6 6.6 0 01-.4 2.2 3.7 3.7 0 01-2.2 2.2 6.6 6.6 0 01-2.2.4c-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1a6.6 6.6 0 01-2.2-.4 3.7 3.7 0 01-2.2-2.2 6.6 6.6 0 01-.4-2.2c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8a6.6 6.6 0 01.4-2.2 3.7 3.7 0 012.2-2.2 6.6 6.6 0 012.2-.4c1.2-.1 1.6-.1 4.8-.1m0-2.2C8.7 0 8.2 0 7 0a8.8 8.8 0 00-2.9.5 5.9 5.9 0 00-3.4 3.4A8.8 8.8 0 000 7c0 1.2 0 1.7.1 3s.1 3.6.1 4.8-.1 3.6-.1 4.8a8.8 8.8 0 00.5 2.9 5.9 5.9 0 003.4 3.4 8.8 8.8 0 002.9.5c1.2 0 1.7 0 3 0s3.6-.1 4.8-.1a8.8 8.8 0 002.9-.5 5.9 5.9 0 003.4-3.4 8.8 8.8 0 00.5-2.9c0-1.2 0-1.7-.1-3s-.1-3.6-.1-4.8.1-3.6.1-4.8a8.8 8.8 0 00-.5-2.9 5.9 5.9 0 00-3.4-3.4A8.8 8.8 0 0017 0c-1.2 0-1.7 0-3 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm7.8-10.5a1.4 1.4 0 11-2.8 0 1.4 1.4 0 012.8 0z" />
                </svg>
              </a>
            </div>
          </div>
          {/* <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">
              Subscribe to Our Newsletter
            </h4>
            <form className="flex justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-full bg-white text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div> */}
          <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 border-t border-gray-200">
        <div
          className="flex justify-around items-center py-0 px-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/create-post"
              className="p-2 rounded-full transition-all duration-200"
              aria-label="Create Post"
              title="Create Post"
            >
              <HiPlus className="h-6 w-6 text-red-600 bg-red-100 rounded-full" />
            </Link>
          </motion.div>
          {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/shorts"
              className="p-2 rounded-full transition-all duration-200"
              aria-label="Create Post"
              title="Create Post"
            >
              <SiYoutubeshorts className="h-6 w-6 text-red-600 bg-red-100 rounded-full" />
            </Link>
          </motion.div> */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/notifications"
              className="p-2 rounded-full transition-all duration-200"
              aria-label="Notifications"
              title="Notifications"
            >
              <HiBell className="h-6 w-6 text-gray-600" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="p-1 rounded-full transition-all duration-200"
              aria-label={isAuthenticated ? "Profile" : "Login"}
              title={isAuthenticated ? "Profile" : "Login"}
            >
              {isAuthenticated ? (
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="User profile picture"
                    className="h-7 w-7 rounded-full object-cover border-2 border-gray-500 hover:border-gray-600 transition-all duration-200"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                  <div className="absolute -top-0.5 -right-0.5 bg-orange-500 rounded-full p-1">
                    <HiFire className="h-3 w-3 text-white" />
                  </div>
                </div>
              ) : (
                <HiUser className="h-5 w-5 text-gray-600" />
              )}
            </Link>
          </motion.div>
        </div>
      </nav>

      {displayedPosts.length > 5 && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Back to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HiArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
};

export default PostList;
