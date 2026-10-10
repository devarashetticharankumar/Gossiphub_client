import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaFilm,
  FaHashtag,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronLeft,
  FaPlay,
  FaPause,
  FaTrash,
} from "react-icons/fa";
import { createShort } from "../utils/api";

const QUICK_HASHTAGS = [
  "gossip",
  "trending",
  "viral",
  "tollywood",
  "bollywood",
  "cinema",
  "reviews",
  "celebrity",
];

const ShortVideoForm = () => {
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fileInputRef = useRef(null);
  const previewVideoRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setIsDarkMode(JSON.parse(saved));
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/") && !file.name.toLowerCase().endsWith(".mp4")) {
      setErrorMsg("Please select a valid MP4 video file.");
      setVideoFile(null);
      setVideoPreviewUrl(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg("Video size must be less than 50MB.");
      setVideoFile(null);
      setVideoPreviewUrl(null);
      return;
    }

    setErrorMsg("");
    setMessage("");
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setVideoFile(null);
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addHashtag = (tag) => {
    const formatted = `#${tag}`;
    if (!caption.includes(formatted) && caption.length + formatted.length + 1 <= 100) {
      setCaption((prev) => (prev ? `${prev} ${formatted}` : formatted));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setErrorMsg("Please select a video file to upload.");
      return;
    }
    if (!caption.trim()) {
      setErrorMsg("Please add a caption for your Short.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("caption", caption);

    try {
      await createShort(formData);
      setMessage("Short published successfully! Redirecting...");
      setTimeout(() => {
        navigate("/shorts");
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Upload failed. Please try again.");
      setIsLoading(false);
    }
  };

  const togglePreviewPlayback = () => {
    if (previewVideoRef.current) {
      if (isPreviewPlaying) {
        previewVideoRef.current.pause();
      } else {
        previewVideoRef.current.play();
      }
      setIsPreviewPlaying(!isPreviewPlaying);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"
      } font-sans transition-colors duration-300 pb-16`}
    >
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10 px-6 py-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all border border-white/10 text-xs font-semibold"
          >
            <FaChevronLeft />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
            <h1 className="text-base font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-400">
              Shorts Creator Studio
            </h1>
          </div>

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Publish Reel
          </div>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Create New Short
          </h2>
          <p className="text-sm text-gray-400">
            Upload vertical 9:16 MP4 videos to share quick gossip, trailers & video highlights with your audience.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload & Metadata Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Drag & Drop Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                1. Select Video File
              </label>

              {!videoFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4 ${
                    isDragging
                      ? "border-red-500 bg-red-500/10 scale-[1.01]"
                      : isDarkMode
                      ? "border-slate-800 bg-slate-900/60 hover:border-red-500/60 hover:bg-slate-900"
                      : "border-gray-300 bg-white hover:border-red-500 hover:bg-red-50/50 shadow-lg"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 via-pink-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-red-600/30 animate-pulse">
                    <FaCloudUploadAlt />
                  </div>

                  <div>
                    <p className="text-base font-bold text-gray-200 mb-1">
                      Drag & Drop your video here, or <span className="text-red-500 underline">Browse</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports MP4 vertical videos up to 50MB (max 60 seconds)
                    </p>
                  </div>
                </div>
              ) : (
                /* Selected File Card */
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between shadow-xl">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-xl flex-shrink-0">
                      <FaFilm />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold truncate text-white">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • MP4 Video
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={removeSelectedFile}
                    className="p-2.5 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all ml-2"
                    title="Remove File"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Caption Input Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Short Caption
                </label>
                <span className={`text-xs font-bold ${caption.length >= 90 ? "text-amber-400" : "text-gray-500"}`}>
                  {caption.length} / 100
                </span>
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a catchy caption... e.g. Sreeleela's bold look setting internet on fire! 🔥 #tollywood #gossip"
                maxLength={100}
                rows={3}
                className={`w-full p-4 rounded-2xl text-sm outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-900 border border-slate-800 focus:border-red-500 text-white placeholder-gray-500"
                    : "bg-white border border-gray-200 focus:border-red-500 text-gray-900 placeholder-gray-400 shadow-md"
                }`}
              />

              {/* Quick Hashtags */}
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-2 flex items-center space-x-1">
                  <FaHashtag className="text-red-500 text-xs" />
                  <span>Quick Trending Hashtags:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addHashtag(tag)}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 hover:bg-red-600/20 hover:text-red-400 border border-white/5 transition-all text-gray-300"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center space-x-3">
                <FaExclamationTriangle className="text-base flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {message && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-3">
                <FaCheckCircle className="text-base flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !videoFile}
              className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 ${
                isLoading || !videoFile
                  ? "bg-slate-800 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:opacity-90 shadow-red-600/30 active:scale-[0.99]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading to GossipHub...</span>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-base" />
                  <span>Publish Short Video</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Live 9:16 Video Mobile Preview (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[320px] bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <FaFilm className="text-red-500" />
                  <span>Live 9:16 Preview</span>
                </span>
                {videoPreviewUrl && (
                  <button
                    onClick={togglePreviewPlayback}
                    className="text-xs text-red-400 font-semibold flex items-center space-x-1 hover:underline"
                  >
                    {isPreviewPlaying ? <FaPause /> : <FaPlay />}
                    <span>{isPreviewPlaying ? "Pause" : "Play"}</span>
                  </button>
                )}
              </div>

              {/* 9:16 Mobile Card Box */}
              <div className="w-full aspect-[9/16] rounded-2xl bg-black relative overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                {videoPreviewUrl ? (
                  <>
                    <video
                      ref={previewVideoRef}
                      src={videoPreviewUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                    {/* Overlay Text Preview */}
                    <div className="absolute bottom-4 left-3 right-3 text-white pointer-events-none">
                      <p className="text-xs font-bold mb-1">@YourChannel</p>
                      <p className="text-xs text-gray-200 line-clamp-2 leading-tight">
                        {caption || "Your caption will appear here..."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-gray-600 space-y-2">
                    <FaFilm className="text-4xl text-gray-700 mx-auto animate-bounce" />
                    <p className="text-xs font-medium">No video selected</p>
                    <p className="text-[10px] text-gray-600">Select an MP4 file to see real-time preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ShortVideoForm;
