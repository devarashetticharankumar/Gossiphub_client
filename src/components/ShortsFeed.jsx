import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTrendingShorts, getPosts, addReaction } from "../utils/api";

const ShortsFeed = () => {
  const [shorts, setShorts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRefs = useRef([]);
  const lastTap = useRef(0);
  const navigate = useNavigate();

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
    else setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Fetch shorts
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        let fetchedShorts = await getTrendingShorts();
        if (fetchedShorts.length === 0) {
          fetchedShorts = await getPosts("Short");
        }
        setShorts(fetchedShorts);
      } catch (err) {
        toast.error("Failed to load shorts: " + err.message);
      }
    };
    fetchShorts();
  }, []);

  // Intersection Observer to detect which video is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.dataset.index, 10);
        const video = videoRefs.current[index];
        if (entry.isIntersecting) {
          setCurrentVideoIndex(index);
          if (isPlaying) {
            video.play().catch((err) => {
              console.error("Video playback failed:", err);
              toast.error("Failed to play video: " + err.message);
            });
          }
        } else {
          video.pause();
          video.currentTime = 0;
          setProgress(0);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [shorts, isPlaying]);

  // Update muted state for all videos
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isMuted;
      }
    });
  }, [isMuted, shorts]);

  // Update progress bar
  useEffect(() => {
    const video = videoRefs.current[currentVideoIndex];
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
      }
    };

    const handleBuffering = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("waiting", handleBuffering);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("waiting", handleBuffering);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentVideoIndex, shorts]);

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      videoRefs.current.forEach((video) => {
        if (video) {
          video.muted = newMutedState;
          if (
            !newMutedState &&
            video === videoRefs.current[currentVideoIndex] &&
            isPlaying
          ) {
            video.play().catch((err) => {
              console.error("Failed to play video with sound:", err);
              toast.warn(
                "Click the video to enable sound due to browser restrictions."
              );
            });
          }
        }
      });
      return newMutedState;
    });
  };

  // Toggle play/pause on video tap
  const togglePlayPause = () => {
    const video = videoRefs.current[currentVideoIndex];
    if (video) {
      if (video.paused) {
        setIsPlaying(true);
        video.play().catch((err) => {
          console.error("Failed to play video:", err);
          toast.error("Failed to play video: " + err.message);
        });
        setShowPlayPauseIcon("play");
      } else {
        setIsPlaying(false);
        video.pause();
        setShowPlayPauseIcon("pause");
      }
      setTimeout(() => setShowPlayPauseIcon(null), 1000);
    }
  };

  // Double-tap to like
  const handleDoubleTap = (shortId) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      handleReaction(shortId, "like");
      // Show a like animation (heart pop-up)
      setShowPlayPauseIcon("like");
      setTimeout(() => setShowPlayPauseIcon(null), 1000);
    }
    lastTap.current = now;
  };

  // Handle reaction
  const handleReaction = async (postId, type) => {
    try {
      const updatedReactions = await addReaction(postId, { type });
      setShorts((prevShorts) =>
        prevShorts.map((short) =>
          short._id === postId
            ? {
                ...short,
                likes: updatedReactions.likes,
                loves: updatedReactions.loves,
                laughs: updatedReactions.laughs,
                sads: updatedReactions.sads,
                shares: updatedReactions.shares,
              }
            : short
        )
      );
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added!`);
    } catch (err) {
      toast.error("Failed to add reaction: " + err.message);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Navigate to hashtag search
  const handleHashtagClick = (hashtag) => {
    navigate(`/search?hashtag=${hashtag}`);
  };

  // Navigate to user profile
  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`);
  };

  // Handle follow action (placeholder)
  const handleFollow = (username) => {
    toast.info(`Followed ${username}!`);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black" : "bg-gray-100"
      } transition-colors duration-500 font-sans flex flex-col items-center overflow-y-auto snap-y snap-mandatory`}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Back to previous page"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Reels</h1>
          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Shorts Feed */}
      <div className="pt-14 w-full max-w-md overflow-y-auto snap-y snap-mandatory">
        {shorts.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No reels available. Create one now!
            </p>
          </div>
        ) : (
          shorts.map((short, index) => (
            <div
              key={short._id}
              className="relative w-full snap-start flex items-center justify-center h-screen"
            >
              {/* Video */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                data-index={index}
                src={short.media.url}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-contain shadow-lg"
                onClick={(e) => {
                  togglePlayPause();
                  handleDoubleTap(short._id);
                }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  lastTap.current = Date.now();
                }}
              />

              {/* Buffering Spinner */}
              {isBuffering && currentVideoIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}

              {/* Play/Pause/Like Overlay Icon */}
              {showPlayPauseIcon && currentVideoIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-4 animate-pop">
                    {showPlayPauseIcon === "play" ? (
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : showPlayPauseIcon === "pause" ? (
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-16 h-16 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-500 bg-opacity-50">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Overlay with Info and Controls */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                {/* Top Section: Mute Toggle */}
                <div className="flex justify-end pointer-events-auto">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-transform transform hover:scale-110"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5.586 5.586a2 2 0 00-2.828 0L3 6l1.414 1.414M12 4v16l-6-3H4a2 2 0 01-2-2V9a2 2 0 012-2h2l6-3zm7 5l-2 2m0 4l2 2"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 4v16l-6-3H4a2 2 0 01-2-2V9a2 2 0 012-2h2l6-3z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Bottom Section: Info with Gradient Overlay */}
                <div className="relative">
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                  <div className="flex justify-between items-end pointer-events-auto relative">
                    <div className="text-white max-w-[65%]">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() =>
                            handleUsernameClick(
                              short.isAnonymous
                                ? "anonymous"
                                : short.author.username
                            )
                          }
                          className="font-bold text-base hover:underline"
                        >
                          {short.isAnonymous
                            ? "anonymous"
                            : short.author.username}
                        </button>
                        <button
                          onClick={() =>
                            handleFollow(
                              short.isAnonymous
                                ? "anonymous"
                                : short.author.username
                            )
                          }
                          className="text-sm text-white font-semibold px-2 py-1 rounded-full border border-white hover:bg-white hover:bg-opacity-10 transition-colors"
                        >
                          Follow
                        </button>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {short.title}
                      </p>
                      {short.hashtags && short.hashtags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 3c-4.95 0-9 4.05-9 9s4.05 9 9 9 9-4.05 9-9-4.05-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z" />
                          </svg>
                          <p className="text-sm font-medium truncate">
                            {short.hashtags
                              .map((hashtag) => `#${hashtag}`)
                              .join(" ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Section: Reactions and Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={() => handleReaction(short._id, "like")}
                        className="flex flex-col items-center text-white hover:text-red-400 transition-transform transform hover:scale-110"
                        aria-label="Like reel"
                      >
                        <svg
                          className="w-8 h-8"
                          fill={short.likes.length > 0 ? "red" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                          />
                        </svg>
                        <span className="text-xs font-medium mt-1">
                          {short.likes.length}
                        </span>
                      </button>
                      <button
                        onClick={() => navigate(`/post/${short._id}`)}
                        className="flex flex-col items-center text-white hover:text-gray-300 transition-transform transform hover:scale-110"
                        aria-label="View comments"
                      >
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="text-xs font-medium mt-1">
                          {short.comments.length}
                        </span>
                      </button>
                      <button
                        onClick={() => handleReaction(short._id, "share")}
                        className="flex flex-col items-center text-white hover:text-gray-300 transition-transform transform hover:scale-110"
                        aria-label="Share reel"
                      >
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        <span className="text-xs font-medium mt-1">
                          {short.shares.length}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleUsernameClick(
                            short.isAnonymous
                              ? "anonymous"
                              : short.author.username
                          )
                        }
                        className="mt-2"
                        aria-label="View profile"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white">
                          {/* Placeholder for avatar; replace with actual image if available */}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tailwind Animation and Font Styles */}
      <style>
        {`
          .animate-pop {
            animation: pop 0.5s ease-out;
          }
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
          }
          .animate-fade-out {
            animation: fadeOut 1s forwards;
          }
          @keyframes fadeOut {
            0% { opacity: 1; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
          .font-sans {
            font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Arial', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default ShortsFeed;
