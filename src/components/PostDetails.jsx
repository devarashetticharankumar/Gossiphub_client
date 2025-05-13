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

//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           <div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {post.media && (
//               <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//                 {post.media.endsWith(".mp4") ? (
//                   <video
//                     src={post.media}
//                     controls
//                     className="w-full h-[400px] md:h-[500px] object-contain bg-black"
//                     aria-label="Post video"
//                   />
//                 ) : (
//                   <img
//                     src={post.media}
//                     alt="Post media"
//                     className="w-full h-[400px] md:h-[500px] object-cover"
//                   />
//                 )}
//                 <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75">
//                   GossipHub
//                 </div>
//               </div>
//             )}
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
//                           src={story.media}
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

//         <div className="md:w-1/3 space-y-6">
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
//                       src={story.media}
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
//                       src={story.media}
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
//         `}
//       </style>
//     </div>
//   );
// };

// export default PostDetails;
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

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
// import { Helmet } from "react-helmet";

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

//   const postUrl = `${window.location.origin}/posts/${postId}`;
//   const postTitle = post?.title || "Check out this post on GossipHub!";
//   // Truncate title for SEO (under 60 characters)
//   const seoTitle =
//     postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;
//   const postDescription = post?.description || "";
//   // Truncate description for SEO (under 160 characters)
//   const seoDescription =
//     postDescription.length > 160
//       ? `${postDescription.slice(0, 157)}...`
//       : postDescription;
//   const postMedia = post?.media || "";
//   const isVideo = postMedia && postMedia.endsWith(".mp4");
//   // For videos, we need a thumbnail for Twitter cards and SEO
//   const videoThumbnail = isVideo
//     ? `${postMedia.replace(".mp4", "-thumbnail.jpg")}`
//     : postMedia;
//   // Keywords for SEO (using category and some words from title/description)
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

//   // Structured Data (JSON-LD) for BlogPosting schema
//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: seoTitle,
//     description: seoDescription,
//     author: {
//       "@type": "Person",
//       name: authorName,
//     },
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
//     mainEntityOfPage: {
//       "@type": "WebPage",
//       "@id": postUrl,
//     },
//   };

//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         // Check if the media is an image and attempt to share it as a file
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
//           // For videos or if file sharing isn't supported, share the URL
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
//     )}"e=${encodeURIComponent(postTitle)}`;
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
//       {/* Add Helmet to set meta tags for SEO, Open Graph, and Twitter Cards */}
//       <Helmet>
//         <meta charSet="utf-8" />
//         {/* SEO: Page Title (under 60 characters) */}
//         <title>{seoTitle}</title>
//         {/* SEO: Meta Description (under 160 characters) */}
//         <meta name="description" content={seoDescription} />
//         {/* SEO: Keywords */}
//         <meta name="keywords" content={keywords} />
//         {/* SEO: Author */}
//         <meta name="author" content={authorName} />
//         {/* SEO: Publisher (custom tag) */}
//         <meta name="publisher" content={publisherName} />
//         {/* SEO: Robots */}
//         <meta name="robots" content="index, follow" />
//         {/* SEO: Canonical URL */}
//         <link rel="canonical" href={postUrl} />

//         {/* Open Graph Tags (also helps with SEO) */}
//         <meta property="og:title" content={postTitle} />
//         <meta property="og:description" content={postDescription} />
//         <meta property="og:url" content={postUrl} />
//         <meta property="og:type" content="article" />
//         {isVideo ? (
//           <>
//             <meta property="og:video" content={postMedia} />
//             <meta property="og:video:type" content="video/mp4" />
//             {/* Optional: Add a thumbnail for videos */}
//             <meta property="og:image" content={videoThumbnail} />
//           </>
//         ) : (
//           postMedia && <meta property="og:image" content={postMedia} />
//         )}

//         {/* Twitter Card Tags (also helps with SEO) */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={postTitle} />
//         <meta name="twitter:description" content={postDescription} />
//         {/* Use thumbnail for videos on Twitter */}
//         <meta
//           name="twitter:image"
//           content={isVideo ? videoThumbnail : postMedia}
//         />

//         {/* Structured Data (JSON-LD) for SEO */}
//         <script type="application/ld+json">
//           {JSON.stringify(structuredData)}
//         </script>
//       </Helmet>

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

//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//         <div className="md:w-2/3">
//           <div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {post.media && (
//               <div className="relative rounded-t-lg overflow-hidden shadow-xl">
//                 {post.media.endsWith(".mp4") ? (
//                   <video
//                     src={post.media}
//                     controls
//                     className="w-full h-[400px] md:h-[500px] object-contain bg-black"
//                     aria-label="Post video"
//                   />
//                 ) : (
//                   <img
//                     src={post.media}
//                     alt="Post media"
//                     className="w-full h-[400px] md:h-[500px] object-cover"
//                   />
//                 )}
//                 <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75">
//                   GossipHub
//                 </div>
//               </div>
//             )}
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
//                       {story.media &&
//                         (story.media.endsWith(".mp4") ? (
//                           <video
//                             src={story.media}
//                             className="w-16 h-16 object-cover rounded"
//                             muted
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                         ) : (
//                           <img
//                             src={story.media}
//                             alt="Related post thumbnail"
//                             className="w-16 h-16 object-cover rounded"
//                             onError={(e) =>
//                               (e.target.src = "https://via.placeholder.com/50")
//                             }
//                           />
//                         ))}
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

//         <div className="md:w-1/3 space-y-6">
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
//                   {story.media &&
//                     (story.media.endsWith(".mp4") ? (
//                       <video
//                         src={story.media}
//                         className="w-16 h-16 object-cover rounded"
//                         muted
//                         onError={(e) =>
//                           (e.target.src = "https://via.placeholder.com/50")
//                         }
//                       />
//                     ) : (
//                       <img
//                         src={story.media}
//                         alt="Story thumbnail"
//                         className="w-16 h-16 object-cover rounded"
//                         onError={(e) =>
//                           (e.target.src = "https://via.placeholder.com/50")
//                         }
//                       />
//                     ))}
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
//                   {story.media &&
//                     (story.media.endsWith(".mp4") ? (
//                       <video
//                         src={story.media}
//                         className="w-16 h-16 object-cover rounded"
//                         muted
//                         onError={(e) =>
//                           (e.target.src = "https://via.placeholder.com/50")
//                         }
//                       />
//                     ) : (
//                       <img
//                         src={story.media}
//                         alt="Story thumbnail"
//                         className="w-16 h-16 object-cover rounded"
//                         onError={(e) =>
//                           (e.target.src = "https://via.placeholder.com/50")
//                         }
//                       />
//                     ))}
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
//         `}
//       </style>
//     </div>
//   );
// };

// export default PostDetails;

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
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
  const [isCommentReacting, setIsCommentReacting] = useState(null); // Track comment reaction loading state
  const videoRef = useRef(null);

  // Scroll animation for background gradient
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    [isDarkMode ? "#111827" : "#F3F4F6", isDarkMode ? "#1F2937" : "#E5E7EB"]
  );

  // Dark Mode Handling
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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

          // Sort comments by likes for popular comments
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

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add a reaction");
      return;
    }

    if (isReacting) return; // Prevent multiple simultaneous reactions
    setIsReacting(true);

    try {
      const userId = localStorage.getItem("userId");
      const currentReactions = { ...userReaction };
      const newReactions = { ...userReaction };

      // Toggle reaction
      newReactions[type] = !currentReactions[type];
      setUserReaction(newReactions);

      // Call the backend API to add reaction
      const updatedReactions = await addReaction(postId, { type });

      // Update post state with new reaction counts
      setPost((prevPost) => ({
        ...prevPost,
        likes: updatedReactions.likes || [],
        loves: updatedReactions.loves || [],
        laughs: updatedReactions.laughs || [],
        sads: updatedReactions.sads || [],
      }));

      // Fetch updated user profile to get reaction streak
      const user = await getUserProfile();
      const newStreak = user.reactionStreak || 0;
      const newRewards = user.streakRewards || [];
      setReactionStreak(newStreak);
      setStreakRewards(newRewards);

      // Show toast and confetti for milestones
      if (newReactions[type]) {
        toast.success(`Reaction added! Streak: ${newStreak}`);
        if (newRewards.includes("Reaction Streak 5")) {
          toast.success("🎉 Streak Goal Reached! Badge Earned!");
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }

      // Unlock more related posts after 3 reactions
      if (newStreak >= 3 && !showMoreRelated) {
        setShowMoreRelated(true);
        toast.success("🎉 More related posts unlocked!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to add reaction");
      setUserReaction({ like: false, love: false, laugh: false, sad: false }); // Reset on error
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
      toast.success("Comment added");

      // Update popular comments
      const sortedComments = [...(updatedPost.comments || [])].sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
      setPopularComments(sortedComments.slice(0, 2));
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  const handleCommentReaction = async (commentId, type) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to react to comments");
      return;
    }
    if (isCommentReacting === commentId) return; // Prevent multiple clicks
    setIsCommentReacting(commentId);

    try {
      const updatedPost = await addCommentReaction(postId, commentId, { type });
      setPost(updatedPost);

      // Update popular comments
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Infinite Scroll for Related Posts
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setRelatedPostsCount((prev) => prev + 5);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SEO and Sharing Setup
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
  const isVideo = postMedia && postMedia.endsWith(".mp4");
  const videoThumbnail = isVideo
    ? `${postMedia.replace(".mp4", "-thumbnail.jpg")}`
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        if (postMedia && !isVideo) {
          const response = await fetch(postMedia);
          const blob = await response.blob();
          const file = new File([blob], "shared-image.jpg", {
            type: "image/jpeg",
          });
          await navigator.share({
            files: [file],
            title: postTitle,
            text: `${postTitle}\n${postDescription.slice(
              0,
              100
            )}...\n${postUrl}`,
            url: postUrl,
          });
        } else {
          await navigator.share({
            title: postTitle,
            text: `${postTitle}\n${postDescription.slice(
              0,
              100
            )}...\n${postUrl}`,
            url: postUrl,
          });
        }
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
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(postTitle)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsapp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${postTitle}\n${postUrl}`
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}&t=${encodeURIComponent(postTitle)}`;
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
      postDescription.slice(0, 200) + "..."
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-2xl font-medium text-red-600 dark:text-red-400"
        >
          Loading...
        </motion.div>
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

  return (
    <motion.div
      className={`min-h-screen font-poppins transition-colors duration-500 ${
        isDarkMode ? "dark" : ""
      }`}
      style={{ background: backgroundColor }}
    >
      {/* SEO Meta Tags */}
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
        {isVideo ? (
          <>
            <meta property="og:video" content={postMedia} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:image" content={videoThumbnail} />
          </>
        ) : (
          postMedia && <meta property="og:image" content={postMedia} />
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

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          {/* Post Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {post.media && (
              <div className="relative rounded-t-lg overflow-hidden shadow-xl">
                {isVideo ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={post.media}
                      controls
                      muted={isMuted}
                      className="w-full h-[400px] md:h-[500px] object-contain bg-black"
                      aria-label="Post video"
                    />
                    <button
                      onClick={toggleMute}
                      className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white"
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
                    src={post.media}
                    alt="Post media"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="absolute top-4 left-4 text-white text-sm font-medium opacity-75 bg-black/50 px-2 py-1 rounded">
                  GossipHub
                </div>
                {isTrending && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <span className="mr-1">🔥</span> Trending Now
                  </div>
                )}
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-6 mt-0 shadow-lg rounded-b-lg">
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
                  <motion.div
                    key={pIdx}
                    className="mb-4 last:mb-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>

              {/* Tags */}
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

              {/* Reaction Streak */}
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
                      animate={{ width: `${(reactionStreak / 5) * 100}%` }}
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

              {/* Reactions */}
              <div className="flex gap-3 mb-8 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction("like")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${
                    userReaction.like
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
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

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-0 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Comments
            </h3>
            {/* Sticky Comment Input on Mobile */}
            <form
              onSubmit={handleCommentSubmit}
              className="mb-8 sticky top-20 z-10 md:static bg-white dark:bg-gray-900"
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:outline-none resize-none h-24 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-300"
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
                    className="text-sm text-red-600 hover:underline"
                  >
                    Sign in to comment
                  </Link>
                )}
              </div>
            </form>

            {/* Popular Comments */}
            {popularComments.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <span className="mr-2">🌟</span> Popular Comments
                </h4>
                <AnimatePresence>
                  {popularComments.map((c) => {
                    const userId = localStorage.getItem("userId");
                    const hasLiked = c.likes?.includes(userId);
                    return (
                      <motion.div
                        key={c._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="mb-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-orange-500"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
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
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleCommentReaction(c._id, "like")
                              }
                              className={`mt-2 flex items-center gap-1 text-sm ${
                                hasLiked
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-600 dark:text-gray-400"
                              } ${
                                isCommentReacting === c._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={isCommentReacting === c._id}
                              aria-label={
                                hasLiked ? "Unlike comment" : "Like comment"
                              }
                            >
                              <motion.span
                                animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <FaHeart className="h-4 w-4" />
                              </motion.span>
                              {c.likes?.length || 0}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* All Comments */}
            <AnimatePresence>
              {post.comments.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 dark:text-gray-400 italic"
                >
                  No comments yet. Be the first to comment!
                </motion.p>
              ) : (
                post.comments
                  .filter(
                    (c) => !popularComments.find((pc) => pc._id === c._id)
                  )
                  .slice()
                  .reverse()
                  .map((c) => {
                    const userId = localStorage.getItem("userId");
                    const hasLiked = c.likes?.includes(userId);
                    return (
                      <motion.div
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
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleCommentReaction(c._id, "like")
                              }
                              className={`mt-2 flex items-center gap-1 text-sm ${
                                hasLiked
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-600 dark:text-gray-400"
                              } ${
                                isCommentReacting === c._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={isCommentReacting === c._id}
                              aria-label={
                                hasLiked ? "Unlike comment" : "Like comment"
                              }
                            >
                              <motion.span
                                animate={hasLiked ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <FaHeart className="h-4 w-4" />
                              </motion.span>
                              {c.likes?.length || 0}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
              )}
            </AnimatePresence>
          </motion.div>

          {/* Next/Previous Post Navigation */}
          <motion.div
            className="mt-6 flex justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {prevPost && (
              <Link
                to={`/posts/${prevPost._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <HiArrowLeft className="h-5 w-5" />
                Previous Post
              </Link>
            )}
            {nextPost && (
              <Link
                to={`/posts/${nextPost._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-auto"
              >
                Next Post
                <HiArrowRight className="h-5 w-5" />
              </Link>
            )}
          </motion.div>

          {/* Related Posts */}
          <motion.div
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 dark:text-gray-400"
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
                          (story.media.endsWith(".mp4") ? (
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
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/50")
                              }
                            />
                          ))}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
                            {story.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
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

        {/* Sidebar */}
        <div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide">
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
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
                      (story.media.endsWith(".mp4") ? (
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
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ))}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
                        {story.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {story.category || "General"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
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
                      (story.media.endsWith(".mp4") ? (
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
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ))}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600">
                        {story.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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

      {/* Floating Share Bar */}
      <motion.div
        className="fixed bottom-20 md:bottom-4 right-4 z-50 flex gap-3 items-center bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Share post"
        >
          <FaShareAlt className="text-xl" />
          <span>Share</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShareTwitter}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Share on Twitter"
        >
          <FaXTwitter className="text-xl text-black" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShareWhatsapp}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp className="text-xl text-green-500" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShareFacebook}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Share on Facebook"
        >
          <FaFacebook className="text-xl text-blue-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShareTelegram}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Share on Telegram"
        >
          <FaTelegram className="text-xl text-blue-400" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShareLinkedin}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          aria-label={isCopied ? "Link copied" : "Copy link"}
        >
          <FaLink className="text-xl" />
        </motion.button>
      </motion.div>

      {/* Footer */}
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
