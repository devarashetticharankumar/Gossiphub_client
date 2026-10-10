import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiYoutubeshorts } from "react-icons/si";
import { FaPlay, FaHeart, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { getShorts } from "../utils/api";

const ShortsSection = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const fetchShortsData = async () => {
      try {
        const res = await getShorts({ page: 1, limit: 10 });
        if (res && Array.isArray(res.shorts)) {
          setShorts(res.shorts);
        }
      } catch (err) {
        console.warn("Failed to load home shorts section:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShortsData();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!loading && shorts.length === 0) return null;

  return (
    <section className={`my-8 p-4 sm:p-6 rounded-2xl transition-all duration-300 ${
      isDarkMode ? "bg-slate-900/90 border border-slate-800" : "bg-white border border-gray-100 shadow-xl"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-red-600/10 rounded-xl text-red-600">
            <SiYoutubeshorts className="text-2xl text-red-600 animate-pulse" />
          </div>
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Trending Shorts
            </h2>
            <p className="text-xs text-gray-500 font-medium">Bite-sized gossip & quick video highlights</p>
          </div>
        </div>

        <Link
          to="/shorts"
          className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-full transition-all"
        >
          <span>Watch All</span>
          <FaArrowRight className="text-[10px]" />
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-xs" />
        </button>

        {/* Scrollable Reel Cards */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 sm:space-x-4 overflow-x-auto py-2 scrollbar-none scroll-smooth"
        >
          {loading
            ? Array(6).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-36 sm:w-44 h-64 sm:h-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0"
                />
              ))
            : shorts.map((short, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <div
                    key={short._id}
                    onClick={() => navigate(`/shorts/${short._id}`)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="w-36 sm:w-44 h-64 sm:h-72 rounded-2xl relative overflow-hidden flex-shrink-0 cursor-pointer shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group border border-black/10 dark:border-white/10 bg-black"
                  >
                    {/* Thumbnail / Video */}
                    <video
                      src={short.videoUrl}
                      muted
                      loop
                      playsInline
                      autoPlay={isHovered}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    {/* Play Badge Center */}
                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <FaPlay className="ml-0.5 text-xs text-white" />
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      {/* Creator Row */}
                      <div className="flex items-center space-x-1.5 mb-1">
                        <img
                          src={short.user?.profilePic || "https://api.dicebear.com/7.x/bottts/svg?seed=" + (short.user?.username || "user")}
                          alt={short.user?.username || "User"}
                          className="w-5 h-5 rounded-full object-cover border border-white/30"
                        />
                        <span className="text-xs font-bold truncate text-gray-200">
                          @{short.user?.username || "GossipHub"}
                        </span>
                      </div>

                      {/* Caption */}
                      <p className="text-[11px] font-medium leading-snug line-clamp-2 text-gray-100 mb-1.5">
                        {short.caption}
                      </p>

                      {/* Likes count */}
                      <div className="flex items-center space-x-1 text-[10px] text-pink-400 font-semibold">
                        <FaHeart className="text-[10px]" />
                        <span>{short.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </section>
  );
};

export default ShortsSection;
