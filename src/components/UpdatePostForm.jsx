// import { useState, useEffect, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getPosts, updatePost } from "../utils/api";
// import ReactQuill from "react-quill-new";
// import "quill/dist/quill.snow.css";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Note: The API key is accessed from the .env file using Vite's convention.
// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// const UpdatePostForm = () => {
//   const { postId } = useParams();
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
//   const [contentRating, setContentRating] = useState(null);
//   const [isRatingLoading, setIsRatingLoading] = useState(false);
//   const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
//   const [mediaSuggestions, setMediaSuggestions] = useState([]);
//   const navigate = useNavigate();

//   // Fetch post data
//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const posts = await getPosts();
//         const post = posts.find((p) => p._id === postId);
//         if (!post) {
//           toast.error("Post not found");
//           navigate("/");
//           return;
//         }
//         setFormData({
//           title: post.title,
//           description: post.description,
//           isAnonymous: post.isAnonymous,
//           category: post.category || "General",
//         });
//         if (post.media) {
//           setFilePreview(post.media);
//         }
//         debouncedRateContent(post.title, post.description, null);
//       } catch (err) {
//         toast.error("Failed to fetch post");
//         navigate("/");
//       }
//     };
//     fetchPost();
//   }, [postId, navigate]);

//   // Persistent dark mode
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved) setIsDarkMode(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
//   }, [isDarkMode]);

//   // Debounce function
//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func(...args), delay);
//     };
//   };

//   // Convert file to base64
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(file);
//     });
//   };

//   // Generate fallback explanation
//   const generateFallbackExplanation = (rating) => {
//     if (rating >= 7) {
//       return "The gossip post excels in humor, engagement, originality, and appropriateness.";
//     } else if (rating >= 4) {
//       return "The gossip post is moderately engaging but may lack in humor or have minor appropriateness concerns.";
//     } else {
//       return "The gossip post struggles with humor, engagement, or contains inappropriate elements.";
//     }
//   };

//   // Detect language with Gemini API
//   const detectLanguageWithGemini = async (title) => {
//     if (!GEMINI_API_KEY) return "English";
//     try {
//       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const prompt = `Detect the language of the following text and return only the language name: ${title}`;
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
//       console.error("Error detecting language:", error);
//       return "English";
//     }
//   };

//   // Extract media suggestions
//   const extractMediaSuggestions = (description) => {
//     const suggestionRegex =
//       /<!--\s*(Suggested Image|Suggested Video):\s*([^--]+)-->/g;
//     const suggestions = [];
//     let match;
//     while ((match = suggestionRegex.exec(description)) !== null) {
//       suggestions.push({ type: match[1], description: match[2].trim() });
//     }
//     return suggestions;
//   };

//   // Rate content with Gemini API
//   const rateContentWithGemini = async (title, description, file) => {
//     if (!title.trim() && !description.trim() && !file) {
//       setContentRating(null);
//       return;
//     }
//     if (!GEMINI_API_KEY) {
//       toast.error("Gemini API key is missing.");
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
//       let prompt = `Evaluate this gossip post for humor, engagement, originality, and appropriateness. Provide an overall rating (0-10) and explain why.

// Gossip Post Title: ${title}
// Gossip Post Description: ${description}
// ${
//   file && file.type.startsWith("image/")
//     ? "\nGossip Post Image: [Attached Image]"
//     : ""
// }

// Respond in this format:
// Rating: X/10
// Explanation: [Detailed explanation addressing each aspect]`;
//       const requestParts = [prompt];
//       if (file && file.type.startsWith("image/")) {
//         const base64Data = await fileToBase64(file);
//         requestParts.push({
//           inlineData: { data: base64Data, mimeType: file.type },
//         });
//       }
//       requestParts.push(
//         `Ensure the explanation is at least two sentences long.`
//       );
//       const result = await model.generateContent(requestParts);
//       const responseText = result.response.text().trim();
//       const ratingMatch = responseText.match(/Rating:\s*(\d+)\/10/);
//       let explanationMatch = responseText.match(/Explanation:\s*(.+)/s);
//       const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;
//       let explanation =
//         explanationMatch && explanationMatch[1].trim().length > 10
//           ? explanationMatch[1].trim()
//           : generateFallbackExplanation(rating);
//       setContentRating({ rating, explanation });
//     } catch (error) {
//       console.error("Error rating content:", error);
//       toast.error("Failed to evaluate the post.");
//       setContentRating({
//         rating: 0,
//         explanation: "Error: Unable to analyze the post.",
//       });
//     } finally {
//       setIsRatingLoading(false);
//     }
//   };

//   // Generate description with Gemini API
//   const generateDescriptionWithGemini = async () => {
//     if (!formData.title.trim()) {
//       toast.error("Please enter a title before generating a description.");
//       return;
//     }
//     if (!GEMINI_API_KEY) {
//       toast.error("Gemini API key is missing.");
//       return;
//     }
//     setIsGeneratingDescription(true);
//     setMediaSuggestions([]);
//     try {
//       const detectedLanguage = await detectLanguageWithGemini(formData.title);
//       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const prompt = `You are an expert AI gossip columnist. Using the provided title, generate a spicy, engaging, and informative post in the language "${detectedLanguage}".

// **Structure your post as follows:**

// <h2>1. Attention-Grabbing Headline & Introduction</h2>
// <p>Start with a bold, catchy headline and a lively introduction that hooks the reader.</p>

// <h2>2. The Facts (Official Statements & Latest Updates)</h2>
// <p>Present the main facts, using direct quotes and updates from credible sources.</p>
// <ul>
//   <li>Direct quotes from producers, actors, or spokespeople</li>
//   <li>Specific events, dates, and actions</li>
//   <li>Current status of the project or issue</li>
//   <li>Official denials or confirmations</li>
// </ul>

// <h2>3. The Juicy Speculation (Rumors & Wild Theories)</h2>
// <p>Add a section for rumors, clearly labeled as “Rumors & Wild Theories”.</p>

// <h2>4. Reader Engagement</h2>
// <p>End with a question or call-to-action to encourage discussion.</p>

// <!-- Suggested Image: [Description of a relevant image] -->
// <!-- Suggested Video: [Description of a relevant video] -->

// The description must be at least 150 words, with at least one subheading and one bullet list.

// Gossip Post Title: ${formData.title}

// Respond with HTML content for a rich text editor.`;
//       const result = await model.generateContent([prompt]);
//       const generatedDescription = result.response.text().trim();
//       setMediaSuggestions(extractMediaSuggestions(generatedDescription));
//       setFormData((prev) => ({ ...prev, description: generatedDescription }));
//       debouncedRateContent(formData.title, generatedDescription, file);
//       toast.success("Description generated successfully!");
//     } catch (error) {
//       console.error("Error generating description:", error);
//       toast.error("Failed to generate description.");
//     } finally {
//       setIsGeneratingDescription(false);
//     }
//   };

//   // Debounced rating function
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
//       if (name === "title") {
//         debouncedRateContent(value, prev.description, file);
//       }
//       return updatedFormData;
//     });
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData((prev) => {
//       const updatedFormData = { ...prev, description: value };
//       debouncedRateContent(prev.title, value, file);
//       setMediaSuggestions(extractMediaSuggestions(value));
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
//       : 40 * 1024 * 1024;
//     if (selectedFile.size > maxSize) {
//       toast.error(
//         `File size exceeds the limit (${
//           selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
//         }).`
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
//     if (contentRating?.rating <= 3) {
//       toast.warn(
//         "The post has a low rating. Are you sure you want to proceed?"
//       );
//     }
//     setIsSubmitting(true);
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("isAnonymous", formData.isAnonymous);
//     data.append("category", formData.category);
//     if (file) data.append("media", file);
//     try {
//       await updatePost(postId, data);
//       toast.success("Post updated successfully");
//       navigate(`/posts/${postId}`);
//     } catch (err) {
//       toast.error(err.message || "Failed to update post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const getRatingStyles = (rating) => {
//     if (rating >= 7)
//       return { bgColor: "bg-green-500", textColor: "text-white" };
//     if (rating >= 4)
//       return { bgColor: "bg-orange-500", textColor: "text-white" };
//     return { bgColor: "bg-red-500", textColor: "text-white" };
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-100"
//       } font-[Inter,sans-serif] transition-colors duration-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8`}
//     >
//       <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 border-b border-red-700 py-3 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto flex justify-between items-center">
//           <button
//             onClick={() => navigate(`/posts/${postId}`)}
//             className="flex items-center gap-2 text-white hover:text-red-200 transition-colors duration-200"
//             aria-label="Back to post"
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414-1.414L5.414 11H17a1 1 0 000-2H5.414l5.293-5.293a1 1 0 000-1.414z" />
//             </svg>
//             Back
//           </button>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 text-white hover:bg-red-700 transition-colors duration-200"
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

//       <div className="max-w-5xl mx-auto pt-4">
//         <div
//           className={`border ${
//             isDarkMode
//               ? "bg-gray-800 border-gray-700"
//               : "bg-white border-gray-200"
//           } p-6 transition-colors duration-300`}
//         >
//           <h2
//             className={`text-2xl font-semibold ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             } mb-6 text-center`}
//           >
//             Update Your Gossip
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
//                     ? "bg-gray-700 text-gray-200 border-gray-600"
//                     : "bg-gray-100 text-gray-900 border-gray-200"
//                 } border rounded focus:outline-none focus:border-red-600 transition-all duration-200`}
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
//                   className={`flex items-center gap-2 px-3 py-1 text-sm ${
//                     isGeneratingDescription || !formData.title.trim()
//                       ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                       : isDarkMode
//                       ? "bg-red-600 text-white hover:bg-red-700"
//                       : "bg-red-600 text-white hover:bg-red-700"
//                   } transition-colors duration-200`}
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
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="h-4 w-4"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M10 15l-5-5h10l-5 5zm0-10l5 5H5l5-5zm-8 5h16v2H2v-2z" />
//                       </svg>
//                       Generate with AI
//                     </>
//                   )}
//                 </button>
//               </div>
//               <ReactQuill
//                 value={formData.description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Spill the details..."
//                 className={`${
//                   isDarkMode
//                     ? "bg-gray-700 text-gray-200"
//                     : "bg-gray-100 text-gray-900"
//                 } border ${
//                   isDarkMode ? "border-gray-600" : "border-gray-200"
//                 } rounded focus-within:border-red-600 transition-all duration-200`}
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
//                   className={`mt-3 p-4 rounded ${
//                     isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                   }`}
//                 >
//                   <p
//                     className={`text-sm font-medium ${
//                       isDarkMode ? "text-gray-200" : "text-gray-600"
//                     } mb-2`}
//                   >
//                     Suggested Media:
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
//                   className={`mt-3 p-4 rounded ${
//                     isDarkMode ? "bg-gray-800" : "bg-gray-100"
//                   }`}
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
//                 className={`h-5 w-5 text-red-600 focus:ring-red-600 ${
//                   isDarkMode ? "border-gray-600" : "border-gray-200"
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
//                     ? "bg-gray-700 text-gray-200 border-gray-600"
//                     : "bg-gray-100 text-gray-900 border-gray-200"
//                 } border rounded focus:outline-none focus:border-red-600 transition-all duration-200`}
//                 aria-label="Post category"
//               >
//                 <option value="General">General</option>
//                 <option value="Humor">Humor</option>
//                 <option value="News">News</option>
//                 <option value="Technology">Technology</option>
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
//               <input
//                 id="media-upload"
//                 type="file"
//                 accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
//                 onChange={handleFileChange}
//                 className={`w-full p-3 ${
//                   isDarkMode
//                     ? "bg-gray-700 text-gray-200 border-gray-600"
//                     : "bg-gray-100 text-gray-900 border-gray-200"
//                 } border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold ${
//                   isDarkMode
//                     ? "file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
//                     : "file:bg-red-100 file:text-red-600 hover:file:bg-red-200"
//                 } transition-all duration-200`}
//                 aria-label="Upload image or video"
//               />
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
//                   {filePreview.match(/\.(mp4|webm|ogg)$/i) ? (
//                     <video
//                       src={filePreview}
//                       controls
//                       className="max-w-xs rounded border border-gray-300"
//                       aria-label="Video preview"
//                     />
//                   ) : (
//                     <img
//                       src={filePreview}
//                       alt="Media preview"
//                       className="max-w-xs rounded border border-gray-300"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 text-sm font-semibold text-white ${
//                 isSubmitting
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               } transition-colors duration-200 flex items-center justify-center gap-2`}
//               aria-label={isSubmitting ? "Updating post" : "Update post"}
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
//                   Updating...
//                 </>
//               ) : (
//                 "Update Post"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdatePostForm;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPosts, updatePost } from "../utils/api";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Helmet } from "react-helmet";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const UpdatePostForm = () => {
  const { postId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isAnonymous: false,
    category: "General",
    hashtags: "",
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [contentRating, setContentRating] = useState(null);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [mediaSuggestions, setMediaSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await getPosts();
        const post = posts.find((p) => p._id === postId);
        if (!post) {
          toast.error("Post not found");
          navigate("/");
          return;
        }
        setFormData({
          title: post.title,
          description: post.description,
          isAnonymous: post.isAnonymous,
          category: post.category || "General",
          hashtags: post.hashtags || "",
        });
        if (post.media) {
          setFilePreview(post.media);
        }
        debouncedRateContent(
          post.title,
          post.description,
          null,
          post.hashtags || ""
        );
      } catch (err) {
        toast.error("Failed to fetch post");
        navigate("/");
      }
    };
    fetchPost();
  }, [postId, navigate]);

  // Persistent dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Generate fallback explanation
  const generateFallbackExplanation = (rating) => {
    if (rating >= 7) {
      return "The gossip post excels in humor, engagement, originality, and appropriateness, making it highly enjoyable and suitable for sharing.";
    } else if (rating >= 4) {
      return "The gossip post is moderately engaging and original but may lack in humor or have minor appropriateness concerns.";
    } else {
      return "The gossip post struggles with humor, engagement, originality, or contains inappropriate elements that make it less suitable.";
    }
  };

  // Detect language with Gemini API
  const detectLanguageWithGemini = async (title) => {
    if (!GEMINI_API_KEY) return "English";
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Detect the language of the following text and return only the language name (e.g., "Telugu", "Hindi", "English"): ${title}`;
      const result = await model.generateContent([prompt]);
      const detectedLanguage = result.response.text().trim();
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
      console.error("Error detecting language:", error);
      return "English";
    }
  };

  // Extract media suggestions
  const extractMediaSuggestions = (description) => {
    const suggestionRegex =
      /<!--\s*(Suggested Image|Suggested Video):\s*([^--]+)-->/g;
    const suggestions = [];
    let match;
    while ((match = suggestionRegex.exec(description)) !== null) {
      suggestions.push({ type: match[1], description: match[2].trim() });
    }
    return suggestions;
  };

  // Rate content with Gemini API
  const rateContentWithGemini = async (title, description, file, hashtags) => {
    if (!title.trim() && !description.trim() && !file && !hashtags.trim()) {
      setContentRating(null);
      return;
    }
    if (!GEMINI_API_KEY) {
      toast.error("Gemini API key is missing.");
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
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      let prompt = `Evaluate this gossip post for humor, engagement, originality, and appropriateness. Provide an overall rating (0-10) and explain why.

Gossip Post Title: ${title}
Gossip Post Description: ${description}
Gossip Post Hashtags: ${hashtags}
${
  file && file.type.startsWith("image/")
    ? "\nGossip Post Image: [Attached Image]"
    : ""
}

Respond in this format:
Rating: X/10
Explanation: [Detailed explanation addressing each aspect]

Ensure the explanation is at least two sentences long.`;
      const requestParts = [prompt];
      if (file && file.type.startsWith("image/")) {
        const base64Data = await fileToBase64(file);
        requestParts.push({
          inlineData: { data: base64Data, mimeType: file.type },
        });
      }
      const result = await model.generateContent(requestParts);
      const responseText = result.response.text().trim();
      const ratingMatch = responseText.match(/Rating:\s*(\d+)\/10/);
      let explanationMatch = responseText.match(/Explanation:\s*(.+)/s);
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;
      let explanation =
        explanationMatch && explanationMatch[1].trim().length > 10
          ? explanationMatch[1].trim()
          : generateFallbackExplanation(rating);
      setContentRating({ rating, explanation });
    } catch (error) {
      console.error("Error rating content:", error);
      toast.error("Failed to evaluate the post.");
      setContentRating({
        rating: 0,
        explanation: "Error: Unable to analyze the post.",
      });
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Generate description with Gemini API
  const generateDescriptionWithGemini = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title before generating a description.");
      return;
    }
    if (!GEMINI_API_KEY) {
      toast.error("Gemini API key is missing.");
      return;
    }
    setIsGeneratingDescription(true);
    setMediaSuggestions([]);
    try {
      const detectedLanguage = await detectLanguageWithGemini(formData.title);
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an expert AI gossip columnist. Using the provided title, generate a spicy, engaging, and informative post in "${detectedLanguage}".

**Structure your post as follows:**

<h2>1. Attention-Grabbing Headline & Introduction</h2>
<p>Start with a bold, catchy headline and a lively introduction.</p>

<h2>2. The Facts (Official Statements & Latest Updates)</h2>
<p>Present the main facts, using direct quotes and updates from credible sources.</p>
<ul>
  <li>Direct quotes from producers, actors, or spokespeople</li>
  <li>Specific events, dates, and actions</li>
  <li>Current status of the project or issue</li>
  <li>Official denials or confirmations</li>
</ul>

<h2>3. The Juicy Speculation (Rumors & Wild Theories)</h2>
<p>Add a section for rumors, clearly labeled as “Rumors & Wild Theories”.</p>

<h2>4. Reader Engagement</h2>
<p>End with a question or call-to-action to encourage discussion.</p>

<!-- Suggested Image: [Description of a relevant image] -->
<!-- Suggested Video: [Description of a relevant video] -->

The description must be at least 150 words, with at least one subheading and one bullet list.

Gossip Post Title: ${formData.title}

Respond with HTML content for a rich text editor.`;
      const result = await model.generateContent([prompt]);
      const generatedDescription = result.response.text().trim();
      setMediaSuggestions(extractMediaSuggestions(generatedDescription));
      setFormData((prev) => ({ ...prev, description: generatedDescription }));
      debouncedRateContent(
        formData.title,
        generatedDescription,
        file,
        formData.hashtags
      );
      toast.success("Description generated successfully!");
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const debouncedRateContent = useCallback(
    debounce((title, description, file, hashtags) => {
      rateContentWithGemini(title, description, file, hashtags);
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
      if (name === "title" || name === "hashtags") {
        debouncedRateContent(
          updatedFormData.title,
          prev.description,
          file,
          updatedFormData.hashtags
        );
      }
      return updatedFormData;
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, description: value };
      setMediaSuggestions(extractMediaSuggestions(value));
      debouncedRateContent(prev.title, value, file, prev.hashtags);
      return updatedFormData;
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setFilePreview(null);
      debouncedRateContent(
        formData.title,
        formData.description,
        null,
        formData.hashtags
      );
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
      debouncedRateContent(
        formData.title,
        formData.description,
        null,
        formData.hashtags
      );
      return;
    }
    const maxSize = selectedFile.type.startsWith("image/")
      ? 10 * 1024 * 1024
      : 40 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(
        `File size exceeds the limit (${
          selectedFile.type.startsWith("image/") ? "10MB" : "40MB"
        }).`
      );
      e.target.value = null;
      setFile(null);
      setFilePreview(null);
      debouncedRateContent(
        formData.title,
        formData.description,
        null,
        formData.hashtags
      );
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(selectedFile);
    debouncedRateContent(
      formData.title,
      formData.description,
      selectedFile,
      formData.hashtags
    );
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    document.getElementById("media-upload").value = null;
    debouncedRateContent(
      formData.title,
      formData.description,
      null,
      formData.hashtags
    );
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
    if (contentRating?.rating <= 3) {
      toast.warn(
        "The gossip post has a low overall rating. Are you sure you want to proceed?"
      );
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("isAnonymous", formData.isAnonymous);
    data.append("category", formData.category);
    data.append("hashtags", formData.hashtags);
    if (file) data.append("media", file);
    try {
      await updatePost(postId, data);
      toast.success("Post updated successfully");
      navigate(`/posts/${postId}`);
    } catch (err) {
      toast.error(err.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getRatingStyles = (rating) => {
    if (rating >= 7)
      return { bgColor: "bg-green-500", textColor: "text-white" };
    if (rating >= 4)
      return { bgColor: "bg-orange-500", textColor: "text-white" };
    return { bgColor: "bg-red-500", textColor: "text-white" };
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
      } transition-colors duration-500 font-poppins`}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Update Gossip Post | GossipHub</title>
        <meta
          name="description"
          content="Edit your gossip post on GossipHub. Update with new details, images, videos, or AI-generated descriptions!"
        />
        <meta
          name="keywords"
          content="gossip, social media, update post, GossipHub"
        />
        <meta name="author" content="GossipHub" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Update Gossip Post | GossipHub" />
        <meta
          property="og:description"
          content="Edit your gossip post on GossipHub. Update with new details, images, videos, or AI-generated descriptions!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GossipHub" />
        <meta
          property="og:image"
          content="https://gossiphub.in/default-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Update Gossip Post | GossipHub" />
        <meta
          name="twitter:description"
          content="Edit your gossip post on GossipHub. Update with new details, images, videos, or AI-generated descriptions!"
        />
        <meta
          name="twitter:image"
          content="https://gossiphub.in/default-image.jpg"
        />
      </Helmet>
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(`/posts/${postId}`)}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Back to post"
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
            Update Your Gossip
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
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } mb-1`}
              >
                Hashtags (comma-separated, e.g., tech,news)
              </label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleChange}
                className={`w-full p-3 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500`}
                placeholder="Enter hashtags, e.g., tech,news"
                aria-label="Post hashtags"
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
                  {file?.type?.startsWith("image/") || !file ? (
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
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                isSubmitting
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } flex items-center justify-center space-x-2`}
              aria-label={isSubmitting ? "Updating post" : "Update post"}
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
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Post</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostForm;
