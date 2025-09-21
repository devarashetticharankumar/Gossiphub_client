import io from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

export const initSocket = (userId) => {
  const socket = io(API_URL, {
    query: { userId },
    auth: { token: getToken() },
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.io:", socket.id);
    socket.emit("join", userId);
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
  });

  // Handle various real-time events
  socket.on("typing", (data) => console.log("Typing:", data));
  socket.on("stopTyping", (data) => console.log("Stop Typing:", data));
  socket.on("messageSeen", (data) => console.log("Message Seen:", data));
  socket.on("messageDeleted", (data) => console.log("Message Deleted:", data));
  socket.on("messageEdited", (data) => console.log("Message Edited:", data));
  socket.on("messageStarred", (data) => console.log("Message Starred:", data));

  return socket;
};

// import io from "socket.io-client";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Fallback URL
// const getToken = () => localStorage.getItem("token");

// export const initSocket = (userId) => {
//   // Validate userId and token
//   if (!userId) {
//     console.error("Socket initialization failed: userId is required");
//     return null;
//   }
//   const token = getToken();
//   if (!token) {
//     console.error(
//       "Socket initialization failed: No authentication token found"
//     );
//     return null;
//   }

//   // Initialize Socket.IO with reconnection and authentication
//   const socket = io(API_URL, {
//     auth: { token },
//     query: { userId },
//     reconnection: true, // Enable automatic reconnection
//     reconnectionAttempts: 5, // Limit reconnection attempts
//     reconnectionDelay: 1000, // Delay between reconnection attempts
//     transports: ["websocket", "polling"], // Prefer WebSocket, fallback to polling
//   });

//   // Handle connection
//   socket.on("connect", () => {
//     console.log("Connected to Socket.IO:", socket.id);
//     socket.emit("joinUser", userId); // Use joinUser event as per components
//   });

//   // Handle connection errors
//   socket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error.message);
//     if (
//       error.message.includes("401") ||
//       error.message.includes("Authentication")
//     ) {
//       // Handle unauthorized errors (e.g., redirect to login)
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");
//       window.location.href = "/login";
//     }
//   });

//   // Handle reconnection attempts
//   socket.on("reconnect_attempt", (attempt) => {
//     console.log(`Reconnection attempt ${attempt}`);
//   });

//   // Handle reconnection success
//   socket.on("reconnect", () => {
//     console.log("Reconnected to Socket.IO:", socket.id);
//     socket.emit("joinUser", userId);
//   });

//   // Handle reconnection failure
//   socket.on("reconnect_failed", () => {
//     console.error("Reconnection failed after maximum attempts");
//     // Optionally notify the user or redirect to an error page
//   });

//   // Handle various real-time events (as per your components)
//   socket.on("newDirectMessage", (message) => {
//     console.log("New Direct Message:", message);
//   });

//   socket.on("directMessageEdited", (message) => {
//     console.log("Direct Message Edited:", message);
//   });

//   socket.on("directMessageDeleted", (data) => {
//     console.log("Direct Message Deleted:", data);
//   });

//   // Additional events from your original socket.js
//   socket.on("typing", (data) => console.log("Typing:", data));
//   socket.on("stopTyping", (data) => console.log("Stop Typing:", data));
//   socket.on("messageSeen", (data) => console.log("Message Seen:", data));
//   socket.on("messageStarred", (data) => console.log("Message Starred:", data));

//   // Cleanup function to disconnect socket
//   socket.on("disconnect", (reason) => {
//     console.log("Socket disconnected:", reason);
//   });

//   return socket;
// };

// // Utility to disconnect socket
// export const disconnectSocket = (socket) => {
//   if (socket) {
//     socket.disconnect();
//     console.log("Socket disconnected manually");
//   }
// };
