import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPost } from "../utils/api";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FaChevronLeft,
  FaMagic,
  FaCloudUploadAlt,
  FaHashtag,
  FaTrash,
  FaTable,
  FaSun,
  FaMoon,
  FaStar,
  FaUserSecret,
  FaCheckCircle,
} from "react-icons/fa";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PostForm = () => {
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [contentRating, setContentRating] = useState(null);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [mediaSuggestions, setMediaSuggestions] = useState([]);
  const navigate = useNavigate();
  const quillRef = useRef(null);

  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Table modal state
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableDimensions, setTableDimensions] = useState({ rows: 3, cols: 3 });

  const insertTable = () => setShowTableModal(true);

  const confirmInsertTable = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const tableModule = quill.getModule("table");
      if (tableModule) {
        tableModule.insertTable(parseInt(tableDimensions.rows, 10), parseInt(tableDimensions.cols, 10));
        setShowTableModal(false);
      } else {
        toast.error("Table module not available");
      }
    }
  };

  const insertRowAbove = () => quillRef.current?.getEditor().getModule("table").insertRowAbove();
  const insertRowBelow = () => quillRef.current?.getEditor().getModule("table").insertRowBelow();
  const insertColumnLeft = () => quillRef.current?.getEditor().getModule("table").insertColumnLeft();
  const insertColumnRight = () => quillRef.current?.getEditor().getModule("table").insertColumnRight();
  const deleteRow = () => quillRef.current?.getEditor().getModule("table").deleteRow();
  const deleteColumn = () => quillRef.current?.getEditor().getModule("table").deleteColumn();
  const deleteTable = () => quillRef.current?.getEditor().getModule("table").deleteTable();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const generateFallbackExplanation = (rating) => {
    if (rating >= 7) {
      return "Excellent post! High engagement, humor, and strong appeal.";
    } else if (rating >= 4) {
      return "Good post! Moderately engaging, consider adding images or AI enhancement.";
    } else {
      return "Low engagement rating. Try adding a more descriptive title or image.";
    }
  };

  const detectLanguageWithGemini = async (title) => {
    if (!GEMINI_API_KEY) return "English";
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Detect the language of the following text and return only the language name (e.g., "Telugu", "Hindi", "English"). Text: ${title}`;
      const result = await model.generateContent([prompt]);
      const detectedLanguage = result.response.text().trim();
      const supportedLanguages = ["Telugu", "Hindi", "English", "Tamil", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati", "Punjabi"];
      return supportedLanguages.includes(detectedLanguage) ? detectedLanguage : "English";
    } catch (error) {
      console.error("Error detecting language:", error);
      return "English";
    }
  };

  const extractMediaSuggestions = (description) => {
    const suggestionRegex = /<!--\s*(Suggested Image|Suggested Video):\s*([^--]+)-->/g;
    const suggestions = [];
    let match;
    while ((match = suggestionRegex.exec(description)) !== null) {
      suggestions.push({
        type: match[1],
        description: match[2].trim(),
      });
    }
    return suggestions;
  };

  const rateContentWithGemini = async (title, description, file, hashtags) => {
    if (!title.trim() && !description.trim() && !file && !hashtags.trim()) {
      setContentRating(null);
      return;
    }
    if (!GEMINI_API_KEY) {
      setContentRating({ rating: 0, explanation: "Gemini API key is not configured." });
      setIsRatingLoading(false);
      return;
    }
    setIsRatingLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      let prompt = `You are an AI content specialist. Evaluate a gossip post across humor, engagement, originality, and appropriateness on a 0 to 10 scale.
Title: ${title}
Description: ${description}
Hashtags: ${hashtags}`;

      const requestParts = [prompt];
      if (file && file.type.startsWith("image/")) {
        const base64Data = await fileToBase64(file);
        requestParts.push({ inlineData: { data: base64Data, mimeType: file.type } });
      }
      requestParts.push(`Respond in format:
Rating: X/10
Explanation: [Your 2-sentence explanation]`);

      const result = await model.generateContent(requestParts);
      const responseText = result.response.text().trim();
      const ratingMatch = responseText.match(/Rating:\s*(\d+)\/10/);
      let explanationMatch = responseText.match(/Explanation:\s*(.+)/s);

      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 6;
      let explanation = explanationMatch && explanationMatch[1].trim().length > 10 ? explanationMatch[1].trim() : generateFallbackExplanation(rating);
      setContentRating({ rating, explanation });
    } catch (error) {
      console.error("Error rating content:", error);
      setContentRating({ rating: 0, explanation: "Unable to evaluate post." });
    } finally {
      setIsRatingLoading(false);
    }
  };

  const generateDescriptionWithGemini = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title first!");
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
      const prompt = `You are an expert AI gossip columnist. Generate a spicy, engaging post in "${detectedLanguage}" for:
Title: ${formData.title}

Structure as HTML:
<h2>1. Attention-Grabbing Headline & Introduction</h2>
<p>Lively intro hooking the reader.</p>

<h2>2. The Facts & Updates</h2>
<ul>
  <li>Latest updates from credible sources</li>
  <li>Current status of project or event</li>
</ul>

<h2>3. Juicy Speculation</h2>
<p>Playful theories and entertainment buzz.</p>

<h2>4. Reader Engagement</h2>
<p>Question for comments.</p>

<!-- Suggested Image: [Image description] -->
Return ONLY HTML content ready for text editor.`;

      const result = await model.generateContent([prompt]);
      const generatedDescription = result.response.text().trim();
      const suggestions = extractMediaSuggestions(generatedDescription);
      setMediaSuggestions(suggestions);

      setFormData((prev) => ({ ...prev, description: generatedDescription }));
      debouncedRateContent(formData.title, generatedDescription, file, formData.hashtags);
      toast.success("AI Description generated successfully!");
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate AI description.");
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
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" || name === "hashtags") {
        debouncedRateContent(updated.title, prev.description, file, updated.hashtags);
      }
      return updated;
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => {
      const updated = { ...prev, description: value };
      const suggestions = extractMediaSuggestions(value);
      setMediaSuggestions(suggestions);
      debouncedRateContent(prev.title, value, file, prev.hashtags);
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/webp", "image/png", "image/gif", "video/mp4", "video/webm"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a valid image (JPEG/PNG/GIF/WEBP) or video (MP4/WEBM)");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(selectedFile);
    debouncedRateContent(formData.title, formData.description, selectedFile, formData.hashtags);
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
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

    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("isAnonymous", formData.isAnonymous);
    data.append("category", formData.category);
    data.append("hashtags", formData.hashtags);
    if (file) data.append("media", file);

    try {
      await createPost(data);
      toast.success("Post created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"} font-sans transition-colors duration-300 pb-20`}>
      {/* Dynamic ReactQuill Theme Styles */}
      <style>{`
        .ql-toolbar.ql-snow {
          border-color: ${isDarkMode ? "#1e293b" : "#e2e8f0"} !important;
          background-color: ${isDarkMode ? "#0f172a" : "#ffffff"} !important;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .ql-container.ql-snow {
          border-color: ${isDarkMode ? "#1e293b" : "#e2e8f0"} !important;
          background-color: ${isDarkMode ? "#0f172a" : "#ffffff"} !important;
          color: ${isDarkMode ? "#ffffff" : "#0f172a"} !important;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
        ${!isDarkMode ? `
          .ql-stroke { stroke: #334155 !important; }
          .ql-fill { fill: #334155 !important; }
          .ql-picker { color: #334155 !important; }
          .ql-editor.ql-blank::before { color: #94a3b8 !important; }
        ` : `
          .ql-stroke { stroke: #cbd5e1 !important; }
          .ql-fill { fill: #cbd5e1 !important; }
          .ql-picker { color: #cbd5e1 !important; }
          .ql-editor.ql-blank::before { color: #64748b !important; }
        `}
      `}</style>

      {/* Top Header Navbar */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-4 shadow-xl transition-colors ${
        isDarkMode ? "bg-slate-900/80 border-white/10 text-white" : "bg-white/90 border-gray-200 text-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all border text-xs font-semibold ${
              isDarkMode
                ? "text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10"
                : "text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border-gray-200"
            }`}
          >
            <FaChevronLeft />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
            <h1 className="text-base font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
              GossipHub Article Studio
            </h1>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-full transition-all border ${
              isDarkMode
                ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border-gray-200"
            }`}
          >
            {isDarkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Share Your Gossip & Stories
          </h2>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Publish entertainment news, celebrity updates, trailers & exclusive gossip to thousands of readers.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Post Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title Field */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                1. Article Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="What's the latest juicy gossip? (e.g., Sreeleela's bold look setting social media on fire!)"
                className={`w-full p-4 rounded-2xl text-sm font-semibold outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-900 border border-slate-800 focus:border-red-500 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 focus:border-red-500 text-gray-900 placeholder-gray-400 shadow-sm"
                }`}
              />
            </div>

            {/* Category & Hashtags Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-3.5 rounded-2xl text-sm font-semibold outline-none transition-all ${
                    isDarkMode
                      ? "bg-slate-900 border border-slate-800 focus:border-red-500 text-white"
                      : "bg-white border border-gray-300 focus:border-red-500 text-gray-900 shadow-sm"
                  }`}
                >
                  <option value="General">General</option>
                  <option value="Tech News">Tech News</option>
                  <option value="Film Reviews & Trailers">Film Reviews & Trailers</option>
                  <option value="Entertainment News">Entertainment News</option>
                  <option value="Celebrity News">Celebrity News</option>
                  <option value="Tollywood">Tollywood</option>
                  <option value="Bollywood">Bollywood</option>
                  <option value="Kollywood">Kollywood</option>
                  <option value="Mollywood">Mollywood</option>
                  <option value="Hollywood">Hollywood</option>
                  <option value="Upcoming Movies">Upcoming Movies</option>
                  <option value="Music & Soundtracks">Music & Soundtracks</option>
                  <option value="TV & Web Series">TV & Web Series</option>
                  <option value="Awards & Events">Awards & Events</option>
                  <option value="Lifestyle & Fashion">Lifestyle & Fashion</option>
                  <option value="Sports">Sports</option>
                  <option value="Interviews">Interviews</option>
                  <option value="Actress">Actress</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                  Hashtags (Comma-separated)
                </label>
                <div className="relative">
                  <FaHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="hashtags"
                    value={formData.hashtags}
                    onChange={handleChange}
                    placeholder="tollywood, sreeleela, viral"
                    className={`w-full pl-9 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border border-slate-800 focus:border-red-500 text-white placeholder-gray-500"
                        : "bg-white border border-gray-300 focus:border-red-500 text-gray-900 placeholder-gray-400 shadow-sm"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* AI Generator Banner Button */}
            <div className={`p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border transition-colors ${
              isDarkMode
                ? "bg-gradient-to-r from-red-600/20 via-pink-600/20 to-purple-600/20 border-red-500/30"
                : "bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 border-red-200 shadow-sm"
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-lg animate-pulse">
                  <FaMagic />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>AI Article Writer</h4>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Generate spicy, formatted article descriptions using Gemini AI.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={generateDescriptionWithGemini}
                disabled={isGeneratingDescription || !formData.title.trim()}
                className={`px-5 py-2.5 rounded-full font-bold text-xs text-white transition-all shadow-lg flex items-center space-x-2 ${
                  isGeneratingDescription || !formData.title.trim()
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed border border-white/5"
                    : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 active:scale-95 shadow-red-600/30"
                }`}
              >
                {isGeneratingDescription ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating Story...</span>
                  </>
                ) : (
                  <>
                    <FaMagic className="text-xs" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Description Editor Box - SECTION 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                  2. Article Content / Description *
                </label>
                <button
                  type="button"
                  onClick={insertTable}
                  className="flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-600 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20"
                >
                  <FaTable className="text-[10px]" />
                  <span>Insert Table</span>
                </button>
              </div>

              {/* Table Tools Ribbon */}
              <div className={`flex flex-wrap gap-2 p-2 rounded-xl border text-xs transition-colors ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-white border-gray-200 text-gray-800 shadow-sm"
              }`}>
                <span className={`font-semibold self-center mr-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Table Tools:</span>
                <button type="button" onClick={insertRowAbove} className="px-2 py-1 bg-blue-500/20 text-blue-400 font-medium rounded hover:bg-blue-500/30">+ Row Above</button>
                <button type="button" onClick={insertRowBelow} className="px-2 py-1 bg-blue-500/20 text-blue-400 font-medium rounded hover:bg-blue-500/30">+ Row Below</button>
                <button type="button" onClick={insertColumnLeft} className="px-2 py-1 bg-purple-500/20 text-purple-400 font-medium rounded hover:bg-purple-500/30">+ Col Left</button>
                <button type="button" onClick={insertColumnRight} className="px-2 py-1 bg-purple-500/20 text-purple-400 font-medium rounded hover:bg-purple-500/30">+ Col Right</button>
                <button type="button" onClick={deleteRow} className="px-2 py-1 bg-red-500/20 text-red-400 font-medium rounded hover:bg-red-500/30">Del Row</button>
                <button type="button" onClick={deleteColumn} className="px-2 py-1 bg-red-500/20 text-red-400 font-medium rounded hover:bg-red-500/30">Del Col</button>
                <button type="button" onClick={deleteTable} className={`px-2 py-1 rounded font-medium ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>Del Table</button>
              </div>

              {/* ReactQuill Editor */}
              <div className={`rounded-2xl overflow-hidden border transition-all ${
                isDarkMode
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-gray-200 bg-white text-gray-900 shadow-sm"
              }`}>
                <ReactQuill
                  ref={quillRef}
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Spill the juicy details here..."
                  className="min-h-[220px]"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ color: [] }, { background: [] }],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                    table: true,
                  }}
                />
              </div>
            </div>

            {/* Media Upload Area */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                3. Attach Image or Video (Optional)
              </label>

              {!filePreview ? (
                <div className={`relative border-2 border-dashed rounded-3xl p-6 text-center hover:border-red-500/60 transition-all ${
                  isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-gray-300 bg-white shadow-sm"
                }`}>
                  <input
                    id="media-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <FaCloudUploadAlt className="text-3xl text-red-500 animate-bounce" />
                    <p className={`text-xs font-bold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Click or Drag & Drop Image / Video (JPG, PNG, WEBP, MP4)
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                  isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-gray-200 shadow-sm"
                }`}>
                  <div className="flex items-center space-x-3">
                    {file?.type.startsWith("image/") ? (
                      <img src={filePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                    ) : (
                      <video src={filePreview} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                    )}
                    <div>
                      <p className={`text-xs font-bold truncate max-w-[200px] ${isDarkMode ? "text-white" : "text-gray-900"}`}>{file?.name}</p>
                      <p className="text-[10px] text-gray-400">{(file?.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={clearFile}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-all"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              )}
            </div>

            {/* Anonymous Toggle Pill */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <div className="flex items-center space-x-3">
                <FaUserSecret className="text-red-500 text-lg" />
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Post Anonymously</h4>
                  <p className={`text-[11px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Hide your author username from the public feed.</p>
                </div>
              </div>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-red-600 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all shadow-xl flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:opacity-90 shadow-red-600/30 active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing Article...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-base" />
                  <span>Publish Gossip Article</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: AI Score Rating Card & Live Preview (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Rating Card */}
            {(isRatingLoading || contentRating) && (
              <div className={`p-5 rounded-3xl border shadow-xl space-y-3 transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
              }`}>
                <div className="flex items-center justify-between border-b border-gray-200/20 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <FaStar className="text-amber-400" />
                    <span>AI Engagement Rating</span>
                  </span>
                </div>

                {isRatingLoading ? (
                  <div className="flex items-center space-x-2 py-4">
                    <div className="w-4 h-4 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400 font-medium">Evaluating viral potential...</span>
                  </div>
                ) : (
                  contentRating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Quality Score:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          contentRating.rating >= 7
                            ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                            : contentRating.rating >= 4
                            ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                            : "bg-red-500/20 text-red-500 border border-red-500/30"
                        }`}>
                          {contentRating.rating} / 10
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed font-normal ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {contentRating.explanation}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Live Article Preview Box */}
            <div className={`p-5 rounded-3xl border shadow-2xl space-y-4 transition-colors ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
            }`}>
              <div className="flex items-center justify-between border-b border-gray-200/20 pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Live Article Card Preview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-500">
                  {formData.category}
                </span>
              </div>

              {/* Card Preview Body */}
              <div className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                isDarkMode ? "bg-slate-950 border-white/10" : "bg-gray-50 border-gray-200"
              }`}>
                {filePreview && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-black">
                    {file?.type.startsWith("image/") ? (
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={filePreview} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}

                <h3 className={`text-sm font-bold line-clamp-2 leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {formData.title || "Your Gossip Article Title..."}
                </h3>

                <p className={`text-xs line-clamp-3 leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {formData.description ? formData.description.replace(/<[^>]*>?/gm, "") : "Article preview description will appear here..."}
                </p>

                {formData.hashtags && (
                  <p className="text-[10px] font-semibold text-pink-500 truncate">
                    {formData.hashtags.split(",").map((t) => `#${t.trim()}`).join(" ")}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Table Insertion Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-white/15 p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Insert Custom Table</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableDimensions.rows}
                  onChange={(e) => setTableDimensions({ ...tableDimensions, rows: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableDimensions.cols}
                  onChange={(e) => setTableDimensions({ ...tableDimensions, cols: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmInsertTable}
                className="px-4 py-2 rounded-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostForm;
