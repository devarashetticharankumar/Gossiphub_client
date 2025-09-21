import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  getUserChatRooms,
  joinChatRoom,
  getRoomMessages,
  sendRoomMessage,
  editRoomMessage,
  deleteRoomMessage,
  sendDirectMessage,
  editDirectMessage,
  deleteDirectMessage,
  getDirectMessages,
} from "../utils/api"; // Import the new API functions

const socket = io(import.meta.env.VITE_API_URL); // Use VITE_API_URL for Socket.IO

const ChatClient = ({ userId }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [files, setFiles] = useState([]);
  const [dmRecipient, setDmRecipient] = useState("");
  const [dmMessages, setDmMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  useEffect(() => {
    socket.emit("joinUser", userId);

    // Fetch user chat rooms
    getUserChatRooms()
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("newDirectMessage", (message) => {
      setDmMessages((prev) => [...prev, message]);
    });

    socket.on("messageEdited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socket.on("directMessageEdited", (updatedMessage) => {
      setDmMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("directMessageDeleted", ({ messageId }) => {
      setDmMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("newMessage");
      socket.off("newDirectMessage");
      socket.off("messageEdited");
      socket.off("directMessageEdited");
      socket.off("messageDeleted");
      socket.off("directMessageDeleted");
    };
  }, [userId]);

  const joinRoom = async (roomId) => {
    try {
      await joinChatRoom(roomId);
      socket.emit("joinRoom", roomId);
      setCurrentRoom(roomId);
      const messages = await getRoomMessages(roomId);
      setMessages(messages);
    } catch (err) {
      console.error("Error joining room:", err);
    }
  };

  const sendMessage = async () => {
    if (!messageInput && files.length === 0) return;

    try {
      const data = { content: messageInput, media: files };
      await sendRoomMessage(currentRoom, data);
      setMessageInput("");
      setFiles([]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const sendDirectMessageHandler = async () => {
    if (!messageInput && files.length === 0) return;

    try {
      const data = {
        recipientId: dmRecipient,
        content: messageInput,
        media: files,
      };
      await sendDirectMessage(data);
      setMessageInput("");
      setFiles([]);
    } catch (err) {
      console.error("Error sending direct message:", err);
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const startEditing = (message) => {
    setEditingMessage(message._id);
    setEditContent(message.content || "");
    setEditFiles([]);
  };

  const editMessage = async (messageId, isDirectMessage) => {
    if (!editContent && editFiles.length === 0) return;

    try {
      const data = { content: editContent, media: editFiles };
      if (isDirectMessage) {
        await editDirectMessage(dmRecipient, messageId, data);
      } else {
        await editRoomMessage(currentRoom, messageId, data);
      }
      setEditingMessage(null);
      setEditContent("");
      setEditFiles([]);
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const deleteMessage = async (messageId, isDirectMessage) => {
    try {
      if (isDirectMessage) {
        await deleteDirectMessage(dmRecipient, messageId);
      } else {
        await deleteRoomMessage(currentRoom, messageId);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const loadDirectMessages = async () => {
    try {
      const dm = await getDirectMessages(dmRecipient);
      setDmMessages(dm.messages || []);
    } catch (err) {
      console.error("Error fetching direct messages:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="rooms-list">
        <h2>Chat Rooms</h2>
        {rooms.map((room) => (
          <div key={room._id} onClick={() => joinRoom(room._id)}>
            {room.name} {room.isPublic ? "(Public)" : "(Private)"}
          </div>
        ))}
      </div>
      <div className="chat-window">
        <h2>Messages</h2>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sender.username}:</strong>{" "}
            {editingMessage === msg._id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit message..."
                />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.txt"
                  onChange={(e) => setEditFiles([...e.target.files])}
                />
                <button onClick={() => editMessage(msg._id, false)}>
                  Save
                </button>
                <button onClick={() => setEditingMessage(null)}>Cancel</button>
              </>
            ) : (
              <>
                {msg.content} {msg.isEdited && <small>(Edited)</small>}
                {msg.media.map((item, idx) => (
                  <div key={idx}>
                    {item.type === "image" && (
                      <img
                        src={item.url}
                        alt="media"
                        style={{ maxWidth: "200px" }}
                      />
                    )}
                    {item.type === "video" && (
                      <video
                        src={item.url}
                        controls
                        style={{ maxWidth: "200px" }}
                      />
                    )}
                    {item.type === "audio" && <audio src={item.url} controls />}
                    {item.type === "file" && (
                      <a href={item.url} download>
                        Download File
                      </a>
                    )}
                  </div>
                ))}
                {msg.sender._id === userId && (
                  <div className="message-actions">
                    <button onClick={() => startEditing(msg)}>Edit</button>
                    <button onClick={() => deleteMessage(msg._id, false)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.txt"
          onChange={handleFileChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="dm-section">
        <h2>Direct Messages</h2>
        <input
          value={dmRecipient}
          onChange={(e) => setDmRecipient(e.target.value)}
          placeholder="Recipient User ID"
        />
        <button onClick={loadDirectMessages}>Load DMs</button>
        {dmMessages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sender}:</strong>{" "}
            {editingMessage === msg._id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit message..."
                />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.txt"
                  onChange={(e) => setEditFiles([...e.target.files])}
                />
                <button onClick={() => editMessage(msg._id, true)}>Save</button>
                <button onClick={() => setEditingMessage(null)}>Cancel</button>
              </>
            ) : (
              <>
                {msg.content} {msg.isEdited && <small>(Edited)</small>}
                {msg.media.map((item, idx) => (
                  <div key={idx}>
                    {item.type === "image" && (
                      <img
                        src={item.url}
                        alt="media"
                        style={{ maxWidth: "200px" }}
                      />
                    )}
                    {item.type === "video" && (
                      <video
                        src={item.url}
                        controls
                        style={{ maxWidth: "200px" }}
                      />
                    )}
                    {item.type === "audio" && <audio src={item.url} controls />}
                    {item.type === "file" && (
                      <a href={item.url} download>
                        Download File
                      </a>
                    )}
                  </div>
                ))}
                {msg.sender === userId && (
                  <div className="message-actions">
                    <button onClick={() => startEditing(msg)}>Edit</button>
                    <button onClick={() => deleteMessage(msg._id, true)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.txt"
          onChange={handleFileChange}
        />
        <button onClick={sendDirectMessageHandler}>Send DM</button>
      </div>
    </div>
  );
};

export default ChatClient;
