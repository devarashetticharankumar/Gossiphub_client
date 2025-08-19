import React, { useState, useEffect } from "react";
import {
  createStory,
  getUserStories,
  viewStory,
  reactToStory,
} from "../utils/api";
import { toast } from "react-toastify";

const StoryZone = () => {
  const [stories, setStories] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [contentType, setContentType] = useState("text");
  const [currentUserId, setCurrentUserId] = useState(null); // Get from auth

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Assume user is logged in
        setCurrentUserId(userId);
        const data = await getUserStories(userId);
        setStories(data);
      } catch (error) {
        toast.error("Failed to fetch stories");
      }
    };
    fetchStories();
  }, []);

  //   const handleCreateStory = async (e) => {
  //     e.preventDefault();
  //     if (!newContent) return;

  //     try {
  //       await createStory({ content: newContent, type: contentType });
  //       setNewContent("");
  //       toast.success("Story created successfully");
  //       // Refresh stories
  //       const data = await getUserStories(currentUserId);
  //       setStories(data);
  //     } catch (error) {
  //       toast.error("Failed to create story");
  //     }
  //   };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!newContent) {
      toast.error("Please enter story content");
      return;
    }

    try {
      await createStory({
        userId: currentUserId, // required for backend
        content: newContent,
        type: contentType,
      });

      setNewContent("");
      toast.success("Story created successfully");

      // Refresh stories
      const data = await getUserStories(currentUserId);
      setStories(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create story");
    }
  };

  const handleViewStory = async (storyId) => {
    try {
      await viewStory(storyId, currentUserId);
      toast.info("Story viewed");
      // Refresh stories to update views
      const data = await getUserStories(currentUserId);
      setStories(data);
    } catch (error) {
      toast.error("Failed to view story");
    }
  };

  const handleReactToStory = async (storyId) => {
    try {
      await reactToStory(storyId);
      toast.success("Reacted to story");
      // Refresh stories
      const data = await getUserStories(currentUserId);
      setStories(data);
    } catch (error) {
      toast.error("Failed to react to story");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Story Zone</h1>

      {/* Create Story Form */}
      <form onSubmit={handleCreateStory} className="mb-6">
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="w-full p-2 mb-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="text">Text</option>
          <option value="image">Image URL</option>
        </select>
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Enter story content or image URL..."
          className="w-full p-2 mb-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
        >
          Post Story
        </button>
      </form>

      {/* Stories Feed */}
      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-purple-600">
                {story.userId.username}
              </span>
            </div>
            {story.type === "text" ? (
              <p className="text-gray-800">{story.content}</p>
            ) : (
              <img
                src={story.content}
                alt="Story"
                className="w-full h-64 object-cover rounded"
              />
            )}
            <div className="flex justify-between mt-2 text-gray-600 text-sm">
              <span>👀 {story.views.length}</span>
              <button
                onClick={() => handleViewStory(story._id)}
                className="text-purple-500"
              >
                View
              </button>
              <button
                onClick={() => handleReactToStory(story._id)}
                className="text-red-500"
              >
                ❤️ {story.reacts}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryZone;
