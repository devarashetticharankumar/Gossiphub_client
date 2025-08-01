// import React, { useState, useEffect, useRef } from "react";
// import {
//   getMessages,
//   sendMessage,
//   markMessageAsRead,
//   deleteMessage,
//   reportMessage,
//   blockUser,
//   unblockUser,
// } from "../utils/api";
// import { toast } from "react-toastify";
// import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";

// const ChatWindow = ({
//   selectedUserId,
//   selectedUsername,
//   currentUserId,
//   socket,
//   onBack,
// }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [media, setMedia] = useState(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const chatEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedUserId) return;
//       try {
//         setLoading(true);
//         const data = await getMessages(selectedUserId);
//         setMessages(data);
//         setError(null);
//         setIsBlocked(false);
//         data.forEach((msg) => {
//           if (!msg.isRead && msg.receiver._id === currentUserId) {
//             markMessageAsRead(msg._id).catch((err) =>
//               console.error("Error marking message as read:", err.message)
//             );
//             if (socket) socket.emit("messageSeen", msg._id);
//           }
//         });
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//         if (error.message === "You are blocked by this user") {
//           setIsBlocked(true);
//           setError(
//             "You are blocked by this user and cannot view or send messages."
//           );
//         } else {
//           setError("Failed to load messages. Please try again.");
//         }
//         toast.error(error.message || "Failed to load messages");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMessages();

//     if (!socket) {
//       console.warn("Socket not initialized");
//       return;
//     }

//     socket.on("typing", (data) => {
//       if (data.userId === selectedUserId) {
//         setIsTyping(true);
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
//       }
//     });

//     socket.on("newMessage", (message) => {
//       if (
//         message.sender._id === selectedUserId ||
//         message.receiver._id === selectedUserId
//       ) {
//         setMessages((prev) => [...prev, message]);
//         if (message.receiver._id === currentUserId && !message.isRead) {
//           markMessageAsRead(message._id).catch((err) =>
//             console.error("Error marking message as read:", err.message)
//           );
//           socket.emit("messageSeen", message._id);
//         }
//       }
//     });

//     socket.on("messageSeen", (messageId) => {
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg._id === messageId ? { ...msg, isRead: true } : msg
//         )
//       );
//     });

//     return () => {
//       if (socket) {
//         socket.off("typing");
//         socket.off("newMessage");
//         socket.off("messageSeen");
//       }
//       clearTimeout(typingTimeoutRef.current);
//     };
//   }, [selectedUserId, currentUserId, socket]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleTyping = () => {
//     if (socket && !isBlocked) {
//       socket.emit("typing", {
//         userId: currentUserId,
//         receiverId: selectedUserId,
//       });
//     }
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() && !media) return;
//     if (isBlocked) {
//       toast.error("You are blocked by this user");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("content", newMessage);
//       if (media) formData.append("media", media);
//       const data = await sendMessage(selectedUserId, formData);
//       setMessages((prev) => [...prev, data]);
//       setNewMessage("");
//       setMedia(null);
//       e.target.media.value = "";
//       setError(null);
//       toast.success("Message sent");
//     } catch (error) {
//       console.error("Error sending message:", error);
//       if (error.message === "You are blocked by this user") {
//         setIsBlocked(true);
//         setError("You are blocked by this user and cannot send messages.");
//       } else {
//         setError("Failed to send message. Please try again.");
//       }
//       toast.error(error.message || "Failed to send message");
//     }
//   };

//   const handleMarkAsRead = async (messageId) => {
//     try {
//       const data = await markMessageAsRead(messageId);
//       setMessages((prev) =>
//         prev.map((msg) => (msg._id === messageId ? data : msg))
//       );
//       if (socket) socket.emit("messageSeen", messageId);
//       toast.success("Message marked as read");
//     } catch (error) {
//       console.error("Error marking message as read:", error);
//       toast.error(error.message || "Failed to mark message as read");
//     }
//   };

//   const handleDeleteMessage = async (messageId) => {
//     try {
//       await deleteMessage(messageId);
//       setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//       toast.success("Message deleted");
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       toast.error("Failed to delete message");
//     }
//   };

//   const handleReportMessage = async (messageId) => {
//     try {
//       await reportMessage(messageId, { reason: "Inappropriate content" });
//       toast.success("Message reported");
//     } catch (error) {
//       console.error("Error reporting message:", error);
//       toast.error("Failed to report message");
//     }
//   };

//   const handleBlockUser = async () => {
//     try {
//       await blockUser(selectedUserId);
//       toast.success("User blocked");
//     } catch (error) {
//       console.error("Error blocking user:", error);
//       toast.error(error.message || "Failed to block user");
//     }
//   };

//   const handleUnblockUser = async () => {
//     try {
//       await unblockUser(selectedUserId);
//       setIsBlocked(false);
//       setError(null);
//       toast.success("User unblocked");
//     } catch (error) {
//       console.error("Error unblocking user:", error);
//       toast.error(error.message || "Failed to unblock user");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full bg-white p-4 sm:p-6">
//         <p className="text-gray-600">Loading chat...</p>
//       </div>
//     );
//   }

//   if (error && !isBlocked) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full bg-white p-4 sm:p-6">
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors duration-200"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!selectedUserId) {
//     return (
//       <div className="flex items-center justify-center h-full bg-white p-4 sm:p-6">
//         <p className="text-gray-600">Select a user to start chatting</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-white h-screen flex flex-col font-sans">
//       {/* Header */}
//       <div className="bg-red-500 text-white p-4 flex items-center justify-between border-b border-gray-200">
//         <div className="flex items-center gap-3">
//           <FaArrowLeft className="cursor-pointer sm:hidden" onClick={onBack} />
//           <div className="relative">
//             <img
//               src="/default-avatar.png"
//               alt={selectedUsername}
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             {socket && socket.connected && (
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
//             )}
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold">{selectedUsername}</h3>
//             <p className="text-sm">
//               {socket && socket.connected ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>
//         <div className="space-x-2">
//           <button
//             onClick={handleBlockUser}
//             className="bg-white text-teal-500 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
//           >
//             Block
//           </button>
//           <button
//             onClick={handleUnblockUser}
//             className="bg-white text-teal-500 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
//           >
//             Unblock
//           </button>
//         </div>
//       </div>

//       {/* Blocked User Message */}
//       {isBlocked && (
//         <div className="bg-red-100 text-red-600 p-4 text-center">
//           You are blocked by {selectedUsername}. You cannot send or view
//           messages.
//           <button
//             onClick={handleUnblockUser}
//             className="ml-2 text-white bg-teal-500 px-2 py-1 rounded-full hover:bg-teal-600"
//           >
//             Request Unblock
//           </button>
//         </div>
//       )}

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-100 scrollbar-hide">
//         {isTyping && !isBlocked && (
//           <p className="text-gray-600 text-sm italic">
//             {selectedUsername} is typing...
//           </p>
//         )}
//         {messages.length === 0 ? (
//           <p className="text-gray-600 text-center">No messages yet.</p>
//         ) : (
//           messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`p-3 mb-3 rounded-lg max-w-[60%] shadow-sm ${
//                 msg.sender._id === currentUserId
//                   ? "bg-red-200 text-black ml-auto"
//                   : "bg-gray-200 text-gray-900 mr-auto"
//               }`}
//             >
//               <p>{msg.content}</p>
//               {msg.media &&
//                 (msg.media.includes(".mp4") ? (
//                   <video
//                     src={msg.media}
//                     controls
//                     className="w-48 h-auto mt-2 rounded-lg"
//                     onError={() => toast.error("Failed to load video")}
//                   />
//                 ) : (
//                   <img
//                     src={msg.media}
//                     alt="media"
//                     className="w-48 h-auto mt-2 rounded-lg"
//                     loading="lazy"
//                     onError={() => toast.error("Failed to load image")}
//                   />
//                 ))}
//               <div className="flex justify-between items-end mt-1 text-xs">
//                 <span
//                   className={
//                     msg.sender._id === currentUserId
//                       ? "text-black-100"
//                       : "text-gray-600"
//                   }
//                 >
//                   {new Date(msg.createdAt).toLocaleString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     hour12: true,
//                   })}
//                 </span>
//                 {msg.sender._id === currentUserId && msg.isRead && (
//                   <span className="text-blue-300">✔✔</span>
//                 )}
//               </div>
//               {!isBlocked && (
//                 <div className="mt-1 space-x-2 flex justify-end text-xs">
//                   {msg.sender._id !== currentUserId && !msg.isRead && (
//                     <button
//                       onClick={() => handleMarkAsRead(msg._id)}
//                       className="text-teal-500 hover:underline"
//                     >
//                       Mark as Read
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDeleteMessage(msg._id)}
//                     className="text-red-600 hover:underline"
//                     disabled={isBlocked}
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => handleReportMessage(msg._id)}
//                     className="text-yellow-600 hover:underline"
//                     disabled={isBlocked}
//                   >
//                     Report
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Message Input */}
//       {!isBlocked && (
//         <form
//           onSubmit={handleSend}
//           className="p-4 bg-white border-t border-gray-200 flex items-center gap-2"
//         >
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => {
//               setNewMessage(e.target.value);
//               handleTyping();
//             }}
//             placeholder="Type a message..."
//             className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 bg-gray-50"
//           />
//           <input
//             type="file"
//             name="media"
//             onChange={(e) => setMedia(e.target.files[0])}
//             accept="image/*,video/*"
//             className="text-sm text-gray-600"
//           />
//           <button
//             type="submit"
//             className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
//           >
//             <FaPaperPlane />
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;

import React, { useState, useEffect, useRef } from "react";
import {
  getMessages,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  reportMessage,
  blockUser,
  unblockUser,
  editMessage,
  replyToMessage,
  forwardMessage,
  starMessage,
} from "../utils/api";
import { toast } from "react-toastify";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaEdit,
  FaReply,
  FaForward,
  FaStar,
  FaPaperclip,
  FaMicrophone,
  FaSmile,
  FaClock,
  FaMoon,
  FaSun,
  FaTrash,
} from "react-icons/fa";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4 sm:p-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">
              Something went wrong: {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ChatWindow = ({
  selectedUserId,
  selectedUsername,
  currentUserId,
  socket,
  onBack,
  onlineUsers,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [forwardTo, setForwardTo] = useState(null);
  const [expiring, setExpiring] = useState(false);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;
      try {
        setLoading(true);
        const data = await getMessages(selectedUserId);
        setMessages(data);
        setError(null);
        setIsBlocked(false);
        data.forEach((msg) => {
          if (
            !msg.isRead &&
            msg.receiver.some((r) => r._id === currentUserId)
          ) {
            markMessageAsRead(msg._id).catch((err) =>
              console.error("Error marking message as read:", err.message)
            );
            if (socket) socket.emit("markSeen", { messageId: msg._id });
          }
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        if (error.message === "You are blocked by this user") {
          setIsBlocked(true);
          setError(
            "You are blocked by this user and cannot view or send messages."
          );
        } else {
          setError("Failed to load messages. Please try again.");
        }
        toast.error(error.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    if (!socket) {
      console.warn("Socket not initialized");
      return;
    }

    socket.on("typing", (data) => {
      if (data.userId === selectedUserId) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("newMessage", (message) => {
      if (
        message.sender._id === selectedUserId ||
        message.receiver.some((r) => r._id === selectedUserId)
      ) {
        setMessages((prev) => [...prev, message]);
        if (
          message.receiver.some((r) => r._id === currentUserId) &&
          !message.isRead
        ) {
          markMessageAsRead(message._id).catch((err) =>
            console.error("Error marking message as read:", err.message)
          );
          socket.emit("markSeen", { messageId: message._id });
        }
      }
    });

    socket.on("messageSeen", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    socket.on("messageDeleted", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("messageEdited", ({ messageId, content }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, content, edited: true } : msg
        )
      );
    });

    return () => {
      if (socket) {
        socket.off("typing");
        socket.off("newMessage");
        socket.off("messageSeen");
        socket.off("messageDeleted");
        socket.off("messageEdited");
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUserId, currentUserId, socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    if (socket && !isBlocked) {
      socket.emit("typing", selectedUserId);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !media) return;
    if (isBlocked) {
      toast.error("You are blocked by this user");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", newMessage);
      if (media) formData.append("media", media);
      formData.append("receiverId", selectedUserId);
      formData.append("expiring", expiring);
      const data = await sendMessage(selectedUserId, formData);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setMedia(null);
      setReplyTo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setError(null);
      socket.emit("sendMessage", {
        receiverId: selectedUserId,
        content: newMessage,
        media: data.media,
        expiring,
      });
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.message === "You are blocked by this user") {
        setIsBlocked(true);
        setError("You are blocked by this user and cannot send messages.");
      } else {
        setError("Failed to send message. Please try again.");
      }
      toast.error(error.message || "Failed to send message");
    }
  };

  const handleEditMessage = async (messageId, content) => {
    try {
      const data = await editMessage(messageId, { content });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? data : msg))
      );
      socket.emit("editMessage", { messageId, content });
      setEditMessageId(null);
      toast.success("Message edited");
    } catch (error) {
      console.error("Error editing message:", error);
      toast.error("Failed to edit message");
    }
  };

  const handleReplyToMessage = async (messageId, content) => {
    try {
      const data = await replyToMessage(selectedUserId, {
        content,
        replyTo: messageId,
      });
      setMessages((prev) => [...prev, data]);
      setReplyTo(null);
      socket.emit("replyToMessage", {
        receiverId: selectedUserId,
        content,
        replyTo: messageId,
      });
      toast.success("Reply sent");
    } catch (error) {
      console.error("Error replying to message:", error);
      toast.error("Failed to reply to message");
    }
  };

  const handleForwardMessage = async (messageId, receiverId) => {
    try {
      const data = await forwardMessage({ messageId, receiverId });
      setMessages((prev) => [...prev, data]);
      setForwardTo(null);
      socket.emit("forwardMessage", { messageId, receiverId });
      toast.success("Message forwarded");
    } catch (error) {
      console.error("Error forwarding message:", error);
      toast.error("Failed to forward message");
    }
  };

  const handleStarMessage = async (messageId) => {
    try {
      await starMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, starredBy: [...msg.starredBy, currentUserId] }
            : msg
        )
      );
      socket.emit("starMessage", { messageId });
      toast.success("Message starred");
    } catch (error) {
      console.error("Error starring message:", error);
      toast.error("Failed to star message");
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const data = await markMessageAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? data : msg))
      );
      if (socket) socket.emit("markSeen", { messageId });
      toast.success("Message marked as read");
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error(error.message || "Failed to mark message as read");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      socket.emit("deleteMessage", { messageId });
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleReportMessage = async (messageId) => {
    try {
      await reportMessage(messageId, { reason: "Inappropriate content" });
      toast.success("Message reported");
    } catch (error) {
      console.error("Error reporting message:", error);
      toast.error("Failed to report message");
    }
  };

  const handleBlockUser = async () => {
    try {
      await blockUser(selectedUserId);
      setIsBlocked(true);
      setError("You have blocked this user.");
      toast.success("User blocked");
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error(error.message || "Failed to block user");
    }
  };

  const handleUnblockUser = async () => {
    try {
      await unblockUser(selectedUserId);
      setIsBlocked(false);
      setError(null);
      toast.success("User unblocked");
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error(error.message || "Failed to unblock user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4 sm:p-6">
        <p className="text-gray-600 dark:text-gray-300">Loading chat...</p>
      </div>
    );
  }

  if (error && !isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 p-4 sm:p-6">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!selectedUserId) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4 sm:p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  const reactions = ["😍", "😂", "😡", "👍", "❤️"];
  const handleReaction = (messageId, reaction) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { by: currentUserId, reaction },
              ],
            }
          : msg
      )
    );
    socket.emit("reactToMessage", { messageId, reaction });
  };

  return (
    <ErrorBoundary>
      <div
        className="flex-1 bg-white dark:bg-gray-900 h-screen flex flex-col font-sans"
        style={{
          background: isDarkMode
            ? "linear-gradient(to bottom, #1a1a2e, #16213e)"
            : "linear-gradient(to bottom, #e0e7ff, #c7d2fe)",
        }}
      >
        <div className="bg-purple-600 text-white p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              className="cursor-pointer sm:hidden"
              onClick={onBack}
            />
            <div className="relative">
              <img
                src="/default-avatar.png"
                alt={selectedUsername}
                className="w-10 h-10 rounded-full object-cover"
              />
              {onlineUsers && onlineUsers.has(selectedUserId) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">{selectedUsername}</h3>
              <p className="text-sm">
                {onlineUsers && onlineUsers.has(selectedUserId)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleBlockUser}
              className="bg-white dark:bg-gray-700 text-purple-600 px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Block
            </button>
            <button
              onClick={handleUnblockUser}
              className="bg-white dark:bg-gray-700 text-purple-600 px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Unblock
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-white dark:bg-gray-700 text-purple-600 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={() => setExpiring(!expiring)}
              className="bg-white dark:bg-gray-700 text-purple-600 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <FaClock />
            </button>
          </div>
        </div>

        {isBlocked && (
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 p-4 text-center">
            You are blocked by {selectedUsername}. You cannot send or view
            messages.
            <button
              onClick={handleUnblockUser}
              className="ml-2 text-white bg-purple-600 px-2 py-1 rounded-full hover:bg-purple-700"
            >
              Request Unblock
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 scrollbar-hide">
          {isTyping && !isBlocked && (
            <p className="text-gray-600 dark:text-gray-300 text-sm italic">
              {selectedUsername} is typing...
            </p>
          )}
          {messages.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No messages yet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-3 mb-3 rounded-lg max-w-[70%] ${
                  msg.sender._id === currentUserId
                    ? "bg-purple-200 ml-auto"
                    : "bg-gray-200 mr-auto"
                }`}
              >
                {replyTo && replyTo._id === msg._id && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                    Replying to: {replyTo.content}
                  </p>
                )}
                <p className="text-gray-900 dark:text-gray-100">
                  {msg.content}
                </p>
                {msg.media && (
                  <div className="mt-2">
                    {msg.media.includes(".mp4") ? (
                      <video
                        src={msg.media}
                        controls
                        className="w-48 h-auto rounded-lg"
                        onError={() => toast.error("Failed to load video")}
                      />
                    ) : msg.media.includes(".pdf") ? (
                      <a
                        href={msg.media}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      <img
                        src={msg.media}
                        alt="media"
                        className="w-48 h-auto rounded-lg"
                        loading="lazy"
                        onError={() => toast.error("Failed to load image")}
                      />
                    )}
                  </div>
                )}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {msg.reactions.map((r, i) => (
                      <span key={i} className="text-lg">
                        {r.reaction}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                  {msg.sender._id === currentUserId && (
                    <span className="text-blue-400">
                      {msg.isRead ? "✔✔" : "✔"}
                    </span>
                  )}
                  {msg.starredBy.includes(currentUserId) && (
                    <FaStar className="text-yellow-500 ml-1" />
                  )}
                </div>
                {!isBlocked && (
                  <div className="mt-1 space-x-2 flex justify-end text-xs">
                    {msg.sender._id === currentUserId && !editMessageId && (
                      <button
                        onClick={() => setEditMessageId(msg._id)}
                        className="text-purple-600 hover:underline"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {editMessageId === msg._id && (
                      <input
                        type="text"
                        defaultValue={msg.content}
                        onBlur={(e) =>
                          handleEditMessage(msg._id, e.target.value)
                        }
                        className="p-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        autoFocus
                      />
                    )}
                    <button
                      onClick={() => setReplyTo(msg)}
                      className="text-purple-600 hover:underline"
                    >
                      <FaReply />
                    </button>
                    <button
                      onClick={() => setForwardTo(msg._id)}
                      className="text-purple-600 hover:underline"
                    >
                      <FaForward />
                    </button>
                    {!msg.starredBy.includes(currentUserId) && (
                      <button
                        onClick={() => handleStarMessage(msg._id)}
                        className="text-yellow-600 hover:underline"
                      >
                        <FaStar />
                      </button>
                    )}
                    {msg.sender._id !== currentUserId && !msg.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(msg._id)}
                        className="text-purple-600 hover:underline"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="text-red-600 hover:underline"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleReportMessage(msg._id)}
                      className="text-yellow-600 hover:underline"
                    >
                      Report
                    </button>
                    {reactions.map((reaction) => (
                      <button
                        key={reaction}
                        onClick={() => handleReaction(msg._id, reaction)}
                        className="text-lg hover:text-purple-600"
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {forwardTo && (
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg mt-2">
              <p className="text-gray-600 dark:text-gray-300">Forward to:</p>
              <input
                type="text"
                placeholder="Enter receiver ID"
                onBlur={(e) => handleForwardMessage(forwardTo, e.target.value)}
                className="p-1 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
                autoFocus
              />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {!isBlocked && (
          <form
            onSubmit={handleSend}
            className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
          >
            {replyTo && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                Replying to: {replyTo.content}
                <button
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-red-500 dark:text-red-400"
                >
                  Cancel
                </button>
              </p>
            )}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setMedia(e.target.files[0])}
              accept="image/*,video/*,audio/*,.pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-purple-600 hover:text-purple-700"
            >
              <FaPaperclip />
            </button>
            <button className="text-purple-600 hover:text-purple-700">
              <FaSmile />
            </button>
            <button className="text-purple-600 hover:text-purple-700">
              <FaMicrophone />
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
            >
              <FaPaperPlane />
            </button>
          </form>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ChatWindow;
