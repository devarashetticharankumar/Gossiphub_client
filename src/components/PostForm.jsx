// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createPost } from "../utils/api";
// import ReactQuill from "react-quill-new";
// import "quill/dist/quill.snow.css";

// const PostForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     isAnonymous: false,
//     category: "General",
//   });
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData({
//       ...formData,
//       description: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) {
//       setFile(null);
//       setFilePreview(null);
//       return;
//     }

//     const validTypes = [
//       "image/jpeg",
//       "image/webp",
//       "image/png",
//       "image/gif",
//       "video/mp4",
//       "video/webm",
//     ];
//     if (!validTypes.includes(selectedFile.type)) {
//       toast.error(
//         "Please upload an image (JPEG, PNG, GIF) or video (MP4, WebM)"
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       return;
//     }

//     const maxSize = selectedFile.type.startsWith("image/")
//       ? 10 * 1024 * 1024
//       : 40 * 1024 * 1024; // 10MB for images, 40MB for videos (Cloudinary free-tier limit)
//     if (selectedFile.size > maxSize) {
//       toast.error(
//         `File size exceeds the limit (${
//           selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
//         }). Please upload a smaller file.`
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       return;
//     }

//     setFile(selectedFile);
//     const reader = new FileReader();
//     reader.onload = () => setFilePreview(reader.result);
//     reader.readAsDataURL(selectedFile);
//   };

//   const clearFile = () => {
//     setFile(null);
//     setFilePreview(null);
//     document.getElementById("media-upload").value = null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       toast.error("Title cannot be empty");
//       return;
//     }
//     if (!formData.description.trim()) {
//       toast.error("Description cannot be empty");
//       return;
//     }

//     setIsSubmitting(true);
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("isAnonymous", formData.isAnonymous);
//     data.append("category", formData.category);
//     if (file) data.append("media", file);

//     try {
//       await createPost(data);
//       toast.success("Post created successfully");
//       navigate("/");
//     } catch (err) {
//       toast.error(err.message || "Failed to create post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-500 font-poppins">
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
//         </div>
//       </header>

//       <div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center"
//       >
//         <div className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg transition-colors duration-500">
//           <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
//             Share Your Gossip
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
//                 placeholder="What's the juicy gossip?"
//                 aria-label="Post title"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Description
//               </label>
//               <ReactQuill
//                 value={formData.description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Spill the details... Use formatting options to enhance your post."
//                 className="bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-300"
//                 modules={{
//                   toolbar: [
//                     [{ header: [1, 2, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     [{ color: [] }, { background: [] }],
//                     ["link", "image", "video"],
//                     ["clean"],
//                   ],
//                 }}
//                 formats={[
//                   "header",
//                   "bold",
//                   "italic",
//                   "underline",
//                   "strike",
//                   "list",
//                   "bullet",
//                   "link",
//                   "image",
//                   "video",
//                   "color",
//                   "background",
//                 ]}
//                 aria-label="Post description editor"
//               />
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="isAnonymous"
//                 id="isAnonymous"
//                 checked={formData.isAnonymous}
//                 onChange={handleChange}
//                 className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
//                 aria-label="Post anonymously"
//               />
//               <label
//                 htmlFor="isAnonymous"
//                 className="ml-2 text-sm font-medium text-gray-600"
//               >
//                 Post Anonymously
//               </label>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-900"
//                 aria-label="Post category"
//               >
//                 <option value="General">General</option>
//                 <option value="Humor">Humor</option>
//                 <option value="News">News</option>
//                 <option value="Jobs">Jobs</option>
//                 <option value="Reviews">Reviews</option>
//                 <option value="Movie Gossips">Movie</option>
//                 <option value="Celebrity Gossips">Celebrity</option>
//                 <option value="Personal Life Gossips">Personal Life</option>
//                 <option value="Office Gossips">Office</option>
//                 <option value="College Gossips">College</option>
//                 <option value="School Gossips">School</option>
//                 <option value="Music and Dance">Music and Dance</option>
//                 <option value="Industry Gossips">Industry</option>
//                 <option value="Sports">Sports</option>
//                 <option value="Social Media">Social Media</option>
//                 <option value="Entertainment">Entertainment</option>
//                 <option value="Political">Political</option>
//                 <option value="International">International</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Media (Image or Video)
//               </label>
//               <div className="relative">
//                 <input
//                   id="media-upload"
//                   type="file"
//                   accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
//                   onChange={handleFileChange}
//                   className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200 transition-all duration-300"
//                   aria-label="Upload image or video"
//                 />
//               </div>
//               {filePreview && (
//                 <div className="mt-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-sm text-gray-600">Preview:</p>
//                     <button
//                       type="button"
//                       onClick={clearFile}
//                       className="text-sm text-red-600 hover:underline"
//                       aria-label="Clear uploaded media"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                   {file?.type.startsWith("image/") ? (
//                     <img
//                       src={filePreview}
//                       alt="Media preview"
//                       className="max-w-xs rounded-lg shadow-sm"
//                     />
//                   ) : (
//                     <video
//                       src={filePreview}
//                       controls
//                       className="max-w-xs rounded-lg shadow-sm"
//                       aria-label="Video preview"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>
//             <button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                 isSubmitting
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               } flex items-center justify-center space-x-2`}
//               aria-label={isSubmitting ? "Creating post" : "Create post"}
//             >
//               {isSubmitting ? (
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
//                   <span>Creating...</span>
//                 </>
//               ) : (
//                 <span>Create Post</span>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostForm;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createPost } from "../utils/api";
// import ReactQuill from "react-quill-new";
// import "quill/dist/quill.snow.css";

// const PostForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     isAnonymous: false,
//     category: "General",
//   });
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false); // Add dark mode state
//   const navigate = useNavigate();

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData({
//       ...formData,
//       description: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) {
//       setFile(null);
//       setFilePreview(null);
//       return;
//     }

//     const validTypes = [
//       "image/jpeg",
//       "image/webp",
//       "image/png",
//       "image/gif",
//       "video/mp4",
//       "video/webm",
//     ];
//     if (!validTypes.includes(selectedFile.type)) {
//       toast.error(
//         "Please upload an image (JPEG, PNG, GIF) or video (MP4, WebM)"
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       return;
//     }

//     const maxSize = selectedFile.type.startsWith("image/")
//       ? 10 * 1024 * 1024
//       : 40 * 1024 * 1024; // 10MB for images, 40MB for videos (Cloudinary free-tier limit)
//     if (selectedFile.size > maxSize) {
//       toast.error(
//         `File size exceeds the limit (${
//           selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
//         }). Please upload a smaller file.`
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       return;
//     }

//     setFile(selectedFile);
//     const reader = new FileReader();
//     reader.onload = () => setFilePreview(reader.result);
//     reader.readAsDataURL(selectedFile);
//   };

//   const clearFile = () => {
//     setFile(null);
//     setFilePreview(null);
//     document.getElementById("media-upload").value = null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       toast.error("Title cannot be empty");
//       return;
//     }
//     if (!formData.description.trim()) {
//       toast.error("Description cannot be empty");
//       return;
//     }

//     setIsSubmitting(true);
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("isAnonymous", formData.isAnonymous);
//     data.append("category", formData.category);
//     if (file) data.append("media", file);

//     try {
//       await createPost(data);
//       toast.success("Post created successfully");
//       navigate("/");
//     } catch (err) {
//       toast.error(err.message || "Failed to create post");
//     } finally {
//       setIsSubmitting(false);
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

//       <div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center"
//       >
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
//             Share Your Gossip
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
//                 placeholder="What's the juicy gossip?"
//                 aria-label="Post title"
//               />
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Description
//               </label>
//               <ReactQuill
//                 value={formData.description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Spill the details... Use formatting options to enhance your post."
//                 className={`${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-300`}
//                 modules={{
//                   toolbar: [
//                     [{ header: [1, 2, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     [{ color: [] }, { background: [] }],
//                     ["link", "image", "video"],
//                     ["clean"],
//                   ],
//                 }}
//                 formats={[
//                   "header",
//                   "bold",
//                   "italic",
//                   "underline",
//                   "strike",
//                   "list",
//                   "bullet",
//                   "link",
//                   "image",
//                   "video",
//                   "color",
//                   "background",
//                 ]}
//                 aria-label="Post description editor"
//               />
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="isAnonymous"
//                 id="isAnonymous"
//                 checked={formData.isAnonymous}
//                 onChange={handleChange}
//                 className={`h-5 w-5 text-red-600 focus:ring-red-500 ${
//                   isDarkMode ? "border-gray-700" : "border-gray-300"
//                 } rounded`}
//                 aria-label="Post anonymously"
//               />
//               <label
//                 htmlFor="isAnonymous"
//                 className={`ml-2 text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 }`}
//               >
//                 Post Anonymously
//               </label>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
//                 aria-label="Post category"
//               >
//                 <option value="General">General</option>
//                 <option value="Humor">Humor</option>
//                 <option value="News">News</option>
//                 <option value="Jobs">Jobs</option>
//                 <option value="Reviews">Reviews</option>
//                 <option value="Movie Gossips">Movie</option>
//                 <option value="Celebrity Gossips">Celebrity</option>
//                 <option value="Personal Life Gossips">Personal Life</option>
//                 <option value="Office Gossips">Office</option>
//                 <option value="College Gossips">College</option>
//                 <option value="School Gossips">School</option>
//                 <option value="Music and Dance">Music and Dance</option>
//                 <option value="Industry Gossips">Industry</option>
//                 <option value="Sports">Sports</option>
//                 <option value="Social Media">Social Media</option>
//                 <option value="Entertainment">Entertainment</option>
//                 <option value="Political">Political</option>
//                 <option value="International">International</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Media (Image or Video)
//               </label>
//               <div className="relative">
//                 <input
//                   id="media-upload"
//                   type="file"
//                   accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
//                   onChange={handleFileChange}
//                   className={`w-full p-3 ${
//                     isDarkMode
//                       ? "bg-gray-800 text-gray-100"
//                       : "bg-gray-50 text-gray-900"
//                   } border ${
//                     isDarkMode ? "border-gray-700" : "border-gray-200"
//                   } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
//                     isDarkMode
//                       ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
//                       : "file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
//                   } transition-all duration-300`}
//                   aria-label="Upload image or video"
//                 />
//               </div>
//               {filePreview && (
//                 <div className="mt-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-200" : "text-gray-600"
//                       }`}
//                     >
//                       Preview:
//                     </p>
//                     <button
//                       type="button"
//                       onClick={clearFile}
//                       className={`text-sm ${
//                         isDarkMode
//                           ? "text-red-400 hover:underline"
//                           : "text-red-600 hover:underline"
//                       }`}
//                       aria-label="Clear uploaded media"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                   {file?.type.startsWith("image/") ? (
//                     <img
//                       src={filePreview}
//                       alt="Media preview"
//                       className="max-w-xs rounded-lg shadow-sm"
//                     />
//                   ) : (
//                     <video
//                       src={filePreview}
//                       controls
//                       className="max-w-xs rounded-lg shadow-sm"
//                       aria-label="Video preview"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>
//             <button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                 isSubmitting
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               } flex items-center justify-center space-x-2`}
//               aria-label={isSubmitting ? "Creating post" : "Create post"}
//             >
//               {isSubmitting ? (
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
//                   <span>Creating...</span>
//                 </>
//               ) : (
//                 <span>Create Post</span>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostForm;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////04-06-2025

// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createPost } from "../utils/api";
// import ReactQuill from "react-quill-new";
// import "quill/dist/quill.snow.css";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Note: Exposing API keys in the frontend is insecure and should be avoided in production.
// // Move this to the backend for a secure implementation.
// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace with your Gemini API key

// const PostForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     isAnonymous: false,
//     category: "General",
//   });
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [contentRating, setContentRating] = useState(null); // State for overall rating
//   const [isRatingLoading, setIsRatingLoading] = useState(false); // State for loading rating
//   const navigate = useNavigate();

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Debounce function to limit API calls
//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func(...args), delay);
//     };
//   };

//   // Function to convert file to base64
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result.split(",")[1]); // Get base64 string without the data URI prefix
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(file);
//     });
//   };

//   // Function to generate a fallback explanation based on the rating
//   const generateFallbackExplanation = (rating) => {
//     if (rating >= 7) {
//       return "The gossip post excels in humor, engagement, originality, and appropriateness, making it highly enjoyable and suitable for sharing.";
//     } else if (rating >= 4) {
//       return "The gossip post is moderately engaging and original but may lack in humor or have minor appropriateness concerns.";
//     } else {
//       return "The gossip post struggles with humor, engagement, originality, or contains inappropriate elements that make it less suitable.";
//     }
//   };

//   // Function to rate content using Gemini API across multiple aspects
//   const rateContentWithGemini = async (title, description, file) => {
//     if (!title.trim() && !description.trim() && !file) {
//       setContentRating(null);
//       return;
//     }

//     setIsRatingLoading(true);
//     setContentRating(null);

//     try {
//       // Initialize Gemini API
//       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       // Construct the prompt
//       let prompt = `You are an AI content evaluation specialist. You will evaluate a gossip post across the following aspects: humor (how funny or amusing it is), engagement (how interesting or captivating it is to readers), originality (how unique or creative the content is), and appropriateness (whether the content is suitable for a general audience, avoiding offensive or harmful elements). Based on these aspects, provide an overall rating on a scale of 0 to 10 (0 being very poor, 10 being excellent), and explain why you gave it that rating by addressing each aspect in your explanation.

// Gossip Post Title: ${title}
// Gossip Post Description: ${description}
// ${
//   file && file.type.startsWith("image/")
//     ? "\nGossip Post Image: [Attached Image]"
//     : ""
// }`;

//       // Prepare the request parts
//       const requestParts = [prompt];

//       // Add image if present
//       if (file && file.type.startsWith("image/")) {
//         const base64Data = await fileToBase64(file);
//         const imagePart = {
//           inlineData: {
//             data: base64Data,
//             mimeType: file.type,
//           },
//         };
//         requestParts.push(imagePart);
//       }

//       // Add instructions for response format
//       requestParts.push(`
// Respond in the following exact format:
// Rating: X/10
// Explanation: [Your detailed explanation addressing humor, engagement, originality, and appropriateness]

// Ensure the explanation is at least two sentences long and provides specific insights for each aspect.`);

//       const result = await model.generateContent(requestParts);
//       const responseText = result.response.text().trim();

//       // Parse the response
//       const ratingMatch = responseText.match(/Rating:\s*(\d+)\/10/);
//       let explanationMatch = responseText.match(/Explanation:\s*(.+)/s); // Use /s to match across multiple lines

//       const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5; // Default to 5 if parsing fails

//       // If explanation is missing or too short, try to extract any remaining text or use a fallback
//       let explanation;
//       if (explanationMatch && explanationMatch[1].trim().length > 10) {
//         explanation = explanationMatch[1].trim();
//       } else {
//         // Try to capture any text after the rating as a fallback
//         const remainingText = responseText
//           .split(/Rating:\s*\d+\/10/)[1]
//           ?.trim();
//         if (remainingText && remainingText.length > 10) {
//           explanation = remainingText.replace(/Explanation:\s*/, "").trim();
//         } else {
//           // Use a fallback explanation based on the rating
//           explanation = generateFallbackExplanation(rating);
//         }
//       }

//       setContentRating({
//         rating: rating,
//         explanation: explanation,
//       });
//     } catch (error) {
//       console.error("Error rating content with Gemini API:", error);
//       toast.error("Failed to evaluate the post. Please try again.");
//       setContentRating({
//         rating: 0,
//         explanation: "Error: Unable to analyze the post due to an API issue.",
//       });
//     } finally {
//       setIsRatingLoading(false);
//     }
//   };

//   // Debounced version of the rating function
//   const debouncedRateContent = useCallback(
//     debounce((title, description, file) => {
//       rateContentWithGemini(title, description, file);
//     }, 1000),
//     []
//   );

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => {
//       const updatedFormData = {
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       };
//       // Trigger rating analysis when title changes
//       if (name === "title") {
//         debouncedRateContent(value, prev.description, file);
//       }
//       return updatedFormData;
//     });
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData((prev) => {
//       const updatedFormData = {
//         ...prev,
//         description: value,
//       };
//       // Trigger rating analysis when description changes
//       debouncedRateContent(prev.title, value, file);
//       return updatedFormData;
//     });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) {
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(formData.title, formData.description, null);
//       return;
//     }

//     const validTypes = [
//       "image/jpeg",
//       "image/webp",
//       "image/png",
//       "image/gif",
//       "video/mp4",
//       "video/webm",
//     ];
//     if (!validTypes.includes(selectedFile.type)) {
//       toast.error(
//         "Please upload an image (JPEG, PNG, GIF) or video (MP4, WebM)"
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(formData.title, formData.description, null);
//       return;
//     }

//     const maxSize = selectedFile.type.startsWith("image/")
//       ? 10 * 1024 * 1024
//       : 40 * 1024 * 1024; // 10MB for images, 40MB for videos
//     if (selectedFile.size > maxSize) {
//       toast.error(
//         `File size exceeds the limit (${
//           selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
//         }). Please upload a smaller file.`
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(formData.title, formData.description, null);
//       return;
//     }

//     setFile(selectedFile);
//     const reader = new FileReader();
//     reader.onload = () => setFilePreview(reader.result);
//     reader.readAsDataURL(selectedFile);

//     // Trigger rating analysis with the new file
//     debouncedRateContent(formData.title, formData.description, selectedFile);
//   };

//   const clearFile = () => {
//     setFile(null);
//     setFilePreview(null);
//     document.getElementById("media-upload").value = null;
//     debouncedRateContent(formData.title, formData.description, null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       toast.error("Title cannot be empty");
//       return;
//     }
//     if (!formData.description.trim()) {
//       toast.error("Description cannot be empty");
//       return;
//     }

//     // Optional: Warn if overall rating is low
//     if (contentRating?.rating <= 3) {
//       toast.warn(
//         "The gossip post has a low overall rating. Are you sure you want to proceed?"
//       );
//       // You can add a confirmation dialog here if needed
//     }

//     setIsSubmitting(true);
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("isAnonymous", formData.isAnonymous);
//     data.append("category", formData.category);
//     if (file) data.append("media", file);

//     try {
//       await createPost(data);
//       toast.success("Post created successfully");
//       navigate("/");
//     } catch (err) {
//       toast.error(err.message || "Failed to create post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Function to get rating styles based on the numerical rating
//   const getRatingStyles = (rating) => {
//     if (rating >= 7) {
//       return {
//         bgColor: "bg-green-500",
//         textColor: "text-white",
//       };
//     } else if (rating >= 4) {
//       return {
//         bgColor: "bg-orange-500",
//         textColor: "text-white",
//       };
//     } else {
//       return {
//         bgColor: "bg-red-500",
//         textColor: "text-white",
//       };
//     }
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

//       <div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center"
//       >
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
//             Share Your Gossip
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
//                 placeholder="What's the juicy gossip?"
//                 aria-label="Post title"
//               />
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Description
//               </label>
//               <ReactQuill
//                 value={formData.description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Spill the details... Use formatting options to enhance your post."
//                 className={`${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-300`}
//                 modules={{
//                   toolbar: [
//                     [{ header: [1, 2, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     [{ color: [] }, { background: [] }],
//                     ["link", "image", "video"],
//                     ["clean"],
//                   ],
//                 }}
//                 formats={[
//                   "header",
//                   "bold",
//                   "italic",
//                   "underline",
//                   "strike",
//                   "list",
//                   "bullet",
//                   "link",
//                   "image",
//                   "video",
//                   "color",
//                   "background",
//                 ]}
//                 aria-label="Post description editor"
//               />
//               {/* Display overall rating below description with background */}
//               {(isRatingLoading || contentRating) && (
//                 <div
//                   className={`mt-3 p-4 rounded-lg ${
//                     isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                   } transition-colors duration-500`}
//                 >
//                   {isRatingLoading ? (
//                     <div className="flex items-center gap-2">
//                       <svg
//                         className="animate-spin h-5 w-5 text-red-600"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-200" : "text-gray-600"
//                         }`}
//                       >
//                         Evaluating post...
//                       </span>
//                     </div>
//                   ) : (
//                     contentRating && (
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`text-sm font-medium ${
//                               isDarkMode ? "text-gray-200" : "text-gray-600"
//                             }`}
//                           >
//                             Overall Rating:
//                           </span>
//                           <span
//                             className={`text-sm font-medium px-3 py-1 rounded-full ${
//                               getRatingStyles(contentRating.rating).bgColor
//                             } ${
//                               getRatingStyles(contentRating.rating).textColor
//                             }`}
//                           >
//                             {contentRating.rating}/10
//                           </span>
//                         </div>
//                         <p
//                           className={`text-sm ${
//                             isDarkMode ? "text-gray-400" : "text-gray-500"
//                           }`}
//                         >
//                           <span className="font-medium">Explanation:</span>{" "}
//                           {contentRating.explanation}
//                         </p>
//                       </div>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="isAnonymous"
//                 id="isAnonymous"
//                 checked={formData.isAnonymous}
//                 onChange={handleChange}
//                 className={`h-5 w-5 text-red-600 focus:ring-red-500 ${
//                   isDarkMode ? "border-gray-700" : "border-gray-300"
//                 } rounded`}
//                 aria-label="Post anonymously"
//               />
//               <label
//                 htmlFor="isAnonymous"
//                 className={`ml-2 text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 }`}
//               >
//                 Post Anonymously
//               </label>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
//                 aria-label="Post category"
//               >
//                 <option value="General">General</option>
//                 <option value="Humor">Humor</option>
//                 <option value="News">News</option>
//                 <option value="Jobs">Jobs</option>
//                 <option value="Reviews">Reviews</option>
//                 <option value="Movie Gossips">Movie</option>
//                 <option value="Celebrity Gossips">Celebrity</option>
//                 <option value="Personal Life Gossips">Personal Life</option>
//                 <option value="Office Gossips">Office</option>
//                 <option value="College Gossips">College</option>
//                 <option value="School Gossips">School</option>
//                 <option value="Music and Dance">Music and Dance</option>
//                 <option value="Industry Gossips">Industry</option>
//                 <option value="Sports">Sports</option>
//                 <option value="Social Media">Social Media</option>
//                 <option value="Entertainment">Entertainment</option>
//                 <option value="Political">Political</option>
//                 <option value="International">International</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Media (Image or Video)
//               </label>
//               <div className="relative">
//                 <input
//                   id="media-upload"
//                   type="file"
//                   accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
//                   onChange={handleFileChange}
//                   className={`w-full p-3 ${
//                     isDarkMode
//                       ? "bg-gray-800 text-gray-100"
//                       : "bg-gray-50 text-gray-900"
//                   } border ${
//                     isDarkMode ? "border-gray-700" : "border-gray-200"
//                   } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
//                     isDarkMode
//                       ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
//                       : "file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
//                   } transition-all duration-300`}
//                   aria-label="Upload image or video"
//                 />
//               </div>
//               {filePreview && (
//                 <div className="mt-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-200" : "text-gray-600"
//                       }`}
//                     >
//                       Preview:
//                     </p>
//                     <button
//                       type="button"
//                       onClick={clearFile}
//                       className={`text-sm ${
//                         isDarkMode
//                           ? "text-red-400 hover:underline"
//                           : "text-red-600 hover:underline"
//                       }`}
//                       aria-label="Clear uploaded media"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                   {file?.type.startsWith("image/") ? (
//                     <img
//                       src={filePreview}
//                       alt="Media preview"
//                       className="max-w-xs rounded-lg shadow-sm"
//                     />
//                   ) : (
//                     <video
//                       src={filePreview}
//                       controls
//                       className="max-w-xs rounded-lg shadow-sm"
//                       aria-label="Video preview"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>
//             <button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                 isSubmitting
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               } flex items-center justify-center space-x-2`}
//               aria-label={isSubmitting ? "Creating post" : "Create post"}
//             >
//               {isSubmitting ? (
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
//                   <span>Creating...</span>
//                 </>
//               ) : (
//                 <span>Create Post</span>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostForm;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////10-06-2025
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPost } from "../utils/api";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: The API key is accessed from the .env file using Vite's convention.
// For production, move API calls to a backend to fully secure the API key.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isAnonymous: false,
    category: "General",
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contentRating, setContentRating] = useState(null); // State for overall rating
  const [isRatingLoading, setIsRatingLoading] = useState(false); // State for loading rating
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false); // State for generating description
  const [mediaSuggestions, setMediaSuggestions] = useState([]); // State for media suggestions
  const navigate = useNavigate();

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Get base64 string without the data URI prefix
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Function to generate a fallback explanation based on the rating
  const generateFallbackExplanation = (rating) => {
    if (rating >= 7) {
      return "The gossip post excels in humor, engagement, originality, and appropriateness, making it highly enjoyable and suitable for sharing.";
    } else if (rating >= 4) {
      return "The gossip post is moderately engaging and original but may lack in humor or have minor appropriateness concerns.";
    } else {
      return "The gossip post struggles with humor, engagement, originality, or contains inappropriate elements that make it less suitable.";
    }
  };

  // Function to detect the language of the title using Gemini API
  const detectLanguageWithGemini = async (title) => {
    if (!GEMINI_API_KEY) {
      return "English"; // Default to English if API key is missing
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Detect the language of the following text and return only the language name (e.g., "Telugu", "Hindi", "English"). Do not include any additional text or explanation.

Text: ${title}`;

      const result = await model.generateContent([prompt]);
      const detectedLanguage = result.response.text().trim();

      // Validate the detected language (basic check)
      const supportedLanguages = [
        "Telugu",
        "Hindi",
        "English",
        "Tamil",
        "Kannada",
        "Malayalam",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Punjabi",
      ];
      return supportedLanguages.includes(detectedLanguage)
        ? detectedLanguage
        : "English";
    } catch (error) {
      console.error("Error detecting language with Gemini API:", error);
      return "English"; // Default to English on error
    }
  };

  // Function to extract media suggestions from the description
  const extractMediaSuggestions = (description) => {
    const suggestionRegex =
      /<!--\s*(Suggested Image|Suggested Video):\s*([^--]+)-->/g;
    const suggestions = [];
    let match;
    while ((match = suggestionRegex.exec(description)) !== null) {
      suggestions.push({
        type: match[1], // "Suggested Image" or "Suggested Video"
        description: match[2].trim(),
      });
    }
    return suggestions;
  };

  // Function to rate content using Gemini API across multiple aspects
  const rateContentWithGemini = async (title, description, file) => {
    if (!title.trim() && !description.trim() && !file) {
      setContentRating(null);
      return;
    }

    // Check if the API key is available
    if (!GEMINI_API_KEY) {
      toast.error(
        "Gemini API key is missing. Please check your environment configuration."
      );
      setContentRating({
        rating: 0,
        explanation: "Error: Gemini API key is not configured.",
      });
      setIsRatingLoading(false);
      return;
    }

    setIsRatingLoading(true);
    setContentRating(null);

    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Construct the prompt
      let prompt = `You are an AI content evaluation specialist. You will evaluate a gossip post across the following aspects: humor (how funny or amusing it is), engagement (how interesting or captivating it is to readers), originality (how unique or creative the content is), and appropriateness (whether the content is suitable for a general audience, avoiding offensive or harmful elements). Based on these aspects, provide an overall rating on a scale of 0 to 10 (0 being very poor, 10 being excellent), and explain why you gave it that rating by addressing each aspect in your explanation.

Gossip Post Title: ${title}
Gossip Post Description: ${description}
${
  file && file.type.startsWith("image/")
    ? "\nGossip Post Image: [Attached Image]"
    : ""
}`;

      // Prepare the request parts
      const requestParts = [prompt];

      // Add image if present
      if (file && file.type.startsWith("image/")) {
        const base64Data = await fileToBase64(file);
        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        };
        requestParts.push(imagePart);
      }

      // Add instructions for response format
      requestParts.push(`
Respond in the following exact format:
Rating: X/10
Explanation: [Your detailed explanation addressing humor, engagement, originality, and appropriateness]

Ensure the explanation is at least two sentences long and provides specific insights for each aspect.`);

      const result = await model.generateContent(requestParts);
      const responseText = result.response.text().trim();

      // Parse the response
      const ratingMatch = responseText.match(/Rating:\s*(\d+)\/10/);
      let explanationMatch = responseText.match(/Explanation:\s*(.+)/s); // Use /s to match across multiple lines

      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5; // Default to 5 if parsing fails

      // If explanation is missing or too short, try to extract any remaining text or use a fallback
      let explanation;
      if (explanationMatch && explanationMatch[1].trim().length > 10) {
        explanation = explanationMatch[1].trim();
      } else {
        // Try to capture any text after the rating as a fallback
        const remainingText = responseText
          .split(/Rating:\s*\d+\/10/)[1]
          ?.trim();
        if (remainingText && remainingText.length > 10) {
          explanation = remainingText.replace(/Explanation:\s*/, "").trim();
        } else {
          // Use a fallback explanation based on the rating
          explanation = generateFallbackExplanation(rating);
        }
      }

      setContentRating({
        rating: rating,
        explanation: explanation,
      });
    } catch (error) {
      console.error("Error rating content with Gemini API:", error);
      toast.error("Failed to evaluate the post. Please try again.");
      setContentRating({
        rating: 0,
        explanation: "Error: Unable to analyze the post due to an API issue.",
      });
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Function to generate description using Gemini API in the same language as the title
  const generateDescriptionWithGemini = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title before generating a description.");
      return;
    }

    // Check if the API key is available
    if (!GEMINI_API_KEY) {
      toast.error(
        "Gemini API key is missing. Please check your environment configuration."
      );
      return;
    }

    setIsGeneratingDescription(true);
    setMediaSuggestions([]); // Clear previous suggestions

    try {
      // Step 1: Detect the language of the title
      const detectedLanguage = await detectLanguageWithGemini(formData.title);
      console.log(`Detected language: ${detectedLanguage}`); // For debugging

      // Step 2: Generate the description in the detected language
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Construct the prompt for generating a description in the detected language
      const prompt = `You are an AI content creator specializing in gossip posts. Based on the provided title, generate a detailed and engaging description for a gossip post in the language "${detectedLanguage}". The description should be well-structured, including subheadings (using HTML <h2> tags), paragraphs (using <p> tags), and bullet points (using <ul> and <li> tags) where appropriate. Ensure the content is suitable for a general audience, avoiding offensive or harmful elements, and aligns with the tone of a gossip post (lighthearted, intriguing, and conversational).

      Additionally, suggest at least one relevant image and one relevant video that would complement the gossip post. Include these suggestions as HTML comments within the description in the following format:
      <!-- Suggested Image: [Description of the image] -->
      <!-- Suggested Video: [Description of the video] -->
      Place these comments at appropriate locations within the description where the media would make sense contextually.

      Gossip Post Title: ${formData.title}

      Respond with the description in HTML format, compatible with a rich text editor like ReactQuill. Do not include <html>, <body>, or other top-level tags, just the content with appropriate HTML tags (e.g., <h2>, <p>, <ul>, <li>, etc.). Ensure the content is at least 150 words long and includes at least one subheading and one bullet point list. The entire description must be in "${detectedLanguage}".`;

      // Inside generateDescriptionWithGemini, replace the prompt assignment with:

      // const prompt = `You are an expert AI gossip columnist. Using the provided title, generate a spicy, engaging, and informative post in the language "${detectedLanguage}".

      // **Structure your post as follows:**

      // <h2>1. Attention-Grabbing Headline & Introduction</h2>
      // <p>Start with a bold, catchy headline and a lively introduction that hooks the reader and sets the tone for the post.</p>

      // <h2>2. The Facts (Official Statements & Latest Updates)</h2>
      // <p>Clearly present the main facts of the story, using direct quotes, official statements, and the latest updates from credible sources. Use bullet points for clarity:</p>
      // <ul>
      //   <li>Direct quotes from producers, actors, or official spokespeople (if available)</li>
      //   <li>Specific events, dates, and actions from the latest news</li>
      //   <li>Current status of the project or issue (confirmed, shelved, in development, etc.)</li>
      //   <li>Any official denials, confirmations, or clarifications</li>
      // </ul>
      // <p>Only include information that is accurate, up-to-date, and from reliable sources. Make sure to reflect the most recent statements and developments.</p>

      // <h2>3. The Juicy Speculation (Rumors & Wild Theories)</h2>
      // <p>Add a section for spicy gossip, rumors, or wild theories. Clearly label this section as “Rumors & Wild Theories” or “Juicy Speculation” so readers know it is not confirmed. Keep it playful, entertaining, and conversation-sparking.</p>

      // <h2>4. Reader Engagement</h2>
      // <p>End with a question or call-to-action to encourage comments, sharing, and lively discussion.</p>

      // <!-- Suggested Image: [Description of a relevant image, e.g., main actors or producers together] -->
      // <!-- Suggested Video: [Description of a relevant video, e.g., interview or teaser footage] -->

      // The description must be at least 150 words, with at least one subheading and one bullet list.

      // Gossip Post Title: ${formData.title}

      // Respond only with the HTML content, ready for use in a rich text editor. Do not include <html> or <body> tags. The entire description must be in "${detectedLanguage}".`;

      const result = await model.generateContent([prompt]);
      const generatedDescription = result.response.text().trim();

      // Extract media suggestions from the description
      const suggestions = extractMediaSuggestions(generatedDescription);
      setMediaSuggestions(suggestions);

      // Update the description in formData
      setFormData((prev) => ({
        ...prev,
        description: generatedDescription,
      }));

      // Trigger rating analysis with the new description
      debouncedRateContent(formData.title, generatedDescription, file);

      toast.success("Description generated successfully!");
    } catch (error) {
      console.error("Error generating description with Gemini API:", error);
      toast.error("Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Debounced version of the rating function
  const debouncedRateContent = useCallback(
    debounce((title, description, file) => {
      rateContentWithGemini(title, description, file);
    }, 1000),
    []
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Trigger rating analysis when title changes
      if (name === "title") {
        debouncedRateContent(value, prev.description, file);
      }
      return updatedFormData;
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        description: value,
      };
      // Trigger rating analysis when description changes
      debouncedRateContent(prev.title, value, file);
      // Update media suggestions if the description is manually edited
      const suggestions = extractMediaSuggestions(value);
      setMediaSuggestions(suggestions);
      return updatedFormData;
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setFilePreview(null);
      debouncedRateContent(formData.title, formData.description, null);
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/webp",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(
        "Please upload an image (JPEG, PNG, GIF) or video (MP4, WebM)"
      );
      e.target.value = null;
      setFile(null);
      setFilePreview(null);
      debouncedRateContent(formData.title, formData.description, null);
      return;
    }

    const maxSize = selectedFile.type.startsWith("image/")
      ? 10 * 1024 * 1024
      : 40 * 1024 * 1024; // 10MB for images, 40MB for videos
    if (selectedFile.size > maxSize) {
      toast.error(
        `File size exceeds the limit (${
          selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
        }). Please upload a smaller file.`
      );
      e.target.value = null;
      setFile(null);
      setFilePreview(null);
      debouncedRateContent(formData.title, formData.description, null);
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(selectedFile);

    // Trigger rating analysis with the new file
    debouncedRateContent(formData.title, formData.description, selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    document.getElementById("media-upload").value = null;
    debouncedRateContent(formData.title, formData.description, null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description cannot be empty");
      return;
    }

    // Optional: Warn if overall rating is low
    if (contentRating?.rating <= 3) {
      toast.warn(
        "The gossip post has a low overall rating. Are you sure you want to proceed?"
      );
      // You can add a confirmation dialog here if needed
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("isAnonymous", formData.isAnonymous);
    data.append("category", formData.category);
    if (file) data.append("media", file);

    try {
      await createPost(data);
      toast.success("Post created successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to get rating styles based on the numerical rating
  const getRatingStyles = (rating) => {
    if (rating >= 7) {
      return {
        bgColor: "bg-green-500",
        textColor: "text-white",
      };
    } else if (rating >= 4) {
      return {
        bgColor: "bg-orange-500",
        textColor: "text-white",
      };
    } else {
      return {
        bgColor: "bg-red-500",
        textColor: "text-white",
      };
    }
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Back to previous page"
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

      <div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center"
      >
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
            Share Your Gossip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } mb-1`}
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full p-3 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
                placeholder="What's the juicy gossip?"
                aria-label="Post title"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Description
                </label>
                <button
                  type="button"
                  onClick={generateDescriptionWithGemini}
                  disabled={isGeneratingDescription || !formData.title.trim()}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg font-medium text-sm transition-all duration-300 ${
                    isGeneratingDescription || !formData.title.trim()
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : isDarkMode
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  aria-label="Generate description with AI"
                >
                  {isGeneratingDescription ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 15l-5-5h10l-5 5zm0-10l5 5H5l5-5zm-8 5h16v2H2v-2z" />
                      </svg>
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Spill the details... Use formatting options to enhance your post."
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-300`}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, { background: [] }],
                    ["link", "image", "video"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "list",
                  "bullet",
                  "link",
                  "image",
                  "video",
                  "color",
                  "background",
                ]}
                aria-label="Post description editor"
              />
              {/* Display media suggestions below the editor */}
              {mediaSuggestions.length > 0 && (
                <div
                  className={`mt-3 p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  } transition-colors duration-500`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-600"
                    } mb-2`}
                  >
                    Suggested Media for Your Post:
                  </p>
                  <ul className="space-y-1">
                    {mediaSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } flex items-center gap-2`}
                      >
                        <span className="font-medium">
                          {suggestion.type === "Suggested Image"
                            ? "📷 Image:"
                            : "🎥 Video:"}
                        </span>
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Display overall rating below description with background */}
              {(isRatingLoading || contentRating) && (
                <div
                  className={`mt-3 p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  } transition-colors duration-500`}
                >
                  {isRatingLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-red-600"
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
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        Evaluating post...
                      </span>
                    </div>
                  ) : (
                    contentRating && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-gray-200" : "text-gray-600"
                            }`}
                          >
                            Overall Rating:
                          </span>
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                              getRatingStyles(contentRating.rating).bgColor
                            } ${
                              getRatingStyles(contentRating.rating).textColor
                            }`}
                          >
                            {contentRating.rating}/10
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span className="font-medium">Explanation:</span>{" "}
                          {contentRating.explanation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className={`h-5 w-5 text-red-600 focus:ring-red-500 ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                } rounded`}
                aria-label="Post anonymously"
              />
              <label
                htmlFor="isAnonymous"
                className={`ml-2 text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                }`}
              >
                Post Anonymously
              </label>
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } mb-1`}
              >
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                aria-label="Post category"
              >
                <option value="General">General</option>
                <option value="Humor">Humor</option>
                <option value="News">News</option>
                <option value="Technology">Technology</option>
                <option value="Jobs">Jobs</option>
                <option value="Reviews">Reviews</option>
                <option value="Movie Gossips">Movie</option>
                <option value="Celebrity Gossips">Celebrity</option>
                <option value="Personal Life Gossips">Personal Life</option>
                <option value="Office Gossips">Office</option>
                <option value="College Gossips">College</option>
                <option value="School Gossips">School</option>
                <option value="Music and Dance">Music and Dance</option>
                <option value="Industry Gossips">Industry</option>
                <option value="Sports">Sports</option>
                <option value="Social Media">Social Media</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Political">Political</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } mb-1`}
              >
                Media (Image or Video)
              </label>
              <div className="relative">
                <input
                  id="media-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
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
                  aria-label="Upload image or video"
                />
              </div>
              {filePreview && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      Preview:
                    </p>
                    <button
                      type="button"
                      onClick={clearFile}
                      className={`text-sm ${
                        isDarkMode
                          ? "text-red-400 hover:underline"
                          : "text-red-600 hover:underline"
                      }`}
                      aria-label="Clear uploaded media"
                    >
                      Clear
                    </button>
                  </div>
                  {file?.type.startsWith("image/") ? (
                    <img
                      src={filePreview}
                      alt="Media preview"
                      className="max-w-xs rounded-lg shadow-sm"
                    />
                  ) : (
                    <video
                      src={filePreview}
                      controls
                      className="max-w-xs rounded-lg shadow-sm"
                      aria-label="Video preview"
                    />
                  )}
                </div>
              )}
            </div>
            <button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                isSubmitting
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } flex items-center justify-center space-x-2`}
              aria-label={isSubmitting ? "Creating post" : "Create post"}
            >
              {isSubmitting ? (
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
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Post</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createPost } from "../utils/api";
// import ReactQuill from "react-quill-new";
// import "quill/dist/quill.snow.css";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Note: The API key is accessed from the .env file using Vite's convention.
// // For production, move API calls to a backend to fully secure the API key.
// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// const PostForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     isAnonymous: false,
//     category: "General",
//     postType: "Post", // Default to regular post
//     duration: "", // For Shorts
//     hashtags: "", // Comma-separated hashtags
//   });
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [contentRating, setContentRating] = useState(null);
//   const [isRatingLoading, setIsRatingLoading] = useState(false);
//   const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
//   const [mediaSuggestions, setMediaSuggestions] = useState([]);
//   const navigate = useNavigate();

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Debounce function to limit API calls
//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func(...args), delay);
//     };
//   };

//   // Function to convert file to base64
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(file);
//     });
//   };

//   // Function to generate a fallback explanation based on the rating
//   const generateFallbackExplanation = (rating) => {
//     if (rating >= 7) {
//       return "The gossip post excels in humor, engagement, originality, and appropriateness, making it highly enjoyable and suitable for sharing.";
//     } else if (rating >= 4) {
//       return "The gossip post is moderately engaging and original but may lack in humor or have minor appropriateness concerns.";
//     } else {
//       return "The gossip post struggles with humor, engagement, originality, or contains inappropriate elements that make it less suitable.";
//     }
//   };

//   // Function to detect the language of the title using Gemini API
//   const detectLanguageWithGemini = async (title) => {
//     if (!GEMINI_API_KEY) {
//       return "English";
//     }

//     try {
//       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `Detect the language of the following text and return only the language name (e.g., "Telugu", "Hindi", "English"). Do not include any additional text or explanation.

// Text: ${title}`;

//       const result = await model.generateContent([prompt]);
//       const detectedLanguage = result.response.text().trim();

//       const supportedLanguages = [
//         "Telugu",
//         "Hindi",
//         "English",
//         "Tamil",
//         "Kannada",
//         "Malayalam",
//         "Bengali",
//         "Marathi",
//         "Gujarati",
//         "Punjabi",
//       ];
//       return supportedLanguages.includes(detectedLanguage)
//         ? detectedLanguage
//         : "English";
//     } catch (error) {
//       console.error("Error detecting language with Gemini API:", error);
//       return "English";
//     }
//   };

//   // Function to extract media suggestions from the description
//   const extractMediaSuggestions = (description) => {
//     const suggestionRegex =
//       /<!--\s*(Suggested Image|Suggested Video):\s*([^--]+)-->/g;
//     const suggestions = [];
//     let match;
//     while ((match = suggestionRegex.exec(description)) !== null) {
//       suggestions.push({
//         type: match[1],
//         description: match[2].trim(),
//       });
//     }
//     return suggestions;
//   };

//   // Function to rate content using Gemini API across multiple aspects
//   const rateContentWithGemini = async (title, description, file, postType) => {
//     if (!title.trim() && !description.trim() && !file) {
//       setContentRating(null);
//       return;
//     }

//     if (!GEMINI_API_KEY) {
//       toast.error(
//         "Gemini API key is missing. Please check your environment configuration."
//       );
//       setContentRating({
//         rating: 0,
//         explanation: "Error: Gemini API key is not configured.",
//       });
//       setIsRatingLoading(false);
//       return;
//     }

//     setIsRatingLoading(true);
//     setContentRating(null);

//     try {
//       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       let prompt = `You are an AI content evaluation specialist. You will evaluate a gossip post across the following aspects: humor (how funny or amusing it is), engagement (how interesting or captivating it is to readers), originality (how unique or creative the content is), and appropriateness (whether the content is suitable for a general audience, avoiding offensive or harmful elements). Based on these aspects, provide an overall rating on a scale of 0 to 10 (0 being very poor, 10 being excellent), and explain why you gave it that rating by addressing each aspect in your explanation.

// Post Type: ${postType} (Note: If the post type is "Short", it is a short-form video post similar to YouTube Shorts or Instagram Reels, which should be evaluated for quick engagement and visual appeal.)
// Gossip Post Title: ${title}
// Gossip Post Description: ${description}
// ${
//   file && file.type.startsWith("image/")
//     ? "\nGossip Post Image: [Attached Image]"
//     : ""
// }
// ${
//   file && file.type.startsWith("video/")
//     ? "\nGossip Post Video: [Attached Video]"
//     : ""
// }`;

//       const requestParts = [prompt];

//       if (file && file.type.startsWith("image/")) {
//         const base64Data = await fileToBase64(file);
//         const imagePart = {
//           inlineData: {
//             data: base64Data,
//             mimeType: file.type,
//           },
//         };
//         requestParts.push(imagePart);
//       }

//       requestParts.push(`
// Respond in the following exact format:
// Rating: X/10
// Explanation: [Your detailed explanation addressing humor, engagement, originality, and appropriateness]

// Ensure the explanation is at least two sentences long and provides specific insights for each aspect.`);

//       const result = await model.generateContent(requestParts);
//       const responseText = result.response.text().trim();

//       const ratingMatch = responseText.match(/Rating:\s*(\d+)\/10/);
//       let explanationMatch = responseText.match(/Explanation:\s*(.+)/s);

//       const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

//       let explanation;
//       if (explanationMatch && explanationMatch[1].trim().length > 10) {
//         explanation = explanationMatch[1].trim();
//       } else {
//         const remainingText = responseText
//           .split(/Rating:\s*\d+\/10/)[1]
//           ?.trim();
//         if (remainingText && remainingText.length > 10) {
//           explanation = remainingText.replace(/Explanation:\s*/, "").trim();
//         } else {
//           explanation = generateFallbackExplanation(rating);
//         }
//       }

//       setContentRating({
//         rating: rating,
//         explanation: explanation,
//       });
//     } catch (error) {
//       console.error("Error rating content with Gemini API:", error);
//       toast.error("Failed to evaluate the post. Please try again.");
//       setContentRating({
//         rating: 0,
//         explanation: "Error: Unable to analyze the post due to an API issue.",
//       });
//     } finally {
//       setIsRatingLoading(false);
//     }
//   };

//   // Function to generate description using Gemini API in the same language as the title
//   const generateDescriptionWithGemini = async () => {
//     if (!formData.title.trim()) {
//       toast.error("Please enter a title before generating a description.");
//       return;
//     }

//     if (!GEMINI_API_KEY) {
//       toast.error(
//         "Gemini API key is missing. Please check your environment configuration."
//       );
//       return;
//     }

//     setIsGeneratingDescription(true);
//     setMediaSuggestions([]);

//     try {
//       const detectedLanguage = await detectLanguageWithGemini(formData.title);
//       console.log(`Detected language: ${detectedLanguage}`);

//       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `You are an AI content creator specializing in gossip posts. Based on the provided title and post type, generate a detailed and engaging description for a gossip post in the language "${detectedLanguage}". The description should be well-structured, including subheadings (using HTML <h2> tags), paragraphs (using <p> tags), and bullet points (using <ul> and <li> tags) where appropriate. Ensure the content is suitable for a general audience, avoiding offensive or harmful elements, and aligns with the tone of a gossip post (lighthearted, intriguing, and conversational).

// Post Type: ${formData.postType} (Note: If the post type is "Short", generate a shorter description, under 100 words, suitable for a quick, engaging short-form video. Otherwise, for a "Post", ensure the description is at least 150 words long.)

// Additionally, suggest at least one relevant image and one relevant video that would complement the gossip post. Include these suggestions as HTML comments within the description in the following format:
// <!-- Suggested Image: [Description of the image] -->
// <!-- Suggested Video: [Description of the video] -->
// Place these comments at appropriate locations within the description where the media would make sense contextually.

// Gossip Post Title: ${formData.title}

// Respond with the description in HTML format, compatible with a rich text editor like ReactQuill. Do not include <html>, <body>, or other top-level tags, just the content with appropriate HTML tags (e.g., <h2>, <p>, <ul>, <li>, etc.). The entire description must be in "${detectedLanguage}".`;

//       const result = await model.generateContent([prompt]);
//       const generatedDescription = result.response.text().trim();

//       const suggestions = extractMediaSuggestions(generatedDescription);
//       setMediaSuggestions(suggestions);

//       setFormData((prev) => ({
//         ...prev,
//         description: generatedDescription,
//       }));

//       debouncedRateContent(
//         formData.title,
//         generatedDescription,
//         file,
//         formData.postType
//       );
//       toast.success("Description generated successfully!");
//     } catch (error) {
//       console.error("Error generating description with Gemini API:", error);
//       toast.error("Failed to generate description. Please try again.");
//     } finally {
//       setIsGeneratingDescription(false);
//     }
//   };

//   // Debounced version of the rating function
//   const debouncedRateContent = useCallback(
//     debounce((title, description, file, postType) => {
//       rateContentWithGemini(title, description, file, postType);
//     }, 1000),
//     []
//   );

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => {
//       const updatedFormData = {
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       };
//       if (name === "title" || name === "postType") {
//         debouncedRateContent(
//           value,
//           prev.description,
//           file,
//           updatedFormData.postType
//         );
//       }
//       return updatedFormData;
//     });
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData((prev) => {
//       const updatedFormData = {
//         ...prev,
//         description: value,
//       };
//       debouncedRateContent(prev.title, value, file, prev.postType);
//       const suggestions = extractMediaSuggestions(value);
//       setMediaSuggestions(suggestions);
//       return updatedFormData;
//     });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) {
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(
//         formData.title,
//         formData.description,
//         null,
//         formData.postType
//       );
//       return;
//     }

//     const validTypes = [
//       "image/jpeg",
//       "image/webp",
//       "image/png",
//       "image/gif",
//       "video/mp4",
//       "video/webm",
//     ];
//     if (!validTypes.includes(selectedFile.type)) {
//       toast.error(
//         "Please upload an image (JPEG, PNG, GIF) or video (MP4, WebM)"
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(
//         formData.title,
//         formData.description,
//         null,
//         formData.postType
//       );
//       return;
//     }

//     // Validate that Shorts must have a video
//     if (
//       formData.postType === "Short" &&
//       !selectedFile.type.startsWith("video/")
//     ) {
//       toast.error("Short-form posts must include a video.");
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(
//         formData.title,
//         formData.description,
//         null,
//         formData.postType
//       );
//       return;
//     }

//     const maxSize = selectedFile.type.startsWith("image/")
//       ? 10 * 1024 * 1024
//       : 40 * 1024 * 1024;
//     if (selectedFile.size > maxSize) {
//       toast.error(
//         `File size exceeds the limit (${
//           selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
//         }). Please upload a smaller file.`
//       );
//       e.target.value = null;
//       setFile(null);
//       setFilePreview(null);
//       debouncedRateContent(
//         formData.title,
//         formData.description,
//         null,
//         formData.postType
//       );
//       return;
//     }

//     setFile(selectedFile);
//     const reader = new FileReader();
//     reader.onload = () => setFilePreview(reader.result);
//     reader.readAsDataURL(selectedFile);

//     debouncedRateContent(
//       formData.title,
//       formData.description,
//       selectedFile,
//       formData.postType
//     );
//   };

//   const clearFile = () => {
//     setFile(null);
//     setFilePreview(null);
//     document.getElementById("media-upload").value = null;
//     debouncedRateContent(
//       formData.title,
//       formData.description,
//       null,
//       formData.postType
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       toast.error("Title cannot be empty");
//       return;
//     }
//     if (!formData.description.trim()) {
//       toast.error("Description cannot be empty");
//       return;
//     }

//     if (formData.postType === "Short") {
//       if (
//         !formData.duration ||
//         formData.duration <= 0 ||
//         formData.duration > 90
//       ) {
//         toast.error(
//           "Duration must be between 1 and 90 seconds for short-form videos."
//         );
//         return;
//       }
//       if (!file || !file.type.startsWith("video/")) {
//         toast.error("A video file is required for short-form posts.");
//         return;
//       }
//     }

//     if (contentRating?.rating <= 3) {
//       toast.warn(
//         "The gossip post has a low overall rating. Are you sure you want to proceed?"
//       );
//     }

//     setIsSubmitting(true);
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("isAnonymous", formData.isAnonymous);
//     data.append("category", formData.category);
//     data.append("postType", formData.postType);
//     if (formData.postType === "Short" && formData.duration) {
//       data.append("duration", formData.duration);
//     }
//     if (formData.hashtags) {
//       data.append("hashtags", formData.hashtags);
//     }
//     if (file) data.append("media", file);

//     try {
//       await createPost(data);
//       toast.success(`${formData.postType} created successfully`);
//       navigate("/");
//     } catch (err) {
//       toast.error(
//         err.message || `Failed to create ${formData.postType.toLowerCase()}`
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const getRatingStyles = (rating) => {
//     if (rating >= 7) {
//       return {
//         bgColor: "bg-green-500",
//         textColor: "text-white",
//       };
//     } else if (rating >= 4) {
//       return {
//         bgColor: "bg-orange-500",
//         textColor: "text-white",
//       };
//     } else {
//       return {
//         bgColor: "bg-red-500",
//         textColor: "text-white",
//       };
//     }
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

//       <div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-7xl mx-auto px-4 pt-20 pb-12 flex justify-center"
//       >
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
//             Share Your Gossip
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Post Type
//               </label>
//               <select
//                 name="postType"
//                 value={formData.postType}
//                 onChange={handleChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
//                 aria-label="Post type"
//               >
//                 <option value="Post">Regular Post</option>
//                 <option value="Short">Short-Form Video (Short)</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
//                 placeholder="What's the juicy gossip?"
//                 aria-label="Post title"
//               />
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <label
//                   className={`block text-sm font-medium ${
//                     isDarkMode ? "text-gray-200" : "text-gray-600"
//                   }`}
//                 >
//                   Description
//                 </label>
//                 <button
//                   type="button"
//                   onClick={generateDescriptionWithGemini}
//                   disabled={isGeneratingDescription || !formData.title.trim()}
//                   className={`flex items-center space-x-2 px-3 py-1 rounded-lg font-medium text-sm transition-all duration-300 ${
//                     isGeneratingDescription || !formData.title.trim()
//                       ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                       : isDarkMode
//                       ? "bg-red-600 text-white hover:bg-red-700"
//                       : "bg-red-500 text-white hover:bg-red-600"
//                   }`}
//                   aria-label="Generate description with AI"
//                 >
//                   {isGeneratingDescription ? (
//                     <>
//                       <svg
//                         className="animate-spin h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       <span>Generating...</span>
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="h-4 w-4"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M10 15l-5-5h10l-5 5zm0-10l5 5H5l5-5zm-8 5h16v2H2v-2z" />
//                       </svg>
//                       <span>Generate with AI</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//               <ReactQuill
//                 value={formData.description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Spill the details... Use formatting options to enhance your post."
//                 className={`${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-300`}
//                 modules={{
//                   toolbar: [
//                     [{ header: [1, 2, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     [{ color: [] }, { background: [] }],
//                     ["link", "image", "video"],
//                     ["clean"],
//                   ],
//                 }}
//                 formats={[
//                   "header",
//                   "bold",
//                   "italic",
//                   "underline",
//                   "strike",
//                   "list",
//                   "bullet",
//                   "link",
//                   "image",
//                   "video",
//                   "color",
//                   "background",
//                 ]}
//                 aria-label="Post description editor"
//               />
//               {mediaSuggestions.length > 0 && (
//                 <div
//                   className={`mt-3 p-4 rounded-lg ${
//                     isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                   } transition-colors duration-500`}
//                 >
//                   <p
//                     className={`text-sm font-medium ${
//                       isDarkMode ? "text-gray-200" : "text-gray-600"
//                     } mb-2`}
//                   >
//                     Suggested Media for Your Post:
//                   </p>
//                   <ul className="space-y-1">
//                     {mediaSuggestions.map((suggestion, index) => (
//                       <li
//                         key={index}
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-400" : "text-gray-500"
//                         } flex items-center gap-2`}
//                       >
//                         <span className="font-medium">
//                           {suggestion.type === "Suggested Image"
//                             ? "📷 Image:"
//                             : "🎥 Video:"}
//                         </span>
//                         {suggestion.description}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {(isRatingLoading || contentRating) && (
//                 <div
//                   className={`mt-3 p-4 rounded-lg ${
//                     isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                   } transition-colors duration-500`}
//                 >
//                   {isRatingLoading ? (
//                     <div className="flex items-center gap-2">
//                       <svg
//                         className="animate-spin h-5 w-5 text-red-600"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-200" : "text-gray-600"
//                         }`}
//                       >
//                         Evaluating {formData.postType.toLowerCase()}...
//                       </span>
//                     </div>
//                   ) : (
//                     contentRating && (
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`text-sm font-medium ${
//                               isDarkMode ? "text-gray-200" : "text-gray-600"
//                             }`}
//                           >
//                             Overall Rating:
//                           </span>
//                           <span
//                             className={`text-sm font-medium px-3 py-1 rounded-full ${
//                               getRatingStyles(contentRating.rating).bgColor
//                             } ${
//                               getRatingStyles(contentRating.rating).textColor
//                             }`}
//                           >
//                             {contentRating.rating}/10
//                           </span>
//                         </div>
//                         <p
//                           className={`text-sm ${
//                             isDarkMode ? "text-gray-400" : "text-gray-500"
//                           }`}
//                         >
//                           <span className="font-medium">Explanation:</span>{" "}
//                           {contentRating.explanation}
//                         </p>
//                       </div>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>
//             {formData.postType === "Short" && (
//               <div>
//                 <label
//                   className={`block text-sm font-medium ${
//                     isDarkMode ? "text-gray-200" : "text-gray-600"
//                   } mb-1`}
//                 >
//                   Duration (seconds)
//                 </label>
//                 <input
//                   type="number"
//                   name="duration"
//                   value={formData.duration}
//                   onChange={handleChange}
//                   required={formData.postType === "Short"}
//                   min="1"
//                   max="90"
//                   className={`w-full p-3 ${
//                     isDarkMode
//                       ? "bg-gray-800 text-gray-100"
//                       : "bg-gray-50 text-gray-900"
//                   } border ${
//                     isDarkMode ? "border-gray-700" : "border-gray-200"
//                   } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
//                   placeholder="Enter video duration (1-90 seconds)"
//                   aria-label="Video duration"
//                 />
//               </div>
//             )}
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Hashtags (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="hashtags"
//                 value={formData.hashtags}
//                 onChange={handleChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
//                 placeholder="e.g., #gossip, #funny, #trending"
//                 aria-label="Hashtags"
//               />
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="isAnonymous"
//                 id="isAnonymous"
//                 checked={formData.isAnonymous}
//                 onChange={handleChange}
//                 className={`h-5 w-5 text-red-600 focus:ring-red-500 ${
//                   isDarkMode ? "border-gray-700" : "border-gray-300"
//                 } rounded`}
//                 aria-label="Post anonymously"
//               />
//               <label
//                 htmlFor="isAnonymous"
//                 className={`ml-2 text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 }`}
//               >
//                 Post Anonymously
//               </label>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-50 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-200"
//                 } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
//                 aria-label="Post category"
//               >
//                 <option value="General">General</option>
//                 <option value="Humor">Humor</option>
//                 <option value="News">News</option>
//                 <option value="Jobs">Jobs</option>
//                 <option value="Reviews">Reviews</option>
//                 <option value="Movie Gossips">Movie</option>
//                 <option value="Celebrity Gossips">Celebrity</option>
//                 <option value="Personal Life Gossips">Personal Life</option>
//                 <option value="Office Gossips">Office</option>
//                 <option value="College Gossips">College</option>
//                 <option value="School Gossips">School</option>
//                 <option value="Music and Dance">Music and Dance</option>
//                 <option value="Industry Gossips">Industry</option>
//                 <option value="Sports">Sports</option>
//                 <option value="Social Media">Social Media</option>
//                 <option value="Entertainment">Entertainment</option>
//                 <option value="Political">Political</option>
//                 <option value="International">International</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 className={`block text-sm font-medium ${
//                   isDarkMode ? "text-gray-200" : "text-gray-600"
//                 } mb-1`}
//               >
//                 Media{" "}
//                 {formData.postType === "Short"
//                   ? "(Video Required)"
//                   : "(Image or Video)"}
//               </label>
//               <div className="relative">
//                 <input
//                   id="media-upload"
//                   type="file"
//                   accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
//                   onChange={handleFileChange}
//                   className={`w-full p-3 ${
//                     isDarkMode
//                       ? "bg-gray-800 text-gray-100"
//                       : "bg-gray-50 text-gray-900"
//                   } border ${
//                     isDarkMode ? "border-gray-700" : "border-gray-200"
//                   } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
//                     isDarkMode
//                       ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
//                       : "file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
//                   } transition-all duration-300`}
//                   aria-label="Upload image or video"
//                 />
//               </div>
//               {filePreview && (
//                 <div className="mt-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-200" : "text-gray-600"
//                       }`}
//                     >
//                       Preview:
//                     </p>
//                     <button
//                       type="button"
//                       onClick={clearFile}
//                       className={`text-sm ${
//                         isDarkMode
//                           ? "text-red-400 hover:underline"
//                           : "text-red-600 hover:underline"
//                       }`}
//                       aria-label="Clear uploaded media"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                   {file?.type.startsWith("image/") ? (
//                     <img
//                       src={filePreview}
//                       alt="Media preview"
//                       className="max-w-xs rounded-lg shadow-sm"
//                     />
//                   ) : (
//                     <video
//                       src={filePreview}
//                       controls
//                       className="max-w-xs rounded-lg shadow-sm"
//                       aria-label="Video preview"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>
//             <button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                 isSubmitting
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               } flex items-center justify-center space-x-2`}
//               aria-label={
//                 isSubmitting
//                   ? `Creating ${formData.postType.toLowerCase()}`
//                   : `Create ${formData.postType}`
//               }
//             >
//               {isSubmitting ? (
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
//                   <span>Creating...</span>
//                 </>
//               ) : (
//                 <span>Create {formData.postType}</span>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostForm;
