// import { useState } from "react";
// import { motion } from "framer-motion";
// import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";

// const PostMedia = ({
//   media,
//   isVideo,
//   isMuted,
//   toggleMute,
//   videoRef,
//   isTrending,
//   isDarkMode,
// }) => {
//   const [isMediaLoaded, setIsMediaLoaded] = useState(false);

//   return (
//     <motion.div
//       className="relative w-full aspect-video rounded-t-lg overflow-hidden shadow-xl"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {isVideo ? (
//         <>
//           <video
//             ref={videoRef}
//             src={media}
//             autoPlay
//             loop
//             muted={isMuted}
//             className="w-full h-full object-cover"
//             onCanPlay={() => setIsMediaLoaded(true)}
//             onError={(e) => {
//               e.target.src =
//                 "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
//               setIsMediaLoaded(true);
//             }}
//           />
//           <motion.button
//             onClick={toggleMute}
//             className={`absolute bottom-4 right-4 p-2 rounded-full ${
//               isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//             } shadow-md hover:scale-110 transition-transform`}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             aria-label={isMuted ? "Unmute video" : "Mute video"}
//           >
//             {isMuted ? (
//               <HiVolumeOff className="h-5 w-5" />
//             ) : (
//               <HiVolumeUp className="h-5 w-5" />
//             )}
//           </motion.button>
//         </>
//       ) : (
//         <img
//           src={media}
//           alt="Post media"
//           className="w-full h-full object-cover"
//           loading="lazy"
//           onLoad={() => setIsMediaLoaded(true)}
//           onError={(e) => {
//             e.target.src =
//               "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
//             setIsMediaLoaded(true);
//           }}
//         />
//       )}
//       {!isMediaLoaded && (
//         <div
//           className={`absolute inset-0 ${
//             isDarkMode ? "bg-gray-800" : "bg-gray-200"
//           } animate-pulse`}
//         />
//       )}
//       {isTrending && (
//         <motion.div
//           className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           🔥 Trending
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default PostMedia;

import { useState } from "react";
import { motion } from "framer-motion";
import { HiVolumeUp, HiVolumeOff, HiPlay, HiPause } from "react-icons/hi";

const PostMedia = ({
  media,
  isVideo,
  isMuted,
  toggleMute,
  videoRef,
  isTrending,
  isDarkMode,
  altText,
}) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.error("Failed to play video:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className="relative w-full aspect-video rounded-t-lg overflow-hidden shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isVideo ? (
        <>
          <video
            ref={videoRef}
            src={media}
            className="w-full h-full object-cover"
            onCanPlay={() => setIsMediaLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
              setIsMediaLoaded(true);
            }}
            muted={isMuted}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <motion.button
              onClick={togglePlay}
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                } shadow-md hover:scale-110 transition-transform`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <HiPause className="h-5 w-5" />
              ) : (
                <HiPlay className="h-5 w-5" />
              )}
            </motion.button>
            <motion.button
              onClick={toggleMute}
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                } shadow-md hover:scale-110 transition-transform`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <HiVolumeOff className="h-5 w-5" />
              ) : (
                <HiVolumeUp className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </>
      ) : (
        <img
          src={media}
          alt={altText || "Post media"}
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setIsMediaLoaded(true)}
          onError={(e) => {
            e.target.src =
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
            setIsMediaLoaded(true);
          }}
        />
      )}
      {!isMediaLoaded && (
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
        />
      )}
      {isTrending && (
        <motion.div
          className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          🔥 Trending
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostMedia;
