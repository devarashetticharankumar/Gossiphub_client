// import io from "socket.io-client";

// const API_URL = import.meta.env.VITE_API_URL;
// const getToken = () => localStorage.getItem("token");

// export const initSocket = (userId) => {
//   const socket = io(API_URL, {
//     query: { userId },
//     auth: { token: getToken() },
//   });

//   socket.on("connect", () => {
//     console.log("Connected to Socket.io:", socket.id);
//     socket.emit("join", userId);
//   });

//   return socket;
// };

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
