// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useSwipeable } from "react-swipeable";
// import {
//   FaHeart,
//   FaComment,
//   FaShare,
//   FaPlay,
//   FaArrowUp,
//   FaArrowDown,
//   FaPaperPlane,
//   FaTimes,
// } from "react-icons/fa";
// import {
//   getShorts,
//   toggleShortLike,
//   addShortComment,
//   getUserProfile,
// } from "../utils/api";

// const ShortsFeed = () => {
//   const [shorts, setShorts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isCommenting, setIsCommenting] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [lastTap, setLastTap] = useState(0);
//   const videoRefs = useRef([]);
//   const progressInterval = useRef(null);

//   const LIMIT = 5;

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const profile = await getUserProfile();
//         setUserId(profile._id);
//       } catch (err) {
//         setError("Failed to fetch user profile");
//       }
//     };
//     fetchUserProfile();
//   }, []);

//   const fetchShorts = async (pageNum) => {
//     try {
//       const data = await getShorts({ page: pageNum, limit: LIMIT });
//       setShorts((prev) => {
//         const existingIds = new Set(prev.map((short) => short._id));
//         const newShorts = data.shorts.filter(
//           (short) => !existingIds.has(short._id)
//         );
//         return [...prev, ...newShorts];
//       });
//       setHasMore(data.page < data.totalPages);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShorts(page);
//   }, [page]);

//   useEffect(() => {
//     if (currentIndex >= shorts.length - 2 && hasMore && !isLoading) {
//       setPage((prev) => prev + 1);
//     }
//   }, [currentIndex, shorts.length, hasMore]);

//   const updateProgress = useCallback(() => {
//     const currentVideo = videoRefs.current[currentIndex];
//     if (currentVideo && !isNaN(currentVideo.duration)) {
//       const duration = currentVideo.duration;
//       const currentTime = currentVideo.currentTime;
//       setProgress((currentTime / duration) * 100);
//     }
//   }, [currentIndex]);

//   useEffect(() => {
//     const currentVideo = videoRefs.current[currentIndex];
//     if (currentVideo) {
//       progressInterval.current = setInterval(updateProgress, 500);
//       if (isPlaying)
//         currentVideo.play().catch((e) => console.error("Play error:", e));
//       else currentVideo.pause();
//     }
//     return () => {
//       if (progressInterval.current) clearInterval(progressInterval.current);
//     };
//   }, [currentIndex, isPlaying, updateProgress]);

//   const handleNextVideo = () => {
//     if (currentIndex < shorts.length - 1) {
//       videoRefs.current[currentIndex]?.pause();
//       setCurrentIndex((prev) => prev + 1);
//       setIsPlaying(true);
//       videoRefs.current[currentIndex + 1]
//         ?.play()
//         .catch((e) => console.error("Play error:", e));
//     }
//   };

//   const handlePreviousVideo = () => {
//     if (currentIndex > 0) {
//       videoRefs.current[currentIndex]?.pause();
//       setCurrentIndex((prev) => prev - 1);
//       setIsPlaying(true);
//       videoRefs.current[currentIndex - 1]
//         ?.play()
//         .catch((e) => console.error("Play error:", e));
//     }
//   };

//   const handlers = useSwipeable({
//     onSwipedUp: handleNextVideo,
//     onSwipedDown: handlePreviousVideo,
//     onTap: (e) => {
//       const currentTime = Date.now();
//       const tapDelay = currentTime - lastTap;
//       setLastTap(currentTime);
//       if (tapDelay < 300) {
//         handleLike(shorts[currentIndex]._id);
//       } else {
//         const currentVideo = videoRefs.current[currentIndex];
//         if (currentVideo) {
//           setIsPlaying((prev) => {
//             if (prev) currentVideo.pause();
//             else
//               currentVideo.play().catch((e) => console.error("Play error:", e));
//             return !prev;
//           });
//         }
//       }
//     },
//     trackMouse: true,
//     delta: 50,
//     preventDefaultTouchmoveEvent: true,
//   });

//   const handleLike = async (shortId, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     try {
//       console.log("Toggling like for shortId:", shortId); // Debug log
//       const data = await toggleShortLike(shortId);
//       console.log("API response:", data); // Debug log
//       if (data && (data.likes !== undefined || data.likeCount !== undefined)) {
//         setShorts((prev) =>
//           prev.map((short) =>
//             short._id === shortId
//               ? {
//                   ...short,
//                   likes: Array.isArray(data.likes)
//                     ? data.likes
//                     : Array(data.likeCount || data.likes).fill({ _id: userId }),
//                 }
//               : short
//           )
//         );
//       } else {
//         console.error("Unexpected API response format:", data);
//       }
//     } catch (err) {
//       console.error("Error toggling like:", err.message);
//       setError(err.message);
//     }
//   };

//   const handleCommentSubmit = async (shortId) => {
//     if (!commentText.trim()) return;
//     try {
//       const data = await addShortComment(shortId, { text: commentText });
//       setShorts((prev) =>
//         prev.map((short) =>
//           short._id === shortId ? { ...short, comments: data.comments } : short
//         )
//       );
//       setCommentText("");
//       setIsCommenting(false);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleVideoError = (e, shortId) => {
//     console.error(`Video error for short ${shortId}:`, e);
//     setError(
//       `Failed to load video for short ${shortId}. Check console for details.`
//     );
//   };

//   const handleCloseComment = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsCommenting(false);
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target.className.includes("comment-overlay")) {
//       setIsCommenting(false);
//     }
//   };

//   if (isLoading && shorts.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-black text-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-black text-white">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (shorts.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-black text-white">
//         <p>No shorts available</p>
//       </div>
//     );
//   }

//   const currentShort = shorts[currentIndex];

//   return (
//     <div
//       {...handlers}
//       className="h-screen w-screen overflow-hidden relative md:bg-black md:max-w-[390px] md:mx-auto"
//     >
//       <div
//         className="h-full w-full transition-transform duration-300 ease-in-out"
//         style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
//       >
//         {shorts.map((short, index) => (
//           <div
//             key={`${short._id}-${index}`}
//             className="h-screen w-full relative flex items-center justify-center"
//           >
//             <div className="relative w-full h-full">
//               <video
//                 ref={(el) => (videoRefs.current[index] = el)}
//                 src={short.videoUrl}
//                 autoPlay={index === currentIndex && isPlaying}
//                 loop
//                 muted={isMuted}
//                 className="w-full h-full object-cover"
//                 onError={(e) => handleVideoError(e, short._id)}
//                 onLoadedData={(e) =>
//                   console.log(
//                     `Video loaded for short ${short._id}:`,
//                     e.target.src
//                   )
//                 }
//                 playsInline
//               />
//               {/* Progress Bar */}
//               <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
//                 <div
//                   className="h-full bg-red-600"
//                   style={{ width: `${index === currentIndex ? progress : 0}%` }}
//                 ></div>
//               </div>
//               {/* Play/Pause Button */}
//               {index === currentIndex && !isPlaying && (
//                 <button
//                   onClick={() => {
//                     const currentVideo = videoRefs.current[currentIndex];
//                     if (currentVideo) {
//                       currentVideo
//                         .play()
//                         .catch((e) => console.error("Play error:", e));
//                       setIsPlaying(true);
//                     }
//                   }}
//                   className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl sm:text-3xl bg-black/50 rounded-full p-3 sm:p-4"
//                 >
//                   <FaPlay />
//                 </button>
//               )}
//               {/* Video Info */}
//               <div className="absolute bottom-0 left-0 w-full p-2 sm:p-4 text-white bg-gradient-to-t from-black/80 to-transparent z-10">
//                 <p className="text-[16px] font-medium">
//                   @{short.user?.username || "Unknown"}
//                 </p>
//                 <p className="text-[16px] mt-1 line-clamp-2">{short.caption}</p>
//               </div>
//               {/* Like, Comment, Share Controls */}
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 sm:space-y-2 z-10">
//                 <button
//                   onClick={(e) => handleLike(short._id, e)}
//                   className="flex flex-col items-center justify-center w-10 h-10 rounded-full text-white"
//                 >
//                   <FaHeart
//                     className={`text-lg sm:text-xl ${
//                       short.likes.some((like) => like._id === userId)
//                         ? "text-red-500"
//                         : ""
//                     }`}
//                   />
//                   <span className="text-xs sm:text-sm ml-0 hidden md:block">
//                     {short.likes.length}
//                   </span>
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setIsCommenting(true);
//                   }}
//                   className="flex items-center justify-center w-10 h-10 rounded-full text-white"
//                 >
//                   <FaComment className="text-lg sm:text-xl" />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     // Add share functionality here if needed
//                   }}
//                   className="flex items-center justify-center w-10 h-10 rounded-full text-white"
//                 >
//                   <FaShare className="text-lg sm:text-xl" />
//                 </button>
//               </div>
//               {/* Comment Section */}
//               {isCommenting && index === currentIndex && (
//                 <div
//                   className="comment-overlay fixed inset-0 bg-black/70 z-30 flex items-end"
//                   onClick={handleOverlayClick}
//                 >
//                   <div className="w-full bg-black/90 p-4 rounded-t-lg z-40">
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="text-white text-sm font-semibold">
//                         Comments
//                       </h3>
//                       <button
//                         onClick={handleCloseComment}
//                         className="text-white text-xl"
//                       >
//                         <FaTimes />
//                       </button>
//                     </div>
//                     <div className="flex items-center bg-gray-800 rounded-full p-1 mb-2">
//                       <input
//                         type="text"
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         placeholder="Add a comment..."
//                         className="flex-1 bg-transparent text-white text-sm p-2 outline-none"
//                       />
//                       <button
//                         onClick={() => handleCommentSubmit(short._id)}
//                         disabled={!commentText.trim()}
//                         className="text-blue-400 text-lg p-2 disabled:opacity-50"
//                       >
//                         <FaPaperPlane />
//                       </button>
//                     </div>
//                     <div className="max-h-[40vh] overflow-y-auto text-gray-300 text-sm">
//                       {short.comments.map((comment, idx) => (
//                         <div key={idx} className="flex items-start mb-2">
//                           <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex-shrink-0"></div>
//                           <div>
//                             <p className="font-medium text-white">
//                               @{comment.userId || "User"}
//                             </p>
//                             <p className="text-gray-300">{comment.text}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* Navigation Buttons (Left Side, Desktop Only) */}
//             <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 hidden md:block z-10">
//               <button
//                 onClick={handlePreviousVideo}
//                 className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full text-white disabled:opacity-50"
//                 disabled={currentIndex === 0}
//               >
//                 <FaArrowUp className="text-2xl" />
//               </button>
//               <button
//                 onClick={handleNextVideo}
//                 className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full text-white disabled:opacity-50"
//                 disabled={currentIndex === shorts.length - 1}
//               >
//                 <FaArrowDown className="text-2xl" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {isLoading && (
//         <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
//           <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-t-2 border-white"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShortsFeed;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaPlay,
  FaArrowUp,
  FaArrowDown,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import {
  getShorts,
  toggleShortLike,
  addShortComment,
  getUserProfile,
} from "../utils/api";

const ShortsFeed = () => {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userId, setUserId] = useState(null); // userId can be null if not logged in
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const videoRefs = useRef([]);
  const progressInterval = useRef(null);

  const LIMIT = 5;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserId(profile._id);
      } catch (err) {
        console.warn(
          "User profile fetch failed, proceeding without login:",
          err.message
        );
        setUserId(null); // Allow component to work without userId
      }
    };
    fetchUserProfile();
  }, []);

  const fetchShorts = async (pageNum) => {
    try {
      const data = await getShorts({ page: pageNum, limit: LIMIT });
      setShorts((prev) => {
        const existingIds = new Set(prev.map((short) => short._id));
        const newShorts = data.shorts.filter(
          (short) => !existingIds.has(short._id)
        );
        return [...prev, ...newShorts];
      });
      setHasMore(data.page < data.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts(page);
  }, [page]);

  useEffect(() => {
    if (currentIndex >= shorts.length - 2 && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [currentIndex, shorts.length, hasMore]);

  const updateProgress = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && !isNaN(currentVideo.duration)) {
      const duration = currentVideo.duration;
      const currentTime = currentVideo.currentTime;
      setProgress((currentTime / duration) * 100);
    }
  }, [currentIndex]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      progressInterval.current = setInterval(updateProgress, 500);
      if (isPlaying)
        currentVideo.play().catch((e) => console.error("Play error:", e));
      else currentVideo.pause();
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentIndex, isPlaying, updateProgress]);

  const handleNextVideo = () => {
    if (currentIndex < shorts.length - 1) {
      videoRefs.current[currentIndex]?.pause();
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
      videoRefs.current[currentIndex + 1]
        ?.play()
        .catch((e) => console.error("Play error:", e));
    }
  };

  const handlePreviousVideo = () => {
    if (currentIndex > 0) {
      videoRefs.current[currentIndex]?.pause();
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
      videoRefs.current[currentIndex - 1]
        ?.play()
        .catch((e) => console.error("Play error:", e));
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: handleNextVideo,
    onSwipedDown: handlePreviousVideo,
    onTap: (e) => {
      const currentTime = Date.now();
      const tapDelay = currentTime - lastTap;
      setLastTap(currentTime);
      if (tapDelay < 300 && userId) {
        // Only allow liking if user is logged in
        handleLike(shorts[currentIndex]._id);
      } else {
        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) {
          setIsPlaying((prev) => {
            if (prev) currentVideo.pause();
            else
              currentVideo.play().catch((e) => console.error("Play error:", e));
            return !prev;
          });
        }
      }
    },
    trackMouse: true,
    delta: 50,
    preventDefaultTouchmoveEvent: true,
  });

  const handleLike = async (shortId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      console.warn("User must be logged in to like a short.");
      return; // Prevent liking if not logged in
    }
    try {
      console.log("Toggling like for shortId:", shortId);
      const data = await toggleShortLike(shortId);
      console.log("API response:", data);
      if (data && (data.likes !== undefined || data.likeCount !== undefined)) {
        setShorts((prev) =>
          prev.map((short) =>
            short._id === shortId
              ? {
                  ...short,
                  likes: Array.isArray(data.likes)
                    ? data.likes
                    : Array(data.likeCount || data.likes).fill({ _id: userId }),
                }
              : short
          )
        );
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (err) {
      console.error("Error toggling like:", err.message);
      setError(err.message);
    }
  };

  const handleCommentSubmit = async (shortId) => {
    if (!userId) {
      console.warn("User must be logged in to comment.");
      return; // Prevent commenting if not logged in
    }
    if (!commentText.trim()) return;
    try {
      const data = await addShortComment(shortId, { text: commentText });
      setShorts((prev) =>
        prev.map((short) =>
          short._id === shortId ? { ...short, comments: data.comments } : short
        )
      );
      setCommentText("");
      setIsCommenting(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVideoError = (e, shortId) => {
    console.error(`Video error for short ${shortId}:`, e);
    setError(
      `Failed to load video for short ${shortId}. Check console for details.`
    );
  };

  const handleCloseComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommenting(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className.includes("comment-overlay")) {
      setIsCommenting(false);
    }
  };

  if (isLoading && shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>{error}</p>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No shorts available</p>
      </div>
    );
  }

  const currentShort = shorts[currentIndex];

  return (
    <div
      {...handlers}
      className="h-screen w-screen overflow-hidden relative md:bg-black md:max-w-[390px] md:mx-auto"
    >
      <div
        className="h-full w-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {shorts.map((short, index) => (
          <div
            key={`${short._id}-${index}`}
            className="h-screen w-full relative flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={short.videoUrl}
                autoPlay={index === currentIndex && isPlaying}
                loop
                muted={isMuted}
                className="w-full h-full object-cover"
                onError={(e) => handleVideoError(e, short._id)}
                onLoadedData={(e) =>
                  console.log(
                    `Video loaded for short ${short._id}:`,
                    e.target.src
                  )
                }
                playsInline
              />
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${index === currentIndex ? progress : 0}%` }}
                ></div>
              </div>
              {/* Play/Pause Button */}
              {index === currentIndex && !isPlaying && (
                <button
                  onClick={() => {
                    const currentVideo = videoRefs.current[currentIndex];
                    if (currentVideo) {
                      currentVideo
                        .play()
                        .catch((e) => console.error("Play error:", e));
                      setIsPlaying(true);
                    }
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl sm:text-3xl bg-black/50 rounded-full p-3 sm:p-4"
                >
                  <FaPlay />
                </button>
              )}
              {/* Video Info */}
              <div className="absolute bottom-0 left-0 w-full p-2 sm:p-4 text-white bg-gradient-to-t from-black/80 to-transparent z-10">
                <p className="text-[16px] font-medium">
                  @{short.user?.username || "Unknown"}
                </p>
                <p className="text-[16px] mt-1 line-clamp-2">{short.caption}</p>
              </div>
              {/* Like, Comment, Share Controls */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 sm:space-y-2 z-10">
                <button
                  onClick={(e) => handleLike(short._id, e)}
                  className="flex flex-col items-center justify-center w-10 h-10 rounded-full text-white"
                  disabled={!userId} // Disable like button if not logged in
                >
                  <FaHeart
                    className={`text-lg sm:text-xl ${
                      userId && short.likes.some((like) => like._id === userId)
                        ? "text-red-500"
                        : ""
                    }`}
                  />
                  <span className="text-xs sm:text-sm ml-0 hidden md:block">
                    {short.likes.length}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (userId) setIsCommenting(true);
                    else console.warn("User must be logged in to comment.");
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white"
                >
                  <FaComment className="text-lg sm:text-xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add share functionality here if needed
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white"
                >
                  <FaShare className="text-lg sm:text-xl" />
                </button>
              </div>
              {/* Comment Section */}
              {isCommenting && index === currentIndex && userId && (
                <div
                  className="comment-overlay fixed inset-0 bg-black/70 z-30 flex items-end"
                  onClick={handleOverlayClick}
                >
                  <div className="w-full bg-black/90 p-4 rounded-t-lg z-40">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white text-sm font-semibold">
                        Comments
                      </h3>
                      <button
                        onClick={handleCloseComment}
                        className="text-white text-xl"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="flex items-center bg-gray-800 rounded-full p-1 mb-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-transparent text-white text-sm p-2 outline-none"
                      />
                      <button
                        onClick={() => handleCommentSubmit(short._id)}
                        disabled={!commentText.trim()}
                        className="text-blue-400 text-lg p-2 disabled:opacity-50"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                    <div className="max-h-[40vh] overflow-y-auto text-gray-300 text-sm">
                      {short.comments.map((comment, idx) => (
                        <div key={idx} className="flex items-start mb-2">
                          <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-white">
                              @{comment.userId || "User"}
                            </p>
                            <p className="text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Navigation Buttons (Left Side, Desktop Only) */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 hidden md:block z-10">
              <button
                onClick={handlePreviousVideo}
                className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full text-white disabled:opacity-50"
                disabled={currentIndex === 0}
              >
                <FaArrowUp className="text-2xl" />
              </button>
              <button
                onClick={handleNextVideo}
                className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full text-white disabled:opacity-50"
                disabled={currentIndex === shorts.length - 1}
              >
                <FaArrowDown className="text-2xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-t-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default ShortsFeed;
