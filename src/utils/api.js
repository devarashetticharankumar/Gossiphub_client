const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const register = async (data) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const login = async (data) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// export const getPosts = async () => {
//   const response = await fetch(`${API_URL}/posts`);
//   return handleResponse(response);
// };

export const getPostById = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`);
  return handleResponse(response);
};

// New function for fetching posts by category
export const getPostsByCategory = async (
  category,
  { page = 1, limit = 5, search = "" } = {}
) => {
  const query = new URLSearchParams({ page, limit });
  if (search) query.append("search", search);
  const response = await fetch(
    `${API_URL}/posts/category/${encodeURIComponent(
      category
    )}?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return handleResponse(response);
};

export const createPost = async (data) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data,
  });
  return handleResponse(response);
};

export const updatePost = async (postId, data) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data,
  });
  return handleResponse(response);
};

// Hashtag APIs
export const getHashtags = async () => {
  const response = await fetch(`${API_URL}/posts/hashtags`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

// export const getPostsByHashtag = async (hashtag) => {
//   const response = await fetch(`${API_URL}/posts/hashtag/${hashtag}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// In your API utility file (e.g., api.js)

// Existing getPosts function, updated to include pagination

////////////////////////////////////////////////////////////////////////////////////////
// export const getPosts = async ({ page = 1, limit = 5, hashtag = "" } = {}) => {
//   const query = new URLSearchParams({ page, limit });
//   if (hashtag) query.append("hashtag", hashtag);
//   const response = await fetch(`${API_URL}/posts?${query.toString()}`);
//   return handleResponse(response);
// };
export const getPosts = async ({
  page = 1,
  limit = 5,
  hashtag = "",
  search = "",
} = {}) => {
  const query = new URLSearchParams({ page, limit });

  if (hashtag) query.append("hashtag", hashtag);
  if (search) query.append("search", search);

  const response = await fetch(`${API_URL}/posts?${query.toString()}`);
  return handleResponse(response);
};
// New function for fetching posts by hashtag
export const getPostsByHashtag = async (
  hashtag,
  { page = 1, limit = 5 } = {}
) => {
  const query = new URLSearchParams({ page, limit });
  const response = await fetch(
    `${API_URL}/posts/hashtag/${hashtag}?${query.toString()}`
  );
  return handleResponse(response);
};

export const addReaction = async (postId, data) => {
  const response = await fetch(`${API_URL}/posts/${postId}/reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const addComment = async (postId, data) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const moderatePost = async (postId, data) => {
  const response = await fetch(`${API_URL}/admin/posts/${postId}/moderate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getReports = async () => {
  const response = await fetch(`${API_URL}/admin/reports`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const resolveReport = async (reportId, data) => {
  const response = await fetch(`${API_URL}/admin/reports/${reportId}/resolve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getAnalytics = async () => {
  const response = await fetch(`${API_URL}/admin/analytics`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getUserProfile = async () => {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const updateUserProfile = async (data) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data,
  });
  return handleResponse(response);
};

export const deletePost = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const createSponsoredAd = async (data) => {
  const response = await fetch(`${API_URL}/sponsored-ads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data,
  });
  return handleResponse(response);
};

export const getSponsoredAds = async () => {
  const response = await fetch(`${API_URL}/sponsored-ads`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getFollowers = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/followers`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getFollowing = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/following`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const followUser = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const unfollowUser = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/unfollow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const getPublicUserProfile = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const addCommentReaction = async (postId, commentId, data) => {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comment/${commentId}/reaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    }
  );
  return handleResponse(response);
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

// Shorts API functions
// export const getShorts = async ({ page = 1, limit = 5 } = {}) => {
//   const query = new URLSearchParams({ page, limit });
//   const response = await fetch(`${API_URL}/shorts?${query.toString()}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };
export const getShorts = async ({ page = 1, limit = 5, authorId } = {}) => {
  const query = new URLSearchParams({ page, limit });
  if (authorId) query.append("authorId", authorId);
  const response = await fetch(`${API_URL}/shorts?${query.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getShortById = async (shortId) => {
  const response = await fetch(`${API_URL}/shorts/${shortId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const createShort = async (data) => {
  const response = await fetch(`${API_URL}/shorts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data, // FormData for file upload
  });
  return handleResponse(response);
};

export const updateShort = async (shortId, data) => {
  const response = await fetch(`${API_URL}/shorts/${shortId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data, // FormData for file upload or JSON for caption
  });
  return handleResponse(response);
};

export const deleteShort = async (shortId) => {
  const response = await fetch(`${API_URL}/shorts/${shortId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const toggleShortLike = async (shortId) => {
  const response = await fetch(`${API_URL}/shorts/${shortId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const addShortComment = async (shortId, data) => {
  const response = await fetch(`${API_URL}/shorts/${shortId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Chat APIs
export const createChatRoom = async (data) => {
  const response = await fetch(`${API_URL}/chat/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const joinChatRoom = async (roomId) => {
  const response = await fetch(`${API_URL}/chat/room/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const sendRoomMessage = async (roomId, data) => {
  const formData = new FormData();
  if (data.content) formData.append("content", data.content);
  if (data.media) {
    data.media.forEach((file) => formData.append("media", file));
  }

  const response = await fetch(`${API_URL}/chat/room/${roomId}/message`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(response);
};

export const editRoomMessage = async (roomId, messageId, data) => {
  const formData = new FormData();
  if (data.content) formData.append("content", data.content);
  if (data.media) {
    data.media.forEach((file) => formData.append("media", file));
  }

  const response = await fetch(
    `${API_URL}/chat/room/${roomId}/message/${messageId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }
  );
  return handleResponse(response);
};

export const deleteRoomMessage = async (roomId, messageId) => {
  const response = await fetch(
    `${API_URL}/chat/room/${roomId}/message/${messageId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return handleResponse(response);
};

export const sendDirectMessage = async (data) => {
  const formData = new FormData();
  formData.append("recipientId", data.recipientId);
  if (data.content) formData.append("content", data.content);
  if (data.media) {
    data.media.forEach((file) => formData.append("media", file));
  }

  const response = await fetch(`${API_URL}/chat/dm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(response);
};

export const editDirectMessage = async (recipientId, messageId, data) => {
  const formData = new FormData();
  if (data.content) formData.append("content", data.content);
  if (data.media) {
    data.media.forEach((file) => formData.append("media", file));
  }

  const response = await fetch(
    `${API_URL}/chat/dm/${recipientId}/message/${messageId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }
  );
  return handleResponse(response);
};

export const deleteDirectMessage = async (recipientId, messageId) => {
  const response = await fetch(
    `${API_URL}/chat/dm/${recipientId}/message/${messageId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return handleResponse(response);
};

export const getUserChatRooms = async () => {
  const response = await fetch(`${API_URL}/chat/rooms`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getRoomMessages = async (roomId) => {
  const response = await fetch(`${API_URL}/chat/room/${roomId}/messages`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getDirectMessages = async (recipientId) => {
  const response = await fetch(`${API_URL}/chat/dm/${recipientId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

// Story APIs
export const createStory = async (data) => {
  const response = await fetch(`${API_URL}/stories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getUserStories = async (userId) => {
  const response = await fetch(`${API_URL}/stories/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const viewStory = async (storyId, viewerId) => {
  const response = await fetch(`${API_URL}/stories/${storyId}/view`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ viewerId }),
  });
  return handleResponse(response);
};

export const reactToStory = async (storyId) => {
  const response = await fetch(`${API_URL}/stories/${storyId}/react`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const API_URL = import.meta.env.VITE_API_URL;

// const getToken = () => localStorage.getItem("token");

// const handleResponse = async (response) => {
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Request failed");
//   }
//   return data;
// };

// export const register = async (data) => {
//   const response = await fetch(`${API_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const login = async (data) => {
//   const response = await fetch(`${API_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const getPosts = async () => {
//   const response = await fetch(`${API_URL}/posts`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getPostById = async (postId) => {
//   const response = await fetch(`${API_URL}/posts/${postId}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const createPost = async (data) => {
//   const response = await fetch(`${API_URL}/posts`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${getToken()}` },
//     body: data,
//   });
//   return handleResponse(response);
// };

// export const updatePost = async (postId, data) => {
//   const response = await fetch(`${API_URL}/posts/${postId}`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${getToken()}` },
//     body: data,
//   });
//   return handleResponse(response);
// };

// export const addReaction = async (postId, data) => {
//   const response = await fetch(`${API_URL}/posts/${postId}/reaction`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const addComment = async (postId, data) => {
//   const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const moderatePost = async (postId, data) => {
//   const response = await fetch(`${API_URL}/admin/posts/${postId}/moderate`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const getReports = async () => {
//   const response = await fetch(`${API_URL}/admin/reports`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const resolveReport = async (reportId, data) => {
//   const response = await fetch(`${API_URL}/admin/reports/${reportId}/resolve`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const getAnalytics = async () => {
//   const response = await fetch(`${API_URL}/admin/analytics`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getNotifications = async () => {
//   const response = await fetch(`${API_URL}/notifications`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getUserProfile = async () => {
//   const response = await fetch(`${API_URL}/users/me`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const updateUserProfile = async (data) => {
//   const response = await fetch(`${API_URL}/users/profile`, {
//     method: "PATCH",
//     headers: { Authorization: `Bearer ${getToken()}` },
//     body: data,
//   });
//   return handleResponse(response);
// };

// export const deletePost = async (postId) => {
//   const response = await fetch(`${API_URL}/posts/${postId}`, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const createSponsoredAd = async (data) => {
//   const response = await fetch(`${API_URL}/sponsored-ads`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${getToken()}` },
//     body: data,
//   });
//   return handleResponse(response);
// };

// export const getSponsoredAds = async () => {
//   const response = await fetch(`${API_URL}/sponsored-ads`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getFollowers = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/followers`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getFollowing = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/following`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const followUser = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/follow`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const unfollowUser = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/unfollow`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const getPublicUserProfile = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const addCommentReaction = async (postId, commentId, data) => {
//   const response = await fetch(
//     `${API_URL}/posts/${postId}/comment/${commentId}/reaction`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );
//   return handleResponse(response);
// };

// export const getUsers = async () => {
//   const response = await fetch(`${API_URL}/users`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// // Chat APIs
// export const createChatRoom = async (data) => {
//   const response = await fetch(`${API_URL}/chat/room`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const joinChatRoom = async (roomId) => {
//   const response = await fetch(`${API_URL}/chat/room/${roomId}/join`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const sendRoomMessage = async (roomId, data) => {
//   const formData = new FormData();
//   if (data.content) formData.append("content", data.content);
//   if (data.media) {
//     data.media.forEach((file) => formData.append("media", file));
//   }

//   const response = await fetch(`${API_URL}/chat/room/${roomId}/message`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${getToken()}` },
//     body: formData,
//   });
//   return handleResponse(response);
// };

// export const editRoomMessage = async (roomId, messageId, data) => {
//   const formData = new FormData();
//   if (data.content) formData.append("content", data.content);
//   if (data.media) {
//     data.media.forEach((file) => formData.append("media", file));
//   }

//   const response = await fetch(
//     `${API_URL}/chat/room/${roomId}/message/${messageId}`,
//     {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${getToken()}` },
//       body: formData,
//     }
//   );
//   return handleResponse(response);
// };

// export const deleteRoomMessage = async (roomId, messageId) => {
//   const response = await fetch(
//     `${API_URL}/chat/room/${roomId}/message/${messageId}`,
//     {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }
//   );
//   return handleResponse(response);
// };

// export const sendDirectMessage = async (data) => {
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     throw new Error("Sender ID is missing. Please log in again.");
//   }

//   const formData = new FormData();
//   formData.append("senderId", userId);
//   formData.append("recipientId", data.recipientId);
//   if (data.content) formData.append("content", data.content);
//   if (data.media) {
//     data.media.forEach((file) => formData.append("media", file));
//   }

//   const response = await fetch(`${API_URL}/chat/dm`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${getToken()}` },
//     body: formData,
//   });
//   return handleResponse(response);
// };

// export const editDirectMessage = async (recipientId, messageId, data) => {
//   const formData = new FormData();
//   if (data.content) formData.append("content", data.content);
//   if (data.media) {
//     data.media.forEach((file) => formData.append("media", file));
//   }

//   const response = await fetch(
//     `${API_URL}/chat/dm/${recipientId}/message/${messageId}`,
//     {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${getToken()}` },
//       body: formData,
//     }
//   );
//   return handleResponse(response);
// };

// export const deleteDirectMessage = async (recipientId, messageId) => {
//   const response = await fetch(
//     `${API_URL}/chat/dm/${recipientId}/message/${messageId}`,
//     {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }
//   );
//   return handleResponse(response);
// };

// export const getUserChatRooms = async () => {
//   const response = await fetch(`${API_URL}/chat/rooms`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getRoomMessages = async (roomId) => {
//   const response = await fetch(`${API_URL}/chat/room/${roomId}/messages`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getDirectMessages = async (recipientId) => {
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     throw new Error("Sender ID is missing. Please log in again.");
//   }

//   const response = await fetch(
//     `${API_URL}/chat/dm/${recipientId}?senderId=${userId}`,
//     {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }
//   );
//   return handleResponse(response);
// };

// // Story APIs
// export const createStory = async (data) => {
//   const response = await fetch(`${API_URL}/stories`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const getUserStories = async (userId) => {
//   const response = await fetch(`${API_URL}/stories/${userId}`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const viewStory = async (storyId, viewerId) => {
//   const response = await fetch(`${API_URL}/stories/${storyId}/view`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({ viewerId }),
//   });
//   return handleResponse(response);
// };

// export const reactToStory = async (storyId) => {
//   const response = await fetch(`${API_URL}/stories/${storyId}/react`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// // Hashtag APIs
// export const getHashtags = async () => {
//   const response = await fetch(`${API_URL}/posts/hashtags`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getPostsByHashtag = async (hashtag) => {
//   const response = await fetch(`${API_URL}/posts/hashtag/${hashtag}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };
