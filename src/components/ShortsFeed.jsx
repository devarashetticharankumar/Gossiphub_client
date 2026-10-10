import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaMusic,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaChevronLeft,
  FaTimes,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaPaperPlane,
  FaEllipsisH,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import {
  getShorts,
  toggleShortLike,
  addShortComment,
  getUserProfile,
} from "../utils/api";

const ShortsFeed = () => {
  const navigate = useNavigate();
  const { Id, shortId: paramShortId } = useParams();
  const targetShortId = Id || paramShortId;

  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userId, setUserId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  // Floating heart burst particles on double-tap
  const [burstHearts, setBurstHearts] = useState([]);
  const [showFeedbackIcon, setShowFeedbackIcon] = useState(null); // 'play' or 'pause'

  // States
  const [savedShorts, setSavedShorts] = useState({});
  const [followingUsers, setFollowingUsers] = useState({});
  const [copiedToast, setCopiedToast] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const videoRefs = useRef([]);
  const progressInterval = useRef(null);
  const LIMIT = 5;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserId(profile?._id || null);
      } catch (err) {
        setUserId(null);
      }
    };
    fetchUserProfile();
  }, []);

  const fetchShorts = async (pageNum) => {
    try {
      const data = await getShorts({ page: pageNum, limit: LIMIT });
      if (data && Array.isArray(data.shorts)) {
        setShorts((prev) => {
          const existingIds = new Set(prev.map((s) => s._id));
          const newShorts = data.shorts.filter((s) => !existingIds.has(s._id));
          return [...prev, ...newShorts];
        });
        setHasMore(data.page < data.totalPages);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load Shorts");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts(page);
  }, [page]);

  useEffect(() => {
    if (targetShortId && shorts.length > 0) {
      const foundIdx = shorts.findIndex((s) => s._id === targetShortId);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      }
    }
  }, [targetShortId, shorts.length]);

  useEffect(() => {
    if (currentIndex >= shorts.length - 2 && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [currentIndex, shorts.length, hasMore, isLoading]);

  const updateProgress = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && !isNaN(currentVideo.duration) && currentVideo.duration > 0) {
      setProgress((currentVideo.currentTime / currentVideo.duration) * 100);
    }
  }, [currentIndex]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      progressInterval.current = setInterval(updateProgress, 150);
      if (isPlaying) {
        currentVideo.play().catch((e) => console.warn("Play interrupted:", e));
      } else {
        currentVideo.pause();
      }
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentIndex, isPlaying, updateProgress]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCommenting) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handlePreviousVideo();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        const currentShort = shorts[currentIndex];
        if (currentShort) handleLike(currentShort._id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, shorts.length, isPlaying, isCommenting]);

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      setIsPlaying((prev) => {
        if (prev) currentVideo.pause();
        else currentVideo.play().catch((e) => console.warn(e));
        return !prev;
      });
    }
  };

  const handleNextVideo = () => {
    if (currentIndex < shorts.length - 1) {
      videoRefs.current[currentIndex]?.pause();
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
      setExpandedCaption(false);
      setShowOptionsModal(false);
    }
  };

  const handlePreviousVideo = () => {
    if (currentIndex > 0) {
      videoRefs.current[currentIndex]?.pause();
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
      setExpandedCaption(false);
      setShowOptionsModal(false);
    }
  };

  // Addictive Double Tap Burst Particle Effect
  const triggerDoubleTapHeart = (e) => {
    const id = Date.now() + Math.random();
    let x = 50;
    let y = 50;
    if (e && e.clientX) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
    }
    const newHeart = { id, x, y, rotate: (Math.random() - 0.5) * 40 };
    setBurstHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setBurstHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1000);
  };

  const handleLike = async (shortId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const data = await toggleShortLike(shortId);
      if (data && (data.likes !== undefined || data.likeCount !== undefined)) {
        setShorts((prev) =>
          prev.map((short) => {
            if (short._id === shortId) {
              const hasLiked = short.likes?.some(
                (like) => (like._id || like) === userId
              );
              let newLikes;
              if (Array.isArray(data.likes)) {
                newLikes = data.likes;
              } else if (hasLiked) {
                newLikes = short.likes.filter(
                  (l) => (l._id || l) !== userId
                );
              } else {
                newLikes = [...(short.likes || []), { _id: userId }];
              }
              return { ...short, likes: newLikes };
            }
            return short;
          })
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleSave = (shortId) => {
    setSavedShorts((prev) => ({ ...prev, [shortId]: !prev[shortId] }));
  };

  const toggleFollow = (creatorId) => {
    setFollowingUsers((prev) => ({ ...prev, [creatorId]: !prev[creatorId] }));
  };

  const handleVideoTap = (e) => {
    const currentTime = Date.now();
    const tapDelay = currentTime - lastTap;
    setLastTap(currentTime);

    if (tapDelay < 300) {
      triggerDoubleTapHeart(e);
      const currentShort = shorts[currentIndex];
      if (currentShort) {
        handleLike(currentShort._id);
      }
    } else {
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo) {
        setIsPlaying((prev) => {
          const nextState = !prev;
          if (nextState) {
            currentVideo.play().catch((err) => console.warn(err));
            setShowFeedbackIcon("play");
          } else {
            currentVideo.pause();
            setShowFeedbackIcon("pause");
          }
          return nextState;
        });
        setTimeout(() => setShowFeedbackIcon(null), 800);
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: handleNextVideo,
    onSwipedDown: handlePreviousVideo,
    trackMouse: false,
    delta: 50,
  });

  const handleShare = (short) => {
    const shareUrl = `${window.location.origin}/shorts/${short._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    }
  };

  const handleCommentSubmit = async (shortId) => {
    if (!userId) {
      navigate("/login");
      return;
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
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold tracking-widest text-pink-400 uppercase animate-pulse">
          Loading Feed
        </p>
      </div>
    );
  }

  if (error && shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center font-sans">
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => { setError(null); setIsLoading(true); fetchShorts(1); }}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-red-500 font-semibold rounded-full text-xs tracking-wider shadow-lg shadow-pink-500/30"
        >
          Reload Shorts
        </button>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center font-sans">
        <p className="text-gray-400 text-sm mb-4">No Shorts available</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-white/10 rounded-full text-xs font-semibold">
          Return Home
        </button>
      </div>
    );
  }

  const currentShort = shorts[currentIndex];

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative flex items-center justify-center font-sans select-none">

      {/* Ambient Blurred Video Background for Desktop */}
      {currentShort && (
        <div className="hidden md:block absolute inset-0 overflow-hidden opacity-25 blur-3xl scale-125 pointer-events-none transition-all duration-700">
          <video src={currentShort.videoUrl} muted loop autoPlay className="w-full h-full object-cover" />
        </div>
      )}

      {/* Copy Toast Notification */}
      {copiedToast && (
        <div className="absolute top-16 z-50 bg-black/80 text-white border border-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-bounce">
          <FaCheckCircle className="text-emerald-400 text-sm" />
          <span>Link copied!</span>
        </div>
      )}

      {/* Top Header Controls Bar (Ultra Clean Minimalist) */}
      <div className="absolute top-0 left-0 right-0 z-40 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 backdrop-blur-xl text-white flex items-center justify-center transition-all"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-xl border border-white/15 px-4 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></div>
          <span className="text-xs font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-400 to-purple-400">
            Shorts
          </span>
        </div>

        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 backdrop-blur-xl text-white flex items-center justify-center transition-all"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute className="text-sm text-pink-400" /> : <FaVolumeUp className="text-sm text-emerald-400" />}
        </button>
      </div>

      {/* Desktop Up/Down Control Buttons */}
      <div className="hidden md:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col space-y-4 z-40">
        <button
          onClick={handlePreviousVideo}
          disabled={currentIndex === 0}
          className="w-11 h-11 rounded-full bg-black/40 hover:bg-pink-600 border border-white/15 backdrop-blur-xl text-white flex items-center justify-center shadow-2xl transition-all disabled:opacity-20 group"
          title="Previous (Up Arrow)"
        >
          <FaArrowUp className="group-hover:-translate-y-0.5 transition-transform text-sm" />
        </button>
        <div className="text-center text-[10px] font-bold text-white/50 tracking-wider">
          {currentIndex + 1} / {shorts.length}
        </div>
        <button
          onClick={handleNextVideo}
          disabled={currentIndex === shorts.length - 1}
          className="w-11 h-11 rounded-full bg-black/40 hover:bg-pink-600 border border-white/15 backdrop-blur-xl text-white flex items-center justify-center shadow-2xl transition-all disabled:opacity-20 group"
          title="Next (Down Arrow)"
        >
          <FaArrowDown className="group-hover:translate-y-0.5 transition-transform text-sm" />
        </button>
      </div>

      {/* Main Video Frame Container */}
      <div
        {...handlers}
        className="w-full h-full md:w-[410px] md:h-[92vh] md:max-h-[830px] md:rounded-3xl overflow-hidden relative bg-black shadow-[0_0_60px_rgba(236,72,153,0.15)] border-0 md:border md:border-white/15"
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {shorts.map((short, index) => {
            const isLiked = userId && short.likes?.some((like) => (like._id || like) === userId);
            const likeCount = short.likes?.length || 0;
            const commentCount = short.comments?.length || 0;
            const creatorId = short.user?._id || short.user;
            const isSaved = savedShorts[short._id];
            const isFollowing = followingUsers[creatorId];

            return (
              <div
                key={`${short._id}-${index}`}
                onClick={handleVideoTap}
                className="h-full w-full relative flex items-center justify-center bg-black overflow-hidden cursor-pointer select-none"
              >
                {/* Video Component */}
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={short.videoUrl}
                  autoPlay={index === currentIndex && isPlaying}
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* Top Glowing Progress Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 pointer-events-none">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-all duration-150"
                    style={{ width: `${index === currentIndex ? progress : 0}%` }}
                  ></div>
                </div>

                {/* Floating Heart Burst Particles (Double Tap) */}
                {index === currentIndex &&
                  burstHearts.map((h) => (
                    <div
                      key={h.id}
                      className="absolute z-40 pointer-events-none animate-ping text-pink-500 text-6xl drop-shadow-[0_0_30px_rgba(236,72,153,0.9)]"
                      style={{
                        left: `${h.x}%`,
                        top: `${h.y}%`,
                        transform: `translate(-50%, -50%) rotate(${h.rotate}deg)`,
                      }}
                    >
                      <FaHeart />
                    </div>
                  ))}

                {/* Play/Pause Center Indicator Overlay */}
                {index === currentIndex && (!isPlaying || showFeedbackIcon) && (
                  <div className="absolute inset-0 m-auto w-16 h-16 bg-black/40 border border-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-2xl z-30 shadow-2xl pointer-events-none transition-all">
                    {!isPlaying || showFeedbackIcon === "pause" ? (
                      <FaPlay className="ml-1 text-white" />
                    ) : (
                      <FaPause className="text-white" />
                    )}
                  </div>
                )}

                {/* Floating Clean Action Bar (Right Column - No Glass Container Box) */}
                <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center space-y-5">
                  {/* Like Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={(e) => handleLike(short._id, e)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-75 hover:scale-110"
                    >
                      {isLiked ? (
                        <FaHeart className="text-pink-500 text-2xl drop-shadow-[0_0_15px_rgba(236,72,153,0.9)] animate-pulse" />
                      ) : (
                        <FaRegHeart className="text-white text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:text-pink-300" />
                      )}
                    </button>
                    <span className="text-[11px] font-bold text-white mt-0.5 tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{likeCount}</span>
                  </div>

                  {/* Comment Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setIsCommenting(true)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-75 hover:scale-110"
                    >
                      <FaRegComment className="text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                    </button>
                    <span className="text-[11px] font-bold text-white mt-0.5 tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{commentCount}</span>
                  </div>

                  {/* Bookmark Save Button */}
                  <button
                    onClick={() => toggleSave(short._id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-75 hover:scale-110"
                    title="Save"
                  >
                    {isSaved ? (
                      <FaBookmark className="text-amber-400 text-xl drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                    ) : (
                      <FaRegBookmark className="text-white text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                    )}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(short)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-75 hover:scale-110"
                    title="Share"
                  >
                    <FaShare className="text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  </button>

                  {/* Options Menu Button */}
                  <button
                    onClick={() => setShowOptionsModal((prev) => !prev)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-75 hover:scale-110"
                  >
                    <FaEllipsisH className="text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  </button>
                </div>

                {/* Bottom Overlay (Smooth Even Full-Width Gradient) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 text-white bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20 flex flex-col justify-end pointer-events-none">
                  <div className="pr-14 pointer-events-auto flex flex-col">
                    {/* Creator Info Header */}
                    <div className="flex items-center space-x-2.5 mb-2.5">
                      {/* Glowing Avatar Ring */}
                      <div
                        onClick={() => navigate(`/user/${creatorId}`)}
                        className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-red-500 to-purple-500 shadow-lg cursor-pointer flex-shrink-0"
                      >
                        <img
                          src={short.user?.profilePic || "https://api.dicebear.com/7.x/bottts/svg?seed=" + (short.user?.username || "user")}
                          alt={short.user?.username || "User"}
                          className="w-full h-full rounded-full object-cover border border-black"
                        />
                      </div>

                      <div className="flex flex-col">
                        <div
                          onClick={() => navigate(`/user/${creatorId}`)}
                          className="flex items-center space-x-1.5 cursor-pointer hover:underline"
                        >
                          <span className="font-bold text-sm tracking-tight text-white drop-shadow">
                            @{short.user?.username || "GossipHub"}
                          </span>
                          <FaCheckCircle className="text-pink-400 text-[11px]" />
                        </div>
                      </div>

                      {/* Follow Pill Button */}
                      <button
                        onClick={() => toggleFollow(creatorId)}
                        className={`ml-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all border ${
                          isFollowing
                            ? "bg-white/10 border-white/20 text-white/80"
                            : "bg-gradient-to-r from-pink-500 to-red-500 border-transparent text-white shadow-md shadow-pink-500/30 hover:scale-105"
                        }`}
                      >
                        {isFollowing ? (
                          <span className="flex items-center space-x-1">
                            <FaUserCheck className="text-[10px]" />
                            <span>Following</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <FaUserPlus className="text-[10px]" />
                            <span>Follow</span>
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Caption */}
                    <div className="text-xs text-gray-200 font-normal leading-relaxed mb-3">
                      <p className={expandedCaption ? "" : "line-clamp-2"}>
                        {short.caption}
                      </p>
                      {short.caption && short.caption.length > 60 && (
                        <button
                          onClick={() => setExpandedCaption((prev) => !prev)}
                          className="text-[11px] font-bold text-pink-400 hover:text-pink-300 mt-0.5"
                        >
                          {expandedCaption ? "show less" : "...more"}
                        </button>
                      )}
                    </div>

                    {/* Audio Track Ticker + Animated Equalizer Sound Wave */}
                    <div className="flex items-center space-x-2 text-xs text-gray-300 font-medium bg-black/40 border border-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full w-max">
                      {/* Animated Equalizer Bar */}
                      <div className="flex items-end space-x-0.5 h-3">
                        <div className="w-0.5 h-full bg-pink-500 animate-pulse"></div>
                        <div className="w-0.5 h-2 bg-red-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-0.5 h-2.5 bg-purple-400 animate-pulse" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <FaMusic className="text-pink-400 text-[10px]" />
                      <span className="truncate max-w-[170px] text-[11px]">
                        Original Sound - {short.user?.username || "GossipHub"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* More Options Modal */}
                {showOptionsModal && index === currentIndex && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end">
                    <div className="w-full bg-slate-950 rounded-t-3xl p-5 border-t border-white/15 text-white text-xs space-y-3 shadow-2xl">
                      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2"></div>
                      <button
                        onClick={() => { handleShare(short); setShowOptionsModal(false); }}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-semibold flex items-center justify-center space-x-2 text-sm"
                      >
                        <FaShare className="text-pink-400" />
                        <span>Copy Link</span>
                      </button>
                      <button
                        onClick={() => { toggleSave(short._id); setShowOptionsModal(false); }}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-semibold flex items-center justify-center space-x-2 text-sm"
                      >
                        <FaBookmark className="text-amber-400" />
                        <span>{isSaved ? "Saved in Collection" : "Save to Collection"}</span>
                      </button>
                      <button
                        onClick={() => setShowOptionsModal(false)}
                        className="w-full py-3 bg-red-500/20 text-red-400 font-bold rounded-2xl text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comment Glass Drawer */}
        {isCommenting && currentShort && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col justify-end">
            <div className="bg-slate-950 border-t border-white/15 rounded-t-3xl max-h-[70%] flex flex-col overflow-hidden shadow-2xl">
              {/* Drawer Top Grab Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto my-3"></div>

              {/* Header */}
              <div className="px-5 py-2.5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm">
                  Comments ({currentShort.comments?.length || 0})
                </h3>
                <button
                  onClick={() => setIsCommenting(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Comment Scroll List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {currentShort.comments && currentShort.comments.length > 0 ? (
                  currentShort.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {(comment.userId || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5">
                        <p className="font-bold text-pink-400 mb-0.5">
                          @{comment.userId || "GossipMember"}
                        </p>
                        <p className="text-gray-200">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 text-xs font-medium">
                    No comments yet. Start the conversation!
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t border-white/10 bg-black flex items-center space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(currentShort._id)}
                  placeholder={userId ? "Add a comment..." : "Log in to comment"}
                  disabled={!userId}
                  className="flex-1 bg-white/10 text-white placeholder-gray-400 text-xs outline-none px-4 py-2.5 rounded-full border border-white/10 focus:border-pink-500 transition-all"
                />
                <button
                  onClick={() => handleCommentSubmit(currentShort._id)}
                  disabled={!commentText.trim() || !userId}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-red-500 disabled:opacity-40 text-white flex items-center justify-center text-xs shadow-lg shadow-pink-500/30"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsFeed;
