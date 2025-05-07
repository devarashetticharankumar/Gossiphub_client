import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPost } from "../utils/api";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";

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
  const navigate = useNavigate();

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
      } transition-colors duration-500 font-poppins`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
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
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Share Your Gossip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="What's the juicy gossip?"
                aria-label="Post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Description
              </label>
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Spill the details... Use formatting options to enhance your post."
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-red-500 dark:focus-within:ring-red-400 focus-within:border-transparent transition-all duration-300"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, { background: [] }], // Add color and background options
                    ["link", "image", "video"], // Add link, image, and video options
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
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-700 rounded"
              />
              <label
                htmlFor="isAnonymous"
                className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Post Anonymously
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-gray-100"
                aria-label="Post category"
              >
                <option value="General">General</option>
                <option value="Humor">Humor</option>
                <option value="News">News</option>
                <option value="Jobs">Jobs</option>
                <option value="Reviews">Reviews</option>
                <option value="Movie Gossips">Movie</option>
                <option value="Celebrity Gossips">Celebrity</option>
                <option value="Personal Life Gossips">
                  Personal Life Gossips
                </option>
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
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Media (Image)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-100 dark:file:bg-red-900 file:text-red-700 dark:file:text-red-300 hover:file:bg-red-200 dark:hover:file:bg-red-800 transition-all duration-300"
                  aria-label="Upload image or video"
                />
              </div>
              {filePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Preview:
                  </p>
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
