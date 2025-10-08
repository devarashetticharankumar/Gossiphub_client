// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { updateShort, getShortById } from "../utils/api";

// const ShortVideoUpdateForm = ({ shortId }) => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [initialCaption, setInitialCaption] = useState("");
//   const navigate = useNavigate();

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Fetch existing short video data
//   useEffect(() => {
//     const fetchShortData = async () => {
//       try {
//         const data = await getShortById(shortId);
//         setCaption(data.caption || "");
//         setInitialCaption(data.caption || "");
//       } catch (err) {
//         setMessage(`Failed to load short video: ${err.message}`);
//       }
//     };
//     if (shortId) fetchShortData();
//   }, [shortId]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("video/") || !file.type.includes("mp4")) {
//         setMessage("Please upload an MP4 video file.");
//         setVideoFile(null);
//         return;
//       }
//       if (file.size > 50 * 1024 * 1024) {
//         // 50MB limit
//         setMessage("Video size must be less than 50MB.");
//         setVideoFile(null);
//         return;
//       }
//       setMessage("");
//       setVideoFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!caption.trim()) {
//       setMessage("Please add a caption.");
//       return;
//     }
//     setIsLoading(true);
//     setMessage("");

//     const formData = new FormData();
//     formData.append("caption", caption);
//     if (videoFile) formData.append("video", videoFile);

//     try {
//       await updateShort(shortId, formData);
//       setMessage("Video updated successfully!");
//       setVideoFile(null);
//     } catch (err) {
//       setMessage(`Update failed: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
//       } transition-colors duration-500 font-poppins`}
//     >
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
//             aria-label="Back to previous page"
//           >
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </button>
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
//       <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center">
//         <div
//           className={`w-full max-w-2xl ${
//             isDarkMode ? "bg-gray-900" : "bg-white"
//           } rounded-lg p-6 shadow-lg transition-colors duration-500`}
//         >
//           <h2
//             className={`text-3xl font-bold ${
//               isDarkMode ? "text-gray-100" : "text-gray-900"
//             } mb-6 text-center`}
//           >
//             Update Short Video
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Video File (MP4, max 50MB, optional)
//               </label>
//               <input
//                 type="file"
//                 accept="video/mp4"
//                 onChange={handleFileChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
//                   isDarkMode
//                     ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
//                     : "file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
//                 } transition-all duration-300`}
//                 aria-label="Update video file"
//               />
//               <p
//                 className={`text-xs mt-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               >
//                 Leave blank to keep the current video.
//               </p>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Caption
//               </label>
//               <input
//                 type="text"
//                 value={caption}
//                 onChange={(e) => setCaption(e.target.value)}
//                 placeholder={initialCaption || "Edit the caption..."}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
//                 maxLength={100}
//                 aria-label="Update video caption"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                 isLoading
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               } flex items-center justify-center space-x-2`}
//               aria-label={isLoading ? "Updating video" : "Update video"}
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   <span>Updating...</span>
//                 </>
//               ) : (
//                 <span>Update</span>
//               )}
//             </button>
//             {message && (
//               <p
//                 className={`mt-4 text-sm text-center ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 {message}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShortVideoUpdateForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShortById, updateShort } from "../utils/api";

const ShortVideoUpdateForm = () => {
  const { shortId } = useParams();
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const navigate = useNavigate();

  // Fetch existing short video data
  useEffect(() => {
    const fetchShortData = async () => {
      try {
        const data = await getShortById(shortId);
        if (!data) {
          setMessage("Short video not found");
          return;
        }
        setCaption(data.caption || "");
        setCurrentVideoUrl(data.videoUrl || "");
        setFilePreview(data.videoUrl || null); // Set initial preview
      } catch (err) {
        setMessage(`Failed to fetch short video: ${err.message}`);
      }
    };
    if (shortId) fetchShortData();
  }, [shortId]);

  // Persistent dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/") || !file.type.includes("mp4")) {
        setMessage("Please upload an MP4 video file.");
        setVideoFile(null);
        setFilePreview(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setMessage("Video size must be less than 50MB.");
        setVideoFile(null);
        setFilePreview(null);
        return;
      }
      setMessage("");
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setVideoFile(null);
    setFilePreview(null);
    document.getElementById("video-upload").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      setMessage("Please add a caption.");
      return;
    }
    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("caption", caption);
    if (videoFile) formData.append("video", videoFile);

    try {
      await updateShort(shortId, formData);
      setMessage("Video updated successfully!");
      setVideoFile(null);
      setFilePreview(currentVideoUrl); // Revert to current video after update
      // Redirect to /shorts after successful update
      navigate("/shorts");
    } catch (err) {
      setMessage(`Update failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
      } transition-colors duration-500 font-poppins`}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(`/shorts/${shortId}`)}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Back to short video"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
            </svg>
            Back
          </button>
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
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center">
        <div
          className={`w-full max-w-2xl ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } rounded-lg p-6 shadow-lg transition-colors duration-500`}
        >
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } mb-6 text-center`}
          >
            Update Your Short Video
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } mb-1`}
              >
                Video File (MP4, max 50MB, optional)
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className={`w-full p-3 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                  isDarkMode
                    ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                    : "file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
                } transition-all duration-300`}
                aria-label="Update video file"
              />
              {(filePreview || currentVideoUrl) && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      Preview:
                    </p>
                    {videoFile && (
                      <button
                        type="button"
                        onClick={clearFile}
                        className={`text-sm ${
                          isDarkMode
                            ? "text-red-400 hover:underline"
                            : "text-red-600 hover:underline"
                        }`}
                        aria-label="Clear uploaded video"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <video
                    src={filePreview || currentVideoUrl}
                    controls
                    className="max-w-xs rounded-lg shadow-sm"
                    aria-label="Video preview"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Leave blank to keep the current video.
              </p>
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } mb-1`}
              >
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`w-full p-3 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
                placeholder={caption || "Edit the caption..."}
                maxLength={100}
                aria-label="Update video caption"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                isLoading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } flex items-center justify-center space-x-2`}
              aria-label={isLoading ? "Updating video" : "Update video"}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Video</span>
              )}
            </button>
            {message && (
              <p
                className={`mt-4 text-sm text-center ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShortVideoUpdateForm;
