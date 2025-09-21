// import React, { useState, useEffect } from "react";
// import { getUsers, getPublicUserProfile } from "../utils/api";
// import { toast } from "react-toastify";
// import { FaSearch, FaEdit } from "react-icons/fa";

// const ChatList = ({ onSelectChat, currentUserId, socket }) => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please login to view users");
//           toast.error("Please login to view users");
//           return;
//         }
//         setLoading(true);

//         const userData = await getUsers();
//         console.log("Users fetched:", userData);
//         const usersWithDetails = await Promise.all(
//           userData
//             .filter((user) => user._id !== currentUserId)
//             .map(async (user) => {
//               const profile = await getPublicUserProfile(user._id);
//               return { ...user, ...profile };
//             })
//         );
//         setUsers(usersWithDetails);
//         setFilteredUsers(usersWithDetails);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         setError("Failed to load users. Please try again.");
//         toast.error("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();

//     if (!socket) {
//       console.warn("Socket not initialized");
//       return;
//     }

//     socket.on("onlineStatus", ({ userId, status }) => {
//       console.log(`User ${userId} is ${status ? "online" : "offline"}`);
//       setOnlineUsers((prev) => {
//         const newSet = new Set(prev);
//         if (status) {
//           newSet.add(userId);
//         } else {
//           newSet.delete(userId);
//         }
//         return newSet;
//       });
//     });

//     socket.on("newMessage", (message) => {
//       setOnlineUsers((prev) => {
//         const newSet = new Set(prev);
//         newSet.add(message.sender._id);
//         return newSet;
//       });
//     });

//     return () => {
//       if (socket) {
//         socket.off("onlineStatus");
//         socket.off("newMessage");
//       }
//     };
//   }, [currentUserId, socket]);

//   useEffect(() => {
//     const filtered = users.filter((user) =>
//       user.username.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [search, users]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-100 p-4">
//         <p className="text-gray-600">Loading users...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
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

//   return (
//     <div className="w-full sm:w-80 bg-white h-screen flex flex-col font-sans">
//       {/* Header */}
//       <div className="bg-red-500 text-white p-6.5 flex items-center justify-between border-b border-gray-200">
//         <h3 className="text-xl font-semibold">Gossip Messages</h3>
//         <FaEdit
//           className="cursor-pointer hover:text-gray-100"
//           onClick={() => setSearch("")}
//         />
//       </div>

//       {/* Search Bar */}
//       <div className="p-3">
//         <div className="relative">
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search users..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 bg-gray-50 text-gray-900"
//           />
//         </div>
//       </div>

//       {/* User List */}
//       <div className="flex-1 overflow-y-auto scrollbar-hide">
//         {filteredUsers.length === 0 ? (
//           <p className="text-gray-600 text-center p-4">No users found.</p>
//         ) : (
//           <div className="px-3">
//             {filteredUsers.map((user) => (
//               <div
//                 key={user._id}
//                 className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 border-b border-gray-200"
//                 onClick={() => onSelectChat(user._id, user.username)}
//               >
//                 <div className="relative">
//                   <img
//                     src={user.profilePicture || "/default-avatar.png"}
//                     alt={user.username}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   {onlineUsers.has(user._id) && (
//                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <span className="text-gray-900 font-medium">
//                     {user.username}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;

// import React, { useState, useEffect } from "react";
// import { getChats, getPublicUserProfile } from "../utils/api";
// import { toast } from "react-toastify";
// import { FaSearch, FaEdit, FaMoon, FaSun } from "react-icons/fa";

// const ChatList = ({ onSelectChat, currentUserId, socket }) => {
//   const [chats, setChats] = useState([]);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please login to view chats");
//           toast.error("Please login to view chats");
//           return;
//         }
//         setLoading(true);

//         const chatData = await getChats();
//         // Deduplicate chats based on user._id to prevent multiple entries for the same user
//         const uniqueChats = [];
//         const seenUsers = new Set();
//         const chatsWithDetails = await Promise.all(
//           chatData.map(async (chat) => {
//             const user = await getPublicUserProfile(chat._id.toString());
//             const userId = user._id;
//             if (!seenUsers.has(userId)) {
//               seenUsers.add(userId);
//               return { ...chat, user };
//             }
//             return null;
//           })
//         );
//         uniqueChats.push(...chatsWithDetails.filter((chat) => chat !== null));
//         setChats(uniqueChats);
//         setFilteredChats(uniqueChats);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching chats:", error);
//         setError("Failed to load chats. Please try again.");
//         toast.error("Failed to load chats");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChats();

//     if (!socket) {
//       console.warn("Socket not initialized");
//       return;
//     }

//     socket.on("userOnline", (userId) => {
//       setOnlineUsers((prev) => new Set(prev).add(userId));
//     });

//     socket.on("userOffline", (userId) => {
//       setOnlineUsers((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(userId);
//         return newSet;
//       });
//     });

//     socket.on("newMessage", (message) => {
//       setOnlineUsers((prev) => {
//         const newSet = new Set(prev);
//         newSet.add(message.sender._id);
//         return newSet;
//       });
//     });

//     return () => {
//       if (socket) {
//         socket.off("userOnline");
//         socket.off("userOffline");
//         socket.off("newMessage");
//       }
//     };
//   }, [currentUserId, socket]);

//   useEffect(() => {
//     const filtered = chats.filter((chat) =>
//       chat.user.username.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredChats(filtered);
//   }, [search, chats]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
//         <p className="text-gray-600 dark:text-gray-300">Loading chats...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
//         <p className="text-red-600 dark:text-red-400">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="w-full sm:w-80 h-screen flex flex-col font-sans"
//       style={{
//         background: isDarkMode
//           ? "linear-gradient(to bottom, #1a1a2e, #16213e)"
//           : "linear-gradient(to bottom, #e0e7ff, #c7d2fe)",
//       }}
//     >
//       <div className="bg-purple-600 text-white p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
//         <h3 className="text-xl font-medium">GossipHub Chat</h3>
//         <div className="flex items-center gap-2">
//           <FaEdit
//             className="cursor-pointer hover:text-gray-100"
//             onClick={() => setSearch("")}
//           />
//           <button onClick={() => setIsDarkMode(!isDarkMode)}>
//             {isDarkMode ? <FaSun /> : <FaMoon />}
//           </button>
//         </div>
//       </div>
//       <div className="p-3">
//         <div className="relative">
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search chats..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto scrollbar-hide">
//         <p className="text-center text-sm text-gray-500 dark:text-gray-400 p-2">
//           Say it. Share it. Star it.
//         </p>
//         {filteredChats.length === 0 ? (
//           <p className="text-gray-600 dark:text-gray-400 text-center p-4">
//             No chats found.
//           </p>
//         ) : (
//           <div className="px-3">
//             {filteredChats.map((chat) => (
//               <div
//                 key={chat._id}
//                 className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 border-b border-gray-200 dark:border-gray-700"
//                 onClick={() =>
//                   onSelectChat(chat._id.toString(), chat.user.username)
//                 }
//               >
//                 <div className="relative">
//                   <img
//                     src={chat.user.profilePicture || "/default-avatar.png"}
//                     alt={chat.user.username}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   {onlineUsers.has(chat._id.toString()) && (
//                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-900 dark:text-gray-100 font-medium">
//                       {chat.user.username}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {new Date(chat.timestamp).toLocaleTimeString()}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
//                     {chat.lastMessage || "No messages yet"}
//                   </p>
//                   {chat.unreadCount > 0 && (
//                     <span className="text-xs bg-purple-600 text-white rounded-full px-2 py-1">
//                       {chat.unreadCount}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;
