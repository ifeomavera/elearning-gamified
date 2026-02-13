import axios from 'axios';

// Use the environment variable we fixed earlier
const API_URL = import.meta.env.VITE_API_URL;

// Helper to get the token from localStorage
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { headers: { Authorization: `Bearer ${user?.token}` } }; // Adjust if your token is stored differently
};

export const socialApi = {
  // Send a Friend Request
  sendRequest: async (fromId, toId) => {
    return axios.post(`${API_URL}/api/social/request`, { fromId, toId }, getAuthHeader());
  },

  // Accept or Reject a Request
  respondToRequest: async (userId, requesterId, action) => { // action = 'accept' or 'reject'
    return axios.post(`${API_URL}/api/social/respond`, { userId, requesterId, action }, getAuthHeader());
  },

  // Get Chat History
  getMessages: async (user1, user2) => {
    return axios.get(`${API_URL}/api/social/chat/${user1}/${user2}`, getAuthHeader());
  },

  // Send a Message
  sendMessage: async (sender, recipient, content) => {
    return axios.post(`${API_URL}/api/social/message`, { sender, recipient, content }, getAuthHeader());
  }
};