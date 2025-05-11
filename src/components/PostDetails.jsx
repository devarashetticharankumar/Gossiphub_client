// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { getPosts, addReaction, addComment } from "../utils/api";
// import {
//   FaShareAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaLink,
//   FaTelegram,
//   FaLinkedin,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";

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
//     downvote: false,
//   });
//   const [isCopied, setIsCopied] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

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
//             like: foundPost.likes.includes(userId),
//             downvote: foundPost.downvotes.includes(userId),
//           });
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

//     try {
//       const userId = localStorage.getItem("userId");
//       const currentLike = userReaction.like;
//       const currentDownvote = userReaction.downvote;

//       let newReactionState = { like: currentLike, downvote: currentDownvote };
//       if (type === "like") {
//         if (currentLike) {
//           await addReaction(postId, { type: "like" });
//           newReactionState.like = false;
//           toast.success("Like removed");
//         } else {
//           await addReaction(postId, { type: "like" });
//           newReactionState.like = true;
//           newReactionState.downvote = false;
//           toast.success("Like added");
//         }
//       } else if (type === "downvote") {
//         if (currentDownvote) {
//           await addReaction(postId, { type: "downvote" });
//           newReactionState.downvote = false;
//           toast.success("Downvote removed");
//         } else {
//           await addReaction(postId, { type: "downvote" });
//           newReactionState.downvote = true;
//           newReactionState.like = false;
//           toast.success("Downvote added");
//         }
//       }

//       const res = await getPosts();
//       const updatedPost = res.find((p) => p._id === postId);
//       setPost(updatedPost);
//       setUserReaction(newReactionState);
//     } catch (err) {
//       toast.error(err.message || "Failed to add reaction");
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       toast.error("Please sign in to comment");
//       return;
//     }
//     // Check if the comment is empty or only whitespace
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
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Share functionality
//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: postTitle,
//           text: post.description.slice(0, 100) + "...",
//           url: postUrl,
//         });
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
//     const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//       postTitle
//     )}&url=${encodeURIComponent(postUrl)}`;
//     window.open(twitterUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareWhatsapp = () => {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       `${postTitle} ${postUrl}`
//     )}`;
//     window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleShareFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       postUrl
//     )}`;
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
//       post.description.slice(0, 200) + "..."
//     )}`;
//     window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//   };

//   if (!post) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
//         <div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="text-2xl font-medium text-red-600 dark:text-red-400"
//         >
//           Loading...
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
//     .slice(0, 5);

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-950" : "bg-gray-100"
//       } transition-colors duration-500 font-poppins`}
//     >
//       {/* Sticky Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
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
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         {/* Article Section */}
//         <div className="md:w-2/3">
//           <div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {/* Media */}
//             {post.media && (
//               <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//                 {post.media.endsWith(".mp4") ? (
//                   <video
//                     src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${
//                       post.media
//                     }`}
//                     controls
//                     className="w-full h-[400px] md:h-[500px] object-contain bg-black"
//                     aria-label="Post video"
//                   />
//                 ) : (
//                   <img
//                     src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${
//                       post.media
//                     }`}
//                     alt="Post media"
//                     className="w-full h-[400px] md:h-[500px] object-cover"
//                   />
//                 )}
//                 <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75">
//                   GossipHub
//                 </div>
//               </div>
//             )}
//             {/* Article Content */}
//             <div className="bg-white dark:bg-gray-900 p-6 mt-0 shadow-lg">
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
//                 {new Date(post.createdAt).toLocaleDateString()}
//               </p>
//               <div
//                 className="text-base text-gray-700 dark:text-gray-200 mb-6 leading-relaxed post-description"
//                 role="region"
//                 aria-label="Post description"
//               >
//                 {post.description.split("\n\n").map((paragraph, pIdx) => (
//                   <div
//                     key={pIdx}
//                     className="mb-4 last:mb-0"
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
//               {/* Reaction and Share Buttons */}
//               <div className="flex gap-3 mb-8 flex-wrap">
//                 <button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("like")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
//                     userReaction.like
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   }`}
//                   disabled={!isAuthenticated}
//                   aria-label={`Like post (${post.likes.length} likes)${
//                     userReaction.like ? " (You liked this)" : ""
//                   }`}
//                 >
//                   <span className="text-xl">😍</span>({post.likes.length})
//                 </button>
//                 <button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleReaction("downvote")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
//                     userReaction.downvote
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   }`}
//                   disabled={!isAuthenticated}
//                   aria-label={`Downvote post (${
//                     post.downvotes.length
//                   } downvotes)${
//                     userReaction.downvote ? " (You downvoted this)" : ""
//                   }`}
//                 >
//                   <span className="text-xl">😡</span>({post.downvotes.length})
//                 </button>
//                 {/* Share Button */}
//                 <button
//                   whileHover={{ scale: 1.15 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleNativeShare}
//                   className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                   aria-label="Share post"
//                 >
//                   <FaShareAlt className="text-xl" />
//                   <span>Share</span>
//                 </button>
//                 {/* Share Options */}
//                 <div
//                   className="flex gap-2"
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <button
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleShareTwitter}
//                     className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Share on Twitter"
//                   >
//                     <FaXTwitter className="text-xl text-black" />
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleShareWhatsapp}
//                     className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Share on WhatsApp"
//                   >
//                     <FaWhatsapp className="text-xl text-green-500" />
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleShareFacebook}
//                     className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Share on Facebook"
//                   >
//                     <FaFacebook className="text-xl text-blue-600" />
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleShareTelegram}
//                     className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Share on Telegram"
//                   >
//                     <FaTelegram className="text-xl text-blue-400" />
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleShareLinkedin}
//                     className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     aria-label="Share on LinkedIn"
//                   >
//                     <FaLinkedin className="text-xl text-blue-700" />
//                   </button>
//                   <button
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleCopyLink}
//                     className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
//                       isCopied
//                         ? "bg-green-500 text-white"
//                         : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
//                     }`}
//                     aria-label={isCopied ? "Link copied" : "Copy link"}
//                   >
//                     <FaLink className="text-xl" />
//                     {isCopied && <span>Copied!</span>}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Comments Section */}
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mt-0 bg-white dark:bg-gray-900 rounded-b-lg p-6 shadow-lg"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
//               Comments
//             </h3>
//             <form onSubmit={handleCommentSubmit} className="mb-8">
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-300"
//                 whileFocus={{ scale: 1.02 }}
//                 transition={{ duration: 0.2 }}
//                 aria-label="Comment input"
//                 disabled={!isAuthenticated}
//               />
//               <div className="flex justify-between items-center mt-3">
//                 {isAuthenticated ? (
//                   <button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                     aria-label="Submit comment"
//                   >
//                     Post
//                   </button>
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
//             <AnimatePresence>
//               {post.comments.length === 0 ? (
//                 <p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500 dark:text-gray-400 italic"
//                 >
//                   No comments yet. Be the first to comment!
//                 </p>
//               ) : (
//                 post.comments
//                   .slice()
//                   .reverse()
//                   .map((c) => (
//                     <div
//                       key={c._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.4 }}
//                       className="mb-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-red-500 dark:border-red-400"
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
//                           {c.author?.username?.[0]?.toUpperCase() || "A"}
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
//                               {c.author?.username || "Anonymous"}
//                             </p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                               {new Date(c.createdAt).toLocaleString()}
//                             </p>
//                           </div>
//                           <p className="text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">
//                             {c.text}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Related Posts Section */}
//           <div
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
//                 <p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No related posts found in this category.
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {relatedPosts.map((story) => (
//                     <Link
//                       key={story._id}
//                       to={`/posts/${story._id}`}
//                       className="flex gap-3"
//                     >
//                       {story.media && (
//                         <img
//                           src={`${import.meta.env.VITE_API_URL.replace(
//                             "/api",
//                             ""
//                           )}${story.media}`}
//                           alt="Related post thumbnail"
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                       )}
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
//                           {story.title}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {story.category || "General"}
//                         </p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:w-1/3 space-y-6">
//           {/* Latest Stories */}
//           <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
//               Latest Stories
//             </h3>
//             <div className="space-y-4">
//               {latestStories.map((story) => (
//                 <Link
//                   key={story._id}
//                   to={`/posts/${story._id}`}
//                   className="flex gap-3"
//                 >
//                   {story.media && (
//                     <img
//                       src={`${import.meta.env.VITE_API_URL.replace(
//                         "/api",
//                         ""
//                       )}${story.media}`}
//                       alt="Story thumbnail"
//                       className="w-16 h-16 object-cover rounded"
//                     />
//                   )}
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
//                       {story.title}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {story.category || "General"}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Most Viewed */}
//           <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
//               Most Viewed
//             </h3>
//             <div className="space-y-4">
//               {mostViewedPosts.map((story) => (
//                 <Link
//                   key={story._id}
//                   to={`/posts/${story._id}`}
//                   className="flex gap-3"
//                 >
//                   {story.media && (
//                     <img
//                       src={`${import.meta.env.VITE_API_URL.replace(
//                         "/api",
//                         ""
//                       )}${story.media}`}
//                       alt="Story thumbnail"
//                       className="w-16 h-16 object-cover rounded"
//                     />
//                   )}
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
//                       {story.title}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {story.category || "General"}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

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

//       {/* Inline Styles for Embedded Videos */}
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
//         `}
//       </style>
//     </div>
//   );
// };

// export default PostDetails;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts, addReaction, addComment } from "../utils/api";
import {
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaLink,
  FaTelegram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const isAuthenticated = !!localStorage.getItem("token");
  const [userReaction, setUserReaction] = useState({
    like: false,
    downvote: false,
  });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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
            like: foundPost.likes.includes(userId),
            downvote: foundPost.downvotes.includes(userId),
          });
        }
      } catch (err) {
        toast.error("Failed to fetch posts");
      }
    };
    fetchPosts();
  }, [postId, isAuthenticated]);

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add a reaction");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const currentLike = userReaction.like;
      const currentDownvote = userReaction.downvote;

      let newReactionState = { like: currentLike, downvote: currentDownvote };
      if (type === "like") {
        if (currentLike) {
          await addReaction(postId, { type: "like" });
          newReactionState.like = false;
          toast.success("Like removed");
        } else {
          await addReaction(postId, { type: "like" });
          newReactionState.like = true;
          newReactionState.downvote = false;
          toast.success("Like added");
        }
      } else if (type === "downvote") {
        if (currentDownvote) {
          await addReaction(postId, { type: "downvote" });
          newReactionState.downvote = false;
          toast.success("Downvote removed");
        } else {
          await addReaction(postId, { type: "downvote" });
          newReactionState.downvote = true;
          newReactionState.like = false;
          toast.success("Downvote added");
        }
      }

      const res = await getPosts();
      const updatedPost = res.find((p) => p._id === postId);
      setPost(updatedPost);
      setUserReaction(newReactionState);
    } catch (err) {
      toast.error(err.message || "Failed to add reaction");
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
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const postUrl = `${window.location.origin}/posts/${postId}`;
  const postTitle = post?.title || "Check out this post on GossipHub!";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: post.description.slice(0, 100) + "...",
          url: postUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        toast.error("Failed to share post");
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
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      postTitle
    )}&url=${encodeURIComponent(postUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsapp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${postTitle} ${postUrl}`
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(postTitle)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      postUrl
    )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
      post.description.slice(0, 200) + "..."
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
        <div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-2xl font-medium text-red-600 dark:text-red-400"
        >
          Loading...
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
    .slice(0, 5);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gray-100"
      } transition-colors duration-500 font-poppins`}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
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
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {post.media && (
              <div className="relative rounded-t-lg overflow-hidden shadow-xl">
                {post.media.endsWith(".mp4") ? (
                  <video
                    src={post.media}
                    controls
                    className="w-full h-[400px] md:h-[500px] object-contain bg-black"
                    aria-label="Post video"
                  />
                ) : (
                  <img
                    src={post.media}
                    alt="Post media"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                )}
                <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75">
                  GossipHub
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-6 mt-0 shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {post.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Posted by:{" "}
                {post.isAnonymous ? (
                  "Anonymous"
                ) : (
                  <Link
                    to={`/profile/${post.author._id}`}
                    className="text-indigo-600 dark:text-teal-400 hover:text-indigo-700 dark:hover:text-teal-300 transition-colors"
                    aria-label={`View ${post.author.username}'s profile`}
                  >
                    {post.author?.username || "Unknown"}
                  </Link>
                )}
                {" • "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div
                className="text-base text-gray-700 dark:text-gray-200 mb-6 leading-relaxed post-description"
                role="region"
                aria-label="Post description"
              >
                {post.description.split("\n\n").map((paragraph, pIdx) => (
                  <div
                    key={pIdx}
                    className="mb-4 last:mb-0"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {(post.category ? [post.category] : []).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mb-8 flex-wrap">
                <button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("like")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    userReaction.like
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  disabled={!isAuthenticated}
                  aria-label={`Like post (${post.likes.length} likes)${
                    userReaction.like ? " (You liked this)" : ""
                  }`}
                >
                  <span className="text-xl">😍</span>({post.likes.length})
                </button>
                <button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("downvote")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    userReaction.downvote
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  disabled={!isAuthenticated}
                  aria-label={`Downvote post (${
                    post.downvotes.length
                  } downvotes)${
                    userReaction.downvote ? " (You downvoted this)" : ""
                  }`}
                >
                  <span className="text-xl">😡</span>({post.downvotes.length})
                </button>
                <button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Share post"
                >
                  <FaShareAlt className="text-xl" />
                  <span>Share</span>
                </button>
                <div
                  className="flex gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShareTwitter}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <FaXTwitter className="text-xl text-black" />
                  </button>
                  <button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShareWhatsapp}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-xl text-green-500" />
                  </button>
                  <button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShareFacebook}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook className="text-xl text-blue-600" />
                  </button>
                  <button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShareTelegram}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share on Telegram"
                  >
                    <FaTelegram className="text-xl text-blue-400" />
                  </button>
                  <button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShareLinkedin}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin className="text-xl text-blue-700" />
                  </button>
                  <button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                      isCopied
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-label={isCopied ? "Link copied" : "Copy link"}
                  >
                    <FaLink className="text-xl" />
                    {isCopied && <span>Copied!</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-0 bg-white dark:bg-gray-900 rounded-b-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Comments
            </h3>
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                aria-label="Comment input"
                disabled={!isAuthenticated}
              />
              <div className="flex justify-between items-center mt-3">
                {isAuthenticated ? (
                  <button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
                    aria-label="Submit comment"
                  >
                    Post
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Sign in to comment
                  </Link>
                )}
              </div>
            </form>
            <AnimatePresence>
              {post.comments.length === 0 ? (
                <p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 dark:text-gray-400 italic"
                >
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                post.comments
                  .slice()
                  .reverse()
                  .map((c) => (
                    <div
                      key={c._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="mb-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-red-500 dark:border-red-400"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                          {c.author?.username?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                              {c.author?.username || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(c.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </AnimatePresence>
          </div>

          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Related Posts
            </h3>
            <AnimatePresence>
              {relatedPosts.length === 0 ? (
                <p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 dark:text-gray-400"
                >
                  No related posts found in this category.
                </p>
              ) : (
                <div className="space-y-4">
                  {relatedPosts.map((story) => (
                    <Link
                      key={story._id}
                      to={`/posts/${story._id}`}
                      className="flex gap-3"
                    >
                      {story.media && (
                        <img
                          src={story.media}
                          alt="Related post thumbnail"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
                          {story.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {story.category || "General"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="md:w-1/3 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Latest Stories
            </h3>
            <div className="space-y-4">
              {latestStories.map((story) => (
                <Link
                  key={story._id}
                  to={`/posts/${story._id}`}
                  className="flex gap-3"
                >
                  {story.media && (
                    <img
                      src={story.media}
                      alt="Story thumbnail"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
                      {story.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {story.category || "General"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Most Viewed
            </h3>
            <div className="space-y-4">
              {mostViewedPosts.map((story) => (
                <Link
                  key={story._id}
                  to={`/posts/${story._id}`}
                  className="flex gap-3"
                >
                  {story.media && (
                    <img
                      src={story.media}
                      alt="Story thumbnail"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
                      {story.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {story.category || "General"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        `}
      </style>
    </div>
  );
};

export default PostDetails;
