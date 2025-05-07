import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getNotifications } from "../utils/api";
import io from "socket.io-client";
import { FaBell, FaTimes, FaTrash, FaArrowLeft } from "react-icons/fa";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res);
      } catch (err) {
        toast.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();

    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message, { autoClose: 3000 });
    });

    return () => socket.off("notification");
  }, []);

  const dismissNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
    toast.success("Notification dismissed");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
      } transition-colors duration-500 font-sans antialiased`}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-md transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200"
            aria-label="Back to previous page"
          >
            <FaArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
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

      {/* Main Content */}
      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4 pt-24 pb-12"
      >
        <div
          className={`${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } rounded-2xl p-6 shadow-xl transition-colors duration-500`}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } flex items-center gap-2`}
            >
              <FaBell className="h-6 w-6 text-red-500" />
              Notifications
            </h2>
            {notifications.length > 0 && (
              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllNotifications}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
              >
                <FaTrash className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-16 rounded-xl ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <FaBell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No Notifications Yet
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You’ll see updates here when there’s something new!
              </p>
            </div>
          ) : (
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative flex items-start gap-4 p-4 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  } shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <FaBell className="h-5 w-5 text-red-500 mt-1" />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dismissNotification(index)}
                    className={`${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    } hover:text-red-500 transition-colors duration-200`}
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
