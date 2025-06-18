// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import {
//   getPosts,
//   addReaction,
//   addComment,
//   addCommentReaction,
//   getUserProfile,
// } from "../utils/api";
// import {
//   FaShareAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaLink,
//   FaTelegram,
//   FaLinkedin,
//   FaHeart,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import {
//   HiArrowLeft,
//   HiArrowRight,
//   HiVolumeUp,
//   HiVolumeOff,
// } from "react-icons/hi";
// import { Helmet } from "react-helmet";
// import confetti from "canvas-confetti";

// // Utility function to calculate time difference and return "time ago" format
// const timeAgo = (date) => {
//   const now = new Date(); // Use dynamic current time
//   const past = new Date(date);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   // Handle future dates or very recent times
//   if (diffInSeconds < 0 || diffInSeconds < 10) {
//     return "Just now";
//   }

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
// };

// const PostDetails = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [allPosts, setAllPosts] = useState([]);
//   const [comment, setComment] = useState("");
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [categories, setCategories] = useState(["All"]);
//   const isAuthenticated = !!localStorage.getItem("token");
//   const [userReaction, setUserReaction] = useState({
//     like: false,
//     love: false,
//     laugh: false,
//     sad: false,
//   });
//   const [isCopied, setIsCopied] = useState(false);
//   const [reactionStreak, setReactionStreak] = useState(0);
//   const [streakRewards, setStreakRewards] = useState([]);
//   const [showMoreRelated, setShowMoreRelated] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [popularComments, setPopularComments] = useState([]);
//   const [relatedPostsCount, setRelatedPostsCount] = useState(5);
//   const [isReacting, setIsReacting] = useState(false);
//   const [isCommentReacting, setIsCommentReacting] = useState(null); // Track comment reaction loading state
//   const videoRef = useRef(null);

//   // Scroll animation for background gradient
//   const { scrollYProgress } = useScroll();
//   const backgroundColor = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [isDarkMode ? "#111827" : "#F3F4F6", isDarkMode ? "#1F2937" : "#E5E7EB"]
//   );

//   // Dark Mode Handling
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Fetch User Profile (for reaction streak)
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!isAuthenticated) return;
//       try {
//         const user = await getUserProfile();
//         setReactionStreak(user.reactionStreak || 0);
//         setStreakRewards(user.streakRewards || []);
//       } catch (err) {
//         toast.error("Failed to fetch user profile");
//       }
//     };
//     fetchUserProfile();
//   }, [isAuthenticated]);

//   // Fetch Posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await getPosts();
//         const foundPost = res.find((p) => p._id === postId);
//         setPost(foundPost);
//         setAllPosts(res);
//         const uniqueCategories = [
//           "All",
//           ...new Set(res.map((post) => post.category || "General")),
//         ];
//         setCategories(uniqueCategories);

//         if (foundPost && isAuthenticated) {
//           const userId = localStorage.getItem("userId");
//           setUserReaction({
//             like: foundPost.likes?.includes(userId) || false,
//             love: foundPost.loves?.includes(userId) || false,
//             laugh: foundPost.laughs?.includes(userId) || false,
//             sad: foundPost.sads?.includes(userId) || false,
//           });

//           // Sort comments by likes for popular comments
//           const sortedComments = [...(foundPost.comments || [])].sort(
//             (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//           );
//           setPopularComments(sortedComments.slice(0, 2));
//         }
//       } catch (err) {
//         toast.error("Failed to fetch posts");
//       }
//     };
//     fetchPosts();
//   }, [postId, isAuthenticated]);

//   const handleReaction = async (type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }

//     if (isReacting) return; // Prevent multiple simultaneous reactions
//     setIsReacting(true);

//     try {
//       const userId = localStorage.getItem("userId");
//       const currentReactions = { ...userReaction };
//       const newReactions = { ...userReaction };

//       // Toggle reaction
//       newReactions[type] = !currentReactions[type];
//       setUserReaction(newReactions);

//       // Call the backend API to add reaction
//       const updatedReactions = await addReaction(postId, { type });

//       // Update post state with new reaction counts
//       setPost((prevPost) => ({
//         ...prevPost,
//         likes: updatedReactions.likes || [],
//         loves: updatedReactions.loves || [],
//         laughs: updatedReactions.laughs || [],
//         sads: updatedReactions.sads || [],
//       }));

//       // Fetch updated user profile to get reaction streak
//       const user = await getUserProfile();
//       const newStreak = user.reactionStreak || 0;
//       const newRewards = user.streakRewards || [];
//       setReactionStreak(newStreak);
//       setStreakRewards(newRewards);

//       // Show toast and confetti for milestones
//       if (newReactions[type]) {
//         toast.success(`Reaction added! Streak: ${newStreak}`);
//         if (newRewards.includes("Reaction Streak 5")) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }

//       // Unlock more related posts after 3 reactions
//       if (newStreak >= 3 && !showMoreRelated) {
//         setShowMoreRelated(true);
//         toast.success("🎉 More related posts unlocked!");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReaction({ like: false, love: false, laugh: false, sad: false }); // Reset on error
//     } finally {
//       setIsReacting(false);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       toast.error("Please sign in to comment");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment(postId, { text: comment });
//       const res = await getPosts();
//       const updatedPost = res.find((p) => p._id === postId);
//       setPost(updatedPost);
//       setComment("");
//       toast.success("Comment added");

//       // Update popular comments
//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     }
//   };

//   const handleCommentReaction = async (commentId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to react to comments");
//       return;
//     }
//     if (isCommentReacting === commentId) return; // Prevent multiple clicks
//     setIsCommentReacting(commentId);

//     try {
//       const updatedPost = await addCommentReaction(postId, commentId, { type });
//       setPost(updatedPost);

//       // Update popular comments
//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       const userId = localStorage.getItem("userId");
//       const comment = updatedPost.comments.find((c) => c._id === commentId);
//       const hasLiked = comment.likes?.includes(userId);
//       toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
//     } catch (err) {
//       toast.error(err.message || "Failed to react to comment");
//     } finally {
//       setIsCommentReacting(null);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   // Infinite Scroll for Related Posts
//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop >=
//       document.documentElement.offsetHeight - 100
//     ) {
//       setRelatedPostsCount((prev) => prev + 5);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // SEO and Sharing Setup
//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";
//   const seoTitle =
//     postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
//   const postDescription = post?.description || "";
//   const seoDescription =
//     postDescription.length > 160
//       ? `${postDescription.slice(0, 157)}...`
//       : postDescription;
//   const postMedia = post?.media || "";
//   const isVideo = postMedia && postMedia.endsWith(".mp4");
//   const videoThumbnail = isVideo
//     ? `${postMedia.replace(".mp4", "-thumbnail.jpg")}`
//     : postMedia;
//   const keywords = post?.category
//     ? `${post.category}, ${postTitle.split(" ").slice(0, 3).join(", ")}`
//     : "GossipHub, Social Media, News";
//   const authorName = post?.isAnonymous
//     ? "Anonymous"
//     : post?.author?.username || "Unknown";
//   const datePublished = post?.createdAt
//     ? new Date(post.createdAt).toISOString()
//     : new Date().toISOString();
//   const publisherName = "GossipHub";

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: seoTitle,
//     description: seoDescription,
//     author: { "@type": "Person", name: authorName },
//     datePublished: datePublished,
//     image: postMedia || "https://gossipphub.netlify.app/default-image.jpg",
//     publisher: {
//       "@type": "Organization",
//       name: publisherName,
//       logo: {
//         "@type": "ImageObject",
//         url: "https://gossipphub.netlify.app/logo.png",
//       },
//     },
//     mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
//   };

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         if (postMedia && !isVideo) {
//           const response = await fetch(postMedia);
//           const blob = await response.blob();
//           const file = new File([blob], "shared-image.jpg", {
//             type: "image/jpeg",
//           });
//           await navigator.share({
//             files: [file],
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//         } else {
//           await navigator.share({
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//         }
//         toast.success("Shared successfully!");
//       } catch (err) {
//         toast.error("Failed to share post");
//       }
//     } else {
//       toast.info("Native sharing not supported. Use the share options below.");
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard
//       .writeText(postUrl)
//       .then(() => {
//         setIsCopied(true);
//         toast.success("Link copied to clipboard!");
//         setTimeout(() => setIsCopied(false), 2000);
//       })
//       .catch(() => {
//         toast.error("Failed to copy link");
//       });
//   };

//   const handleShareTwitter = () => {
//     const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(twitterUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareWhatsapp = () => {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       `${postTitle}\n${postUrl}`
//     )}`;
//     window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       postUrl
//     )}&t=${encodeURIComponent(postTitle)}`;
//     window.open(facebookUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareTelegram = () => {
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(telegramUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareLinkedin = () => {
//     const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
//       postUrl
//     )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
//       postDescription.slice(0, 200) + "..."
//     )}`;
//     window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//   };

//   if (!post) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
//         <motion.div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="text-2xl font-medium text-red-600 dark:text-red-400"
//         >
//           Loading...
//         </motion.div>
//       </div>
//     );
//   }

//   const latestStories = allPosts
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);
//   const mostViewedPosts = allPosts
//     .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//     .slice(0, 5);
//   const relatedPosts = allPosts
//     .filter((p) => p.category === post.category && p._id !== post._id)
//     .slice(0, showMoreRelated ? relatedPostsCount : 5);

//   const currentIndex = allPosts.findIndex((p) => p._id === postId);
//   const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
//   const nextPost =
//     currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

//   const isTrending =
//     (post.likes?.length || 0) +
//       (post.loves?.length || 0) +
//       (post.laughs?.length || 0) +
//       (post.sads?.length || 0) +
//       (post.comments?.length || 0) >
//     50;

//   return (
//     <motion.div
//       className={`min-h-screen font-poppins transition-colors duration-500 ${
//         isDarkMode ? "dark" : ""
//       }`}
//       style={{ background: backgroundColor }}
//     >
//       {/* SEO Meta Tags */}
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>{seoTitle}</title>
//         <meta name="description" content={seoDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content={authorName} />
//         <meta name="publisher" content={publisherName} />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href={postUrl} />
//         <meta property="og:title" content={postTitle} />
//         <meta property="og:description" content={postDescription} />
//         <meta property="og:url" content={postUrl} />
//         <meta property="og:type" content="article" />
//         {isVideo ? (
//           <>
//             <meta property="og:video" content={postMedia} />
//             <meta property="og:video:type" content="video/mp4" />
//             <meta property="og:image" content={videoThumbnail} />
//           </>
//         ) : (
//           postMedia && <meta property="og:image" content={postMedia} />
//         )}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={postTitle} />
//         <meta name="twitter:description" content={postDescription} />
//         <meta
//           name="twitter:image"
//           content={isVideo ? videoThumbnail : postMedia}
//         />
//         <script type="application/ld+json">
//           {JSON.stringify(structuredData)}
//         </script>
//       </Helmet>

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to home"
//           >
//             <HiArrowLeft className="w-6 h-6" />
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
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           {/* Post Media */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {post.media && (
//               <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//                 {isVideo ? (
//                   <div className="relative">
//                     <video
//                       ref={videoRef}
//                       src={post.media}
//                       controls
//                       muted={isMuted}
//                       className="w-full h-[400px] md:h-[500px] object-contain bg-black"
//                       aria-label="Post video"
//                     />
//                     <button
//                       onClick={toggleMute}
//                       className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white"
//                       aria-label={isMuted ? "Unmute video" : "Mute video"}
//                     >
//                       {isMuted ? (
//                         <HiVolumeOff className="h-6 w-6" />
//                       ) : (
//                         <HiVolumeUp className="h-6 w-6" />
//                       )}
//                     </button>
//                   </div>
//                 ) : (
//                   <motion.img
//                     src={post.media}
//                     alt="Post media"
//                     className="w-full h-[400px] md:h-[500px] object-cover"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 )}
//                 <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75 bg-black/50 px-2 py-1 rounded">
//                   GossipHub
//                 </div>
//                 {isTrending && (
//                   <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//                     <span className="mr-1">🔥</span> Trending Now
//                   </div>
//                 )}
//               </div>
//             )}
//             <div className="bg-white dark:bg-gray-900 p-6 mt-0 shadow-lg rounded-b-lg">
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
//                 {post.title}
//               </h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                 Posted by:{" "}
//                 {post.isAnonymous ? (
//                   "Anonymous"
//                 ) : (
//                   <Link
//                     to={`/profile/${post.author._id}`}
//                     className="text-indigo-600 dark:text-teal-400 hover:text-indigo-700 dark:hover:text-teal-300 transition-colors"
//                     aria-label={`View ${post.author.username}'s profile`}
//                   >
//                     {post.author?.username || "Unknown"}
//                   </Link>
//                 )}
//                 {" • "}
//                 {timeAgo(post.createdAt)}
//               </p>
//               <div
//                 className="text-base text-gray-700 dark:text-gray-200 mb-6 leading-relaxed post-description"
//                 role="region"
//                 aria-label="Post description"
//               >
//                 {post.description.split("\n\n").map((paragraph, pIdx) => (
//                   <motion.div
//                     key={pIdx}
//                     className="mb-4 last:mb-0"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5 }}
//                     dangerouslySetInnerHTML={{ __html: paragraph }}
//                   />
//                 ))}
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {(post.category ? [post.category] : []).map((tag, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               {/* Reaction Streak */}
//               {isAuthenticated && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">🔥</span> Reaction Streak
//                   </h3>
//                   <p className="text-sm">
//                     React to 5 posts to earn a badge! Current Streak:{" "}
//                     {reactionStreak}/5
//                   </p>
//                   <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
//                     <motion.div
//                       className="bg-white h-2.5 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(reactionStreak / 5) * 100}%` }}
//                       transition={{ duration: 1 }}
//                     />
//                   </div>
//                   {streakRewards.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium">Rewards Earned:</p>
//                       <div className="flex gap-2 mt-1">
//                         {streakRewards.map((reward, idx) => (
//                           <motion.span
//                             key={idx}
//                             className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: idx * 0.2 }}
//                           >
//                             {reward}
//                           </motion.span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* Reactions */}
//               <div className="flex gap-3 mb-8 flex-wrap">
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("like")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.like
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Like post (${post.likes?.length || 0} likes)${
//                     userReaction.like ? " (You liked this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     👍
//                   </motion.span>
//                   ({post.likes?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("love")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.love
//                       ? "bg-pink-600 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Love post (${post.loves?.length || 0} loves)${
//                     userReaction.love ? " (You loved this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     💖
//                   </motion.span>
//                   ({post.loves?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("laugh")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.laugh
//                       ? "bg-yellow-500 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Laugh at post (${
//                     post.laughs?.length || 0
//                   } laughs)${
//                     userReaction.laugh ? " (You laughed at this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😂
//                   </motion.span>
//                   ({post.laughs?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("sad")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.sad
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Sad reaction (${post.sads?.length || 0} sads)${
//                     userReaction.sad ? " (You felt sad about this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😢
//                   </motion.span>
//                   ({post.sads?.length || 0})
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Comments Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mt-0 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
//               Comments
//             </h3>
//             {/* Sticky Comment Input on Mobile */}
//             <form
//               onSubmit={handleCommentSubmit}
//               className="mb-8 sticky top-20 z-10 md:static bg-white dark:bg-gray-900"
//             >
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-300"
//                 aria-label="Comment input"
//                 disabled={!isAuthenticated}
//               />
//               <div className="flex justify-between items-center mt-3">
//                 {isAuthenticated ? (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                     aria-label="Submit comment"
//                   >
//                     Post
//                   </motion.button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="text-sm text-red-600 hover:underline"
//                   >
//                     Sign in to comment
//                   </Link>
//                 )}
//               </div>
//             </form>

//             {/* Popular Comments */}
//             {popularComments.length > 0 && (
//               <div className="mb-8">
//                 <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
//                   <span className="mr-2">🌟</span> Popular Comments
//                 </h4>
//                 <AnimatePresence>
//                   {popularComments.map((c) => {
//                     const userId = localStorage.getItem("userId");
//                     const hasLiked = c.likes?.includes(userId);
//                     return (
//                       <motion.div
//                         key={c._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.4 }}
//                         className="mb-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-orange-500"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
//                             {c.author?.username?.[0]?.toUpperCase() || "A"}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
//                                 {c.author?.username || "Anonymous"}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 {timeAgo(c.createdAt)}
//                               </p>
//                             </div>
//                             <p className="text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">
//                               {c.text}
//                             </p>
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={() =>
//                                 handleCommentReaction(c._id, "like")
//                               }
//                               className={`mt-2 flex items-center gap-1 text-sm ${
//                                 hasLiked
//                                   ? "text-red-600 dark:text-red-400"
//                                   : "text-gray-600 dark:text-gray-400"
//                               } ${
//                                 isCommentReacting === c._id
//                                   ? "opacity-50 cursor-not-allowed"
//                                   : ""
//                               }`}
//                               disabled={isCommentReacting === c._id}
//                               aria-label={
//                                 hasLiked ? "Unlike comment" : "Like comment"
//                               }
//                             >
//                               <motion.span
//                                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                                 transition={{ duration: 0.3 }}
//                               >
//                                 <FaHeart className="h-4 w-4" />
//                               </motion.span>
//                               {c.likes?.length || 0}
//                             </motion.button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* All Comments */}
//             <AnimatePresence>
//               {post.comments.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500 dark:text-gray-400 italic"
//                 >
//                   No comments yet. Be the first to comment!
//                 </motion.p>
//               ) : (
//                 post.comments
//                   .filter(
//                     (c) => !popularComments.find((pc) => pc._id === c._id)
//                   )
//                   .slice()
//                   .reverse()
//                   .map((c) => {
//                     const userId = localStorage.getItem("userId");
//                     const hasLiked = c.likes?.includes(userId);
//                     return (
//                       <motion.div
//                         key={c._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.4 }}
//                         className="mb-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-red-500 dark:border-red-400"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
//                             {c.author?.username?.[0]?.toUpperCase() || "A"}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
//                                 {c.author?.username || "Anonymous"}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 {timeAgo(c.createdAt)}
//                               </p>
//                             </div>
//                             <p className="text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">
//                               {c.text}
//                             </p>
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={() =>
//                                 handleCommentReaction(c._id, "like")
//                               }
//                               className={`mt-2 flex items-center gap-1 text-sm ${
//                                 hasLiked
//                                   ? "text-red-600 dark:text-red-400"
//                                   : "text-gray-600 dark:text-gray-400"
//                               } ${
//                                 isCommentReacting === c._id
//                                   ? "opacity-50 cursor-not-allowed"
//                                   : ""
//                               }`}
//                               disabled={isCommentReacting === c._id}
//                               aria-label={
//                                 hasLiked ? "Unlike comment" : "Like comment"
//                               }
//                             >
//                               <motion.span
//                                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                                 transition={{ duration: 0.3 }}
//                               >
//                                 <FaHeart className="h-4 w-4" />
//                               </motion.span>
//                               {c.likes?.length || 0}
//                             </motion.button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Next/Previous Post Navigation */}
//           <motion.div
//             className="mt-6 flex justify-between gap-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             {prevPost && (
//               <Link
//                 to={`/posts/${prevPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               >
//                 <HiArrowLeft className="h-5 w-5" />
//                 Previous Post
//               </Link>
//             )}
//             {nextPost && (
//               <Link
//                 to={`/posts/${nextPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-auto"
//               >
//                 Next Post
//                 <HiArrowRight className="h-5 w-5" />
//               </Link>
//             )}
//           </motion.div>

//           {/* Related Posts */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
//               Related Posts
//             </h3>
//             <AnimatePresence>
//               {relatedPosts.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No related posts found in this category.
//                 </motion.p>
//               ) : (
//                 <div className="space-y-4">
//                   {relatedPosts.map((story, index) => (
//                     <motion.div
//                       key={story._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.5, delay: index * 0.1 }}
//                     >
//                       <Link to={`/posts/${story._id}`} className="flex gap-3">
//                         {story.media &&
//                           (story.media.endsWith(".mp4") ? (
//                             <video
//                               src={story.media}
//                               className="w-16 h-16 object-cover rounded"
//                               muted
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ) : (
//                             <img
//                               src={story.media}
//                               alt="Related post thumbnail"
//                               className="w-16 h-16 object-cover rounded"
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ))}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
//                             {story.title}
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             {story.category || "General"}
//                           </p>
//                         </div>
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
//           <motion.div
//             className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
//               Latest Stories
//             </h3>
//             <div className="space-y-4">
//               {latestStories.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (story.media.endsWith(".mp4") ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
//               Most Viewed
//             </h3>
//             <div className="space-y-4">
//               {mostViewedPosts.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (story.media.endsWith(".mp4") ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Floating Share Bar */}
//       <motion.div
//         className="fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1 }}
//       >
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleNativeShare}
//           className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           aria-label="Share post"
//         >
//           <FaShareAlt className="text-xl" />
//           <span>Share</span>
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareTwitter}
//           className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           aria-label="Share on Twitter"
//         >
//           <FaXTwitter className="text-xl text-black" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareWhatsapp}
//           className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           aria-label="Share on WhatsApp"
//         >
//           <FaWhatsapp className="text-xl text-green-500" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareFacebook}
//           className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           aria-label="Share on Facebook"
//         >
//           <FaFacebook className="text-xl text-blue-600" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareTelegram}
//           className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           aria-label="Share on Telegram"
//         >
//           <FaTelegram className="text-xl text-blue-400" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareLinkedin}
//           className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           aria-label="Share on LinkedIn"
//         >
//           <FaLinkedin className="text-xl text-blue-700" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleCopyLink}
//           className={`p-2 rounded-full transition-colors ${
//             isCopied
//               ? "bg-green-500 text-white"
//               : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//           }`}
//           aria-label={isCopied ? "Link copied" : "Copy link"}
//         >
//           <FaLink className="text-xl" />
//         </motion.button>
//       </motion.div>

//       {/* Footer */}
//       <footer className="bg-red-600 text-white py-6">
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
//           <p className="text-sm">© 2025 GossippHub. All rights reserved.</p>
//         </div>
//       </footer>

//       <style>
//         {`
//           .post-description iframe,
//           .post-description video {
//             width: 100% !important;
//             height: 400px !important;
//             max-width: 100%;
//             border-radius: 8px;
//             margin-bottom: 1rem;
//           }
//           @media (min-width: 640px) {
//             .post-description iframe,
//             .post-description video {
//               height: 500px !important;
//             }
//           }
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}
//       </style>
//     </motion.div>
//   );
// };

// export default PostDetails;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence, useScroll } from "framer-motion";
// import {
//   getPosts,
//   addReaction,
//   addComment,
//   addCommentReaction,
//   getUserProfile,
// } from "../utils/api";
// import {
//   FaShareAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaLink,
//   FaTelegram,
//   FaLinkedin,
//   FaHeart,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import {
//   HiArrowLeft,
//   HiArrowRight,
//   HiVolumeUp,
//   HiVolumeOff,
// } from "react-icons/hi";
// import { Helmet } from "react-helmet";
// import confetti from "canvas-confetti";

// // Utility function to calculate time difference and return "time ago" format
// const timeAgo = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   if (diffInSeconds < 0 || diffInSeconds < 10) {
//     return "Just now";
//   }

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
// };

// const PostDetails = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [allPosts, setAllPosts] = useState([]);
//   const [comment, setComment] = useState("");
//   const [categories, setCategories] = useState(["All"]);
//   const isAuthenticated = !!localStorage.getItem("token");
//   const [userReaction, setUserReaction] = useState({
//     like: false,
//     love: false,
//     laugh: false,
//     sad: false,
//   });
//   const [isCopied, setIsCopied] = useState(false);
//   const [reactionStreak, setReactionStreak] = useState(0);
//   const [streakRewards, setStreakRewards] = useState([]);
//   const [showMoreRelated, setShowMoreRelated] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [popularComments, setPopularComments] = useState([]);
//   const [relatedPostsCount, setRelatedPostsCount] = useState(5);
//   const [isReacting, setIsReacting] = useState(false);
//   const [isCommentReacting, setIsCommentReacting] = useState(null);
//   const videoRef = useRef(null);

//   // Fetch User Profile (for reaction streak)
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!isAuthenticated) return;
//       try {
//         const user = await getUserProfile();
//         setReactionStreak(user.reactionStreak || 0);
//         setStreakRewards(user.streakRewards || []);
//       } catch (err) {
//         toast.error("Failed to fetch user profile");
//       }
//     };
//     fetchUserProfile();
//   }, [isAuthenticated]);

//   // Fetch Posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await getPosts();
//         const foundPost = res.find((p) => p._id === postId);
//         setPost(foundPost);
//         setAllPosts(res);
//         const uniqueCategories = [
//           "All",
//           ...new Set(res.map((post) => post.category || "General")),
//         ];
//         setCategories(uniqueCategories);

//         if (foundPost && isAuthenticated) {
//           const userId = localStorage.getItem("userId");
//           setUserReaction({
//             like: foundPost.likes?.includes(userId) || false,
//             love: foundPost.loves?.includes(userId) || false,
//             laugh: foundPost.laughs?.includes(userId) || false,
//             sad: foundPost.sads?.includes(userId) || false,
//           });

//           // Sort comments by likes for popular comments
//           const sortedComments = [...(foundPost.comments || [])].sort(
//             (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//           );
//           setPopularComments(sortedComments.slice(0, 2));
//         }
//       } catch (err) {
//         toast.error("Failed to fetch posts");
//       }
//     };
//     fetchPosts();
//   }, [postId, isAuthenticated]);

//   const handleReaction = async (type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }

//     if (isReacting) return;
//     setIsReacting(true);

//     try {
//       const userId = localStorage.getItem("userId");
//       const currentReactions = { ...userReaction };
//       const newReactions = { ...userReaction };

//       newReactions[type] = !currentReactions[type];
//       setUserReaction(newReactions);

//       const updatedReactions = await addReaction(postId, { type });

//       setPost((prevPost) => ({
//         ...prevPost,
//         likes: updatedReactions.likes || [],
//         loves: updatedReactions.loves || [],
//         laughs: updatedReactions.laughs || [],
//         sads: updatedReactions.sads || [],
//       }));

//       const user = await getUserProfile();
//       const newStreak = user.reactionStreak || 0;
//       const newRewards = user.streakRewards || [];
//       setReactionStreak(newStreak);
//       setStreakRewards(newRewards);

//       if (newReactions[type]) {
//         toast.success(`Reaction added! Streak: ${newStreak}`);
//         if (newRewards.includes("Reaction Streak 5")) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }

//       if (newStreak >= 3 && !showMoreRelated) {
//         setShowMoreRelated(true);
//         toast.success("🎉 More related posts unlocked!");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReaction({ like: false, love: false, laugh: false, sad: false });
//     } finally {
//       setIsReacting(false);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       toast.error("Please sign in to comment");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment(postId, { text: comment });
//       const res = await getPosts();
//       const updatedPost = res.find((p) => p._id === postId);
//       setPost(updatedPost);
//       setComment("");
//       toast.success("Comment added");

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     }
//   };

//   const handleCommentReaction = async (commentId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to react to comments");
//       return;
//     }
//     if (isCommentReacting === commentId) return;
//     setIsCommentReacting(commentId);

//     try {
//       const updatedPost = await addCommentReaction(postId, commentId, { type });
//       setPost(updatedPost);

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       const userId = localStorage.getItem("userId");
//       const comment = updatedPost.comments.find((c) => c._id === commentId);
//       const hasLiked = comment.likes?.includes(userId);
//       toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
//     } catch (err) {
//       toast.error(err.message || "Failed to react to comment");
//     } finally {
//       setIsCommentReacting(null);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   // Infinite Scroll for Related Posts
//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop >=
//       document.documentElement.offsetHeight - 100
//     ) {
//       setRelatedPostsCount((prev) => prev + 5);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // SEO and Sharing Setup
//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";
//   const seoTitle =
//     postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
//   const postDescription = post?.description || "";
//   const seoDescription =
//     postDescription.length > 160
//       ? `${postDescription.slice(0, 157)}...`
//       : postDescription;
//   const postMedia = post?.media || "";
//   const isVideo = postMedia && postMedia.endsWith(".mp4");
//   const videoThumbnail = isVideo
//     ? `${postMedia.replace(".mp4", "-thumbnail.jpg")}`
//     : postMedia;
//   const keywords = post?.category
//     ? `${post.category}, ${postTitle.split(" ").slice(0, 3).join(", ")}`
//     : "GossipHub, Social Media, News";
//   const authorName = post?.isAnonymous
//     ? "Anonymous"
//     : post?.author?.username || "Unknown";
//   const datePublished = post?.createdAt
//     ? new Date(post.createdAt).toISOString()
//     : new Date().toISOString();
//   const publisherName = "GossipHub";

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: seoTitle,
//     description: seoDescription,
//     author: { "@type": "Person", name: authorName },
//     datePublished: datePublished,
//     image: postMedia || "https://gossipphub.netlify.app/default-image.jpg",
//     publisher: {
//       "@type": "Organization",
//       name: publisherName,
//       logo: {
//         "@type": "ImageObject",
//         url: "https://gossipphub.netlify.app/logo.png",
//       },
//     },
//     mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
//   };

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         if (postMedia && !isVideo) {
//           const response = await fetch(postMedia);
//           const blob = await response.blob();
//           const file = new File([blob], "shared-image.jpg", {
//             type: "image/jpeg",
//           });
//           await navigator.share({
//             files: [file],
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//         } else {
//           await navigator.share({
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//         }
//         toast.success("Shared successfully!");
//       } catch (err) {
//         toast.error("Failed to share post");
//       }
//     } else {
//       toast.info("Native sharing not supported. Use the share options below.");
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard
//       .writeText(postUrl)
//       .then(() => {
//         setIsCopied(true);
//         toast.success("Link copied to clipboard!");
//         setTimeout(() => setIsCopied(false), 2000);
//       })
//       .catch(() => {
//         toast.error("Failed to copy link");
//       });
//   };

//   const handleShareTwitter = () => {
//     const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(twitterUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareWhatsapp = () => {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       `${postTitle}\n${postUrl}`
//     )}`;
//     window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       postUrl
//     )}&t=${encodeURIComponent(postTitle)}`;
//     window.open(facebookUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareTelegram = () => {
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(telegramUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareLinkedin = () => {
//     const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
//       postUrl
//     )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
//       postDescription.slice(0, 200) + "..."
//     )}`;
//     window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//   };

//   if (!post) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100">
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

//   const latestStories = allPosts
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);
//   const mostViewedPosts = allPosts
//     .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//     .slice(0, 5);
//   const relatedPosts = allPosts
//     .filter((p) => p.category === post.category && p._id !== post._id)
//     .slice(0, showMoreRelated ? relatedPostsCount : 5);

//   const currentIndex = allPosts.findIndex((p) => p._id === postId);
//   const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
//   const nextPost =
//     currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

//   const isTrending =
//     (post.likes?.length || 0) +
//       (post.loves?.length || 0) +
//       (post.laughs?.length || 0) +
//       (post.sads?.length || 0) +
//       (post.comments?.length || 0) >
//     50;

//   return (
//     <motion.div className="min-h-screen font-poppins bg-gray-100">
//       {/* SEO Meta Tags */}
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>{seoTitle}</title>
//         <meta name="description" content={seoDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content={authorName} />
//         <meta name="publisher" content={publisherName} />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href={postUrl} />
//         <meta property="og:title" content={postTitle} />
//         <meta property="og:description" content={postDescription} />
//         <meta property="og:url" content={postUrl} />
//         <meta property="og:type" content="article" />
//         {isVideo ? (
//           <>
//             <meta property="og:video" content={postMedia} />
//             <meta property="og:video:type" content="video/mp4" />
//             <meta property="og:image" content={videoThumbnail} />
//           </>
//         ) : (
//           postMedia && <meta property="og:image" content={postMedia} />
//         )}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={postTitle} />
//         <meta name="twitter:description" content={postDescription} />
//         <meta
//           name="twitter:image"
//           content={isVideo ? videoThumbnail : postMedia}
//         />
//         <script type="application/ld+json">
//           {JSON.stringify(structuredData)}
//         </script>
//       </Helmet>

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to home"
//           >
//             <HiArrowLeft className="w-6 h-6" />
//             Back
//           </Link>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-2 pt-16 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           {/* Post Media */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {post.media && (
//               <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//                 {isVideo ? (
//                   <div className="relative">
//                     <video
//                       ref={videoRef}
//                       src={post.media}
//                       controls
//                       muted={isMuted}
//                       className="w-full h-[400px] md:h-[500px] object-contain bg-black"
//                       aria-label="Post video"
//                     />
//                     <button
//                       onClick={toggleMute}
//                       className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white"
//                       aria-label={isMuted ? "Unmute video" : "Mute video"}
//                     >
//                       {isMuted ? (
//                         <HiVolumeOff className="h-6 w-6" />
//                       ) : (
//                         <HiVolumeUp className="h-6 w-6" />
//                       )}
//                     </button>
//                   </div>
//                 ) : (
//                   <motion.img
//                     src={post.media}
//                     alt="Post media"
//                     className="w-full h-[400px] md:h-[500px] object-cover"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 )}
//                 <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75 bg-black/50 px-2 py-1 rounded">
//                   GossipHub
//                 </div>
//                 {isTrending && (
//                   <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//                     <span className="mr-1">🔥</span> Trending Now
//                   </div>
//                 )}
//               </div>
//             )}
//             <div className="bg-white lg:p-6 p-2 mt-0 shadow-lg rounded-b-lg">
//               <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
//                 {post.title}
//               </h1>
//               <p className="text-sm text-gray-500 mb-4">
//                 Posted by:{" "}
//                 {post.isAnonymous ? (
//                   "Anonymous"
//                 ) : (
//                   <Link
//                     to={`/profile/${post.author._id}`}
//                     className="text-indigo-600 hover:text-indigo-700 transition-colors"
//                     aria-label={`View ${post.author.username}'s profile`}
//                   >
//                     {post.author?.username || "Unknown"}
//                   </Link>
//                 )}
//                 {" • "}
//                 {timeAgo(post.createdAt)}
//               </p>
//               <div
//                 className="text-base text-gray-900 mb-6 leading-relaxed post-description"
//                 role="region"
//                 aria-label="Post description"
//               >
//                 {post.description.split("\n\n").map((paragraph, pIdx) => (
//                   <motion.div
//                     key={pIdx}
//                     className="mb-4 last:mb-0"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5 }}
//                     dangerouslySetInnerHTML={{ __html: paragraph }}
//                   />
//                 ))}
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {(post.category ? [post.category] : []).map((tag, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               {/* Reaction Streak */}
//               {isAuthenticated && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">🔥</span> Reaction Streak
//                   </h3>
//                   <p className="text-sm">
//                     React to 5 posts to earn a badge! Current Streak:{" "}
//                     {reactionStreak}/5
//                   </p>
//                   <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
//                     <motion.div
//                       className="bg-white h-2.5 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{
//                         width: `${Math.min((reactionStreak / 5) * 100, 100)}%`,
//                       }}
//                       transition={{ duration: 1 }}
//                     />
//                   </div>
//                   {streakRewards.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium">Rewards Earned:</p>
//                       <div className="flex gap-2 mt-1">
//                         {streakRewards.map((reward, idx) => (
//                           <motion.span
//                             key={idx}
//                             className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: idx * 0.2 }}
//                           >
//                             {reward}
//                           </motion.span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* Reactions */}
//               <div className="flex gap-3 mb-8 flex-wrap">
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("like")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.like
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Like post (${post.likes?.length || 0} likes)${
//                     userReaction.like ? " (You liked this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     👍
//                   </motion.span>
//                   ({post.likes?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("love")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.love
//                       ? "bg-pink-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Love post (${post.loves?.length || 0} loves)${
//                     userReaction.love ? " (You loved this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     💖
//                   </motion.span>
//                   ({post.loves?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("laugh")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.laugh
//                       ? "bg-yellow-500 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Laugh at post (${
//                     post.laughs?.length || 0
//                   } laughs)${
//                     userReaction.laugh ? " (You laughed at this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😂
//                   </motion.span>
//                   ({post.laughs?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("sad")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.sad
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Sad reaction (${post.sads?.length || 0} sads)${
//                     userReaction.sad ? " (You felt sad about this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😢
//                   </motion.span>
//                   ({post.sads?.length || 0})
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Comments Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mt-0 bg-white rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-6">Comments</h3>
//             {/* Sticky Comment Input on Mobile */}
//             <form
//               onSubmit={handleCommentSubmit}
//               className="mb-8 sticky top-20 z-10 md:static bg-white"
//             >
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="w-full p-4 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-300"
//                 aria-label="Comment input"
//                 disabled={!isAuthenticated}
//               />
//               <div className="flex justify-between items-center mt-3">
//                 {isAuthenticated ? (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                     aria-label="Submit comment"
//                   >
//                     Post
//                   </motion.button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="text-sm text-red-600 hover:underline"
//                   >
//                     Sign in to comment
//                   </Link>
//                 )}
//               </div>
//             </form>

//             {/* Popular Comments */}
//             {popularComments.length > 0 && (
//               <div className="mb-8">
//                 <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <span className="mr-2">🌟</span> Popular Comments
//                 </h4>
//                 <AnimatePresence>
//                   {popularComments.map((c) => {
//                     const userId = localStorage.getItem("userId");
//                     const hasLiked = c.likes?.includes(userId);
//                     return (
//                       <motion.div
//                         key={c._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.4 }}
//                         className="mb-5 p-4 bg-gray-50 rounded-xl shadow-sm border-l-4 border-orange-500"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
//                             {c.author?.username?.[0]?.toUpperCase() || "A"}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <p className="font-semibold text-gray-900 text-base">
//                                 {c.author?.username || "Anonymous"}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {timeAgo(c.createdAt)}
//                               </p>
//                             </div>
//                             <p className="text-gray-700 mt-1 leading-relaxed">
//                               {c.text}
//                             </p>
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={() =>
//                                 handleCommentReaction(c._id, "like")
//                               }
//                               className={`mt-2 flex items-center gap-1 text-sm ${
//                                 hasLiked ? "text-red-600" : "text-gray-600"
//                               } ${
//                                 isCommentReacting === c._id
//                                   ? "opacity-50 cursor-not-allowed"
//                                   : ""
//                               }`}
//                               disabled={isCommentReacting === c._id}
//                               aria-label={
//                                 hasLiked ? "Unlike comment" : "Like comment"
//                               }
//                             >
//                               <motion.span
//                                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                                 transition={{ duration: 0.3 }}
//                               >
//                                 <FaHeart className="h-4 w-4" />
//                               </motion.span>
//                               {c.likes?.length || 0}
//                             </motion.button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* All Comments */}
//             <AnimatePresence>
//               {post.comments?.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500 italic"
//                 >
//                   No comments yet. Be the first to comment!
//                 </motion.p>
//               ) : (
//                 post.comments
//                   .filter(
//                     (c) => !popularComments.find((pc) => pc._id === c._id)
//                   )
//                   .slice()
//                   .reverse()
//                   .map((c) => {
//                     const userId = localStorage.getItem("userId");
//                     const hasLiked = c.likes?.includes(userId);
//                     return (
//                       <motion.div
//                         key={c._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.4 }}
//                         className="mb-5 p-4 bg-gray-50 rounded-xl shadow-sm border-l-4 border-red-500"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
//                             {c.author?.username?.[0]?.toUpperCase() || "A"}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <p className="font-semibold text-gray-900 text-base">
//                                 {c.author?.username || "Anonymous"}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {timeAgo(c.createdAt)}
//                               </p>
//                             </div>
//                             <p className="text-gray-700 mt-1 leading-relaxed">
//                               {c.text}
//                             </p>
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={() =>
//                                 handleCommentReaction(c._id, "like")
//                               }
//                               className={`mt-2 flex items-center gap-1 text-sm ${
//                                 hasLiked ? "text-red-600" : "text-gray-600"
//                               } ${
//                                 isCommentReacting === c._id
//                                   ? "opacity-50 cursor-not-allowed"
//                                   : ""
//                               }`}
//                               disabled={isCommentReacting === c._id}
//                               aria-label={
//                                 hasLiked ? "Unlike comment" : "Like comment"
//                               }
//                             >
//                               <motion.span
//                                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                                 transition={{ duration: 0.3 }}
//                               >
//                                 <FaHeart className="h-4 w-4" />
//                               </motion.span>
//                               {c.likes?.length || 0}
//                             </motion.button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Next/Previous Post Navigation */}
//           <motion.div
//             className="mt-6 flex justify-between gap-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             {prevPost && (
//               <Link
//                 to={`/posts/${prevPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
//               >
//                 <HiArrowLeft className="h-5 w-5" />
//                 Previous Post
//               </Link>
//             )}
//             {nextPost && (
//               <Link
//                 to={`/posts/${nextPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors ml-auto"
//               >
//                 Next Post
//                 <HiArrowRight className="h-5 w-5" />
//               </Link>
//             )}
//           </motion.div>

//           {/* Related Posts */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             className="mt-6 bg-white rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               Related Posts
//             </h3>
//             <AnimatePresence>
//               {relatedPosts.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500"
//                 >
//                   No related posts found in this category.
//                 </motion.p>
//               ) : (
//                 <div className="space-y-4">
//                   {relatedPosts.map((story, index) => (
//                     <motion.div
//                       key={story._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.5, delay: index * 0.1 }}
//                     >
//                       <Link to={`/posts/${story._id}`} className="flex gap-3">
//                         {story.media &&
//                           (story.media.endsWith(".mp4") ? (
//                             <video
//                               src={story.media}
//                               className="w-16 h-16 object-cover rounded"
//                               muted
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ) : (
//                             <img
//                               src={story.media}
//                               alt="Related post thumbnail"
//                               className="w-16 h-16 object-cover rounded"
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ))}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                             {story.title}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {story.category || "General"}
//                           </p>
//                         </div>
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
//           <motion.div
//             className="bg-white rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Latest Stories
//             </h3>
//             <div className="space-y-4">
//               {latestStories.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (story.media.endsWith(".mp4") ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             className="bg-white rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Most Viewed
//             </h3>
//             <div className="space-y-4">
//               {mostViewedPosts.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (story.media.endsWith(".mp4") ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Floating Share Bar */}
//       <motion.div
//         className="fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center bg-white p-2 rounded-full shadow-lg"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1 }}
//       >
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleNativeShare}
//           className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//           aria-label="Share post"
//         >
//           <FaShareAlt className="text-xl" />
//           <span>Share</span>
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareTwitter}
//           className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//           aria-label="Share on Twitter"
//         >
//           <FaXTwitter className="text-xl text-black" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareWhatsapp}
//           className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//           aria-label="Share on WhatsApp"
//         >
//           <FaWhatsapp className="text-xl text-green-500" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareFacebook}
//           className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//           aria-label="Share on Facebook"
//         >
//           <FaFacebook className="text-xl text-blue-600" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareTelegram}
//           className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//           aria-label="Share on Telegram"
//         >
//           <FaTelegram className="text-xl text-blue-400" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleShareLinkedin}
//           className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//           aria-label="Share on LinkedIn"
//         >
//           <FaLinkedin className="text-xl text-blue-700" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleCopyLink}
//           className={`p-2 rounded-full transition-colors ${
//             isCopied
//               ? "bg-green-500 text-white"
//               : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//           }`}
//           aria-label={isCopied ? "Link copied" : "Copy link"}
//         >
//           <FaLink className="text-xl" />
//         </motion.button>
//       </motion.div>

//       {/* Footer */}
//       <footer className="bg-red-600 text-white py-6">
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
//           <p className="text-sm">© 2025 GossippHub. All rights reserved.</p>
//         </div>
//       </footer>

//       <style>
//         {`
//           .post-description iframe,
//           .post-description video {
//             width: 100% !important;
//             height: 400px !important;
//             max-width: 100%;
//             border-radius: 8px;
//             margin-bottom: 1rem;
//           }
//           @media (min-width: 640px) {
//             .post-description iframe,
//             .post-description video {
//               height: 500px !important;
//             }
//           }
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}
//       </style>
//     </motion.div>
//   );
// };

// export default PostDetails;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   getPosts,
//   addReaction,
//   addComment,
//   addCommentReaction,
//   getUserProfile,
// } from "../utils/api";
// import {
//   FaShareAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaLink,
//   FaTelegram,
//   FaLinkedin,
//   FaHeart,
//   FaComment,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import {
//   HiArrowLeft,
//   HiArrowRight,
//   HiVolumeUp,
//   HiVolumeOff,
// } from "react-icons/hi";
// import { Helmet } from "react-helmet";
// import confetti from "canvas-confetti";
// import debounce from "lodash/debounce";

// // Utility function to calculate time difference and return "time ago" format
// const timeAgo = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   if (diffInSeconds < 0 || diffInSeconds < 10) return "Just now";
//   if (diffInSeconds < 60)
//     return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60)
//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24)
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
// };

// // Utility to estimate read time (assuming 200 words per minute)
// const estimateReadTime = (text) => {
//   const words = text?.split(/\s+/).length || 0;
//   const minutes = Math.ceil(words / 200);
//   return minutes === 0 ? "Less than a minute" : `${minutes} min read`;
// };

// // Component for Post Media with Blur-Up Effect
// const PostMedia = ({
//   media,
//   isVideo,
//   isMuted,
//   toggleMute,
//   videoRef,
//   isTrending,
// }) => (
//   <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//     {isVideo ? (
//       <div className="relative">
//         <video
//           ref={videoRef}
//           src={media}
//           controls
//           muted={isMuted}
//           className="w-full aspect-video object-contain bg-black"
//           aria-label="Post video"
//           onError={(e) => {
//             console.error("Video failed to load:", media);
//             e.target.src =
//               "https://via.placeholder.com/400x400?text=Video+Not+Available";
//           }}
//         />
//         <button
//           onClick={toggleMute}
//           className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white"
//           aria-label={isMuted ? "Unmute video" : "Mute video"}
//         >
//           {isMuted ? (
//             <HiVolumeOff className="h-6 w-6" />
//           ) : (
//             <HiVolumeUp className="h-6 w-6" />
//           )}
//         </button>
//       </div>
//     ) : (
//       <motion.img
//         src={media}
//         alt="Post media"
//         className="w-full aspect-video object-contain"
//         initial={{ filter: "blur(10px)" }}
//         animate={{ filter: "blur(0px)" }}
//         transition={{ duration: 0.5 }}
//         loading="lazy"
//         onError={(e) => {
//           console.error("Image failed to load:", media);
//           e.target.src =
//             "https://via.placeholder.com/400x400?text=Image+Not+Available";
//         }}
//       />
//     )}
//     <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75 bg-black/50 px-2 py-1 rounded">
//       GossipHub
//     </div>
//     {isTrending && (
//       <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//         <span className="mr-1">🔥</span> Trending Now
//       </div>
//     )}
//   </div>
// );

// // Component for a Single Comment
// const Comment = ({
//   comment,
//   handleCommentReaction,
//   isCommentReacting,
//   userId,
//   isAuthenticated,
// }) => {
//   const hasLiked = comment.likes?.includes(userId);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.4 }}
//       className="mb-5 p-4 bg-gray-50 rounded-xl shadow-sm border-l-4 border-red-500"
//     >
//       <div className="flex items-start gap-3">
//         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
//           {comment.author?.username?.[0]?.toUpperCase() || "A"}
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <p className="font-semibold text-gray-900 text-base">
//               {comment.author?.username || "Anonymous"}
//             </p>
//             <p className="text-xs text-gray-500">
//               {timeAgo(comment.createdAt)}
//             </p>
//           </div>
//           <p className="text-gray-700 mt-1 leading-relaxed">{comment.text}</p>
//           <div className="flex items-center gap-3 mt-2">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleCommentReaction(comment._id, "like")}
//               className={`flex items-center gap-1 text-sm ${
//                 hasLiked ? "text-red-600" : "text-gray-600"
//               } ${
//                 isCommentReacting === comment._id
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//               disabled={isCommentReacting === comment._id}
//               aria-label={hasLiked ? "Unlike comment" : "Like comment"}
//             >
//               <motion.span
//                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                 transition={{ duration: 0.3 }}
//               >
//                 <FaHeart className="h-4 w-4" />
//               </motion.span>
//               {comment.likes?.length || 0}
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Component for Share Bar
// const ShareBar = ({
//   handleNativeShare,
//   handleShareTwitter,
//   handleShareWhatsapp,
//   handleShareFacebook,
//   handleShareTelegram,
//   handleShareLinkedin,
//   handleCopyLink,
//   isCopied,
// }) => (
//   <motion.div
//     className="fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center bg-white p-2 rounded-full shadow-lg"
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 1 }}
//   >
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleNativeShare}
//       className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share post"
//     >
//       <FaShareAlt className="text-xl" />
//       <span>Share</span>
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareTwitter}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on Twitter"
//     >
//       <FaXTwitter className="text-xl text-black" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareWhatsapp}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on WhatsApp"
//     >
//       <FaWhatsapp className="text-xl text-green-500" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareFacebook}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on Facebook"
//     >
//       <FaFacebook className="text-xl text-blue-600" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareTelegram}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on Telegram"
//     >
//       <FaTelegram className="text-xl text-blue-400" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareLinkedin}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on LinkedIn"
//     >
//       <FaLinkedin className="text-xl text-blue-700" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleCopyLink}
//       className={`p-2 rounded-full transition-colors ${
//         isCopied
//           ? "bg-green-500 text-white"
//           : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//       }`}
//       aria-label={isCopied ? "Link copied" : "Copy link"}
//     >
//       <FaLink className="text-xl" />
//     </motion.button>
//   </motion.div>
// );

// const PostDetails = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [allPosts, setAllPosts] = useState([]);
//   const [comment, setComment] = useState("");
//   const [categories, setCategories] = useState(["All"]);
//   const isAuthenticated = !!localStorage.getItem("token");
//   const [userReaction, setUserReaction] = useState({
//     like: false,
//     love: false,
//     laugh: false,
//     sad: false,
//   });
//   const [isCopied, setIsCopied] = useState(false);
//   const [reactionStreak, setReactionStreak] = useState(0);
//   const [streakRewards, setStreakRewards] = useState([]);
//   const [showMoreRelated, setShowMoreRelated] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [popularComments, setPopularComments] = useState([]);
//   const [relatedPostsCount, setRelatedPostsCount] = useState(5);
//   const [isReacting, setIsReacting] = useState(false);
//   const [isCommentReacting, setIsCommentReacting] = useState(null);
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [reactionBurst, setReactionBurst] = useState(0);
//   const [placeholderText, setPlaceholderText] = useState("");
//   const commentsPerPage = 5;
//   const videoRef = useRef(null);
//   const commentInputRef = useRef(null);
//   const commentsSectionRef = useRef(null);

//   // Typing Animation for Placeholder
//   const fullPlaceholder = "Write a comment...";
//   useEffect(() => {
//     let currentText = "";
//     let index = 0;
//     const typingInterval = setInterval(() => {
//       if (index < fullPlaceholder.length) {
//         currentText += fullPlaceholder[index];
//         setPlaceholderText(currentText);
//         index++;
//       } else {
//         clearInterval(typingInterval);
//         setTimeout(() => {
//           setPlaceholderText("");
//           index = 0;
//           currentText = "";
//           setTimeout(() => typingInterval, 1000); // Restart typing after a pause
//         }, 2000);
//       }
//     }, 100);
//     return () => clearInterval(typingInterval);
//   }, []);

//   // Fetch User Profile (for reaction streak)
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!isAuthenticated) return;
//       try {
//         const user = await getUserProfile();
//         setReactionStreak(user.reactionStreak || 0);
//         setStreakRewards(user.streakRewards || []);
//       } catch (err) {
//         toast.error("Failed to fetch user profile");
//       }
//     };
//     fetchUserProfile();
//   }, [isAuthenticated]);

//   // Fetch Posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await getPosts();
//         const foundPost = res.find((p) => p._id === postId);
//         setPost(foundPost);
//         setAllPosts(res);
//         const uniqueCategories = [
//           "All",
//           ...new Set(res.map((post) => post.category || "General")),
//         ];
//         setCategories(uniqueCategories);

//         if (foundPost && isAuthenticated) {
//           const userId = localStorage.getItem("userId");
//           setUserReaction({
//             like: foundPost.likes?.includes(userId) || false,
//             love: foundPost.loves?.includes(userId) || false,
//             laugh: foundPost.laughs?.includes(userId) || false,
//             sad: foundPost.sads?.includes(userId) || false,
//           });

//           const sortedComments = [...(foundPost.comments || [])].sort(
//             (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//           );
//           setPopularComments(sortedComments.slice(0, 2));
//         }
//       } catch (err) {
//         toast.error("Failed to fetch posts");
//       }
//     };
//     fetchPosts();
//   }, [postId, isAuthenticated]);

//   // Reaction Burst Logic
//   const handleReaction = async (type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }

//     if (isReacting) return;
//     setIsReacting(true);

//     try {
//       const userId = localStorage.getItem("userId");
//       const currentReactions = { ...userReaction };
//       const newReactions = { ...userReaction };

//       newReactions[type] = !currentReactions[type];
//       setUserReaction(newReactions);

//       const updatedReactions = await addReaction(postId, { type });

//       setPost((prevPost) => ({
//         ...prevPost,
//         likes: updatedReactions.likes || [],
//         loves: updatedReactions.loves || [],
//         laughs: updatedReactions.laughs || [],
//         sads: updatedReactions.sads || [],
//       }));

//       const user = await getUserProfile();
//       const newStreak = user.reactionStreak || 0;
//       const newRewards = user.streakRewards || [];
//       setReactionStreak(newStreak);
//       setStreakRewards(newRewards);

//       if (newReactions[type]) {
//         toast.success(`Reaction added! Streak: ${newStreak}`);
//         confetti({
//           particleCount: 50,
//           spread: 60,
//           origin: { y: 0.6 },
//           colors: ["#ff0000", "#ff7300", "#fff400"],
//         });

//         // Reaction Burst
//         setReactionBurst((prev) => prev + 1);
//         setTimeout(() => {
//           setReactionBurst((prev) => Math.max(prev - 1, 0));
//         }, 2000);

//         if (reactionBurst >= 2) {
//           confetti({
//             particleCount: 100,
//             spread: 90,
//             origin: { y: 0.5 },
//             shapes: ["circle", "square"],
//             colors: ["#ff0000", "#00ff00", "#0000ff"],
//             scalar: 1.5,
//           });
//           toast.success("Reaction Burst! 🎉 Keep it up!");
//         }

//         if (newRewards.includes("Reaction Streak 5")) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }

//       if (newStreak >= 3 && !showMoreRelated) {
//         setShowMoreRelated(true);
//         toast.success("🎉 More related posts unlocked!");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReaction({ like: false, love: false, laugh: false, sad: false });
//     } finally {
//       setIsReacting(false);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       toast.error("Please sign in to comment");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment(postId, { text: comment });
//       const res = await getPosts();
//       const updatedPost = res.find((p) => p._id === postId);
//       setPost(updatedPost);
//       setComment("");
//       setCommentsPage(1);
//       toast.success("Comment added");

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       commentInputRef.current?.focus();
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     }
//   };

//   const handleCommentReaction = async (commentId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to react to comments");
//       return;
//     }
//     if (isCommentReacting === commentId) return;
//     setIsCommentReacting(commentId);

//     try {
//       const updatedPost = await addCommentReaction(postId, commentId, { type });
//       setPost(updatedPost);

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       const userId = localStorage.getItem("userId");
//       const comment = updatedPost.comments.find((c) => c._id === commentId);
//       const hasLiked = comment.likes?.includes(userId);
//       toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
//     } catch (err) {
//       toast.error(err.message || "Failed to react to comment");
//     } finally {
//       setIsCommentReacting(null);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   // Infinite Scroll for Comments and Related Posts
//   const handleScroll = useCallback(
//     debounce(() => {
//       const commentsSection = commentsSectionRef.current;
//       if (commentsSection) {
//         const { scrollTop, scrollHeight, clientHeight } = commentsSection;
//         if (scrollTop + clientHeight >= scrollHeight - 100) {
//           if (
//             post.comments?.length >
//             commentsPage * commentsPerPage + popularComments.length
//           ) {
//             setCommentsPage((prev) => prev + 1);
//           }
//         }
//       }
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 100
//       ) {
//         setRelatedPostsCount((prev) => prev + 5);
//       }
//     }, 200),
//     [post?.comments?.length, commentsPage, popularComments.length]
//   );

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     const commentsSection = commentsSectionRef.current;
//     if (commentsSection) {
//       commentsSection.addEventListener("scroll", handleScroll);
//     }
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       if (commentsSection) {
//         commentsSection.removeEventListener("scroll", handleScroll);
//       }
//       handleScroll.cancel();
//     };
//   }, [handleScroll]);

//   // Scroll to Comment Input
//   const scrollToCommentInput = () => {
//     commentInputRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//     commentInputRef.current?.focus();
//   };

//   // Calculate Reaction Analytics
//   const reactionAnalytics = () => {
//     const totalReactions =
//       (post?.likes?.length || 0) +
//       (post?.loves?.length || 0) +
//       (post?.laughs?.length || 0) +
//       (post?.sads?.length || 0);
//     if (totalReactions === 0) return null;

//     const likePercent = ((post?.likes?.length || 0) / totalReactions) * 100;
//     const lovePercent = ((post?.loves?.length || 0) / totalReactions) * 100;
//     const laughPercent = ((post?.laughs?.length || 0) / totalReactions) * 100;
//     const sadPercent = ((post?.sads?.length || 0) / totalReactions) * 100;

//     return {
//       likePercent,
//       lovePercent,
//       laughPercent,
//       sadPercent,
//       totalReactions,
//     };
//   };

//   const analytics = reactionAnalytics();

//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";
//   const seoTitle =
//     postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
//   const postDescription = post?.description || "";
//   const seoDescription =
//     postDescription.length > 160
//       ? `${postDescription.slice(0, 157)}...`
//       : postDescription;
//   const postMedia = post?.media || "";
//   const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
//   const videoThumbnail = isVideo
//     ? `${postMedia.replace(/\.(mp4|webm|ogg)$/i, "-thumbnail.jpg")}`
//     : postMedia;
//   const keywords = post?.category
//     ? `${post.category}, ${postTitle.split(" ").slice(0, 3).join(", ")}`
//     : "GossipHub, Social Media, News";
//   const authorName = post?.isAnonymous
//     ? "Anonymous"
//     : post?.author?.username || "Unknown";
//   const datePublished = post?.createdAt
//     ? new Date(post.createdAt).toISOString()
//     : new Date().toISOString();
//   const publisherName = "GossipHub";

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: seoTitle,
//     description: seoDescription,
//     author: { "@type": "Person", name: authorName },
//     datePublished: datePublished,
//     image: postMedia || "https://gossipphub.netlify.app/default-image.jpg",
//     publisher: {
//       "@type": "Organization",
//       name: publisherName,
//       logo: {
//         "@type": "ImageObject",
//         url: "https://gossipphub.netlify.app/logo.png",
//       },
//     },
//     mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
//   };

//   // Share Functions (Updated handleNativeShare to ensure title and URL are shared)
//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         const shareData = {
//           title: postTitle,
//           text: `${postTitle}\n${postDescription.slice(0, 100)}...`,
//           url: postUrl,
//         };

//         // If there's an image and it's not a video, attempt to include it
//         if (postMedia && !isVideo) {
//           try {
//             const response = await fetch(postMedia);
//             const blob = await response.blob();
//             const file = new File([blob], "shared-image.jpg", {
//               type: "image/jpeg",
//             });
//             // Include the file in the share data
//             shareData.files = [file];
//           } catch (err) {
//             console.error("Failed to fetch image for sharing:", err);
//             // If image fetching fails, proceed without the image but ensure text and URL are shared
//             delete shareData.files;
//           }
//         }

//         await navigator.share(shareData);
//         toast.success("Shared successfully!");
//       } catch (err) {
//         console.error("Share error:", err);
//         // Fallback: If sharing with the image fails, try sharing without the image
//         try {
//           await navigator.share({
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//           toast.success("Shared successfully (without image)!");
//         } catch (fallbackErr) {
//           toast.error("Failed to share post");
//           console.error("Fallback share error:", fallbackErr);
//         }
//       }
//     } else {
//       toast.info("Native sharing not supported. Use the share options below.");
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard
//       .writeText(postUrl)
//       .then(() => {
//         setIsCopied(true);
//         toast.success("Link copied to clipboard!");
//         setTimeout(() => setIsCopied(false), 2000);
//       })
//       .catch(() => {
//         toast.error("Failed to copy link");
//       });
//   };

//   const handleShareTwitter = () => {
//     const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(twitterUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareWhatsapp = () => {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       `${postTitle}\n${postUrl}`
//     )}`;
//     window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       postUrl
//     )}&t=${encodeURIComponent(postTitle)}`;
//     window.open(facebookUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareTelegram = () => {
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(telegramUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareLinkedin = () => {
//     const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
//       postUrl
//     )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
//       postDescription.slice(0, 200) + "..."
//     )}`;
//     window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//   };

//   if (!post) {
//     return (
//       <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 pt-20 pb-12">
//         <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         <div className="bg-white p-6 shadow-lg rounded-lg">
//           <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
//           <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-4"></div>
//           <div className="space-y-2">
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const latestStories = allPosts
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);
//   const mostViewedPosts = allPosts
//     .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//     .slice(0, 5);
//   const relatedPosts = allPosts
//     .filter((p) => p.category === post.category && p._id !== post._id)
//     .slice(0, showMoreRelated ? relatedPostsCount : 5);

//   const currentIndex = allPosts.findIndex((p) => p._id === postId);
//   const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
//   const nextPost =
//     currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

//   const isTrending =
//     (post.likes?.length || 0) +
//       (post.loves?.length || 0) +
//       (post.laughs?.length || 0) +
//       (post.sads?.length || 0) +
//       (post.comments?.length || 0) >
//     50;

//   const paginatedComments = post.comments
//     ?.filter((c) => !popularComments.find((pc) => pc._id === c._id))
//     .slice()
//     .reverse()
//     .slice(0, commentsPage * commentsPerPage);

//   const userId = localStorage.getItem("userId");

//   return (
//     <motion.div className="min-h-screen font-poppins bg-gray-100">
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>{seoTitle}</title>
//         <meta name="description" content={seoDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content={authorName} />
//         <meta name="publisher" content={publisherName} />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href={postUrl} />
//         <meta property="og:title" content={postTitle} />
//         <meta property="og:description" content={postDescription} />
//         <meta property="og:url" content={postUrl} />
//         <meta property="og:type" content="article" />
//         {isVideo ? (
//           <>
//             <meta property="og:video" content={postMedia} />
//             <meta property="og:video:type" content="video/mp4" />
//             <meta property="og:image" content={videoThumbnail} />
//           </>
//         ) : (
//           postMedia && <meta property="og:image" content={postMedia} />
//         )}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={postTitle} />
//         <meta name="twitter:description" content={postDescription} />
//         <meta
//           name="twitter:image"
//           content={isVideo ? videoThumbnail : postMedia}
//         />
//         <script type="application/ld+json">
//           {JSON.stringify(structuredData)}
//         </script>
//       </Helmet>

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to home"
//           >
//             <HiArrowLeft className="w-6 h-6" />
//             Back
//           </Link>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           {/* Post Media */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {postMedia ? (
//               <PostMedia
//                 media={postMedia}
//                 isVideo={isVideo}
//                 isMuted={isMuted}
//                 toggleMute={toggleMute}
//                 videoRef={videoRef}
//                 isTrending={isTrending}
//               />
//             ) : (
//               <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-t-lg shadow-xl">
//                 <p className="text-gray-500">No media available</p>
//               </div>
//             )}
//             <div className="bg-white p-6 mt-0 shadow-lg rounded-b-lg">
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                 {post.title}
//               </h1>
//               <p className="text-sm text-gray-500 mb-4">
//                 Posted by:{" "}
//                 {post.isAnonymous ? (
//                   "Anonymous"
//                 ) : (
//                   <Link
//                     to={`/profile/${post.author._id}`}
//                     className="text-indigo-600 hover:text-indigo-700 transition-colors"
//                     aria-label={`View ${post.author.username}'s profile`}
//                   >
//                     {post.author?.username || "Unknown"}
//                   </Link>
//                 )}
//                 {" • "}
//                 {timeAgo(post.createdAt)}
//                 {" • "}
//                 {estimateReadTime(post.description)}
//               </p>
//               <div
//                 className="text-base text-gray-700 mb-6 leading-relaxed post-description"
//                 role="region"
//                 aria-label="Post description"
//               >
//                 {post.description?.split("\n\n").map((paragraph, pIdx) => (
//                   <motion.div
//                     key={pIdx}
//                     className="mb-4 last:mb-0"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5 }}
//                     dangerouslySetInnerHTML={{ __html: paragraph }}
//                   />
//                 ))}
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {(post.category ? [post.category] : []).map((tag, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               {/* Reaction Streak */}
//               {isAuthenticated && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">🔥</span> Reaction Streak
//                   </h3>
//                   <p className="text-sm">
//                     React to 5 posts to earn a badge! Current Streak:{" "}
//                     {reactionStreak}/5
//                   </p>
//                   <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
//                     <motion.div
//                       className="bg-white h-2.5 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{
//                         width: `${Math.min((reactionStreak / 5) * 100, 100)}%`,
//                       }}
//                       transition={{ duration: 1 }}
//                     />
//                   </div>
//                   {streakRewards.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium">Rewards Earned:</p>
//                       <div className="flex gap-2 mt-1">
//                         {streakRewards.map((reward, idx) => (
//                           <motion.span
//                             key={idx}
//                             className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: idx * 0.2 }}
//                           >
//                             {reward}
//                           </motion.span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* Reaction Analytics */}
//               {analytics && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">📊</span> Reaction Analytics
//                   </h3>
//                   <p className="text-sm text-gray-700">
//                     Total Reactions: {analytics.totalReactions}
//                   </p>
//                   <div className="space-y-2 mt-2">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         👍 Likes: {analytics.likePercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-blue-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.likePercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         💖 Loves: {analytics.lovePercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-pink-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.lovePercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         😂 Laughs: {analytics.laughPercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-yellow-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.laughPercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         😢 Sads: {analytics.sadPercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-blue-600 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.sadPercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Reactions */}
//               <div className="flex gap-3 mb-8 flex-wrap">
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("like")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.like
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Like post (${post.likes?.length || 0} likes)${
//                     userReaction.like ? " (You liked this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     👍
//                   </motion.span>
//                   ({post.likes?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("love")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.love
//                       ? "bg-pink-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Love post (${post.loves?.length || 0} loves)${
//                     userReaction.love ? " (You loved this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     💖
//                   </motion.span>
//                   ({post.loves?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("laugh")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.laugh
//                       ? "bg-yellow-500 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Laugh at post (${
//                     post.laughs?.length || 0
//                   } laughs)${
//                     userReaction.laugh ? " (You laughed at this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😂
//                   </motion.span>
//                   ({post.laughs?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("sad")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.sad
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Sad reaction (${post.sads?.length || 0} sads)${
//                     userReaction.sad ? " (You felt sad about this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😢
//                   </motion.span>
//                   ({post.sads?.length || 0})
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Comments Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mt-0 bg-white rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               Comments ({post.comments?.length || 0})
//             </h3>
//             <form
//               onSubmit={handleCommentSubmit}
//               className="mb-8 sticky top-20 z-10 md:static bg-white"
//             >
//               <textarea
//                 ref={commentInputRef}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder={placeholderText || fullPlaceholder}
//                 className="w-full p-4 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-300"
//                 aria-label="Comment input"
//                 disabled={!isAuthenticated}
//               />
//               <div className="flex justify-between items-center mt-3">
//                 {isAuthenticated ? (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                     aria-label="Submit comment"
//                   >
//                     Post
//                   </motion.button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="text-sm text-red-600 hover:underline"
//                   >
//                     Sign in to comment
//                   </Link>
//                 )}
//               </div>
//             </form>

//             <div
//               ref={commentsSectionRef}
//               className="max-h-[50vh] overflow-y-auto scrollbar-hide"
//             >
//               {popularComments.length > 0 && (
//                 <div className="mb-8">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                     <span className="mr-2">🌟</span> Popular Comments
//                   </h4>
//                   <AnimatePresence>
//                     {popularComments.map((c) => (
//                       <Comment
//                         key={c._id}
//                         comment={{ ...c, isPopular: true }}
//                         handleCommentReaction={handleCommentReaction}
//                         isCommentReacting={isCommentReacting}
//                         userId={userId}
//                         isAuthenticated={isAuthenticated}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}

//               <AnimatePresence>
//                 {post.comments?.length === 0 ? (
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="text-center text-gray-500 italic"
//                   >
//                     No comments yet. Be the first to comment!
//                   </motion.p>
//                 ) : (
//                   paginatedComments.map((c) => (
//                     <Comment
//                       key={c._id}
//                       comment={{ ...c, isPopular: false }}
//                       handleCommentReaction={handleCommentReaction}
//                       isCommentReacting={isCommentReacting}
//                       userId={userId}
//                       isAuthenticated={isAuthenticated}
//                     />
//                   ))
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>

//           {/* Next/Previous Post Navigation */}
//           <motion.div
//             className="mt-6 flex justify-between gap-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             {prevPost && (
//               <Link
//                 to={`/posts/${prevPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
//               >
//                 <HiArrowLeft className="h-5 w-5" />
//                 Previous Post
//               </Link>
//             )}
//             {nextPost && (
//               <Link
//                 to={`/posts/${nextPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors ml-auto"
//               >
//                 Next Post
//                 <HiArrowRight className="h-5 w-5" />
//               </Link>
//             )}
//           </motion.div>

//           {/* Related Posts */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             className="mt-6 bg-white rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               Related Posts
//             </h3>
//             <AnimatePresence>
//               {relatedPosts.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500"
//                 >
//                   No related posts found in this category.
//                 </motion.p>
//               ) : (
//                 <div className="space-y-4">
//                   {relatedPosts.map((story, index) => (
//                     <motion.div
//                       key={story._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.5, delay: index * 0.1 }}
//                     >
//                       <Link to={`/posts/${story._id}`} className="flex gap-3">
//                         {story.media &&
//                           (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                             <video
//                               src={story.media}
//                               className="w-16 h-16 object-cover rounded"
//                               muted
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ) : (
//                             <img
//                               src={story.media}
//                               alt="Related post thumbnail"
//                               className="w-16 h-16 object-cover rounded"
//                               loading="lazy"
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ))}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                             {story.title}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {story.category || "General"}
//                           </p>
//                         </div>
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
//           <motion.div
//             className="bg-white rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Latest Stories
//             </h3>
//             <div className="space-y-4">
//               {latestStories.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           loading="lazy"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             className="bg-white rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Most Viewed
//             </h3>
//             <div className="space-y-4">
//               {mostViewedPosts.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           loading="lazy"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Floating Action Button for Commenting */}
//       {isAuthenticated && (
//         <motion.button
//           onClick={scrollToCommentInput}
//           className="fixed lg:bottom-20 bottom-4 right-6 z-50 p-2 bg-red-600 text-white rounded-full shadow-lg"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           aria-label="Add a comment"
//         >
//           <FaComment className="h-6 w-6" />
//         </motion.button>
//       )}

//       <ShareBar
//         handleNativeShare={handleNativeShare}
//         handleShareTwitter={handleShareTwitter}
//         handleShareWhatsapp={handleShareWhatsapp}
//         handleShareFacebook={handleShareFacebook}
//         handleShareTelegram={handleShareTelegram}
//         handleShareLinkedin={handleShareLinkedin}
//         handleCopyLink={handleCopyLink}
//         isCopied={isCopied}
//       />

//       <footer className="bg-red-600 text-white py-6">
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
//           <p className="text-sm">© 2025 GossippHub. All rights reserved.</p>
//         </div>
//       </footer>

//       <style>
//         {`
//           .post-description iframe,
//           .post-description video {
//             width: 100% !important;
//             height: 400px !important;
//             max-width: 100%;
//             border-radius: 8px;
//             margin-bottom: 1rem;
//           }
//           @media (min-width: 640px) {
//             .post-description iframe,
//             .post-description video {
//               height: 500px !important;
//             }
//           }
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}
//       </style>
//     </motion.div>
//   );
// };

// export default PostDetails;

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   getPosts,
//   addReaction,
//   addComment,
//   addCommentReaction,
//   getUserProfile,
// } from "../utils/api";
// import {
//   FaShareAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaLink,
//   FaTelegram,
//   FaLinkedin,
//   FaHeart,
//   FaComment,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import {
//   HiArrowLeft,
//   HiArrowRight,
//   HiVolumeUp,
//   HiVolumeOff,
// } from "react-icons/hi";
// import { Helmet } from "react-helmet";
// import confetti from "canvas-confetti";
// import debounce from "lodash/debounce";

// // Utility function to calculate time difference and return "time ago" format
// const timeAgo = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   if (diffInSeconds < 0 || diffInSeconds < 10) return "Just now";
//   if (diffInSeconds < 60)
//     return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60)
//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24)
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
// };

// // Utility to estimate read time (assuming 200 words per minute)
// const estimateReadTime = (text) => {
//   const words = text?.split(/\s+/).length || 0;
//   const minutes = Math.ceil(words / 200);
//   return minutes === 0 ? "Less than a minute" : `${minutes} min read`;
// };

// // Component for Post Media with Blur-Up Effect
// const PostMedia = ({
//   media,
//   isVideo,
//   isMuted,
//   toggleMute,
//   videoRef,
//   isTrending,
// }) => (
//   <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//     {isVideo ? (
//       <div className="relative">
//         <video
//           ref={videoRef}
//           src={media}
//           controls
//           muted={isMuted}
//           className="w-full aspect-video object-contain bg-black"
//           aria-label="Post video"
//           onError={(e) => {
//             console.error("Video failed to load:", media);
//             e.target.src =
//               "https://via.placeholder.com/400x400?text=Video+Not+Available";
//           }}
//         />
//         <button
//           onClick={toggleMute}
//           className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white"
//           aria-label={isMuted ? "Unmute video" : "Mute video"}
//         >
//           {isMuted ? (
//             <HiVolumeOff className="h-6 w-6" />
//           ) : (
//             <HiVolumeUp className="h-6 w-6" />
//           )}
//         </button>
//       </div>
//     ) : (
//       <motion.img
//         src={media}
//         alt="Post media"
//         className="w-full aspect-video object-contain"
//         initial={{ filter: "blur(10px)" }}
//         animate={{ filter: "blur(0px)" }}
//         transition={{ duration: 0.5 }}
//         loading="lazy"
//         onError={(e) => {
//           console.error("Image failed to load:", media);
//           e.target.src =
//             "https://via.placeholder.com/400x400?text=Image+Not+Available";
//         }}
//       />
//     )}
//     <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75 bg-black/50 px-2 py-1 rounded">
//       GossipHub
//     </div>
//     {isTrending && (
//       <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//         <span className="mr-1">🔥</span> Trending Now
//       </div>
//     )}
//   </div>
// );

// // Component for a Single Comment
// const Comment = ({
//   comment,
//   handleCommentReaction,
//   isCommentReacting,
//   userId,
//   isAuthenticated,
// }) => {
//   const hasLiked = comment.likes?.includes(userId);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.4 }}
//       className="mb-5 p-4 bg-gray-50 rounded-xl shadow-sm border-l-4 border-red-500"
//     >
//       <div className="flex items-start gap-3">
//         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
//           {comment.author?.username?.[0]?.toUpperCase() || "A"}
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <p className="font-semibold text-gray-900 text-base">
//               {comment.author?.username || "Anonymous"}
//             </p>
//             <p className="text-xs text-gray-500">
//               {timeAgo(comment.createdAt)}
//             </p>
//           </div>
//           <p className="text-gray-700 mt-1 leading-relaxed">{comment.text}</p>
//           <div className="flex items-center gap-3 mt-2">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleCommentReaction(comment._id, "like")}
//               className={`flex items-center gap-1 text-sm ${
//                 hasLiked ? "text-red-600" : "text-gray-600"
//               } ${
//                 isCommentReacting === comment._id
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//               disabled={isCommentReacting === comment._id}
//               aria-label={hasLiked ? "Unlike comment" : "Like comment"}
//             >
//               <motion.span
//                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                 transition={{ duration: 0.3 }}
//               >
//                 <FaHeart className="h-4 w-4" />
//               </motion.span>
//               {comment.likes?.length || 0}
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Component for Share Bar
// const ShareBar = ({
//   handleNativeShare,
//   handleShareTwitter,
//   handleShareWhatsapp,
//   handleShareFacebook,
//   handleShareTelegram,
//   handleShareLinkedin,
//   handleCopyLink,
//   isCopied,
// }) => (
//   <motion.div
//     className="fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center bg-white p-2 rounded-full shadow-lg"
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 1 }}
//   >
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleNativeShare}
//       className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share post"
//     >
//       <FaShareAlt className="text-xl" />
//       <span>Share</span>
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareTwitter}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on Twitter"
//     >
//       <FaXTwitter className="text-xl text-black" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareWhatsapp}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on WhatsApp"
//     >
//       <FaWhatsapp className="text-xl text-green-500" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareFacebook}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on Facebook"
//     >
//       <FaFacebook className="text-xl text-blue-600" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareTelegram}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on Telegram"
//     >
//       <FaTelegram className="text-xl text-blue-400" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareLinkedin}
//       className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
//       aria-label="Share on LinkedIn"
//     >
//       <FaLinkedin className="text-xl text-blue-700" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleCopyLink}
//       className={`p-2 rounded-full transition-colors ${
//         isCopied
//           ? "bg-green-500 text-white"
//           : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//       }`}
//       aria-label={isCopied ? "Link copied" : "Copy link"}
//     >
//       <FaLink className="text-xl" />
//     </motion.button>
//   </motion.div>
// );

// const PostDetails = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [allPosts, setAllPosts] = useState([]);
//   const [comment, setComment] = useState("");
//   const [categories, setCategories] = useState(["All"]);
//   const isAuthenticated = !!localStorage.getItem("token");
//   const [userReaction, setUserReaction] = useState({
//     like: false,
//     love: false,
//     laugh: false,
//     sad: false,
//   });
//   const [isCopied, setIsCopied] = useState(false);
//   const [reactionStreak, setReactionStreak] = useState(0);
//   const [streakRewards, setStreakRewards] = useState([]);
//   const [showMoreRelated, setShowMoreRelated] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [popularComments, setPopularComments] = useState([]);
//   const [relatedPostsCount, setRelatedPostsCount] = useState(5);
//   const [isReacting, setIsReacting] = useState(false);
//   const [isCommentReacting, setIsCommentReacting] = useState(null);
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [reactionBurst, setReactionBurst] = useState(0);
//   const [placeholderText, setPlaceholderText] = useState("");
//   const commentsPerPage = 5;
//   const videoRef = useRef(null);
//   const commentInputRef = useRef(null);
//   const commentsSectionRef = useRef(null);

//   // Typing Animation for Placeholder
//   const fullPlaceholder = "Write a comment...";
//   useEffect(() => {
//     let currentText = "";
//     let index = 0;
//     const typingInterval = setInterval(() => {
//       if (index < fullPlaceholder.length) {
//         currentText += fullPlaceholder[index];
//         setPlaceholderText(currentText);
//         index++;
//       } else {
//         clearInterval(typingInterval);
//         setTimeout(() => {
//           setPlaceholderText("");
//           index = 0;
//           currentText = "";
//           setTimeout(() => typingInterval, 1000); // Restart typing after a pause
//         }, 2000);
//       }
//     }, 100);
//     return () => clearInterval(typingInterval);
//   }, []);

//   // Fetch User Profile (for reaction streak)
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!isAuthenticated) return;
//       try {
//         const user = await getUserProfile();
//         setReactionStreak(user.reactionStreak || 0);
//         setStreakRewards(user.streakRewards || []);
//       } catch (err) {
//         toast.error("Failed to fetch user profile");
//       }
//     };
//     fetchUserProfile();
//   }, [isAuthenticated]);

//   // Fetch Posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await getPosts();
//         const foundPost = res.find((p) => p._id === postId);
//         setPost(foundPost);
//         setAllPosts(res);
//         const uniqueCategories = [
//           "All",
//           ...new Set(res.map((post) => post.category || "General")),
//         ];
//         setCategories(uniqueCategories);

//         if (foundPost && isAuthenticated) {
//           const userId = localStorage.getItem("userId");
//           setUserReaction({
//             like: foundPost.likes?.includes(userId) || false,
//             love: foundPost.loves?.includes(userId) || false,
//             laugh: foundPost.laughs?.includes(userId) || false,
//             sad: foundPost.sads?.includes(userId) || false,
//           });

//           const sortedComments = [...(foundPost.comments || [])].sort(
//             (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//           );
//           setPopularComments(sortedComments.slice(0, 2));
//         }
//       } catch (err) {
//         toast.error("Failed to fetch posts");
//       }
//     };
//     fetchPosts();
//   }, [postId, isAuthenticated]);

//   // Reaction Burst Logic
//   const handleReaction = async (type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }

//     if (isReacting) return;
//     setIsReacting(true);

//     try {
//       const userId = localStorage.getItem("userId");
//       const currentReactions = { ...userReaction };
//       const newReactions = { ...userReaction };

//       newReactions[type] = !currentReactions[type];
//       setUserReaction(newReactions);

//       const updatedReactions = await addReaction(postId, { type });

//       setPost((prevPost) => ({
//         ...prevPost,
//         likes: updatedReactions.likes || [],
//         loves: updatedReactions.loves || [],
//         laughs: updatedReactions.laughs || [],
//         sads: updatedReactions.sads || [],
//       }));

//       const user = await getUserProfile();
//       const newStreak = user.reactionStreak || 0;
//       const newRewards = user.streakRewards || [];
//       setReactionStreak(newStreak);
//       setStreakRewards(newRewards);

//       if (newReactions[type]) {
//         toast.success(`Reaction added! Streak: ${newStreak}`);
//         confetti({
//           particleCount: 50,
//           spread: 60,
//           origin: { y: 0.6 },
//           colors: ["#ff0000", "#ff7300", "#fff400"],
//         });

//         // Reaction Burst
//         setReactionBurst((prev) => prev + 1);
//         setTimeout(() => {
//           setReactionBurst((prev) => Math.max(prev - 1, 0));
//         }, 2000);

//         if (reactionBurst >= 2) {
//           confetti({
//             particleCount: 100,
//             spread: 90,
//             origin: { y: 0.5 },
//             shapes: ["circle", "square"],
//             colors: ["#ff0000", "#00ff00", "#0000ff"],
//             scalar: 1.5,
//           });
//           toast.success("Reaction Burst! 🎉 Keep it up!");
//         }

//         if (newRewards.includes("Reaction Streak 5")) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }

//       if (newStreak >= 3 && !showMoreRelated) {
//         setShowMoreRelated(true);
//         toast.success("🎉 More related posts unlocked!");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReaction({ like: false, love: false, laugh: false, sad: false });
//     } finally {
//       setIsReacting(false);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       toast.error("Please sign in to comment");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment(postId, { text: comment });
//       const res = await getPosts();
//       const updatedPost = res.find((p) => p._id === postId);
//       setPost(updatedPost);
//       setComment("");
//       setCommentsPage(1);
//       toast.success("Comment added");

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       commentInputRef.current?.focus();
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     }
//   };

//   const handleCommentReaction = async (commentId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to react to comments");
//       return;
//     }
//     if (isCommentReacting === commentId) return;
//     setIsCommentReacting(commentId);

//     try {
//       const updatedPost = await addCommentReaction(postId, commentId, { type });
//       setPost(updatedPost);

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       const userId = localStorage.getItem("userId");
//       const comment = updatedPost.comments.find((c) => c._id === commentId);
//       const hasLiked = comment.likes?.includes(userId);
//       toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
//     } catch (err) {
//       toast.error(err.message || "Failed to react to comment");
//     } finally {
//       setIsCommentReacting(null);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   // Infinite Scroll for Comments and Related Posts
//   const handleScroll = useCallback(
//     debounce(() => {
//       const commentsSection = commentsSectionRef.current;
//       if (commentsSection) {
//         const { scrollTop, scrollHeight, clientHeight } = commentsSection;
//         if (scrollTop + clientHeight >= scrollHeight - 100) {
//           if (
//             post.comments?.length >
//             commentsPage * commentsPerPage + popularComments.length
//           ) {
//             setCommentsPage((prev) => prev + 1);
//           }
//         }
//       }
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 100
//       ) {
//         setRelatedPostsCount((prev) => prev + 5);
//       }
//     }, 200),
//     [post?.comments?.length, commentsPage, popularComments.length]
//   );

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     const commentsSection = commentsSectionRef.current;
//     if (commentsSection) {
//       commentsSection.addEventListener("scroll", handleScroll);
//     }
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       if (commentsSection) {
//         commentsSection.removeEventListener("scroll", handleScroll);
//       }
//       handleScroll.cancel();
//     };
//   }, [handleScroll]);

//   // Scroll to Comment Input
//   const scrollToCommentInput = () => {
//     commentInputRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//     commentInputRef.current?.focus();
//   };

//   // Calculate Reaction Analytics
//   const reactionAnalytics = () => {
//     const totalReactions =
//       (post?.likes?.length || 0) +
//       (post?.loves?.length || 0) +
//       (post?.laughs?.length || 0) +
//       (post?.sads?.length || 0);
//     if (totalReactions === 0) return null;

//     const likePercent = ((post?.likes?.length || 0) / totalReactions) * 100;
//     const lovePercent = ((post?.loves?.length || 0) / totalReactions) * 100;
//     const laughPercent = ((post?.laughs?.length || 0) / totalReactions) * 100;
//     const sadPercent = ((post?.sads?.length || 0) / totalReactions) * 100;

//     return {
//       likePercent,
//       lovePercent,
//       laughPercent,
//       sadPercent,
//       totalReactions,
//     };
//   };

//   const analytics = reactionAnalytics();

//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";
//   const seoTitle =
//     postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
//   const postDescription = post?.description || "";
//   const seoDescription =
//     postDescription.length > 160
//       ? `${postDescription.slice(0, 157)}...`
//       : postDescription;
//   const postMedia = post?.media || "";
//   const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
//   const videoThumbnail = isVideo
//     ? `${postMedia.replace(/\.(mp4|webm|ogg)$/i, "-thumbnail.jpg")}`
//     : postMedia;
//   const keywords = post?.category
//     ? `${post.category}, ${postTitle.split(" ").slice(0, 3).join(", ")}`
//     : "GossipHub, Social Media, News";
//   const authorName = post?.isAnonymous
//     ? "Anonymous"
//     : post?.author?.username || "Unknown";
//   const datePublished = post?.createdAt
//     ? new Date(post.createdAt).toISOString()
//     : new Date().toISOString();
//   const publisherName = "GossipHub";

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: seoTitle,
//     description: seoDescription,
//     author: { "@type": "Person", name: authorName },
//     datePublished: datePublished,
//     image: postMedia || "https://gossipphub.netlify.app/default-image.jpg",
//     publisher: {
//       "@type": "Organization",
//       name: publisherName,
//       logo: {
//         "@type": "ImageObject",
//         url: "https://gossipphub.netlify.app/logo.png",
//       },
//     },
//     mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
//   };

//   // Share Functions (Updated handleNativeShare to ensure title and URL are shared)
//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         const shareData = {
//           title: postTitle,
//           text: `${postTitle}\n${postDescription.slice(0, 100)}...`,
//           url: postUrl,
//         };

//         // If there's an image and it's not a video, attempt to include it
//         if (postMedia && !isVideo) {
//           try {
//             const response = await fetch(postMedia);
//             const blob = await response.blob();
//             const file = new File([blob], "shared-image.jpg", {
//               type: "image/jpeg",
//             });
//             // Include the file in the share data
//             shareData.files = [file];
//           } catch (err) {
//             console.error("Failed to fetch image for sharing:", err);
//             // If image fetching fails, proceed without the image but ensure text and URL are shared
//             delete shareData.files;
//           }
//         }

//         await navigator.share(shareData);
//         toast.success("Shared successfully!");
//       } catch (err) {
//         console.error("Share error:", err);
//         // Fallback: If sharing with the image fails, try sharing without the image
//         try {
//           await navigator.share({
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//           toast.success("Shared successfully (without image)!");
//         } catch (fallbackErr) {
//           toast.error("Failed to share post");
//           console.error("Fallback share error:", fallbackErr);
//         }
//       }
//     } else {
//       toast.info("Native sharing not supported. Use the share options below.");
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard
//       .writeText(postUrl)
//       .then(() => {
//         setIsCopied(true);
//         toast.success("Link copied to clipboard!");
//         setTimeout(() => setIsCopied(false), 2000);
//       })
//       .catch(() => {
//         toast.error("Failed to copy link");
//       });
//   };

//   const handleShareTwitter = () => {
//     const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(twitterUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareWhatsapp = () => {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       `${postTitle}\n${postUrl}`
//     )}`;
//     window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       postUrl
//     )}&t=${encodeURIComponent(postTitle)}`;
//     window.open(facebookUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareTelegram = () => {
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(telegramUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareLinkedin = () => {
//     const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
//       postUrl
//     )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
//       postDescription.slice(0, 200) + "..."
//     )}`;
//     window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//   };

//   if (!post) {
//     return (
//       <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 pt-20 pb-12">
//         <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         <div className="bg-white p-6 shadow-lg rounded-lg">
//           <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
//           <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-4"></div>
//           <div className="space-y-2">
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const latestStories = allPosts
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);
//   const mostViewedPosts = allPosts
//     .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//     .slice(0, 5);
//   const relatedPosts = allPosts
//     .filter((p) => p.category === post.category && p._id !== post._id)
//     .slice(0, showMoreRelated ? relatedPostsCount : 5);

//   const currentIndex = allPosts.findIndex((p) => p._id === postId);
//   const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
//   const nextPost =
//     currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

//   const isTrending =
//     (post.likes?.length || 0) +
//       (post.loves?.length || 0) +
//       (post.laughs?.length || 0) +
//       (post.sads?.length || 0) +
//       (post.comments?.length || 0) >
//     50;

//   const paginatedComments = post.comments
//     ?.filter((c) => !popularComments.find((pc) => pc._id === c._id))
//     .slice()
//     .reverse()
//     .slice(0, commentsPage * commentsPerPage);

//   const userId = localStorage.getItem("userId");

//   return (
//     <motion.div className="min-h-screen font-poppins bg-gray-100">
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>{seoTitle}</title>
//         <meta name="description" content={seoDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content={authorName} />
//         <meta name="publisher" content={publisherName} />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href={postUrl} />
//         <meta property="og:title" content={postTitle} />
//         <meta property="og:description" content={postDescription} />
//         <meta property="og:url" content={postUrl} />
//         <meta property="og:type" content="article" />
//         {/* Split the conditional rendering to avoid fragments */}
//         {isVideo && <meta property="og:video" content={postMedia} />}
//         {isVideo && <meta property="og:video:type" content="video/mp4" />}
//         {isVideo && <meta property="og:image" content={videoThumbnail} />}
//         {!isVideo && postMedia && (
//           <meta property="og:image" content={postMedia} />
//         )}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={postTitle} />
//         <meta name="twitter:description" content={postDescription} />
//         <meta
//           name="twitter:image"
//           content={isVideo ? videoThumbnail : postMedia}
//         />
//         <script type="application/ld+json">
//           {JSON.stringify(structuredData)}
//         </script>
//       </Helmet>

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to home"
//           >
//             <HiArrowLeft className="w-6 h-6" />
//             Back
//           </Link>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           {/* Post Media */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {postMedia ? (
//               <PostMedia
//                 media={postMedia}
//                 isVideo={isVideo}
//                 isMuted={isMuted}
//                 toggleMute={toggleMute}
//                 videoRef={videoRef}
//                 isTrending={isTrending}
//               />
//             ) : (
//               <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-t-lg shadow-xl">
//                 <p className="text-gray-500">No media available</p>
//               </div>
//             )}
//             <div className="bg-white p-6 mt-0 shadow-lg rounded-b-lg">
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                 {post.title}
//               </h1>
//               <p className="text-sm text-gray-500 mb-4">
//                 Posted by:{" "}
//                 {post.isAnonymous ? (
//                   "Anonymous"
//                 ) : (
//                   <Link
//                     to={`/profile/${post.author._id}`}
//                     className="text-indigo-600 hover:text-indigo-700 transition-colors"
//                     aria-label={`View ${post.author.username}'s profile`}
//                   >
//                     {post.author?.username || "Unknown"}
//                   </Link>
//                 )}
//                 {" • "}
//                 {timeAgo(post.createdAt)}
//                 {" • "}
//                 {estimateReadTime(post.description)}
//               </p>
//               <div
//                 className="text-base text-gray-700 mb-6 leading-relaxed post-description"
//                 role="region"
//                 aria-label="Post description"
//               >
//                 {post.description?.split("\n\n").map((paragraph, pIdx) => (
//                   <motion.div
//                     key={pIdx}
//                     className="mb-4 last:mb-0"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5 }}
//                     dangerouslySetInnerHTML={{ __html: paragraph }}
//                   />
//                 ))}
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {(post.category ? [post.category] : []).map((tag, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               {/* Reaction Streak */}
//               {isAuthenticated && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">🔥</span> Reaction Streak
//                   </h3>
//                   <p className="text-sm">
//                     React to 5 posts to earn a badge! Current Streak:{" "}
//                     {reactionStreak}/5
//                   </p>
//                   <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
//                     <motion.div
//                       className="bg-white h-2.5 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{
//                         width: `${Math.min((reactionStreak / 5) * 100, 100)}%`,
//                       }}
//                       transition={{ duration: 1 }}
//                     />
//                   </div>
//                   {streakRewards.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium">Rewards Earned:</p>
//                       <div className="flex gap-2 mt-1">
//                         {streakRewards.map((reward, idx) => (
//                           <motion.span
//                             key={idx}
//                             className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: idx * 0.2 }}
//                           >
//                             {reward}
//                           </motion.span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* Reaction Analytics */}
//               {analytics && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">📊</span> Reaction Analytics
//                   </h3>
//                   <p className="text-sm text-gray-700">
//                     Total Reactions: {analytics.totalReactions}
//                   </p>
//                   <div className="space-y-2 mt-2">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         👍 Likes: {analytics.likePercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-blue-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.likePercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         💖 Loves: {analytics.lovePercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-pink-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.lovePercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         😂 Laughs: {analytics.laughPercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-yellow-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.laughPercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">
//                         😢 Sads: {analytics.sadPercent.toFixed(1)}%
//                       </span>
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <motion.div
//                           className="bg-blue-600 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.sadPercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Reactions */}
//               <div className="flex gap-3 mb-8 flex-wrap">
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("like")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.like
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Like post (${post.likes?.length || 0} likes)${
//                     userReaction.like ? " (You liked this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     👍
//                   </motion.span>
//                   ({post.likes?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("love")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.love
//                       ? "bg-pink-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Love post (${post.loves?.length || 0} loves)${
//                     userReaction.love ? " (You loved this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     💖
//                   </motion.span>
//                   ({post.loves?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("laugh")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.laugh
//                       ? "bg-yellow-500 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Laugh at post (${
//                     post.laughs?.length || 0
//                   } laughs)${
//                     userReaction.laugh ? " (You laughed at this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😂
//                   </motion.span>
//                   ({post.laughs?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("sad")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.sad
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Sad reaction (${post.sads?.length || 0} sads)${
//                     userReaction.sad ? " (You felt sad about this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😢
//                   </motion.span>
//                   ({post.sads?.length || 0})
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Comments Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mt-0 bg-white rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               Comments ({post.comments?.length || 0})
//             </h3>
//             <form
//               onSubmit={handleCommentSubmit}
//               className="mb-8 sticky top-20 z-10 md:static bg-white"
//             >
//               <textarea
//                 ref={commentInputRef}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder={placeholderText || fullPlaceholder}
//                 className="w-full p-4 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-300"
//                 aria-label="Comment input"
//                 disabled={!isAuthenticated}
//               />
//               <div className="flex justify-between items-center mt-3">
//                 {isAuthenticated ? (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                     aria-label="Submit comment"
//                   >
//                     Post
//                   </motion.button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="text-sm text-red-600 hover:underline"
//                   >
//                     Sign in to comment
//                   </Link>
//                 )}
//               </div>
//             </form>

//             <div
//               ref={commentsSectionRef}
//               className="max-h-[50vh] overflow-y-auto scrollbar-hide"
//             >
//               {popularComments.length > 0 && (
//                 <div className="mb-8">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                     <span className="mr-2">🌟</span> Popular Comments
//                   </h4>
//                   <AnimatePresence>
//                     {popularComments.map((c) => (
//                       <Comment
//                         key={c._id}
//                         comment={{ ...c, isPopular: true }}
//                         handleCommentReaction={handleCommentReaction}
//                         isCommentReacting={isCommentReacting}
//                         userId={userId}
//                         isAuthenticated={isAuthenticated}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}

//               <AnimatePresence>
//                 {post.comments?.length === 0 ? (
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="text-center text-gray-500 italic"
//                   >
//                     No comments yet. Be the first to comment!
//                   </motion.p>
//                 ) : (
//                   paginatedComments.map((c) => (
//                     <Comment
//                       key={c._id}
//                       comment={{ ...c, isPopular: false }}
//                       handleCommentReaction={handleCommentReaction}
//                       isCommentReacting={isCommentReacting}
//                       userId={userId}
//                       isAuthenticated={isAuthenticated}
//                     />
//                   ))
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>

//           {/* Next/Previous Post Navigation */}
//           <motion.div
//             className="mt-6 flex justify-between gap-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             {prevPost && (
//               <Link
//                 to={`/posts/${prevPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
//               >
//                 <HiArrowLeft className="h-5 w-5" />
//                 Previous Post
//               </Link>
//             )}
//             {nextPost && (
//               <Link
//                 to={`/posts/${nextPost._id}`}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors ml-auto"
//               >
//                 Next Post
//                 <HiArrowRight className="h-5 w-5" />
//               </Link>
//             )}
//           </motion.div>

//           {/* Related Posts */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             className="mt-6 bg-white rounded-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               Related Posts
//             </h3>
//             <AnimatePresence>
//               {relatedPosts.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500"
//                 >
//                   No related posts found in this category.
//                 </motion.p>
//               ) : (
//                 <div className="space-y-4">
//                   {relatedPosts.map((story, index) => (
//                     <motion.div
//                       key={story._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.5, delay: index * 0.1 }}
//                     >
//                       <Link to={`/posts/${story._id}`} className="flex gap-3">
//                         {story.media &&
//                           (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                             <video
//                               src={story.media}
//                               className="w-16 h-16 object-cover rounded"
//                               muted
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ) : (
//                             <img
//                               src={story.media}
//                               alt="Related post thumbnail"
//                               className="w-16 h-16 object-cover rounded"
//                               loading="lazy"
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ))}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                             {story.title}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {story.category || "General"}
//                           </p>
//                         </div>
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
//           <motion.div
//             className="bg-white rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Latest Stories
//             </h3>
//             <div className="space-y-4">
//               {latestStories.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           loading="lazy"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             className="bg-white rounded-lg p-4 shadow-lg"
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Most Viewed
//             </h3>
//             <div className="space-y-4">
//               {mostViewedPosts.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           loading="lazy"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 hover:text-red-600">
//                         {story.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Floating Action Button for Commenting */}
//       {isAuthenticated && (
//         <motion.button
//           onClick={scrollToCommentInput}
//           className="fixed lg:bottom-20 bottom-4 right-6 z-50 p-2 bg-red-600 text-white rounded-full shadow-lg"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           aria-label="Add a comment"
//         >
//           <FaComment className="h-6 w-6" />
//         </motion.button>
//       )}

//       <ShareBar
//         handleNativeShare={handleNativeShare}
//         handleShareTwitter={handleShareTwitter}
//         handleShareWhatsapp={handleShareWhatsapp}
//         handleShareFacebook={handleShareFacebook}
//         handleShareTelegram={handleShareTelegram}
//         handleShareLinkedin={handleShareLinkedin}
//         handleCopyLink={handleCopyLink}
//         isCopied={isCopied}
//       />

//       <footer className="bg-red-600 text-white py-6">
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
//           <p className="text-sm">© 2025 GossippHub. All rights reserved.</p>
//         </div>
//       </footer>

//       <style>
//         {`
//           .post-description iframe,
//           .post-description video {
//             width: 100% !important;
//             height: 400px !important;
//             max-width: 100%;
//             border-radius: 8px;
//             margin-bottom: 1rem;
//           }
//           @media (min-width: 640px) {
//             .post-description iframe,
//             .post-description video {
//               height: 500px !important;
//             }
//           }
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}
//       </style>
//     </motion.div>
//   );
// };

// export default PostDetails;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   getPosts,
//   addReaction,
//   addComment,
//   addCommentReaction,
//   getUserProfile,
// } from "../utils/api";
// import {
//   FaShareAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaLink,
//   FaTelegram,
//   FaLinkedin,
//   FaHeart,
//   FaComment,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import {
//   HiArrowLeft,
//   HiArrowRight,
//   HiVolumeUp,
//   HiVolumeOff,
// } from "react-icons/hi";
// import { Helmet } from "react-helmet";
// import confetti from "canvas-confetti";
// import debounce from "lodash/debounce";

// // Utility function to calculate time difference and return "time ago" format
// const timeAgo = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   if (diffInSeconds < 0 || diffInSeconds < 10) return "Just now";
//   if (diffInSeconds < 60)
//     return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60)
//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24)
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
// };

// // Utility to estimate read time (assuming 200 words per minute)
// const estimateReadTime = (text) => {
//   const words = text?.split(/\s+/).length || 0;
//   const minutes = Math.ceil(words / 200);
//   return minutes === 0 ? "Less than a minute" : `${minutes} min read`;
// };

// // Component for Post Media with Blur-Up Effect
// const PostMedia = ({
//   media,
//   isVideo,
//   isMuted,
//   toggleMute,
//   videoRef,
//   isTrending,
//   isDarkMode,
// }) => (
//   <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//     {isVideo ? (
//       <div className="relative">
//         <video
//           ref={videoRef}
//           src={media}
//           controls
//           muted={isMuted}
//           className={`w-full aspect-video object-contain ${
//             isDarkMode ? "bg-black" : "bg-gray-200"
//           }`}
//           aria-label="Post video"
//           onError={(e) => {
//             console.error("Video failed to load:", media);
//             e.target.src =
//               "https://via.placeholder.com/400x400?text=Video+Not+Available";
//           }}
//         />
//         <button
//           onClick={toggleMute}
//           className={`absolute bottom-4 right-4 p-2 rounded-full ${
//             isDarkMode ? "bg-gray-800/50 text-white" : "bg-black/50 text-white"
//           }`}
//           aria-label={isMuted ? "Unmute video" : "Mute video"}
//         >
//           {isMuted ? (
//             <HiVolumeOff className="h-6 w-6" />
//           ) : (
//             <HiVolumeUp className="h-6 w-6" />
//           )}
//         </button>
//       </div>
//     ) : (
//       <motion.img
//         src={media}
//         alt="Post media"
//         className="w-full aspect-video object-contain"
//         initial={{ filter: "blur(10px)" }}
//         animate={{ filter: "blur(0px)" }}
//         transition={{ duration: 0.5 }}
//         loading="lazy"
//         onError={(e) => {
//           console.error("Image failed to load:", media);
//           e.target.src =
//             "https://via.placeholder.com/400x400?text=Image+Not+Available";
//         }}
//       />
//     )}
//     <div
//       className={`absolute top-4 left-4 text-sm font-medium opacity-75 ${
//         isDarkMode ? "bg-gray-800/50 text-white" : "bg-black/50 text-white"
//       } px-2 py-1 rounded`}
//     >
//       GossipHub
//     </div>
//     {isTrending && (
//       <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//         <span className="mr-1">🔥</span> Trending Now
//       </div>
//     )}
//   </div>
// );

// // Component for a Single Comment
// const Comment = ({
//   comment,
//   handleCommentReaction,
//   isCommentReacting,
//   userId,
//   isAuthenticated,
//   isDarkMode,
// }) => {
//   const hasLiked = comment.likes?.includes(userId);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.4 }}
//       className={`mb-5 p-4 rounded-xl shadow-sm border-l-4 border-red-500 ${
//         isDarkMode ? "bg-gray-800" : "bg-gray-50"
//       }`}
//     >
//       <div className="flex items-start gap-3">
//         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
//           {comment.author?.username?.[0]?.toUpperCase() || "A"}
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <p
//               className={`font-semibold text-base ${
//                 isDarkMode ? "text-gray-100" : "text-gray-900"
//               }`}
//             >
//               {comment.author?.username || "Anonymous"}
//             </p>
//             <p
//               className={`text-xs ${
//                 isDarkMode ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               {timeAgo(comment.createdAt)}
//             </p>
//           </div>
//           <p
//             className={`mt-1 leading-relaxed ${
//               isDarkMode ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             {comment.text}
//           </p>
//           <div className="flex items-center gap-3 mt-2">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleCommentReaction(comment._id, "like")}
//               className={`flex items-center gap-1 text-sm ${
//                 hasLiked
//                   ? "text-red-600"
//                   : isDarkMode
//                   ? "text-gray-400"
//                   : "text-gray-600"
//               } ${
//                 isCommentReacting === comment._id
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//               disabled={isCommentReacting === comment._id}
//               aria-label={hasLiked ? "Unlike comment" : "Like comment"}
//             >
//               <motion.span
//                 animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
//                 transition={{ duration: 0.3 }}
//               >
//                 <FaHeart className="h-4 w-4" />
//               </motion.span>
//               {comment.likes?.length || 0}
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Component for Share Bar
// const ShareBar = ({
//   handleNativeShare,
//   handleShareTwitter,
//   handleShareWhatsapp,
//   handleShareFacebook,
//   handleShareTelegram,
//   handleShareLinkedin,
//   handleCopyLink,
//   isCopied,
//   isDarkMode,
// }) => (
//   <motion.div
//     className={`fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center ${
//       isDarkMode ? "bg-gray-900" : "bg-white"
//     } p-2 rounded-full shadow-lg`}
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 1 }}
//   >
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleNativeShare}
//       className={`flex items-center gap-2 px-4 py-2 rounded-full ${
//         isDarkMode
//           ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//           : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//       } transition-colors`}
//       aria-label="Share post"
//     >
//       <FaShareAlt className="text-xl" />
//       <span>Share</span>
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareTwitter}
//       className={`p-2 rounded-full ${
//         isDarkMode
//           ? "bg-gray-800 hover:bg-gray-700"
//           : "bg-gray-200 hover:bg-gray-300"
//       } transition-colors`}
//       aria-label="Share on Twitter"
//     >
//       <FaXTwitter className="text-xl text-black" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareWhatsapp}
//       className={`p-2 rounded-full ${
//         isDarkMode
//           ? "bg-gray-800 hover:bg-gray-700"
//           : "bg-gray-200 hover:bg-gray-300"
//       } transition-colors`}
//       aria-label="Share on WhatsApp"
//     >
//       <FaWhatsapp className="text-xl text-green-500" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareFacebook}
//       className={`p-2 rounded-full ${
//         isDarkMode
//           ? "bg-gray-800 hover:bg-gray-700"
//           : "bg-gray-200 hover:bg-gray-300"
//       } transition-colors`}
//       aria-label="Share on Facebook"
//     >
//       <FaFacebook className="text-xl text-blue-600" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareTelegram}
//       className={`p-2 rounded-full ${
//         isDarkMode
//           ? "bg-gray-800 hover:bg-gray-700"
//           : "bg-gray-200 hover:bg-gray-300"
//       } transition-colors`}
//       aria-label="Share on Telegram"
//     >
//       <FaTelegram className="text-xl text-blue-400" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleShareLinkedin}
//       className={`p-2 rounded-full ${
//         isDarkMode
//           ? "bg-gray-800 hover:bg-gray-700"
//           : "bg-gray-200 hover:bg-gray-300"
//       } transition-colors`}
//       aria-label="Share on LinkedIn"
//     >
//       <FaLinkedin className="text-xl text-blue-700" />
//     </motion.button>
//     <motion.button
//       whileHover={{ scale: 1.15 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleCopyLink}
//       className={`p-2 rounded-full transition-colors ${
//         isCopied
//           ? "bg-green-500 text-white"
//           : isDarkMode
//           ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//           : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//       }`}
//       aria-label={isCopied ? "Link copied" : "Copy link"}
//     >
//       <FaLink className="text-xl" />
//     </motion.button>
//   </motion.div>
// );

// const PostDetails = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [allPosts, setAllPosts] = useState([]);
//   const [comment, setComment] = useState("");
//   const [categories, setCategories] = useState(["All"]);
//   const isAuthenticated = !!localStorage.getItem("token");
//   const [userReaction, setUserReaction] = useState({
//     like: false,
//     love: false,
//     laugh: false,
//     sad: false,
//   });
//   const [isCopied, setIsCopied] = useState(false);
//   const [reactionStreak, setReactionStreak] = useState(0);
//   const [streakRewards, setStreakRewards] = useState([]);
//   const [showMoreRelated, setShowMoreRelated] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [popularComments, setPopularComments] = useState([]);
//   const [relatedPostsCount, setRelatedPostsCount] = useState(5);
//   const [isReacting, setIsReacting] = useState(false);
//   const [isCommentReacting, setIsCommentReacting] = useState(null);
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [reactionBurst, setReactionBurst] = useState(0);
//   const [placeholderText, setPlaceholderText] = useState("");
//   const [isDarkMode, setIsDarkMode] = useState(false); // Added dark mode state
//   const commentsPerPage = 5;
//   const videoRef = useRef(null);
//   const commentInputRef = useRef(null);
//   const commentsSectionRef = useRef(null);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Typing Animation for Placeholder
//   const fullPlaceholder = "Write a comment...";
//   useEffect(() => {
//     let currentText = "";
//     let index = 0;
//     const typingInterval = setInterval(() => {
//       if (index < fullPlaceholder.length) {
//         currentText += fullPlaceholder[index];
//         setPlaceholderText(currentText);
//         index++;
//       } else {
//         clearInterval(typingInterval);
//         setTimeout(() => {
//           setPlaceholderText("");
//           index = 0;
//           currentText = "";
//           setTimeout(() => typingInterval, 1000); // Restart typing after a pause
//         }, 2000);
//       }
//     }, 100);
//     return () => clearInterval(typingInterval);
//   }, []);

//   // Fetch User Profile (for reaction streak)
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!isAuthenticated) return;
//       try {
//         const user = await getUserProfile();
//         setReactionStreak(user.reactionStreak || 0);
//         setStreakRewards(user.streakRewards || []);
//       } catch (err) {
//         toast.error("Failed to fetch user profile");
//       }
//     };
//     fetchUserProfile();
//   }, [isAuthenticated]);

//   // Fetch Posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await getPosts();
//         const foundPost = res.find((p) => p._id === postId);
//         setPost(foundPost);
//         setAllPosts(res);
//         const uniqueCategories = [
//           "All",
//           ...new Set(res.map((post) => post.category || "General")),
//         ];
//         setCategories(uniqueCategories);

//         if (foundPost && isAuthenticated) {
//           const userId = localStorage.getItem("userId");
//           setUserReaction({
//             like: foundPost.likes?.includes(userId) || false,
//             love: foundPost.loves?.includes(userId) || false,
//             laugh: foundPost.laughs?.includes(userId) || false,
//             sad: foundPost.sads?.includes(userId) || false,
//           });

//           const sortedComments = [...(foundPost.comments || [])].sort(
//             (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//           );
//           setPopularComments(sortedComments.slice(0, 2));
//         }
//       } catch (err) {
//         toast.error("Failed to fetch posts");
//       }
//     };
//     fetchPosts();
//   }, [postId, isAuthenticated]);

//   // Reaction Burst Logic
//   const handleReaction = async (type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to add a reaction");
//       return;
//     }

//     if (isReacting) return;
//     setIsReacting(true);

//     try {
//       const userId = localStorage.getItem("userId");
//       const currentReactions = { ...userReaction };
//       const newReactions = { ...userReaction };

//       newReactions[type] = !currentReactions[type];
//       setUserReaction(newReactions);

//       const updatedReactions = await addReaction(postId, { type });

//       setPost((prevPost) => ({
//         ...prevPost,
//         likes: updatedReactions.likes || [],
//         loves: updatedReactions.loves || [],
//         laughs: updatedReactions.laughs || [],
//         sads: updatedReactions.sads || [],
//       }));

//       const user = await getUserProfile();
//       const newStreak = user.reactionStreak || 0;
//       const newRewards = user.streakRewards || [];
//       setReactionStreak(newStreak);
//       setStreakRewards(newRewards);

//       if (newReactions[type]) {
//         toast.success(`Reaction added! Streak: ${newStreak}`);
//         confetti({
//           particleCount: 50,
//           spread: 60,
//           origin: { y: 0.6 },
//           colors: ["#ff0000", "#ff7300", "#fff400"],
//         });

//         // Reaction Burst
//         setReactionBurst((prev) => prev + 1);
//         setTimeout(() => {
//           setReactionBurst((prev) => Math.max(prev - 1, 0));
//         }, 2000);

//         if (reactionBurst >= 2) {
//           confetti({
//             particleCount: 100,
//             spread: 90,
//             origin: { y: 0.5 },
//             shapes: ["circle", "square"],
//             colors: ["#ff0000", "#00ff00", "#0000ff"],
//             scalar: 1.5,
//           });
//           toast.success("Reaction Burst! 🎉 Keep it up!");
//         }

//         if (newRewards.includes("Reaction Streak 5")) {
//           toast.success("🎉 Streak Goal Reached! Badge Earned!");
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }
//       }

//       if (newStreak >= 3 && !showMoreRelated) {
//         setShowMoreRelated(true);
//         toast.success("🎉 More related posts unlocked!");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//       setUserReaction({ like: false, love: false, laugh: false, sad: false });
//     } finally {
//       setIsReacting(false);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       toast.error("Please sign in to comment");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment(postId, { text: comment });
//       const res = await getPosts();
//       const updatedPost = res.find((p) => p._id === postId);
//       setPost(updatedPost);
//       setComment("");
//       setCommentsPage(1);
//       toast.success("Comment added");

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       commentInputRef.current?.focus();
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     }
//   };

//   const handleCommentReaction = async (commentId, type) => {
//     if (!isAuthenticated) {
//       toast.error("Please sign in to react to comments");
//       return;
//     }
//     if (isCommentReacting === commentId) return;
//     setIsCommentReacting(commentId);

//     try {
//       const updatedPost = await addCommentReaction(postId, commentId, { type });
//       setPost(updatedPost);

//       const sortedComments = [...(updatedPost.comments || [])].sort(
//         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//       );
//       setPopularComments(sortedComments.slice(0, 2));

//       const userId = localStorage.getItem("userId");
//       const comment = updatedPost.comments.find((c) => c._id === commentId);
//       const hasLiked = comment.likes?.includes(userId);
//       toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
//     } catch (err) {
//       toast.error(err.message || "Failed to react to comment");
//     } finally {
//       setIsCommentReacting(null);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   // Infinite Scroll for Comments and Related Posts
//   const handleScroll = useCallback(
//     debounce(() => {
//       const commentsSection = commentsSectionRef.current;
//       if (commentsSection) {
//         const { scrollTop, scrollHeight, clientHeight } = commentsSection;
//         if (scrollTop + clientHeight >= scrollHeight - 100) {
//           if (
//             post.comments?.length >
//             commentsPage * commentsPerPage + popularComments.length
//           ) {
//             setCommentsPage((prev) => prev + 1);
//           }
//         }
//       }
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 100
//       ) {
//         setRelatedPostsCount((prev) => prev + 5);
//       }
//     }, 200),
//     [post?.comments?.length, commentsPage, popularComments.length]
//   );

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     const commentsSection = commentsSectionRef.current;
//     if (commentsSection) {
//       commentsSection.addEventListener("scroll", handleScroll);
//     }
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       if (commentsSection) {
//         commentsSection.removeEventListener("scroll", handleScroll);
//       }
//       handleScroll.cancel();
//     };
//   }, [handleScroll]);

//   // Scroll to Comment Input
//   const scrollToCommentInput = () => {
//     commentInputRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//     commentInputRef.current?.focus();
//   };

//   // Calculate Reaction Analytics
//   const reactionAnalytics = () => {
//     const totalReactions =
//       (post?.likes?.length || 0) +
//       (post?.loves?.length || 0) +
//       (post?.laughs?.length || 0) +
//       (post?.sads?.length || 0);
//     if (totalReactions === 0) return null;

//     const likePercent = ((post?.likes?.length || 0) / totalReactions) * 100;
//     const lovePercent = ((post?.loves?.length || 0) / totalReactions) * 100;
//     const laughPercent = ((post?.laughs?.length || 0) / totalReactions) * 100;
//     const sadPercent = ((post?.sads?.length || 0) / totalReactions) * 100;

//     return {
//       likePercent,
//       lovePercent,
//       laughPercent,
//       sadPercent,
//       totalReactions,
//     };
//   };

//   const analytics = reactionAnalytics();

//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";
//   const seoTitle =
//     postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
//   const postDescription = post?.description || "";
//   const seoDescription =
//     postDescription.length > 160
//       ? `${postDescription.slice(0, 157)}...`
//       : postDescription;
//   const postMedia = post?.media || "";
//   const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
//   const videoThumbnail = isVideo
//     ? `${postMedia.replace(/\.(mp4|webm|ogg)$/i, "-thumbnail.jpg")}`
//     : postMedia;
//   const keywords = post?.category
//     ? `${post.category}, ${postTitle.split(" ").slice(0, 3).join(", ")}`
//     : "GossipHub, Social Media, News";
//   const authorName = post?.isAnonymous
//     ? "Anonymous"
//     : post?.author?.username || "Unknown";
//   const datePublished = post?.createdAt
//     ? new Date(post.createdAt).toISOString()
//     : new Date().toISOString();
//   const publisherName = "GossipHub";

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: seoTitle,
//     description: seoDescription,
//     author: { "@type": "Person", name: authorName },
//     datePublished: datePublished,
//     image: postMedia || "https://gossipphub.netlify.app/default-image.jpg",
//     publisher: {
//       "@type": "Organization",
//       name: publisherName,
//       logo: {
//         "@type": "ImageObject",
//         url: "https://gossipphub.netlify.app/logo.png",
//       },
//     },
//     mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
//   };

//   // Share Functions
//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         const shareData = {
//           title: postTitle,
//           text: `${postTitle}\n${postDescription.slice(0, 100)}...`,
//           url: postUrl,
//         };

//         if (postMedia && !isVideo) {
//           try {
//             const response = await fetch(postMedia);
//             const blob = await response.blob();
//             const file = new File([blob], "shared-image.jpg", {
//               type: "image/jpeg",
//             });
//             shareData.files = [file];
//           } catch (err) {
//             console.error("Failed to fetch image for sharing:", err);
//             delete shareData.files;
//           }
//         }

//         await navigator.share(shareData);
//         toast.success("Shared successfully!");
//       } catch (err) {
//         console.error("Share error:", err);
//         try {
//           await navigator.share({
//             title: postTitle,
//             text: `${postTitle}\n${postDescription.slice(
//               0,
//               100
//             )}...\n${postUrl}`,
//             url: postUrl,
//           });
//           toast.success("Shared successfully (without image)!");
//         } catch (fallbackErr) {
//           toast.error("Failed to share post");
//           console.error("Fallback share error:", fallbackErr);
//         }
//       }
//     } else {
//       toast.info("Native sharing not supported. Use the share options below.");
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard
//       .writeText(postUrl)
//       .then(() => {
//         setIsCopied(true);
//         toast.success("Link copied to clipboard!");
//         setTimeout(() => setIsCopied(false), 2000);
//       })
//       .catch(() => {
//         toast.error("Failed to copy link");
//       });
//   };

//   const handleShareTwitter = () => {
//     const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(twitterUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareWhatsapp = () => {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       `${postTitle}\n${postUrl}`
//     )}`;
//     window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       postUrl
//     )}&t=${encodeURIComponent(postTitle)}`;
//     window.open(facebookUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareTelegram = () => {
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
//       postUrl
//     )}&text=${encodeURIComponent(postTitle)}`;
//     window.open(telegramUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareLinkedin = () => {
//     const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
//       postUrl
//     )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
//       postDescription.slice(0, 200) + "..."
//     )}`;
//     window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//   };

//   if (!post) {
//     return (
//       <div
//         className={`flex flex-col gap-4 max-w-7xl mx-auto px-4 pt-20 pb-12 ${
//           isDarkMode ? "bg-gray-950" : "bg-gray-100"
//         }`}
//       >
//         <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         <div
//           className={`p-6 shadow-lg rounded-lg ${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           }`}
//         >
//           <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
//           <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-4"></div>
//           <div className="space-y-2">
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const latestStories = allPosts
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);
//   const mostViewedPosts = allPosts
//     .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
//     .slice(0, 5);
//   const relatedPosts = allPosts
//     .filter((p) => p.category === post.category && p._id !== post._id)
//     .slice(0, showMoreRelated ? relatedPostsCount : 5);

//   const currentIndex = allPosts.findIndex((p) => p._id === postId);
//   const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
//   const nextPost =
//     currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

//   const isTrending =
//     (post.likes?.length || 0) +
//       (post.loves?.length || 0) +
//       (post.laughs?.length || 0) +
//       (post.sads?.length || 0) +
//       (post.comments?.length || 0) >
//     50;

//   const paginatedComments = post.comments
//     ?.filter((c) => !popularComments.find((pc) => pc._id === c._id))
//     .slice()
//     .reverse()
//     .slice(0, commentsPage * commentsPerPage);

//   const userId = localStorage.getItem("userId");

//   return (
//     <motion.div
//       className={`min-h-screen font-poppins ${
//         isDarkMode ? "bg-gray-950" : "bg-gray-100"
//       } transition-colors duration-500`}
//     >
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>{seoTitle}</title>
//         <meta name="description" content={seoDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content={authorName} />
//         <meta name="publisher" content={publisherName} />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href={postUrl} />
//         <meta property="og:title" content={postTitle} />
//         <meta property="og:description" content={postDescription} />
//         <meta property="og:url" content={postUrl} />
//         <meta property="og:type" content="article" />
//         {isVideo && <meta property="og:video" content={postMedia} />}
//         {isVideo && <meta property="og:video:type" content="video/mp4" />}
//         {isVideo && <meta property="og:image" content={videoThumbnail} />}
//         {!isVideo && postMedia && (
//           <meta property="og:image" content={postMedia} />
//         )}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={postTitle} />
//         <meta name="twitter:description" content={postDescription} />
//         <meta
//           name="twitter:image"
//           content={isVideo ? videoThumbnail : postMedia}
//         />
//         <script type="application/ld+json">
//           {JSON.stringify(structuredData)}
//         </script>
//       </Helmet>

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to home"
//           >
//             <HiArrowLeft className="w-6 h-6" />
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
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           {/* Post Media */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {postMedia ? (
//               <PostMedia
//                 media={postMedia}
//                 isVideo={isVideo}
//                 isMuted={isMuted}
//                 toggleMute={toggleMute}
//                 videoRef={videoRef}
//                 isTrending={isTrending}
//                 isDarkMode={isDarkMode}
//               />
//             ) : (
//               <div
//                 className={`w-full aspect-video flex items-center justify-center rounded-t-lg shadow-xl ${
//                   isDarkMode ? "bg-gray-800" : "bg-gray-200"
//                 }`}
//               >
//                 <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
//                   No media available
//                 </p>
//               </div>
//             )}
//             <div
//               className={`mt-0 shadow-lg rounded-b-lg ${
//                 isDarkMode ? "bg-gray-900" : "bg-white"
//               } p-6 transition-colors duration-500`}
//             >
//               <h1
//                 className={`text-2xl sm:text-3xl font-bold mb-2 ${
//                   isDarkMode ? "text-gray-100" : "text-gray-900"
//                 }`}
//               >
//                 {post.title}
//               </h1>
//               <p
//                 className={`text-sm mb-4 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               >
//                 Posted by:{" "}
//                 {post.isAnonymous ? (
//                   "Anonymous"
//                 ) : (
//                   <Link
//                     to={`/profile/${post.author._id}`}
//                     className={
//                       isDarkMode
//                         ? "text-indigo-400 hover:text-indigo-300"
//                         : "text-indigo-600 hover:text-indigo-700"
//                     }
//                     aria-label={`View ${post.author.username}'s profile`}
//                   >
//                     {post.author?.username || "Unknown"}
//                   </Link>
//                 )}
//                 {" • "}
//                 {timeAgo(post.createdAt)}
//                 {" • "}
//                 {estimateReadTime(post.description)}
//               </p>
//               <div
//                 className={`text-base mb-6 leading-relaxed post-description ${
//                   isDarkMode ? "text-gray-300" : "text-gray-700"
//                 }`}
//                 role="region"
//                 aria-label="Post description"
//               >
//                 {post.description?.split("\n\n").map((paragraph, pIdx) => (
//                   <motion.div
//                     key={pIdx}
//                     className="mb-4 last:mb-0"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5 }}
//                     dangerouslySetInnerHTML={{ __html: paragraph }}
//                   />
//                 ))}
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {(post.category ? [post.category] : []).map((tag, index) => (
//                   <span
//                     key={index}
//                     className={`px-3 py-1 text-xs font-medium ${
//                       isDarkMode
//                         ? "text-gray-300 bg-gray-800"
//                         : "text-gray-700 bg-gray-200"
//                     } rounded-full`}
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               {/* Reaction Streak */}
//               {isAuthenticated && (
//                 <motion.div
//                   className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-2 flex items-center">
//                     <span className="mr-2">🔥</span> Reaction Streak
//                   </h3>
//                   <p className="text-sm">
//                     React to 5 posts to earn a badge! Current Streak:{" "}
//                     {reactionStreak}/5
//                   </p>
//                   <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
//                     <motion.div
//                       className="bg-white h-2.5 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{
//                         width: `${Math.min((reactionStreak / 5) * 100, 100)}%`,
//                       }}
//                       transition={{ duration: 1 }}
//                     />
//                   </div>
//                   {streakRewards.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium">Rewards Earned:</p>
//                       <div className="flex gap-2 mt-1">
//                         {streakRewards.map((reward, idx) => (
//                           <motion.span
//                             key={idx}
//                             className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: idx * 0.2 }}
//                           >
//                             {reward}
//                           </motion.span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* Reaction Analytics */}
//               {analytics && (
//                 <motion.div
//                   className={`mb-6 p-4 rounded-lg shadow-md ${
//                     isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                   }`}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h3
//                     className={`text-lg font-semibold mb-2 flex items-center ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     }`}
//                   >
//                     <span className="mr-2">📊</span> Reaction Analytics
//                   </h3>
//                   <p
//                     className={`text-sm ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Total Reactions: {analytics.totalReactions}
//                   </p>
//                   <div className="space-y-2 mt-2">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         }`}
//                       >
//                         👍 Likes: {analytics.likePercent.toFixed(1)}%
//                       </span>
//                       <div
//                         className={`w-full rounded-full h-2 ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                         }`}
//                       >
//                         <motion.div
//                           className="bg-blue-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.likePercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         }`}
//                       >
//                         💖 Loves: {analytics.lovePercent.toFixed(1)}%
//                       </span>
//                       <div
//                         className={`w-full rounded-full h-2 ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                         }`}
//                       >
//                         <motion.div
//                           className="bg-pink-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.lovePercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         }`}
//                       >
//                         😂 Laughs: {analytics.laughPercent.toFixed(1)}%
//                       </span>
//                       <div
//                         className={`w-full rounded-full h-2 ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                         }`}
//                       >
//                         <motion.div
//                           className="bg-yellow-500 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.laughPercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         }`}
//                       >
//                         😢 Sads: {analytics.sadPercent.toFixed(1)}%
//                       </span>
//                       <div
//                         className={`w-full rounded-full h-2 ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                         }`}
//                       >
//                         <motion.div
//                           className="bg-blue-600 h-2 rounded-full"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${analytics.sadPercent}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Reactions */}
//               <div className="flex gap-3 mb-8 flex-wrap">
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("like")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.like
//                       ? "bg-red-600 text-white"
//                       : isDarkMode
//                       ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Like post (${post.likes?.length || 0} likes)${
//                     userReaction.like ? " (You liked this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     👍
//                   </motion.span>
//                   ({post.likes?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("love")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.love
//                       ? "bg-pink-600 text-white"
//                       : isDarkMode
//                       ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Love post (${post.loves?.length || 0} loves)${
//                     userReaction.love ? " (You loved this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     💖
//                   </motion.span>
//                   ({post.loves?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("laugh")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.laugh
//                       ? "bg-yellow-500 text-white"
//                       : isDarkMode
//                       ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Laugh at post (${
//                     post.laughs?.length || 0
//                   } laughs)${
//                     userReaction.laugh ? " (You laughed at this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😂
//                   </motion.span>
//                   ({post.laughs?.length || 0})
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("sad")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
//                     userReaction.sad
//                       ? "bg-blue-600 text-white"
//                       : isDarkMode
//                       ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                       : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                   } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                   disabled={!isAuthenticated || isReacting}
//                   aria-label={`Sad reaction (${post.sads?.length || 0} sads)${
//                     userReaction.sad ? " (You felt sad about this)" : ""
//                   }`}
//                 >
//                   <motion.span
//                     className="text-xl"
//                     animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
//                     transition={{ duration: 0.3 }}
//                   >
//                     😢
//                   </motion.span>
//                   ({post.sads?.length || 0})
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Comments Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className={`mt-0 rounded-lg p-6 shadow-lg ${
//               isDarkMode ? "bg-gray-900" : "bg-white"
//             } transition-colors duration-500`}
//           >
//             <h3
//               className={`text-xl font-bold mb-6 ${
//                 isDarkMode ? "text-gray-100" : "text-gray-900"
//               }`}
//             >
//               Comments ({post.comments?.length || 0})
//             </h3>
//             <form
//               onSubmit={handleCommentSubmit}
//               className="mb-8 sticky top-20 z-10 md:static"
//             >
//               <textarea
//                 ref={commentInputRef}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder={placeholderText || fullPlaceholder}
//                 className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 shadow-sm transition-all duration-300 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400"
//                     : "bg-gray-100 text-gray-900 border-gray-200 placeholder-gray-500"
//                 }`}
//                 aria-label="Comment input"
//                 disabled={!isAuthenticated}
//               />
//               <div className="flex justify-between items-center mt-3">
//                 {isAuthenticated ? (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                     aria-label="Submit comment"
//                   >
//                     Post
//                   </motion.button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className={
//                       isDarkMode
//                         ? "text-sm text-red-400 hover:underline"
//                         : "text-sm text-red-600 hover:underline"
//                     }
//                   >
//                     Sign in to comment
//                   </Link>
//                 )}
//               </div>
//             </form>

//             <div
//               ref={commentsSectionRef}
//               className="max-h-[50vh] overflow-y-auto scrollbar-hide"
//             >
//               {popularComments.length > 0 && (
//                 <div className="mb-8">
//                   <h4
//                     className={`text-lg font-semibold mb-4 flex items-center ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     }`}
//                   >
//                     <span className="mr-2">🌟</span> Popular Comments
//                   </h4>
//                   <AnimatePresence>
//                     {popularComments.map((c) => (
//                       <Comment
//                         key={c._id}
//                         comment={{ ...c, isPopular: true }}
//                         handleCommentReaction={handleCommentReaction}
//                         isCommentReacting={isCommentReacting}
//                         userId={userId}
//                         isAuthenticated={isAuthenticated}
//                         isDarkMode={isDarkMode}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}

//               <AnimatePresence>
//                 {post.comments?.length === 0 ? (
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className={`text-center italic ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   >
//                     No comments yet. Be the first to comment!
//                   </motion.p>
//                 ) : (
//                   paginatedComments.map((c) => (
//                     <Comment
//                       key={c._id}
//                       comment={{ ...c, isPopular: false }}
//                       handleCommentReaction={handleCommentReaction}
//                       isCommentReacting={isCommentReacting}
//                       userId={userId}
//                       isAuthenticated={isAuthenticated}
//                       isDarkMode={isDarkMode}
//                     />
//                   ))
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>

//           {/* Next/Previous Post Navigation */}
//           <motion.div
//             className="mt-6 flex justify-between gap-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             {prevPost && (
//               <Link
//                 to={`/posts/${prevPost._id}`}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                     : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                 }`}
//               >
//                 <HiArrowLeft className="h-5 w-5" />
//                 Previous Post
//               </Link>
//             )}
//             {nextPost && (
//               <Link
//                 to={`/posts/${nextPost._id}`}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ml-auto ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                     : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                 }`}
//               >
//                 Next Post
//                 <HiArrowRight className="h-5 w-5" />
//               </Link>
//             )}
//           </motion.div>

//           {/* Related Posts */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             className={`mt-6 rounded-lg p-6 shadow-lg ${
//               isDarkMode ? "bg-gray-900" : "bg-white"
//             } transition-colors duration-500`}
//           >
//             <h3
//               className={`text-xl font-bold mb-6 ${
//                 isDarkMode ? "text-gray-100" : "text-gray-900"
//               }`}
//             >
//               Related Posts
//             </h3>
//             <AnimatePresence>
//               {relatedPosts.length === 0 ? (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className={`text-center ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   }`}
//                 >
//                   No related posts found in this category.
//                 </motion.p>
//               ) : (
//                 <div className="space-y-4">
//                   {relatedPosts.map((story, index) => (
//                     <motion.div
//                       key={story._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.5, delay: index * 0.1 }}
//                     >
//                       <Link to={`/posts/${story._id}`} className="flex gap-3">
//                         {story.media &&
//                           (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                             <video
//                               src={story.media}
//                               className="w-16 h-16 object-cover rounded"
//                               muted
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ) : (
//                             <img
//                               src={story.media}
//                               alt="Related post thumbnail"
//                               className="w-16 h-16 object-cover rounded"
//                               loading="lazy"
//                               onError={(e) =>
//                                 (e.target.src =
//                                   "https://via.placeholder.com/50")
//                               }
//                             />
//                           ))}
//                         <div>
//                           <p
//                             className={`text-sm font-medium hover:text-red-600 ${
//                               isDarkMode ? "text-gray-100" : "text-gray-900"
//                             }`}
//                           >
//                             {story.title}
//                           </p>
//                           <p
//                             className={`text-xs ${
//                               isDarkMode ? "text-gray-400" : "text-gray-500"
//                             }`}
//                           >
//                             {story.category || "General"}
//                           </p>
//                         </div>
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
//           <motion.div
//             className={`rounded-lg p-4 shadow-lg ${
//               isDarkMode ? "bg-gray-900" : "bg-white"
//             } transition-colors duration-500`}
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h3
//               className={`text-lg font-bold mb-4 ${
//                 isDarkMode ? "text-gray-100" : "text-gray-900"
//               }`}
//             >
//               Latest Stories
//             </h3>
//             <div className="space-y-4">
//               {latestStories.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           loading="lazy"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p
//                         className={`text-sm font-medium hover:text-red-600 ${
//                           isDarkMode ? "text-gray-100" : "text-gray-900"
//                         }`}
//                       >
//                         {story.title}
//                       </p>
//                       <p
//                         className={`text-xs ${
//                           isDarkMode ? "text-gray-400" : "text-gray-500"
//                         }`}
//                       >
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             className={`rounded-lg p-4 shadow-lg ${
//               isDarkMode ? "bg-gray-900" : "bg-white"
//             } transition-colors duration-500`}
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <h3
//               className={`text-lg font-bold mb-4 ${
//                 isDarkMode ? "text-gray-100" : "text-gray-900"
//               }`}
//             >
//               Most Viewed
//             </h3>
//             <div className="space-y-4">
//               {mostViewedPosts.map((story, index) => (
//                 <motion.div
//                   key={story._id}
//                   initial={{ opacity: 0, x: 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link to={`/posts/${story._id}`} className="flex gap-3">
//                     {story.media &&
//                       (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                         <video
//                           src={story.media}
//                           className="w-16 h-16 object-cover rounded"
//                           muted
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ) : (
//                         <img
//                           src={story.media}
//                           alt="Story thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                           loading="lazy"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/50")
//                           }
//                         />
//                       ))}
//                     <div>
//                       <p
//                         className={`text-sm font-medium hover:text-red-600 ${
//                           isDarkMode ? "text-gray-100" : "text-gray-900"
//                         }`}
//                       >
//                         {story.title}
//                       </p>
//                       <p
//                         className={`text-xs ${
//                           isDarkMode ? "text-gray-400" : "text-gray-500"
//                         }`}
//                       >
//                         {story.category || "General"}
//                       </p>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Floating Action Button for Commenting */}
//       {isAuthenticated && (
//         <motion.button
//           onClick={scrollToCommentInput}
//           className="fixed lg:bottom-20 bottom-4 right-6 z-50 p-2 bg-red-600 text-white rounded-full shadow-lg"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           aria-label="Add a comment"
//         >
//           <FaComment className="h-6 w-6" />
//         </motion.button>
//       )}

//       <ShareBar
//         handleNativeShare={handleNativeShare}
//         handleShareTwitter={handleShareTwitter}
//         handleShareWhatsapp={handleShareWhatsapp}
//         handleShareFacebook={handleShareFacebook}
//         handleShareTelegram={handleShareTelegram}
//         handleShareLinkedin={handleShareLinkedin}
//         handleCopyLink={handleCopyLink}
//         isCopied={isCopied}
//         isDarkMode={isDarkMode}
//       />

//       <footer className="bg-red-600 text-white py-6">
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
//           <p className="text-sm">© 2025 GossippHub. All rights reserved.</p>
//         </div>
//       </footer>

//       <style>
//         {`
//           .post-description iframe,
//           .post-description video {
//             width: 100% !important;
//             height: 400px !important;
//             max-width: 100%;
//             border-radius: 8px;
//             margin-bottom: 1rem;
//           }
//           @media (min-width: 640px) {
//             .post-description iframe,
//             .post-description video {
//               height: 500px !important;
//             }
//           }
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}
//       </style>
//     </motion.div>
//   );
// };

// export default PostDetails;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPosts,
  addReaction,
  addComment,
  addCommentReaction,
  getUserProfile,
} from "../utils/api";
import {
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaLink,
  FaTelegram,
  FaLinkedin,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  HiArrowLeft,
  HiArrowRight,
  HiVolumeUp,
  HiVolumeOff,
} from "react-icons/hi";
import { Helmet } from "react-helmet";
import confetti from "canvas-confetti";
import debounce from "lodash/debounce";
import { franc } from "franc";

// Utility function to calculate time difference and return "time ago" format
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 0 || diffInSeconds < 10) return "Just now";
  if (diffInSeconds < 60)
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
};

// Utility to estimate read time (assuming 200 words per minute)
const estimateReadTime = (text) => {
  const words = text?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / 200);
  return minutes === 0 ? "Less than a minute" : `${minutes} min read`;
};

// Component for Post Media with Blur-Up Effect
const PostMedia = ({
  media,
  isVideo,
  isMuted,
  toggleMute,
  videoRef,
  isTrending,
  isDarkMode,
}) => (
  <div className="relative rounded-t-lg overflow-hidden shadow-xl">
    {isVideo ? (
      <div className="relative">
        <video
          ref={videoRef}
          src={media}
          controls
          muted={isMuted}
          className={`w-full aspect-video object-contain ${
            isDarkMode ? "bg-black" : "bg-gray-200"
          }`}
          aria-label="Post video"
          onError={(e) => {
            console.error("Video failed to load:", media);
            e.target.src =
              "https://via.placeholder.com/400x400?text=Video+Not+Available";
          }}
        />
        <button
          onClick={toggleMute}
          className={`absolute bottom-4 right-4 p-2 rounded-full ${
            isDarkMode ? "bg-gray-800/50 text-white" : "bg-black/50 text-white"
          }`}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <HiVolumeOff className="h-6 w-6" />
          ) : (
            <HiVolumeUp className="h-6 w-6" />
          )}
        </button>
      </div>
    ) : (
      <motion.img
        src={media}
        alt="Post media"
        className="w-full aspect-video object-contain"
        initial={{ filter: "blur(10px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        loading="lazy"
        onError={(e) => {
          console.error("Image failed to load:", media);
          e.target.src =
            "https://via.placeholder.com/400x400?text=Image+Not+Available";
        }}
      />
    )}
    <div
      className={`absolute top-4 left-4 text-sm font-medium opacity-75 ${
        isDarkMode ? "bg-gray-800/50 text-white" : "bg-black/50 text-white"
      } px-2 py-1 rounded`}
    >
      GossipHub
    </div>
    {isTrending && (
      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
        <span className="mr-1">🔥</span> Trending Now
      </div>
    )}
  </div>
);

// Component for a Single Comment
const Comment = ({
  comment,
  handleCommentReaction,
  isCommentReacting,
  userId,
  isAuthenticated,
  isDarkMode,
}) => {
  const hasLiked = comment.likes?.includes(userId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className={`mb-5 p-4 rounded-xl shadow-sm border-l-4 border-red-500 ${
        isDarkMode ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
          {comment.author?.username?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p
              className={`font-semibold text-base ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {comment.author?.username || "Anonymous"}
            </p>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {timeAgo(comment.createdAt)}
            </p>
          </div>
          <p
            className={`mt-1 leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {comment.text}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCommentReaction(comment._id, "like")}
              className={`flex items-center gap-1 text-sm ${
                hasLiked
                  ? "text-red-600"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              } ${
                isCommentReacting === comment._id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={isCommentReacting === comment._id}
              aria-label={hasLiked ? "Unlike comment" : "Like comment"}
            >
              <motion.span
                animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <FaHeart className="h-4 w-4" />
              </motion.span>
              {comment.likes?.length || 0}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Component for Share Bar
const ShareBar = ({
  handleNativeShare,
  handleShareTwitter,
  handleShareWhatsapp,
  handleShareFacebook,
  handleShareTelegram,
  handleShareLinkedin,
  handleCopyLink,
  isCopied,
  isDarkMode,
}) => (
  <motion.div
    className={`fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center ${
      isDarkMode ? "bg-gray-900" : "bg-white"
    } p-2 rounded-full shadow-lg`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
  >
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleNativeShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isDarkMode
          ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
      } transition-colors`}
      aria-label="Share post"
    >
      <FaShareAlt className="text-xl" />
      <span>Share</span>
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleShareTwitter}
      className={`p-2 rounded-full ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-200 hover:bg-gray-300"
      } transition-colors`}
      aria-label="Share on Twitter"
    >
      <FaXTwitter className="text-xl text-black" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleShareWhatsapp}
      className={`p-2 rounded-full ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-200 hover:bg-gray-300"
      } transition-colors`}
      aria-label="Share on WhatsApp"
    >
      <FaWhatsapp className="text-xl text-green-500" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleShareFacebook}
      className={`p-2 rounded-full ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-200 hover:bg-gray-300"
      } transition-colors`}
      aria-label="Share on Facebook"
    >
      <FaFacebook className="text-xl text-blue-600" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleShareTelegram}
      className={`p-2 rounded-full ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-200 hover:bg-gray-300"
      } transition-colors`}
      aria-label="Share on Telegram"
    >
      <FaTelegram className="text-xl text-blue-400" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleShareLinkedin}
      className={`p-2 rounded-full ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-200 hover:bg-gray-300"
      } transition-colors`}
      aria-label="Share on LinkedIn"
    >
      <FaLinkedin className="text-xl text-blue-700" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleCopyLink}
      className={`p-2 rounded-full transition-colors ${
        isCopied
          ? "bg-green-500 text-white"
          : isDarkMode
          ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
      }`}
      aria-label={isCopied ? "Link copied" : "Copy link"}
    >
      <FaLink className="text-xl" />
    </motion.button>
  </motion.div>
);

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const isAuthenticated = !!localStorage.getItem("token");
  const [userReaction, setUserReaction] = useState({
    like: false,
    love: false,
    laugh: false,
    sad: false,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [reactionStreak, setReactionStreak] = useState(0);
  const [streakRewards, setStreakRewards] = useState([]);
  const [showMoreRelated, setShowMoreRelated] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [popularComments, setPopularComments] = useState([]);
  const [relatedPostsCount, setRelatedPostsCount] = useState(5);
  const [isReacting, setIsReacting] = useState(false);
  const [isCommentReacting, setIsCommentReacting] = useState(null);
  const [commentsPage, setCommentsPage] = useState(1);
  const [reactionBurst, setReactionBurst] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const commentsPerPage = 5;
  const videoRef = useRef(null);
  const commentInputRef = useRef(null);
  const commentsSectionRef = useRef(null);

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Typing Animation for Placeholder
  const fullPlaceholder = "Write a comment...";
  useEffect(() => {
    let currentText = "";
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullPlaceholder.length) {
        currentText += fullPlaceholder[index];
        setPlaceholderText(currentText);
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setPlaceholderText("");
          index = 0;
          currentText = "";
          setTimeout(() => typingInterval, 1000);
        }, 2000);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  // Fetch User Profile (for reaction streak)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      try {
        const user = await getUserProfile();
        setReactionStreak(user.reactionStreak || 0);
        setStreakRewards(user.streakRewards || []);
      } catch (err) {
        toast.error("Failed to fetch user profile");
      }
    };
    fetchUserProfile();
  }, [isAuthenticated]);

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        const foundPost = res.find((p) => p._id === postId);
        setPost(foundPost);
        setAllPosts(res);
        const uniqueCategories = [
          "All",
          ...new Set(res.map((post) => post.category || "General")),
        ];
        setCategories(uniqueCategories);

        if (foundPost && isAuthenticated) {
          const userId = localStorage.getItem("userId");
          setUserReaction({
            like: foundPost.likes?.includes(userId) || false,
            love: foundPost.loves?.includes(userId) || false,
            laugh: foundPost.laughs?.includes(userId) || false,
            sad: foundPost.sads?.includes(userId) || false,
          });

          const sortedComments = [...(foundPost.comments || [])].sort(
            (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
          );
          setPopularComments(sortedComments.slice(0, 2));
        }
      } catch (err) {
        toast.error("Failed to fetch posts");
      }
    };
    fetchPosts();
  }, [postId, isAuthenticated]);

  // Load available voices for speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
      // Log available voices for debugging
      console.log(
        "Available voices:",
        voices.map((v) => ({ name: v.name, lang: v.lang }))
      );
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  // Function to detect language and map to BCP 47 language code
  const detectLanguage = (text) => {
    const langCode = franc(text, { minLength: 10 });
    const langMap = {
      eng: "en-US",
      tel: "te-IN",
      hin: "hi-IN",
      tam: "ta-IN",
      kan: "kn-IN",
      mal: "ml-IN",
      ben: "bn-IN",
      mar: "mr-IN",
      guj: "gu-IN",
      pan: "pa-IN",
      urd: "ur-IN",
    };
    const detectedLang = langMap[langCode] || "en-US";
    console.log(`Detected language: ${langCode}, Mapped to: ${detectedLang}`);
    return detectedLang;
  };

  // Function to select a voice matching the language
  const selectVoiceForLanguage = (lang) => {
    // Normalize the language code for matching (e.g., "te-IN" -> "te")
    const langPrefix = lang.split("-")[0].toLowerCase();
    let matchingVoice = availableVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith(langPrefix)
    );

    if (!matchingVoice) {
      // Try a broader match (e.g., "te" might match "te-IN" or "te-US")
      matchingVoice = availableVoices.find((voice) =>
        voice.lang.toLowerCase().includes(langPrefix)
      );
    }

    if (!matchingVoice) {
      console.warn(
        `No voice found for language ${lang}. Falling back to default voice (en-US).`
      );
      // Fallback to English voice
      matchingVoice = availableVoices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );
      if (matchingVoice) {
        toast.warn(
          `Voice for ${lang} not available. Using English voice instead.`
        );
      } else {
        console.error("No English voice available as fallback.");
      }
    } else {
      console.log(
        `Selected voice for ${lang}: ${matchingVoice.name} (${matchingVoice.lang})`
      );
    }

    return matchingVoice || null;
  };

  // Audio Narration Logic with Language Detection
  const toggleAudioNarration = () => {
    const synth = window.speechSynthesis;

    if (isAudioPlaying) {
      // Pause the audio
      setIsPausedByUser(true);
      synth.cancel();
      setIsAudioPlaying(false);
    } else {
      // Start the audio
      if (post?.description) {
        const cleanDescription = post.description.replace(/<[^>]+>/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanDescription);

        const detectedLang = detectLanguage(cleanDescription);
        utterance.lang = detectedLang;

        const matchingVoice = selectVoiceForLanguage(detectedLang);
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        } else {
          console.error(
            `No voice available for ${detectedLang}. Narration may fail.`
          );
          toast.error(
            "No suitable voice available for narration. Please try a different browser or device."
          );
          return;
        }

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          setIsAudioPlaying(false);
          setIsPausedByUser(false);
        };

        utterance.onerror = (event) => {
          if (!isPausedByUser) {
            console.error("Speech synthesis error:", event);
            toast.error("Failed to play audio narration");
          }
          setIsAudioPlaying(false);
          setIsPausedByUser(false);
        };

        synth.speak(utterance);
        setIsAudioPlaying(true);
        setIsPausedByUser(false);
      } else {
        toast.error("No description available to narrate");
      }
    }
  };

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      setIsPausedByUser(false);
    };
  }, []);

  // Reaction Burst Logic
  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add a reaction");
      return;
    }

    if (isReacting) return;
    setIsReacting(true);

    try {
      const userId = localStorage.getItem("userId");
      const currentReactions = { ...userReaction };
      const newReactions = { ...userReaction };

      newReactions[type] = !currentReactions[type];
      setUserReaction(newReactions);

      const updatedReactions = await addReaction(postId, { type });

      setPost((prevPost) => ({
        ...prevPost,
        likes: updatedReactions.likes || [],
        loves: updatedReactions.loves || [],
        laughs: updatedReactions.laughs || [],
        sads: updatedReactions.sads || [],
      }));

      const user = await getUserProfile();
      const newStreak = user.reactionStreak || 0;
      const newRewards = user.streakRewards || [];
      setReactionStreak(newStreak);
      setStreakRewards(newRewards);

      if (newReactions[type]) {
        toast.success(`Reaction added! Streak: ${newStreak}`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#ff0000", "#ff7300", "#fff400"],
        });

        setReactionBurst((prev) => prev + 1);
        setTimeout(() => {
          setReactionBurst((prev) => Math.max(prev - 1, 0));
        }, 2000);

        if (reactionBurst >= 2) {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            shapes: ["circle", "square"],
            colors: ["#ff0000", "#00ff00", "#0000ff"],
            scalar: 1.5,
          });
          toast.success("Reaction Burst! 🎉 Keep it up!");
        }

        if (newRewards.includes("Reaction Streak 5")) {
          toast.success("🎉 Streak Goal Reached! Badge Earned!");
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }

      if (newStreak >= 3 && !showMoreRelated) {
        setShowMoreRelated(true);
        toast.success("🎉 More related posts unlocked!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to add reaction");
      setUserReaction({ like: false, love: false, laugh: false, sad: false });
    } finally {
      setIsReacting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await addComment(postId, { text: comment });
      const res = await getPosts();
      const updatedPost = res.find((p) => p._id === postId);
      setPost(updatedPost);
      setComment("");
      setCommentsPage(1);
      toast.success("Comment added");

      const sortedComments = [...(updatedPost.comments || [])].sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
      setPopularComments(sortedComments.slice(0, 2));

      commentInputRef.current?.focus();
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  const handleCommentReaction = async (commentId, type) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to react to comments");
      return;
    }
    if (isCommentReacting === commentId) return;
    setIsCommentReacting(commentId);

    try {
      const updatedPost = await addCommentReaction(postId, commentId, { type });
      setPost(updatedPost);

      const sortedComments = [...(updatedPost.comments || [])].sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
      setPopularComments(sortedComments.slice(0, 2));

      const userId = localStorage.getItem("userId");
      const comment = updatedPost.comments.find((c) => c._id === commentId);
      const hasLiked = comment.likes?.includes(userId);
      toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
    } catch (err) {
      toast.error(err.message || "Failed to react to comment");
    } finally {
      setIsCommentReacting(null);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleScroll = useCallback(
    debounce(() => {
      const commentsSection = commentsSectionRef.current;
      if (commentsSection) {
        const { scrollTop, scrollHeight, clientHeight } = commentsSection;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          if (
            post.comments?.length >
            commentsPage * commentsPerPage + popularComments.length
          ) {
            setCommentsPage((prev) => prev + 1);
          }
        }
      }
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setRelatedPostsCount((prev) => prev + 5);
      }
    }, 200),
    [post?.comments?.length, commentsPage, popularComments.length]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const commentsSection = commentsSectionRef.current;
    if (commentsSection) {
      commentsSection.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (commentsSection) {
        commentsSection.removeEventListener("scroll", handleScroll);
      }
      handleScroll.cancel();
    };
  }, [handleScroll]);

  const scrollToCommentInput = () => {
    commentInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    commentInputRef.current?.focus();
  };

  const reactionAnalytics = () => {
    const totalReactions =
      (post?.likes?.length || 0) +
      (post?.loves?.length || 0) +
      (post?.laughs?.length || 0) +
      (post?.sads?.length || 0);
    if (totalReactions === 0) return null;

    const likePercent = ((post?.likes?.length || 0) / totalReactions) * 100;
    const lovePercent = ((post?.loves?.length || 0) / totalReactions) * 100;
    const laughPercent = ((post?.laughs?.length || 0) / totalReactions) * 100;
    const sadPercent = ((post?.sads?.length || 0) / totalReactions) * 100;

    return {
      likePercent,
      lovePercent,
      laughPercent,
      sadPercent,
      totalReactions,
    };
  };

  const analytics = reactionAnalytics();

  const postUrl = `${window.location.origin}/posts/${postId}`;
  const postTitle = post?.title || "Check out this post on GossipHub!";
  const seoTitle =
    postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
  const postDescription = post?.description || "";
  const seoDescription =
    postDescription.length > 160
      ? `${postDescription.slice(0, 157)}...`
      : postDescription;
  const postMedia = post?.media || "";
  const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
  const videoThumbnail = isVideo
    ? `${postMedia.replace(/\.(mp4|webm|ogg)$/i, "-thumbnail.jpg")}`
    : postMedia;
  const keywords = post?.category
    ? `${post.category}, ${postTitle.split(" ").slice(0, 3).join(", ")}`
    : "GossipHub, Social Media, News";
  const authorName = post?.isAnonymous
    ? "Anonymous"
    : post?.author?.username || "Unknown";
  const datePublished = post?.createdAt
    ? new Date(post.createdAt).toISOString()
    : new Date().toISOString();
  const publisherName = "GossipHub";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seoTitle,
    description: seoDescription,
    author: { "@type": "Person", name: authorName },
    datePublished: datePublished,
    image: postMedia || "https://gossipphub.netlify.app/default-image.jpg",
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: "https://gossipphub.netlify.app/logo.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  // const handleNativeShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       const shareData = {
  //         title: postTitle,
  //         text: `${postTitle}\n${postDescription.slice(0, 100)}...`,
  //         url: postUrl,
  //       };

  //       if (postMedia && !isVideo) {
  //         try {
  //           const response = await fetch(postMedia);
  //           const blob = await response.blob();
  //           const file = new File([blob], "shared-image.jpg", {
  //             type: "image/jpeg",
  //           });
  //           shareData.files = [file];
  //         } catch (err) {
  //           console.error("Failed to fetch image for sharing:", err);
  //           delete shareData.files;
  //         }
  //       }

  //       await navigator.share(shareData);
  //       toast.success("Shared successfully!");
  //     } catch (err) {
  //       console.error("Share error:", err);
  //       try {
  //         await navigator.share({
  //           title: postTitle,
  //           text: `${postTitle}\n${postDescription.slice(
  //             0,
  //             100
  //           )}...\n${postUrl}`,
  //           url: postUrl,
  //         });
  //         toast.success("Shared successfully (without image)!");
  //       } catch (fallbackErr) {
  //         toast.error("Failed to share post");
  //         console.error("Fallback share error:", fallbackErr);
  //       }
  //     }
  //   } else {
  //     toast.info("Native sharing not supported. Use the share options below.");
  //   }
  // };

  // const handleCopyLink = () => {
  //   navigator.clipboard
  //     .writeText(postUrl)
  //     .then(() => {
  //       setIsCopied(true);
  //       toast.success("Link copied to clipboard!");
  //       setTimeout(() => setIsCopied(false), 2000);
  //     })
  //     .catch(() => {
  //       toast.error("Failed to copy link");
  //     });
  // };

  // const handleShareTwitter = () => {
  //   const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
  //     postUrl
  //   )}&text=${encodeURIComponent(postTitle)}`;
  //   window.open(twitterUrl, "_blank", "noopener,noreferrer");
  // };

  // const handleShareWhatsapp = () => {
  //   const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
  //     `${postTitle}\n${postUrl}`
  //   )}`;
  //   window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  // };

  // const handleShareFacebook = () => {
  //   const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
  //     postUrl
  //   )}&t=${encodeURIComponent(postTitle)}`;
  //   window.open(facebookUrl, "_blank", "noopener,noreferrer");
  // };

  // const handleShareTelegram = () => {
  //   const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
  //     postUrl
  //   )}&text=${encodeURIComponent(postTitle)}`;
  //   window.open(telegramUrl, "_blank", "noopener,noreferrer");
  // };

  // const handleShareLinkedin = () => {
  //   const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
  //     postUrl
  //   )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
  //     postDescription.slice(0, 200) + "..."
  //   )}`;
  //   window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  // };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const shareData = {
          title: postTitle,
          text: `${postTitle}\n${postDescription.slice(0, 100)}...\n${postUrl}`,
          url: postUrl,
        };

        if (postMedia && !isVideo) {
          try {
            const response = await fetch(postMedia);
            const blob = await response.blob();
            const file = new File([blob], "shared-image.jpg", {
              type: "image/jpeg",
            });
            shareData.files = [file];
          } catch (err) {
            console.error("Failed to fetch image for sharing:", err);
            delete shareData.files;
          }
        } else if (postMedia && isVideo) {
          shareData.text += `\nWatch the video: ${postMedia}`;
        }

        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        console.error("Share error:", err);
        try {
          await navigator.share({
            title: postTitle,
            text: `${postTitle}\n${postDescription.slice(
              0,
              100
            )}...\n${postUrl}${postMedia ? `\n${postMedia}` : ""}`,
            url: postUrl,
          });
          toast.success("Shared successfully (without media file)!");
        } catch (fallbackErr) {
          toast.error("Failed to share post");
          console.error("Fallback share error:", fallbackErr);
        }
      }
    } else {
      toast.info("Native sharing not supported. Use the share options below.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const handleShareTwitter = () => {
    const maxTextLength = 280; // Twitter's character limit
    const baseText = `${postTitle}\n${postDescription.slice(0, 200)}${
      postMedia ? `\nMedia: ${postMedia}` : ""
    }`;
    const text =
      baseText.length > maxTextLength - postUrl.length - 1
        ? `${baseText.slice(0, maxTextLength - postUrl.length - 4)}...`
        : baseText;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsapp = () => {
    const text = `${postTitle}\n${postDescription.slice(0, 200)}${
      postMedia ? `\nMedia: ${postMedia}` : ""
    }\n${postUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}&t=${encodeURIComponent(postTitle)}&description=${encodeURIComponent(
      postDescription.slice(0, 200)
    )}${postMedia ? `\nMedia: ${postMedia}` : ""}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareTelegram = () => {
    const text = `${postTitle}\n${postDescription.slice(0, 200)}${
      postMedia ? `\nMedia: ${postMedia}` : ""
    }\n${postUrl}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      postUrl
    )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
      postDescription.slice(0, 200)
    )}${postMedia ? `\nMedia: ${postMedia}` : ""}&source=${encodeURIComponent(
      publisherName
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  if (!post) {
    return (
      <div
        className={`flex flex-col gap-4 max-w-7xl mx-auto px-4 pt-20 pb-12 ${
          isDarkMode ? "bg-gray-950" : "bg-gray-100"
        }`}
      >
        <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        <div
          className={`p-6 shadow-lg rounded-lg ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const latestStories = allPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const mostViewedPosts = allPosts
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p._id !== post._id)
    .slice(0, showMoreRelated ? relatedPostsCount : 5);

  const currentIndex = allPosts.findIndex((p) => p._id === postId);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const isTrending =
    (post.likes?.length || 0) +
      (post.loves?.length || 0) +
      (post.laughs?.length || 0) +
      (post.sads?.length || 0) +
      (post.comments?.length || 0) >
    50;

  const paginatedComments = post.comments
    ?.filter((c) => !popularComments.find((pc) => pc._id === c._id))
    .slice()
    .reverse()
    .slice(0, commentsPage * commentsPerPage);

  const userId = localStorage.getItem("userId");

  return (
    <motion.div
      className={`min-h-screen font-poppins ${
        isDarkMode ? "bg-gray-950" : "bg-gray-100"
      } transition-colors duration-500`}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={authorName} />
        <meta name="publisher" content={publisherName} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={postUrl} />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        {isVideo && <meta property="og:video" content={postMedia} />}
        {isVideo && <meta property="og:video:type" content="video/mp4" />}
        {isVideo && <meta property="og:image" content={videoThumbnail} />}
        {!isVideo && postMedia && (
          <meta property="og:image" content={postMedia} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta
          name="twitter:image"
          content={isVideo ? videoThumbnail : postMedia}
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Back to home"
          >
            <HiArrowLeft className="w-6 h-6" />
            Back
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
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

      <div className="max-w-7xl mx-auto lg:px-4 px-1 pt-20 pb-12 flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {postMedia ? (
              <PostMedia
                media={postMedia}
                isVideo={isVideo}
                isMuted={isMuted}
                toggleMute={toggleMute}
                videoRef={videoRef}
                isTrending={isTrending}
                isDarkMode={isDarkMode}
              />
            ) : (
              <div
                className={`w-full aspect-video flex items-center justify-center rounded-t-lg shadow-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No media available
                </p>
              </div>
            )}
            <div
              className={`mt-0 shadow-lg rounded-b-lg ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } lg:p-6 p-3 transition-colors duration-500`}
            >
              <h1
                className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {post.title}
              </h1>
              <p
                className={`text-sm mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Posted by:{" "}
                {post.isAnonymous ? (
                  "Anonymous"
                ) : (
                  <Link
                    to={`/profile/${post.author._id}`}
                    className={
                      isDarkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    }
                    aria-label={`View ${post.author.username}'s profile`}
                  >
                    {post.author?.username || "Unknown"}
                  </Link>
                )}
                {" • "}
                {timeAgo(post.createdAt)}
                {" • "}
                {estimateReadTime(post.description)}
              </p>
              <div className="flex items-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleAudioNarration}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isAudioPlaying
                      ? "bg-red-600 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                  aria-label={
                    isAudioPlaying
                      ? "Pause audio narration"
                      : "Play audio narration"
                  }
                >
                  {isAudioPlaying ? (
                    <HiVolumeOff className="h-5 w-5" />
                  ) : (
                    <HiVolumeUp className="h-5 w-5" />
                  )}
                  <span>
                    {isAudioPlaying ? "Pause Narration" : "Hear Description"}
                  </span>
                </motion.button>
              </div>
              <div
                className={`text-base mb-6 leading-relaxed post-description ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                role="region"
                aria-label="Post description"
              >
                {post.description?.split("\n").map((paragraph, pIdx) => (
                  <motion.div
                    key={pIdx}
                    className="mb-4 last:mb-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {(post.category ? [post.category] : []).map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs font-medium ${
                      isDarkMode
                        ? "text-gray-300 bg-gray-800"
                        : "text-gray-700 bg-gray-200"
                    } rounded-full`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isAuthenticated && (
                <motion.div
                  className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">🔥</span> Reaction Streak
                  </h3>
                  <p className="text-sm">
                    React to 5 posts to earn a badge! Current Streak:{" "}
                    {reactionStreak}/5
                  </p>
                  <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
                    <motion.div
                      className="bg-white h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((reactionStreak / 5) * 100, 100)}%`,
                      }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  {streakRewards.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Rewards Earned:</p>
                      <div className="flex gap-2 mt-1">
                        {streakRewards.map((reward, idx) => (
                          <motion.span
                            key={idx}
                            className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.2 }}
                          >
                            {reward}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {analytics && (
                <motion.div
                  className={`mb-6 p-4 rounded-lg shadow-md ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 flex items-center ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <span className="mr-2">📊</span> Reaction Analytics
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total Reactions: {analytics.totalReactions}
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        👍 Likes: {analytics.likePercent.toFixed(1)}%
                      </span>
                      <div
                        className={`w-full rounded-full h-2 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        }`}
                      >
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.likePercent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        💖 Loves: {analytics.lovePercent.toFixed(1)}%
                      </span>
                      <div
                        className={`w-full rounded-full h-2 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        }`}
                      >
                        <motion.div
                          className="bg-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.lovePercent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        😂 Laughs: {analytics.laughPercent.toFixed(1)}%
                      </span>
                      <div
                        className={`w-full rounded-full h-2 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        }`}
                      >
                        <motion.div
                          className="bg-yellow-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.laughPercent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        😢 Sads: {analytics.sadPercent.toFixed(1)}%
                      </span>
                      <div
                        className={`w-full rounded-full h-2 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        }`}
                      >
                        <motion.div
                          className="bg-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.sadPercent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 mb-8 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("like")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
                    userReaction.like
                      ? "bg-red-600 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isAuthenticated || isReacting}
                  aria-label={`Like post (${post.likes?.length || 0} likes)${
                    userReaction.like ? " (You liked this)" : ""
                  }`}
                >
                  <motion.span
                    className="text-xl"
                    animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    👍
                  </motion.span>
                  ({post.likes?.length || 0})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("love")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
                    userReaction.love
                      ? "bg-pink-600 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isAuthenticated || isReacting}
                  aria-label={`Love post (${post.loves?.length || 0} loves)${
                    userReaction.love ? " (You loved this)" : ""
                  }`}
                >
                  <motion.span
                    className="text-xl"
                    animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    💖
                  </motion.span>
                  ({post.loves?.length || 0})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("laugh")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
                    userReaction.laugh
                      ? "bg-yellow-500 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isAuthenticated || isReacting}
                  aria-label={`Laugh at post (${
                    post.laughs?.length || 0
                  } laughs)${
                    userReaction.laugh ? " (You laughed at this)" : ""
                  }`}
                >
                  <motion.span
                    className="text-xl"
                    animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    😂
                  </motion.span>
                  ({post.laughs?.length || 0})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("sad")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
                    userReaction.sad
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isAuthenticated || isReacting}
                  aria-label={`Sad reaction (${post.sads?.length || 0} sads)${
                    userReaction.sad ? " (You felt sad about this)" : ""
                  }`}
                >
                  <motion.span
                    className="text-xl"
                    animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    😢
                  </motion.span>
                  ({post.sads?.length || 0})
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`mt-0 rounded-lg lg:p-6 p-3 shadow-lg ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } transition-colors duration-500`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Comments ({post.comments?.length || 0})
            </h3>
            <form
              onSubmit={handleCommentSubmit}
              className="mb-8 sticky top-20 z-10 md:static"
            >
              <textarea
                ref={commentInputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={placeholderText || fullPlaceholder}
                className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400"
                    : "bg-gray-100 text-gray-900 border-gray-200 placeholder-gray-500"
                }`}
                aria-label="Comment input"
                disabled={!isAuthenticated}
              />
              <div className="flex justify-between items-center mt-3">
                {isAuthenticated ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
                    aria-label="Submit comment"
                  >
                    Post
                  </motion.button>
                ) : (
                  <Link
                    to="/login"
                    className={
                      isDarkMode
                        ? "text-sm text-red-400 hover:underline"
                        : "text-sm text-red-600 hover:underline"
                    }
                  >
                    Sign in to comment
                  </Link>
                )}
              </div>
            </form>

            <div
              ref={commentsSectionRef}
              className="max-h-[50vh] overflow-y-auto scrollbar-hide"
            >
              {popularComments.length > 0 && (
                <div className="mb-8">
                  <h4
                    className={`text-lg font-semibold mb-4 flex items-center ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <span className="mr-2">🌟</span> Popular Comments
                  </h4>
                  <AnimatePresence>
                    {popularComments.map((c) => (
                      <Comment
                        key={c._id}
                        comment={{ ...c, isPopular: true }}
                        handleCommentReaction={handleCommentReaction}
                        isCommentReacting={isCommentReacting}
                        userId={userId}
                        isAuthenticated={isAuthenticated}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <AnimatePresence>
                {post.comments?.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-center italic ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No comments yet. Be the first to comment!
                  </motion.p>
                ) : (
                  paginatedComments.map((c) => (
                    <Comment
                      key={c._id}
                      comment={{ ...c, isPopular: false }}
                      handleCommentReaction={handleCommentReaction}
                      isCommentReacting={isCommentReacting}
                      userId={userId}
                      isAuthenticated={isAuthenticated}
                      isDarkMode={isDarkMode}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 flex justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {prevPost && (
              <Link
                to={`/posts/${prevPost._id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                <HiArrowLeft className="h-5 w-5" />
                Previous Post
              </Link>
            )}
            {nextPost && (
              <Link
                to={`/posts/${nextPost._id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ml-auto ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                Next Post
                <HiArrowRight className="h-5 w-5" />
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={`mt-6 rounded-lg lg:p-6 p-3 shadow-lg ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } transition-colors duration-500`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Related Posts
            </h3>
            <AnimatePresence>
              {relatedPosts.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No related posts found in this category.
                </motion.p>
              ) : (
                <div className="space-y-4">
                  {relatedPosts.map((story, index) => (
                    <motion.div
                      key={story._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link to={`/posts/${story._id}`} className="flex gap-3">
                        {story.media &&
                          (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                            <video
                              src={story.media}
                              className="w-16 h-16 object-cover rounded"
                              muted
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/50")
                              }
                            />
                          ) : (
                            <img
                              src={story.media}
                              alt="Related post thumbnail"
                              className="w-16 h-16 object-cover rounded"
                              loading="lazy"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/50")
                              }
                            />
                          ))}
                        <div>
                          <p
                            className={`text-sm font-medium hover:text-red-600 ${
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
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
          <motion.div
            className={`rounded-lg lg:p-4 p-3 shadow-lg ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } transition-colors duration-500`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Latest Stories
            </h3>
            <div className="space-y-4">
              {latestStories.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/posts/${story._id}`} className="flex gap-3">
                    {story.media &&
                      (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                        <video
                          src={story.media}
                          className="w-16 h-16 object-cover rounded"
                          muted
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ) : (
                        <img
                          src={story.media}
                          alt="Story thumbnail"
                          className="w-16 h-16 object-cover rounded"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ))}
                    <div>
                      <p
                        className={`text-sm font-medium hover:text-red-600 ${
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
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`rounded-lg lg:p-4 p-3 shadow-lg ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } transition-colors duration-500`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Most Viewed
            </h3>
            <div className="space-y-4">
              {mostViewedPosts.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/posts/${story._id}`} className="flex gap-3">
                    {story.media &&
                      (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                        <video
                          src={story.media}
                          className="w-16 h-16 object-cover rounded"
                          muted
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ) : (
                        <img
                          src={story.media}
                          alt="Story thumbnail"
                          className="w-16 h-16 object-cover rounded"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ))}
                    <div>
                      <p
                        className={`text-sm font-medium hover:text-red-600 ${
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
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {isAuthenticated && (
        <motion.button
          onClick={scrollToCommentInput}
          className="fixed lg:bottom-20 bottom-4 right-6 z-50 p-2 bg-red-600 text-white rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Add a comment"
        >
          <FaComment className="h-6 w-6" />
        </motion.button>
      )}

      <ShareBar
        handleNativeShare={handleNativeShare}
        handleShareTwitter={handleShareTwitter}
        handleShareWhatsapp={handleShareWhatsapp}
        handleShareFacebook={handleShareFacebook}
        handleShareTelegram={handleShareTelegram}
        handleShareLinkedin={handleShareLinkedin}
        handleCopyLink={handleCopyLink}
        isCopied={isCopied}
        isDarkMode={isDarkMode}
      />

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
          <p className="text-sm">© 2025 GossippHub. All rights reserved.</p>
        </div>
      </footer>

      <style>
        {`
          .post-description iframe,
          .post-description video {
            width: 100% !important;
            height: 400px !important;
            max-width: 100%;
            border-radius: 8px;
            margin-bottom: 1rem;
          }
          @media (min-width: 640px) {
            .post-description iframe,
            .post-description video {
              height: 500px !important;
            }
          }
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

export default PostDetails;
