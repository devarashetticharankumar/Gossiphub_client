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
//   const response = await fetch(`${API_URL}/posts`);
//   return handleResponse(response);
// };

// export const getPostById = async (postId) => {
//   const response = await fetch(`${API_URL}/posts/${postId}`);
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
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const updateUserProfile = async (data) => {
//   const response = await fetch(`${API_URL}/users/profile`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: data,
//   });
//   return handleResponse(response);
// };

// export const deletePost = async (postId) => {
//   const response = await fetch(
//     `${import.meta.env.VITE_API_URL}/posts/${postId}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }
//   );
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to delete post");
//   }
//   return response.json();
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

// // New functions for followers and following
// export const getFollowers = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/followers`, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const getFollowing = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/following`, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
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
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// // New function to add reactions to comments
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

// // New function to fetch a list of users (for suggested users)
// export const getUsers = async () => {
//   const response = await fetch(`${API_URL}/users`, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// // Chat APIs
// export const getChats = async () => {
//   const response = await fetch(`${API_URL}/chats/chats`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const getMessages = async (userId) => {
//   const response = await fetch(`${API_URL}/chats/messages/${userId}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const sendMessage = async (receiverId, data) => {
//   const response = await fetch(`${API_URL}/chats/send/${receiverId}`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: data, // Supports FormData for text and media
//   });
//   return handleResponse(response);
// };

// export const markMessageAsRead = async (messageId) => {
//   const response = await fetch(`${API_URL}/chats/messages/${messageId}/read`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const deleteMessage = async (messageId) => {
//   const response = await fetch(`${API_URL}/chats/messages/${messageId}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const reportMessage = async (messageId, data) => {
//   const response = await fetch(`${API_URL}/chats/report/${messageId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// };

// export const blockUser = async (userId) => {
//   const response = await fetch(`${API_URL}/chats/block/${userId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const unblockUser = async (userId) => {
//   const response = await fetch(`${API_URL}/chats/unblock/${userId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return handleResponse(response);
};

export const getPostById = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`);
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

// Chat APIs
export const getChats = async () => {
  const response = await fetch(`${API_URL}/chats/chats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const getMessages = async (userId) => {
  const response = await fetch(`${API_URL}/chats/messages?userId=${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const sendMessage = async (receiverId, data) => {
  const response = await fetch(`${API_URL}/chats/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: data, // Supports FormData for text and media
  });
  return handleResponse(response);
};

export const markMessageAsRead = async (messageId) => {
  const response = await fetch(`${API_URL}/chats/messages/${messageId}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const deleteMessage = async (messageId) => {
  const response = await fetch(`${API_URL}/chats/messages/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(response);
};

export const reportMessage = async (messageId, data) => {
  const response = await fetch(`${API_URL}/chats/report/${messageId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const blockUser = async (userId) => {
  const response = await fetch(`${API_URL}/chats/block/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const unblockUser = async (userId) => {
  const response = await fetch(`${API_URL}/chats/unblock/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const editMessage = async (messageId, data) => {
  const response = await fetch(`${API_URL}/chats/messages/${messageId}/edit`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const replyToMessage = async (receiverId, data) => {
  const response = await fetch(
    `${API_URL}/chats/messages/${receiverId}/reply`,
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

export const forwardMessage = async (data) => {
  const response = await fetch(`${API_URL}/chats/messages/forward`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const starMessage = async (messageId) => {
  const response = await fetch(`${API_URL}/chats/messages/${messageId}/star`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////04-06-2025 # hastag implemented code

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
//   const response = await fetch(`${API_URL}/posts`);
//   return handleResponse(response);
// };

// export const getTrendingShorts = async () => {
//   const response = await fetch(`${API_URL}/posts/trending-shorts`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return handleResponse(response);
// };

// export const getPostById = async (postId) => {
//   const response = await fetch(`${API_URL}/posts/${postId}`);
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
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const updateUserProfile = async (data) => {
//   const response = await fetch(`${API_URL}/users/profile`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: data,
//   });
//   return handleResponse(response);
// };

// export const deletePost = async (postId) => {
//   const response = await fetch(
//     `${import.meta.env.VITE_API_URL}/posts/${postId}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }
//   );
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to delete post");
//   }
//   return response.json();
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

// // New functions for followers and following
// export const getFollowers = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/followers`, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// export const getFollowing = async (userId) => {
//   const response = await fetch(`${API_URL}/users/${userId}/following`, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
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
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };

// // New function to add reactions to comments
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

// // New function to fetch a list of users (for suggested users)
// export const getUsers = async () => {
//   const response = await fetch(`${API_URL}/users`, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   return handleResponse(response);
// };
