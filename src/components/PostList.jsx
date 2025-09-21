// import { useState, useEffect, useMemo, lazy, Suspense, useRef } from "react";
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
//   HiSearch,
//   HiShare,
//   HiFire,
// } from "react-icons/hi";
// import { BsFacebook } from "react-icons/bs";
// import { BsTwitterX } from "react-icons/bs";
// import { AiFillInstagram } from "react-icons/ai";
// import {
//   getPosts,
//   getUserProfile,
//   getPublicUserProfile,
//   getUsers,
//   followUser,
//   unfollowUser,
//   addReaction,
// } from "../utils/api";
// import Logo from "../assets/GossippHublogo.svg";
// import confetti from "canvas-confetti";
// // import StoryZone from "./StoryZone";
// // Lazy-loaded components
// const TrendingSection = lazy(() => import("./TrendingSection"));
// const LatestStoriesSection = lazy(() => import("./LatestStoriesSection"));
// const MostViewedSection = lazy(() => import("./MostViewedSection"));
// const RecommendedSection = lazy(() => import("./RecommendedSection"));
// const PhotosSection = lazy(() => import("./PhotosSection"));
// const VideosSection = lazy(() => import("./VideosSection"));
// const SuggestedUsersSection = lazy(() => import("./SuggestedUsersSection"));
// const ReactionStreakSection = lazy(() => import("./ReactionStreakSection"));

// const PostList = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [categories, setCategories] = useState(["All"]);
//   const [displayedCount, setDisplayedCount] = useState(6);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestedUsers, setSuggestedUsers] = useState([]);
//   const [followedUsers, setFollowedUsers] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [userReactions, setUserReactions] = useState({});
//   const [isReacting, setIsReacting] = useState(null);
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const POSTS_PER_PAGE = 7;
//   const isAuthenticated = !!localStorage.getItem("token");
//   const headerRef = useRef(null);

//   // Generate or retrieve session seed for randomization
//   const sessionSeed = useMemo(() => {
//     if (isAuthenticated) {
//       return localStorage.getItem("userId") || "anonymous";
//     }
//     let sessionId = sessionStorage.getItem("sessionId");
//     if (!sessionId) {
//       sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
//       sessionStorage.setItem("sessionId", sessionId);
//     }
//     return sessionId;
//   }, [isAuthenticated]);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Update header height and isMobile
//   useEffect(() => {
//     const updateDimensions = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (headerRef.current) {
//         setHeaderHeight(headerRef.current.clientHeight);
//       }
//     };

//     window.addEventListener("resize", updateDimensions);
//     updateDimensions();

//     return () => window.removeEventListener("resize", updateDimensions);
//   }, []);

//   // Utility function to shuffle an array
//   const shuffleArray = (array) => {
//     const shuffled = [...array];
//     let m = shuffled.length;
//     while (m) {
//       const i = Math.floor(Math.random() * m--);
//       [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
//     }
//     return shuffled;
//   };

//   // Fetch posts and user data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         let postsRes, userRes, allUsersRes;
//         if (isAuthenticated) {
//           [postsRes, userRes, allUsersRes] = await Promise.all([
//             getPosts(),
//             getUserProfile(),
//             getUsers(),
//           ]);
//           setAllUsers(allUsersRes);
//         } else {
//           postsRes = await getPosts();
//         }
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
//           setUser(userRes);

//           // Initialize userReactions based on posts and user ID
//           const userId = localStorage.getItem("userId");
//           const reactions = {};
//           sanitizedPosts.forEach((post) => {
//             reactions[post._id] = {
//               like: post.likes?.includes(userId) || false,
//               love: post.loves?.includes(userId) || false,
//               laugh: post.laughs?.includes(userId) || false,
//               sad: post.sads?.includes(userId) || false,
//             };
//           });
//           setUserReactions(reactions);

//           const shownRewards =
//             JSON.parse(localStorage.getItem("shownStreakRewards")) || [];
//           const dailyReward = `Day ${userRes.reactionStreak} Streak`;
//           if (
//             userRes.streakRewards.includes(dailyReward) &&
//             !shownRewards.includes(dailyReward)
//           ) {
//             toast.success(`🏆 ${dailyReward} Achieved!`);
//             localStorage.setItem(
//               "shownStreakRewards",
//               JSON.stringify([...shownRewards, dailyReward])
//             );
//           }

//           if (userRes.reactionStreak % 7 === 0) {
//             const weekNumber = userRes.reactionStreak / 7;
//             const milestoneReward = `Week ${weekNumber} Milestone`;
//             if (
//               userRes.streakRewards.includes(milestoneReward) &&
//               !shownRewards.includes(milestoneReward)
//             ) {
//               toast.success(`🎉 ${milestoneReward} Achieved!`);
//               confetti({
//                 particleCount: 150,
//                 spread: 90,
//                 origin: { y: 0.6 },
//               });
//               localStorage.setItem(
//                 "shownStreakRewards",
//                 JSON.stringify([...shownRewards, milestoneReward])
//               );
//             }
//           }

//           setFollowedUsers(userRes.following || []);

//           const suggestedUserIds = allUsersRes
//             .filter(
//               (u) =>
//                 u._id !== userRes._id &&
//                 !(userRes.following || []).includes(u._id)
//             )
//             .slice(0, 10)
//             .map((u) => u._id);

//           if (suggestedUserIds.length === 0) {
//             setSuggestedUsers([]);
//             return;
//           }

//           const suggestedUsersData = await Promise.all(
//             suggestedUserIds.map(async (userId) => {
//               try {
//                 const userData = await getPublicUserProfile(userId);
//                 return userData;
//               } catch (err) {
//                 console.error(`Failed to fetch user ${userId}:`, err);
//                 return null;
//               }
//             })
//           );

//           const filteredUsers = suggestedUsersData.filter(
//             (user) => user !== null
//           );
//           const shuffledUsers = shuffleArray(filteredUsers);
//           setSuggestedUsers(shuffledUsers);
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

//   // Reset displayed count when category or search query changes
//   useEffect(() => {
//     setDisplayedCount(POSTS_PER_PAGE);
//   }, [selectedCategory, searchQuery]);

//   // Handle reaction click
//   const handleReaction = async (postId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }

//     if (isReacting === postId) return;
//     setIsReacting(postId);

//     try {
//       const userId = localStorage.getItem("userId");
//       const newReactions = {
//         ...userReactions,
//         [postId]: {
//           ...userReactions[postId],
//           [type]: !userReactions[postId][type],
//         },
//       };
//       setUserReactions(newReactions);

//       const updatedReactions = await addReaction(postId, { type });

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 likes: updatedReactions.likes || [],
//                 loves: updatedReactions.loves || [],
//                 laughs: updatedReactions.laughs || [],
//                 sads: updatedReactions.sads || [],
//               }
//             : post
//         )
//       );

//       const user = await getUserProfile();
//       setUser(user);

//       if (newReactions[postId][type]) {
//         toast.success(`Reaction added! Streak: ${user.reactionStreak}`);
//         confetti({
//           particleCount: 50,
//           spread: 60,
//           origin: { y: 0.6 },
//           colors: ["#ff0000", "#ff7300", "#fff400"],
//         });

//         if (user.streakRewards.includes(`Day ${user.reactionStreak} Streak`)) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReactions((prev) => ({
//         ...prev,
//         [postId]: {
//           ...prev[postId],
//           [type]: !prev[postId][type],
//         },
//       }));
//     } finally {
//       setIsReacting(null);
//     }
//   };

//   // Filter and search posts
//   const filteredPosts = useMemo(
//     () =>
//       selectedCategory === "All"
//         ? posts
//         : posts.filter(
//             (post) => (post.category || "General") === selectedCategory
//           ),
//     [posts, selectedCategory]
//   );

//   const searchedPosts = useMemo(
//     () =>
//       searchQuery
//         ? filteredPosts.filter(
//             (post) =>
//               post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               post.description.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         : filteredPosts,
//     [filteredPosts, searchQuery]
//   );

//   // Randomize displayed posts for main list
//   const displayedPosts = useMemo(
//     () => shuffleArray(searchedPosts).slice(0, displayedCount),
//     [searchedPosts, displayedCount, sessionSeed]
//   );

//   // Prepare data for sections with randomization from all filtered posts
//   const videoPosts = useMemo(
//     () =>
//       shuffleArray(
//         searchedPosts
//           .filter(
//             (post) =>
//               post.media &&
//               typeof post.media === "string" &&
//               post.media.endsWith(".mp4")
//           )
//           .slice(0, 5)
//       ),
//     [searchedPosts, sessionSeed]
//   );

//   const photoPosts = useMemo(
//     () =>
//       shuffleArray(
//         searchedPosts
//           .filter(
//             (post) =>
//               post.media &&
//               typeof post.media === "string" &&
//               !post.media.endsWith(".mp4")
//           )
//           .slice(0, 5)
//       ),
//     [searchedPosts, sessionSeed]
//   );

//   const recommendedPosts = useMemo(
//     () =>
//       shuffleArray(
//         searchedPosts
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 3)
//       ),
//     [searchedPosts, sessionSeed]
//   );

//   const mostViewedPosts = useMemo(
//     () =>
//       searchedPosts
//         .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//         .slice(0, 3),
//     [searchedPosts]
//   );

//   const latestStories = useMemo(
//     () =>
//       posts
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5),
//     [posts]
//   );

//   const trends = useMemo(() => {
//     const postsWithReactions = posts.map((post) => ({
//       ...post,
//       totalReactions:
//         (post.likes?.length || 0) +
//         (post.loves?.length || 0) +
//         (post.laughs?.length || 0) +
//         (post.sads?.length || 0),
//     }));
//     return postsWithReactions
//       .sort((a, b) => b.totalReactions - a.totalReactions)
//       .slice(0, 5);
//   }, [posts]);

//   const recentComments = useMemo(
//     () =>
//       posts
//         .flatMap((post) =>
//           (post.comments || []).map((comment) => ({
//             postId: post._id,
//             postTitle: post.title,
//             commentText: comment.text,
//             commentDate: comment.createdAt,
//           }))
//         )
//         .sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate))
//         .slice(0, 4),
//     [posts]
//   );

//   const loadMore = () => {
//     setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
//   };

//   const profileImage = isAuthenticated
//     ? user?.profilePicture || "https://avatar.iran.liara.run/public/26"
//     : null;

//   const featuredPost = displayedPosts.length > 0 ? displayedPosts[0] : null;
//   const remainingPosts = displayedPosts.slice(1);

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

//       const allUsersData = await getUsers();
//       setAllUsers(allUsersData);
//       const newSuggestedUserIds = allUsersData
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

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Fallback UI for lazy-loaded components
//   const LoadingFallback = () => (
//     <div className="flex justify-center items-center py-8">
//       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
//     </div>
//   );

//   const postSuggestions = useMemo(() => {
//     if (!searchQuery) return [];
//     const query = searchQuery.toLowerCase();
//     return posts
//       .filter(
//         (post) =>
//           post.title.toLowerCase().includes(query) ||
//           post.description.toLowerCase().includes(query)
//       )
//       .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//       .slice(0, 10);
//   }, [searchQuery, posts]);

//   const userSuggestions = useMemo(() => {
//     if (!isAuthenticated || !searchQuery) return [];
//     const query = searchQuery.toLowerCase();
//     return allUsers
//       .filter(
//         (u) =>
//           u._id !== user?._id &&
//           (u.username?.toLowerCase().includes(query) ||
//             u.name?.toLowerCase().includes(query))
//       )
//       .slice(0, 10);
//   }, [searchQuery, allUsers, isAuthenticated, user]);

//   return (
//     <div
//       className={`min-h-screen font-poppins transition-colors duration-500 ${
//         isDarkMode ? "bg-gray-950" : "bg-gray-100"
//       }`}
//     >
//       <Helmet>
//         <title>
//           {selectedCategory === "All"
//             ? "Gossiphub – Latest Celebrity News & Trending Entertainment"
//             : `Gossiphub – Latest ${selectedCategory} News & Updates`}
//         </title>
//         <meta
//           name="description"
//           content={
//             selectedCategory === "All"
//               ? "Get the latest celebrity news, trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
//               : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
//           }
//         />
//         <meta
//           name="keywords"
//           content={`celebrity Gossips, movie updates, film news, gossips, gossiphub, sports news, political news, entertainment news, trending gossips, viral videos, ${selectedCategory.toLowerCase()} news`}
//         />
//         <meta name="robots" content="index, follow" />
//         <meta name="author" content="GossipHub Team" />
//         <meta
//           property="og:title"
//           content={
//             selectedCategory === "All"
//               ? "Gossiphub – Latest Celebrity Gossips & Trending Entertainment"
//               : `Gossiphub – Latest ${selectedCategory} News & Updates`
//           }
//         />
//         <meta
//           property="og:description"
//           content={
//             selectedCategory === "All"
//               ? "Get the latest celebrity gossips,movie updates,film news,trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
//               : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
//           }
//         />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://gossiphub.in/" />
//         <meta property="og:image" content={featuredPost?.media || Logo} />
//         <meta
//           property="og:image:alt"
//           content={featuredPost?.title || "GossipHub Logo"}
//         />
//         <meta property="og:site_name" content="GossipHub" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta
//           name="twitter:title"
//           content={
//             selectedCategory === "All"
//               ? "Gossiphub – Latest Celebrity News & Trending Entertainment"
//               : `Gossiphub – Latest ${selectedCategory} News & Updates`
//           }
//         />
//         <meta
//           name="twitter:description"
//           content={
//             selectedCategory === "All"
//               ? "Get the latest celebrity gossips, trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
//               : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
//           }
//         />
//         <meta name="twitter:image" content={featuredPost?.media || Logo} />
//         <meta
//           name="twitter:image:alt"
//           content={featuredPost?.title || "GossipHub Logo"}
//         />
//         <link rel="canonical" href="https://gossiphub.in/" />
//         <link rel="alternate" href="https://gossiphub.in/" hreflang="en-in" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             name:
//               selectedCategory === "All"
//                 ? "GossipHub | Discover Trending Posts & Stories"
//                 : `GossipHub | ${selectedCategory} News & Stories`,
//             description:
//               selectedCategory === "All"
//                 ? "Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
//                 : `Discover the latest ${selectedCategory} news, trending stories, and exclusive gossip on GossipHub. Join now!`,
//             url: "https://gossiphub.in/",
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
//               name:
//                 selectedCategory === "All"
//                   ? "Trending Posts"
//                   : `${selectedCategory} Posts`,
//               description:
//                 selectedCategory === "All"
//                   ? "A collection of trending posts and stories on GossipHub."
//                   : `A collection of ${selectedCategory} posts and stories on GossipHub.`,
//             },
//             breadcrumb: {
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 {
//                   "@type": "ListItem",
//                   position: 1,
//                   name: "Home",
//                   item: "https://gossiphub.in/",
//                 },
//                 ...(selectedCategory !== "All"
//                   ? [
//                       {
//                         "@type": "ListItem",
//                         position: 2,
//                         name: selectedCategory,
//                         item: `https://gossiphub.in/#${selectedCategory.toLowerCase()}`,
//                       },
//                     ]
//                   : []),
//               ],
//             },
//           })}
//         </script>
//       </Helmet>

//       {/* Header (Eager-loaded) */}
//       <header
//         ref={headerRef}
//         className="fixed top-0 left-0 right-0 z-50 bg-red-600/80 backdrop-blur-md text-white shadow-lg"
//       >
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
//                 placeholder="Search posts or users..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setDisplayedCount(POSTS_PER_PAGE);
//                 }}
//                 className={`pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white"
//                     : "bg-white text-gray-950"
//                 }`}
//               />
//               {searchQuery &&
//                 (postSuggestions.length > 0 || userSuggestions.length > 0) && (
//                   <div
//                     className={`${
//                       isMobile
//                         ? "fixed left-0 right-0"
//                         : "absolute top-full left-0 w-full mt-1 max-h-80"
//                     } overflow-y-auto rounded-md shadow-lg ${
//                       isDarkMode
//                         ? "bg-gray-800 text-white"
//                         : "bg-white text-gray-900"
//                     } z-50`}
//                     style={
//                       isMobile
//                         ? {
//                             top: headerHeight,
//                             height: `calc(100vh - ${headerHeight}px)`,
//                           }
//                         : {}
//                     }
//                   >
//                     {postSuggestions.map((post) => (
//                       <Link
//                         key={post._id}
//                         to={`/posts/${post._id}`}
//                         className={`flex items-center p-2 hover:${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                         } transition-colors`}
//                         onClick={() => setSearchQuery("")}
//                       >
//                         {post.media && (
//                           <>
//                             {post.media.endsWith(".mp4") ? (
//                               <div
//                                 className={`w-10 h-10 flex items-center justify-center rounded mr-2 ${
//                                   isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                                 }`}
//                               >
//                                 <span>🎥</span>
//                               </div>
//                             ) : (
//                               <img
//                                 src={post.media}
//                                 alt={post.title}
//                                 className="w-10 h-10 object-cover rounded mr-2"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                 }
//                               />
//                             )}
//                           </>
//                         )}
//                         <span>{post.title}</span>
//                       </Link>
//                     ))}
//                     {isAuthenticated && userSuggestions.length > 0 && (
//                       <div className="p-2 font-bold border-t border-gray-700">
//                         Users
//                       </div>
//                     )}
//                     {isAuthenticated &&
//                       userSuggestions.map((u) => (
//                         <Link
//                           key={u._id}
//                           to={`/profile/${u._id}`}
//                           className={`flex items-center p-2 hover:${
//                             isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                           } transition-colors`}
//                           onClick={() => setSearchQuery("")}
//                         >
//                           <img
//                             src={
//                               u.profilePicture ||
//                               `https://avatar.iran.liara.run/public/${Math.floor(
//                                 Math.random() * 100
//                               )}`
//                             }
//                             alt={u.username}
//                             className="w-10 h-10 rounded-full object-cover mr-2"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public")
//                             }
//                           />
//                           <span>{u.username}</span>
//                         </Link>
//                       ))}
//                   </div>
//                 )}
//             </div>
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
//               aria-label={
//                 isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//               }
//             >
//               {isDarkMode ? (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//                 </svg>
//               )}
//             </button>
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
//                         (e.target.src =
//                           "https://avatar.iran.liara.run/public/4")
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
//                     src="https://avatar.iran.liara.run/public/3"
//                     alt="Login"
//                     className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
//                     whileHover={{ scale: 1.1 }}
//                   />
//                 </Link>
//               )}
//             </nav>
//           </div>
//         </div>
//         <div
//           className={`${
//             isDarkMode ? "bg-gray-800" : "bg-white/90"
//           } backdrop-blur-md text-gray-500 shadow-md transition-colors duration-500`}
//         >
//           <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto scrollbar-hide">
//             {categories.map((category) => (
//               <motion.button
//                 key={category}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   setDisplayedCount(POSTS_PER_PAGE);
//                 }}
//                 className={`px-3 py-1 text-sm font-medium uppercase tracking-wide rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap ${
//                   selectedCategory === category
//                     ? "bg-red-600 text-white"
//                     : isDarkMode
//                     ? "hover:bg-gray-700 hover:text-white"
//                     : "hover:bg-red-100 hover:text-red-600"
//                 }`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label={`Filter posts by ${category}`}
//                 role="button"
//               >
//                 {category}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 pt-30 md:pt-36 pb-20 md:pb-12">
//         {/* Featured Post and Recent Activity (Eager-loaded) */}
//         {/* <StoryZone /> */}
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
//                     <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`md:w-1/3 ${
//                   isDarkMode ? "bg-gray-900" : "bg-white/90"
//                 } backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors duration-500`}
//               >
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
//                             loading="lazy"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={featuredPost.media}
//                             alt={`Featured: ${featuredPost.title}`}
//                             className="w-full h-64 md:h-96 object-cover"
//                             loading="lazy"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                             }
//                           />
//                         ))}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
//                         <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-fit">
//                           {featuredPost.category || "General"}
//                         </span>
//                         <motion.h1
//                           className="text-2xl md:text-4xl font-bold text-white"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.2 }}
//                         >
//                           {featuredPost.title}
//                         </motion.h1>
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
//                   className={`md:w-1/3 ${
//                     isDarkMode ? "bg-gray-900" : "bg-white/90"
//                   } backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors duration-500`}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <h3
//                     className={`text-lg font-bold ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     } mb-4 flex items-center`}
//                   >
//                     <HiChatAlt className="h-6 w-6 text-blue-500 mr-2" />
//                     Recent Activity
//                   </h3>
//                   <ul className="space-y-3">
//                     {recentComments.length > 0 ? (
//                       recentComments.map((comment, index) => (
//                         <motion.li
//                           key={index}
//                           className={`text-sm ${
//                             isDarkMode ? "text-gray-300" : "text-gray-700"
//                           }`}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                         >
//                           <Link
//                             to={`/posts/${comment.postId}`}
//                             className={`font-medium ${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             } hover:text-red-600 transition-colors`}
//                           >
//                             {comment.postTitle.length > 40
//                               ? `${comment.postTitle.slice(0, 40)}...`
//                               : comment.postTitle}
//                           </Link>
//                           <p
//                             className={`text-gray-600 mt-1 line-clamp-1 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-600"
//                             }`}
//                           >
//                             {comment.commentText}
//                           </p>
//                           <p
//                             className={`text-xs mt-1 ${
//                               isDarkMode ? "text-gray-500" : "text-gray-500"
//                             }`}
//                           >
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
//                       <li
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-400" : "text-gray-500"
//                         }`}
//                       >
//                         No recent activity available.
//                       </li>
//                     )}
//                   </ul>
//                 </motion.div>
//               </div>
//             </motion.section>
//           )
//         )}

//         {/* Lazy-loaded Sections */}
//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="mb-8"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[200px] bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//                   >
//                     <div className="w-full h-32 bg-gray-200"></div>
//                     <div className="p-3">
//                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <TrendingSection trends={trends} isDarkMode={isDarkMode} />
//           )}
//         </Suspense>

//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="md:w-2/3">
//             {/* Main Post List (Eager-loaded) */}
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
//                 className={`text-center py-12 ${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 } rounded-xl shadow-md transition-colors duration-500`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <HiDocumentText className="mx-auto h-24 w-24 text-red-400" />
//                 <h3
//                   className={`mt-4 text-xl font-semibold ${
//                     isDarkMode ? "text-gray-100" : "text-gray-900"
//                   }`}
//                 >
//                   No Gossips in {selectedCategory}!
//                 </h3>
//                 <p
//                   className={`mt-2 max-w-md mx-auto text-sm ${
//                     isDarkMode ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
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
//                       className={`${
//                         isDarkMode ? "bg-gray-800" : "bg-white"
//                       } lg:rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transition-colors duration-500`}
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
//                                 className="w-full lg:h-45 object-cover"
//                                 loading="lazy"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
//                                 }
//                               />
//                             ) : (
//                               <img
//                                 src={post.media}
//                                 alt={`Post: ${post.title}`}
//                                 className="w-full lg:h-45 object-cover"
//                                 loading="lazy"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                 }
//                               />
//                             )}
//                           </div>
//                         )}
//                         <div className="p-4 sm:w-2/3">
//                           <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1">
//                             {post.category || "General"}
//                           </span>
//                           <h3
//                             className={`text-lg font-bold ${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             } mt-2`}
//                           >
//                             <Link
//                               to={`/posts/${post._id}`}
//                               className="hover:text-red-600 transition-colors duration-200"
//                             >
//                               {post.title}
//                             </Link>
//                           </h3>
//                           <p
//                             className={`text-sm mt-1 line-clamp-2 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-600"
//                             }`}
//                           >
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
//                           <div
//                             className={`flex items-center justify-between text-xs mt-3 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-500"
//                             }`}
//                           >
//                             <p>
//                               By{" "}
//                               {post.isAnonymous
//                                 ? "Anonymous"
//                                 : post.author?.username || "Unknown"}
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               <motion.button
//                                 onClick={() => handleReaction(post._id, "like")}
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.like
//                                     ? "bg-red-600 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Like post (${
//                                   post.likes?.length || 0
//                                 } likes)${
//                                   userReactions[post._id]?.like
//                                     ? " (You liked this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.like
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   👍
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.likes?.length || 0}
//                                 </span>
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => handleReaction(post._id, "love")}
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.love
//                                     ? "bg-pink-600 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Love post (${
//                                   post.loves?.length || 0
//                                 } loves)${
//                                   userReactions[post._id]?.love
//                                     ? " (You loved this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.love
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   💖
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.loves?.length || 0}
//                                 </span>
//                               </motion.button>
//                               <motion.button
//                                 onClick={() =>
//                                   handleReaction(post._id, "laugh")
//                                 }
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.laugh
//                                     ? "bg-yellow-500 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Laugh at post (${
//                                   post.laughs?.length || 0
//                                 } laughs)${
//                                   userReactions[post._id]?.laugh
//                                     ? " (You laughed at this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.laugh
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   😂
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.laughs?.length || 0}
//                                 </span>
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => handleReaction(post._id, "sad")}
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.sad
//                                     ? "bg-blue-600 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Sad reaction (${
//                                   post.sads?.length || 0
//                                 } sads)${
//                                   userReactions[post._id]?.sad
//                                     ? " (You felt sad about this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.sad
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   😢
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.sads?.length || 0}
//                                 </span>
//                               </motion.button>
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
//                           className={`absolute top-4 right-4 p-2 rounded-full ${
//                             isDarkMode ? "bg-gray-600" : "bg-gray-200"
//                           } transition-colors duration-500`}
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleQuickShare(post)}
//                           aria-label="Quick share"
//                         >
//                           <HiShare
//                             className={`h-5 w-5 ${
//                               isDarkMode ? "text-gray-300" : "text-gray-600"
//                             }`}
//                           />
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

//           {/* Sidebar with Lazy-loaded Sections */}
//           <div className="md:w-1/3 space-y-6 md:sticky md:top-36 md:h-[calc(100vh-144px)] md:overflow-y-auto scrollbar-hide">
//             <Suspense fallback={<LoadingFallback />}>
//               {isAuthenticated && (
//                 <ReactionStreakSection user={user} isDarkMode={isDarkMode} />
//               )}
//             </Suspense>

//             <Suspense fallback={<LoadingFallback />}>
//               {loading ? (
//                 <motion.section
//                   className="bg-white p-4 rounded-xl shadow-lg"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.1 }}
//                 >
//                   <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//                   <div className="space-y-4">
//                     {[...Array(5)].map((_, index) => (
//                       <div key={index} className="flex gap-3 animate-pulse">
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.section>
//               ) : (
//                 <LatestStoriesSection
//                   latestStories={latestStories}
//                   isDarkMode={isDarkMode}
//                 />
//               )}
//             </Suspense>

//             <Suspense fallback={<LoadingFallback />}>
//               {loading ? (
//                 <motion.section
//                   className="bg-white p-4 rounded-xl shadow-lg"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.2 }}
//                 >
//                   <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//                   <div className="space-y-4">
//                     {[...Array(3)].map((_, index) => (
//                       <div key={index} className="flex gap-3 animate-pulse">
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.section>
//               ) : (
//                 <MostViewedSection
//                   mostViewedPosts={mostViewedPosts}
//                   isDarkMode={isDarkMode}
//                 />
//               )}
//             </Suspense>
//           </div>
//         </div>

//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-12 mb-8"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[150px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 animate-pulse"
//                   >
//                     <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
//                     <div className="h-8 bg-gray-200 rounded-full w-20"></div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <SuggestedUsersSection
//               suggestedUsers={suggestedUsers}
//               isDarkMode={isDarkMode}
//               followedUsers={followedUsers}
//               handleFollow={handleFollow}
//             />
//           )}
//         </Suspense>

//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-12"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {[...Array(3)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//                   >
//                     <div className="w-full h-40 bg-gray-200"></div>
//                     <div className="p-4">
//                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <RecommendedSection
//               recommendedPosts={recommendedPosts}
//               isDarkMode={isDarkMode}
//             />
//           )}
//         </Suspense>

//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="mt-12"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
//                   >
//                     <div className="w-full h-32 bg-gray-200"></div>
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//                       <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <PhotosSection photoPosts={photoPosts} isDarkMode={isDarkMode} />
//           )}
//         </Suspense>

//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               className="mt-12"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
//                   >
//                     <div className="w-full h-32 bg-gray-200"></div>
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//                       <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <VideosSection videoPosts={videoPosts} isDarkMode={isDarkMode} />
//           )}
//         </Suspense>
//       </main>

//       {/* Footer */}
//       <footer
//         className={`${
//           isDarkMode ? "bg-gray-900" : "bg-gray-800"
//         } text-white py-6 transition-colors duration-500`}
//       >
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-sm">
//             &copy; {new Date().getFullYear()} GossipHub. All rights reserved.
//           </p>
//           <div className="mt-4 flex justify-center space-x-4">
//             <a
//               href="https://x.com/Charankumar2580"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-gray-200"
//             >
//               <BsTwitterX className="text-red-600 text-xl" />
//             </a>
//             <a
//               href="https://facebook.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-gray-200"
//             >
//               <BsFacebook className="text-red-600 text-xl" />
//             </a>
//             <a
//               href="https://www.instagram.com/gossiphub247?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-gray-200"
//             >
//               <AiFillInstagram className="text-red-600 text-xl" />
//             </a>
//           </div>
//           <div className="mt-4 flex justify-center space-x-4">
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
//         </div>
//       </footer>

//       {/* Back to Top Button */}
//       <motion.button
//         className="fixed bottom-15 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300"
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         aria-label="Back to top"
//       >
//         <HiArrowUp className="h-5 w-5" />
//       </motion.button>

//       {/* Mobile Navigation */}
//       <nav
//         className={`fixed bottom-0 left-0 right-0 ${
//           isDarkMode ? "bg-gray-900" : "bg-white"
//         } md:hidden flex justify-around py-3 shadow-lg transition-colors duration-500 z-50`}
//       >
//         <Link
//           to="/create-post"
//           className="p-1 flex flex-col items-center"
//           aria-label="Create Post"
//         >
//           <HiPlus
//             className={`h-6 w-6 ${
//               isDarkMode
//                 ? "text-gray-300 bg-red-500 rounded-2xl"
//                 : "text-red-600 bg-red-100 rounded-2xl "
//             }`}
//           />
//         </Link>
//         <Link
//           to="/notifications"
//           className=" p-1 flex flex-col items-center"
//           aria-label="Notifications"
//         >
//           <HiBell
//             className={`h-6 w-6 ${
//               isDarkMode ? "text-gray-300" : "text-gray-600"
//             }`}
//           />
//         </Link>

//         <Link
//           to={isAuthenticated ? "/profile" : "/login"}
//           className="p-1 rounded-full transition-all duration-200 flex flex-col items-center"
//           aria-label={isAuthenticated ? "Profile" : "Login"}
//           title={isAuthenticated ? "Profile" : "Login"}
//         >
//           {isAuthenticated ? (
//             <div className="relative">
//               <img
//                 src={profileImage}
//                 alt="User profile picture"
//                 className="h-6 w-6 rounded-full object-cover border-2 border-gray-500 hover:border-gray-600 transition-all duration-200"
//                 onError={(e) =>
//                   (e.target.src = "https://avatar.iran.liara.run/public/9")
//                 }
//               />
//             </div>
//           ) : (
//             <HiUser className="h-5 w-5 text-gray-600" />
//           )}
//         </Link>
//       </nav>
//     </div>
//   );
// };

// export default PostList;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { useState, useEffect, useMemo, lazy, Suspense, useRef } from "react";
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
//   HiSearch,
//   HiShare,
//   HiFire,
// } from "react-icons/hi";
// import { BsFacebook, BsTwitterX } from "react-icons/bs";
// import { AiFillInstagram } from "react-icons/ai";
// import {
//   getPosts,
//   getPostsByHashtag,
//   getUserProfile,
//   getPublicUserProfile,
//   getUsers,
//   followUser,
//   unfollowUser,
//   addReaction,
// } from "../utils/api";
// import Logo from "../assets/GossippHublogo.svg";
// import confetti from "canvas-confetti";
// const TrendingSection = lazy(() => import("./TrendingSection"));
// const LatestStoriesSection = lazy(() => import("./LatestStoriesSection"));
// const MostViewedSection = lazy(() => import("./MostViewedSection"));
// const RecommendedSection = lazy(() => import("./RecommendedSection"));
// const PhotosSection = lazy(() => import("./PhotosSection"));
// const VideosSection = lazy(() => import("./VideosSection"));
// const SuggestedUsersSection = lazy(() => import("./SuggestedUsersSection"));
// const ReactionStreakSection = lazy(() => import("./ReactionStreakSection"));
// const PostList = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedHashtag, setSelectedHashtag] = useState("");
//   const [categories, setCategories] = useState(["All"]);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10); // Matches backend default
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestedUsers, setSuggestedUsers] = useState([]);
//   const [followedUsers, setFollowedUsers] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [userReactions, setUserReactions] = useState({});
//   const [isReacting, setIsReacting] = useState(null);
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const isAuthenticated = !!localStorage.getItem("token");
//   const headerRef = useRef(null);
//   // Generate or retrieve session seed for randomization
//   const sessionSeed = useMemo(() => {
//     if (isAuthenticated) {
//       return localStorage.getItem("userId") || "anonymous";
//     }
//     let sessionId = sessionStorage.getItem("sessionId");
//     if (!sessionId) {
//       sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
//       sessionStorage.setItem("sessionId", sessionId);
//     }
//     return sessionId;
//   }, [isAuthenticated]);
//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);
//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);
//   // Update header height and isMobile
//   useEffect(() => {
//     const updateDimensions = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (headerRef.current) {
//         setHeaderHeight(headerRef.current.clientHeight);
//       }
//     };
//     window.addEventListener("resize", updateDimensions);
//     updateDimensions();
//     return () => window.removeEventListener("resize", updateDimensions);
//   }, []);
//   // Utility function to shuffle an array
//   const shuffleArray = (array) => {
//     const shuffled = [...array];
//     let m = shuffled.length;
//     while (m) {
//       const i = Math.floor(Math.random() * m--);
//       [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
//     }
//     return shuffled;
//   };
//   // Fetch posts and user data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         let postsRes, userRes, allUsersRes;
//         if (isAuthenticated) {
//           [postsRes, userRes, allUsersRes] = await Promise.all([
//             selectedHashtag
//               ? getPostsByHashtag(selectedHashtag, { page, limit })
//               : getPosts({ page, limit, hashtag: selectedHashtag }),
//             getUserProfile(),
//             getUsers(),
//           ]);
//           setAllUsers(allUsersRes);
//         } else {
//           postsRes = await (selectedHashtag
//             ? getPostsByHashtag(selectedHashtag, { page, limit })
//             : getPosts({ page, limit, hashtag: selectedHashtag }));
//         }
//         // Update posts and pagination data
//         setPosts(postsRes.posts || []);
//         setTotalPages(postsRes.totalPages || 1);
//         const sanitizedPosts = (postsRes.posts || []).map((post) => ({
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
//           setUser(userRes);
//           // Initialize userReactions based on posts and user ID
//           const userId = localStorage.getItem("userId");
//           const reactions = {};
//           sanitizedPosts.forEach((post) => {
//             reactions[post._id] = {
//               like: post.likes?.includes(userId) || false,
//               love: post.loves?.includes(userId) || false,
//               laugh: post.laughs?.includes(userId) || false,
//               sad: post.sads?.includes(userId) || false,
//             };
//           });
//           setUserReactions(reactions);
//           const shownRewards =
//             JSON.parse(localStorage.getItem("shownStreakRewards")) || [];
//           const dailyReward = `Day ${userRes.reactionStreak} Streak`;
//           if (
//             userRes.streakRewards.includes(dailyReward) &&
//             !shownRewards.includes(dailyReward)
//           ) {
//             toast.success(`🏆 ${dailyReward} Achieved!`);
//             localStorage.setItem(
//               "shownStreakRewards",
//               JSON.stringify([...shownRewards, dailyReward])
//             );
//           }
//           if (userRes.reactionStreak % 7 === 0) {
//             const weekNumber = userRes.reactionStreak / 7;
//             const milestoneReward = `Week ${weekNumber} Milestone`;
//             if (
//               userRes.streakRewards.includes(milestoneReward) &&
//               !shownRewards.includes(milestoneReward)
//             ) {
//               toast.success(`🎉 ${milestoneReward} Achieved!`);
//               confetti({
//                 particleCount: 150,
//                 spread: 90,
//                 origin: { y: 0.6 },
//               });
//               localStorage.setItem(
//                 "shownStreakRewards",
//                 JSON.stringify([...shownRewards, milestoneReward])
//               );
//             }
//           }
//           setFollowedUsers(userRes.following || []);
//           const suggestedUserIds = allUsersRes
//             .filter(
//               (u) =>
//                 u._id !== userRes._id &&
//                 !(userRes.following || []).includes(u._id)
//             )
//             .slice(0, 10)
//             .map((u) => u._id);
//           if (suggestedUserIds.length === 0) {
//             setSuggestedUsers([]);
//             return;
//           }
//           const suggestedUsersData = await Promise.all(
//             suggestedUserIds.map(async (userId) => {
//               try {
//                 const userData = await getPublicUserProfile(userId);
//                 return userData;
//               } catch (err) {
//                 console.error(`Failed to fetch user ${userId}:`, err);
//                 return null;
//               }
//             })
//           );
//           const filteredUsers = suggestedUsersData.filter(
//             (user) => user !== null
//           );
//           const shuffledUsers = shuffleArray(filteredUsers);
//           setSuggestedUsers(shuffledUsers);
//         }
//       } catch (err) {
//         const message = err.response?.data?.message || "Failed to fetch posts";
//         toast.error(message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [isAuthenticated, navigate, page, selectedHashtag]);
//   // Handle reaction click
//   const handleReaction = async (postId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }
//     if (isReacting === postId) return;
//     setIsReacting(postId);
//     try {
//       const userId = localStorage.getItem("userId");
//       const newReactions = {
//         ...userReactions,
//         [postId]: {
//           ...userReactions[postId],
//           [type]: !userReactions[postId][type],
//         },
//       };
//       setUserReactions(newReactions);
//       const updatedReactions = await addReaction(postId, { type });
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 likes: updatedReactions.likes || [],
//                 loves: updatedReactions.loves || [],
//                 laughs: updatedReactions.laughs || [],
//                 sads: updatedReactions.sads || [],
//               }
//             : post
//         )
//       );
//       const user = await getUserProfile();
//       setUser(user);
//       if (newReactions[postId][type]) {
//         toast.success(`Reaction added! Streak: ${user.reactionStreak}`);
//         confetti({
//           particleCount: 50,
//           spread: 60,
//           origin: { y: 0.6 },
//           colors: ["#ff0000", "#ff7300", "#fff400"],
//         });
//         if (user.streakRewards.includes(`Day ${user.reactionStreak} Streak`)) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReactions((prev) => ({
//         ...prev,
//         [postId]: {
//           ...prev[postId],
//           [type]: !prev[postId][type],
//         },
//       }));
//     } finally {
//       setIsReacting(null);
//     }
//   };
//   // Filter and search posts
//   const filteredPosts = useMemo(
//     () =>
//       selectedCategory === "All"
//         ? posts
//         : posts.filter(
//             (post) => (post.category || "General") === selectedCategory
//           ),
//     [posts, selectedCategory]
//   );
//   const searchedPosts = useMemo(
//     () =>
//       searchQuery
//         ? filteredPosts.filter(
//             (post) =>
//               post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               post.description.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         : filteredPosts,
//     [filteredPosts, searchQuery]
//   );
//   // Randomize displayed posts for main list
//   const displayedPosts = useMemo(
//     () => shuffleArray(searchedPosts),
//     [searchedPosts, sessionSeed]
//   );
//   // Prepare data for sections with randomization from all filtered posts
//   const videoPosts = useMemo(
//     () =>
//       shuffleArray(
//         searchedPosts
//           .filter(
//             (post) =>
//               post.media &&
//               typeof post.media === "string" &&
//               post.media.endsWith(".mp4")
//           )
//           .slice(0, 5)
//       ),
//     [searchedPosts, sessionSeed]
//   );
//   const photoPosts = useMemo(
//     () =>
//       shuffleArray(
//         searchedPosts
//           .filter(
//             (post) =>
//               post.media &&
//               typeof post.media === "string" &&
//               !post.media.endsWith(".mp4")
//           )
//           .slice(0, 5)
//       ),
//     [searchedPosts, sessionSeed]
//   );
//   const recommendedPosts = useMemo(
//     () =>
//       shuffleArray(
//         searchedPosts
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 3)
//       ),
//     [searchedPosts, sessionSeed]
//   );
//   const mostViewedPosts = useMemo(
//     () =>
//       searchedPosts
//         .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//         .slice(0, 3),
//     [searchedPosts]
//   );
//   const latestStories = useMemo(
//     () =>
//       posts
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5),
//     [posts]
//   );
//   const trends = useMemo(() => {
//     const postsWithReactions = posts.map((post) => ({
//       ...post,
//       totalReactions:
//         (post.likes?.length || 0) +
//         (post.loves?.length || 0) +
//         (post.laughs?.length || 0) +
//         (post.sads?.length || 0),
//     }));
//     return postsWithReactions
//       .sort((a, b) => b.totalReactions - a.totalReactions)
//       .slice(0, 5);
//   }, [posts]);
//   const recentComments = useMemo(
//     () =>
//       posts
//         .flatMap((post) =>
//           (post.comments || []).map((comment) => ({
//             postId: post._id,
//             postTitle: post.title,
//             commentText: comment.text,
//             commentDate: comment.createdAt,
//           }))
//         )
//         .sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate))
//         .slice(0, 4),
//     [posts]
//   );
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
//   const profileImage = isAuthenticated
//     ? user?.profilePicture || "https://avatar.iran.liara.run/public/26"
//     : null;
//   const featuredPost = displayedPosts.length > 0 ? displayedPosts[0] : null;
//   const remainingPosts = displayedPosts.slice(1);
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
//       const allUsersData = await getUsers();
//       setAllUsers(allUsersData);
//       const newSuggestedUserIds = allUsersData
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
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };
//   // Fallback UI for lazy-loaded components
//   const LoadingFallback = () => (
//     <div className="flex justify-center items-center py-8">
//       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
//     </div>
//   );
//   const postSuggestions = useMemo(() => {
//     if (!searchQuery) return [];
//     const query = searchQuery.toLowerCase();
//     return posts
//       .filter(
//         (post) =>
//           post.title.toLowerCase().includes(query) ||
//           post.description.toLowerCase().includes(query)
//       )
//       .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//       .slice(0, 10);
//   }, [searchQuery, posts]);
//   const userSuggestions = useMemo(() => {
//     if (!isAuthenticated || !searchQuery) return [];
//     const query = searchQuery.toLowerCase();
//     return allUsers
//       .filter(
//         (u) =>
//           u._id !== user?._id &&
//           (u.username?.toLowerCase().includes(query) ||
//             u.name?.toLowerCase().includes(query))
//       )
//       .slice(0, 10);
//   }, [searchQuery, allUsers, isAuthenticated, user]);
//   return (
//     <div
//       className={`min-h-screen font-poppins transition-colors duration-500 ${
//         isDarkMode ? "bg-gray-950" : "bg-gray-100"
//       }`}
//     >
//       <Helmet>
//         <title>
//           {selectedCategory === "All"
//             ? "Gossiphub – Latest Celebrity News & Trending Entertainment"
//             : `Gossiphub – Latest ${selectedCategory} News & Updates`}
//         </title>
//         <meta
//           name="description"
//           content={
//             selectedCategory === "All"
//               ? "Get the latest celebrity news, trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
//               : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
//           }
//         />
//         <meta
//           name="keywords"
//           content={`celebrity Gossips, movie updates, film news, gossips, gossiphub, sports news, political news, entertainment news, trending gossips, viral videos, ${selectedCategory.toLowerCase()} news`}
//         />
//         <meta name="robots" content="index, follow" />
//         <meta name="author" content="GossipHub Team" />
//         <meta
//           property="og:title"
//           content={
//             selectedCategory === "All"
//               ? "Gossiphub – Latest Celebrity Gossips & Trending Entertainment"
//               : `Gossiphub – Latest ${selectedCategory} News & Updates`
//           }
//         />
//         <meta
//           property="og:description"
//           content={
//             selectedCategory === "All"
//               ? "Get the latest celebrity gossips,movie updates,film news,trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
//               : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
//           }
//         />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://gossiphub.in/" />
//         <meta property="og:image" content={featuredPost?.media || Logo} />
//         <meta
//           property="og:image:alt"
//           content={featuredPost?.title || "GossipHub Logo"}
//         />
//         <meta property="og:site_name" content="GossipHub" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta
//           name="twitter:title"
//           content={
//             selectedCategory === "All"
//               ? "Gossiphub – Latest Celebrity News & Trending Entertainment"
//               : `Gossiphub – Latest ${selectedCategory} News & Updates`
//           }
//         />
//         <meta
//           name="twitter:description"
//           content={
//             selectedCategory === "All"
//               ? "Get the latest celebrity gossips, trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
//               : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
//           }
//         />
//         <meta name="twitter:image" content={featuredPost?.media || Logo} />
//         <meta
//           name="twitter:image:alt"
//           content={featuredPost?.title || "GossipHub Logo"}
//         />
//         <link rel="canonical" href="https://gossiphub.in/" />
//         <link rel="alternate" href="https://gossiphub.in/" hreflang="en-in" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             name:
//               selectedCategory === "All"
//                 ? "GossipHub | Discover Trending Posts & Stories"
//                 : `GossipHub | ${selectedCategory} News & Stories`,
//             description:
//               selectedCategory === "All"
//                 ? "Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
//                 : `Discover the latest ${selectedCategory} news, trending stories, and exclusive gossip on GossipHub. Join now!`,
//             url: "https://gossiphub.in/",
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
//               name:
//                 selectedCategory === "All"
//                   ? "Trending Posts"
//                   : `${selectedCategory} Posts`,
//               description:
//                 selectedCategory === "All"
//                   ? "A collection of trending posts and stories on GossipHub."
//                   : `A collection of ${selectedCategory} posts and stories on GossipHub.`,
//             },
//             breadcrumb: {
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 {
//                   "@type": "ListItem",
//                   position: 1,
//                   name: "Home",
//                   item: "https://gossiphub.in/",
//                 },
//                 ...(selectedCategory !== "All"
//                   ? [
//                       {
//                         "@type": "ListItem",
//                         position: 2,
//                         name: selectedCategory,
//                         item: `https://gossiphub.in/#${selectedCategory.toLowerCase()}`,
//                       },
//                     ]
//                   : []),
//               ],
//             },
//           })}
//         </script>
//       </Helmet>
//       {/* Header (Eager-loaded) */}
//       <header
//         ref={headerRef}
//         className="fixed top-0 left-0 right-0 z-50 bg-red-600/80 backdrop-blur-md text-white shadow-lg"
//       >
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
//                 placeholder="Search posts or users..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setPage(1); // Reset to first page on search
//                 }}
//                 className={`pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
//                   isDarkMode
//                     ? "bg-gray-700 text-white"
//                     : "bg-white text-gray-950"
//                 }`}
//               />
//               {searchQuery &&
//                 (postSuggestions.length > 0 || userSuggestions.length > 0) && (
//                   <div
//                     className={`${
//                       isMobile
//                         ? "fixed left-0 right-0"
//                         : "absolute top-full left-0 w-full mt-1 max-h-80"
//                     } overflow-y-auto rounded-md shadow-lg ${
//                       isDarkMode
//                         ? "bg-gray-800 text-white"
//                         : "bg-white text-gray-900"
//                     } z-50`}
//                     style={
//                       isMobile
//                         ? {
//                             top: headerHeight,
//                             height: `calc(100vh - ${headerHeight}px)`,
//                           }
//                         : {}
//                     }
//                   >
//                     {postSuggestions.map((post) => (
//                       <Link
//                         key={post._id}
//                         to={`/posts/${post._id}`}
//                         className={`flex items-center p-2 hover:${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                         } transition-colors`}
//                         onClick={() => setSearchQuery("")}
//                       >
//                         {post.media && (
//                           <>
//                             {post.media.endsWith(".mp4") ? (
//                               <div
//                                 className={`w-10 h-10 flex items-center justify-center rounded mr-2 ${
//                                   isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                                 }`}
//                               >
//                                 <span>🎥</span>
//                               </div>
//                             ) : (
//                               <img
//                                 src={post.media}
//                                 alt={post.title}
//                                 className="w-10 h-10 object-cover rounded mr-2"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                 }
//                               />
//                             )}
//                           </>
//                         )}
//                         <span>{post.title}</span>
//                       </Link>
//                     ))}
//                     {isAuthenticated && userSuggestions.length > 0 && (
//                       <div className="p-2 font-bold border-t border-gray-700">
//                         Users
//                       </div>
//                     )}
//                     {isAuthenticated &&
//                       userSuggestions.map((u) => (
//                         <Link
//                           key={u._id}
//                           to={`/profile/${u._id}`}
//                           className={`flex items-center p-2 hover:${
//                             isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                           } transition-colors`}
//                           onClick={() => setSearchQuery("")}
//                         >
//                           <img
//                             src={
//                               u.profilePicture ||
//                               `https://avatar.iran.liara.run/public/${Math.floor(
//                                 Math.random() * 100
//                               )}`
//                             }
//                             alt={u.username}
//                             className="w-10 h-10 rounded-full object-cover mr-2"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://avatar.iran.liara.run/public")
//                             }
//                           />
//                           <span>{u.username}</span>
//                         </Link>
//                       ))}
//                   </div>
//                 )}
//             </div>
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
//               aria-label={
//                 isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//               }
//             >
//               {isDarkMode ? (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//                 </svg>
//               )}
//             </button>
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
//                         (e.target.src =
//                           "https://avatar.iran.liara.run/public/4")
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
//                     src="https://avatar.iran.liara.run/public/3"
//                     alt="Login"
//                     className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
//                     whileHover={{ scale: 1.1 }}
//                   />
//                 </Link>
//               )}
//             </nav>
//           </div>
//         </div>
//         <div
//           className={`${
//             isDarkMode ? "bg-gray-800" : "bg-white/90"
//           } backdrop-blur-md text-gray-500 shadow-md transition-colors duration-500`}
//         >
//           <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto scrollbar-hide">
//             {categories.map((category) => (
//               <motion.button
//                 key={category}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   setSelectedHashtag(""); // Reset hashtag when changing category
//                   setPage(1); // Reset to first page
//                 }}
//                 className={`px-3 py-1 text-sm font-medium uppercase tracking-wide rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap ${
//                   selectedCategory === category
//                     ? "bg-red-600 text-white"
//                     : isDarkMode
//                     ? "hover:bg-gray-700 hover:text-white"
//                     : "hover:bg-red-100 hover:text-red-600"
//                 }`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label={`Filter posts by ${category}`}
//                 role="button"
//               >
//                 {category}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </header>
//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 pt-30 md:pt-36 pb-20 md:pb-12">
//         {/* Featured Post and Recent Activity (Eager-loaded) */}
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
//                     <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`md:w-1/3 ${
//                   isDarkMode ? "bg-gray-900" : "bg-white/90"
//                 } backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors duration-500`}
//               >
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
//                             loading="lazy"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={featuredPost.media}
//                             alt={`Featured: ${featuredPost.title}`}
//                             className="w-full h-64 md:h-96 object-cover"
//                             loading="lazy"
//                             onError={(e) =>
//                               (e.target.src =
//                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                             }
//                           />
//                         ))}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
//                         <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-fit">
//                           {featuredPost.category || "General"}
//                         </span>
//                         <motion.h1
//                           className="text-2xl md:text-4xl font-bold text-white"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.2 }}
//                         >
//                           {featuredPost.title}
//                         </motion.h1>
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
//                   className={`md:w-1/3 ${
//                     isDarkMode ? "bg-gray-900" : "bg-white/90"
//                   } backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors duration-500`}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <h3
//                     className={`text-lg font-bold ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     } mb-4 flex items-center`}
//                   >
//                     <HiChatAlt className="h-6 w-6 text-blue-500 mr-2" />
//                     Recent Activity
//                   </h3>
//                   <ul className="space-y-3">
//                     {recentComments.length > 0 ? (
//                       recentComments.map((comment, index) => (
//                         <motion.li
//                           key={index}
//                           className={`text-sm ${
//                             isDarkMode ? "text-gray-300" : "text-gray-700"
//                           }`}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                         >
//                           <Link
//                             to={`/posts/${comment.postId}`}
//                             className={`font-medium ${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             } hover:text-red-600 transition-colors`}
//                           >
//                             {comment.postTitle.length > 40
//                               ? `${comment.postTitle.slice(0, 40)}...`
//                               : comment.postTitle}
//                           </Link>
//                           <p
//                             className={`text-gray-600 mt-1 line-clamp-1 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-600"
//                             }`}
//                           >
//                             {comment.commentText}
//                           </p>
//                           <p
//                             className={`text-xs mt-1 ${
//                               isDarkMode ? "text-gray-500" : "text-gray-500"
//                             }`}
//                           >
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
//                       <li
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-400" : "text-gray-500"
//                         }`}
//                       >
//                         No recent activity available.
//                       </li>
//                     )}
//                   </ul>
//                 </motion.div>
//               </div>
//             </motion.section>
//           )
//         )}
//         {/* Lazy-loaded Sections */}
//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="mb-8"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[200px] bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//                   >
//                     <div className="w-full h-32 bg-gray-200"></div>
//                     <div className="p-3">
//                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <TrendingSection trends={trends} isDarkMode={isDarkMode} />
//           )}
//         </Suspense>
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="md:w-2/3">
//             {/* Main Post List (Eager-loaded) */}
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
//             ) : displayedPosts.length === 0 ? (
//               <motion.div
//                 className={`text-center py-12 ${
//                   isDarkMode ? "bg-gray-900" : "bg-white"
//                 } rounded-xl shadow-md transition-colors duration-500`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <HiDocumentText className="mx-auto h-24 w-24 text-red-400" />
//                 <h3
//                   className={`mt-4 text-xl font-semibold ${
//                     isDarkMode ? "text-gray-100" : "text-gray-900"
//                   }`}
//                 >
//                   No Gossips in {selectedCategory}!
//                 </h3>
//                 <p
//                   className={`mt-2 max-w-md mx-auto text-sm ${
//                     isDarkMode ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
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
//                   {displayedPosts.map((post, index) => (
//                     <motion.div
//                       key={post._id}
//                       className={`${
//                         isDarkMode ? "bg-gray-800" : "bg-white"
//                       } lg:rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transition-colors duration-500`}
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
//                                 className="w-full lg:h-45 object-cover"
//                                 loading="lazy"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
//                                 }
//                               />
//                             ) : (
//                               <img
//                                 src={post.media}
//                                 alt={`Post: ${post.title}`}
//                                 className="w-full lg:h-45 object-cover"
//                                 loading="lazy"
//                                 onError={(e) =>
//                                   (e.target.src =
//                                     "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                 }
//                               />
//                             )}
//                           </div>
//                         )}
//                         <div className="p-4 sm:w-2/3">
//                           <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1">
//                             {post.category || "General"}
//                           </span>
//                           <h3
//                             className={`text-lg font-bold ${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             } mt-2`}
//                           >
//                             <Link
//                               to={`/posts/${post._id}`}
//                               className="hover:text-red-600 transition-colors duration-200"
//                             >
//                               {post.title}
//                             </Link>
//                           </h3>
//                           <p
//                             className={`text-sm mt-1 line-clamp-2 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-600"
//                             }`}
//                           >
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
//                           <div
//                             className={`flex items-center justify-between text-xs mt-3 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-500"
//                             }`}
//                           >
//                             <p>
//                               By{" "}
//                               {post.isAnonymous
//                                 ? "Anonymous"
//                                 : post.author?.username || "Unknown"}
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               <motion.button
//                                 onClick={() => handleReaction(post._id, "like")}
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.like
//                                     ? "bg-red-600 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Like post (${
//                                   post.likes?.length || 0
//                                 } likes)${
//                                   userReactions[post._id]?.like
//                                     ? " (You liked this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.like
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   👍
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.likes?.length || 0}
//                                 </span>
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => handleReaction(post._id, "love")}
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.love
//                                     ? "bg-pink-600 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Love post (${
//                                   post.loves?.length || 0
//                                 } loves)${
//                                   userReactions[post._id]?.love
//                                     ? " (You loved this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.love
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   💖
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.loves?.length || 0}
//                                 </span>
//                               </motion.button>
//                               <motion.button
//                                 onClick={() =>
//                                   handleReaction(post._id, "laugh")
//                                 }
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.laugh
//                                     ? "bg-yellow-500 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Laugh at post (${
//                                   post.laughs?.length || 0
//                                 } laughs)${
//                                   userReactions[post._id]?.laugh
//                                     ? " (You laughed at this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.laugh
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   😂
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.laughs?.length || 0}
//                                 </span>
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => handleReaction(post._id, "sad")}
//                                 className={`flex items-center ${
//                                   userReactions[post._id]?.sad
//                                     ? "bg-blue-600 text-white"
//                                     : isDarkMode
//                                     ? "bg-gray-700 text-gray-300"
//                                     : "bg-gray-200 text-gray-600"
//                                 } px-2 py-1 rounded-full transition-colors duration-200 ${
//                                   isReacting === post._id
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 disabled={isReacting === post._id}
//                                 aria-label={`Sad reaction (${
//                                   post.sads?.length || 0
//                                 } sads)${
//                                   userReactions[post._id]?.sad
//                                     ? " (You felt sad about this)"
//                                     : ""
//                                 }`}
//                               >
//                                 <motion.span
//                                   animate={
//                                     userReactions[post._id]?.sad
//                                       ? { scale: [1, 1.3, 1] }
//                                       : {}
//                                   }
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   😢
//                                 </motion.span>
//                                 <span className="ml-1">
//                                   {post.sads?.length || 0}
//                                 </span>
//                               </motion.button>
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
//                           className={`absolute top-4 right-4 p-2 rounded-full ${
//                             isDarkMode ? "bg-gray-600" : "bg-gray-200"
//                           } transition-colors duration-500`}
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleQuickShare(post)}
//                           aria-label="Quick share"
//                         >
//                           <HiShare
//                             className={`h-5 w-5 ${
//                               isDarkMode ? "text-gray-300" : "text-gray-600"
//                             }`}
//                           />
//                         </motion.button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//                 {totalPages > 1 && (
//                   <div className="flex justify-center mt-8 flex-wrap gap-3 px-4">
//                     <motion.button
//                       onClick={() => handlePageChange(page - 1)}
//                       disabled={page === 1}
//                       className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 shadow-md min-w-[100px] ${
//                         page === 1
//                           ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           : isDarkMode
//                           ? "bg-gray-700 text-white hover:bg-gray-600"
//                           : "bg-red-600 text-white hover:bg-red-700"
//                       }`}
//                       whileHover={{ scale: page === 1 ? 1 : 1.05 }}
//                       whileTap={{ scale: page === 1 ? 1 : 0.95 }}
//                       aria-label="Previous page"
//                     >
//                       Previous
//                     </motion.button>
//                     <div className="flex items-center flex-wrap gap-2">
//                       {Array.from(
//                         { length: Math.min(totalPages, 4) },
//                         (_, index) => {
//                           const pageNumber = index + 1;
//                           return (
//                             <motion.button
//                               key={pageNumber}
//                               onClick={() => handlePageChange(pageNumber)}
//                               className={`w-6 h-6 text-sm font-medium rounded-full transition-all duration-300 shadow-sm ${
//                                 page === pageNumber
//                                   ? "bg-red-600 text-white"
//                                   : isDarkMode
//                                   ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                                   : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                               }`}
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.95 }}
//                               aria-label={`Go to page ${pageNumber}`}
//                             >
//                               {pageNumber}
//                             </motion.button>
//                           );
//                         }
//                       )}
//                       {totalPages > 4 && (
//                         <span
//                           className={`text-sm ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           } px-2`}
//                         >
//                           ...
//                         </span>
//                       )}
//                       {totalPages > 4 && (
//                         <motion.button
//                           key={totalPages}
//                           onClick={() => handlePageChange(totalPages)}
//                           className={`w-6 h-6 text-sm font-medium rounded-full transition-all duration-300 shadow-sm ${
//                             page === totalPages
//                               ? "bg-red-600 text-white"
//                               : isDarkMode
//                               ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                               : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                           }`}
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.95 }}
//                           aria-label={`Go to page ${totalPages}`}
//                         >
//                           {totalPages}
//                         </motion.button>
//                       )}
//                     </div>
//                     <motion.button
//                       onClick={() => handlePageChange(page + 1)}
//                       disabled={page === totalPages}
//                       className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 shadow-md min-w-[100px] ${
//                         page === totalPages
//                           ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           : isDarkMode
//                           ? "bg-gray-700 text-white hover:bg-gray-600"
//                           : "bg-red-600 text-white hover:bg-red-700"
//                       }`}
//                       whileHover={{ scale: page === totalPages ? 1 : 1.05 }}
//                       whileTap={{ scale: page === totalPages ? 1 : 0.95 }}
//                       aria-label="Next page"
//                     >
//                       Next
//                     </motion.button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           {/* Sidebar with Lazy-loaded Sections */}
//           <div className="md:w-1/3 space-y-6 md:sticky md:top-36 md:h-[calc(100vh-144px)] md:overflow-y-auto scrollbar-hide">
//             <Suspense fallback={<LoadingFallback />}>
//               {isAuthenticated && (
//                 <ReactionStreakSection user={user} isDarkMode={isDarkMode} />
//               )}
//             </Suspense>
//             <Suspense fallback={<LoadingFallback />}>
//               {loading ? (
//                 <motion.section
//                   className="bg-white p-4 rounded-xl shadow-lg"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.1 }}
//                 >
//                   <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//                   <div className="space-y-4">
//                     {[...Array(5)].map((_, index) => (
//                       <div key={index} className="flex gap-3 animate-pulse">
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.section>
//               ) : (
//                 <LatestStoriesSection
//                   latestStories={latestStories}
//                   isDarkMode={isDarkMode}
//                 />
//               )}
//             </Suspense>
//             <Suspense fallback={<LoadingFallback />}>
//               {loading ? (
//                 <motion.section
//                   className="bg-white p-4 rounded-xl shadow-lg"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.2 }}
//                 >
//                   <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//                   <div className="space-y-4">
//                     {[...Array(3)].map((_, index) => (
//                       <div key={index} className="flex gap-3 animate-pulse">
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.section>
//               ) : (
//                 <MostViewedSection
//                   mostViewedPosts={mostViewedPosts}
//                   isDarkMode={isDarkMode}
//                 />
//               )}
//             </Suspense>
//           </div>
//         </div>
//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-12 mb-8"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[150px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 animate-pulse"
//                   >
//                     <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
//                     <div className="h-8 bg-gray-200 rounded-full w-20"></div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <SuggestedUsersSection
//               suggestedUsers={suggestedUsers}
//               isDarkMode={isDarkMode}
//               followedUsers={followedUsers}
//               handleFollow={handleFollow}
//             />
//           )}
//         </Suspense>
//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-12"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {[...Array(3)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//                   >
//                     <div className="w-full h-40 bg-gray-200"></div>
//                     <div className="p-4">
//                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <RecommendedSection
//               recommendedPosts={recommendedPosts}
//               isDarkMode={isDarkMode}
//             />
//           )}
//         </Suspense>
//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="mt-12"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
//                   >
//                     <div className="w-full h-32 bg-gray-200"></div>
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//                       <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <PhotosSection photoPosts={photoPosts} isDarkMode={isDarkMode} />
//           )}
//         </Suspense>
//         <Suspense fallback={<LoadingFallback />}>
//           {loading ? (
//             <motion.section
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               className="mt-12"
//             >
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="relative rounded-lg overflow-hidden shadow-md animate-pulse"
//                   >
//                     <div className="w-full h-32 bg-gray-200"></div>
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//                       <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.section>
//           ) : (
//             <VideosSection videoPosts={videoPosts} isDarkMode={isDarkMode} />
//           )}
//         </Suspense>
//       </main>
//       {/* Footer */}
//       <footer
//         className={`${
//           isDarkMode ? "bg-gray-900" : "bg-gray-800"
//         } text-white py-6 transition-colors duration-500`}
//       >
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-sm">
//             &copy; {new Date().getFullYear()} GossipHub. All rights reserved.
//           </p>
//           <div className="mt-4 flex justify-center space-x-4">
//             <a
//               href="https://x.com/Charankumar2580"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-gray-200"
//             >
//               <BsTwitterX className="text-red-600 text-xl" />
//             </a>
//             <a
//               href="https://facebook.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-gray-200"
//             >
//               <BsFacebook className="text-red-600 text-xl" />
//             </a>
//             <a
//               href="https://www.instagram.com/gossiphub247?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-gray-200"
//             >
//               <AiFillInstagram className="text-red-600 text-xl" />
//             </a>
//           </div>
//           <div className="mt-4 flex justify-center space-x-4">
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
//         </div>
//       </footer>
//       {/* Back to Top Button */}
//       <motion.button
//         className="fixed bottom-15 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300"
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         aria-label="Back to top"
//       >
//         <HiArrowUp className="h-5 w-5" />
//       </motion.button>
//       {/* Mobile Navigation */}
//       <nav
//         className={`fixed bottom-0 left-0 right-0 ${
//           isDarkMode ? "bg-gray-900" : "bg-white"
//         } md:hidden flex justify-around py-3 shadow-lg transition-colors duration-500 z-50`}
//       >
//         <Link
//           to="/create-post"
//           className="p-1 flex flex-col items-center"
//           aria-label="Create Post"
//         >
//           <HiPlus
//             className={`h-6 w-6 ${
//               isDarkMode
//                 ? "text-gray-300 bg-red-500 rounded-2xl"
//                 : "text-red-600 bg-red-100 rounded-2xl "
//             }`}
//           />
//         </Link>
//         <Link
//           to="/notifications"
//           className=" p-1 flex flex-col items-center"
//           aria-label="Notifications"
//         >
//           <HiBell
//             className={`h-6 w-6 ${
//               isDarkMode ? "text-gray-300" : "text-gray-600"
//             }`}
//           />
//         </Link>
//         <Link
//           to={isAuthenticated ? "/profile" : "/login"}
//           className="p-1 rounded-full transition-all duration-200 flex flex-col items-center"
//           aria-label={isAuthenticated ? "Profile" : "Login"}
//           title={isAuthenticated ? "Profile" : "Login"}
//         >
//           {isAuthenticated ? (
//             <div className="relative">
//               <img
//                 src={profileImage}
//                 alt="User profile picture"
//                 className="h-6 w-6 rounded-full object-cover border-2 border-gray-500 hover:border-gray-600 transition-all duration-200"
//                 onError={(e) =>
//                   (e.target.src = "https://avatar.iran.liara.run/public/9")
//                 }
//               />
//             </div>
//           ) : (
//             <HiUser className="h-5 w-5 text-gray-600" />
//           )}
//         </Link>
//       </nav>
//     </div>
//   );
// };
// export default PostList;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import {
  useState,
  useEffect,
  useMemo,
  lazy,
  Suspense,
  useRef,
  useCallback,
} from "react";
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
  HiSearch,
  HiShare,
  HiFire,
} from "react-icons/hi";
import { BsFacebook, BsTwitterX } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import {
  getPosts,
  getPostsByHashtag,
  getUserProfile,
  getPublicUserProfile,
  getUsers,
  followUser,
  unfollowUser,
  addReaction,
} from "../utils/api";
import Logo from "../assets/GossippHublogo.svg";
import confetti from "canvas-confetti";

const TrendingSection = lazy(() => import("./TrendingSection"));
const LatestStoriesSection = lazy(() => import("./LatestStoriesSection"));
const MostViewedSection = lazy(() => import("./MostViewedSection"));
const RecommendedSection = lazy(() => import("./RecommendedSection"));
const PhotosSection = lazy(() => import("./PhotosSection"));
const VideosSection = lazy(() => import("./VideosSection"));
const SuggestedUsersSection = lazy(() => import("./SuggestedUsersSection"));
const ReactionStreakSection = lazy(() => import("./ReactionStreakSection"));

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Matches backend default
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [isReacting, setIsReacting] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isAuthenticated = !!localStorage.getItem("token");
  const headerRef = useRef(null);
  const loaderRef = useRef(null); // Reference for the load more trigger

  // Generate or retrieve session seed for randomization
  const sessionSeed = useMemo(() => {
    if (isAuthenticated) {
      return localStorage.getItem("userId") || "anonymous";
    }
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }, [isAuthenticated]);

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Update header height and isMobile
  useEffect(() => {
    const updateDimensions = () => {
      setIsMobile(window.innerWidth < 768);
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.clientHeight);
      }
    };
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
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

  // Fetch posts and user data
  const fetchPosts = useCallback(
    async (pageToFetch, append = false) => {
      setLoading(true);
      try {
        let postsRes, userRes, allUsersRes;
        if (isAuthenticated) {
          [postsRes, userRes, allUsersRes] = await Promise.all([
            selectedHashtag
              ? getPostsByHashtag(selectedHashtag, { page: pageToFetch, limit })
              : getPosts({
                  page: pageToFetch,
                  limit,
                  hashtag: selectedHashtag,
                }),
            getUserProfile(),
            getUsers(),
          ]);
          setAllUsers(allUsersRes);
          setUser(userRes);
        } else {
          postsRes = await (selectedHashtag
            ? getPostsByHashtag(selectedHashtag, { page: pageToFetch, limit })
            : getPosts({ page: pageToFetch, limit, hashtag: selectedHashtag }));
        }

        // Update posts and pagination data
        const sanitizedPosts = (postsRes.posts || []).map((post) => ({
          ...post,
          media:
            typeof post.media === "string" && post.media.trim() !== ""
              ? post.media
              : null,
        }));

        setPosts((prevPosts) =>
          append ? [...prevPosts, ...sanitizedPosts] : sanitizedPosts
        );
        setTotalPages(postsRes.totalPages || 1);
        const uniqueCategories = [
          "All",
          ...new Set(sanitizedPosts.map((post) => post.category || "General")),
        ];
        setCategories(uniqueCategories);

        if (isAuthenticated) {
          // Initialize userReactions based on posts and user ID
          const userId = localStorage.getItem("userId");
          const reactions = {};
          sanitizedPosts.forEach((post) => {
            reactions[post._id] = {
              like: post.likes?.includes(userId) || false,
              love: post.loves?.includes(userId) || false,
              laugh: post.laughs?.includes(userId) || false,
              sad: post.sads?.includes(userId) || false,
            };
          });
          setUserReactions((prev) => ({ ...prev, ...reactions }));
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
          const suggestedUserIds = allUsersRes
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
          const shuffledUsers = shuffleArray(filteredUsers);
          setSuggestedUsers(shuffledUsers);
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to fetch posts";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, selectedHashtag, limit]
  );

  // Initial fetch
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts, selectedHashtag]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            if (nextPage <= totalPages) {
              fetchPosts(nextPage, true);
            }
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, page, totalPages, fetchPosts]);

  // Handle reaction click
  const handleReaction = async (postId, type) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add a reaction");
      return;
    }
    if (isReacting === postId) return;
    setIsReacting(postId);
    try {
      const userId = localStorage.getItem("userId");
      const newReactions = {
        ...userReactions,
        [postId]: {
          ...userReactions[postId],
          [type]: !userReactions[postId][type],
        },
      };
      setUserReactions(newReactions);
      const updatedReactions = await addReaction(postId, { type });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: updatedReactions.likes || [],
                loves: updatedReactions.loves || [],
                laughs: updatedReactions.laughs || [],
                sads: updatedReactions.sads || [],
              }
            : post
        )
      );
      const user = await getUserProfile();
      setUser(user);
      if (newReactions[postId][type]) {
        toast.success(`Reaction added! Streak: ${user.reactionStreak}`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#ff0000", "#ff7300", "#fff400"],
        });
        if (user.streakRewards.includes(`Day ${user.reactionStreak} Streak`)) {
          toast.success("🎉 Streak Goal Reached! Badge Earned!");
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to add reaction");
      setUserReactions((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          [type]: !prev[postId][type],
        },
      }));
    } finally {
      setIsReacting(null);
    }
  };

  // Filter and search posts
  const filteredPosts = useMemo(
    () =>
      selectedCategory === "All"
        ? posts
        : posts.filter(
            (post) => (post.category || "General") === selectedCategory
          ),
    [posts, selectedCategory]
  );

  const searchedPosts = useMemo(
    () =>
      searchQuery
        ? filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : filteredPosts,
    [filteredPosts, searchQuery]
  );

  // Randomize displayed posts for main list
  const displayedPosts = useMemo(
    () => shuffleArray(searchedPosts),
    [searchedPosts, sessionSeed]
  );

  // Prepare data for sections with randomization from all filtered posts
  const videoPosts = useMemo(
    () =>
      shuffleArray(
        searchedPosts
          .filter(
            (post) =>
              post.media &&
              typeof post.media === "string" &&
              post.media.endsWith(".mp4")
          )
          .slice(0, 5)
      ),
    [searchedPosts, sessionSeed]
  );

  const photoPosts = useMemo(
    () =>
      shuffleArray(
        searchedPosts
          .filter(
            (post) =>
              post.media &&
              typeof post.media === "string" &&
              !post.media.endsWith(".mp4")
          )
          .slice(0, 5)
      ),
    [searchedPosts, sessionSeed]
  );

  const recommendedPosts = useMemo(
    () =>
      shuffleArray(
        searchedPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
      ),
    [searchedPosts, sessionSeed]
  );

  const mostViewedPosts = useMemo(
    () =>
      searchedPosts
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 3),
    [searchedPosts]
  );

  const latestStories = useMemo(
    () =>
      posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [posts]
  );

  const trends = useMemo(() => {
    const postsWithReactions = posts.map((post) => ({
      ...post,
      totalReactions:
        (post.likes?.length || 0) +
        (post.loves?.length || 0) +
        (post.laughs?.length || 0) +
        (post.sads?.length || 0),
    }));
    return postsWithReactions
      .sort((a, b) => b.totalReactions - a.totalReactions)
      .slice(0, 5);
  }, [posts]);

  const recentComments = useMemo(
    () =>
      posts
        .flatMap((post) =>
          (post.comments || []).map((comment) => ({
            postId: post._id,
            postTitle: post.title,
            commentText: comment.text,
            commentDate: comment.createdAt,
          }))
        )
        .sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate))
        .slice(0, 4),
    [posts]
  );

  const profileImage = isAuthenticated
    ? user?.profilePicture || "https://avatar.iran.liara.run/public/26"
    : null;

  const featuredPost = displayedPosts.length > 0 ? displayedPosts[0] : null;

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
      const allUsersData = await getUsers();
      setAllUsers(allUsersData);
      const newSuggestedUserIds = allUsersData
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

  // Fallback UI for lazy-loaded components
  const LoadingFallback = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  const postSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      )
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 10);
  }, [searchQuery, posts]);

  const userSuggestions = useMemo(() => {
    if (!isAuthenticated || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allUsers
      .filter(
        (u) =>
          u._id !== user?._id &&
          (u.username?.toLowerCase().includes(query) ||
            u.name?.toLowerCase().includes(query))
      )
      .slice(0, 10);
  }, [searchQuery, allUsers, isAuthenticated, user]);

  return (
    <div
      className={`min-h-screen font-poppins transition-colors duration-500 ${
        isDarkMode ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      <Helmet>
        <title>
          {selectedCategory === "All"
            ? "Gossiphub – Latest Celebrity News & Trending Entertainment"
            : `Gossiphub – Latest ${selectedCategory} News & Updates`}
        </title>
        <meta
          name="description"
          content={
            selectedCategory === "All"
              ? "Get the latest celebrity news, trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
              : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
          }
        />
        <meta
          name="keywords"
          content={`celebrity Gossips, movie updates, film news, gossips, gossiphub, sports news, political news, entertainment news, trending gossips, viral videos, ${selectedCategory.toLowerCase()} news`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GossipHub Team" />
        <meta
          property="og:title"
          content={
            selectedCategory === "All"
              ? "Gossiphub – Latest Celebrity Gossips & Trending Entertainment"
              : `Gossiphub – Latest ${selectedCategory} News & Updates`
          }
        />
        <meta
          property="og:description"
          content={
            selectedCategory === "All"
              ? "Get the latest celebrity gossips,movie updates,film news,trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
              : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gossiphub.in/" />
        <meta property="og:image" content={featuredPost?.media || Logo} />
        <meta
          property="og:image:alt"
          content={featuredPost?.title || "GossipHub Logo"}
        />
        <meta property="og:site_name" content="GossipHub" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            selectedCategory === "All"
              ? "Gossiphub – Latest Celebrity News & Trending Entertainment"
              : `Gossiphub – Latest ${selectedCategory} News & Updates`
          }
        />
        <meta
          name="twitter:description"
          content={
            selectedCategory === "All"
              ? "Get the latest celebrity gossips, trending entertainment, and viral videos on Gossiphub. Join for exclusive gossip and updates!"
              : `Explore the latest ${selectedCategory} news, gossip, and viral updates on Gossiphub. Stay updated with exclusive stories!`
          }
        />
        <meta name="twitter:image" content={featuredPost?.media || Logo} />
        <meta
          name="twitter:image:alt"
          content={featuredPost?.title || "GossipHub Logo"}
        />
        <link rel="canonical" href="https://gossiphub.in/" />
        <link rel="alternate" href="https://gossiphub.in/" hreflang="en-in" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name:
              selectedCategory === "All"
                ? "GossipHub | Discover Trending Posts & Stories"
                : `GossipHub | ${selectedCategory} News & Stories`,
            description:
              selectedCategory === "All"
                ? "Explore the latest posts, trending stories, and user suggestions on GossipHub. Join the conversation and share your own gossip today!"
                : `Discover the latest ${selectedCategory} news, trending stories, and exclusive gossip on GossipHub. Join now!`,
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
              name:
                selectedCategory === "All"
                  ? "Trending Posts"
                  : `${selectedCategory} Posts`,
              description:
                selectedCategory === "All"
                  ? "A collection of trending posts and stories on GossipHub."
                  : `A collection of ${selectedCategory} posts and stories on GossipHub.`,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://gossiphub.in/",
                },
                ...(selectedCategory !== "All"
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: selectedCategory,
                        item: `https://gossiphub.in/#${selectedCategory.toLowerCase()}`,
                      },
                    ]
                  : []),
              ],
            },
          })}
        </script>
      </Helmet>
      {/* Header (Eager-loaded) */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-red-600/80 backdrop-blur-md text-white shadow-lg"
      >
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
                placeholder="Search posts or users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on search
                  setPosts([]); // Clear posts to start fresh
                  fetchPosts(1); // Fetch first page
                }}
                className={`pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-950"
                }`}
              />
              {searchQuery &&
                (postSuggestions.length > 0 || userSuggestions.length > 0) && (
                  <div
                    className={`${
                      isMobile
                        ? "fixed left-0 right-0"
                        : "absolute top-full left-0 w-full mt-1 max-h-80"
                    } overflow-y-auto rounded-md shadow-lg ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900"
                    } z-50`}
                    style={
                      isMobile
                        ? {
                            top: headerHeight,
                            height: `calc(100vh - ${headerHeight}px)`,
                          }
                        : {}
                    }
                  >
                    {postSuggestions.map((post) => (
                      <Link
                        key={post._id}
                        to={`/posts/${post._id}`}
                        className={`flex items-center p-2 hover:${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        } transition-colors`}
                        onClick={() => setSearchQuery("")}
                      >
                        {post.media && (
                          <>
                            {post.media.endsWith(".mp4") ? (
                              <div
                                className={`w-10 h-10 flex items-center justify-center rounded mr-2 ${
                                  isDarkMode ? "bg-gray-700" : "bg-gray-300"
                                }`}
                              >
                                <span>🎥</span>
                              </div>
                            ) : (
                              <img
                                src={post.media}
                                alt={post.title}
                                className="w-10 h-10 object-cover rounded mr-2"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                                }
                              />
                            )}
                          </>
                        )}
                        <span>{post.title}</span>
                      </Link>
                    ))}
                    {isAuthenticated && userSuggestions.length > 0 && (
                      <div className="p-2 font-bold border-t border-gray-700">
                        Users
                      </div>
                    )}
                    {isAuthenticated &&
                      userSuggestions.map((u) => (
                        <Link
                          key={u._id}
                          to={`/profile/${u._id}`}
                          className={`flex items-center p-2 hover:${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } transition-colors`}
                          onClick={() => setSearchQuery("")}
                        >
                          <img
                            src={
                              u.profilePicture ||
                              `https://avatar.iran.liara.run/public/${Math.floor(
                                Math.random() * 100
                              )}`
                            }
                            alt={u.username}
                            className="w-10 h-10 rounded-full object-cover mr-2"
                            onError={(e) =>
                              (e.target.src =
                                "https://avatar.iran.liara.run/public")
                            }
                          />
                          <span>{u.username}</span>
                        </Link>
                      ))}
                  </div>
                )}
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
                        (e.target.src =
                          "https://avatar.iran.liara.run/public/4")
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
                    src="https://avatar.iran.liara.run/public/3"
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
          <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedHashtag(""); // Reset hashtag when changing category
                  setPage(1); // Reset to first page
                  setPosts([]); // Clear posts
                  fetchPosts(1); // Fetch first page
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
                aria-label={`Filter posts by ${category}`}
                role="button"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-30 md:pt-36 pb-20 md:pb-12">
        {/* Featured Post and Recent Activity (Eager-loaded) */}
        {loading && posts.length === 0 ? (
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
                    <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
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
                            loading="lazy"
                            onError={(e) =>
                              (e.target.src =
                                "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
                            }
                          />
                        ) : (
                          <img
                            src={featuredPost.media}
                            alt={`Featured: ${featuredPost.title}`}
                            className="w-full h-64 md:h-96 object-cover"
                            loading="lazy"
                            onError={(e) =>
                              (e.target.src =
                                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                            }
                          />
                        ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-xs font-medium text-white bg-red-600 rounded-full px-3 py-1 mb-2 w-fit">
                          {featuredPost.category || "General"}
                        </span>
                        <motion.h1
                          className="text-2xl md:text-4xl font-bold text-white"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {featuredPost.title}
                        </motion.h1>
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
        {/* Lazy-loaded Sections */}
        <Suspense fallback={<LoadingFallback />}>
          {loading && posts.length === 0 ? (
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
            <TrendingSection trends={trends} isDarkMode={isDarkMode} />
          )}
        </Suspense>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {/* Main Post List (Eager-loaded) */}
            {loading && posts.length === 0 ? (
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
            ) : displayedPosts.length === 0 ? (
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
                  {displayedPosts.map((post, index) => (
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
                                className="w-full lg:h-45 object-cover"
                                loading="lazy"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
                                }
                              />
                            ) : (
                              <img
                                src={post.media}
                                alt={`Post: ${post.title}`}
                                className="w-full lg:h-45 object-cover"
                                loading="lazy"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
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
                              <motion.button
                                onClick={() => handleReaction(post._id, "like")}
                                className={`flex items-center ${
                                  userReactions[post._id]?.like
                                    ? "bg-red-600 text-white"
                                    : isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-600"
                                } px-2 py-1 rounded-full transition-colors duration-200 ${
                                  isReacting === post._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isReacting === post._id}
                                aria-label={`Like post (${
                                  post.likes?.length || 0
                                } likes)${
                                  userReactions[post._id]?.like
                                    ? " (You liked this)"
                                    : ""
                                }`}
                              >
                                <motion.span
                                  animate={
                                    userReactions[post._id]?.like
                                      ? { scale: [1, 1.3, 1] }
                                      : {}
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  👍
                                </motion.span>
                                <span className="ml-1">
                                  {post.likes?.length || 0}
                                </span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleReaction(post._id, "love")}
                                className={`flex items-center ${
                                  userReactions[post._id]?.love
                                    ? "bg-pink-600 text-white"
                                    : isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-600"
                                } px-2 py-1 rounded-full transition-colors duration-200 ${
                                  isReacting === post._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isReacting === post._id}
                                aria-label={`Love post (${
                                  post.loves?.length || 0
                                } loves)${
                                  userReactions[post._id]?.love
                                    ? " (You loved this)"
                                    : ""
                                }`}
                              >
                                <motion.span
                                  animate={
                                    userReactions[post._id]?.love
                                      ? { scale: [1, 1.3, 1] }
                                      : {}
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  💖
                                </motion.span>
                                <span className="ml-1">
                                  {post.loves?.length || 0}
                                </span>
                              </motion.button>
                              <motion.button
                                onClick={() =>
                                  handleReaction(post._id, "laugh")
                                }
                                className={`flex items-center ${
                                  userReactions[post._id]?.laugh
                                    ? "bg-yellow-500 text-white"
                                    : isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-600"
                                } px-2 py-1 rounded-full transition-colors duration-200 ${
                                  isReacting === post._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isReacting === post._id}
                                aria-label={`Laugh at post (${
                                  post.laughs?.length || 0
                                } laughs)${
                                  userReactions[post._id]?.laugh
                                    ? " (You laughed at this)"
                                    : ""
                                }`}
                              >
                                <motion.span
                                  animate={
                                    userReactions[post._id]?.laugh
                                      ? { scale: [1, 1.3, 1] }
                                      : {}
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  😂
                                </motion.span>
                                <span className="ml-1">
                                  {post.laughs?.length || 0}
                                </span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleReaction(post._id, "sad")}
                                className={`flex items-center ${
                                  userReactions[post._id]?.sad
                                    ? "bg-blue-600 text-white"
                                    : isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-600"
                                } px-2 py-1 rounded-full transition-colors duration-200 ${
                                  isReacting === post._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isReacting === post._id}
                                aria-label={`Sad reaction (${
                                  post.sads?.length || 0
                                } sads)${
                                  userReactions[post._id]?.sad
                                    ? " (You felt sad about this)"
                                    : ""
                                }`}
                              >
                                <motion.span
                                  animate={
                                    userReactions[post._id]?.sad
                                      ? { scale: [1, 1.3, 1] }
                                      : {}
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  😢
                                </motion.span>
                                <span className="ml-1">
                                  {post.sads?.length || 0}
                                </span>
                              </motion.button>
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
                {/* Load More Trigger */}
                {page < totalPages && (
                  <div ref={loaderRef} className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                  </div>
                )}
                {page >= totalPages && posts.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No more posts to load.
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Sidebar with Lazy-loaded Sections */}
          <div className="md:w-1/3 space-y-6 md:sticky md:top-36 md:h-[calc(100vh-144px)] md:overflow-y-auto scrollbar-hide">
            <Suspense fallback={<LoadingFallback />}>
              {isAuthenticated && (
                <ReactionStreakSection user={user} isDarkMode={isDarkMode} />
              )}
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              {loading && posts.length === 0 ? (
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
                <LatestStoriesSection
                  latestStories={latestStories}
                  isDarkMode={isDarkMode}
                />
              )}
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              {loading && posts.length === 0 ? (
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
                <MostViewedSection
                  mostViewedPosts={mostViewedPosts}
                  isDarkMode={isDarkMode}
                />
              )}
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          {loading && posts.length === 0 ? (
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
            <SuggestedUsersSection
              suggestedUsers={suggestedUsers}
              isDarkMode={isDarkMode}
              followedUsers={followedUsers}
              handleFollow={handleFollow}
            />
          )}
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          {loading && posts.length === 0 ? (
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
            <RecommendedSection
              recommendedPosts={recommendedPosts}
              isDarkMode={isDarkMode}
            />
          )}
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          {loading && posts.length === 0 ? (
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
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : (
            <PhotosSection photoPosts={photoPosts} isDarkMode={isDarkMode} />
          )}
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          {loading && posts.length === 0 ? (
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
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : (
            <VideosSection videoPosts={videoPosts} isDarkMode={isDarkMode} />
          )}
        </Suspense>
      </main>
      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-gray-900" : "bg-gray-800"
        } text-white py-6 transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} GossipHub. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="https://x.com/Charankumar2580"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <BsTwitterX className="text-red-600 text-xl" />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <BsFacebook className="text-red-600 text-xl" />
            </a>
            <a
              href="https://www.instagram.com/gossiphub247?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <AiFillInstagram className="text-red-600 text-xl" />
            </a>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
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
        </div>
      </footer>
      {/* Back to Top Button */}
      <motion.button
        className="fixed bottom-15 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <HiArrowUp className="h-5 w-5" />
      </motion.button>
      {/* Mobile Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } md:hidden flex justify-around py-3 shadow-lg transition-colors duration-500 z-50`}
      >
        <Link
          to="/create-post"
          className="p-1 flex flex-col items-center"
          aria-label="Create Post"
        >
          <HiPlus
            className={`h-6 w-6 ${
              isDarkMode
                ? "text-gray-300 bg-red-500 rounded-2xl"
                : "text-red-600 bg-red-100 rounded-2xl "
            }`}
          />
        </Link>
        <Link
          to="/notifications"
          className=" p-1 flex flex-col items-center"
          aria-label="Notifications"
        >
          <HiBell
            className={`h-6 w-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />
        </Link>
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className="p-1 rounded-full transition-all duration-200 flex flex-col items-center"
          aria-label={isAuthenticated ? "Profile" : "Login"}
          title={isAuthenticated ? "Profile" : "Login"}
        >
          {isAuthenticated ? (
            <div className="relative">
              <img
                src={profileImage}
                alt="User profile picture"
                className="h-6 w-6 rounded-full object-cover border-2 border-gray-500 hover:border-gray-600 transition-all duration-200"
                onError={(e) =>
                  (e.target.src = "https://avatar.iran.liara.run/public/9")
                }
              />
            </div>
          ) : (
            <HiUser className="h-5 w-5 text-gray-600" />
          )}
        </Link>
      </nav>
    </div>
  );
};

export default PostList;
