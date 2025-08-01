// import React, { useState, useEffect } from "react";
// import { getUserProfile } from "../utils/api";
// import { initSocket } from "../socket";
// import ChatList from "./ChatList";
// import ChatWindow from "./ChatWindow";
// import { toast } from "react-toastify";

// const ChatContainer = () => {
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [selectedUsername, setSelectedUsername] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const data = await getUserProfile();
//         setCurrentUserId(data._id);
//         const socketInstance = initSocket(data._id);
//         setSocket(socketInstance);

//         socketInstance.on("newMessage", (message) => {
//           toast.info(`New message from ${message.sender.username}`);
//         });

//         socketInstance.on("messageSeen", (messageId) => {
//           toast.info(`Message ${messageId} marked as read`);
//         });

//         return () => socketInstance.disconnect();
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         toast.error("Failed to load user profile");
//       }
//     };
//     fetchUserProfile();
//   }, []);

//   const handleSelectChat = (userId, username) => {
//     setSelectedUserId(userId);
//     setSelectedUsername(username);
//   };

//   if (!currentUserId) {
//     return (
//       <div className="chat-container min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-500 font-sans antialiased">
//         <p className="text-gray-500">Loading user profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-container min-h-screen flex flex-col sm:flex-row bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-500 font-sans antialiased">
//       <ChatList onSelectChat={handleSelectChat} currentUserId={currentUserId} />
//       <div className="flex-1">
//         {selectedUserId ? (
//           <ChatWindow
//             selectedUserId={selectedUserId}
//             selectedUsername={selectedUsername}
//             currentUserId={currentUserId}
//           />
//         ) : (
//           <div className="no-chat-selected flex items-center justify-center h-full text-gray-500 bg-white rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-500">
//             Select a user to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

import React, { useState, useEffect } from "react";
import { getUserProfile } from "../utils/api";
import { initSocket } from "../socket";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { toast } from "react-toastify";

const ChatContainer = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketLoading, setSocketLoading] = useState(true);
  const [showChatList, setShowChatList] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setCurrentUserId(data._id);
        const socketInstance = initSocket(data._id);
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
          console.log("Socket connected:", socketInstance.id);
        });

        socketInstance.on("userOnline", (userId) => {
          setOnlineUsers((prev) => new Set(prev).add(userId));
        });

        socketInstance.on("userOffline", (userId) => {
          setOnlineUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        });

        socketInstance.on("newMessage", (message) => {
          toast.info(`New message from ${message.sender.username}`);
        });

        socketInstance.on("messageSeen", (messageId) => {
          toast.info(`Message ${messageId} marked as read`);
        });

        setSocketLoading(false);

        return () => {
          socketInstance.disconnect();
          console.log("Socket disconnected");
        };
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
        setSocketLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleSelectChat = (userId, username) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setShowChatList(false);
  };

  const handleBack = () => {
    setShowChatList(true);
  };

  if (socketLoading || !currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans">
        <p className="text-gray-600 dark:text-gray-300">
          Loading user profile and socket...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-b from-purple-500 to-blue-500 dark:from-indigo-900 dark:to-blue-900 font-sans">
      <div className={`${showChatList ? "block" : "hidden"} sm:block sm:w-80`}>
        <ChatList
          onSelectChat={handleSelectChat}
          currentUserId={currentUserId}
          socket={socket}
        />
      </div>
      <div className={`${showChatList ? "hidden" : "block"} sm:block flex-1`}>
        {selectedUserId ? (
          <ChatWindow
            selectedUserId={selectedUserId}
            selectedUsername={selectedUsername}
            currentUserId={currentUserId}
            socket={socket}
            onBack={handleBack}
            onlineUsers={onlineUsers}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4 sm:p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
