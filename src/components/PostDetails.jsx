// import {
//     useState,
//     useEffect,
//     useRef,
//     useCallback,
//     lazy,
//     Suspense,
// } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import confetti from "canvas-confetti";
// import debounce from "lodash/debounce";
// import { franc } from "franc";
// import {
//     HiArrowLeft,
//     HiArrowRight,
//     HiVolumeUp,
//     HiVolumeOff,
//     HiShare,
//     HiHeart,
//     HiChat,
//     HiBookmark,
//     HiSun,
//     HiMoon,
//     HiArrowUp,
// } from "react-icons/hi";
// import { FaThumbsUp, FaHeart, FaLaugh, FaSadTear, FaFireAlt, FaChartBar, FaStar, FaComment, FaPinterest, FaLinkedin, FaTwitter, FaWhatsapp, FaFacebook } from "react-icons/fa";
// import {
//     getPosts,
//     getPostById,
//     addReaction,
//     addComment,
//     addCommentReaction,
//     getUserProfile,
//     getPostsByCategory,
// } from "../utils/api";
// import parse from 'html-react-parser';
// import SocialEmbed from "./SocialEmbed";
// // Lazy-loaded components
// const PostMedia = lazy(() => import("./PostMedia"));
// const Comment = lazy(() => import("./Comment"));
// const ShareBar = lazy(() => import("./ShareBar"));

// // Utility function to calculate time difference and return "time ago" format
// export const timeAgo = (date) => {
//     const now = new Date();
//     const past = new Date(date);
//     const diffInSeconds = Math.floor((now - past) / 1000);
//     if (diffInSeconds < 0 || diffInSeconds < 10) return "Just now";
//     if (diffInSeconds < 60)
//         return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
//     const diffInMinutes = Math.floor(diffInSeconds / 60);
//     if (diffInMinutes < 60)
//         return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24)
//         return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 30)
//         return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
//     const diffInMonths = Math.floor(diffInDays / 30);
//     return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
// };

// // Utility to estimate read time (assuming 200 words per minute)
// const estimateReadTime = (text) => {
//     const words = text?.split(/\s+/).length || 0;
//     const minutes = Math.ceil(words / 200);
//     return minutes === 0 ? "Less than a minute" : `${minutes} min read`;
// };

// // Dynamic Utility to format hashtags: splits camelCase or PascalCase into words with proper capitalization
// // const formatHashtag = (tag) => {
// //   const cleaned = tag.replace(/^#/, "").trim();
// //   if (!cleaned) return "";
// //   // Insert space before each uppercase letter (except first if it's the start), and handle numbers/acronyms gracefully
// //   let spaced = cleaned.replace(/([A-Z0-9])/g, " $1").trim();
// //   // Capitalize first letter
// //   spaced = spaced.charAt(0).toUpperCase() + spaced.slice(1);
// //   // Handle cases like "Pyaar2" -> "Pyaar 2"
// //   spaced = spaced.replace(/(\d+)/g, " $1");
// //   return spaced.trim();
// // };
// const formatHashtag = (tag) => {
//     if (!tag) return "";
//     // Remove '#' and trim spaces
//     let cleaned = tag.replace(/^#/, "").trim();
//     if (!cleaned) return "";

//     // Handle CamelCase: add space before uppercase or number
//     let spaced = cleaned.replace(/([a-z])([A-Z0-9])/g, "$1 $2");

//     // If it's all lowercase (like bollywoodactress), try to split on word clusters
//     if (spaced.toLowerCase() === spaced) {
//         // Try to detect common word boundaries (basic dictionary pattern)
//         spaced = spaced
//             .replace(/([a-z]{3,})([A-Z]?)/g, "$1 ")
//             .trim()
//             .replace(/\s+/g, " ");
//     }

//     // Add space before numbers (e.g., "Pyaar2" â†’ "Pyaar 2")
//     spaced = spaced.replace(/(\d+)/g, " $1");

//     // Title Case every word
//     spaced = spaced
//         .split(" ")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//         .join(" ");

//     return spaced.trim();
// };

// // ImageCarousel Component
// const ImageCarousel = ({ images, isDarkMode }) => {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [isImageLoaded, setIsImageLoaded] = useState(false);
//     const handleNext = () => {
//         setCurrentImageIndex((prev) => (prev + 1) % images.length);
//         setIsImageLoaded(false);
//     };
//     const handlePrev = () => {
//         setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//         setIsImageLoaded(false);
//     };
//     return (
//         <div className="relative w-full mb-6">
//             <motion.div
//                 className="relative w-full max-w-full overflow-hidden rounded-lg"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <motion.img
//                     key={images[currentImageIndex]}
//                     src={images[currentImageIndex]}
//                     alt={`Description image ${currentImageIndex + 1}`}
//                     className="w-full max-w-full object-contain"
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: isImageLoaded ? 1 : 0, x: 0 }}
//                     transition={{ duration: 0.5 }}
//                     onLoad={() => setIsImageLoaded(true)}
//                     onError={(e) => {
//                         e.target.src =
//                             "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
//                         setIsImageLoaded(true);
//                     }}
//                 />
//                 {!isImageLoaded && (
//                     <div
//                         className={`absolute inset-0 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
//                             } animate-pulse`}
//                     />
//                 )}
//             </motion.div>
//             {images.length > 1 && (
//                 <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
//                     <motion.button
//                         onClick={handlePrev}
//                         className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//                             } shadow-md hover:scale-110 transition-transform`}
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         aria-label="Previous image"
//                     >
//                         <HiArrowLeft className="h-5 w-5" />
//                     </motion.button>
//                     <motion.button
//                         onClick={handleNext}
//                         className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//                             } shadow-md hover:scale-110 transition-transform`}
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         aria-label="Next image"
//                     >
//                         <HiArrowRight className="h-5 w-5" />
//                     </motion.button>
//                 </div>
//             )}
//             {images.length > 1 && (
//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//                     {images.map((_, index) => (
//                         <motion.div
//                             key={index}
//                             className={`w-2 h-2 rounded-full ${index === currentImageIndex
//                                 ? "bg-red-600"
//                                 : isDarkMode
//                                     ? "bg-gray-600"
//                                     : "bg-gray-400"
//                                 }`}
//                             initial={{ scale: 0.8 }}
//                             animate={{ scale: index === currentImageIndex ? 1.2 : 0.8 }}
//                             transition={{ duration: 0.3 }}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // Spinning Loader Component
// const SpinningLoader = ({ isDarkMode }) => (
//     <div className="flex justify-center items-center min-h-screen">
//         <div
//             className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${isDarkMode ? "border-red-500" : "border-red-600"
//                 }`}
//         ></div>
//     </div>
// );

// const PostDetails = () => {
//     const { postId } = useParams();
//     const navigate = useNavigate();


//     const [post, setPost] = useState(null);
//     const [latestStories, setLatestStories] = useState([]);
//     const [mostViewedPosts, setMostViewedPosts] = useState([]);
//     const [relatedPosts, setRelatedPosts] = useState([]);
//     const [categoryPosts, setCategoryPosts] = useState([]);
//     const [comment, setComment] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [latestLoading, setLatestLoading] = useState(true);
//     const [mostViewedLoading, setMostViewedLoading] = useState(true);
//     const [relatedLoading, setRelatedLoading] = useState(true);
//     const [categoryLoading, setCategoryLoading] = useState(true);
//     const isAuthenticated = !!localStorage.getItem("token");
//     const [userReaction, setUserReaction] = useState({
//         like: false,
//         love: false,
//         laugh: false,
//         sad: false,
//     });
//     const [isCopied, setIsCopied] = useState(false);
//     const [reactionStreak, setReactionStreak] = useState(0);
//     const [streakRewards, setStreakRewards] = useState([]);
//     const [showMoreRelated, setShowMoreRelated] = useState(false);
//     const [isMuted, setIsMuted] = useState(true);
//     const [popularComments, setPopularComments] = useState([]);
//     const [relatedPostsCount, setRelatedPostsCount] = useState(5);
//     const [isReacting, setIsReacting] = useState(false);
//     const [isCommentReacting, setIsCommentReacting] = useState(null);
//     const [commentsPage, setCommentsPage] = useState(1);
//     const [reactionBurst, setReactionBurst] = useState(0);
//     const [placeholderText, setPlaceholderText] = useState("");
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [isAudioPlaying, setIsAudioPlaying] = useState(false);
//     const [availableVoices, setAvailableVoices] = useState([]);
//     const [isPausedByUser, setIsPausedByUser] = useState(false);
//     const [descriptionImages, setDescriptionImages] = useState([]);
//     const commentsPerPage = 5;
//     const videoRef = useRef(null);
//     const commentInputRef = useRef(null);
//     const commentsSectionRef = useRef(null);
//     // Persistent dark mode
//     // Scroll to Top Logic
//     const [showScrollTop, setShowScrollTop] = useState(false);
//     const scrollTop = () => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };
//     useEffect(() => {
//         const checkScroll = () => {
//             if (!showScrollTop && window.pageYOffset > 400) {
//                 setShowScrollTop(true);
//             } else if (showScrollTop && window.pageYOffset <= 400) {
//                 setShowScrollTop(false);
//             }
//         };
//         window.addEventListener('scroll', checkScroll);
//         return () => window.removeEventListener('scroll', checkScroll);
//     }, [showScrollTop]);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [postId]);

//     // Redirection for old ID-based URLs
//     useEffect(() => {
//         if (post && post.slug && /^[0-9a-fA-F]{24}$/.test(postId)) {
//             navigate(`/posts/${post.slug}`, { replace: true });
//         }
//     }, [post, postId, navigate]);

//     useEffect(() => {
//         const saved = localStorage.getItem("darkMode");
//         if (saved) setIsDarkMode(JSON.parse(saved));
//     }, []);
//     useEffect(() => {
//         localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//     }, [isDarkMode]);
//     const toggleDarkMode = () => {
//         setIsDarkMode(!isDarkMode);
//     };
//     // Typing Animation for Placeholder
//     const fullPlaceholder = "Write a comment...";
//     useEffect(() => {
//         let currentText = "";
//         let index = 0;
//         const typingInterval = setInterval(() => {
//             if (index < fullPlaceholder.length) {
//                 currentText += fullPlaceholder[index];
//                 setPlaceholderText(currentText);
//                 index++;
//             } else {
//                 clearInterval(typingInterval);
//                 setTimeout(() => {
//                     setPlaceholderText("");
//                     index = 0;
//                     currentText = "";
//                     setTimeout(() => typingInterval, 1000);
//                 }, 2000);
//             }
//         }, 100);
//         return () => clearInterval(typingInterval);
//     }, []);
//     // Fetch main post data
//     useEffect(() => {
//         const fetchMainPost = async () => {

//             try {
//                 // Fetch the current post
//                 const foundPostRes = await getPostById(postId);
//                 setPost(foundPostRes);
//                 // Extract images from description
//                 if (foundPostRes?.description) {
//                     const parser = new DOMParser();
//                     const doc = parser.parseFromString(
//                         foundPostRes.description,
//                         "text/html"
//                     );
//                     const images = Array.from(doc.querySelectorAll("img")).map(
//                         (img) => img.src
//                     );
//                     setDescriptionImages(images);
//                     if (images.length > 0) {
//                         const updatedDescription = foundPostRes.description.replace(
//                             /<img[^>]+>/g,
//                             ""
//                         );
//                         setPost((prev) => ({ ...prev, description: updatedDescription }));
//                     }
//                 }
//                 // Set user reactions and popular comments
//                 if (foundPostRes && isAuthenticated) {
//                     const userId = localStorage.getItem("userId");
//                     setUserReaction({
//                         like: foundPostRes.likes?.includes(userId) || false,
//                         love: foundPostRes.loves?.includes(userId) || false,
//                         laugh: foundPostRes.laughs?.includes(userId) || false,
//                         sad: foundPostRes.sads?.includes(userId) || false,
//                     });
//                     const sortedComments = [...(foundPostRes.comments || [])].sort(
//                         (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//                     );
//                     setPopularComments(sortedComments.slice(0, 2));
//                 }
//             } catch (err) {
//                 toast.error("Failed to fetch post");
//                 setPost(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMainPost();
//     }, [postId, isAuthenticated]);
//     // Fetch secondary data (latest stories, most viewed, related posts, category posts)
//     useEffect(() => {
//         const fetchSecondaryData = async () => {
//             try {
//                 // Fetch Latest Stories (sorted by createdAt descending)
//                 const latestPostsRes = await getPosts({ page: 1, limit: 15 });
//                 const latestPostsArray = Array.isArray(
//                     latestPostsRes.posts || latestPostsRes
//                 )
//                     ? latestPostsRes.posts || latestPostsRes
//                     : [];
//                 setLatestStories(
//                     latestPostsArray.sort(
//                         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//                     )
//                 );
//                 setLatestLoading(false);
//                 // Fetch Most Viewed Posts
//                 const mostViewedRes = await getPosts({ page: 1, limit: 15 });
//                 const mostViewedArray = Array.isArray(
//                     mostViewedRes.posts || mostViewedRes
//                 )
//                     ? mostViewedRes.posts || mostViewedRes
//                     : [];
//                 // Sort Most Viewed
//                 const sortedMostViewed = mostViewedArray.sort((a, b) => {
//                     const aReactions =
//                         (a.likes?.length || 0) +
//                         (a.loves?.length || 0) +
//                         (a.laughs?.length || 0) +
//                         (a.sads?.length || 0);
//                     const bReactions =
//                         (b.likes?.length || 0) +
//                         (b.loves?.length || 0) +
//                         (b.laughs?.length || 0) +
//                         (b.sads?.length || 0);
//                     return bReactions - aReactions;
//                 });

//                 // Filter out posts that are already in the top 8 of Latest Stories (Sidebar)
//                 const sidebarPostIds = new Set(latestPostsArray.slice(0, 8).map(p => p._id));
//                 const uniqueMostViewed = sortedMostViewed.filter(p => !sidebarPostIds.has(p._id));

//                 setMostViewedPosts(uniqueMostViewed);
//                 setMostViewedLoading(false);
//                 // Fetch Related Posts (filtered by hashtags)
//                 const hashtags = post?.hashtags || [];
//                 let relatedPostsArray = [];
//                 if (hashtags.length > 0) {
//                     const hashtagPromises = hashtags.map((hashtag) =>
//                         getPosts({ page: 1, limit: 10, hashtag })
//                     );
//                     const hashtagResults = await Promise.all(hashtagPromises);
//                     const allPosts = hashtagResults.flatMap((res) =>
//                         Array.isArray(res.posts || res) ? res.posts || res : []
//                     );
//                     const uniquePosts = Array.from(
//                         new Map(allPosts.map((post) => [post._id, post])).values()
//                     );
//                     relatedPostsArray = uniquePosts
//                         .filter((p) => p._id !== postId)
//                         .slice(0, showMoreRelated ? relatedPostsCount : 15);
//                 }
//                 setRelatedPosts(relatedPostsArray);
//                 setRelatedLoading(false);
//                 // Fetch Category Posts
//                 if (post?.category) {
//                     console.log("Fetching posts for category:", post.category); // Debugging
//                     const categoryPostsRes = await getPostsByCategory(post.category, {
//                         page: 1,
//                         limit: 5,
//                     });
//                     console.log("Category posts response:", categoryPostsRes); // Debugging
//                     const categoryPostsArray = Array.isArray(
//                         categoryPostsRes.posts || categoryPostsRes
//                     )
//                         ? categoryPostsRes.posts || categoryPostsRes
//                         : [];
//                     const filteredPosts = categoryPostsArray
//                         .filter((p) => p._id !== postId)
//                         .slice(0, 5);
//                     console.log("Filtered category posts:", filteredPosts); // Debugging
//                     setCategoryPosts(filteredPosts);
//                     if (filteredPosts.length === 0) {
//                         toast.warn(`No posts found for category: ${post.category}`);
//                     }
//                 } else {
//                     console.log("No category defined for post:", post); // Debugging
//                     setCategoryPosts([]);
//                     toast.warn("Post has no category defined");
//                 }
//                 setCategoryLoading(false);
//             } catch (err) {
//                 toast.error("Failed to fetch additional posts");
//                 setLatestStories([]);
//                 setMostViewedPosts([]);
//                 setRelatedPosts([]);
//                 setCategoryPosts([]);
//                 setLatestLoading(false);
//                 setMostViewedLoading(false);
//                 setRelatedLoading(false);
//                 setCategoryLoading(false);
//             }
//         };
//         if (post) {
//             fetchSecondaryData();
//         }
//     }, [post, postId, showMoreRelated, relatedPostsCount]);
//     // Fetch User Profile (for reaction streak)
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             if (!isAuthenticated) return;
//             try {
//                 const user = await getUserProfile();
//                 setReactionStreak(user.reactionStreak || 0);
//                 setStreakRewards(user.streakRewards || []);
//             } catch (err) {
//                 toast.error("Failed to fetch user profile");
//             }
//         };
//         fetchUserProfile();
//     }, [isAuthenticated]);
//     // Load available voices for speech synthesis
//     useEffect(() => {
//         const synth = window.speechSynthesis;
//         const loadVoices = () => {
//             const voices = synth.getVoices();
//             setAvailableVoices(voices);
//         };
//         loadVoices();
//         synth.onvoiceschanged = loadVoices;
//         return () => {
//             synth.onvoiceschanged = null;
//         };
//     }, []);
//     // Function to detect language and map to BCP 47 language code
//     const detectLanguage = (text) => {
//         const langCode = franc(text, { minLength: 10 });
//         const langMap = {
//             eng: "en-US",
//             tel: "te-IN",
//             hin: "hi-IN",
//             tam: "ta-IN",
//             kan: "kn-IN",
//             mal: "ml-IN",
//             ben: "bn-IN",
//             mar: "mr-IN",
//             guj: "gu-IN",
//             pan: "pa-IN",
//             urd: "ur-IN",
//         };
//         return langMap[langCode] || "en-US";
//     };
//     // Function to select a voice matching the language
//     const selectVoiceForLanguage = (lang) => {
//         const langPrefix = lang.split("-")[0].toLowerCase();
//         let matchingVoice =
//             availableVoices.find((voice) =>
//                 voice.lang.toLowerCase().startsWith(langPrefix)
//             ) ||
//             availableVoices.find((voice) =>
//                 voice.lang.toLowerCase().includes(langPrefix)
//             );
//         if (!matchingVoice) {
//             matchingVoice = availableVoices.find((voice) =>
//                 voice.lang.toLowerCase().startsWith("en")
//             );
//             if (matchingVoice) {
//                 toast.warn(`Voice for ${lang} not available. Using English voice.`);
//             }
//         }
//         return matchingVoice || null;
//     };
//     // Audio Narration Logic with Language Detection
//     const toggleAudioNarration = () => {
//         const synth = window.speechSynthesis;
//         if (isAudioPlaying) {
//             setIsPausedByUser(true);
//             synth.cancel();
//             setIsAudioPlaying(false);
//         } else {
//             if (post?.description) {
//                 const cleanDescription = post.description.replace(/<[^>]+>/g, "");
//                 const utterance = new SpeechSynthesisUtterance(cleanDescription);
//                 const detectedLang = detectLanguage(cleanDescription);
//                 utterance.lang = detectedLang;
//                 const matchingVoice = selectVoiceForLanguage(detectedLang);
//                 if (matchingVoice) {
//                     utterance.voice = matchingVoice;
//                 } else {
//                     toast.error("No suitable voice available for narration.");
//                     return;
//                 }
//                 utterance.rate = 1;
//                 utterance.pitch = 1;
//                 utterance.volume = 1;
//                 utterance.onend = () => {
//                     setIsAudioPlaying(false);
//                     setIsPausedByUser(false);
//                 };
//                 utterance.onerror = (event) => {
//                     if (!isPausedByUser) {
//                         toast.error("Failed to play audio narration");
//                     }
//                     setIsAudioPlaying(false);
//                     setIsPausedByUser(false);
//                 };
//                 synth.speak(utterance);
//                 setIsAudioPlaying(true);
//                 setIsPausedByUser(false);
//             } else {
//                 toast.error("No description available to narrate");
//             }
//         }
//     };
//     // Clean up speech synthesis on component unmount
//     useEffect(() => {
//         return () => {
//             window.speechSynthesis.cancel();
//             setIsAudioPlaying(false);
//             setIsPausedByUser(false);
//         };
//     }, []);
//     // Reaction Burst Logic
//     const handleReaction = async (type) => {
//         if (!isAuthenticated) {
//             toast.error("Please sign in to add a reaction");
//             return;
//         }
//         if (isReacting) return;
//         setIsReacting(true);
//         try {
//             const userId = localStorage.getItem("userId");
//             const newReactions = { ...userReaction, [type]: !userReaction[type] };
//             setUserReaction(newReactions);
//             const updatedReactions = await addReaction(postId, { type });
//             setPost((prevPost) => ({
//                 ...prevPost,
//                 likes: updatedReactions.likes || [],
//                 loves: updatedReactions.loves || [],
//                 laughs: updatedReactions.laughs || [],
//                 sads: updatedReactions.sads || [],
//             }));
//             const user = await getUserProfile();
//             const newStreak = user.reactionStreak || 0;
//             const newRewards = user.streakRewards || [];
//             setReactionStreak(newStreak);
//             setStreakRewards(newRewards);
//             if (newReactions[type]) {
//                 toast.success(`Reaction added! Streak: ${newStreak}`);
//                 confetti({
//                     particleCount: 50,
//                     spread: 60,
//                     origin: { y: 0.6 },
//                     colors: ["#ff0000", "#ff7300", "#fff400"],
//                 });
//                 setReactionBurst((prev) => prev + 1);
//                 setTimeout(() => {
//                     setReactionBurst((prev) => Math.max(prev - 1, 0));
//                 }, 2000);
//                 if (reactionBurst >= 2) {
//                     confetti({
//                         particleCount: 100,
//                         spread: 90,
//                         origin: { y: 0.5 },
//                         shapes: ["circle", "square"],
//                         colors: ["#ff0000", "#00ff00", "#0000ff"],
//                         scalar: 1.5,
//                     });
//                     toast.success("Reaction Burst! ðŸŽ‰ Keep it up!");
//                 }
//                 if (newRewards.includes("Reaction Streak 5")) {
//                     toast.success("ðŸŽ‰ Streak Goal Reached! Badge Earned!");
//                     confetti({
//                         particleCount: 100,
//                         spread: 70,
//                         origin: { y: 0.6 },
//                     });
//                 }
//             }
//             if (newStreak >= 3 && !showMoreRelated) {
//                 setShowMoreRelated(true);
//                 toast.success("ðŸŽ‰ More related posts unlocked!");
//             }
//         } catch (err) {
//             toast.error(err.message || "Failed to add reaction");
//             setUserReaction({ like: false, love: false, laugh: false, sad: false });
//         } finally {
//             setIsReacting(false);
//         }
//     };
//     const handleCommentSubmit = async (e) => {
//         e.preventDefault();
//         if (!isAuthenticated) {
//             toast.error("Please sign in to comment");
//             return;
//         }
//         if (!comment.trim()) {
//             toast.error("Comment cannot be empty");
//             return;
//         }
//         try {
//             await addComment(postId, { text: comment });
//             const updatedPost = await getPostById(postId);
//             setPost(updatedPost);
//             setComment("");
//             setCommentsPage(1);
//             toast.success("Comment added");
//             const sortedComments = [...(updatedPost.comments || [])].sort(
//                 (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//             );
//             setPopularComments(sortedComments.slice(0, 2));
//             commentInputRef.current?.focus();
//         } catch (err) {
//             toast.error(err.message || "Failed to add comment");
//         }
//     };
//     const handleCommentReaction = async (commentId, type) => {
//         if (!isAuthenticated) {
//             toast.error("Please sign in to react to comments");
//             return;
//         }
//         if (isCommentReacting === commentId) return;
//         setIsCommentReacting(commentId);
//         try {
//             const updatedPost = await addCommentReaction(postId, commentId, { type });
//             setPost(updatedPost);
//             const sortedComments = [...(updatedPost.comments || [])].sort(
//                 (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
//             );
//             setPopularComments(sortedComments.slice(0, 2));
//             const userId = localStorage.getItem("userId");
//             const comment = updatedPost.comments.find((c) => c._id === commentId);
//             const hasLiked = comment.likes?.includes(userId);
//             toast.success(hasLiked ? "Liked comment!" : "Unliked comment!");
//         } catch (err) {
//             toast.error(err.message || "Failed to react to comment");
//         } finally {
//             setIsCommentReacting(null);
//         }
//     };
//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !isMuted;
//             setIsMuted(!isMuted);
//         }
//     };
//     const handleScroll = useCallback(
//         debounce(() => {
//             const commentsSection = commentsSectionRef.current;
//             if (commentsSection) {
//                 const { scrollTop, scrollHeight, clientHeight } = commentsSection;
//                 if (scrollTop + clientHeight >= scrollHeight - 100) {
//                     if (
//                         post.comments?.length >
//                         commentsPage * commentsPerPage + popularComments.length
//                     ) {
//                         setCommentsPage((prev) => prev + 1);
//                     }
//                 }
//             }
//             if (
//                 window.innerHeight + document.documentElement.scrollTop >=
//                 document.documentElement.offsetHeight - 100
//             ) {
//                 setRelatedPostsCount((prev) => prev + 5);
//             }
//         }, 200),
//         [post?.comments?.length, commentsPage, popularComments.length]
//     );
//     useEffect(() => {
//         window.addEventListener("scroll", handleScroll);
//         const commentsSection = commentsSectionRef.current;
//         if (commentsSection) {
//             commentsSection.addEventListener("scroll", handleScroll);
//         }
//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//             if (commentsSection) {
//                 commentsSection.removeEventListener("scroll", handleScroll);
//             }
//             handleScroll.cancel();
//         };
//     }, [handleScroll]);
//     const scrollToCommentInput = () => {
//         commentInputRef.current?.scrollIntoView({
//             behavior: "smooth",
//             block: "center",
//         });
//         commentInputRef.current?.focus();
//     };
//     const reactionAnalytics = () => {
//         const totalReactions =
//             (post?.likes?.length || 0) +
//             (post?.loves?.length || 0) +
//             (post?.laughs?.length || 0) +
//             (post?.sads?.length || 0);
//         if (totalReactions === 0) return null;
//         return {
//             likePercent: ((post?.likes?.length || 0) / totalReactions) * 100,
//             lovePercent: ((post?.loves?.length || 0) / totalReactions) * 100,
//             laughPercent: ((post?.laughs?.length || 0) / totalReactions) * 100,
//             sadPercent: ((post?.sads?.length || 0) / totalReactions) * 100,
//             totalReactions,
//         };
//     };
//     const analytics = reactionAnalytics();
//     const postUrl = `${window.location.origin}/posts/${post?.slug || postId}`;
//     const postTitle = post?.title || "Check out this post on GossipHub!";
//     const seoTitle =
//         postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;

//     // Get first paragraph for description
//     const getFirstParagraph = (html) => {
//         if (!html) return "";
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = html;
//         const firstP = tempDiv.querySelector("p");
//         return firstP ? firstP.textContent : tempDiv.textContent.split("\n")[0];
//     };

//     const postDescription = getFirstParagraph(post?.description) || "Discover the latest gossip and stories on GossipHub!";

//     const seoDescription =
//         postDescription.length > 160
//             ? `${postDescription.slice(0, 157)}...`
//             : postDescription;
//     const postMedia = post?.media || "https://gossiphub.in/default-image.jpg";
//     const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
//     const videoThumbnail = isVideo
//         ? `${postMedia.replace(/\.(mp4|webm|ogg)$/i, "-thumbnail.jpg")}`
//         : postMedia;
//     const shareImage = isVideo ? videoThumbnail : postMedia;

//     // Updated keywords with formatted hashtags using the dynamic formatHashtag
//     const rawKeywords = post?.hashtags
//         ? [
//             ...post.hashtags.map((tag) => formatHashtag(tag)),
//             ...postTitle.split(" ").slice(0, 10),
//             "gossip",
//             "social media",
//             "entertainment",
//         ].filter(Boolean)
//         : [
//             "GossipHub",
//             "Social Media",
//             "News",
//             "Gossips",
//             "Celebrity",
//             "Tollywood",
//             "Bollywood",
//             "Hollywood",
//             "Politics",
//             "Entertainment",
//             "Technology",
//         ];

//     const keywords = rawKeywords.join(", ");

//     const authorName = post?.isAnonymous
//         ? "Anonymous"
//         : post?.postedBy?.username || post?.author?.username || "GossipHub User";
//     const datePublished = post?.createdAt
//         ? new Date(post.createdAt).toISOString()
//         : new Date().toISOString();
//     const dateModified = post?.updatedAt
//         ? new Date(post.updatedAt).toISOString()
//         : datePublished;
//     const publisherName = "GossipHub";

//     // Updated structured data with formatted hashtags
//     const structuredData = {
//         "@context": "https://schema.org",
//         "@type": "BlogPosting",
//         headline: seoTitle,
//         description: seoDescription,
//         author: { "@type": "Person", name: authorName },
//         datePublished: datePublished,
//         dateModified: dateModified,
//         image: shareImage,
//         publisher: {
//             "@type": "Organization",
//             name: publisherName,
//             logo: {
//                 "@type": "ImageObject",
//                 url: shareImage,
//                 width: 1200,
//                 height: 400,
//             },
//         },
//         mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
//         keywords: rawKeywords,
//         articleSection: post?.category || "General",
//         interactionStatistic: [
//             {
//                 "@type": "InteractionCounter",
//                 interactionType: { "@type": "LikeAction" },
//                 userInteractionCount: post?.likes?.length || 0,
//             },
//             {
//                 "@type": "InteractionCounter",
//                 interactionType: { "@type": "CommentAction" },
//                 userInteractionCount: post?.comments?.length || 0,
//             },
//         ],
//         breadcrumb: {
//             "@type": "BreadcrumbList",
//             itemListElement: [
//                 {
//                     "@type": "ListItem",
//                     position: 1,
//                     name: "Home",
//                     item: "https://gossiphub.in/",
//                 },
//                 {
//                     "@type": "ListItem",
//                     position: 2,
//                     name: post?.hashtags?.[0]
//                         ? formatHashtag(post.hashtags[0])
//                         : "General",
//                     item: `https://gossiphub.in/posts/hashtag/${post?.hashtags?.[0]
//                         ? encodeURIComponent(post.hashtags[0])
//                         : "general"
//                         }`,
//                 },
//                 {
//                     "@type": "ListItem",
//                     position: 3,
//                     name: seoTitle,
//                     item: postUrl,
//                 },
//             ],
//         },
//     };

//     const handleNativeShare = async (postMedia) => {
//         if (navigator.share) {
//             try {
//                 const shareData = {
//                     title: postTitle,
//                     text: `${postTitle}\n${postDescription.slice(0, 100)}...\n${postUrl}`,
//                     url: postUrl,
//                 };
//                 if (postMedia && !isVideo) {
//                     try {
//                         const response = await fetch(postMedia);
//                         if (!response.ok) throw new Error("Failed to fetch image");
//                         const blob = await response.blob();
//                         const file = new File([blob], "shared-image.jpg", {
//                             type: "image/jpeg",
//                         });
//                         shareData.files = [file];
//                     } catch (err) {
//                         console.error("Failed to fetch image for sharing:", err);
//                         delete shareData.files;
//                     }
//                 } else if (isVideo && videoThumbnail) {
//                     try {
//                         const response = await fetch(videoThumbnail);
//                         if (!response.ok)
//                             throw new Error("Failed to fetch video thumbnail");
//                         const blob = await response.blob();
//                         const file = new File([blob], "shared-video-thumbnail.jpg", {
//                             type: "image/jpeg",
//                         });
//                         shareData.files = [file];
//                     } catch (err) {
//                         console.error("Failed to fetch video thumbnail for sharing:", err);
//                         delete shareData.files;
//                     }
//                 }
//                 await navigator.share(shareData);
//                 toast.success("Shared successfully!");
//             } catch (err) {
//                 try {
//                     await navigator.share({
//                         title: postTitle,
//                         text: `${postTitle}\n${postDescription.slice(
//                             0,
//                             100
//                         )}...\n${postUrl}`,
//                         url: postUrl,
//                     });
//                     toast.success("Shared successfully (without media)!");
//                 } catch (fallbackErr) {
//                     toast.error("Failed to share post");
//                     console.error("Fallback share error:", fallbackErr);
//                 }
//             }
//         } else {
//             toast.info("Native sharing not supported. Use the share options below.");
//         }
//     };
//     const handleCopyLink = () => {
//         navigator.clipboard
//             .writeText(postUrl)
//             .then(() => {
//                 setIsCopied(true);
//                 toast.success("Link copied to clipboard!");
//                 setTimeout(() => setIsCopied(false), 2000);
//             })
//             .catch(() => {
//                 toast.error("Failed to copy link");
//             });
//     };
//     const handleShareTwitter = () => {
//         const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//             postUrl
//         )}&text=${encodeURIComponent(
//             `${postTitle}\n${postDescription.slice(0, 100)}...`
//         )}&via=GossipHub`;
//         window.open(twitterUrl, "_blank", "noopener,noreferrer");
//     };
//     const handleShareWhatsapp = () => {
//         const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//             `${postTitle}\n${postDescription.slice(0, 100)}...\n${postUrl}`
//         )}`;
//         window.open(whatsappUrl, "_blank", "noopener,noreferrer");
//     };
//     const handleShareFacebook = () => {
//         const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//             postUrl
//         )}&quote=${encodeURIComponent(postTitle)}`;
//         window.open(facebookUrl, "_blank", "noopener,noreferrer");
//     };
//     const handleShareTelegram = () => {
//         const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
//             postUrl
//         )}&text=${encodeURIComponent(
//             `${postTitle}\n${postDescription.slice(0, 100)}...`
//         )}`;
//         window.open(telegramUrl, "_blank", "noopener,noreferrer");
//     };
//     const handleShareLinkedin = () => {
//         const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
//             postUrl
//         )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
//             postDescription.slice(0, 200) + "..."
//         )}&source=GossipHub`;
//         window.open(linkedinUrl, "_blank", "noopener,noreferrer");
//     };
//     const handleSharePinterest = () => {
//         const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
//             postUrl
//         )}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(
//             postTitle
//         )}`;
//         window.open(pinterestUrl, "_blank", "noopener,noreferrer");
//     };
//     // Fallback UI for lazy-loaded components
//     const LoadingFallback = () => (
//         <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
//         </div>
//     );
//     if (loading) {
//         return <SpinningLoader isDarkMode={isDarkMode} />;
//     }
//     if (!post) {
//         return (
//             <div
//                 className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gray-100"
//                     }`}
//             >
//                 <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
//                     Post not found
//                 </p>
//             </div>
//         );
//     }
//     const currentIndex = latestStories.findIndex((p) => p._id === postId);
//     const prevPost = currentIndex > 0 ? latestStories[currentIndex - 1] : null;
//     const nextPost =
//         currentIndex < latestStories.length - 1 && currentIndex !== -1
//             ? latestStories[currentIndex + 1]
//             : null;
//     const isTrending =
//         (post.likes?.length || 0) +
//         (post.loves?.length || 0) +
//         (post.laughs?.length || 0) +
//         (post.sads?.length || 0) +
//         (post.comments?.length || 0) >
//         50;
//     const paginatedComments = post.comments
//         ?.filter((c) => !popularComments.find((pc) => pc._id === c._id))
//         .slice()
//         .reverse()
//         .slice(0, commentsPage * commentsPerPage);
//     const userId = localStorage.getItem("userId");
//     if (false) {
//         return (
//             <motion.div
//                 className={`min-h-screen font-poppins ${isDarkMode ? "bg-gray-950" : "bg-gray-100"
//                     } transition-colors duration-500`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 {/* SEO Metadata - React 19 Native Hoisting */}
//                 <title>{seoTitle}</title>
//                 <meta name="description" content={seoDescription} key="description" />
//                 <meta name="keywords" content={keywords} key="keywords" />
//                 <link rel="canonical" href={postUrl} />
//                 <meta name="author" content={authorName} />
//                 <meta name="publisher" content={publisherName} />
//                 <meta name="robots" content="index, follow" />

//                 {/* Open Graph / Facebook */}
//                 <meta property="og:type" content="article" />
//                 <meta property="og:url" content={postUrl} />
//                 <meta property="og:title" content={seoTitle} />
//                 <meta property="og:description" content={seoDescription} />
//                 <meta property="og:image" content={shareImage} />
//                 <meta property="og:site_name" content="GossipHub" />

//                 {/* Twitter */}
//                 <meta name="twitter:card" content="summary_large_image" />
//                 <meta name="twitter:url" content={postUrl} />
//                 <meta name="twitter:title" content={seoTitle} />
//                 <meta name="twitter:description" content={seoDescription} />
//                 <meta name="twitter:image" content={shareImage} />
//                 <meta name="twitter:creator" content="@GossipHub" />

//                 {/* Schema.org JSON-LD */}
//                 <script type="application/ld+json">
//                     {JSON.stringify(structuredData)}
//                 </script>
//                 {/* Header */}
//                 <header className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-md text-white shadow-lg">
//                     <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//                         <Link
//                             to="/"
//                             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//                             aria-label="Back to home"
//                         >
//                             <HiArrowLeft className="w-6 h-6" />
//                             Back
//                         </Link>
//                         <button
//                             onClick={toggleDarkMode}
//                             className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
//                             aria-label={
//                                 isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//                             }
//                         >
//                             {isDarkMode ? (
//                                 <HiSun className="w-5 h-5 text-yellow-500" />
//                             ) : (
//                                 <HiMoon className="w-5 h-5 text-gray-300" />
//                             )}
//                         </button>
//                     </div>
//                 </header>
//                 {/* Main Content */}
//                 <div className="max-w-7xl mx-auto lg:px-4 px-1 pt-20 pb-12 flex flex-col md:flex-row gap-6">
//                     <div className="md:w-2/3">
//                         <motion.div
//                             initial={{ opacity: 0, y: 30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, ease: "easeOut" }}
//                         >
//                             <Suspense fallback={<LoadingFallback />}>
//                                 {postMedia ? (
//                                     <PostMedia
//                                         media={postMedia}
//                                         isVideo={isVideo}
//                                         isMuted={isMuted}
//                                         toggleMute={toggleMute}
//                                         videoRef={videoRef}
//                                         isTrending={isTrending}
//                                         isDarkMode={isDarkMode}
//                                         altText={post.title}
//                                     />
//                                 ) : (
//                                     <div
//                                         className={`w-full aspect-video flex items-center justify-center rounded-t-lg shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
//                                             }`}
//                                     >
//                                         <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
//                                             No media available
//                                         </p>
//                                     </div>
//                                 )}
//                             </Suspense>
//                             <div
//                                 className={`mt-0 shadow-lg rounded-b-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
//                                     } lg:p-6 p-3 transition-colors duration-500 sticky top-20`}
//                             >
//                                 <h1
//                                     className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                         }`}
//                                 >
//                                     {post.title}
//                                 </h1>
//                                 <p
//                                     className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"
//                                         }`}
//                                 >
//                                     Posted by:{" "}
//                                     {post.isAnonymous ? (
//                                         "Anonymous"
//                                     ) : (
//                                         <Link
//                                             to={`/profile/${post.author._id}`}
//                                             className={
//                                                 isDarkMode
//                                                     ? "text-indigo-400 hover:text-indigo-300"
//                                                     : "text-indigo-600 hover:text-indigo-700"
//                                             }
//                                             aria-label={`View ${post.author.username}'s profile`}
//                                         >
//                                             {post.author?.username || "Unknown"}
//                                         </Link>
//                                     )}
//                                     <span className="mx-2 text-gray-400">&bull;</span>
//                                     {timeAgo(post.createdAt)}
//                                     <span className="mx-2 text-gray-400">&bull;</span>
//                                     {estimateReadTime(post.description)}
//                                 </p>
//                                 <div className="flex items-center mb-4">
//                                     <motion.button
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         onClick={toggleAudioNarration}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isAudioPlaying
//                                             ? "bg-red-600 text-white"
//                                             : isDarkMode
//                                                 ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                                 : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                             }`}
//                                         aria-label={
//                                             isAudioPlaying
//                                                 ? "Pause audio narration"
//                                                 : "Play audio narration"
//                                         }
//                                     >
//                                         {isAudioPlaying ? (
//                                             <HiVolumeOff className="h-5 w-5" />
//                                         ) : (
//                                             <HiVolumeUp className="h-5 w-5" />
//                                         )}
//                                         <span>
//                                             {isAudioPlaying ? "Pause Narration" : "Hear Description"}
//                                         </span>
//                                     </motion.button>
//                                 </div>
//                                 <div
//                                     className={`text-[18px] mb-6 leading-relaxed post-description ${isDarkMode ? "text-gray-200" : "text-black"
//                                         }`}
//                                     role="region"
//                                     aria-label="Post description"
//                                 >
//                                     <motion.div
//                                         initial={{ opacity: 0, y: 20 }}
//                                         whileInView={{ opacity: 1, y: 0 }}
//                                         viewport={{ once: true }}
//                                         transition={{ duration: 0.5 }}
//                                     >
//                                         {parse(post.description, {
//                                             replace: (domNode) => {
//                                                 const socialRegex = /(https?:\/\/)?(www\.)?(instagram\.com|twitter\.com|x\.com|youtube\.com|youtu\.be)\/[^\s]+/i;

//                                                 // Handle <a> tags: only replace if it's a social link
//                                                 if (domNode.name === 'a' && domNode.attribs && domNode.attribs.href) {
//                                                     if (socialRegex.test(domNode.attribs.href)) {
//                                                         return <SocialEmbed url={domNode.attribs.href} />;
//                                                     }
//                                                     // Otherwise return undefined to let parser handle it normally (preserving text)
//                                                 }

//                                                 // Handle text nodes: split text if it contains a social link
//                                                 if (domNode.type === 'text' && domNode.data) {
//                                                     const match = domNode.data.match(socialRegex);
//                                                     if (match) {
//                                                         const url = match[0];
//                                                         const splitIndex = match.index;
//                                                         const beforeText = domNode.data.substring(0, splitIndex);
//                                                         const afterText = domNode.data.substring(splitIndex + url.length);

//                                                         return (
//                                                             <>
//                                                                 {beforeText}
//                                                                 <SocialEmbed url={url} />
//                                                                 {afterText}
//                                                             </>
//                                                         );
//                                                     }
//                                                 }
//                                             }
//                                         })}
//                                     </motion.div>
//                                     {descriptionImages.length > 0 && (
//                                         <ImageCarousel
//                                             images={descriptionImages}
//                                             isDarkMode={isDarkMode}
//                                         />
//                                     )}
//                                 </div>
//                                 {/* Hashtags Section - Now uses dynamic formatHashtag */}
//                                 {post.hashtags?.length > 0 && (
//                                     <div className="flex flex-wrap gap-2 mb-6">
//                                         {post.hashtags.map((tag, index) => (
//                                             <Link
//                                                 key={index}
//                                                 to={`/posts/hashtag/${encodeURIComponent(tag)}`}
//                                                 className={`px-3 py-1 text-xs font-medium ${isDarkMode
//                                                     ? "text-gray-300 bg-red-800 hover:bg-red-700"
//                                                     : "text-red-700 bg-red-200 hover:bg-red-300"
//                                                     } rounded-full transition-colors`}
//                                                 aria-label={`View posts with hashtag ${tag}`}
//                                             >
//                                                 {formatHashtag(tag)}
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 )}
//                                 {/* Category Section */}
//                                 {post.category && (
//                                     <div className="flex flex-wrap gap-2 mb-6">
//                                         <Link
//                                             to={`/posts/category/${encodeURIComponent(post.category)}`}
//                                             className={`px-3 py-1 text-xs font-medium ${isDarkMode
//                                                 ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
//                                                 : "text-gray-700 bg-gray-100 hover:bg-gray-300"
//                                                 } rounded-full transition-colors`}
//                                             aria-label={`View posts in category ${post.category}`}
//                                         >
//                                             {post.category}
//                                         </Link>
//                                     </div>
//                                 )}
//                                 {isAuthenticated && (
//                                     <motion.div
//                                         className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
//                                         initial={{ opacity: 0, scale: 0.95 }}
//                                         animate={{ opacity: 1, scale: 1 }}
//                                         transition={{ duration: 0.5 }}
//                                     >
//                                         <h3 className="text-lg font-semibold mb-2 flex items-center">
//                                             <span className="mr-2"><FaFireAlt className="text-yellow-400" /></span> Reaction Streak
//                                         </h3>
//                                         <p className="text-sm">
//                                             React to 5 posts to earn a badge! Current Streak:{" "}
//                                             {reactionStreak}/5
//                                         </p>
//                                         <div className="w-full bg-white/30 rounded-full h-2.5 mt-2">
//                                             <motion.div
//                                                 className="bg-white h-2.5 rounded-full"
//                                                 initial={{ width: 0 }}
//                                                 animate={{
//                                                     width: `${Math.min((reactionStreak / 5) * 100, 100)}%`,
//                                                 }}
//                                                 transition={{ duration: 1 }}
//                                             />
//                                         </div>
//                                         {streakRewards.length > 0 && (
//                                             <div className="mt-2">
//                                                 <p className="text-sm font-medium">Rewards Earned:</p>
//                                                 <div className="flex gap-2 mt-1">
//                                                     {streakRewards.map((reward, idx) => (
//                                                         <motion.span
//                                                             key={idx}
//                                                             className="px-2 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full"
//                                                             initial={{ scale: 0 }}
//                                                             animate={{ scale: 1 }}
//                                                             transition={{ delay: idx * 0.2 }}
//                                                         >
//                                                             {reward}
//                                                         </motion.span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </motion.div>
//                                 )}
//                                 {analytics && (
//                                     <motion.div
//                                         className={`mb-6 p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                                             }`}
//                                         initial={{ opacity: 0, scale: 0.95 }}
//                                         animate={{ opacity: 1, scale: 1 }}
//                                         transition={{ duration: 0.5 }}
//                                     >
//                                         <h3
//                                             className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                                 }`}
//                                         >
//                                             <span className="mr-2"><FaChartBar className="text-blue-500" /></span> Reaction Analytics
//                                         </h3>
//                                         <p
//                                             className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
//                                                 }`}
//                                         >
//                                             Total Reactions: {analytics.totalReactions}
//                                         </p>
//                                         <div className="space-y-2 mt-2">
//                                             <div className="flex items-center gap-2">
//                                                 <span
//                                                     className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
//                                                         }`}
//                                                 >
//                                                     <FaThumbsUp className="text-blue-500" /> Likes: {analytics.likePercent.toFixed(1)}%
//                                                 </span>
//                                                 <div
//                                                     className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                                                         }`}
//                                                 >
//                                                     <motion.div
//                                                         className="bg-red-500 h-2 rounded-full"
//                                                         initial={{ width: 0 }}
//                                                         animate={{ width: `${analytics.likePercent}%` }}
//                                                         transition={{ duration: 1 }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <span
//                                                     className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
//                                                         }`}
//                                                 >
//                                                     <FaHeart className="text-pink-500" /> Loves: {analytics.lovePercent.toFixed(1)}%
//                                                 </span>
//                                                 <div className="w-full rounded-full h-2 bg-pink-500">
//                                                     <motion.div
//                                                         className="bg-pink-500 h-2 rounded-full"
//                                                         initial={{ width: 0 }}
//                                                         animate={{ width: `${analytics.lovePercent}%` }}
//                                                         transition={{ duration: 1 }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <span
//                                                     className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
//                                                         }`}
//                                                 >
//                                                     <FaLaugh className="text-yellow-500" /> Laughs: {analytics.laughPercent.toFixed(1)}%
//                                                 </span>
//                                                 <div
//                                                     className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                                                         }`}
//                                                 >
//                                                     <motion.div
//                                                         className="bg-yellow-500 h-2 rounded-full"
//                                                         initial={{ width: 0 }}
//                                                         animate={{ width: `${analytics.laughPercent}%` }}
//                                                         transition={{ duration: 1 }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <span
//                                                     className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
//                                                         }`}
//                                                 >
//                                                     <FaSadTear className="text-blue-400" /> Sads: {analytics.sadPercent.toFixed(1)}%
//                                                 </span>
//                                                 <div
//                                                     className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                                                         }`}
//                                                 >
//                                                     <motion.div
//                                                         className="bg-red-600 h-2 rounded-full"
//                                                         initial={{ width: 0 }}
//                                                         animate={{ width: `${analytics.sadPercent}%` }}
//                                                         transition={{ duration: 1 }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 )}
//                                 <div className="flex gap-3 mb-8 flex-wrap">
//                                     <motion.button
//                                         whileHover={{ scale: 1.15 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         onClick={() => handleReaction("like")}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.like
//                                             ? "bg-red-600 text-white"
//                                             : isDarkMode
//                                                 ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                                 : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                             } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                                         disabled={isReacting}
//                                         aria-label={`Like post (${post.likes?.length || 0} likes)${userReaction.like ? " (You liked this)" : ""
//                                             }`}
//                                     >
//                                         <motion.span
//                                             className="text-xl"
//                                             animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <FaThumbsUp />
//                                         </motion.span>
//                                         ({post.likes?.length || 0})
//                                     </motion.button>
//                                     <motion.button
//                                         whileHover={{ scale: 1.15 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         onClick={() => handleReaction("love")}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.love
//                                             ? "bg-pink-600 text-white"
//                                             : isDarkMode
//                                                 ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                                 : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                             } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                                         disabled={isReacting}
//                                         aria-label={`Love post (${post.loves?.length || 0} loves)${userReaction.love ? " (You loved this)" : ""
//                                             }`}
//                                     >
//                                         <motion.span
//                                             className="text-xl"
//                                             animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <FaHeart />
//                                         </motion.span>
//                                         ({post.loves?.length || 0})
//                                     </motion.button>
//                                     <motion.button
//                                         whileHover={{ scale: 1.15 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         onClick={() => handleReaction("laugh")}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.laugh
//                                             ? "bg-yellow-500 text-white"
//                                             : isDarkMode
//                                                 ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                                 : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                             } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                                         disabled={isReacting}
//                                         aria-label={`Laugh at post (${post.laughs?.length || 0
//                                             } laughs)${userReaction.laugh ? " (You laughed at this)" : ""
//                                             }`}
//                                     >
//                                         <motion.span
//                                             className="text-xl"
//                                             animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <FaLaugh />
//                                         </motion.span>
//                                         ({post.laughs?.length || 0})
//                                     </motion.button>
//                                     <motion.button
//                                         whileHover={{ scale: 1.15 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         onClick={() => handleReaction("sad")}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.sad
//                                             ? "bg-red-600 text-white"
//                                             : isDarkMode
//                                                 ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                                 : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                             } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
//                                         disabled={isReacting}
//                                         aria-label={`Sad reaction (${post.sads?.length || 0} sads)${userReaction.sad ? " (You felt sad about this)" : ""
//                                             }`}
//                                     >
//                                         <motion.span
//                                             className="text-xl"
//                                             animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <FaSadTear />
//                                         </motion.span>
//                                         ({post.sads?.length || 0})
//                                     </motion.button>
//                                 </div>
//                             </div>
//                         </motion.div>
//                         {/* Comments Section */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.3, duration: 0.6 }}
//                             className={`mt-0 rounded-lg lg:p-6 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
//                                 } transition-colors duration-500`}
//                         >
//                             <h3
//                                 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                     }`}
//                             >
//                                 Comments ({post.comments?.length || 0})
//                             </h3>
//                             <form
//                                 onSubmit={handleCommentSubmit}
//                                 className="mb-8 sticky top-20 z-10 md:static"
//                             >
//                                 <textarea
//                                     ref={commentInputRef}
//                                     value={comment}
//                                     onChange={(e) => setComment(e.target.value)}
//                                     placeholder={placeholderText || fullPlaceholder}
//                                     className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 shadow-sm transition-all duration-300 ${isDarkMode
//                                         ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400"
//                                         : "bg-gray-100 text-gray-900 border-gray-200 placeholder-gray-500"
//                                         }`}
//                                     aria-label="Comment input"
//                                     disabled={!isAuthenticated}
//                                 />
//                                 <div className="flex justify-between items-center mt-3">
//                                     {isAuthenticated ? (
//                                         <motion.button
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             type="submit"
//                                             className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md"
//                                             aria-label="Submit comment"
//                                         >
//                                             Post
//                                         </motion.button>
//                                     ) : (
//                                         <Link
//                                             to="/login"
//                                             className={
//                                                 isDarkMode
//                                                     ? "text-sm text-red-400 hover:underline"
//                                                     : "text-sm text-red-600 hover:underline"
//                                             }
//                                         >
//                                             Sign in to comment
//                                         </Link>
//                                     )}
//                                 </div>
//                             </form>
//                             <div
//                                 ref={commentsSectionRef}
//                                 className="max-h-[50vh] overflow-y-auto scrollbar-hide"
//                             >
//                                 {popularComments.length > 0 && (
//                                     <div className="mb-8">
//                                         <h4
//                                             className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                                 }`}
//                                         >
//                                             <span className="mr-2"><FaStar className="text-yellow-500" /></span> Popular Comments
//                                         </h4>
//                                         <Suspense fallback={<LoadingFallback />}>
//                                             <AnimatePresence>
//                                                 {popularComments.map((c) => (
//                                                     <Comment
//                                                         key={c._id}
//                                                         comment={{ ...c, isPopular: true }}
//                                                         handleCommentReaction={handleCommentReaction}

//                                                         isCommentReacting={isCommentReacting}
//                                                         userId={userId}
//                                                         isAuthenticated={isAuthenticated}
//                                                         isDarkMode={isDarkMode}
//                                                     />
//                                                 ))}
//                                             </AnimatePresence>
//                                         </Suspense>
//                                     </div>
//                                 )}
//                                 <Suspense fallback={<LoadingFallback />}>
//                                     <AnimatePresence>
//                                         {post.comments?.length === 0 ? (
//                                             <motion.p
//                                                 initial={{ opacity: 0 }}
//                                                 animate={{ opacity: 1 }}
//                                                 exit={{ opacity: 0 }}
//                                                 className={`text-center italic ${isDarkMode ? "text-gray-400" : "text-gray-500"
//                                                     }`}
//                                             >
//                                                 No comments yet. Be the first to comment!
//                                             </motion.p>
//                                         ) : (
//                                             paginatedComments.map((c) => (
//                                                 <Comment
//                                                     key={c._id}
//                                                     comment={{ ...c, isPopular: false }}
//                                                     handleCommentReaction={handleCommentReaction}
//                                                     isCommentReacting={isCommentReacting}
//                                                     userId={userId}
//                                                     isAuthenticated={isAuthenticated}
//                                                     isDarkMode={isDarkMode}
//                                                 />
//                                             ))
//                                         )}
//                                     </AnimatePresence>
//                                 </Suspense>
//                             </div>
//                         </motion.div>
//                         {/* Navigation */}
//                         <motion.div
//                             className="mt-6 flex justify-between gap-4"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.5, duration: 0.6 }}
//                         >
//                             {prevPost && (
//                                 <Link
//                                     to={`/posts/${prevPost._id}`}
//                                     className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isDarkMode
//                                         ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                         : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                         }`}
//                                     onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//                                 >
//                                     <HiArrowLeft className="h-5 w-5" />
//                                     Previous Post
//                                 </Link>
//                             )}
//                             {nextPost && (
//                                 <Link
//                                     to={`/posts/${nextPost._id}`}
//                                     className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ml-auto ${isDarkMode
//                                         ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
//                                         : "bg-gray-200 text-gray-900 hover:bg-gray-300"
//                                         }`}
//                                     onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//                                 >
//                                     Next Post
//                                     <HiArrowRight className="h-5 w-5" />
//                                 </Link>
//                             )}
//                         </motion.div>
//                         {/* Related Posts */}
//                         <motion.div
//                             className={`mt-6 rounded-lg lg:p-6 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
//                                 } transition-colors duration-500`}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.5, duration: 0.6 }}
//                         >
//                             <h3
//                                 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                     }`}
//                             >
//                                 Related Posts
//                             </h3>
//                             <AnimatePresence>
//                                 {relatedLoading ? (
//                                     <LoadingFallback />
//                                 ) : relatedPosts.length === 0 ? (
//                                     <motion.p
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         exit={{ opacity: 0 }}
//                                         className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
//                                             }`}
//                                     >
//                                         No related posts found for these hashtags.
//                                     </motion.p>
//                                 ) : (
//                                     <div className="space-y-4">
//                                         {relatedPosts.map((story, index) => (
//                                             <motion.div
//                                                 key={story._id}
//                                                 initial={{ opacity: 0, y: 20 }}
//                                                 whileInView={{ opacity: 1, y: 0 }}
//                                                 viewport={{ once: true }}
//                                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                             >
//                                                 <Link
//                                                     to={`/posts/${story._id}`}
//                                                     className="flex gap-3"
//                                                     onClick={() =>
//                                                         window.scrollTo({ top: 0, behavior: "smooth" })
//                                                     }
//                                                 >
//                                                     {story.media &&
//                                                         (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                                                             <video
//                                                                 src={story.media}
//                                                                 className="w-16 h-16 object-cover rounded"
//                                                                 muted={true}
//                                                                 loading="lazy"
//                                                                 onError={(e) =>
//                                                                 (e.target.src =
//                                                                     "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
//                                                                 }
//                                                             />
//                                                         ) : (
//                                                             <img
//                                                                 src={story.media}
//                                                                 alt={story.title}
//                                                                 className="w-16 h-16 object-cover rounded"
//                                                                 loading="lazy"
//                                                                 onError={(e) =>
//                                                                 (e.target.src =
//                                                                     "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                                                 }
//                                                             />
//                                                         ))}
//                                                     <div>
//                                                         <p
//                                                             className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                                                 }`}
//                                                         >
//                                                             {story.title}
//                                                         </p>
//                                                         <div className="flex flex-wrap gap-1 mt-1">
//                                                             {story.hashtags?.slice(0, 3).map((tag, idx) => (
//                                                                 <Link
//                                                                     key={idx}
//                                                                     to={`/posts/hashtag/${encodeURIComponent(tag)}`}
//                                                                     className={`text-xs ${isDarkMode
//                                                                         ? "text-gray-400 hover:text-red-400"
//                                                                         : "text-gray-500 hover:text-red-600"
//                                                                         }`}
//                                                                 >
//                                                                     #{formatHashtag(tag)}
//                                                                 </Link>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </Link>
//                                             </motion.div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </AnimatePresence>
//                         </motion.div>
//                     </div >
//                     {/* Sidebar */}
//                     < div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide" >
//                         {/* Latest Stories */}
//                         < motion.div
//                             className={`rounded-lg lg:p-4 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
//                                 } transition-colors duration-500`}
//                             initial={{ opacity: 0, x: 20 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ duration: 0.6 }}
//                         >
//                             <h3
//                                 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                     }`}
//                             >
//                                 Latest Stories
//                             </h3>
//                             <div className="space-y-4">
//                                 {latestLoading ? (
//                                     <LoadingFallback />
//                                 ) : latestStories.length === 0 ? (
//                                     <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
//                                         No latest stories available.
//                                     </p>
//                                 ) : (
//                                     latestStories.map((story, index) => (
//                                         <motion.div
//                                             key={story._id}
//                                             initial={{ opacity: 0, x: 20 }}
//                                             whileInView={{ opacity: 1, x: 0 }}
//                                             viewport={{ once: true }}
//                                             transition={{ delay: index * 0.1 }}
//                                         >
//                                             <Link
//                                                 to={`/posts/${story._id}`}
//                                                 className="flex gap-3"
//                                                 onClick={() =>
//                                                     window.scrollTo({ top: 0, behavior: "smooth" })
//                                                 }
//                                             >
//                                                 {story.media &&
//                                                     (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                                                         <video
//                                                             src={story.media}
//                                                             className="w-16 h-16 object-cover rounded"
//                                                             muted={true}
//                                                             loading="lazy"
//                                                             onError={(e) =>
//                                                             (e.target.src =
//                                                                 "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
//                                                             }
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src={story.media}
//                                                             alt={`Story: ${story.title}`}
//                                                             className="w-16 h-16 object-cover rounded"
//                                                             loading="lazy"
//                                                             onError={(e) =>
//                                                             (e.target.src =
//                                                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                                             }
//                                                         />
//                                                     ))}
//                                                 <div>
//                                                     <p
//                                                         className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                                             }`}
//                                                     >
//                                                         {story.title}
//                                                     </p>
//                                                     <p
//                                                         className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
//                                                             }`}
//                                                     >
//                                                         {story.category || "General"}
//                                                     </p>
//                                                 </div>
//                                             </Link>
//                                         </motion.div>
//                                     ))
//                                 )}
//                             </div>
//                         </motion.div >
//                         {/* Category Posts */}
//                         < motion.div
//                             className={`rounded-lg lg:p-4 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
//                                 } transition-colors duration-500`}
//                             initial={{ opacity: 0, x: 20 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ duration: 0.6, delay: 0.1 }}
//                         >
//                             <h3
//                                 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                     }`}
//                             >
//                                 {post?.category || "Category"} Posts
//                             </h3>
//                             <div className="space-y-4">
//                                 {categoryLoading ? (
//                                     <LoadingFallback />
//                                 ) : categoryPosts.length === 0 ? (
//                                     <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
//                                         No posts available in this category.
//                                     </p>
//                                 ) : (
//                                     categoryPosts.map((story, index) => (
//                                         <motion.div
//                                             key={story._id}
//                                             initial={{ opacity: 0, x: 20 }}
//                                             whileInView={{ opacity: 1, x: 0 }}
//                                             viewport={{ once: true }}
//                                             transition={{ delay: index * 0.1 }}
//                                         >
//                                             <Link
//                                                 to={`/posts/${story.slug || story._id}`}
//                                                 className="flex gap-3"
//                                                 onClick={() =>
//                                                     window.scrollTo({ top: 0, behavior: "smooth" })
//                                                 }
//                                             >
//                                                 {story.media &&
//                                                     (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                                                         <video
//                                                             src={story.media}
//                                                             className="w-16 h-16 object-cover rounded"
//                                                             muted={true}
//                                                             loading="lazy"
//                                                             onError={(e) =>
//                                                             (e.target.src =
//                                                                 "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
//                                                             }
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src={story.media}
//                                                             alt={`Category post: ${story.title}`}
//                                                             className="w-16 h-16 object-cover rounded"
//                                                             loading="lazy"
//                                                             onError={(e) =>
//                                                             (e.target.src =
//                                                                 "https://developers.element or.com/docs/assets/img/elementor-placeholder-image.png")
//                                                             }
//                                                         />
//                                                     ))}
//                                                 <div>
//                                                     <p
//                                                         className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                                             }`}
//                                                     >
//                                                         {story.title}
//                                                     </p>
//                                                     <p
//                                                         className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
//                                                             }`}
//                                                     >
//                                                         {timeAgo(story.createdAt)}
//                                                     </p>
//                                                 </div>
//                                             </Link>
//                                         </motion.div>
//                                     ))
//                                 )}
//                             </div>
//                         </motion.div >
//                         {/* Most Viewed Posts */}
//                         < motion.div
//                             className={`rounded-lg lg:p-4 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
//                                 } transition-colors duration-500`}
//                             initial={{ opacity: 0, x: 20 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ duration: 0.6, delay: 0.2 }}
//                         >
//                             <h3
//                                 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                     }`}
//                             >
//                                 Most Viewed Posts
//                             </h3>
//                             <div className="space-y-4">
//                                 {mostViewedLoading ? (
//                                     <LoadingFallback />
//                                 ) : mostViewedPosts.length === 0 ? (
//                                     <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
//                                         No trending posts available.
//                                     </p>
//                                 ) : (
//                                     mostViewedPosts.map((story, index) => (
//                                         <motion.div
//                                             key={story._id}
//                                             initial={{ opacity: 0, x: 20 }}
//                                             whileInView={{ opacity: 1, x: 0 }}
//                                             viewport={{ once: true }}
//                                             transition={{ delay: index * 0.1 }}
//                                         >
//                                             <Link
//                                                 to={`/posts/${story.slug || story._id}`}
//                                                 className="flex gap-3"
//                                                 onClick={() =>
//                                                     window.scrollTo({ top: 0, behavior: "smooth" })
//                                                 }
//                                             >
//                                                 {story.media &&
//                                                     (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
//                                                         <video
//                                                             src={story.media}
//                                                             className="w-16 h-16 object-cover rounded"
//                                                             muted={true}
//                                                             loading="lazy"
//                                                             onError={(e) =>
//                                                             (e.target.src =
//                                                                 "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
//                                                             }
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src={story.media}
//                                                             alt={`Trending post: ${story.title}`}
//                                                             className="w-16 h-16 object-cover rounded"
//                                                             loading="lazy"
//                                                             onError={(e) =>
//                                                             (e.target.src =
//                                                                 "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
//                                                             }
//                                                         />
//                                                     ))}
//                                                 <div>
//                                                     <p
//                                                         className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
//                                                             }`}
//                                                     >
//                                                         {story.title}
//                                                     </p>
//                                                     <p
//                                                         className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
//                                                             }`}
//                                                     >
//                                                         {timeAgo(story.createdAt)}
//                                                     </p>
//                                                 </div>
//                                             </Link>
//                                         </motion.div>
//                                     ))
//                                 )}
//                             </div>
//                         </motion.div >
//                         {/* Share Section */}

//                         < Suspense fallback={< LoadingFallback />}>
//                             <ShareBar
//                                 handleNativeShare={() => handleNativeShare(postMedia)}
//                                 handleCopyLink={handleCopyLink}
//                                 handleShareTwitter={handleShareTwitter}
//                                 handleShareWhatsapp={handleShareWhatsapp}
//                                 handleShareFacebook={handleShareFacebook}
//                                 handleShareTelegram={handleShareTelegram}
//                                 handleShareLinkedin={handleShareLinkedin}
//                                 handleSharePinterest={handleSharePinterest}
//                                 isCopied={isCopied}
//                                 isDarkMode={isDarkMode}
//                             />
//                         </Suspense >
//                     </div >
//                 </div >


//                 {/* Floating Comment Button for Mobile */}

//             </motion.div >
//         );
//     }



//     // Scroll to Top Logic


//     // NEW NEO-GLASS UI IMPLEMENTATION
//     return (
//         <div className={`min-h-screen font-poppins transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0f0f] text-gray-100' : 'bg-[#f0f2f5] text-gray-900'}`}>
//             {/* SEO Metadata */}
//             <title>{seoTitle}</title>
//             <meta name="description" content={seoDescription} />
//             <meta name="keywords" content={keywords} />
//             <link rel="canonical" href={postUrl} />
//             <meta name="author" content={authorName} />

//             {/* Header */}
//             <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${isDarkMode ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border-white/10' : 'bg-gradient-to-r from-red-100/70 to-orange-100/70 border-white/20'} transition-all duration-300`}>
//                 <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
//                     <Link to="/" className="flex items-center gap-2 font-medium hover:opacity-80 transition-opacity">
//                         <div className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
//                             <HiArrowLeft className="w-5 h-5" />
//                         </div>
//                         <span>Back to Feed</span>
//                     </Link>
//                     <button
//                         onClick={toggleDarkMode}
//                         className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-indigo-500/10 text-indigo-600'}`}
//                     >
//                         {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
//                     </button>
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto pt-20 pb-12 px-2 sm:px-4 flex flex-col lg:flex-row gap-8">
//                 {/* Left Column: Post Content */}
//                 <div className="lg:w-[65%] space-y-8">
//                     {/* Media Section */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className={`rounded-3xl overflow-hidden shadow-2xl relative group ${isDarkMode ? 'bg-black' : 'bg-gray-200'}`}
//                     >
//                         <Suspense fallback={<div className="aspect-video w-full bg-gray-800 animate-pulse" />}>
//                             {postMedia ? (
//                                 <PostMedia
//                                     media={postMedia}
//                                     isVideo={isVideo}
//                                     isMuted={isMuted}
//                                     toggleMute={toggleMute}
//                                     videoRef={videoRef}
//                                     isTrending={isTrending}
//                                     isDarkMode={isDarkMode}
//                                     altText={post.title}
//                                 />
//                             ) : (
//                                 <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
//                                     <span className="text-gray-500">No media available</span>
//                                 </div>
//                             )}
//                         </Suspense>
//                     </motion.div>

//                     {/* Post Meta & Title */}
//                     <div className="space-y-4">
//                         <div className="flex flex-wrap gap-2">
//                             {post.category && (
//                                 <Link
//                                     to={`/posts/category/${encodeURIComponent(post.category)}`}
//                                     className={`px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-red-50 text-red-600 border-red-100'}`}
//                                 >
//                                     {post.category}
//                                 </Link>
//                             )}
//                             <span className={`px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
//                                 {estimateReadTime(post.description)}
//                             </span>
//                         </div>

//                         <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
//                             {post.title}
//                         </h1>

//                         <div className="flex items-center justify-between border-b pb-6 border-dashed border-gray-700/50">
//                             <div className="flex items-center gap-3">
//                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${isDarkMode ? 'bg-gradient-to-tr from-gray-800 to-gray-700' : 'bg-white shadow-sm'}`}>
//                                     {post.isAnonymous ? '?' : (post.author?.username?.[0] || 'U')}
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-sm">
//                                         {post.isAnonymous ? 'Anonymous' : (
//                                             <Link to={`/profile/${post.author._id}`} className="hover:text-red-500 transition-colors">
//                                                 {post.author?.username || "Unknown"}
//                                             </Link>
//                                         )}
//                                     </p>
//                                     <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                         {timeAgo(post.createdAt)}
//                                     </p>
//                                 </div>
//                             </div>

//                             <motion.button
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={toggleAudioNarration}
//                                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isAudioPlaying ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : (isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-white border hover:bg-gray-50 text-gray-700')}`}
//                             >
//                                 {isAudioPlaying ? <HiVolumeUp className="animate-pulse" /> : <HiVolumeOff />}
//                                 <span className="hidden sm:inline">{isAudioPlaying ? 'Playing...' : 'Audio Mode'}</span>
//                             </motion.button>
//                         </div>
//                     </div>

//                     {/* Content Body */}
//                     <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-p:text-gray-300 prose-headings:text-gray-100' : 'prose-p:text-gray-700'} post-description`}>
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             whileInView={{ opacity: 1 }}
//                             viewport={{ once: true }}
//                         >
//                             {parse(post.description, {
//                                 replace: (domNode) => {
//                                     const socialRegex = /(https?:\/\/)?(www\.)?(instagram\.com|twitter\.com|x\.com|youtube\.com|youtu\.be)\/[^\s]+/i;
//                                     if (domNode.name === 'a' && domNode.attribs && domNode.attribs.href && socialRegex.test(domNode.attribs.href)) {
//                                         return <SocialEmbed url={domNode.attribs.href} />;
//                                     }

//                                     if (domNode.type === 'text' && domNode.data) {
//                                         const match = domNode.data.match(socialRegex);
//                                         if (match) {
//                                             const url = match[0];
//                                             const splitIndex = match.index;
//                                             return (
//                                                 <>
//                                                     {domNode.data.substring(0, splitIndex)}
//                                                     <SocialEmbed url={url} />
//                                                     {domNode.data.substring(splitIndex + url.length)}
//                                                 </>
//                                             );
//                                         }
//                                     }
//                                 }
//                             })}
//                         </motion.div>
//                         {descriptionImages.length > 0 && <ImageCarousel images={descriptionImages} isDarkMode={isDarkMode} />}
//                     </div>

//                     {/* Hashtags */}
//                     {post.hashtags?.length > 0 && (
//                         <div className="flex flex-wrap gap-2 pt-4">
//                             {post.hashtags.map((tag, index) => (
//                                 <Link
//                                     key={index}
//                                     to={`/posts/hashtag/${encodeURIComponent(tag)}`}
//                                     className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${isDarkMode
//                                         ? 'bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 text-gray-400 hover:border-red-500/50 hover:text-red-400'
//                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                                 >
//                                     #{formatHashtag(tag)}
//                                 </Link>
//                             ))}
//                         </div>
//                     )}

//                     {/* Interaction Bar (Large) */}
//                     <div className={`p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
//                         <div className="flex gap-4">
//                             {[
//                                 { id: 'like', icon: FaThumbsUp, label: 'Like', color: 'text-blue-500', bg: 'bg-blue-500/10' },
//                                 { id: 'love', icon: FaHeart, label: 'Love', color: 'text-pink-500', bg: 'bg-pink-500/10' },
//                                 { id: 'laugh', icon: FaLaugh, label: 'Laugh', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
//                                 { id: 'sad', icon: FaSadTear, label: 'Sad', color: 'text-purple-500', bg: 'bg-purple-500/10' }
//                             ].map((reaction) => (
//                                 <motion.button
//                                     key={reaction.id}
//                                     whileHover={{ scale: 1.1, y: -2 }}
//                                     whileTap={{ scale: 0.9 }}
//                                     onClick={() => handleReaction(reaction.id)}
//                                     disabled={isReacting}
//                                     className={`relative group flex flex-col items-center gap-1 ${isReacting ? 'opacity-50' : ''}`}
//                                 >
//                                     <div className={`p-4 rounded-2xl text-2xl transition-all duration-300 ${userReaction[reaction.id] ? `${reaction.bg} ${reaction.color} shadow-lg ring-1 ring-inset ring-white/20` : (isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}`}>
//                                         <reaction.icon />
//                                     </div>
//                                     <span className="text-xs font-medium opacity-60">{post[`${reaction.id}s`]?.length || 0}</span>
//                                 </motion.button>
//                             ))}
//                         </div>

//                         {/* Reaction Streak Mini-Widget */}
//                         {isAuthenticated && (
//                             <div className="text-right hidden sm:block">
//                                 <p className="text-xs font-medium opacity-50 uppercase tracking-widest mb-1">Your Streak</p>
//                                 <div className="flex items-center gap-2">
//                                     <div className="flex gap-0.5">
//                                         {[...Array(5)].map((_, i) => (
//                                             <div key={i} className={`h-2 w-6 rounded-full ${i < reactionStreak ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-700/20'}`} />
//                                         ))}
//                                     </div>
//                                     <span className="text-sm font-bold text-orange-500">{reactionStreak}/5</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Comments */}
//                     <div className={`rounded-3xl p-6 md:p-8 backdrop-blur-xl border ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-white shadow-xl shadow-gray-200/50'}`}>
//                         <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
//                             Comments <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>{post.comments?.length || 0}</span>
//                         </h3>

//                         <form onSubmit={handleCommentSubmit} className="relative mb-10">
//                             <div className={`rounded-2xl p-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-red-500/50 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
//                                 <textarea
//                                     ref={commentInputRef}
//                                     value={comment}
//                                     onChange={(e) => setComment(e.target.value)}
//                                     placeholder={placeholderText || fullPlaceholder}
//                                     disabled={!isAuthenticated}
//                                     className={`w-full bg-transparent p-4 min-h-[100px] resize-none focus:outline-none ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
//                                 />
//                                 <div className="flex justify-between items-center px-4 pb-2">
//                                     <div className="flex gap-2 text-gray-400">
//                                         {/* Optional formatting icons could go here */}
//                                     </div>
//                                     {isAuthenticated ? (
//                                         <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-red-600/20">
//                                             Post Comment
//                                         </button>
//                                     ) : (
//                                         <Link to="/login" className="text-sm text-red-500 hover:underline font-medium">Sign in to comment</Link>
//                                     )}
//                                 </div>
//                             </div>
//                         </form>

//                         <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
//                             <AnimatePresence>
//                                 {post.comments?.length === 0 ? (
//                                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 opacity-50">
//                                         <HiChat className="w-12 h-12 mx-auto mb-3" />
//                                         <p>No comments yet. Start the conversation!</p>
//                                     </motion.div>
//                                 ) : (
//                                     <>
//                                         {popularComments.map(c => (
//                                             <Comment key={c._id} comment={{ ...c, isPopular: true }} handleCommentReaction={handleCommentReaction} isCommentReacting={isCommentReacting} userId={userId} isAuthenticated={isAuthenticated} isDarkMode={isDarkMode} />
//                                         ))}
//                                         {paginatedComments.map(c => (
//                                             <Comment key={c._id} comment={{ ...c, isPopular: false }} handleCommentReaction={handleCommentReaction} isCommentReacting={isCommentReacting} userId={userId} isAuthenticated={isAuthenticated} isDarkMode={isDarkMode} />
//                                         ))}
//                                     </>
//                                 )}
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                     {/* Read Next Section (Below Comments) */}
//                     <div className={`mt-12 p-8 rounded-3xl border ${isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
//                         <h3 className="text-2xl font-bold mb-6">Read Next</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {mostViewedPosts.slice(0, 4).map((story) => (
//                                 <Link key={story._id} to={`/posts/${story._id}`} className="group cursor-pointer">
//                                     <div className="aspect-video rounded-2xl overflow-hidden mb-3 bg-gray-800 relative">
//                                         {story.media && (/\.(mp4|webm|ogg)$/i.test(story.media) ? <video src={story.media} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <img src={story.media} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />)}
//                                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
//                                     </div>
//                                     <h4 className={`font-bold text-lg leading-tight mb-2 group-hover:text-red-500 transition-colors ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{story.title}</h4>
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </div>


//                 {/* Right Column: Sidebar */}
//                 <aside className="lg:w-[35%] space-y-6">
//                     {/* Author Bio Card */}
//                     {!post.isAnonymous && post.author && (
//                         <div className={`p-6 rounded-3xl backdrop-blur-md border ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black border-white/10' : 'bg-gradient-to-br from-white to-gray-50 border-white shadow-xl shadow-indigo-100/50'}`}>
//                             <div className="flex items-center gap-4 mb-4">
//                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-offset-4 ${isDarkMode ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 ring-offset-black ring-gray-800' : 'bg-white shadow-md ring-offset-white ring-gray-100'}`}>
//                                     {post.author.username?.[0] || 'U'}
//                                 </div>
//                                 <div>
//                                     <h4 className="text-xl font-bold">{post.author.username}</h4>
//                                     <p className="text-sm opacity-60">Author</p>
//                                 </div>
//                             </div>
//                             <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 Check out more stories from {post.author.username}.
//                             </p>
//                             <Link
//                                 to={`/profile/${post.author._id}`}
//                                 className={`block w-full py-3 rounded-xl text-center font-bold transition-all ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
//                             >
//                                 View Profile
//                             </Link>
//                         </div>
//                     )}
//                     {/* Share Card */}
//                     <div className={`p-6 rounded-3xl backdrop-blur-md border ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black border-white/10' : 'bg-gradient-to-br from-white to-gray-50 border-white shadow-xl shadow-indigo-100/50'}`}>
//                         <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
//                             <HiShare className="text-red-500" /> Share this post
//                         </h4>
//                         <div className="grid grid-cols-4 gap-3">
//                             <button onClick={handleShareTwitter} className="p-3 rounded-2xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all flex justify-center"><FaTwitter className="text-xl" /></button>
//                             <button onClick={handleShareWhatsapp} className="p-3 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex justify-center"><FaWhatsapp className="text-xl" /></button>
//                             <button onClick={handleShareFacebook} className="p-3 rounded-2xl bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2] hover:text-white transition-all flex justify-center"><FaFacebook className="text-xl" /></button>
//                             <button onClick={handleSharePinterest} className="p-3 rounded-2xl bg-[#E60023]/10 text-[#E60023] hover:bg-[#E60023] hover:text-white transition-all flex justify-center"><FaPinterest className="text-xl" /></button>
//                             <button onClick={handleShareLinkedin} className="p-3 rounded-2xl bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all flex justify-center"><FaLinkedin className="text-xl" /></button>

//                             <button onClick={handleCopyLink} className={`p-3 rounded-2xl transition-all flex justify-center ${isCopied ? 'bg-green-500 text-white' : (isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200')}`}><HiBookmark className="w-6 h-6" /></button>
//                         </div>
//                     </div>

//                     {/* Analytics Card */}
//                     {analytics && (
//                         <div className={`p-6 rounded-3xl backdrop-blur-md border ${isDarkMode ? 'bg-gray-900/40 border-white/5' : 'bg-white border-gray-100 shadow-lg'}`}>
//                             <h4 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Sentiment Analysis</h4>
//                             <div className="space-y-4">
//                                 {[
//                                     { label: 'Likes', val: analytics.likePercent, color: 'bg-blue-500' },
//                                     { label: 'Loves', val: analytics.lovePercent, color: 'bg-pink-500' },
//                                     { label: 'Laughs', val: analytics.laughPercent, color: 'bg-yellow-500' },
//                                     { label: 'Sads', val: analytics.sadPercent, color: 'bg-purple-500' },
//                                 ].map((item, idx) => (
//                                     <div key={idx}>
//                                         <div className="flex justify-between text-xs mb-1 font-medium">
//                                             <span>{item.label}</span>
//                                             <span>{item.val.toFixed(0)}%</span>
//                                         </div>
//                                         <div className={`h-1.5 w-full rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                                             <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <p className="text-center text-xs mt-4 opacity-50">{analytics.totalReactions} total reactions</p>
//                         </div>
//                     )}

//                     {/* Category Stories (New Section) */}
//                     {categoryPosts.length > 0 && (
//                         <div className={`rounded-3xl overflow-hidden border ${isDarkMode ? 'bg-gray-900/60 border-white/5' : 'bg-white border-gray-100 shadow-lg'}`}>
//                             <div className="p-5 border-b border-gray-100/10">
//                                 <h3 className="font-bold text-lg">More in {post.category || 'this category'}</h3>
//                             </div>
//                             <div className="p-2">
//                                 {categoryPosts.map((story) => (
//                                     <Link key={story._id} to={`/posts/${story._id}`} className={`flex gap-4 p-3 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
//                                         <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden relative">
//                                             {story.media && (/\.(mp4|webm|ogg)$/i.test(story.media) ? <video src={story.media} className="w-full h-full object-cover" /> : <img src={story.media} alt={story.title} className="w-full h-full object-cover" />)}
//                                         </div>
//                                         <div className="flex-1 min-w-0 flex flex-col justify-center">
//                                             <h5 className="font-semibold text-sm leading-snug line-clamp-2 mb-1">{story.title}</h5>
//                                             <p className="text-xs opacity-50">{timeAgo(story.createdAt)}</p>
//                                         </div>
//                                     </Link>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Latest Stories Tabs */}
//                     <div className={`rounded-3xl overflow-hidden border ${isDarkMode ? 'bg-gray-900/60 border-white/5' : 'bg-white border-gray-100 shadow-lg'}`}>
//                         <div className="p-5 border-b border-gray-100/10">
//                             <h3 className="font-bold text-lg">More from GossipHub</h3>
//                         </div>
//                         <div className="p-2">
//                             {latestStories.slice(0, 8).map((story) => (
//                                 <Link key={story._id} to={`/posts/${story._id}`} className={`flex gap-4 p-3 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
//                                     <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden relative">
//                                         {story.media && (/\.(mp4|webm|ogg)$/i.test(story.media) ? <video src={story.media} className="w-full h-full object-cover" /> : <img src={story.media} alt={story.title} className="w-full h-full object-cover" />)}
//                                     </div>
//                                     <div className="flex-1 min-w-0 flex flex-col justify-center">
//                                         <h5 className="font-semibold text-sm leading-snug line-clamp-2 mb-1">{story.title}</h5>
//                                         <p className="text-xs opacity-50">{timeAgo(story.createdAt)}</p>
//                                     </div>
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </aside>
//             </main>

//             {/* Scroll to Top Button */}
//             <AnimatePresence>
//                 {showScrollTop && (
//                     <motion.button
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.8 }}
//                         onClick={scrollTop}
//                         className={`fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 p-3 rounded-full shadow-xl transition-all ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
//                     >
//                         <HiArrowUp className="w-6 h-6" />
//                     </motion.button>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default PostDetails;


import {
    useState,
    useEffect,
    useRef,
    useCallback,
    lazy,
    Suspense,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import debounce from "lodash/debounce";
// import { franc } from "franc";
import {
    HiArrowLeft,
    HiArrowRight,
    HiVolumeUp,
    HiVolumeOff,
    HiShare,
    HiHeart,
    HiChat,
    HiBookmark,
    HiSun,
    HiMoon,
} from "react-icons/hi";
import { FaThumbsUp, FaHeart, FaLaugh, FaSadTear, FaFireAlt, FaChartBar, FaStar, FaComment } from "react-icons/fa";
import {
    getPosts,
    getPostById,
    addReaction,
    addComment,
    addCommentReaction,
    getUserProfile,
    getPostsByCategory,
} from "../utils/api";
import parse from 'html-react-parser';
import SocialEmbed from "./SocialEmbed";
// Lazy-loaded components
const PostMedia = lazy(() => import("./PostMedia"));
const Comment = lazy(() => import("./Comment"));
const ShareBar = lazy(() => import("./ShareBar"));

// Utility function to calculate time difference and return "time ago" format
export const timeAgo = (date) => {
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
    if (diffInDays < 30)
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
};

// Utility to estimate read time (assuming 200 words per minute)
const estimateReadTime = (text) => {
    const words = text?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return minutes === 0 ? "Less than a minute" : `${minutes} min read`;
};

// Dynamic Utility to format hashtags: splits camelCase or PascalCase into words with proper capitalization
// const formatHashtag = (tag) => {
//   const cleaned = tag.replace(/^#/, "").trim();
//   if (!cleaned) return "";
//   // Insert space before each uppercase letter (except first if it's the start), and handle numbers/acronyms gracefully
//   let spaced = cleaned.replace(/([A-Z0-9])/g, " $1").trim();
//   // Capitalize first letter
//   spaced = spaced.charAt(0).toUpperCase() + spaced.slice(1);
//   // Handle cases like "Pyaar2" -> "Pyaar 2"
//   spaced = spaced.replace(/(\d+)/g, " $1");
//   return spaced.trim();
// };
const formatHashtag = (tag) => {
    if (!tag) return "";
    // Remove '#' and trim spaces
    let cleaned = tag.replace(/^#/, "").trim();
    if (!cleaned) return "";

    // Handle CamelCase: add space before uppercase or number
    let spaced = cleaned.replace(/([a-z])([A-Z0-9])/g, "$1 $2");

    // If it's all lowercase (like bollywoodactress), try to split on word clusters
    if (spaced.toLowerCase() === spaced) {
        // Try to detect common word boundaries (basic dictionary pattern)
        spaced = spaced
            .replace(/([a-z]{3,})([A-Z]?)/g, "$1 ")
            .trim()
            .replace(/\s+/g, " ");
    }

    // Add space before numbers (e.g., "Pyaar2" â†’ "Pyaar 2")
    spaced = spaced.replace(/(\d+)/g, " $1");

    // Title Case every word
    spaced = spaced
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    return spaced.trim();
};

// ImageCarousel Component
const ImageCarousel = ({ images, isDarkMode }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsImageLoaded(false);
    };
    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsImageLoaded(false);
    };
    return (
        <div className="relative w-full mb-6">
            <motion.div
                className="relative w-full max-w-full overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.img
                    key={images[currentImageIndex]}
                    src={images[currentImageIndex]}
                    alt={`Description image ${currentImageIndex + 1}`}
                    className="w-full max-w-full object-contain"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: isImageLoaded ? 1 : 0, x: 0 }}
                    transition={{ duration: 0.5 }}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                        e.target.src =
                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                        setIsImageLoaded(true);
                    }}
                />
                {!isImageLoaded && (
                    <div
                        className={`absolute inset-0 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
                            } animate-pulse`}
                    />
                )}
            </motion.div>
            {images.length > 1 && (
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                    <motion.button
                        onClick={handlePrev}
                        className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                            } shadow-md hover:scale-110 transition-transform`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous image"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                        onClick={handleNext}
                        className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                            } shadow-md hover:scale-110 transition-transform`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next image"
                    >
                        <HiArrowRight className="h-5 w-5" />
                    </motion.button>
                </div>
            )}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex
                                ? "bg-red-600"
                                : isDarkMode
                                    ? "bg-gray-600"
                                    : "bg-gray-400"
                                }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: index === currentImageIndex ? 1.2 : 0.8 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Spinning Loader Component
const SpinningLoader = ({ isDarkMode }) => (
    <div className="flex justify-center items-center min-h-screen">
        <div
            className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${isDarkMode ? "border-red-500" : "border-red-600"
                }`}
        ></div>
    </div>
);

const PostDetails = () => {
    const { postId } = useParams();
    const navigate = useNavigate();


    const [post, setPost] = useState(null);
    const [latestStories, setLatestStories] = useState([]);
    const [mostViewedPosts, setMostViewedPosts] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [categoryPosts, setCategoryPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [latestLoading, setLatestLoading] = useState(true);
    const [mostViewedLoading, setMostViewedLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [categoryLoading, setCategoryLoading] = useState(true);
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
    const [descriptionImages, setDescriptionImages] = useState([]);
    const commentsPerPage = 5;
    const videoRef = useRef(null);
    const commentInputRef = useRef(null);
    const commentsSectionRef = useRef(null);
    // Persistent dark mode
    // Scroll to top on id change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [postId]);

    // Redirection for old ID-based URLs
    useEffect(() => {
        if (post && post.slug && /^[0-9a-fA-F]{24}$/.test(postId)) {
            navigate(`/posts/${post.slug}`, { replace: true });
        }
    }, [post, postId, navigate]);

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
    // Fetch main post data
    useEffect(() => {
        const fetchMainPost = async () => {

            try {
                // Fetch the current post
                const foundPostRes = await getPostById(postId);
                setPost(foundPostRes);
                // Extract images from description
                if (foundPostRes?.description) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                        foundPostRes.description,
                        "text/html"
                    );
                    const images = Array.from(doc.querySelectorAll("img")).map(
                        (img) => img.src
                    );
                    setDescriptionImages(images);
                    if (images.length > 0) {
                        const updatedDescription = foundPostRes.description.replace(
                            /<img[^>]+>/g,
                            ""
                        );
                        setPost((prev) => ({ ...prev, description: updatedDescription }));
                    }
                }
                // Set user reactions and popular comments
                if (foundPostRes && isAuthenticated) {
                    const userId = localStorage.getItem("userId");
                    setUserReaction({
                        like: foundPostRes.likes?.includes(userId) || false,
                        love: foundPostRes.loves?.includes(userId) || false,
                        laugh: foundPostRes.laughs?.includes(userId) || false,
                        sad: foundPostRes.sads?.includes(userId) || false,
                    });
                    const sortedComments = [...(foundPostRes.comments || [])].sort(
                        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
                    );
                    setPopularComments(sortedComments.slice(0, 2));
                }
            } catch (err) {
                toast.error("Failed to fetch post");
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMainPost();
    }, [postId, isAuthenticated]);
    // Fetch secondary data (latest stories, most viewed, related posts, category posts)
    useEffect(() => {
        const fetchSecondaryData = async () => {
            try {
                // Fetch Latest Stories (sorted by createdAt descending)
                const latestPostsRes = await getPosts({ page: 1, limit: 5 });
                const latestPostsArray = Array.isArray(
                    latestPostsRes.posts || latestPostsRes
                )
                    ? latestPostsRes.posts || latestPostsRes
                    : [];
                setLatestStories(
                    latestPostsArray.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                );
                setLatestLoading(false);
                // Fetch Most Viewed Posts
                const mostViewedRes = await getPosts({ page: 1, limit: 5 });
                const mostViewedArray = Array.isArray(
                    mostViewedRes.posts || mostViewedRes
                )
                    ? mostViewedRes.posts || mostViewedRes
                    : [];
                setMostViewedPosts(
                    mostViewedArray.sort((a, b) => {
                        const aReactions =
                            (a.likes?.length || 0) +
                            (a.loves?.length || 0) +
                            (a.laughs?.length || 0) +
                            (a.sads?.length || 0);
                        const bReactions =
                            (b.likes?.length || 0) +
                            (b.loves?.length || 0) +
                            (b.laughs?.length || 0) +
                            (b.sads?.length || 0);
                        return bReactions - aReactions;
                    })
                );
                setMostViewedLoading(false);
                // Fetch Related Posts (filtered by hashtags)
                const hashtags = post?.hashtags || [];
                let relatedPostsArray = [];
                if (hashtags.length > 0) {
                    const hashtagPromises = hashtags.map((hashtag) =>
                        getPosts({ page: 1, limit: 10, hashtag })
                    );
                    const hashtagResults = await Promise.all(hashtagPromises);
                    const allPosts = hashtagResults.flatMap((res) =>
                        Array.isArray(res.posts || res) ? res.posts || res : []
                    );
                    const uniquePosts = Array.from(
                        new Map(allPosts.map((post) => [post._id, post])).values()
                    );
                    relatedPostsArray = uniquePosts
                        .filter((p) => p._id !== postId)
                        .slice(0, showMoreRelated ? relatedPostsCount : 15);
                }
                setRelatedPosts(relatedPostsArray);
                setRelatedLoading(false);
                // Fetch Category Posts
                if (post?.category) {
                    console.log("Fetching posts for category:", post.category); // Debugging
                    const categoryPostsRes = await getPostsByCategory(post.category, {
                        page: 1,
                        limit: 5,
                    });
                    console.log("Category posts response:", categoryPostsRes); // Debugging
                    const categoryPostsArray = Array.isArray(
                        categoryPostsRes.posts || categoryPostsRes
                    )
                        ? categoryPostsRes.posts || categoryPostsRes
                        : [];
                    const filteredPosts = categoryPostsArray
                        .filter((p) => p._id !== postId)
                        .slice(0, 5);
                    console.log("Filtered category posts:", filteredPosts); // Debugging
                    setCategoryPosts(filteredPosts);
                    if (filteredPosts.length === 0) {
                        toast.warn(`No posts found for category: ${post.category}`);
                    }
                } else {
                    console.log("No category defined for post:", post); // Debugging
                    setCategoryPosts([]);
                    toast.warn("Post has no category defined");
                }
                setCategoryLoading(false);
            } catch (err) {
                toast.error("Failed to fetch additional posts");
                setLatestStories([]);
                setMostViewedPosts([]);
                setRelatedPosts([]);
                setCategoryPosts([]);
                setLatestLoading(false);
                setMostViewedLoading(false);
                setRelatedLoading(false);
                setCategoryLoading(false);
            }
        };
        if (post) {
            fetchSecondaryData();
        }
    }, [post, postId, showMoreRelated, relatedPostsCount]);
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
    // Load available voices for speech synthesis
    useEffect(() => {
        const synth = window.speechSynthesis;
        const loadVoices = () => {
            const voices = synth.getVoices();
            setAvailableVoices(voices);
        };
        loadVoices();
        synth.onvoiceschanged = loadVoices;
        return () => {
            synth.onvoiceschanged = null;
        };
    }, []);
    // Function to detect language and map to BCP 47 language code
    const detectLanguage = (text) => {
        // const langCode = franc(text, { minLength: 10 });
        const langCode = 'eng'; // Fallback to English to fix require error
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
        return langMap[langCode] || "en-US";
    };
    // Function to select a voice matching the language
    const selectVoiceForLanguage = (lang) => {
        const langPrefix = lang.split("-")[0].toLowerCase();
        let matchingVoice =
            availableVoices.find((voice) =>
                voice.lang.toLowerCase().startsWith(langPrefix)
            ) ||
            availableVoices.find((voice) =>
                voice.lang.toLowerCase().includes(langPrefix)
            );
        if (!matchingVoice) {
            matchingVoice = availableVoices.find((voice) =>
                voice.lang.toLowerCase().startsWith("en")
            );
            if (matchingVoice) {
                toast.warn(`Voice for ${lang} not available. Using English voice.`);
            }
        }
        return matchingVoice || null;
    };
    // Audio Narration Logic with Language Detection
    const toggleAudioNarration = () => {
        const synth = window.speechSynthesis;
        if (isAudioPlaying) {
            setIsPausedByUser(true);
            synth.cancel();
            setIsAudioPlaying(false);
        } else {
            if (post?.description) {
                const cleanDescription = post.description.replace(/<[^>]+>/g, "");
                const utterance = new SpeechSynthesisUtterance(cleanDescription);
                const detectedLang = detectLanguage(cleanDescription);
                utterance.lang = detectedLang;
                const matchingVoice = selectVoiceForLanguage(detectedLang);
                if (matchingVoice) {
                    utterance.voice = matchingVoice;
                } else {
                    toast.error("No suitable voice available for narration.");
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
            const newReactions = { ...userReaction, [type]: !userReaction[type] };
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
                    toast.success("Reaction Burst! ðŸŽ‰ Keep it up!");
                }
                if (newRewards.includes("Reaction Streak 5")) {
                    toast.success("ðŸŽ‰ Streak Goal Reached! Badge Earned!");
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                }
            }
            if (newStreak >= 3 && !showMoreRelated) {
                setShowMoreRelated(true);
                toast.success("ðŸŽ‰ More related posts unlocked!");
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
            const updatedPost = await getPostById(postId);
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
        return {
            likePercent: ((post?.likes?.length || 0) / totalReactions) * 100,
            lovePercent: ((post?.loves?.length || 0) / totalReactions) * 100,
            laughPercent: ((post?.laughs?.length || 0) / totalReactions) * 100,
            sadPercent: ((post?.sads?.length || 0) / totalReactions) * 100,
            totalReactions,
        };
    };
    const analytics = reactionAnalytics();
    const postUrl = `${window.location.origin}/posts/${post?.slug || postId}`;
    const postTitle = post?.title || "Check out this post on GossipHub!";
    const seoTitle =
        postTitle.length > 60 ? `${postTitle.slice(0, 57)}...` : postTitle;

    // Get first paragraph for description
    const getFirstParagraph = (html) => {
        if (!html) return "";
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const firstP = tempDiv.querySelector("p");
        return firstP ? firstP.textContent : tempDiv.textContent.split("\n")[0];
    };

    const postDescription = getFirstParagraph(post?.description) || "Discover the latest gossip and stories on GossipHub!";

    const seoDescription =
        postDescription.length > 160
            ? `${postDescription.slice(0, 157)}...`
            : postDescription;
    const postMedia = post?.media || "https://gossiphub.in/default-image.jpg";
    const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
    const videoThumbnail = isVideo
        ? `${postMedia.replace(/\.(mp4|webm|ogg)$/i, "-thumbnail.jpg")}`
        : postMedia;
    const shareImage = isVideo ? videoThumbnail : postMedia;

    // Updated keywords with formatted hashtags using the dynamic formatHashtag
    const rawKeywords = post?.hashtags
        ? [
            ...post.hashtags.map((tag) => formatHashtag(tag)),
            ...postTitle.split(" ").slice(0, 10),
            "gossip",
            "social media",
            "entertainment",
        ].filter(Boolean)
        : [
            "GossipHub",
            "Social Media",
            "News",
            "Gossips",
            "Celebrity",
            "Tollywood",
            "Bollywood",
            "Hollywood",
            "Politics",
            "Entertainment",
            "Technology",
        ];

    const keywords = rawKeywords.join(", ");

    const authorName = post?.isAnonymous
        ? "Anonymous"
        : post?.postedBy?.username || post?.author?.username || "GossipHub User";
    const datePublished = post?.createdAt
        ? new Date(post.createdAt).toISOString()
        : new Date().toISOString();
    const dateModified = post?.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : datePublished;
    const publisherName = "GossipHub";

    // Updated structured data with formatted hashtags
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: seoTitle,
        description: seoDescription,
        author: { "@type": "Person", name: authorName },
        datePublished: datePublished,
        dateModified: dateModified,
        image: shareImage,
        publisher: {
            "@type": "Organization",
            name: publisherName,
            logo: {
                "@type": "ImageObject",
                url: shareImage,
                width: 1200,
                height: 400,
            },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        keywords: rawKeywords,
        articleSection: post?.category || "General",
        interactionStatistic: [
            {
                "@type": "InteractionCounter",
                interactionType: { "@type": "LikeAction" },
                userInteractionCount: post?.likes?.length || 0,
            },
            {
                "@type": "InteractionCounter",
                interactionType: { "@type": "CommentAction" },
                userInteractionCount: post?.comments?.length || 0,
            },
        ],
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://gossiphub.in/",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: post?.hashtags?.[0]
                        ? formatHashtag(post.hashtags[0])
                        : "General",
                    item: `https://gossiphub.in/posts/hashtag/${post?.hashtags?.[0]
                        ? encodeURIComponent(post.hashtags[0])
                        : "general"
                        }`,
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: seoTitle,
                    item: postUrl,
                },
            ],
        },
    };

    const handleNativeShare = async (postMedia) => {
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
                        if (!response.ok) throw new Error("Failed to fetch image");
                        const blob = await response.blob();
                        const file = new File([blob], "shared-image.jpg", {
                            type: "image/jpeg",
                        });
                        shareData.files = [file];
                    } catch (err) {
                        console.error("Failed to fetch image for sharing:", err);
                        delete shareData.files;
                    }
                } else if (isVideo && videoThumbnail) {
                    try {
                        const response = await fetch(videoThumbnail);
                        if (!response.ok)
                            throw new Error("Failed to fetch video thumbnail");
                        const blob = await response.blob();
                        const file = new File([blob], "shared-video-thumbnail.jpg", {
                            type: "image/jpeg",
                        });
                        shareData.files = [file];
                    } catch (err) {
                        console.error("Failed to fetch video thumbnail for sharing:", err);
                        delete shareData.files;
                    }
                }
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } catch (err) {
                try {
                    await navigator.share({
                        title: postTitle,
                        text: `${postTitle}\n${postDescription.slice(
                            0,
                            100
                        )}...\n${postUrl}`,
                        url: postUrl,
                    });
                    toast.success("Shared successfully (without media)!");
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
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
        )}&text=${encodeURIComponent(
            `${postTitle}\n${postDescription.slice(0, 100)}...`
        )}&via=GossipHub`;
        window.open(twitterUrl, "_blank", "noopener,noreferrer");
    };
    const handleShareWhatsapp = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `${postTitle}\n${postDescription.slice(0, 100)}...\n${postUrl}`
        )}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };
    const handleShareFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            postUrl
        )}&quote=${encodeURIComponent(postTitle)}`;
        window.open(facebookUrl, "_blank", "noopener,noreferrer");
    };
    const handleShareTelegram = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
            postUrl
        )}&text=${encodeURIComponent(
            `${postTitle}\n${postDescription.slice(0, 100)}...`
        )}`;
        window.open(telegramUrl, "_blank", "noopener,noreferrer");
    };
    const handleShareLinkedin = () => {
        const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            postUrl
        )}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(
            postDescription.slice(0, 200) + "..."
        )}&source=GossipHub`;
        window.open(linkedinUrl, "_blank", "noopener,noreferrer");
    };
    const handleSharePinterest = () => {
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            postUrl
        )}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(
            postTitle
        )}`;
        window.open(pinterestUrl, "_blank", "noopener,noreferrer");
    };
    // Fallback UI for lazy-loaded components
    const LoadingFallback = () => (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );
    if (loading) {
        return <SpinningLoader isDarkMode={isDarkMode} />;
    }
    if (!post) {
        return (
            <div
                className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gray-100"
                    }`}
            >
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Post not found
                </p>
            </div>
        );
    }
    const currentIndex = latestStories.findIndex((p) => p._id === postId);
    const prevPost = currentIndex > 0 ? latestStories[currentIndex - 1] : null;
    const nextPost =
        currentIndex < latestStories.length - 1 && currentIndex !== -1
            ? latestStories[currentIndex + 1]
            : null;
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
            className={`min-h-screen font-poppins ${isDarkMode ? "bg-gray-950" : "bg-gray-100"
                } transition-colors duration-500`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* SEO Metadata - React 19 Native Hoisting */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} key="description" />
            <meta name="keywords" content={keywords} key="keywords" />
            <link rel="canonical" href={postUrl} />
            <meta name="author" content={authorName} />
            <meta name="publisher" content={publisherName} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={postUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={shareImage} />
            <meta property="og:site_name" content="GossipHub" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={postUrl} />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={shareImage} />
            <meta name="twitter:creator" content="@GossipHub" />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            {/* Header */}
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
                            <HiSun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <HiMoon className="w-5 h-5 text-gray-300" />
                        )}
                    </button>
                </div>
            </header>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto lg:px-4 px-1 pt-20 pb-12 flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Suspense fallback={<LoadingFallback />}>
                            {postMedia ? (
                                <PostMedia
                                    media={postMedia}
                                    isVideo={isVideo}
                                    isMuted={isMuted}
                                    toggleMute={toggleMute}
                                    videoRef={videoRef}
                                    isTrending={isTrending}
                                    isDarkMode={isDarkMode}
                                    altText={post.title}
                                />
                            ) : (
                                <div
                                    className={`w-full aspect-video flex items-center justify-center rounded-t-lg shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
                                        }`}
                                >
                                    <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                        No media available
                                    </p>
                                </div>
                            )}
                        </Suspense>
                        <div
                            className={`mt-0 shadow-lg rounded-b-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
                                } lg:p-6 p-3 transition-colors duration-500 sticky top-20`}
                        >
                            <h1
                                className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                    }`}
                            >
                                {post.title}
                            </h1>
                            <p
                                className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"
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
                                <span className="mx-2 text-gray-400">&bull;</span>
                                {timeAgo(post.createdAt)}
                                <span className="mx-2 text-gray-400">&bull;</span>
                                {estimateReadTime(post.description)}
                            </p>
                            <div className="flex items-center mb-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleAudioNarration}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isAudioPlaying
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
                                className={`text-[18px] mb-6 leading-relaxed post-description ${isDarkMode ? "text-gray-200" : "text-black"
                                    }`}
                                role="region"
                                aria-label="Post description"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {parse(post.description, {
                                        replace: (domNode) => {
                                            const socialRegex = /(https?:\/\/)?(www\.)?(instagram\.com|twitter\.com|x\.com|youtube\.com|youtu\.be)\/[^\s]+/i;

                                            // Handle <a> tags: only replace if it's a social link
                                            if (domNode.name === 'a' && domNode.attribs && domNode.attribs.href) {
                                                if (socialRegex.test(domNode.attribs.href)) {
                                                    return <SocialEmbed url={domNode.attribs.href} />;
                                                }
                                                // Otherwise return undefined to let parser handle it normally (preserving text)
                                            }

                                            // Handle text nodes: split text if it contains a social link
                                            if (domNode.type === 'text' && domNode.data) {
                                                const match = domNode.data.match(socialRegex);
                                                if (match) {
                                                    const url = match[0];
                                                    const splitIndex = match.index;
                                                    const beforeText = domNode.data.substring(0, splitIndex);
                                                    const afterText = domNode.data.substring(splitIndex + url.length);

                                                    return (
                                                        <>
                                                            {beforeText}
                                                            <SocialEmbed url={url} />
                                                            {afterText}
                                                        </>
                                                    );
                                                }
                                            }
                                        }
                                    })}
                                </motion.div>
                                {descriptionImages.length > 0 && (
                                    <ImageCarousel
                                        images={descriptionImages}
                                        isDarkMode={isDarkMode}
                                    />
                                )}
                            </div>
                            {/* Hashtags Section - Now uses dynamic formatHashtag */}
                            {post.hashtags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {post.hashtags.map((tag, index) => (
                                        <Link
                                            key={index}
                                            to={`/posts/hashtag/${encodeURIComponent(tag)}`}
                                            className={`px-3 py-1 text-xs font-medium ${isDarkMode
                                                ? "text-gray-300 bg-red-800 hover:bg-red-700"
                                                : "text-red-700 bg-red-200 hover:bg-red-300"
                                                } rounded-full transition-colors`}
                                            aria-label={`View posts with hashtag ${tag}`}
                                        >
                                            {formatHashtag(tag)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {/* Category Section */}
                            {post.category && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <Link
                                        to={`/posts/category/${encodeURIComponent(post.category)}`}
                                        className={`px-3 py-1 text-xs font-medium ${isDarkMode
                                            ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                                            : "text-gray-700 bg-gray-100 hover:bg-gray-300"
                                            } rounded-full transition-colors`}
                                        aria-label={`View posts in category ${post.category}`}
                                    >
                                        {post.category}
                                    </Link>
                                </div>
                            )}
                            {isAuthenticated && (
                                <motion.div
                                    className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white shadow-md"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                                        <span className="mr-2"><FaFireAlt className="text-yellow-400" /></span> Reaction Streak
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
                                    className={`mb-6 p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                                        }`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3
                                        className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                            }`}
                                    >
                                        <span className="mr-2"><FaChartBar className="text-blue-500" /></span> Reaction Analytics
                                    </h3>
                                    <p
                                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                            }`}
                                    >
                                        Total Reactions: {analytics.totalReactions}
                                    </p>
                                    <div className="space-y-2 mt-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                <FaThumbsUp className="text-blue-500" /> Likes: {analytics.likePercent.toFixed(1)}%
                                            </span>
                                            <div
                                                className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
                                                    }`}
                                            >
                                                <motion.div
                                                    className="bg-red-500 h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${analytics.likePercent}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                <FaHeart className="text-pink-500" /> Loves: {analytics.lovePercent.toFixed(1)}%
                                            </span>
                                            <div className="w-full rounded-full h-2 bg-pink-500">
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
                                                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                <FaLaugh className="text-yellow-500" /> Laughs: {analytics.laughPercent.toFixed(1)}%
                                            </span>
                                            <div
                                                className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
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
                                                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                <FaSadTear className="text-blue-400" /> Sads: {analytics.sadPercent.toFixed(1)}%
                                            </span>
                                            <div
                                                className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
                                                    }`}
                                            >
                                                <motion.div
                                                    className="bg-red-600 h-2 rounded-full"
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
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.like
                                        ? "bg-red-600 text-white"
                                        : isDarkMode
                                            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                        } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isReacting}
                                    aria-label={`Like post (${post.likes?.length || 0} likes)${userReaction.like ? " (You liked this)" : ""
                                        }`}
                                >
                                    <motion.span
                                        className="text-xl"
                                        animate={userReaction.like ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FaThumbsUp />
                                    </motion.span>
                                    ({post.likes?.length || 0})
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleReaction("love")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.love
                                        ? "bg-pink-600 text-white"
                                        : isDarkMode
                                            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                        } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isReacting}
                                    aria-label={`Love post (${post.loves?.length || 0} loves)${userReaction.love ? " (You loved this)" : ""
                                        }`}
                                >
                                    <motion.span
                                        className="text-xl"
                                        animate={userReaction.love ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FaHeart />
                                    </motion.span>
                                    ({post.loves?.length || 0})
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleReaction("laugh")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.laugh
                                        ? "bg-yellow-500 text-white"
                                        : isDarkMode
                                            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                        } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isReacting}
                                    aria-label={`Laugh at post (${post.laughs?.length || 0
                                        } laughs)${userReaction.laugh ? " (You laughed at this)" : ""
                                        }`}
                                >
                                    <motion.span
                                        className="text-xl"
                                        animate={userReaction.laugh ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FaLaugh />
                                    </motion.span>
                                    ({post.laughs?.length || 0})
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleReaction("sad")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative ${userReaction.sad
                                        ? "bg-red-600 text-white"
                                        : isDarkMode
                                            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                        } ${isReacting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isReacting}
                                    aria-label={`Sad reaction (${post.sads?.length || 0} sads)${userReaction.sad ? " (You felt sad about this)" : ""
                                        }`}
                                >
                                    <motion.span
                                        className="text-xl"
                                        animate={userReaction.sad ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FaSadTear />
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
                        className={`mt-0 rounded-lg lg:p-6 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
                            } transition-colors duration-500`}
                    >
                        <h3
                            className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"
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
                                className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-24 shadow-sm transition-all duration-300 ${isDarkMode
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
                                        className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                            }`}
                                    >
                                        <span className="mr-2"><FaStar className="text-yellow-500" /></span> Popular Comments
                                    </h4>
                                    <Suspense fallback={<LoadingFallback />}>
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
                                    </Suspense>
                                </div>
                            )}
                            <Suspense fallback={<LoadingFallback />}>
                                <AnimatePresence>
                                    {post.comments?.length === 0 ? (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`text-center italic ${isDarkMode ? "text-gray-400" : "text-gray-500"
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
                            </Suspense>
                        </div>
                    </motion.div>
                    {/* Navigation */}
                    <motion.div
                        className="mt-6 flex justify-between gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        {prevPost && (
                            <Link
                                to={`/posts/${prevPost._id}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isDarkMode
                                    ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                    }`}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <HiArrowLeft className="h-5 w-5" />
                                Previous Post
                            </Link>
                        )}
                        {nextPost && (
                            <Link
                                to={`/posts/${nextPost._id}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ml-auto ${isDarkMode
                                    ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                    }`}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Next Post
                                <HiArrowRight className="h-5 w-5" />
                            </Link>
                        )}
                    </motion.div>
                    {/* Related Posts */}
                    <motion.div
                        className={`mt-6 rounded-lg lg:p-6 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
                            } transition-colors duration-500`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <h3
                            className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                        >
                            Related Posts
                        </h3>
                        <AnimatePresence>
                            {relatedLoading ? (
                                <LoadingFallback />
                            ) : relatedPosts.length === 0 ? (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    No related posts found for these hashtags.
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
                                            <Link
                                                to={`/posts/${story._id}`}
                                                className="flex gap-3"
                                                onClick={() =>
                                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                                }
                                            >
                                                {story.media &&
                                                    (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                                                        <video
                                                            src={story.media}
                                                            className="w-16 h-16 object-cover rounded"
                                                            muted={true}
                                                            loading="lazy"
                                                            onError={(e) =>
                                                            (e.target.src =
                                                                "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
                                                            }
                                                        />
                                                    ) : (
                                                        <img
                                                            src={story.media}
                                                            alt={story.title}
                                                            className="w-16 h-16 object-cover rounded"
                                                            loading="lazy"
                                                            onError={(e) =>
                                                            (e.target.src =
                                                                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                                                            }
                                                        />
                                                    ))}
                                                <div>
                                                    <p
                                                        className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                                            }`}
                                                    >
                                                        {story.title}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {story.hashtags?.slice(0, 3).map((tag, idx) => (
                                                            <Link
                                                                key={idx}
                                                                to={`/posts/hashtag/${encodeURIComponent(tag)}`}
                                                                className={`text-xs ${isDarkMode
                                                                    ? "text-gray-400 hover:text-red-400"
                                                                    : "text-gray-500 hover:text-red-600"
                                                                    }`}
                                                            >
                                                                #{formatHashtag(tag)}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div >
                {/* Sidebar */}
                < div className="md:w-1/3 space-y-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto scrollbar-hide" >
                    {/* Latest Stories */}
                    < motion.div
                        className={`rounded-lg lg:p-4 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
                            } transition-colors duration-500`}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3
                            className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                        >
                            Latest Stories
                        </h3>
                        <div className="space-y-4">
                            {latestLoading ? (
                                <LoadingFallback />
                            ) : latestStories.length === 0 ? (
                                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                    No latest stories available.
                                </p>
                            ) : (
                                latestStories.map((story, index) => (
                                    <motion.div
                                        key={story._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={`/posts/${story._id}`}
                                            className="flex gap-3"
                                            onClick={() =>
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }
                                        >
                                            {story.media &&
                                                (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                                                    <video
                                                        src={story.media}
                                                        className="w-16 h-16 object-cover rounded"
                                                        muted={true}
                                                        loading="lazy"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
                                                        }
                                                    />
                                                ) : (
                                                    <img
                                                        src={story.media}
                                                        alt={`Story: ${story.title}`}
                                                        className="w-16 h-16 object-cover rounded"
                                                        loading="lazy"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                                                        }
                                                    />
                                                ))}
                                            <div>
                                                <p
                                                    className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                                        }`}
                                                >
                                                    {story.title}
                                                </p>
                                                <p
                                                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                        }`}
                                                >
                                                    {story.category || "General"}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div >
                    {/* Category Posts */}
                    < motion.div
                        className={`rounded-lg lg:p-4 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
                            } transition-colors duration-500`}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h3
                            className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                        >
                            {post?.category || "Category"} Posts
                        </h3>
                        <div className="space-y-4">
                            {categoryLoading ? (
                                <LoadingFallback />
                            ) : categoryPosts.length === 0 ? (
                                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                    No posts available in this category.
                                </p>
                            ) : (
                                categoryPosts.map((story, index) => (
                                    <motion.div
                                        key={story._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={`/posts/${story.slug || story._id}`}
                                            className="flex gap-3"
                                            onClick={() =>
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }
                                        >
                                            {story.media &&
                                                (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                                                    <video
                                                        src={story.media}
                                                        className="w-16 h-16 object-cover rounded"
                                                        muted={true}
                                                        loading="lazy"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
                                                        }
                                                    />
                                                ) : (
                                                    <img
                                                        src={story.media}
                                                        alt={`Category post: ${story.title}`}
                                                        className="w-16 h-16 object-cover rounded"
                                                        loading="lazy"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "https://developers.element or.com/docs/assets/img/elementor-placeholder-image.png")
                                                        }
                                                    />
                                                ))}
                                            <div>
                                                <p
                                                    className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                                        }`}
                                                >
                                                    {story.title}
                                                </p>
                                                <p
                                                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                        }`}
                                                >
                                                    {timeAgo(story.createdAt)}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div >
                    {/* Most Viewed Posts */}
                    < motion.div
                        className={`rounded-lg lg:p-4 p-3 shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
                            } transition-colors duration-500`}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3
                            className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                        >
                            Most Viewed Posts
                        </h3>
                        <div className="space-y-4">
                            {mostViewedLoading ? (
                                <LoadingFallback />
                            ) : mostViewedPosts.length === 0 ? (
                                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                    No trending posts available.
                                </p>
                            ) : (
                                mostViewedPosts.map((story, index) => (
                                    <motion.div
                                        key={story._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={`/posts/${story.slug || story._id}`}
                                            className="flex gap-3"
                                            onClick={() =>
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            }
                                        >
                                            {story.media &&
                                                (/\.(mp4|webm|ogg)$/i.test(story.media) ? (
                                                    <video
                                                        src={story.media}
                                                        className="w-16 h-16 object-cover rounded"
                                                        muted={true}
                                                        loading="lazy"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")
                                                        }
                                                    />
                                                ) : (
                                                    <img
                                                        src={story.media}
                                                        alt={`Trending post: ${story.title}`}
                                                        className="w-16 h-16 object-cover rounded"
                                                        loading="lazy"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")
                                                        }
                                                    />
                                                ))}
                                            <div>
                                                <p
                                                    className={`text-sm font-medium hover:text-red-600 ${isDarkMode ? "text-gray-100" : "text-gray-900"
                                                        }`}
                                                >
                                                    {story.title}
                                                </p>
                                                <p
                                                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                        }`}
                                                >
                                                    {timeAgo(story.createdAt)}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div >
                    {/* Share Section */}

                    < Suspense fallback={< LoadingFallback />}>
                        <ShareBar
                            handleNativeShare={() => handleNativeShare(postMedia)}
                            handleCopyLink={handleCopyLink}
                            handleShareTwitter={handleShareTwitter}
                            handleShareWhatsapp={handleShareWhatsapp}
                            handleShareFacebook={handleShareFacebook}
                            handleShareTelegram={handleShareTelegram}
                            handleShareLinkedin={handleShareLinkedin}
                            handleSharePinterest={handleSharePinterest}
                            isCopied={isCopied}
                            isDarkMode={isDarkMode}
                        />
                    </Suspense >
                </div >
            </div >


            {/* Floating Comment Button for Mobile */}
            <motion.button
                onClick={scrollToCommentInput}
                className={`fixed bottom-16 right-4 p-2 rounded-full bg-red-600 text-white shadow-lg md:hidden z-50 ${isDarkMode ? "hover:bg-red-700" : "hover:bg-red-500"
                    } transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add a comment"
            >
                <FaComment className="h-6 w-6" />
            </motion.button>
        </motion.div>
    );
};

export default PostDetails;